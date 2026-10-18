ALTER TABLE ledger_transactions ADD COLUMN payment_method TEXT NOT NULL DEFAULT '' CHECK(payment_method IN ('','Cash','Cheque','Bank transfer'));
CREATE TABLE cash_settings(id INTEGER PRIMARY KEY CHECK(id=1),data TEXT NOT NULL CHECK(json_valid(data)));
INSERT INTO cash_settings VALUES(1,'null');
CREATE TABLE cash_movements(id TEXT PRIMARY KEY NOT NULL,date TEXT NOT NULL,description TEXT NOT NULL,category TEXT NOT NULL,in_paisa INTEGER NOT NULL CHECK(in_paisa>=0 AND in_paisa<=100000000000),out_paisa INTEGER NOT NULL CHECK(out_paisa>=0 AND out_paisa<=100000000000),source_type TEXT NOT NULL CHECK(source_type IN ('manual','customer','supplier')),source_id TEXT NOT NULL,account_name TEXT NOT NULL,created_at TEXT NOT NULL,voided INTEGER NOT NULL DEFAULT 0 CHECK(voided IN (0,1)),CHECK((in_paisa>0 AND out_paisa=0) OR (out_paisa>0 AND in_paisa=0)));
CREATE INDEX cash_by_date ON cash_movements(date,created_at,id);
CREATE TABLE cash_closings(date TEXT PRIMARY KEY NOT NULL,expected_paisa INTEGER NOT NULL,counted_paisa INTEGER NOT NULL CHECK(counted_paisa>=0),signature TEXT NOT NULL,note TEXT NOT NULL,closed_at TEXT NOT NULL);
CREATE TRIGGER cash_customer_insert AFTER INSERT ON ledger_transactions WHEN NOT EXISTS(SELECT 1 FROM restore_requests) BEGIN
 UPDATE cash_movements SET voided=1 WHERE id='customer:'||NEW.id;
INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided)
 SELECT 'customer:'||NEW.id,NEW.date,NEW.description,CASE WHEN NEW.credit_paisa>0 THEN 'Customer receipt' ELSE 'Customer refund' END,NEW.credit_paisa,NEW.debit_paisa,'customer',NEW.id,COALESCE((SELECT name FROM parties WHERE id=NEW.party_id),''),NEW.created_at,0 WHERE NEW.payment_method='Cash'
 ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,category=excluded.category,in_paisa=excluded.in_paisa,out_paisa=excluded.out_paisa,account_name=excluded.account_name,voided=0;
END;
CREATE TRIGGER cash_customer_update AFTER UPDATE ON ledger_transactions WHEN NOT EXISTS(SELECT 1 FROM restore_requests) BEGIN
 UPDATE cash_movements SET voided=1 WHERE id='customer:'||NEW.id;
INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided)
 SELECT 'customer:'||NEW.id,NEW.date,NEW.description,CASE WHEN NEW.credit_paisa>0 THEN 'Customer receipt' ELSE 'Customer refund' END,NEW.credit_paisa,NEW.debit_paisa,'customer',NEW.id,COALESCE((SELECT name FROM parties WHERE id=NEW.party_id),''),NEW.created_at,0 WHERE NEW.payment_method='Cash'
 ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,category=excluded.category,in_paisa=excluded.in_paisa,out_paisa=excluded.out_paisa,account_name=excluded.account_name,voided=0;
END;
CREATE TRIGGER cash_supplier_insert AFTER INSERT ON supplier_transactions WHEN NOT EXISTS(SELECT 1 FROM restore_requests) BEGIN
 UPDATE cash_movements SET voided=1 WHERE id='supplier:'||NEW.id;
INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided)
 SELECT 'supplier:'||NEW.id,NEW.date,NEW.description,'Supplier payment',0,NEW.debit_paisa,'supplier',NEW.id,COALESCE((SELECT name FROM suppliers WHERE id=NEW.party_id),''),NEW.created_at,0 WHERE NEW.payment_method='Cash' AND NEW.entry_type='payment'
 ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,category=excluded.category,in_paisa=excluded.in_paisa,out_paisa=excluded.out_paisa,account_name=excluded.account_name,voided=0;
END;
CREATE TRIGGER cash_supplier_update AFTER UPDATE ON supplier_transactions WHEN NOT EXISTS(SELECT 1 FROM restore_requests) BEGIN
 UPDATE cash_movements SET voided=1 WHERE id='supplier:'||NEW.id;
INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided)
 SELECT 'supplier:'||NEW.id,NEW.date,NEW.description,'Supplier payment',0,NEW.debit_paisa,'supplier',NEW.id,COALESCE((SELECT name FROM suppliers WHERE id=NEW.party_id),''),NEW.created_at,0 WHERE NEW.payment_method='Cash' AND NEW.entry_type='payment'
 ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,category=excluded.category,in_paisa=excluded.in_paisa,out_paisa=excluded.out_paisa,account_name=excluded.account_name,voided=0;
END;
DROP TRIGGER save_supplier_bill;
CREATE TRIGGER save_supplier_bill AFTER INSERT ON supplier_bill_requests BEGIN
 SELECT CASE WHEN EXISTS(SELECT 1 FROM supplier_transactions WHERE group_id=json_extract(NEW.payload,'$.group_id') AND party_id<>json_extract(NEW.payload,'$.party_id')) THEN RAISE(ABORT,'Bill belongs to another supplier') END;
 UPDATE cash_movements SET voided=1 WHERE source_type='supplier' AND source_id IN (SELECT id FROM supplier_transactions WHERE group_id=json_extract(NEW.payload,'$.group_id') AND party_id=json_extract(NEW.payload,'$.party_id'));
 DELETE FROM supplier_transactions WHERE group_id=json_extract(NEW.payload,'$.group_id') AND party_id=json_extract(NEW.payload,'$.party_id');
INSERT INTO supplier_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,group_id,entry_type,unit,payment_method,reference)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),json_extract(value,'$.group_id'),json_extract(value,'$.entry_type'),json_extract(value,'$.unit'),json_extract(value,'$.payment_method'),json_extract(value,'$.reference') FROM json_each(NEW.payload,'$.transactions');
 DELETE FROM supplier_bill_requests WHERE id=NEW.id;
END;

INSERT INTO cash_movements SELECT 'supplier:'||t.id,t.date,t.description,'Supplier payment',0,t.debit_paisa,'supplier',t.id,s.name,t.created_at,0 FROM supplier_transactions t JOIN suppliers s ON s.id=t.party_id WHERE t.entry_type='payment' AND t.payment_method='Cash';
DROP TRIGGER restore_snapshot;
CREATE TRIGGER restore_snapshot AFTER INSERT ON restore_requests BEGIN
  DELETE FROM ledger_transactions;
  DELETE FROM parties;
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa,archived)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa'),COALESCE(json_extract(value,'$.archived'),0)
    FROM json_each(NEW.payload,'$.parties');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,payment_method)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),COALESCE(json_extract(value,'$.payment_method'),'')
    FROM json_each(NEW.payload,'$.transactions');
  UPDATE shop_profile SET data = json_extract(NEW.payload,'$.profile') WHERE id = 1 AND json_type(NEW.payload,'$.profile') = 'object';
 DELETE FROM supplier_transactions WHERE json_type(NEW.payload,'$.suppliers')='array';
 DELETE FROM suppliers WHERE json_type(NEW.payload,'$.suppliers')='array';
 INSERT INTO suppliers (id,name,phone,address,opening_date,opening_paisa,archived,contact_person)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa'),COALESCE(json_extract(value,'$.archived'),0),json_extract(value,'$.contact_person') FROM json_each(NEW.payload,'$.suppliers');
INSERT INTO supplier_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,group_id,entry_type,unit,payment_method,reference)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),json_extract(value,'$.group_id'),json_extract(value,'$.entry_type'),json_extract(value,'$.unit'),json_extract(value,'$.payment_method'),json_extract(value,'$.reference') FROM json_each(NEW.payload,'$.supplierTransactions');
 DELETE FROM cash_movements WHERE json_type(NEW.payload,'$.cash')='object';
 DELETE FROM cash_closings WHERE json_type(NEW.payload,'$.cash')='object';
 UPDATE cash_settings SET data=COALESCE(json_extract(NEW.payload,'$.cash.settings'),'null') WHERE id=1 AND json_type(NEW.payload,'$.cash')='object';
 INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided) SELECT json_extract(value,'$.id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.category'),json_extract(value,'$.in_paisa'),json_extract(value,'$.out_paisa'),json_extract(value,'$.source_type'),json_extract(value,'$.source_id'),json_extract(value,'$.account_name'),json_extract(value,'$.created_at'),json_extract(value,'$.voided') FROM json_each(NEW.payload,'$.cash.movements');
 INSERT INTO cash_closings(date,expected_paisa,counted_paisa,signature,note,closed_at) SELECT json_extract(value,'$.date'),json_extract(value,'$.expected_paisa'),json_extract(value,'$.counted_paisa'),json_extract(value,'$.signature'),json_extract(value,'$.note'),json_extract(value,'$.closed_at') FROM json_each(NEW.payload,'$.cash.closings');
  DELETE FROM restore_requests WHERE id = NEW.id;
END;


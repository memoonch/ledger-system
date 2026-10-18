CREATE TABLE suppliers (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
  contact_person TEXT NOT NULL DEFAULT '',
  archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  opening_date TEXT NOT NULL CHECK(length(opening_date) = 10),
  opening_paisa INTEGER NOT NULL DEFAULT 0 CHECK(typeof(opening_paisa) = 'integer' AND abs(opening_paisa) <= 100000000000)
);
CREATE TABLE supplier_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  party_id TEXT NOT NULL REFERENCES suppliers(id) ON DELETE RESTRICT,
  date TEXT NOT NULL CHECK(length(date) = 10),
  description TEXT NOT NULL CHECK(length(trim(description)) BETWEEN 1 AND 240),
  brand TEXT NOT NULL DEFAULT '',
  vehicle_number TEXT NOT NULL DEFAULT '',
  bill_number TEXT NOT NULL DEFAULT '',
  quantity_milli INTEGER NOT NULL DEFAULT 0 CHECK(typeof(quantity_milli) = 'integer' AND quantity_milli BETWEEN 0 AND 100000000000),
  rate_paisa INTEGER NOT NULL DEFAULT 0 CHECK(typeof(rate_paisa) = 'integer' AND rate_paisa BETWEEN 0 AND 100000000000),
  debit_paisa INTEGER NOT NULL DEFAULT 0 CHECK(typeof(debit_paisa) = 'integer' AND debit_paisa BETWEEN 0 AND 100000000000),
  credit_paisa INTEGER NOT NULL DEFAULT 0 CHECK(typeof(credit_paisa) = 'integer' AND credit_paisa BETWEEN 0 AND 100000000000),
  created_at TEXT NOT NULL,
  group_id TEXT NOT NULL CHECK(length(group_id)>0),
  entry_type TEXT NOT NULL CHECK(entry_type IN ('purchase','payment','return')),
  unit TEXT NOT NULL DEFAULT '',
  payment_method TEXT NOT NULL DEFAULT '' CHECK(payment_method IN ('','Cash','Cheque','Bank transfer')),
  reference TEXT NOT NULL DEFAULT '',
  CHECK((entry_type='purchase' AND credit_paisa>0) OR (entry_type IN ('payment','return') AND debit_paisa>0)),
  CHECK((debit_paisa > 0 AND credit_paisa = 0) OR (credit_paisa > 0 AND debit_paisa = 0))
);
CREATE INDEX supplier_party_date ON supplier_transactions(party_id, date, created_at, id);
CREATE TRIGGER supplier_date_insert BEFORE INSERT ON supplier_transactions BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM suppliers WHERE id = NEW.party_id AND opening_date <= NEW.date)
  THEN RAISE(ABORT, 'Transaction date precedes opening balance or customer is missing') END;
END;
CREATE TRIGGER supplier_date_update BEFORE UPDATE ON supplier_transactions BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM suppliers WHERE id = NEW.party_id AND opening_date <= NEW.date)
  THEN RAISE(ABORT, 'Transaction date precedes opening balance or customer is missing') END;
END;
CREATE TRIGGER supplier_opening_date_update BEFORE UPDATE OF opening_date ON suppliers BEGIN
  SELECT CASE WHEN EXISTS(SELECT 1 FROM supplier_transactions WHERE party_id = OLD.id AND date < NEW.opening_date)
  THEN RAISE(ABORT, 'Opening date is after an existing transaction') END;
END;

CREATE INDEX supplier_bill_group ON supplier_transactions(group_id);
CREATE TRIGGER delete_supplier_ledger BEFORE DELETE ON suppliers BEGIN
 DELETE FROM supplier_transactions WHERE party_id=OLD.id;
END;
CREATE TABLE supplier_bill_requests (id INTEGER PRIMARY KEY, payload TEXT NOT NULL CHECK(json_valid(payload)));
CREATE TRIGGER save_supplier_bill AFTER INSERT ON supplier_bill_requests BEGIN
 SELECT CASE WHEN EXISTS(SELECT 1 FROM supplier_transactions WHERE group_id=json_extract(NEW.payload,'$.group_id') AND party_id<>json_extract(NEW.payload,'$.party_id')) THEN RAISE(ABORT,'Bill belongs to another supplier') END;
 DELETE FROM supplier_transactions WHERE group_id=json_extract(NEW.payload,'$.group_id') AND party_id=json_extract(NEW.payload,'$.party_id');
INSERT INTO supplier_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,group_id,entry_type,unit,payment_method,reference)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),json_extract(value,'$.group_id'),json_extract(value,'$.entry_type'),json_extract(value,'$.unit'),json_extract(value,'$.payment_method'),json_extract(value,'$.reference') FROM json_each(NEW.payload,'$.transactions');
 DELETE FROM supplier_bill_requests WHERE id=NEW.id;
END;

DROP TRIGGER restore_snapshot;
CREATE TRIGGER restore_snapshot AFTER INSERT ON restore_requests BEGIN
  DELETE FROM ledger_transactions;
  DELETE FROM parties;
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa,archived)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa'),COALESCE(json_extract(value,'$.archived'),0)
    FROM json_each(NEW.payload,'$.parties');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at')
    FROM json_each(NEW.payload,'$.transactions');
  UPDATE shop_profile SET data = json_extract(NEW.payload,'$.profile') WHERE id = 1 AND json_type(NEW.payload,'$.profile') = 'object';
 DELETE FROM supplier_transactions WHERE json_type(NEW.payload,'$.suppliers')='array';
 DELETE FROM suppliers WHERE json_type(NEW.payload,'$.suppliers')='array';
 INSERT INTO suppliers (id,name,phone,address,opening_date,opening_paisa,archived,contact_person)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa'),COALESCE(json_extract(value,'$.archived'),0),json_extract(value,'$.contact_person') FROM json_each(NEW.payload,'$.suppliers');
INSERT INTO supplier_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,group_id,entry_type,unit,payment_method,reference)
 SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),json_extract(value,'$.group_id'),json_extract(value,'$.entry_type'),json_extract(value,'$.unit'),json_extract(value,'$.payment_method'),json_extract(value,'$.reference') FROM json_each(NEW.payload,'$.supplierTransactions');
  DELETE FROM restore_requests WHERE id = NEW.id;
END;


---
title: "Source: src-tauri/migrations/007_customer_due_dates.sql"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/migrations/007_customer_due_dates.sql"
sha256: "8cb78d1ea84fe3801cbedf34acfa04d3e66cf7c73d2c0110c6dba28678be1c43"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/migrations/007_customer_due_dates.sql

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/migrations/007_customer_due_dates.sql`.
- SHA-256 of original file bytes: `8cb78d1ea84fe3801cbedf34acfa04d3e66cf7c73d2c0110c6dba28678be1c43`.
- Original bytes: 4370; source lines: 28.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```sql
ALTER TABLE parties ADD COLUMN opening_due_date TEXT NOT NULL DEFAULT '';
ALTER TABLE ledger_transactions ADD COLUMN due_date TEXT NOT NULL DEFAULT '';

DROP TRIGGER restore_snapshot;
CREATE TRIGGER restore_snapshot AFTER INSERT ON restore_requests BEGIN
  DELETE FROM ledger_transactions;
  DELETE FROM parties;
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa,archived,opening_due_date)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa'),COALESCE(json_extract(value,'$.archived'),0),COALESCE(json_extract(value,'$.opening_due_date'),'')
    FROM json_each(NEW.payload,'$.parties');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,payment_method,due_date)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at'),COALESCE(json_extract(value,'$.payment_method'),''),COALESCE(json_extract(value,'$.due_date'),'')
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
```

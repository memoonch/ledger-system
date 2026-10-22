---
title: "Source: src-tauri/migrations/004_customer_archive.sql"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/migrations/004_customer_archive.sql"
sha256: "1cda48800dd68745daaf2f3ce8db96ee6322ee43658e7a54d8c29416e44c133d"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/migrations/004_customer_archive.sql

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/migrations/004_customer_archive.sql`.
- SHA-256 of original file bytes: `1cda48800dd68745daaf2f3ce8db96ee6322ee43658e7a54d8c29416e44c133d`.
- Original bytes: 1672; source lines: 21.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```sql
ALTER TABLE parties ADD COLUMN archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1));

-- This trigger and the parent DELETE form one atomic statement.
CREATE TRIGGER delete_customer_ledger BEFORE DELETE ON parties BEGIN
  DELETE FROM ledger_transactions WHERE party_id=OLD.id;
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
  DELETE FROM restore_requests WHERE id = NEW.id;
END;
```

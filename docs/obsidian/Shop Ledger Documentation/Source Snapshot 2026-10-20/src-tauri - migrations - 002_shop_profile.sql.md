---
title: "Source: src-tauri/migrations/002_shop_profile.sql"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/migrations/002_shop_profile.sql"
sha256: "49ffafdf1fb5dfc5fc20a3cebe798fc61e51839a9a11ac0eef6d3b5037d9dc78"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/migrations/002_shop_profile.sql

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/migrations/002_shop_profile.sql`.
- SHA-256 of original file bytes: `49ffafdf1fb5dfc5fc20a3cebe798fc61e51839a9a11ac0eef6d3b5037d9dc78`.
- Original bytes: 1797; source lines: 20.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```sql
CREATE TABLE shop_profile (
  id INTEGER PRIMARY KEY CHECK(id = 1),
  data TEXT NOT NULL CHECK(json_valid(data) AND json_type(data) = 'object')
);
INSERT INTO shop_profile(id,data) VALUES (1,'{"name":"Shop Name","tagline":"Your business, in balance.","owner":"","phone":"","email":"","address":"","statement_note":"Thank you for your business.","descriptions":["Sale","Cash Received","Cheque Received","Bank Transfer","Carriage","Returns"],"brands":[],"vehicles":[]}');

DROP TRIGGER restore_snapshot;
CREATE TRIGGER restore_snapshot AFTER INSERT ON restore_requests BEGIN
  DELETE FROM ledger_transactions;
  DELETE FROM parties;
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa')
    FROM json_each(NEW.payload,'$.parties');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at')
    FROM json_each(NEW.payload,'$.transactions');
  UPDATE shop_profile SET data = json_extract(NEW.payload,'$.profile') WHERE id = 1 AND json_type(NEW.payload,'$.profile') = 'object';
  DELETE FROM restore_requests WHERE id = NEW.id;
END;
```

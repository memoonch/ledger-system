---
title: "Source: src-tauri/migrations/001_initial.sql"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/migrations/001_initial.sql"
sha256: "5c837f8b44922a3792ae6a8c2721b53fa93e7215b517fb8753203b0b64f66da3"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/migrations/001_initial.sql

- Captured: 2026-10-19T01:12:18+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/migrations/001_initial.sql`.
- SHA-256 of original file bytes: `5c837f8b44922a3792ae6a8c2721b53fa93e7215b517fb8753203b0b64f66da3`.
- Original bytes: 3713; source lines: 51.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```sql
CREATE TABLE parties (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL CHECK(length(trim(name)) BETWEEN 1 AND 120),
  phone TEXT NOT NULL DEFAULT '',
  address TEXT NOT NULL DEFAULT '',
  opening_date TEXT NOT NULL CHECK(length(opening_date) = 10),
  opening_paisa INTEGER NOT NULL DEFAULT 0 CHECK(typeof(opening_paisa) = 'integer' AND abs(opening_paisa) <= 100000000000)
);
CREATE TABLE ledger_transactions (
  id TEXT PRIMARY KEY NOT NULL,
  party_id TEXT NOT NULL REFERENCES parties(id) ON DELETE RESTRICT,
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
  CHECK((debit_paisa > 0 AND credit_paisa = 0) OR (credit_paisa > 0 AND debit_paisa = 0))
);
CREATE INDEX ledger_party_date ON ledger_transactions(party_id, date, created_at, id);
CREATE TRIGGER ledger_date_insert BEFORE INSERT ON ledger_transactions BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM parties WHERE id = NEW.party_id AND opening_date <= NEW.date)
  THEN RAISE(ABORT, 'Transaction date precedes opening balance or customer is missing') END;
END;
CREATE TRIGGER ledger_date_update BEFORE UPDATE ON ledger_transactions BEGIN
  SELECT CASE WHEN NOT EXISTS(SELECT 1 FROM parties WHERE id = NEW.party_id AND opening_date <= NEW.date)
  THEN RAISE(ABORT, 'Transaction date precedes opening balance or customer is missing') END;
END;
CREATE TRIGGER opening_date_update BEFORE UPDATE OF opening_date ON parties BEGIN
  SELECT CASE WHEN EXISTS(SELECT 1 FROM ledger_transactions WHERE party_id = OLD.id AND date < NEW.opening_date)
  THEN RAISE(ABORT, 'Opening date is after an existing transaction') END;
END;
-- One INSERT performs an atomic restore. A constraint failure rolls back the
-- entire statement, including deletes, without relying on pooled BEGIN/COMMIT.
CREATE TABLE restore_requests (id INTEGER PRIMARY KEY, payload TEXT NOT NULL CHECK(json_valid(payload)));
CREATE TRIGGER restore_snapshot AFTER INSERT ON restore_requests BEGIN
  DELETE FROM ledger_transactions;
  DELETE FROM parties;
  INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.name'),json_extract(value,'$.phone'),json_extract(value,'$.address'),json_extract(value,'$.opening_date'),json_extract(value,'$.opening_paisa')
    FROM json_each(NEW.payload,'$.parties');
  INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at)
    SELECT json_extract(value,'$.id'),json_extract(value,'$.party_id'),json_extract(value,'$.date'),json_extract(value,'$.description'),json_extract(value,'$.brand'),json_extract(value,'$.vehicle_number'),json_extract(value,'$.bill_number'),json_extract(value,'$.quantity_milli'),json_extract(value,'$.rate_paisa'),json_extract(value,'$.debit_paisa'),json_extract(value,'$.credit_paisa'),json_extract(value,'$.created_at')
    FROM json_each(NEW.payload,'$.transactions');
  DELETE FROM restore_requests WHERE id = NEW.id;
END;
```

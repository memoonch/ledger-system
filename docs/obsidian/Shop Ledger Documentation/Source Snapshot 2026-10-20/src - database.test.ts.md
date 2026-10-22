---
title: "Source: src/database.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/database.test.ts"
sha256: "de7010b7d62c1e3c638ba64383244936d45886fa0ba1f7629b5c9e31ca61083a"
tags: [shop-ledger, development]
---

# Source snapshot: src/database.test.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/database.test.ts`.
- SHA-256 of original file bytes: `de7010b7d62c1e3c638ba64383244936d45886fa0ba1f7629b5c9e31ca61083a`.
- Original bytes: 8028; source lines: 109.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Party, LedgerTransaction } from './domain';
const schema = readFileSync(new URL('../src-tauri/migrations/001_initial.sql', import.meta.url), 'utf8');
const profileMigration = readFileSync(new URL('../src-tauri/migrations/002_shop_profile.sql', import.meta.url), 'utf8');
const party: Party = { id:'a', name:'Customer', phone:'', address:'', opening_date:'2026-01-01', opening_paisa:100000 };
const tx: LedgerTransaction = { id:'t1', party_id:'a', date:'2026-01-02',description:'Cement',brand:'Pak Cem',vehicle_number:'',bill_number:'1',quantity_milli:1000,rate_paisa:10000,debit_paisa:10000,credit_paisa:0,created_at:'2026-01-02T00:00:00Z' };
function database() { const db = new DatabaseSync(':memory:'); db.exec('PRAGMA foreign_keys=ON;'); db.exec(schema); db.exec(profileMigration); return db; }
describe('SQLite schema and atomic restore', () => {
  it('initializes a snapshot and never retains a restore payload', () => {
    const db = database();
    db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({ parties:[party],transactions:[tx] }));
    expect(db.prepare('SELECT COUNT(*) AS n FROM parties').get()?.n).toBe(1);
    expect(db.prepare('SELECT COUNT(*) AS n FROM ledger_transactions').get()?.n).toBe(1);
    expect(db.prepare('SELECT COUNT(*) AS n FROM restore_requests').get()?.n).toBe(0);
    db.close();
  });
  it('rolls back the entire restore when even one new entry is invalid', () => {
    const db = database();
    const restore = db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');
    restore.run(JSON.stringify({parties:[party],transactions:[tx]}));
    expect(() => restore.run(JSON.stringify({parties:[{...party,name:'Changed'}],transactions:[{...tx,date:'2025-12-31'}]}))).toThrow();
    expect(db.prepare('SELECT name FROM parties').get()?.name).toBe('Customer');
    expect(db.prepare('SELECT date FROM ledger_transactions').get()?.date).toBe('2026-01-02');
    db.close();
  });
  it('guards both transaction edits and opening-date edits', () => {
    const db = database();
    db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({parties:[party],transactions:[tx]}));
    expect(() => db.exec("UPDATE ledger_transactions SET date='2025-12-31'")).toThrow();
    expect(() => db.exec("UPDATE parties SET opening_date='2026-01-03'")).toThrow();
    expect(() => db.exec('UPDATE ledger_transactions SET credit_paisa=1')).toThrow();
    db.close();
  });
});


it('upgrades an existing ledger without changing customer or transaction values', () => {
  const db = new DatabaseSync(':memory:'); db.exec(schema);
  db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({parties:[party],transactions:[tx]}));
  db.exec(profileMigration);
  expect(db.prepare('SELECT name FROM parties').get()?.name).toBe('Customer');
  expect(db.prepare('SELECT debit_paisa FROM ledger_transactions').get()?.debit_paisa).toBe(10000);
  expect(JSON.parse(db.prepare('SELECT data FROM shop_profile').get()?.data as string).name).toBe('Shop Name');
  db.close();
});
it('restores the shop profile atomically and preserves it for legacy snapshots', () => {
  const db = database();
  const initial = JSON.parse(db.prepare('SELECT data FROM shop_profile').get()?.data as string);
  const profile = {...initial,name:'Generic Hardware',brands:['New Brand']};
  const restore = db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');
  restore.run(JSON.stringify({parties:[party],transactions:[tx],profile}));
  expect(JSON.parse(db.prepare('SELECT data FROM shop_profile').get()?.data as string)).toEqual(profile);
  expect(() => restore.run(JSON.stringify({parties:[party],transactions:[{...tx,date:'2025-01-01'}],profile:{...profile,name:'Bad'}}))).toThrow();
  expect(JSON.parse(db.prepare('SELECT data FROM shop_profile').get()?.data as string).name).toBe('Generic Hardware');
  restore.run(JSON.stringify({parties:[party],transactions:[tx]}));
  expect(JSON.parse(db.prepare('SELECT data FROM shop_profile').get()?.data as string).name).toBe('Generic Hardware');
  db.close();
});

it('atomically imports a new customer without replacing existing customers and rolls back invalid batches',()=>{
 const db=database();db.exec(readFileSync(new URL('../src-tauri/migrations/003_customer_import.sql',import.meta.url),'utf8'));
 db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({parties:[party],transactions:[tx]}));
 const insert=db.prepare('INSERT INTO import_requests(payload) VALUES (?)');
 const added={...party,id:'new',name:'Imported'};const entry={...tx,id:'new-tx',party_id:'new'};
 insert.run(JSON.stringify({party:added,transactions:[entry]}));
 expect(db.prepare('SELECT COUNT(*) AS n FROM parties').get()?.n).toBe(2);
 expect(db.prepare('SELECT COUNT(*) AS n FROM ledger_transactions').get()?.n).toBe(2);
 expect(db.prepare('SELECT COUNT(*) AS n FROM import_requests').get()?.n).toBe(0);
 expect(()=>insert.run(JSON.stringify({party:{...added,id:'bad'},transactions:[{...entry,id:'bad-tx',party_id:'bad',date:'2020-01-01'}]}))).toThrow();
 expect(db.prepare('SELECT COUNT(*) AS n FROM parties').get()?.n).toBe(2);
 expect(()=>insert.run(JSON.stringify({party:added,transactions:[entry]}))).toThrow();
 db.close();
});

it('upgrades existing customers to active, preserves archive in backups, and restores legacy backups as active',()=>{
 const db=database();
 const restore=db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');
 restore.run(JSON.stringify({parties:[party],transactions:[tx]}));
 db.exec(readFileSync(new URL('../src-tauri/migrations/004_customer_archive.sql',import.meta.url),'utf8'));
 expect(db.prepare('SELECT archived FROM parties WHERE id=?').get(party.id)?.archived).toBe(0);
 db.prepare('UPDATE parties SET archived=1 WHERE id=?').run(party.id);
 expect(db.prepare('SELECT COUNT(*) AS n FROM ledger_transactions').get()?.n).toBe(1);
 const archived=db.prepare('SELECT * FROM parties').get();
 restore.run(JSON.stringify({parties:[archived],transactions:[tx]}));
 expect(db.prepare('SELECT archived FROM parties').get()?.archived).toBe(1);
 restore.run(JSON.stringify({parties:[party],transactions:[tx]}));
 expect(db.prepare('SELECT archived FROM parties').get()?.archived).toBe(0);
 expect(()=>db.exec('UPDATE parties SET archived=2')).toThrow();db.close();
});
it('permanently deletes only the chosen customer and their transactions in one statement',()=>{
 const db=database();db.exec(readFileSync(new URL('../src-tauri/migrations/004_customer_archive.sql',import.meta.url),'utf8'));
 db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({parties:[party,{...party,id:'b',archived:1}],transactions:[tx,{...tx,id:'t2',party_id:'b'}]}));
 db.prepare('DELETE FROM parties WHERE id=?').run(party.id);
 expect(db.prepare('SELECT id,archived FROM parties').all()).toEqual([{id:'b',archived:1}]);
 expect(db.prepare('SELECT id,party_id FROM ledger_transactions').all()).toEqual([{id:'t2',party_id:'b'}]);
 expect(db.prepare('SELECT COUNT(*) AS n FROM shop_profile').get()?.n).toBe(1);
 db.close();
});
it('rolls back child transaction removal if parent deletion fails',()=>{
 const db=database();db.exec(readFileSync(new URL('../src-tauri/migrations/004_customer_archive.sql',import.meta.url),'utf8'));
 db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify({parties:[party],transactions:[tx]}));
 db.exec("CREATE TRIGGER test_delete_failure AFTER DELETE ON parties BEGIN SELECT RAISE(ABORT,'test failure'); END;");
 expect(()=>db.prepare('DELETE FROM parties WHERE id=?').run(party.id)).toThrow();
 expect(db.prepare('SELECT COUNT(*) AS n FROM parties').get()?.n).toBe(1);
 expect(db.prepare('SELECT COUNT(*) AS n FROM ledger_transactions').get()?.n).toBe(1);
 db.close();
});
```

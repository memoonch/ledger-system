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

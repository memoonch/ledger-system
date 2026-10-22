---
title: "Source: src/cash.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/cash.test.ts"
sha256: "1eb8e5dc3ed9023707f8f730567245d577f5246958d1952519392af03e7d54fd"
tags: [shop-ledger, development]
---

# Source snapshot: src/cash.test.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/cash.test.ts`.
- SHA-256 of original file bytes: `1eb8e5dc3ed9023707f8f730567245d577f5246958d1952519392af03e7d54fd`.
- Original bytes: 9150; source lines: 34.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import {describe,it,expect} from 'vitest';
import {DatabaseSync} from 'node:sqlite';import {readFileSync} from 'node:fs';
import {cashDay,emptyCash,linkedCash,syncCash,validateCash,type CashMovement} from './cash';
import {backupData,decodeBackup,type LedgerTransaction} from './domain';
const tx:LedgerTransaction={id:'receipt',party_id:'c',date:'2026-01-02',description:'Payment',brand:'',vehicle_number:'',bill_number:'R1',quantity_milli:0,rate_paisa:0,debit_paisa:0,credit_paisa:100000,payment_method:'Cash',created_at:'2026-01-02T00:00:00Z'};
const manual:CashMovement={id:'expense',date:'2026-01-02',description:'Loading wages',category:'Labor wages',in_paisa:0,out_paisa:20000,source_type:'manual',source_id:'',account_name:'',created_at:'2026-01-02T01:00:00Z',voided:0};
function database(){const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;');for(const name of ['001_initial','002_shop_profile','003_customer_import','004_customer_archive','005_suppliers','006_cash_book'])db.exec(readFileSync(new URL('../src-tauri/migrations/'+name+'.sql',import.meta.url),'utf8'));return db;}
function seed(db:DatabaseSync){db.exec("INSERT INTO parties(id,name,opening_date,opening_paisa) VALUES ('c','Customer','2026-01-01',0)");db.prepare('INSERT INTO ledger_transactions(id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,payment_method) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').run(...[tx.id,tx.party_id,tx.date,tx.description,tx.brand,tx.vehicle_number,tx.bill_number,0,0,0,100000,tx.created_at,'Cash']);}
describe('daily cash book',()=>{
 it('counts only explicit cash and treats customer refunds as cash out',()=>{expect(linkedCash({...tx,payment_method:'Cheque'},'customer','C')).toBeUndefined();expect(linkedCash({...tx,payment_method:undefined},'customer','C')).toBeUndefined();expect(linkedCash(tx,'customer','C')?.in_paisa).toBe(100000);expect(linkedCash({...tx,credit_paisa:0,debit_paisa:5000},'customer','C')?.out_paisa).toBe(5000);});
 it('carries expected cash forward and excludes earlier/future/voided movements',()=>{const data={settings:{opening_date:'2026-01-02',opening_paisa:50000},movements:[linkedCash(tx,'customer','C')!,manual,{...manual,id:'past',date:'2026-01-01'},{...manual,id:'future',date:'2026-01-04'},{...manual,id:'voided',voided:1}],closings:[]};const day=cashDay(data,'2026-01-02');expect(day.expected).toBe(130000);expect(day.rows).toHaveLength(2);expect(cashDay(data,'2026-01-03').opening).toBe(130000);});
 it('detects stale closing after a backdated correction but not a future movement',()=>{const data={settings:{opening_date:'2026-01-01',opening_paisa:0},movements:[linkedCash(tx,'customer','C')!],closings:[]};const day=cashDay(data,'2026-01-03');const closed={...data,closings:[{date:'2026-01-03',expected_paisa:day.expected,counted_paisa:90000,signature:day.signature,note:'Short 100',closed_at:'2026-01-03T20:00:00Z'}]};expect(cashDay(closed,'2026-01-03').stale).toBe(false);expect(cashDay({...closed,movements:[...closed.movements,manual]},'2026-01-03').stale).toBe(true);expect(cashDay({...closed,movements:[...closed.movements,{...manual,date:'2026-01-04'}]},'2026-01-03').stale).toBe(false);});
 it('synchronizes edits without duplicates and voids a reclassified noncash payment',()=>{let data=syncCash(emptyCash(),[tx],[tx.id],'customer','C');data=syncCash(data,[{...tx,credit_paisa:150000}],[tx.id],'customer','C');expect(data.movements).toHaveLength(1);expect(data.movements[0].in_paisa).toBe(150000);data=syncCash(data,[{...tx,payment_method:'Bank transfer'}],[tx.id],'customer','C');expect(data.movements[0].voided).toBe(1);});
 it('rejects invalid amounts and duplicate movements; requires drawer setup',()=>{expect(()=>validateCash({settings:null,movements:[{...manual,in_paisa:1}],closings:[]})).toThrow();expect(()=>validateCash({settings:null,movements:[manual,manual],closings:[]})).toThrow();expect(()=>cashDay(emptyCash(),'2026-01-02')).toThrow('opening balance');});
 it('writes full backup v4 and accepts older customer/supplier backups',()=>{const data={parties:[],transactions:[],cash:emptyCash()};const backup=backupData(data);expect(backup.version).toBe(5);expect(decodeBackup(JSON.stringify(backup)).cash).toEqual(emptyCash());expect(decodeBackup(JSON.stringify({format:'shop-ledger',version:3,data:{parties:[],transactions:[],suppliers:[],supplierTransactions:[]}})).cash).toBeUndefined();expect(()=>decodeBackup(JSON.stringify({format:'shop-ledger',version:4,data:{parties:[],transactions:[],suppliers:[],supplierTransactions:[]}}))).toThrow('cash book');});
});
describe('cash SQLite projections and restore',()=>{
 it('initializes cash schema without assuming old customer credits are cash',()=>{const db=database();expect(db.prepare('SELECT data FROM cash_settings').get()?.data).toBe('null');expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(0);db.close();});
 it('mirrors customer cash once, updates it, excludes cheques and preserves history on account deletion',()=>{const db=database();seed(db);expect(db.prepare('SELECT in_paisa FROM cash_movements').get()?.in_paisa).toBe(100000);db.exec("UPDATE ledger_transactions SET credit_paisa=120000 WHERE id='receipt'");expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(1);expect(db.prepare('SELECT in_paisa FROM cash_movements').get()?.in_paisa).toBe(120000);db.exec("UPDATE ledger_transactions SET payment_method='Cheque'");expect(db.prepare('SELECT voided FROM cash_movements').get()?.voided).toBe(1);db.exec("UPDATE ledger_transactions SET payment_method='Cash'");db.exec("DELETE FROM parties WHERE id='c'");expect(db.prepare('SELECT voided FROM cash_movements').get()?.voided).toBe(0);db.close();});
 it('restores cash snapshots atomically and keeps current cash for old backups',()=>{const db=database();seed(db);const restore=db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');restore.run(JSON.stringify({parties:[],transactions:[]}));expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(1);restore.run(JSON.stringify({parties:[],transactions:[],cash:emptyCash()}));expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(0);expect(db.prepare('SELECT data FROM cash_settings').get()?.data).toBe('null');expect(()=>restore.run(JSON.stringify({parties:[],transactions:[],cash:{settings:null,movements:[{...manual,in_paisa:1}],closings:[]}}))).toThrow();expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(0);db.close();});
});

it('synchronizes supplier cash payment group edits without counting cheques',()=>{
 const db=database();db.exec("INSERT INTO suppliers(id,name,opening_date,opening_paisa) VALUES ('s','Supplier','2026-01-01',0)");
 const pay={id:'p',party_id:'s',date:'2026-01-02',description:'Cash payment',brand:'',vehicle_number:'',bill_number:'',quantity_milli:0,rate_paisa:0,debit_paisa:50000,credit_paisa:0,created_at:'2026-01-02T00:00:00Z',group_id:'g',entry_type:'payment',unit:'',payment_method:'Cash',reference:''};
 const save=db.prepare('INSERT INTO supplier_bill_requests(payload) VALUES (?)');save.run(JSON.stringify({party_id:'s',group_id:'g',transactions:[pay]}));expect(db.prepare('SELECT out_paisa FROM cash_movements').get()?.out_paisa).toBe(50000);
 save.run(JSON.stringify({party_id:'s',group_id:'g',transactions:[{...pay,debit_paisa:70000}]}));expect(db.prepare('SELECT count(*) AS n FROM cash_movements').get()?.n).toBe(1);expect(db.prepare('SELECT out_paisa FROM cash_movements').get()?.out_paisa).toBe(70000);
 save.run(JSON.stringify({party_id:'s',group_id:'g',transactions:[{...pay,payment_method:'Cheque',reference:'CHQ-1'}]}));expect(db.prepare('SELECT voided FROM cash_movements').get()?.voided).toBe(1);db.close();
});
it('backfills only previously explicit supplier cash on migration, excluding unspecified customer credits',()=>{
 const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;');for(const name of ['001_initial','002_shop_profile','003_customer_import','004_customer_archive','005_suppliers'])db.exec(readFileSync(new URL('../src-tauri/migrations/'+name+'.sql',import.meta.url),'utf8'));
 db.exec("INSERT INTO suppliers(id,name,opening_date,opening_paisa) VALUES ('s','Supplier','2026-01-01',0);INSERT INTO supplier_transactions(id,party_id,date,description,debit_paisa,created_at,group_id,entry_type,payment_method) VALUES ('p','s','2026-01-02','Cash paid',50000,'2026-01-02T00:00:00Z','g','payment','Cash');INSERT INTO parties(id,name,opening_date,opening_paisa) VALUES ('c','Customer','2026-01-01',0);INSERT INTO ledger_transactions(id,party_id,date,description,credit_paisa,created_at) VALUES ('old','c','2026-01-02','Cash received maybe',100000,'2026-01-02T00:00:00Z');");
 db.exec(readFileSync(new URL('../src-tauri/migrations/006_cash_book.sql',import.meta.url),'utf8'));expect(db.prepare('SELECT source_type FROM cash_movements').all()).toEqual([{source_type:'supplier'}]);expect(db.prepare('SELECT payment_method FROM ledger_transactions').get()?.payment_method).toBe('');db.close();
});
```

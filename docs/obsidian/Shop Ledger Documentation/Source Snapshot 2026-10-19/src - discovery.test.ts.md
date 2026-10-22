---
title: "Source: src/discovery.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/discovery.test.ts"
sha256: "da320894574baca1065022ea385bd280273789a203220fbf008aad9189be31d5"
tags: [shop-ledger, development]
---

# Source snapshot: src/discovery.test.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/discovery.test.ts`.
- SHA-256 of original file bytes: `da320894574baca1065022ea385bd280273789a203220fbf008aad9189be31d5`.
- Original bytes: 6477; source lines: 21.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import {describe,it,expect} from 'vitest';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {buildSearchIndex,searchRecords,outstandingDues,sortDues} from './discovery';
import {ledger,validateParty,validateTransaction,backupData,decodeBackup,type Party,type LedgerTransaction,type Store} from './domain';
const p:Party={id:'a',name:'Áli Customer',phone:'0300-1234567',address:'',opening_date:'2026-01-01',opening_paisa:10000,opening_due_date:'2026-01-10'};
const tx=(id:string,date:string,debit:number,credit=0):LedgerTransaction=>({id,party_id:'a',date,description:'Cement',brand:'Pak Cem',bill_number:'B-120',vehicle_number:'ABC-123',quantity_milli:0,rate_paisa:0,debit_paisa:debit,credit_paisa:credit,created_at:date+'T12:00:00Z'});
describe('global search',()=>{
 it('finds normalized names, phone, punctuated bill and vehicle across archived customers and suppliers',()=>{const s:Store={parties:[{...p,archived:1}],transactions:[tx('t','2026-01-02',100)],suppliers:[{...p,id:'s',name:'Steel Mill',contact_person:'Usman'}],supplierTransactions:[{...tx('st','2026-01-03',0,100),party_id:'s',group_id:'g',entry_type:'purchase',unit:'bags',payment_method:'',reference:''}]};const index=buildSearchIndex(s);expect(searchRecords(index,'ali').hits[0].kind).toBe('customer');expect(searchRecords(index,'03001234567').hits[0].accountId).toBe('a');expect(searchRecords(index,'b120','bills').total).toBe(2);expect(searchRecords(index,'abc123','vehicles').total).toBe(2);expect(searchRecords(index,'steel abc123','suppliers').hits[0].accountId).toBe('s');expect(searchRecords(index,'Usman').total).toBe(1);expect(searchRecords(index,'ali','customers').hits.every(h=>h.archived)).toBe(true);});
 it('limits large result lists without hiding the total, and ignores empty searches and voided cash',()=>{const index=buildSearchIndex({parties:[p],transactions:Array.from({length:70},(_,i)=>tx('t'+i,'2026-01-02',100))});expect(searchRecords(index,'cement').hits).toHaveLength(50);expect(searchRecords(index,'cement').total).toBe(70);expect(searchRecords(index,'   ').total).toBe(0);expect(searchRecords(index,'absent').total).toBe(0);});
 it('preserves Urdu names and exact bill matches before partial matches',()=>{const index=buildSearchIndex({parties:[{...p,name:'علی'}],transactions:[{...tx('1','2026-01-02',100),bill_number:'B-1209'},{...tx('2','2026-01-01',100),bill_number:'B-120'}]});expect(searchRecords(index,'علی').total).toBe(3);expect(searchRecords(index,'B120').hits[0].entryId).toBe('2');});
});
describe('collections aging',()=>{
 it('reduces oldest charges first, including partial settlement of a dated opening',()=>{const s={parties:[p],transactions:[{...tx('1','2026-01-02',20000),due_date:'2026-01-20'},tx('2','2026-01-03',0,15000)]};const [r]=outstandingDues(s,'2026-02-01');expect(r).toMatchObject({balance:15000,oldestCharge:'2026-01-02',oldestDue:'2026-01-20',overdue:15000,ageDays:30,daysOverdue:12});expect(r.balance).toBe(ledger(p,s.transactions,'','2026-02-01').closing);});
 it('applies opening advances and overpayments to later charges without negative dues',()=>{const s={parties:[{...p,opening_paisa:-10000,opening_due_date:''}],transactions:[tx('1','2026-01-02',5000),tx('2','2026-01-03',20000),tx('3','2026-01-04',0,20000),tx('4','2026-01-05',10000)]};expect(outstandingDues(s,'2026-01-04')).toEqual([]);expect(outstandingDues(s,'2026-01-05')[0]).toMatchObject({balance:5000,oldestCharge:'2026-01-05',overdue:0,oldestDue:''});});
 it('excludes future charges and openings but includes archived debt; today is not overdue',()=>{const s={parties:[{...p,archived:1}, {...p,id:'future',opening_date:'2027-01-01'}],transactions:[{...tx('1','2026-01-02',5000),due_date:'2026-01-10'},tx('2','2027-01-01',90000)]};expect(outstandingDues(s,'2026-01-10')).toHaveLength(1);expect(outstandingDues(s,'2026-01-10')[0]).toMatchObject({balance:15000,overdue:0,daysOverdue:0});expect(()=>outstandingDues(s,'bad')).toThrow();});
 it('sorts largest balance, oldest charge, or real due dates with undated balances last',()=>{const rows=outstandingDues({parties:[p,{...p,id:'b',name:'B',opening_paisa:50000,opening_date:'2026-01-02',opening_due_date:''},{...p,id:'c',name:'C',opening_date:'2026-01-03',opening_due_date:'2026-01-05'}],transactions:[]},'2026-02-01');expect(sortDues(rows,'balance')[0].party.id).toBe('b');expect(sortDues(rows,'due').map(r=>r.party.id)).toEqual(['c','a','b']);expect(sortDues(rows,'age')[0].party.id).toBe('a');});
 it('validates optional due dates only on customer debit charges and debit openings',()=>{expect(()=>validateParty({...p,opening_paisa:-100},[])).toThrow();expect(()=>validateParty({...p,opening_due_date:'2025-01-01'},[])).toThrow();expect(()=>validateTransaction({...tx('1','2026-01-02',100),due_date:'2026-01-01'},p)).toThrow();expect(()=>validateTransaction({...tx('1','2026-01-02',0,100),due_date:'2026-01-10'},p)).toThrow();expect(()=>validateTransaction({...tx('1','2026-01-02',100),payment_method:'Cash',due_date:'2026-01-10'},p)).toThrow();expect(()=>validateParty({...p,opening_due_date:''},[])).not.toThrow();});
 it('round trips due dates with full v5 backups',()=>{const s={parties:[p],transactions:[{...tx('1','2026-01-02',100),due_date:'2026-01-12'}]};expect(decodeBackup(JSON.stringify(backupData(s))).transactions[0].due_date).toBe('2026-01-12');});
});
it('migrates and restores dated and legacy backups without losing cash snapshots',()=>{const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;');for(const n of ['001_initial','002_shop_profile','003_customer_import','004_customer_archive','005_suppliers','006_cash_book','007_customer_due_dates'])db.exec(readFileSync(new URL('../src-tauri/migrations/'+n+'.sql',import.meta.url),'utf8'));const restore=db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');restore.run(JSON.stringify({parties:[p],transactions:[{...tx('1','2026-01-02',100),due_date:'2026-01-12'}]}));expect(db.prepare('SELECT opening_due_date FROM parties').get()?.opening_due_date).toBe('2026-01-10');expect(db.prepare('SELECT due_date FROM ledger_transactions').get()?.due_date).toBe('2026-01-12');const {opening_due_date,...old}=p;restore.run(JSON.stringify({parties:[old],transactions:[tx('1','2026-01-02',100)]}));expect(db.prepare('SELECT due_date FROM ledger_transactions').get()?.due_date).toBe('');expect(db.prepare('PRAGMA integrity_check').get()?.integrity_check).toBe('ok');db.close();});
```

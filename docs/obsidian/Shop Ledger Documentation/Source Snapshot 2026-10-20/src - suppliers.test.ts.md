---
title: "Source: src/suppliers.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/suppliers.test.ts"
sha256: "48d27d932ea6a613d6d1c7120b531465545eec3ef2a4abab44d3939299686013"
tags: [shop-ledger, development]
---

# Source snapshot: src/suppliers.test.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/suppliers.test.ts`.
- SHA-256 of original file bytes: `48d27d932ea6a613d6d1c7120b531465545eec3ef2a4abab44d3939299686013`.
- Original bytes: 8288; source lines: 28.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import {describe,it,expect} from 'vitest';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {backupData,decodeBackup,ledger,supplierBalanceClass,supplierBalanceLabel,validateStore,wholeMaterialAmount,type Supplier,type SupplierTransaction} from './domain';
import {statementPdf} from './pdf';
const supplier:Supplier={id:'s',name:'Cement Mill',phone:'0300',address:'Factory',contact_person:'Sales',opening_date:'2025-03-01',opening_paisa:-1000000};
const line=(id='line',group='bill'):SupplierTransaction=>({id,party_id:'s',date:'2025-03-02',description:'Cement',brand:'Pak Cem',vehicle_number:'ABC-123',bill_number:'INV-0001',quantity_milli:500000,rate_paisa:130000,debit_paisa:0,credit_paisa:65000000,created_at:'2025-03-02T00:00:00Z',group_id:group,entry_type:'purchase',unit:'bags',payment_method:'',reference:''});
const payment:SupplierTransaction={...line('pay','payment'),date:'2025-03-03',description:'Bank payment',quantity_milli:0,rate_paisa:0,unit:'',debit_paisa:40000000,credit_paisa:0,entry_type:'payment',payment_method:'Bank transfer',reference:'BANK-001',bill_number:'R-1',brand:'',vehicle_number:''};
const snapshot=(entries:SupplierTransaction[])=>({parties:[],transactions:[],suppliers:[supplier],supplierTransactions:entries});
function database(){const db=new DatabaseSync(':memory:');db.exec('PRAGMA foreign_keys=ON;');for(const name of ['001_initial','002_shop_profile','003_customer_import','004_customer_archive','005_suppliers'])db.exec(readFileSync(new URL('../src-tauri/migrations/'+name+'.sql',import.meta.url),'utf8'));return db;}
function seed(db:DatabaseSync){db.prepare('INSERT INTO restore_requests(payload) VALUES (?)').run(JSON.stringify(snapshot([line(),payment])));}
describe('supplier accounting and validation',()=>{
 it('adds purchases to amounts owed, deducts payments, and uses supplier-specific colors',()=>{const result=ledger(supplier,[line(),payment]);expect(result.closing).toBe(-26000000);expect(supplierBalanceClass(result.closing)).toBe('debit-text');expect(supplierBalanceLabel(result.closing)).toBe('You owe supplier');expect(supplierBalanceClass(100)).toBe('credit-text');expect(supplierBalanceLabel(100)).toContain('advance');});
 it('handles an advance, returned goods and filtered balance brought forward',()=>{const ret={...line('ret','return'),date:'2025-03-04',entry_type:'return' as const,quantity_milli:10000,debit_paisa:1300000,credit_paisa:0};const result=ledger(supplier,[line(),payment,ret],'2025-03-04','2025-03-04');expect(result.broughtForward).toBe(-26000000);expect(result.closing).toBe(-24700000);expect(result.debit).toBe(1300000);expect(ledger({...supplier,opening_paisa:70000000},[line()]).closing).toBe(5000000);});
 it('keeps different units as separate lines and rounds each material line',()=>{const steel={...line('steel'),description:'Steel',quantity_milli:52600,unit:'kg',rate_paisa:22200,credit_paisa:wholeMaterialAmount(52600,22200)};expect(()=>validateStore(snapshot([line(),steel]))).not.toThrow();expect(steel.credit_paisa).toBe(1167700);});
 it('rejects reversed sides, missing bank references and incorrect quantity-rate totals',()=>{expect(()=>validateStore(snapshot([{...line(),debit_paisa:65000000,credit_paisa:0}]))).toThrow('Purchases');expect(()=>validateStore(snapshot([{...payment,reference:''}]))).toThrow('reference');expect(()=>validateStore(snapshot([{...line(),credit_paisa:1}]))).toThrow('quantity');});
 it('rejects mixed suppliers or invoices inside a group and duplicate payment groups',()=>{expect(()=>validateStore(snapshot([line(),{...line('other'),bill_number:'different'}]))).toThrow('group');expect(()=>validateStore(snapshot([payment,{...payment,id:'second'}]))).toThrow('bill size');});
 it('validates opening dates against transactions and missing supplier references',()=>{expect(()=>validateStore({...snapshot([line()]),suppliers:[{...supplier,opening_date:'2025-03-05'}]})).toThrow('date');expect(()=>validateStore({...snapshot([line()]),suppliers:[]})).toThrow('Missing supplier');});
 it('writes backup v3 with both ledgers and reads legacy backups without inventing suppliers',()=>{const data=snapshot([line(),payment]);expect(decodeBackup(JSON.stringify(backupData(data)))).toEqual({...data,cash:{settings:null,movements:[],closings:[]}});expect(decodeBackup(JSON.stringify({format:'shop-ledger',version:2,data:{parties:[],transactions:[]}})).suppliers).toBeUndefined();expect(()=>decodeBackup(JSON.stringify({format:'shop-ledger',version:3,data:{parties:[],transactions:[]}}))).toThrow('supplier data');});
 it('prints supplier-specific signs, units and payment references in PDF',()=>{const text=statementPdf(supplier,[line(),payment],'','',undefined,true).output();expect(text).toContain('Supplier ledger');expect(text).toContain('CR: you owe supplier');expect(text).toContain('500 bags');expect(text).toContain('BANK-001');expect(text).not.toContain('DR: customer owes');});
});
describe('supplier SQLite persistence and atomic bills',()=>{
 it('initializes supplier tables without changing existing customers',()=>{const db=database();expect(db.prepare('SELECT count(*) AS n FROM suppliers').get()?.n).toBe(0);expect(db.prepare('SELECT count(*) AS n FROM parties').get()?.n).toBe(0);seed(db);expect(db.prepare('SELECT count(*) AS n FROM supplier_transactions').get()?.n).toBe(2);db.close();});
 it('saves a multi-line invoice atomically and rolls back a failed edit',()=>{const db=database();seed(db);const save=db.prepare('INSERT INTO supplier_bill_requests(payload) VALUES (?)');save.run(JSON.stringify({party_id:'s',group_id:'bill',transactions:[line(),{...line('second'),description:'Other cement'}]}));expect(db.prepare("SELECT count(*) AS n FROM supplier_transactions WHERE group_id='bill'").get()?.n).toBe(2);expect(()=>save.run(JSON.stringify({party_id:'s',group_id:'bill',transactions:[line(),{...line('bad'),date:'2020-01-01'}]}))).toThrow();expect(db.prepare("SELECT count(*) AS n FROM supplier_transactions WHERE group_id='bill'").get()?.n).toBe(2);expect(db.prepare('SELECT count(*) AS n FROM supplier_bill_requests').get()?.n).toBe(0);db.close();});
 it('prevents cross-supplier bill replacement and invalid side/date edits',()=>{const db=database();seed(db);expect(()=>db.prepare('INSERT INTO supplier_bill_requests(payload) VALUES (?)').run(JSON.stringify({party_id:'another',group_id:'bill',transactions:[]}))).toThrow('another supplier');expect(()=>db.exec("UPDATE supplier_transactions SET debit_paisa=credit_paisa,credit_paisa=0 WHERE entry_type='purchase'")).toThrow();expect(()=>db.exec("UPDATE suppliers SET opening_date='2026-01-01'")).toThrow();db.close();});
 it('restores suppliers with archive flags, preserves them for legacy backups, and rolls back all sections on failure',()=>{const db=database();seed(db);db.exec('UPDATE suppliers SET archived=1');const restore=db.prepare('INSERT INTO restore_requests(payload) VALUES (?)');restore.run(JSON.stringify({parties:[],transactions:[]}));expect(db.prepare('SELECT archived FROM suppliers').get()?.archived).toBe(1);db.prepare('INSERT INTO parties (id,name,opening_date,opening_paisa) VALUES (?,?,?,?)').run('preserved-customer','Original Customer','2025-01-01',0);expect(()=>restore.run(JSON.stringify({...snapshot([{...line(),date:'2020-01-01'}]),suppliers:[{...supplier,name:'Changed'}]}))).toThrow();expect(db.prepare('SELECT name FROM suppliers').get()?.name).toBe('Cement Mill');expect(db.prepare("SELECT name FROM parties WHERE id='preserved-customer'").get()?.name).toBe('Original Customer');expect(db.prepare('SELECT count(*) AS n FROM supplier_transactions').get()?.n).toBe(2);restore.run(JSON.stringify(snapshot([line()])));expect(db.prepare('SELECT archived FROM suppliers').get()?.archived).toBe(0);db.close();});
 it('deletes only the targeted supplier ledger and retains customer data',()=>{const db=database();seed(db);db.prepare('INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa) VALUES (?,?,?,?,?,?)').run('customer','Customer','','','2025-01-01',0);db.exec("DELETE FROM suppliers WHERE id='s'");expect(db.prepare('SELECT count(*) AS n FROM supplier_transactions').get()?.n).toBe(0);expect(db.prepare('SELECT name FROM parties').get()?.name).toBe('Customer');db.close();});
});
```

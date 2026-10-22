---
title: "Source: src/cash.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/cash.ts"
sha256: "1d8377a01238047921fea03f3add3c35e42fc491e9250c087cab91e490ecf3ab"
tags: [shop-ledger, development]
---

# Source snapshot: src/cash.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/cash.ts`.
- SHA-256 of original file bytes: `1d8377a01238047921fea03f3add3c35e42fc491e9250c087cab91e490ecf3ab`.
- Original bytes: 5485; source lines: 43.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`CashSettings`, `CashMovement`, `CashClosing`, `CashData`, `emptyCash`, `validateCash`, `cashMoney`, `cashDay`, `linkedCash`, `syncCash`.

## Complete source

```typescript
import { MAX_VALUE, money, validDate, type Store, type LedgerTransaction, type SupplierTransaction } from './domain';
export interface CashSettings { opening_date:string; opening_paisa:number }
export interface CashMovement { id:string;date:string;description:string;category:string;in_paisa:number;out_paisa:number;source_type:'manual'|'customer'|'supplier';source_id:string;account_name:string;created_at:string;voided:number }
export interface CashClosing { date:string;expected_paisa:number;counted_paisa:number;signature:string;note:string;closed_at:string }
export interface CashData { settings:CashSettings|null;movements:CashMovement[];closings:CashClosing[] }
export const emptyCash=():CashData=>({settings:null,movements:[],closings:[]});
export function validateCash(data:CashData) {
 if(!data||!Array.isArray(data.movements)||!Array.isArray(data.closings)||data.movements.length>200000||data.closings.length>40000)throw new Error('Invalid cash book data.');
 if(data.settings!==null&&(!data.settings||!validDate(data.settings.opening_date)||!Number.isSafeInteger(data.settings.opening_paisa)||data.settings.opening_paisa<0||data.settings.opening_paisa>MAX_VALUE))throw new Error('Invalid drawer opening balance.');
 const ids=new Set<string>(),dates=new Set<string>();let total=data.settings?.opening_paisa??0;
 for(const m of data.movements){
  if(!m||typeof m.id!=='string'||!m.id||ids.has(m.id)||!validDate(m.date)||!['manual','customer','supplier'].includes(m.source_type)||![0,1].includes(m.voided))throw new Error('Invalid or duplicate cash movement.');ids.add(m.id);
  for(const k of ['description','category','source_id','account_name'] as const)if(typeof m[k]!=='string'||m[k].length>240)throw new Error('Invalid cash entry details.');
  if(!m.description.trim()||!m.category.trim()||!m.created_at||!Number.isFinite(Date.parse(m.created_at)))throw new Error('Enter cash entry details.');
  for(const k of ['in_paisa','out_paisa'] as const)if(!Number.isSafeInteger(m[k])||m[k]<0||m[k]>MAX_VALUE)throw new Error('Invalid cash amount.');
  if((m.in_paisa>0)===(m.out_paisa>0))throw new Error('Choose either cash in or cash out.');
  if(m.source_type!=='manual'&&(m.id!==m.source_type+':'+m.source_id||!m.source_id))throw new Error('Invalid linked cash entry.');
  if(m.source_type==='manual'&&m.source_id)throw new Error('Manual cash entries cannot link to a ledger.');
  total+=m.in_paisa+m.out_paisa;if(!Number.isSafeInteger(total))throw new Error('Cash totals exceed supported size.');
 }
 for(const c of data.closings){if(!c||!validDate(c.date)||dates.has(c.date)||!Number.isSafeInteger(c.expected_paisa)||!Number.isSafeInteger(c.counted_paisa)||c.counted_paisa<0||c.counted_paisa>MAX_VALUE||typeof c.signature!=='string'||c.signature.length>64||typeof c.note!=='string'||c.note.length>500||!Number.isFinite(Date.parse(c.closed_at)))throw new Error('Invalid cash closing.');dates.add(c.date);}
}
export function cashMoney(amount:number){return (amount<0?'-':'')+money(amount);}
export function cashDay(data:CashData,date:string){
 if(!validDate(date))throw new Error('Choose a valid cash book date.');
 if(!data.settings)throw new Error('Set the drawer opening balance first.');
 if(date<data.settings.opening_date)throw new Error('Choose a date on or after the drawer opening date.');
 const relevant=data.movements.filter(m=>!m.voided&&m.date>=data.settings!.opening_date&&m.date<=date).sort((a,b)=>a.date.localeCompare(b.date)||a.created_at.localeCompare(b.created_at)||a.id.localeCompare(b.id));
 let opening=data.settings.opening_paisa;for(const m of relevant)if(m.date<date)opening+=m.in_paisa-m.out_paisa;
 let expected=opening,incoming=0,outgoing=0;const rows=relevant.filter(m=>m.date===date).map(m=>{incoming+=m.in_paisa;outgoing+=m.out_paisa;expected+=m.in_paisa-m.out_paisa;return {...m,balance:expected};});
 const text=JSON.stringify([[data.settings.opening_date,data.settings.opening_paisa],relevant.map(m=>[m.id,m.date,m.in_paisa,m.out_paisa])]);let hash=14695981039346656037n;for(let i=0;i<text.length;i++)hash=BigInt.asUintN(64,(hash^BigInt(text.charCodeAt(i)))*1099511628211n);
 const signature=hash.toString(16),closing=data.closings.find(c=>c.date===date);
 return {opening,incoming,outgoing,expected,rows,signature,closing,stale:!!closing&&closing.signature!==signature};
}
export function linkedCash(tx:LedgerTransaction|SupplierTransaction,source:'customer'|'supplier',name:string):CashMovement|undefined {
 if(tx.payment_method!=='Cash'||(source==='supplier'&&(tx as SupplierTransaction).entry_type!=='payment'))return;
 return {id:source+':'+tx.id,date:tx.date,description:tx.description,category:source==='customer'?(tx.credit_paisa?'Customer receipt':'Customer refund'):'Supplier payment',in_paisa:source==='customer'?tx.credit_paisa:0,out_paisa:source==='customer'?tx.debit_paisa:tx.debit_paisa,source_type:source,source_id:tx.id,account_name:name,created_at:tx.created_at,voided:0};
}
export function syncCash(data:CashData,entries:(LedgerTransaction|SupplierTransaction)[],oldIds:string[],source:'customer'|'supplier',name:string):CashData {
 const movements=data.movements.map(m=>m.source_type===source&&oldIds.includes(m.source_id)?{...m,voided:1}:m);
 for(const entry of entries){const movement=linkedCash(entry,source,name);if(movement){const at=movements.findIndex(m=>m.id===movement.id);if(at>=0)movements[at]=movement;else movements.push(movement);}}
 return {...data,movements};
}
```

---
title: "Source: src/discovery.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/discovery.ts"
sha256: "a799c7ddc79d1b0517a86f1016849d13d6af73836fba1e82d4be3b708054f3c6"
tags: [shop-ledger, development]
---

# Source snapshot: src/discovery.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/discovery.ts`.
- SHA-256 of original file bytes: `a799c7ddc79d1b0517a86f1016849d13d6af73836fba1e82d4be3b708054f3c6`.
- Original bytes: 5728; source lines: 37.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`SearchHit`, `buildSearchIndex`, `searchRecords`, `JumpTarget`, `DueRow`, `outstandingDues`, `sortDues`.

## Complete source

```typescript
import { ordered, validDate, type Store, type Party } from './domain';
export type SearchScope='all'|'customers'|'suppliers'|'bills'|'vehicles'|'cash';
export interface SearchHit {id:string;kind:'customer'|'supplier'|'customer-entry'|'supplier-entry'|'cash';title:string;detail:string;accountId:string;entryId?:string;date?:string;archived:boolean;bill:string;vehicle:string;text:string;exact:string[]}
const norm=(s:string)=>s.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' ').trim();
const compact=(s:string)=>norm(s).replace(/[^\p{L}\p{N}]/gu,'');
export function buildSearchIndex(store:Store):SearchHit[]{
 const hits:SearchHit[]=[];const customers=new Map(store.parties.map(p=>[p.id,p])),suppliers=new Map((store.suppliers??[]).map(p=>[p.id,p]));
 for(const [kind,list] of [['customer',store.parties],['supplier',store.suppliers??[]]] as const)for(const p of list)hits.push({id:kind+':'+p.id,kind,title:p.name,detail:[kind==='customer'?'Customer':'Supplier',p.phone,p.address,p.archived?'Archived':''].filter(Boolean).join(' · '),accountId:p.id,archived:p.archived===1,bill:'',vehicle:'',text:norm([p.name,p.phone,p.address,'contact_person' in p?p.contact_person:''].join(' ')),exact:[norm(p.name),compact(p.phone)]});
 for(const [kind,entries,accounts] of [['customer-entry',store.transactions,customers],['supplier-entry',store.supplierTransactions??[],suppliers]] as const)for(const t of entries){const p=accounts.get(t.party_id);if(!p)continue;hits.push({id:kind+':'+t.id,kind,title:p.name+' · '+(t.bill_number?'Bill '+t.bill_number:t.description),detail:[t.date,t.description,t.brand,t.vehicle_number?'Vehicle '+t.vehicle_number:'',p.archived?'Archived':''].filter(Boolean).join(' · '),accountId:p.id,entryId:t.id,date:t.date,archived:p.archived===1,bill:t.bill_number,vehicle:t.vehicle_number,text:norm([p.name,p.phone,t.description,t.brand,t.bill_number,t.vehicle_number].join(' ')),exact:[norm(t.bill_number),compact(t.bill_number),norm(t.vehicle_number),compact(t.vehicle_number)].filter(Boolean)});}
 for(const m of store.cash?.movements??[])if(!m.voided)hits.push({id:'cash:'+m.id,kind:'cash',title:m.description,detail:[m.date,'Cash book',m.account_name,m.category].filter(Boolean).join(' · '),accountId:'',entryId:m.id,date:m.date,archived:false,bill:'',vehicle:'',text:norm([m.description,m.account_name,m.category].join(' ')),exact:[]});
 return hits;
}
export function searchRecords(index:SearchHit[],query:string,scope:SearchScope='all',limit=50){
 const q=norm(query),tokens=q.split(' ').filter(Boolean);if(!q)return {hits:[] as SearchHit[],total:0};
 const matches=index.filter(h=>scope==='all'||scope==='customers'&&(h.kind==='customer'||h.kind==='customer-entry')||scope==='suppliers'&&(h.kind==='supplier'||h.kind==='supplier-entry')||scope==='bills'&&!!h.bill||scope==='vehicles'&&!!h.vehicle||scope==='cash'&&h.kind==='cash').filter(h=>tokens.every(t=>h.text.includes(t)||!!compact(t)&&compact(h.text).includes(compact(t))));
 const score=(h:SearchHit)=>(h.exact.includes(q)||!!compact(q)&&h.exact.includes(compact(q))?100:0)+(h.kind==='customer'||h.kind==='supplier'?10:0)+(h.title.toLowerCase().startsWith(q)?5:0);
 matches.sort((a,b)=>score(b)-score(a)||(b.date??'').localeCompare(a.date??'')||a.title.localeCompare(b.title)||a.id.localeCompare(b.id));return {hits:matches.slice(0,limit),total:matches.length};
}
export interface JumpTarget {accountId:string;entryId?:string;date?:string;nonce:number}
export interface DueRow {party:Party;balance:number;oldestCharge:string;oldestDue:string;ageDays:number;overdue:number;daysOverdue:number}
const days=(from:string,to:string)=>Math.max(0,Math.round((Date.parse(to+'T00:00:00Z')-Date.parse(from+'T00:00:00Z'))/86400000));
export function outstandingDues(store:Store,asOf:string):DueRow[]{
 if(!validDate(asOf))throw new Error('Choose a valid dashboard date.');
 const grouped=new Map<string,typeof store.transactions>();for(const t of store.transactions)if(t.date<=asOf){const rows=grouped.get(t.party_id)??[];rows.push(t);grouped.set(t.party_id,rows);}
 const result:DueRow[]=[];
 for(const party of store.parties){if(party.opening_date>asOf)continue;const lots:{date:string;due:string;amount:number}[]=[];let credit=Math.max(0,-party.opening_paisa),head=0;
  if(party.opening_paisa>0)lots.push({date:party.opening_date,due:party.opening_due_date??'',amount:party.opening_paisa});
  for(const t of ordered(grouped.get(party.id)??[])){if(t.debit_paisa){const used=Math.min(credit,t.debit_paisa);credit-=used;if(t.debit_paisa>used)lots.push({date:t.date,due:t.due_date??'',amount:t.debit_paisa-used});}else{let amount=t.credit_paisa;while(amount&&head<lots.length){const used=Math.min(amount,lots[head].amount);amount-=used;lots[head].amount-=used;if(lots[head].amount===0)head++;}credit+=amount;}}
  const remaining=lots.slice(head).filter(l=>l.amount>0),balance=remaining.reduce((n,l)=>n+l.amount,0);if(!balance)continue;
  const oldestCharge=remaining[0].date,dates=remaining.map(l=>l.due).filter(Boolean).sort(),oldestDue=dates[0]??'';
  result.push({party,balance,oldestCharge,oldestDue,ageDays:days(oldestCharge,asOf),overdue:remaining.filter(l=>l.due&&l.due<asOf).reduce((n,l)=>n+l.amount,0),daysOverdue:oldestDue?days(oldestDue,asOf):0});
 }
 return result;
}
export function sortDues(rows:DueRow[],sort:'balance'|'due'|'age'){
 return [...rows].sort((a,b)=>sort==='balance'?b.balance-a.balance||a.oldestCharge.localeCompare(b.oldestCharge)||a.party.name.localeCompare(b.party.name):sort==='due'?(a.oldestDue||'9999-12-31').localeCompare(b.oldestDue||'9999-12-31')||a.oldestCharge.localeCompare(b.oldestCharge)||b.balance-a.balance:a.oldestCharge.localeCompare(b.oldestCharge)||b.balance-a.balance);
}
```

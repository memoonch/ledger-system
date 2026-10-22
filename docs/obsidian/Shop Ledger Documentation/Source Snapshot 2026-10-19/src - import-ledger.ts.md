---
title: "Source: src/import-ledger.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/import-ledger.ts"
sha256: "3e19e1c450594d21c497c1c92120749a1c200e42c906fdee99f8dfd81ff075ff"
tags: [shop-ledger, development]
---

# Source snapshot: src/import-ledger.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/import-ledger.ts`.
- SHA-256 of original file bytes: `3e19e1c450594d21c497c1c92120749a1c200e42c906fdee99f8dfd81ff075ff`.
- Original bytes: 9736; source lines: 127.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`ImportSheet`, `fields`, `cellText`, `detectMapping`, `parseCsv`, `readImportFile`, `importDate`, `customerHints`, `Preview`, `previewImport`, `validateImport`.

## Complete source

```typescript
import { decimal, validDate, validateParty, validateTransaction, MAX_VALUE, type Party, type LedgerTransaction } from './domain';
export type Cell = string | number | Date | null | { formula?: string; sharedFormula?: string; result?: unknown };
export interface ImportSheet { name: string; rows: Cell[][] }
export const fields = ['date','description','brand','vehicle_number','bill_number','quantity','rate','debit','credit'] as const;
export type Field = typeof fields[number];
export type Mapping = Record<Field, number>;
const aliases: Record<Field, string[]> = {
 date:['date','transactiondate'], description:['description','particulars','details'], brand:['brand','brandname'],
 vehicle_number:['vehicleno','vehiclenumber','vehicle'], bill_number:['billno','billnumber','receiptno','billreceiptno'],
 quantity:['quantity','qty','quantityunitkg','quantitykg'], rate:['rate','unitrate'], debit:['debit','dr','debitdr','debitamount'], credit:['credit','cr','creditcr','creditamount'],
};
export function cellText(value: Cell | undefined): string {
 if (value == null) return '';
 if (value instanceof Date) return value.toISOString().slice(0,10);
 if (typeof value === 'object') return value.result == null ? '' : String(value.result);
 return String(value).trim();
}
const normalize = (v: Cell | undefined) => cellText(v).toLowerCase().replace(/[^a-z0-9]/g,'');
export function detectMapping(rows: Cell[][]) {
 let best = { header:0, mapping:Object.fromEntries(fields.map(f=>[f,-1])) as Mapping, score:0 };
 rows.slice(0,100).forEach((row,header)=>{
  const mapping = Object.fromEntries(fields.map(f=>[f,row.findIndex(v=>aliases[f].includes(normalize(v)))])) as Mapping;
  const score = fields.filter(f=>mapping[f]>=0).length;
  if(score>best.score) best={header,mapping,score};
 });
 return best;
}
export function parseCsv(text:string): Cell[][] {
 const rows: string[][]=[]; let row:string[]=[], value='', quoted=false;
 const sample=text.split(/\r?\n/).find(s=>s.trim())??'';
 const separator = sample.includes('\t') ? '\t' : sample.split(';').length>sample.split(',').length ? ';' : ',';
 text=text.replace(/^\uFEFF/,'');
 for(let i=0;i<text.length;i++) { const c=text[i];
  if(c==='"') { if(quoted&&text[i+1]==='"') {value+='"';i++;} else if(!quoted&&value) throw new Error('Invalid CSV quotation.'); else quoted=!quoted; }
  else if(!quoted&&(c===separator||c==='\n'||c==='\r')) {row.push(value);value='';if(c!==separator){rows.push(row);row=[];if(c==='\r'&&text[i+1]==='\n')i++;}}
  else value+=c;
 }
 if(quoted) throw new Error('CSV has an unclosed quoted field.');
 if(value||row.length){row.push(value);rows.push(row);} return rows;
}
export async function readImportFile(name:string, bytes:Uint8Array):Promise<ImportSheet[]> {
 if(bytes.length>10*1024*1024) throw new Error('Choose a file smaller than 10 MB.');
 if(/\.csv$/i.test(name)) {const rows=parseCsv(new TextDecoder('utf-8',{fatal:true}).decode(bytes));if(rows.length>20000||rows.some(r=>r.length>100))throw new Error('CSV exceeds 20,000 rows or 100 columns.');return [{name:'CSV',rows}];}
 if(!/\.xlsx$/i.test(name)) throw new Error('Choose an .xlsx or UTF-8 .csv file. Save older .xls files as .xlsx first.');
 const {Workbook}=await import('exceljs'); const workbook=new Workbook();
 await workbook.xlsx.load(bytes as never);
 return workbook.worksheets.map(sheet=>{
  if(sheet.rowCount>20000||sheet.columnCount>100) throw new Error('Worksheet exceeds 20,000 rows or 100 columns.');
  const rows:Cell[][]=[];
  for(let r=1;r<=sheet.rowCount;r++) {const row:Cell[]=[];for(let c=1;c<=sheet.columnCount;c++) {
   const v=sheet.getCell(r,c).value;
   if(v&&typeof v==='object'&&!(v instanceof Date)&&'richText' in v) row.push(v.richText.map(x=>x.text).join(''));
   else if(v&&typeof v==='object'&&'error' in v) row.push(String(v.error));
   else if(v&&typeof v==='object'&&'hyperlink' in v) row.push(v.text);
   else row.push(v as Cell);
  } rows.push(row); } return {name:sheet.name,rows};
 });
}
function amount(v:Cell|undefined, places=2) {
 let s=cellText(v).replace(/(?:PKR|Rs\.?)/gi,'').replace(/,/g,'').trim();
 if(!s||s==='-'||s==='—')return 0;
 if(s.startsWith('#'))throw new Error('Excel cell contains an error.');
 if(/^\d+\.\d+$/.test(s)) s=s.replace(/0+$/,'').replace(/\.$/,'');
 return decimal(s,places);
}
export function importDate(v:Cell|undefined):string {
 let s=cellText(v);
 if(typeof v==='number') s=new Date(Date.UTC(1899,11,30)+v*86400000).toISOString().slice(0,10);
 const parts=s.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{4})$/);
 if(parts)s=`${parts[3]}-${parts[2].padStart(2,'0')}-${parts[1].padStart(2,'0')}`;
 if(!validDate(s))throw new Error('Use a valid date: DD/MM/YYYY or YYYY-MM-DD.'); return s;
}
export function customerHints(rows:Cell[][],header:number) {
 let name='',phone='',address='';
 rows.slice(0,header).forEach(row=>row.forEach((v,i)=>{const key=normalize(v),next=cellText(row[i+1]);
  if(next&&['customername','partyname','customer'].includes(key))name=next;
  if(next&&['ph','phone','phonenumber'].includes(key))phone=next;
  if(next&&key==='address')address=next;
 }));return {name,phone,address};
}
export interface Preview { transactions:LedgerTransaction[]; errors:string[]; warnings:string[]; skipped:number; opening?:{date:string; amount:number}; }
export function previewImport(sheet:ImportSheet,header:number,mapping:Mapping,party:Party):Preview {
 const result:Preview={transactions:[],errors:[],warnings:[],skipped:0};
 if(['date','description','debit','credit'].some(f=>mapping[f as Field]<0)) {result.errors.push('Map Date, Description, Debit and Credit columns.');return result;}
 const mapped=fields.map(f=>mapping[f]).filter(i=>i>=0);
 if(new Set(mapped).size!==mapped.length){result.errors.push('Each field must use a different column.');return result;}
 const base=Date.now();let seen=false;
 sheet.rows.slice(header+1).forEach((row,index)=>{
  const line=header+index+2, get=(f:Field)=>mapping[f]<0?undefined:row[mapping[f]];
  if(normalize(get('date'))==='date'&&normalize(get('description'))==='description'){result.skipped++;return;}
  // Ignore empty template rows even when they contain zero-valued formulas/balances.
  if(!cellText(get('date'))&&!cellText(get('description'))&&!fields.slice(2,7).some(f=>cellText(get(f)))&&!['debit','credit'].some(f=>{const s=cellText(get(f as Field));return s&&!/^(?:0(?:\.0+)?|-|—)$/.test(s);})){result.skipped++;return;}
  if(/^(?:total|grandtotal|closingbalance|currentbalance)/.test(normalize(get('description')))||/^(?:total|grandtotal|currentbalance)/.test(normalize(get('date')))){result.skipped++;return;}
  try {
   const date=importDate(get('date')),description=cellText(get('description'));
   let debit=amount(get('debit')),credit=amount(get('credit'));
   if(/^(?:balance\s*f\/?c|opening\s*balance|balance\s*b\/?f|brought\s*forward)$/i.test(description)) {
    if(seen||result.opening)throw new Error('Opening balance must appear once, before all transactions.');
    for(const f of ['debit','credit'] as Field[]) {const v=get(f);if(v&&typeof v==='object'&&!(v instanceof Date)&&v.result==null)throw new Error('Opening balance formula has no saved result. Recalculate and save in Excel.');}
    if(debit&&credit)throw new Error('Opening balance has both debit and credit.');
    result.opening={date,amount:debit-credit};return;
   }
   seen=true;
   const quantity=amount(get('quantity'),3),rate=amount(get('rate'));
   const debitCell=get('debit');
   if(debitCell&&typeof debitCell==='object'&&!(debitCell instanceof Date)&&debitCell.result==null) {
    const formula=debitCell.formula?.replace(/[=$()\s]/g,'');
    const col=(n:number)=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
    if(formula!==`${col(mapping.quantity)}${line}*${col(mapping.rate)}${line}`)throw new Error('Formula has no saved result. Recalculate and save in Excel first.');
    debit=Math.round(quantity*rate/1000);
   }
   for(const f of ['credit','quantity','rate'] as Field[]) {const v=get(f);if(v&&typeof v==='object'&&!(v instanceof Date)&&v.result==null)throw new Error(`${f} formula has no saved result. Recalculate and save in Excel.`);}
   const tx:LedgerTransaction={id:crypto.randomUUID(),party_id:party.id,date,description,brand:cellText(get('brand')),vehicle_number:cellText(get('vehicle_number')),bill_number:cellText(get('bill_number')),quantity_milli:quantity,rate_paisa:rate,debit_paisa:debit,credit_paisa:credit,created_at:new Date(base+index).toISOString()};
   validateTransaction(tx,{...party,opening_date:'1900-01-01'});
   if([debit,credit,rate].some(x=>x%100))result.warnings.push(`Row ${line}: fractional rupees preserved; the app displays rounded whole rupees.`);
   result.transactions.push(tx);
  }catch(e){result.errors.push(`Row ${line}: ${(e as Error).message}`);}
 });
 if(result.opening&&result.transactions.some(t=>t.date<result.opening!.date))result.errors.push('A transaction predates the opening balance.');
 if(result.transactions.reduce((n,t)=>n+t.debit_paisa+t.credit_paisa,Math.abs(result.opening?.amount??0))>Number.MAX_SAFE_INTEGER)result.errors.push('Total amounts exceed the supported size.');
 return result;
}
export function validateImport(party:Party,transactions:LedgerTransaction[]) {
 validateParty(party,transactions);transactions.forEach(t=>validateTransaction(t,party));
 if(!Number.isFinite(party.opening_paisa)||party.opening_paisa%1)throw new Error('Opening balance supports up to two decimal places.');
 if(transactions.length>20000||Math.abs(party.opening_paisa)>MAX_VALUE)throw new Error('Import exceeds supported size.');
}
```

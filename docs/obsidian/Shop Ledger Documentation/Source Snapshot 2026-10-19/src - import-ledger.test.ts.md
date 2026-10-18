---
title: "Source: src/import-ledger.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/import-ledger.test.ts"
sha256: "d408baa34d183449fa226e8dbcf427694fae3df91dc828768c8be58cc68309b8"
tags: [shop-ledger, development]
---

# Source snapshot: src/import-ledger.test.ts

- Captured: 2026-10-19T01:12:18+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/import-ledger.test.ts`.
- SHA-256 of original file bytes: `d408baa34d183449fa226e8dbcf427694fae3df91dc828768c8be58cc68309b8`.
- Original bytes: 4947; source lines: 39.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import {describe,it,expect} from 'vitest';
import {readFile} from 'node:fs/promises';
import {customerHints,detectMapping,parseCsv,previewImport,readImportFile,importDate,validateImport,type ImportSheet} from './import-ledger';
import {ledger,type Party} from './domain';
const party:Party={id:'new',name:'Test Customer',phone:'',address:'',opening_date:'2025-03-07',opening_paisa:32368800};
const headings=['DATE','DESCRIPTION','Brand','Vehicle NO.','Bill NO.','Quantity Unit/Kg','Rate','DEBIT','CREDIT','Total Balance'];
function preview(rows:ImportSheet['rows']){const sheet={name:'Ledger',rows:[headings,...rows]};const d=detectMapping(sheet.rows);return previewImport(sheet,d.header,d.mapping,party);}
describe('customer spreadsheet import',()=>{
 it('handles the printable ledger headings and metadata',()=>{
  const rows=[['Customer NAME','Customer'],['Ph#','03001234567'],['Address','Site'],headings];
  const d=detectMapping(rows);expect(d.header).toBe(3);expect(d.score).toBe(9);expect(customerHints(rows,3)).toEqual({name:'Customer',phone:'03001234567',address:'Site'});
 });
 it('imports opening once, payment/returns as credit, and keeps same-day order',()=>{
  const p=preview([['07/03/2025','Balance F/C','','','',1,'##',323688,0],['13/03/2025','Cement','Pak Cem','','',20,1320,26400,0],['13/03/2025','Carriage','','','',1,500,500,0],['17/03/2025','Cheque','','','','','',0,400000],['20/03/2025','Steel return','','','','','',0,65475]]);
  expect(p.errors).toEqual([]);expect(p.opening).toEqual({date:'2025-03-07',amount:32368800});expect(p.transactions).toHaveLength(4);expect(ledger(party,p.transactions).closing).toBe(-11488700);expect(ledger(party,p.transactions).rows[0].description).toBe('Cement');
 });
 it('ignores blank prefilled formulas and repeated headings',()=>{
  const p=preview([[null,null,null,null,null,null,null,{formula:'G2*H2'},0,{formula:'J2-I2'}],headings]);expect(p.errors).toEqual([]);expect(p.skipped).toBe(2);expect(p.transactions).toEqual([]);
 });
 it('calculates only recognized quantity times rate without a cached debit',()=>{
  const p=preview([['13/03/2025','Cement','','','',20,1320,{formula:'=(F2*G2)'},0]]);expect(p.errors).toEqual([]);expect(p.transactions[0].debit_paisa).toBe(2640000);
  expect(preview([['13/03/2025','Cement','','','',20,1320,{formula:'WEBSERVICE("x")'},0]]).errors[0]).toContain('no saved result');
 });
 it('reports bad dates, missing amounts and both debit/credit without silently dropping rows',()=>{
  const p=preview([['31/02/2025','Sale','','','','','',10,0],['13/03/2025','Sale','','','','','',10,20],['13/03/2025','Missing','','','','','',0,0]]);expect(p.errors).toHaveLength(3);
 });
 it('preserves decimals, identifiers and identical legitimate deliveries',()=>{
  const row=['15/06/2025','Steel','Brand','ABC-001','00012',52.6,222,11677.2,0];const p=preview([row,row]);expect(p.errors).toEqual([]);expect(p.warnings).toHaveLength(2);expect(p.transactions[0].bill_number).toBe('00012');expect(p.transactions[0].quantity_milli).toBe(52600);expect(p.transactions[0].debit_paisa).toBe(1167720);expect(p.transactions).toHaveLength(2);
 });
 it('parses quoted multiline CSV, escaped quotes and accounting separators',()=>{
  const rows=parseCsv('Date,Description,Debit,Credit\r\n13/03/2025,"Sale, \"\"cement\"\"\nsecond line","Rs 26,400",-');expect(rows[1][1]).toBe('Sale, "cement"\nsecond line');const d=detectMapping(rows);expect(previewImport({name:'CSV',rows},0,d.mapping,party).errors).toEqual([]);expect(()=>parseCsv('"unclosed')).toThrow();
 });
 it('requires explicit mappings and rejects reused columns',()=>{const p=preview([['13/03/2025','Sale','','','','','',10,0]]);expect(p.errors).toEqual([]);const s={name:'x',rows:[['x']]};expect(previewImport(s,0,detectMapping(s.rows).mapping,party).errors[0]).toContain('Map Date');});
 it('validates opening date and Excel serial dates',()=>{expect(importDate(45729)).toBe('2025-03-13');const p=preview([['13/03/2025','Sale','','','','','',10,0]]);expect(()=>validateImport({...party,opening_date:'2025-03-14'},p.transactions)).toThrow();});
 it('rejects unsupported and oversized files',async()=>{await expect(readImportFile('x.xls',new Uint8Array())).rejects.toThrow('xlsx');await expect(readImportFile('x.csv',new Uint8Array(10*1024*1024+1))).rejects.toThrow('10 MB');});
 it('reads a real xlsx with formulas, dates and non-ledger sheets',async()=>{
  const {Workbook}=await import('exceljs');const w=new Workbook();const s=w.addWorksheet('Ledger');s.addRow(headings);s.addRow([new Date('2025-03-13T00:00:00Z'),'Sale','','','0001',20,1320,{formula:'F2*G2',result:26400},0]);w.addWorksheet('Disclaimer').addRow(['text']);const sheets=await readImportFile('test.xlsx',new Uint8Array(await w.xlsx.writeBuffer()));expect(sheets).toHaveLength(2);const p=previewImport(sheets[0],0,detectMapping(sheets[0].rows).mapping,party);expect(p.errors).toEqual([]);expect(p.transactions[0].date).toBe('2025-03-13');
 });
});
```

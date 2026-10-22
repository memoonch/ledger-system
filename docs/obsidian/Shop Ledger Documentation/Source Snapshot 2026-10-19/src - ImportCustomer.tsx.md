---
title: "Source: src/ImportCustomer.tsx"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/ImportCustomer.tsx"
sha256: "0a372d7bb821151da09f67da275a9a74002d97eec00def15d2899ec51487559b"
tags: [shop-ledger, development]
---

# Source snapshot: src/ImportCustomer.tsx

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/ImportCustomer.tsx`.
- SHA-256 of original file bytes: `0a372d7bb821151da09f67da275a9a74002d97eec00def15d2899ec51487559b`.
- Original bytes: 8311; source lines: 52.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`ImportCustomer`.

## Complete source

```tsx
import { useMemo, useRef, useState, type FormEvent } from 'react';
import { Modal } from './forms';
import { balanceClass, balanceText, ledger, today, type Party, type LedgerTransaction } from './domain';
import { cellText, customerHints, detectMapping, fields, previewImport, readImportFile, validateImport, type ImportSheet, type Mapping } from './import-ledger';
import { readSpreadsheet } from './storage';
const labels={date:'Date',description:'Description',brand:'Brand',vehicle_number:'Vehicle number',bill_number:'Bill / receipt number',quantity:'Quantity',rate:'Rate',debit:'Debit (DR)',credit:'Credit (CR)'};
export default function ImportCustomer({close,save,existingNames}:{close:()=>void;save:(party:Party,transactions:LedgerTransaction[])=>Promise<void>;existingNames:string[]}) {
 const id=useRef(crypto.randomUUID());
 const [sheets,setSheets]=useState<ImportSheet[]>([]),[selected,setSelected]=useState(0),[filename,setFilename]=useState('');
 const [header,setHeader]=useState(0),[mapping,setMapping]=useState<Mapping>(Object.fromEntries(fields.map(f=>[f,-1])) as Mapping);
 const [name,setName]=useState(''),[phone,setPhone]=useState(''),[address,setAddress]=useState(''),[date,setDate]=useState(today()),[opening,setOpening]=useState('0'),[side,setSide]=useState('DR');
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[confirmed,setConfirmed]=useState(false);
 const sheet=sheets[selected];
 const party:Party={id:id.current,name:name.trim(),phone:phone.trim(),address:address.trim(),opening_date:date,opening_paisa:Number(opening)*100*(side==='CR'?-1:1)};
 const preview=useMemo(()=>sheet?previewImport(sheet,header,mapping,party):null,[sheet,header,mapping]);
 const duplicate=existingNames.some(n=>n.trim().toLowerCase()===name.trim().toLowerCase());
 function selectSheet(next:ImportSheet[],index:number){
  const s=next[index],detected=detectMapping(s.rows);setSelected(index);setHeader(detected.header);setMapping(detected.mapping);setConfirmed(false);
  const hints=customerHints(s.rows,detected.header);setName(hints.name);setPhone(hints.phone);setAddress(hints.address);
  const p=previewImport(s,detected.header,detected.mapping,{...party,opening_date:'1900-01-01'});
  setDate(p.opening?.date??p.transactions.map(t=>t.date).sort()[0]??today());
  setOpening(String(Math.abs(p.opening?.amount??0)/100));setSide((p.opening?.amount??0)<0?'CR':'DR');
 }
 async function choose(){setError('');setBusy(true);try{const file=await readSpreadsheet();if(!file)return;const next=await readImportFile(file.name,file.bytes);if(!next.length)throw new Error('No worksheets found.');setFilename(file.name);setSheets(next);selectSheet(next,0);}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 let validation='';
 if(preview){try{if(!/^\d+(?:\.\d{1,2})?$/.test(opening))throw new Error('Enter a positive opening amount with up to two decimal places.');validateImport(party,preview.transactions);}catch(e){validation=(e as Error).message;}}
 const closing=preview&&!validation?ledger(party,preview.transactions).closing:0;
 async function submit(e:FormEvent){e.preventDefault();setError('');if(!preview||preview.errors.length||validation||!confirmed)return;setBusy(true);try{await save(party,preview.transactions);close();}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 return <Modal title="Import customer from Excel / CSV" subtitle="One customer per import. Review everything before saving." close={close} busy={busy}>
  <form className="import-form" onSubmit={submit} onChange={()=>setConfirmed(false)}>
   <p className="form-note">Supports .xlsx and UTF-8 .csv. Text dates use DD/MM/YYYY. Debit means the customer owes you. Credit means payment or return. Running balances are recalculated by date.</p>
   <button type="button" className="button secondary" onClick={()=>void choose()} disabled={busy}>{filename?'Choose another file':'Choose Excel / CSV file'}</button>
   {sheet&&<>
    <div className="form-grid"><label>Worksheet<select value={selected} onChange={e=>selectSheet(sheets,Number(e.target.value))}>{sheets.map((s,i)=><option key={i} value={i}>{s.name}</option>)}</select></label><label>Column heading row<input type="number" min={1} max={sheet.rows.length} value={header+1} onChange={e=>{const h=Math.max(0,Number(e.target.value)-1);setHeader(h);setMapping(detectMapping([sheet.rows[h]??[]]).mapping);}}/></label></div>
    <details><summary>Review / change column mapping</summary><div className="form-grid">{fields.map(f=><label key={f}>{labels[f]}<select value={mapping[f]} onChange={e=>setMapping({...mapping,[f]:Number(e.target.value)})}><option value={-1}>Not included</option>{(sheet.rows[header]??[]).map((v,i)=><option key={i} value={i}>{i+1}: {cellText(v)||'(blank heading)'}</option>)}</select></label>)}</div></details>
    <div className="form-grid"><label className="full">Customer name<input required maxLength={120} value={name} onChange={e=>setName(e.target.value)}/></label><label>Phone<input maxLength={50} value={phone} onChange={e=>setPhone(e.target.value)}/></label><label>Opening balance date<input type="date" required min="1900-01-01" max="9999-12-31" value={date} onChange={e=>setDate(e.target.value)}/></label><label className="full">Address<input maxLength={300} value={address} onChange={e=>setAddress(e.target.value)}/></label><label>Opening balance (PKR)<input required inputMode="decimal" value={opening} onChange={e=>setOpening(e.target.value)}/></label><label>Opening balance type<select value={side} onChange={e=>setSide(e.target.value)}><option value="DR">DR — Customer owes us</option><option value="CR">CR — Customer advance</option></select></label></div>
    {preview?.opening&&<p className="form-note">The first Balance F/C / opening row was detected and excluded from transactions. Its date and amount were filled above. Confirm them before importing.</p>}
    {duplicate&&<p className="error">A customer with this name already exists. Import creates a separate new customer; check that this is intentional.</p>}
    {preview&&<><p><strong>{preview.transactions.length} transactions</strong> · {preview.skipped} empty / heading / total rows skipped · Closing: <strong className={balanceClass(closing)}>{balanceText(closing)}</strong></p>
     {preview.errors.length>0&&<div className="error" role="alert"><strong>Fix these rows in your file, then select it again:</strong><ul>{preview.errors.slice(0,30).map((e,i)=><li key={i}>{e}</li>)}</ul>{preview.errors.length>30&&<p>{preview.errors.length-30} more errors.</p>}</div>}
     {validation&&<p className="error" role="alert">{validation}</p>}
     {!!preview.warnings.length&&<p className="form-note">{preview.warnings.length} rows contain fractional rupees. Exact amounts are preserved; the interface displays rounded whole rupees.</p>}
     {!preview.transactions.length&&<p className="form-note">No transactions found. This will create a customer with the opening balance only.</p>}
     <div className="import-preview"><table className="ledger-table"><thead><tr><th>Date</th><th>Description</th><th>Brand</th><th>Vehicle</th><th>Bill</th><th>Qty</th><th>Rate</th><th>Debit</th><th>Credit</th></tr></thead><tbody>{preview.transactions.map(t=><tr key={t.id}><td>{t.date}</td><td>{t.description}</td><td>{t.brand}</td><td>{t.vehicle_number}</td><td>{t.bill_number}</td><td>{t.quantity_milli/1000||'—'}</td><td>{t.rate_paisa/100||'—'}</td><td className="debit-text">{t.debit_paisa/100||'—'}</td><td className="credit-text">{t.credit_paisa/100||'—'}</td></tr>)}</tbody></table></div>
     <label className="import-confirm"><input type="checkbox" checked={confirmed} onChange={e=>{e.stopPropagation();setConfirmed(e.target.checked);}}/>I checked the customer, opening balance and transactions{duplicate?' and want a separate customer with this name':''}.</label>
    </>}
   </>}
   {error&&<p className="error" role="alert">{error}</p>}
   <div className="modal-foot"><button type="button" className="button secondary" onClick={close} disabled={busy}>Cancel</button><button className="button primary" disabled={busy||!preview||!!preview.errors.length||!!validation||!confirmed}>{busy?'Working…':'Import customer & ledger'}</button></div>
  </form>
 </Modal>;
}
```

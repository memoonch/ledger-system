---
title: "Source: src/CashBookPage.tsx"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/CashBookPage.tsx"
sha256: "6998a2e232163b5d4fc2fdf0e3910f5e7177da7d68c739bb004bb463dd3fdd37"
tags: [shop-ledger, development]
---

# Source snapshot: src/CashBookPage.tsx

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/CashBookPage.tsx`.
- SHA-256 of original file bytes: `6998a2e232163b5d4fc2fdf0e3910f5e7177da7d68c739bb004bb463dd3fdd37`.
- Original bytes: 10897; source lines: 39.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`CashBookPage`.

## Complete source

```tsx
import {useEffect,useState,type FormEvent} from 'react';
import {Modal} from './forms';
import {cashDay,cashMoney,emptyCash,type CashMovement} from './cash';
import {wholeRupees,today,dateText,type Store} from './domain';
import {saveCashSettings,saveCashMovement,saveCashClosing} from './storage';
import {type JumpTarget} from './discovery';
const categories=['Labor wages','Loading / unloading','Truck rent','Electricity','Tea / office costs','Bank deposit','Bank withdrawal','Owner cash introduced','Owner drawings','Other'];
export default function CashBookPage({store,refresh,jump}:{jump?:JumpTarget;store:Store;refresh:()=>Promise<void>}){
 useEffect(()=>{if(jump?.entryId){const frame=requestAnimationFrame(()=>document.getElementById('cash-entry-'+jump.entryId)?.scrollIntoView({block:'center'}));return()=>cancelAnimationFrame(frame);}},[jump]);
 const cash=store.cash??emptyCash();const [date,setDate]=useState(jump?.date??today()),[dialog,setDialog]=useState<'setup'|'entry'|'close'|null>(null),[entry,setEntry]=useState<CashMovement|undefined>(),[expense,setExpense]=useState(true),[count,setCount]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 let day:ReturnType<typeof cashDay>|undefined,rangeError='';if(cash.settings)try{day=cashDay(cash,date);}catch(e){rangeError=(e as Error).message;}
 function open(type:typeof dialog){setError('');setDialog(type);}
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);setBusy(true);setError('');try{
  if(dialog==='setup')await saveCashSettings({opening_date:String(data.get('date')),opening_paisa:wholeRupees(String(data.get('amount')))});
  if(dialog==='entry'){const amount=wholeRupees(String(data.get('amount')));await saveCashMovement({id:entry?.id??crypto.randomUUID(),date:String(data.get('date')),description:String(data.get('description')).trim(),category:String(data.get('category')).trim(),in_paisa:data.get('direction')==='in'?amount:0,out_paisa:data.get('direction')==='out'?amount:0,source_type:'manual',source_id:'',account_name:'',created_at:entry?.created_at??new Date().toISOString(),voided:entry?.voided??0});}
  if(dialog==='close'){if(date>today())throw new Error('Cannot close a future date.');await saveCashClosing(date,wholeRupees(count),String(data.get('note')).trim());}
  await refresh();setDialog(null);setNotice('Cash book saved.');
 }catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 async function voidEntry(m:CashMovement){setError('');setBusy(true);try{await saveCashMovement({...m,voided:m.voided?0:1});await refresh();setNotice(m.voided?'Cash entry restored.':'Cash entry voided; history retained.');}catch(e){setError((e as Error).message);}finally{setBusy(false);}}
 const difference=day?.closing?day.closing.counted_paisa-day.closing.expected_paisa:0;
 return <>
 <div className="page-heading no-print"><div><div className="eyebrow">ROZNAMCHA · PHYSICAL COUNTER CASH</div><h1>Daily cash book</h1><p>Cash receipts, supplier cash payments, shop expenses and drawer closing.</p></div><button className="button secondary" onClick={()=>open('setup')}>{cash.settings?'Edit drawer opening':'Set drawer opening balance'}</button></div>
 <p className="form-note no-print">Only explicitly marked Cash payments enter this register. Cheques, bank transfers, material sales and returns are excluded. Old customer entries without a payment method are not assumed to be cash. Deleting an account keeps its cash history.</p>
 {error&&!dialog&&<p className="error no-print" role="alert">{error}</p>}{notice&&<p className="form-note no-print" role="status">{notice}</p>}
 {!cash.settings?<div className="welcome"><h2>Start with the cash in your drawer</h2><p>Choose a starting date and the physical cash available before that day’s first transaction.</p><button className="button primary" onClick={()=>open('setup')}>Set drawer opening balance</button></div>:<>
 <div className="supplier-actions cash-actions no-print"><label>Cash book date<input type="date" aria-label="Cash book date" value={date} onChange={e=>setDate(e.target.value)}/></label><button className="button primary" onClick={()=>{setEntry(undefined);setExpense(true);open('entry');}}>Add shop expense</button><button className="button secondary" onClick={()=>{setEntry(undefined);setExpense(false);open('entry');}}>Add cash in / out</button><button className="button secondary" disabled={!day||date>today()} onClick={()=>{setCount(String((day?.closing?.counted_paisa??0)/100));open('close');}}>Calculate / close day</button><button className="button secondary" disabled={!day} onClick={()=>window.print()}>Print A4</button></div>
 {rangeError&&<p className="error" role="alert">{rangeError}</p>}{day&&<>
 <div className="print-shop"><h1>{store.profile?.name??'Shop Name'}</h1><p>Daily cash book · {dateText(date)} · PKR</p></div><section className="stats-grid"><div className="stat-card"><div><p>Opening cash for this day</p><strong>Rs {cashMoney(day.opening)}</strong></div></div><div className="stat-card"><div><p>Cash in</p><strong className="credit-text">Rs {cashMoney(day.incoming)}</strong></div></div><div className="stat-card"><div><p>Cash out / expenses</p><strong className="debit-text">Rs {cashMoney(day.outgoing)}</strong></div></div></section>
 <article className="ledger-panel cash-book-panel"><div className="statement-meta"><span>{dateText(date)}</span><span>{day.rows.length} active cash movements</span></div><div className="table-scroll"><table className="ledger-table"><thead><tr><th>Description</th><th>Category</th><th>Account / source</th><th className="numeric">Cash in</th><th className="numeric">Cash out</th><th className="numeric">Drawer balance</th><th className="no-print">Action</th></tr></thead><tbody>{day.rows.map(m=><tr key={m.id} id={'cash-entry-'+m.id} className={jump?.entryId===m.id?'search-highlight':''}><td>{m.description}</td><td>{m.category}</td><td>{m.account_name||'Manual'}{m.source_type!=='manual'&&<small className="supplier-payment-details">Linked {m.source_type} payment</small>}</td><td className="numeric credit-text">{m.in_paisa?cashMoney(m.in_paisa):'—'}</td><td className="numeric debit-text">{m.out_paisa?cashMoney(m.out_paisa):'—'}</td><td className="numeric">{cashMoney(m.balance)}</td><td className="no-print">{m.source_type==='manual'?<><button className="row-edit" onClick={()=>{setEntry(m);open('entry');}}>Edit</button><button className="row-edit" disabled={busy} onClick={()=>void voidEntry(m)}>Void</button></>:<small>Edit in ledger</small>}</td></tr>)}{!day.rows.length&&<tr><td colSpan={7} className="empty-ledger">No cash movements on this date.</td></tr>}</tbody></table></div><div className="closing-strip"><div><span className="eyebrow">EXPECTED CASH IN DRAWER</span><p>Opening + cash in − cash out</p></div><strong className={day.expected<0?'debit-text':'neutral-text'}>Rs {cashMoney(day.expected)}</strong></div>
 {day.expected<0&&<p className="error">Expected cash is negative. Check the opening balance, missing receipts or cash withdrawals.</p>}
 {day.closing&&<div className="cash-closing"><h2>Saved closing count</h2><p>Expected when counted: Rs {cashMoney(day.closing.expected_paisa)} · Physical count: Rs {cashMoney(day.closing.counted_paisa)}</p><strong className={difference<0?'debit-text':'neutral-text'}>{difference===0?'Cash matches':difference<0?'Shortage: Rs '+cashMoney(-difference):'Excess: Rs '+cashMoney(difference)}</strong><p>{day.closing.note}</p><small>Saved {new Date(day.closing.closed_at).toLocaleString('en-GB')}</small>{day.stale&&<p className="error" role="alert">Cash records or the opening balance changed after this count. Recalculate and count again; the saved closing is out of date.</p>}</div>}
 </article><details className="no-print"><summary>Voided entries on this date</summary>{cash.movements.filter(m=>m.date===date&&m.voided).map(m=><p key={m.id}>{m.description} · Rs {cashMoney(m.in_paisa||m.out_paisa)} {m.source_type==='manual'&&<button className="button secondary compact" onClick={()=>void voidEntry(m)} disabled={busy}>Restore entry</button>}</p>)}</details><p className="form-note">Count differences do not create cash automatically. Record an explicit cash adjustment only after checking the cause. Expected cash carries forward across days.</p>
 </>}
 </>}
 {dialog&&<Modal key={dialog+(entry?.id??'')} title={dialog==='setup'?'Drawer opening balance':dialog==='close'?'End-of-day cash count':entry?'Edit cash entry':expense?'Shop expense':'Cash in / cash out'} subtitle="Physical counter cash only · PKR" close={()=>setDialog(null)} busy={busy}><form onSubmit={submit}><div className="form-grid">
 {dialog==='setup'?<><label>Starting date<input name="date" type="date" required min="1900-01-01" max="9999-12-31" defaultValue={cash.settings?.opening_date??today()}/></label><label>Opening physical cash (PKR)<input name="amount" required inputMode="numeric" defaultValue={(cash.settings?.opening_paisa??0)/100}/></label><p className="form-note full">Enter cash available before the first cash movement on this starting date. Earlier movements are excluded. Changing this makes affected saved closings out of date.</p></>:dialog==='close'?<><p className="full">{dateText(date)} · Expected: Rs {cashMoney(day?.expected??0)}</p><label className="full">Physical cash counted (PKR)<input required inputMode="numeric" value={count} onChange={e=>setCount(e.target.value)}/></label><label className="full">Closing note<textarea name="note" maxLength={500} defaultValue={day?.closing?.note}/></label></>:<><label>Date<input name="date" type="date" required min={cash.settings?.opening_date} max="9999-12-31" defaultValue={entry?.date??date}/></label><label>Direction<select name="direction" defaultValue={entry?(entry.in_paisa?'in':'out'):expense?'out':'in'}><option value="in">Cash in</option><option value="out">Cash out / expense</option></select></label><label className="full">Description<input name="description" required maxLength={240} defaultValue={entry?.description}/></label><label>Category<input name="category" list="cash-categories" required maxLength={240} defaultValue={entry?.category??(expense?'Labor wages':'Other')}/><datalist id="cash-categories">{categories.map(c=><option key={c} value={c}/>)}</datalist></label><label>Amount (PKR)<input name="amount" required inputMode="numeric" defaultValue={entry?(entry.in_paisa||entry.out_paisa)/100:''}/></label></>}
 </div>{error&&<p className="error" role="alert">{error}</p>}<div className="modal-foot"><button type="button" className="button secondary" disabled={busy} onClick={()=>setDialog(null)}>Cancel</button><button className="button primary" disabled={busy}>{busy?'Saving…':dialog==='close'?'Save closing count':'Save cash book'}</button></div></form></Modal>}
 </>;
}
```

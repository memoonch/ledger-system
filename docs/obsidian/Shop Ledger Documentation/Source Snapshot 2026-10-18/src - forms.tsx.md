---
title: "Source: src/forms.tsx"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src/forms.tsx"
sha256: "88f8f0123bacace261ccf79664ae2b02fcf54fab8e191fbf180502d27bc33c9d"
tags: [shop-ledger, development]
---

# Source snapshot: src/forms.tsx

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/forms.tsx`.
- SHA-256 of original file bytes: `88f8f0123bacace261ccf79664ae2b02fcf54fab8e191fbf180502d27bc33c9d`.
- Original bytes: 9757; source lines: 88.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`Modal`, `PartyForm`, `TransactionForm`.

## Complete source

```tsx
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';
import { decimal, wholeMaterialAmount, wholeRupees, money, today, type LedgerTransaction, type Party } from './domain';
import { uniqueOptions, type ShopProfile } from './profile';

export function Modal({ title, subtitle, children, close, busy = false }: { title: string; subtitle: string; children: ReactNode; close: () => void; busy?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const d = ref.current!; d.showModal(); return () => d.close(); }, []);
  return <dialog ref={ref} className="modal" onCancel={e => { e.preventDefault(); if (!busy) close(); }}>
    <div className="modal-head"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" aria-label="Close dialog" onClick={close} disabled={busy}><X size={20}/></button></div>
    {children}
  </dialog>;
}
export function PartyForm({ party, close, save, importExcel }: { importExcel?: () => void; party?: Party; close: () => void; save: (party: Party) => Promise<void> }) {
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const data = new FormData(event.currentTarget);
    try {
      setBusy(true);
      await save({
        id: party?.id ?? crypto.randomUUID(), name: String(data.get('name')).trim(), phone: String(data.get('phone')).trim(), address: String(data.get('address')).trim(),
        opening_date: String(data.get('opening_date')), opening_paisa: wholeRupees(String(data.get('opening'))) * (data.get('side') === 'CR' ? -1 : 1),
      });
      close();
    } catch (e) { setError(String(e instanceof Error ? e.message : e)); } finally { setBusy(false); }
  }
  return <Modal title={party ? 'Edit customer' : 'Add a customer'} subtitle="Start with their details and existing Khata balance." close={close} busy={busy}>
    {!party && importExcel && <div style={{padding: '0 24px 16px'}}><button type="button" className="button secondary" onClick={importExcel}>Import Excel / CSV instead</button></div>}
    <form onSubmit={submit}><div className="form-grid">
      <label className="full">Customer / contractor name<input autoFocus name="name" required maxLength={120} placeholder="e.g. Muhammad Aslam" defaultValue={party?.name}/></label>
      <label>Phone number<input name="phone" maxLength={50} placeholder="03xx xxxxxxx" defaultValue={party?.phone}/></label>
      <label>Opening balance date<input name="opening_date" required type="date" min="1900-01-01" max="9999-12-31" defaultValue={party?.opening_date ?? today()}/></label>
      <label className="full">Address<input name="address" maxLength={300} placeholder="Site or customer address" defaultValue={party?.address}/></label>
      <label>Opening balance (PKR)<input name="opening" required inputMode="numeric" defaultValue={String(Math.round(Math.abs(party?.opening_paisa ?? 0) / 100))}/></label>
      <label>Balance type<select name="side" defaultValue={(party?.opening_paisa ?? 0) < 0 ? 'CR' : 'DR'}><option value="DR">DR — Customer owes us</option><option value="CR">CR — Customer advance</option></select></label>
    </div><p className="form-note">Use zero if there is no previous balance. Transactions start on or after this date.</p>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="modal-foot"><button type="button" className="button secondary" onClick={close} disabled={busy}>Cancel</button><button className="button primary" disabled={busy}><Check size={16}/>{busy ? 'Saving…' : 'Save customer'}</button></div></form>
  </Modal>;
}
export function TransactionForm({ party, transaction, profile, transactions, close, save }: { profile: ShopProfile; transactions: LedgerTransaction[]; party: Party; transaction?: LedgerTransaction; close: () => void; save: (tx: LedgerTransaction) => Promise<void> }) {
  const [side, setSide] = useState(transaction?.credit_paisa ? 'CR' : 'DR');
  const [method, setMethod] = useState(transaction?.quantity_milli ? 'material' : 'amount');
  const [quantity, setQuantity] = useState(transaction?.quantity_milli ? String(transaction.quantity_milli / 1000) : '');
  const [rate, setRate] = useState(transaction?.rate_paisa ? String(Math.round(transaction.rate_paisa / 100)) : '');
  const [amount, setAmount] = useState(transaction ? String(Math.round((transaction.debit_paisa || transaction.credit_paisa) / 100)) : '');
  const [error, setError] = useState(''), [busy, setBusy] = useState(false);
  let computed = 0, calculationError = '';
  try { computed = method === 'material' ? wholeMaterialAmount(decimal(quantity, 3), wholeRupees(rate)) : wholeRupees(amount); } catch (e) { calculationError = (e as Error).message; }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const data = new FormData(event.currentTarget);
    try {
      if (calculationError) throw new Error(calculationError);
      if (computed <= 0) throw new Error('Enter an amount greater than zero.');
      setBusy(true);
      await save({
        id: transaction?.id ?? crypto.randomUUID(), party_id: party.id,
        date: String(data.get('date')), description: String(data.get('description')).trim(), brand: String(data.get('brand')).trim(),
        vehicle_number: String(data.get('vehicle')).trim(), bill_number: String(data.get('bill')).trim(),
        quantity_milli: method === 'material' ? decimal(quantity, 3) : 0, rate_paisa: method === 'material' ? wholeRupees(rate) : 0,
        debit_paisa: side === 'DR' ? computed : 0, credit_paisa: side === 'CR' ? computed : 0,
        created_at: transaction?.created_at ?? new Date().toISOString(),
      }); close();
    } catch (e) { setError(String(e instanceof Error ? e.message : e)); } finally { setBusy(false); }
  }
  return <Modal title={transaction ? 'Edit transaction' : 'Add transaction'} subtitle={party.name + ' · Customer ledger'} close={close} busy={busy}>
    <form onSubmit={submit}>
      <div className="side-selector"><button type="button" className={side === 'DR' ? 'selected debit-selected' : ''} onClick={() => setSide('DR')}><ArrowUpRight size={19}/><span>Debit <small>Materials / charges supplied</small></span></button><button type="button" className={side === 'CR' ? 'selected' : ''} onClick={() => setSide('CR')}><ArrowDownLeft size={19}/><span>Credit <small>Payment / material return</small></span></button></div>
      <div className="form-grid">
        <label>Date<input autoFocus type="date" name="date" required min={party.opening_date} max="9999-12-31" defaultValue={transaction?.date ?? (today() < party.opening_date ? party.opening_date : today())}/></label>
        <label>Bill / receipt number<input list="bills" name="bill" maxLength={80} placeholder="e.g. 1001" defaultValue={transaction?.bill_number}/><datalist id="bills">{uniqueOptions(transactions.map(t => t.bill_number)).map(value => <option key={value} value={value}/>)}</datalist></label>
        <label className="full">Description<input list="descriptions" name="description" required maxLength={240} placeholder="e.g. Cement, Cheque Received" defaultValue={transaction?.description}/><datalist id="descriptions">{uniqueOptions([...profile.descriptions, ...transactions.map(t => t.description)]).map(x => <option key={x} value={x}/>)}</datalist></label>
        <label>Brand<input name="brand" list="brands" maxLength={80} placeholder="e.g. Pak Cem" defaultValue={transaction?.brand}/><datalist id="brands">{uniqueOptions([...profile.brands, ...transactions.map(t => t.brand)]).map(value => <option key={value} value={value}/>)}</datalist></label>
        <label>Vehicle number<input list="vehicles" name="vehicle" maxLength={50} placeholder="e.g. LEA-2045" defaultValue={transaction?.vehicle_number}/><datalist id="vehicles">{uniqueOptions([...profile.vehicles, ...transactions.map(t => t.vehicle_number)]).map(value => <option key={value} value={value}/>)}</datalist></label>
        <label className="full">Amount calculation<select value={method} onChange={e => setMethod(e.target.value)}><option value="material">Quantity × rate</option><option value="amount">Enter amount directly</option></select></label>
        {method === 'material' ? <><label>Quantity<input required inputMode="decimal" placeholder="0.000" value={quantity} onChange={e => setQuantity(e.target.value)}/></label><label>Rate per unit (PKR)<input required inputMode="numeric" placeholder="0" value={rate} onChange={e => setRate(e.target.value)}/></label></> : <label className="full">Amount (PKR)<input required inputMode="numeric" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)}/></label>}
      </div>
      <div className="calculation"><span>{side === 'DR' ? 'Debit to customer' : 'Credit to customer'}<small>{method === 'material' ? 'Quantity × rate, rounded to the nearest rupee' : 'Payment, carriage, or other amount'}</small></span><strong className={side === 'DR' ? 'debit-text' : 'credit-text'}>Rs {money(computed)} {side}</strong></div>
      {transaction && <p className="form-note">Saving recalculates all subsequent balances, including statements.</p>}
      {error && <p className="error" role="alert">{error}</p>}
      <div className="modal-foot"><button type="button" className="button secondary" onClick={close} disabled={busy}>Cancel</button><button className="button primary" disabled={busy}><Check size={16}/>{busy ? 'Saving…' : 'Save transaction'}</button></div>
    </form>
  </Modal>;
}
```

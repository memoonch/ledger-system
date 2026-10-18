---
title: "Source: src/domain.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src/domain.ts"
sha256: "9e90bbc29200adf5a3562eb87024ffb7721e237647dc59e5caff8b9183c2cefc"
tags: [shop-ledger, development]
---

# Source snapshot: src/domain.ts

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/domain.ts`.
- SHA-256 of original file bytes: `9e90bbc29200adf5a3562eb87024ffb7721e237647dc59e5caff8b9183c2cefc`.
- Original bytes: 7358; source lines: 112.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`Party`, `LedgerTransaction`, `Store`, `LedgerRow`, `MAX_VALUE`, `today`, `validDate`, `decimal`, `materialAmount`, `money`, `balanceText`, `dateText`, `ordered`, `ledger`, `validateParty`, `validateTransaction`, `validateStore`, `wholeRupees`, `wholeMaterialAmount`, `balanceClass`.

## Complete source

```typescript
import { validateProfile, type ShopProfile } from './profile';
export interface Party {
  id: string; name: string; phone: string; address: string; opening_date: string; opening_paisa: number;
}
export interface LedgerTransaction {
  id: string; party_id: string; date: string; description: string; brand: string;
  vehicle_number: string; bill_number: string; quantity_milli: number; rate_paisa: number;
  debit_paisa: number; credit_paisa: number; created_at: string;
}
export interface Store { profile?: ShopProfile; parties: Party[]; transactions: LedgerTransaction[] }
export interface LedgerRow extends LedgerTransaction { balance: number }
export const MAX_VALUE = 100_000_000_000;
export function today() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function validDate(value: string) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value) || value < '1900-01-01' || value > '9999-12-31') return false;
  const d = new Date(value + 'T00:00:00Z');
  return !isNaN(d.valueOf()) && d.toISOString().slice(0, 10) === value;
}
export function decimal(value: string, places = 2): number {
  const text = value.trim();
  if (!new RegExp(`^\\d+(?:\\.\\d{1,${places}})?$`).test(text)) throw new Error(`Enter a positive number with up to ${places} decimal places.`);
  const [whole, fraction = ''] = text.split('.');
  const number = Number(whole) * 10 ** places + Number(fraction.padEnd(places, '0'));
  if (!Number.isSafeInteger(number) || number > MAX_VALUE) throw new Error('This number is too large.');
  return number;
}
export function materialAmount(quantity: number, rate: number) {
  const result = (BigInt(quantity) * BigInt(rate) + 500n) / 1000n;
  if (result > BigInt(MAX_VALUE)) throw new Error('The transaction amount is too large.');
  return Number(result);
}
export function money(paisa: number) {
  return (Math.abs(paisa) / 100).toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}
export function balanceText(paisa: number) { return `${money(paisa)}${paisa === 0 ? '' : paisa > 0 ? ' DR' : ' CR'}`; }
export function dateText(value: string) {
  return new Date(value + 'T00:00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}
export function ordered(transactions: LedgerTransaction[]) {
  return [...transactions].sort((a, b) => a.date.localeCompare(b.date) || a.created_at.localeCompare(b.created_at) || a.id.localeCompare(b.id));
}
export function ledger(party: Party, transactions: LedgerTransaction[], from = '', to = '') {
  if ((from && !validDate(from)) || (to && !validDate(to))) throw new Error('Choose valid dates.');
  if (from && to && from > to) throw new Error('The start date must be before the end date.');
  let balance = (!to || party.opening_date <= to) ? party.opening_paisa : 0;
  let broughtForward = from && party.opening_date < from ? party.opening_paisa : 0;
  let debit = 0, credit = 0;
  const rows: LedgerRow[] = [];
  for (const tx of ordered(transactions.filter(t => t.party_id === party.id))) {
    if (to && tx.date > to) continue;
    balance += tx.debit_paisa - tx.credit_paisa;
    if (from && tx.date < from) broughtForward += tx.debit_paisa - tx.credit_paisa;
    else { rows.push({ ...tx, balance }); debit += tx.debit_paisa; credit += tx.credit_paisa; }
  }
  const openingInPeriod = (!from || party.opening_date >= from) && (!to || party.opening_date <= to);
  return { rows, broughtForward, openingInPeriod, debit, credit, closing: balance };
}
export function validateParty(party: Party, transactions: LedgerTransaction[]) {
  if (typeof party.id !== 'string' || !party.id || typeof party.name !== 'string' || !party.name.trim() || party.name.length > 120) throw new Error('Enter a customer name (up to 120 characters).');
  if (!validDate(party.opening_date)) throw new Error('Choose a valid opening balance date.');
  if (!Number.isSafeInteger(party.opening_paisa) || Math.abs(party.opening_paisa) > MAX_VALUE) throw new Error('Invalid opening balance.');
  if (transactions.some(t => t.party_id === party.id && t.date < party.opening_date)) throw new Error('The opening date cannot be after an existing transaction.');
}
export function validateTransaction(tx: LedgerTransaction, party: Party) {
  if (!tx.id || tx.party_id !== party.id || !validDate(tx.date) || tx.date < party.opening_date) throw new Error('The transaction date must be on or after the opening balance date.');
  if (typeof tx.description !== 'string' || !tx.description.trim() || tx.description.length > 240) throw new Error('Enter a description (up to 240 characters).');
  for (const key of ['quantity_milli', 'rate_paisa', 'debit_paisa', 'credit_paisa'] as const) {
    if (!Number.isSafeInteger(tx[key]) || tx[key] < 0 || tx[key] > MAX_VALUE) throw new Error('Invalid transaction amount.');
  }
  if ((tx.debit_paisa > 0) === (tx.credit_paisa > 0)) throw new Error('An entry must contain either a debit or a credit greater than zero.');
  if (!tx.created_at || !Number.isFinite(Date.parse(tx.created_at))) throw new Error('Invalid entry creation date.');
}
export function validateStore(value: unknown): Store {
  const data = value as Store;
  if (!data || !Array.isArray(data.parties) || !Array.isArray(data.transactions)) throw new Error('Invalid backup file.');
  if (data.parties.length > 10000 || data.transactions.length > 100000) throw new Error('Backup exceeds the supported size.');
  const partyIds = new Set<string>(), txIds = new Set<string>();
  for (const party of data.parties) {
    if (!party || typeof party.phone !== 'string' || typeof party.address !== 'string') throw new Error('Invalid customer data.');
    validateParty(party, []);
    if (partyIds.has(party.id)) throw new Error('Duplicate customer in backup.');
    partyIds.add(party.id);
  }
  const partyMap = new Map(data.parties.map(p => [p.id, p]));
  for (const tx of data.transactions) {
    if (!tx) throw new Error('Invalid transaction data.');
    const party = partyMap.get(tx.party_id);
    if (!party || typeof tx.id !== 'string' || ['brand', 'vehicle_number', 'bill_number'].some(k => typeof tx[k as keyof LedgerTransaction] !== 'string')) throw new Error('Invalid transaction data.');
    validateTransaction(tx, party);
    if (txIds.has(tx.id)) throw new Error('Duplicate transaction in backup.');
    txIds.add(tx.id);
  }
  if (data.profile !== undefined) validateProfile(data.profile);
  return data;
}


export function wholeRupees(value: string): number {
  if (!/^\d+$/.test(value.trim())) throw new Error('Enter whole rupees without decimal points.');
  const result = Number(value.trim()) * 100;
  if (!Number.isSafeInteger(result) || result > MAX_VALUE) throw new Error('This amount is too large.');
  return result;
}
export function wholeMaterialAmount(quantity: number, rate: number) {
  const result = ((BigInt(quantity) * BigInt(rate) + 50000n) / 100000n) * 100n;
  if (result > BigInt(MAX_VALUE)) throw new Error('The transaction amount is too large.');
  return Number(result);
}
export function balanceClass(value: number) { return value > 0 ? 'debit-text' : value < 0 ? 'credit-text' : 'neutral-text'; }
```

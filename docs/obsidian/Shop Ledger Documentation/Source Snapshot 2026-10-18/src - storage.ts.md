---
title: "Source: src/storage.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src/storage.ts"
sha256: "1c636c747fb18bbdcded18affaee6f7c0546b9b7a9093ca61a520b9850868e3b"
tags: [shop-ledger, development]
---

# Source snapshot: src/storage.ts

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/storage.ts`.
- SHA-256 of original file bytes: `1c636c747fb18bbdcded18affaee6f7c0546b9b7a9093ca61a520b9850868e3b`.
- Original bytes: 6795; source lines: 104.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`desktop`, `loadStore`, `saveParty`, `saveTransaction`, `restoreStore`, `saveFile`, `readBackup`, `saveProfile`, `readSpreadsheet`, `importCustomer`.

## Complete source

```typescript
import { isTauri } from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';
import { validateParty, validateStore, validateTransaction, type Store, type Party, type LedgerTransaction } from './domain';
import { defaultProfile, validateProfile, type ShopProfile } from './profile';
export const desktop = isTauri();
const KEY = 'alfazal-browser-preview-v1';
let database: Promise<Database> | undefined;
function db() { return database ??= Database.load('sqlite:alfazal.db'); }
function browserRead(): Store {
  const raw = localStorage.getItem(KEY);
  return raw ? validateStore(JSON.parse(raw)) : { parties: [], transactions: [] };
}
export async function loadStore(): Promise<Store> {
  if (!desktop) return browserRead();
  const connection = await db();
  const profileRows = await connection.select<{ data: string }[]>('SELECT data FROM shop_profile WHERE id=1');
  return {
    profile: profileRows.length ? validateProfile(JSON.parse(profileRows[0].data)) : defaultProfile,
    parties: await connection.select<Party[]>('SELECT * FROM parties ORDER BY name COLLATE NOCASE'),
    transactions: await connection.select<LedgerTransaction[]>('SELECT * FROM ledger_transactions ORDER BY date, created_at, id'),
  };
}
export async function saveParty(party: Party, current: Store) {
  validateParty(party, current.transactions);
  if (!desktop) {
    const data = browserRead();
    data.parties = [...data.parties.filter(p => p.id !== party.id), party];
    localStorage.setItem(KEY, JSON.stringify(data)); return;
  }
  await (await db()).execute(
    'INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(id) DO UPDATE SET name=excluded.name,phone=excluded.phone,address=excluded.address,opening_date=excluded.opening_date,opening_paisa=excluded.opening_paisa',
    [party.id,party.name,party.phone,party.address,party.opening_date,party.opening_paisa]);
}
export async function saveTransaction(tx: LedgerTransaction, party: Party) {
  validateTransaction(tx, party);
  if (!desktop) {
    const data = browserRead();
    data.transactions = [...data.transactions.filter(t => t.id !== tx.id), tx];
    localStorage.setItem(KEY, JSON.stringify(data)); return;
  }
  await (await db()).execute(
    'INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,brand=excluded.brand,vehicle_number=excluded.vehicle_number,bill_number=excluded.bill_number,quantity_milli=excluded.quantity_milli,rate_paisa=excluded.rate_paisa,debit_paisa=excluded.debit_paisa,credit_paisa=excluded.credit_paisa',
    [tx.id,tx.party_id,tx.date,tx.description,tx.brand,tx.vehicle_number,tx.bill_number,tx.quantity_milli,tx.rate_paisa,tx.debit_paisa,tx.credit_paisa,tx.created_at]);
}
export async function restoreStore(value: unknown) {
  const validated = validateStore(value);
  const data = { ...validated, profile: validated.profile ?? (await loadStore()).profile ?? defaultProfile };
  if (!desktop) { localStorage.setItem(KEY, JSON.stringify(data)); return; }
  await (await db()).execute('INSERT INTO restore_requests(payload) VALUES ($1)', [JSON.stringify(data)]);
}
export async function saveFile(name: string, bytes: Uint8Array, extension: string): Promise<boolean> {
  if (desktop) {
    const [{ save }, { writeFile }] = await Promise.all([import('@tauri-apps/plugin-dialog'), import('@tauri-apps/plugin-fs')]);
    const path = await save({ defaultPath: name, filters: [{ name: extension.toUpperCase(), extensions: [extension] }] });
    if (!path) return false;
    await writeFile(path, bytes); return true;
  }
  const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: extension === 'pdf' ? 'application/pdf' : 'application/json' }));
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000); return true;
}
export async function readBackup(): Promise<string | null> {
  if (desktop) {
    const [{ open }, { readTextFile }] = await Promise.all([import('@tauri-apps/plugin-dialog'), import('@tauri-apps/plugin-fs')]);
    const path = await open({ multiple: false, filters: [{ name: 'Ledger backup', extensions: ['json'] }] });
    return path ? readTextFile(path) : null;
  }
  return new Promise(resolve => {
    const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
    input.onchange = async () => { resolve(input.files?.[0] ? await input.files[0].text() : null); };
    input.oncancel = () => resolve(null);
    input.click();
  });
}


export async function saveProfile(profile: ShopProfile) {
  validateProfile(profile);
  if (!desktop) { const data = browserRead(); data.profile = profile; localStorage.setItem(KEY, JSON.stringify(data)); return; }
  await (await db()).execute('UPDATE shop_profile SET data=$1 WHERE id=1', [JSON.stringify(profile)]);
}

export async function readSpreadsheet(): Promise<{name:string;bytes:Uint8Array}|null> {
 if(desktop) {
  const [{open},{readFile,stat}] = await Promise.all([import('@tauri-apps/plugin-dialog'),import('@tauri-apps/plugin-fs')]);
  const path=await open({multiple:false,filters:[{name:'Excel / CSV',extensions:['xlsx','csv']}]});
  if(!path)return null;
  if((await stat(path)).size>10*1024*1024)throw new Error('Choose a file smaller than 10 MB.');
  return {name:path.split(/[\\/]/).pop()!,bytes:await readFile(path)};
 }
 return new Promise((resolve,reject)=>{
  const input=document.createElement('input');input.type='file';input.accept='.xlsx,.csv';
  input.oncancel=()=>resolve(null);
  input.onchange=async()=>{try{const file=input.files?.[0];if(!file){resolve(null);return;}if(file.size>10*1024*1024)throw new Error('Choose a file smaller than 10 MB.');resolve({name:file.name,bytes:new Uint8Array(await file.arrayBuffer())});}catch(e){reject(e);}};
  input.click();
 });
}
export async function importCustomer(party:Party, transactions:LedgerTransaction[]) {
 const {validateImport}=await import('./import-ledger');validateImport(party,transactions);
 const current=await loadStore();
 validateStore({...current,parties:[...current.parties,party],transactions:[...current.transactions,...transactions]});
 if(!desktop){localStorage.setItem(KEY,JSON.stringify({...current,parties:[...current.parties,party],transactions:[...current.transactions,...transactions]}));return;}
 await (await db()).execute('INSERT INTO import_requests(payload) VALUES ($1)',[JSON.stringify({party,transactions})]);
}
```

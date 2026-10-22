---
title: "Source: src/storage.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/storage.ts"
sha256: "8d7f0737087df3261bb40932816da26abc13701a9fd223aed24b3f5f835d61e4"
tags: [shop-ledger, development]
---

# Source snapshot: src/storage.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/storage.ts`.
- SHA-256 of original file bytes: `8d7f0737087df3261bb40932816da26abc13701a9fd223aed24b3f5f835d61e4`.
- Original bytes: 15297; source lines: 184.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`desktop`, `loadStore`, `saveParty`, `saveTransaction`, `restoreStore`, `saveFile`, `readBackup`, `saveProfile`, `readSpreadsheet`, `importCustomer`, `setCustomerArchived`, `deleteCustomer`, `saveSupplier`, `saveSupplierEntries`, `setSupplierArchived`, `deleteSupplier`, `saveCashSettings`, `saveCashMovement`, `saveCashClosing`.

## Complete source

```typescript
import { emptyCash, syncCash, validateCash, cashDay, type CashData, type CashSettings, type CashMovement, type CashClosing } from './cash';
import { isTauri } from '@tauri-apps/api/core';
import Database from '@tauri-apps/plugin-sql';
import { validateParty, validateStore, validateTransaction, type Supplier, type SupplierTransaction, type Store, type Party, type LedgerTransaction } from './domain';
import { defaultProfile, validateProfile, type ShopProfile } from './profile';
export const desktop = isTauri();
const KEY = 'alfazal-browser-preview-v1';
let database: Promise<Database> | undefined;
function db() { return database ??= Database.load('sqlite:alfazal.db'); }
function browserRead(): Store {
  const raw = localStorage.getItem(KEY);
  const data:Store = raw ? validateStore(JSON.parse(raw)) : { parties: [], transactions: [] };
  if(!data.cash){data.cash=emptyCash();for(const tx of data.transactions)data.cash=syncCash(data.cash,[tx],[],'customer',data.parties.find(p=>p.id===tx.party_id)?.name??'');for(const tx of data.supplierTransactions??[])data.cash=syncCash(data.cash,[tx],[],'supplier',data.suppliers?.find(p=>p.id===tx.party_id)?.name??'');}
  return data;
}
export async function loadStore(): Promise<Store> {
  if (!desktop) return browserRead();
  const connection = await db();
  const profileRows = await connection.select<{ data: string }[]>('SELECT data FROM shop_profile WHERE id=1');
  return {
    profile: profileRows.length ? validateProfile(JSON.parse(profileRows[0].data)) : defaultProfile,
    cash: {settings:JSON.parse((await connection.select<{data:string}[]>('SELECT data FROM cash_settings WHERE id=1'))[0].data),movements:await connection.select<CashMovement[]>('SELECT * FROM cash_movements ORDER BY date,created_at,id'),closings:await connection.select<CashClosing[]>('SELECT * FROM cash_closings ORDER BY date')},
    suppliers: await connection.select<Supplier[]>('SELECT * FROM suppliers ORDER BY name COLLATE NOCASE'),
    supplierTransactions: await connection.select<SupplierTransaction[]>('SELECT * FROM supplier_transactions ORDER BY date, created_at, id'),
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
    'INSERT INTO parties (id,name,phone,address,opening_date,opening_paisa,opening_due_date) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT(id) DO UPDATE SET name=excluded.name,phone=excluded.phone,address=excluded.address,opening_date=excluded.opening_date,opening_paisa=excluded.opening_paisa,opening_due_date=excluded.opening_due_date',
    [party.id,party.name,party.phone,party.address,party.opening_date,party.opening_paisa,party.opening_due_date??'']);
}
export async function saveTransaction(tx: LedgerTransaction, party: Party) {
  validateTransaction(tx, party);
  if (!desktop) {
    const data = browserRead();
    data.cash = syncCash(data.cash??emptyCash(),[tx],[tx.id],'customer',party.name);
    data.transactions = [...data.transactions.filter(t => t.id !== tx.id), tx];
    localStorage.setItem(KEY, JSON.stringify(data)); return;
  }
  await (await db()).execute(
    'INSERT INTO ledger_transactions (id,party_id,date,description,brand,vehicle_number,bill_number,quantity_milli,rate_paisa,debit_paisa,credit_paisa,created_at,payment_method,due_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,brand=excluded.brand,vehicle_number=excluded.vehicle_number,bill_number=excluded.bill_number,quantity_milli=excluded.quantity_milli,rate_paisa=excluded.rate_paisa,debit_paisa=excluded.debit_paisa,credit_paisa=excluded.credit_paisa,payment_method=excluded.payment_method,due_date=excluded.due_date',
    [tx.id,tx.party_id,tx.date,tx.description,tx.brand,tx.vehicle_number,tx.bill_number,tx.quantity_milli,tx.rate_paisa,tx.debit_paisa,tx.credit_paisa,tx.created_at,tx.payment_method??'',tx.due_date??'']);
}
export async function restoreStore(value: unknown) {
  const validated = validateStore(value);
  const previous = await loadStore();
  const data = { ...validated, profile: validated.profile ?? previous.profile ?? defaultProfile, suppliers: validated.suppliers ?? previous.suppliers ?? [], supplierTransactions: validated.supplierTransactions ?? previous.supplierTransactions ?? [], cash: validated.cash ?? previous.cash ?? emptyCash() };
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


export async function setCustomerArchived(id: string, archived: boolean) {
  const current = await loadStore();
  if (!current.parties.some(p => p.id === id)) throw new Error('Customer no longer exists.');
  if (!desktop) {
    current.parties = current.parties.map(p => p.id === id ? {...p, archived: archived ? 1 : 0} : p);
    localStorage.setItem(KEY, JSON.stringify(current)); return;
  }
  await (await db()).execute('UPDATE parties SET archived=$1 WHERE id=$2', [archived ? 1 : 0, id]);
}
export async function deleteCustomer(id: string, confirmedName: string) {
  const current = await loadStore();
  const party = current.parties.find(p => p.id === id);
  if (!party || party.name !== confirmedName) throw new Error('Customer details changed. Reopen the customer and try again.');
  if (!desktop) {
    current.parties = current.parties.filter(p => p.id !== id);
    current.transactions = current.transactions.filter(t => t.party_id !== id);
    localStorage.setItem(KEY, JSON.stringify(current)); return;
  }
  const result = await (await db()).execute('DELETE FROM parties WHERE id=$1 AND name=$2', [id, confirmedName]);
  if (result.rowsAffected !== 1) throw new Error('Customer details changed. Reopen the customer and try again.');
}


export async function saveSupplier(supplier: Supplier) {
 const current=await loadStore();
 const next={...current,suppliers:[...(current.suppliers??[]).filter(p=>p.id!==supplier.id),supplier],supplierTransactions:current.supplierTransactions??[]};
 validateStore(next); validateParty(supplier,next.supplierTransactions);
 if(!desktop){localStorage.setItem(KEY,JSON.stringify(next));return;}
 await (await db()).execute('INSERT INTO suppliers (id,name,phone,address,opening_date,opening_paisa,archived,contact_person) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT(id) DO UPDATE SET name=excluded.name,phone=excluded.phone,address=excluded.address,opening_date=excluded.opening_date,opening_paisa=excluded.opening_paisa,contact_person=excluded.contact_person',[supplier.id,supplier.name,supplier.phone,supplier.address,supplier.opening_date,supplier.opening_paisa,supplier.archived??0,supplier.contact_person]);
}
export async function saveSupplierEntries(partyId:string, groupId:string, entries:SupplierTransaction[]) {
 if(!entries.length || entries.length>200 || entries.some(t=>t.party_id!==partyId||t.group_id!==groupId))throw new Error('Invalid supplier bill entries.');
 const current=await loadStore();
 if((current.supplierTransactions??[]).some(t=>t.group_id===groupId&&t.party_id!==partyId))throw new Error('Bill belongs to another supplier.');
 const next={...current,cash:syncCash(current.cash??emptyCash(),entries,(current.supplierTransactions??[]).filter(t=>t.group_id===groupId).map(t=>t.id),'supplier',(current.suppliers??[]).find(s=>s.id===partyId)?.name??''),suppliers:current.suppliers??[],supplierTransactions:[...(current.supplierTransactions??[]).filter(t=>t.group_id!==groupId),...entries]};
 validateStore(next);
 if(!desktop){localStorage.setItem(KEY,JSON.stringify(next));return;}
 await (await db()).execute('INSERT INTO supplier_bill_requests(payload) VALUES ($1)',[JSON.stringify({party_id:partyId,group_id:groupId,transactions:entries})]);
}
export async function setSupplierArchived(id:string, archived:boolean) {
 const current=await loadStore();if(!(current.suppliers??[]).some(s=>s.id===id))throw new Error('Supplier no longer exists.');
 if(!desktop){current.suppliers=(current.suppliers??[]).map(s=>s.id===id?{...s,archived:archived?1:0}:s);localStorage.setItem(KEY,JSON.stringify(current));return;}
 await (await db()).execute('UPDATE suppliers SET archived=$1 WHERE id=$2',[archived?1:0,id]);
}
export async function deleteSupplier(id:string,name:string) {
 const current=await loadStore();if(!(current.suppliers??[]).some(s=>s.id===id&&s.name===name))throw new Error('Supplier details changed. Reopen the account.');
 if(!desktop){current.suppliers=(current.suppliers??[]).filter(s=>s.id!==id);current.supplierTransactions=(current.supplierTransactions??[]).filter(t=>t.party_id!==id);localStorage.setItem(KEY,JSON.stringify(current));return;}
 const result=await (await db()).execute('DELETE FROM suppliers WHERE id=$1 AND name=$2',[id,name]);if(result.rowsAffected!==1)throw new Error('Supplier details changed. Reopen the account.');
}


export async function saveCashSettings(settings:CashSettings){
 const current=await loadStore(),cash={...(current.cash??emptyCash()),settings};validateCash(cash);
 if(!desktop){localStorage.setItem(KEY,JSON.stringify({...current,cash}));return;}
 await (await db()).execute('UPDATE cash_settings SET data=$1 WHERE id=1',[JSON.stringify(settings)]);
}
export async function saveCashMovement(entry:CashMovement){
 const current=await loadStore();if(entry.source_type!=='manual')throw new Error('Edit linked cash payments in their customer or supplier ledger.');
 const old=current.cash?.movements.find(m=>m.id===entry.id);if(old&&old.source_type!=='manual')throw new Error('Cannot overwrite a linked payment.');
 const cash={...(current.cash??emptyCash()),movements:[...(current.cash?.movements??[]).filter(m=>m.id!==entry.id),entry]};validateCash(cash);
 if(!desktop){localStorage.setItem(KEY,JSON.stringify({...current,cash}));return;}
 await (await db()).execute("INSERT INTO cash_movements(id,date,description,category,in_paisa,out_paisa,source_type,source_id,account_name,created_at,voided) VALUES ($1,$2,$3,$4,$5,$6,'manual','','',$7,$8) ON CONFLICT(id) DO UPDATE SET date=excluded.date,description=excluded.description,category=excluded.category,in_paisa=excluded.in_paisa,out_paisa=excluded.out_paisa,voided=excluded.voided WHERE cash_movements.source_type='manual'",[entry.id,entry.date,entry.description,entry.category,entry.in_paisa,entry.out_paisa,entry.created_at,entry.voided]);
}
export async function saveCashClosing(date:string,counted:number,note:string){
 const current=await loadStore(),cash=current.cash??emptyCash(),day=cashDay(cash,date);
 const closing:CashClosing={date,expected_paisa:day.expected,counted_paisa:counted,signature:day.signature,note,closed_at:new Date().toISOString()};
 const next={...cash,closings:[...cash.closings.filter(c=>c.date!==date),closing]};validateCash(next);
 if(!desktop){localStorage.setItem(KEY,JSON.stringify({...current,cash:next}));return;}
 await (await db()).execute('INSERT INTO cash_closings(date,expected_paisa,counted_paisa,signature,note,closed_at) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT(date) DO UPDATE SET expected_paisa=excluded.expected_paisa,counted_paisa=excluded.counted_paisa,signature=excluded.signature,note=excluded.note,closed_at=excluded.closed_at',[date,closing.expected_paisa,counted,day.signature,note,closing.closed_at]);
}
```

import { validateCash, type CashData } from './cash';
import { validateProfile, type ShopProfile } from './profile';
export interface Party {
  opening_due_date?: string; archived?: number; id: string; name: string; phone: string; address: string; opening_date: string; opening_paisa: number;
}
export interface LedgerTransaction {
  id: string; party_id: string; date: string; description: string; brand: string;
  vehicle_number: string; bill_number: string; quantity_milli: number; rate_paisa: number;
  due_date?: string; debit_paisa: number; credit_paisa: number; created_at: string; payment_method?: '' | 'Cash' | 'Cheque' | 'Bank transfer';
}
export interface Supplier extends Party { contact_person: string }
export interface SupplierTransaction extends LedgerTransaction {
  group_id: string; entry_type: 'purchase' | 'payment' | 'return'; unit: string;
  payment_method: '' | 'Cash' | 'Cheque' | 'Bank transfer'; reference: string;
}
export interface Store { cash?: CashData; suppliers?: Supplier[]; supplierTransactions?: SupplierTransaction[]; profile?: ShopProfile; parties: Party[]; transactions: LedgerTransaction[] }
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
  if(party.opening_due_date !== undefined && (typeof party.opening_due_date !== 'string' || party.opening_due_date && (!validDate(party.opening_due_date)||party.opening_due_date<party.opening_date||party.opening_paisa<=0)))throw new Error('Opening due date is only for a debit opening balance and must be on or after its date.');
  if (party.archived !== undefined && party.archived !== 0 && party.archived !== 1) throw new Error('Invalid customer archive status.');
  if (typeof party.id !== 'string' || !party.id || typeof party.name !== 'string' || !party.name.trim() || party.name.length > 120) throw new Error('Enter a customer name (up to 120 characters).');
  if (!validDate(party.opening_date)) throw new Error('Choose a valid opening balance date.');
  if (!Number.isSafeInteger(party.opening_paisa) || Math.abs(party.opening_paisa) > MAX_VALUE) throw new Error('Invalid opening balance.');
  if (transactions.some(t => t.party_id === party.id && t.date < party.opening_date)) throw new Error('The opening date cannot be after an existing transaction.');
}
export function validateTransaction(tx: LedgerTransaction, party: Party) {
  if(tx.due_date !== undefined && (typeof tx.due_date !== 'string' || tx.due_date && (!validDate(tx.due_date)||tx.due_date<tx.date||tx.debit_paisa<=0||!!tx.payment_method)))throw new Error('Due date is only for a debit charge and must be on or after its transaction date.');
  if(tx.payment_method !== undefined && !['','Cash','Cheque','Bank transfer'].includes(tx.payment_method))throw new Error('Invalid payment method.');
  if(tx.payment_method && (tx.quantity_milli || tx.rate_paisa))throw new Error('Payments must use a direct amount without material quantity/rate.');
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
  validateSuppliers(data);
  if(data.cash !== undefined) validateCash(data.cash);
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

export function validateSuppliers(data: Store) {
  if ((data.suppliers === undefined) !== (data.supplierTransactions === undefined)) throw new Error('Supplier accounts and transactions must both be present.');
  if (data.suppliers === undefined) return;
  if (!Array.isArray(data.suppliers) || !Array.isArray(data.supplierTransactions) || data.suppliers.length > 10000 || data.supplierTransactions.length > 100000) throw new Error('Invalid supplier data.');
  const map = new Map<string,Supplier>();
  for (const supplier of data.suppliers) {
    if (!supplier || typeof supplier.phone !== 'string' || typeof supplier.address !== 'string' || typeof supplier.contact_person !== 'string' || supplier.contact_person.length > 120) throw new Error('Invalid supplier details.');
    validateParty(supplier, []); if(map.has(supplier.id)) throw new Error('Duplicate supplier.'); map.set(supplier.id,supplier);
  }
  const ids = new Set<string>(), groups = new Map<string,string>(), groupSizes = new Map<string,number>();
  let absoluteTotal = data.suppliers.reduce((n,s)=>n+Math.abs(s.opening_paisa),0);
  for (const tx of data.supplierTransactions!) {
    const supplier = tx && map.get(tx.party_id); if (!supplier) throw new Error('Missing supplier for transaction.');
    validateSupplierTransaction(tx,supplier);
    if(ids.has(tx.id)) throw new Error('Duplicate supplier transaction.'); ids.add(tx.id);
    absoluteTotal += tx.debit_paisa + tx.credit_paisa;
    if(!Number.isSafeInteger(absoluteTotal))throw new Error('Supplier totals exceed the supported size.');
    const size=(groupSizes.get(tx.group_id)??0)+1; groupSizes.set(tx.group_id,size);
    if(size>200 || (tx.entry_type==='payment' && size>1))throw new Error('Invalid supplier bill size.');
    const signature=JSON.stringify([tx.party_id,tx.entry_type,tx.date,tx.bill_number,tx.vehicle_number]);
    if(groups.has(tx.group_id) && groups.get(tx.group_id)!==signature) throw new Error('Inconsistent supplier bill group.'); groups.set(tx.group_id,signature);
  }
}
export function validateSupplierTransaction(tx: SupplierTransaction, supplier: Supplier) {
  if(typeof tx.id!=='string')throw new Error('Invalid supplier transaction identifier.');
  validateTransaction(tx,supplier);
  if (!tx.group_id || typeof tx.group_id !== 'string' || !['purchase','payment','return'].includes(tx.entry_type)) throw new Error('Invalid supplier entry type or bill group.');
  for (const key of ['brand','vehicle_number','bill_number','unit','reference'] as const) if(typeof tx[key]!=='string' || tx[key].length > (key==='reference'?120:80)) throw new Error('Invalid supplier transaction details.');
  if(tx.entry_type==='purchase' && !tx.credit_paisa || tx.entry_type!=='purchase' && !tx.debit_paisa) throw new Error('Purchases must be credit; payments and returns must be debit.');
  if(tx.entry_type==='payment') {
    if(!['Cash','Cheque','Bank transfer'].includes(tx.payment_method)) throw new Error('Choose a payment method.');
    if(tx.payment_method!=='Cash' && !tx.reference.trim()) throw new Error('Enter the cheque or bank reference number.');
    if(tx.quantity_milli || tx.rate_paisa || tx.unit) throw new Error('Payments cannot contain material quantities.');
  } else {
    if(tx.payment_method!=='' || tx.reference) throw new Error('Purchase/return lines cannot contain payment details.');
    if(!tx.bill_number.trim()) throw new Error('Enter a supplier bill / invoice number.');
    if(!tx.unit.trim() || !tx.quantity_milli || !tx.rate_paisa) throw new Error('Enter quantity, unit and rate for each line.');
    const amount=wholeMaterialAmount(tx.quantity_milli,tx.rate_paisa);
    if((tx.credit_paisa||tx.debit_paisa)!==amount) throw new Error('Supplier line amount must match quantity × rate.');
  }
}
export function supplierBalanceClass(value: number) { return balanceClass(-value); }
export function supplierBalanceLabel(value: number) { return value < 0 ? 'You owe supplier' : value > 0 ? 'Your advance with supplier' : 'Account is settled'; }

export function backupData(data:Store) {
 return {format:'shop-ledger',version:5,exported_at:new Date().toISOString(),data:{...data,suppliers:data.suppliers??[],supplierTransactions:data.supplierTransactions??[],cash:data.cash??{settings:null,movements:[],closings:[]}}};
}
export function decodeBackup(raw:string):Store {
 const parsed=JSON.parse(raw);
 if(!((parsed.format==='alfazal-ledger'&&parsed.version===1)||(parsed.format==='shop-ledger'&&[2,3,4,5].includes(parsed.version))))throw new Error('Choose a supported Shop Ledger backup.');
 if(parsed.version>=3 && (!Array.isArray(parsed.data?.suppliers)||!Array.isArray(parsed.data?.supplierTransactions)))throw new Error('Backup is missing supplier data.');
 if(parsed.version>=4 && !parsed.data?.cash)throw new Error('Backup is missing cash book data.');
 return validateStore(parsed.data);
}

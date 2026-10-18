import { useEffect, useMemo, useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, BookOpen, Building2, CheckCircle2, ChevronRight, Download, FileText, FolderOpen, HardDrive, Landmark, LoaderCircle, Pencil, Plus, Printer, Search, ShieldCheck, Upload, Users, X } from 'lucide-react';
import { backupData, decodeBackup, balanceClass, balanceText, dateText, ledger, money, today, validDate, validateStore, type LedgerTransaction, type Party, type Store } from './domain';
import { desktop, loadStore, readBackup, restoreStore, saveFile, saveParty, saveTransaction, saveProfile, importCustomer, setCustomerArchived, deleteCustomer } from './storage';
import { Modal, PartyForm, TransactionForm } from './forms';
import { sampleStore } from './sample';
import ImportCustomer from './ImportCustomer';
import DeleteCustomer from './DeleteCustomer';
import CashBookPage from './CashBookPage';
import SupplierPage from './SupplierPage';
import ProfilePage from './ProfilePage';
import { defaultProfile } from './profile';

type Dialog = { type: 'delete'; party: Party } | { type: 'import' } | { type: 'party'; party?: Party } | { type: 'transaction'; transaction?: LedgerTransaction } | { type: 'restore'; store: Store };
export default function App() {
  const [store, setStore] = useState<Store>({ parties: [], transactions: [] });
  const [loading, setLoading] = useState(true), [busy, setBusy] = useState(false);
  const [storageReady, setStorageReady] = useState(false);
  const [selected, setSelected] = useState(''), [search, setSearch] = useState('');
  const [from, setFrom] = useState(''), [to, setTo] = useState(''), [period, setPeriod] = useState('all');
  const [dialog, setDialog] = useState<Dialog | null>(null);
  const [error, setError] = useState(''), [notice, setNotice] = useState('');
  const [customerView, setCustomerView] = useState('active');
  const [page, setPage] = useState<'ledger' | 'profile' | 'suppliers' | 'cash'>('ledger');
  const profile = store.profile ?? defaultProfile;
  useEffect(() => { document.title = profile.name + ' | Shop Ledger'; }, [profile.name]);
  const party = store.parties.find(p => p.id === selected);
  async function refresh(select?: string) {
    const next = await loadStore(); setStore(next); setStorageReady(true);
    setSelected(previous => select ?? (next.parties.some(p => p.id === previous) ? previous : next.parties[0]?.id ?? ''));
  }
  useEffect(() => {
    let alive = true;
    loadStore().then(data => { if (alive) { setStore(data); setStorageReady(true); setSelected(data.parties[0]?.id ?? ''); setError(''); } })
      .catch(e => { if (alive) setError('Unable to open ledger storage: ' + String(e)); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);
  useEffect(() => { if (!notice) return; const id = setTimeout(() => setNotice(''), 5000); return () => clearTimeout(id); }, [notice]);
  const summaries = useMemo(() => store.parties.map(p => ({ party: p, balance: ledger(p, store.transactions).closing })).sort((a,b) => a.party.name.localeCompare(b.party.name)), [store]);
  const outstanding = summaries.reduce((s, p) => s + Math.max(0, p.balance), 0);
  const advances = summaries.reduce((s, p) => s + Math.max(0, -p.balance), 0);
  const visible = summaries.filter(({party:p}) => customerView === 'all' || (customerView === 'archived' ? p.archived === 1 : p.archived !== 1));
  useEffect(() => { if (!visible.some(p => p.party.id === selected)) setSelected(visible[0]?.party.id ?? ''); }, [store, customerView, selected]);
  const filtered = visible.filter(p => (p.party.name + ' ' + p.party.phone).toLowerCase().includes(search.toLowerCase()));
  const rangeError = ((from && !validDate(from)) || (to && !validDate(to))) ? 'Choose valid statement dates.' : from && to && from > to ? 'Start date must be on or before the end date.' : '';
  const statement = party && !rangeError ? ledger(party, store.transactions, from, to) : null;
  function setRange(value: string) {
    setPeriod(value);
    const now = new Date();
    if (value === 'all') { setFrom(''); setTo(''); return; }
    const offset = value === 'last' ? -1 : 0;
    const start = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const end = new Date(now.getFullYear(), now.getMonth() + offset + 1, 0);
    const local = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    setFrom(local(start)); setTo(local(end));
  }
  async function perform(action: () => Promise<void>) {
    setBusy(true); setError('');
    try { await action(); } catch (e) { setError(String(e instanceof Error ? e.message : e)); } finally { setBusy(false); }
  }
  async function backup(data = store, filename = 'shop-backup-' + today() + '.json') {
    return saveFile(filename, new TextEncoder().encode(JSON.stringify(backupData(data), null, 2)), 'json');
  }
  async function chooseRestore() {
    const raw = await readBackup(); if (!raw) return;
    setDialog({ type: 'restore', store: decodeBackup(raw) });
  }
  async function exportPdf() {
    if (!party || rangeError) return;
    const { statementPdf } = await import('./pdf');
    const doc = statementPdf(party, store.transactions, from, to, profile);
    const filename = party.name.replace(/[^a-z0-9]+/gi, '-').slice(0, 60) + '-ledger-' + (from || 'all') + '-' + (to || today()) + '.pdf';
    if (await saveFile(filename, new Uint8Array(doc.output('arraybuffer')), 'pdf')) setNotice('PDF statement exported.');
  }
  return <div className="app-shell">
    <aside className="sidebar no-print">
      <button className="brand" aria-label="Open shop profile" title="Edit shop profile" onClick={() => setPage('profile')} disabled={loading || !storageReady}><span className="brand-mark"><Building2 size={25}/></span><span>{profile.name}<small>{profile.tagline}</small></span></button>
      <div className="sidebar-label">WORKSPACE</div>
      <button className={'nav-item ' + (page === 'ledger' ? 'nav-active' : '')} onClick={() => setPage('ledger')}><BookOpen size={18}/><span>Customer ledgers</span><ChevronRight size={15}/></button>
      <button className={'nav-item ' + (page === 'suppliers' ? 'nav-active' : '')} onClick={() => setPage('suppliers')}><Landmark size={18}/><span>Supplier ledgers</span><ChevronRight size={15}/></button>
      <button className={'nav-item ' + (page === 'cash' ? 'nav-active' : '')} onClick={() => setPage('cash')}><HardDrive size={18}/><span>Daily cash book</span><ChevronRight size={15}/></button>
      <div className="sidebar-context"><Landmark size={19}/><p>Your shop.<br/>Your records.<br/><strong>Always with you.</strong></p></div>
      <div className="sidebar-bottom">
        <div className="sidebar-label">YOUR DATA</div>
        <button onClick={() => void perform(async () => { if (await backup()) setNotice('Backup exported. Keep a copy on a separate drive.'); })} disabled={busy || loading || !storageReady}><Download size={17}/>Back up records</button>
        <button onClick={() => void perform(chooseRestore)} disabled={busy || loading || !storageReady}><Upload size={17}/>Restore backup</button>
        <div className="storage-status"><span className="status-dot"/><div>{desktop ? 'Stored on this computer' : 'Browser preview'}<small>{desktop ? 'Local SQLite database' : 'Separate preview data'}</small></div><ShieldCheck size={17}/></div>
      </div>
    </aside>
    <div className="main-shell">
      <header className="topbar no-print"><div>Workspace <ChevronRight size={13}/><strong>{page === 'profile' ? 'Shop profile' : page === 'suppliers' ? 'Supplier ledgers' : page === 'cash' ? 'Daily cash book' : 'Customer ledgers'}</strong></div><span><span className="status-dot"/>{desktop ? 'Offline ready' : 'Preview mode'}<span className="topbar-divider"/>PKR</span></header>
      <main>
        {error && (page === 'suppliers' || page === 'cash') && <p className="error no-print" role="alert">{error}</p>}
        {page === 'profile' ? <ProfilePage key={JSON.stringify(profile)} profile={profile} back={() => setPage('ledger')} save={async next => { await saveProfile(next); await refresh(); setNotice('Shop profile saved.'); }}/> : page === 'cash' ? loading || !storageReady ? <p>Opening cash book…</p> : <CashBookPage store={store} refresh={refresh}/> : page === 'suppliers' ? loading || !storageReady ? <p>Opening supplier ledgers…</p> : <SupplierPage store={store} refresh={refresh} backup={backup}/> : <>
        <div className="page-heading no-print"><div><div className="eyebrow">THE SHOP'S KHATA</div><h1>Customer ledgers</h1><p>A clear record of every delivery, payment, and balance.</p></div><button className="button primary" disabled={loading || busy || !storageReady} onClick={() => setDialog({ type: 'party' })}><Plus size={18}/>Add customer</button></div>

        {!desktop && <div className="preview-banner no-print"><HardDrive size={17}/><span><strong>Browser preview.</strong> Records here are separate from the desktop app's SQLite database.</span>{!store.parties.length && !loading && storageReady && <button disabled={busy} onClick={() => void perform(async () => { await restoreStore(sampleStore()); await refresh('demo-1'); setNotice('Sample customers loaded for preview.'); })}>Try sample data <ChevronRight size={14}/></button>}</div>}
        {error && <div className="error page-error no-print" role="alert">{error}<button className="icon-button" aria-label="Dismiss error" onClick={() => setError('')}><X size={16}/></button></div>}
        <section className="stats-grid no-print" aria-label="Shop balances">
          <div className="stat-card"><span className="stat-icon receivable"><ArrowUpRight size={21}/></span><div><p>Total receivable</p><strong className="debit-text"><small>Rs</small> {money(outstanding)}</strong><span>Includes archived customer balances · DR</span></div></div>
          <div className="stat-card"><span className="stat-icon advance"><ArrowDownLeft size={21}/></span><div><p>Customer advances</p><strong className="credit-text"><small>Rs</small> {money(advances)}</strong><span>Includes archived customer advances · CR</span></div></div>
          <div className="stat-card"><span className="stat-icon people"><Users size={21}/></span><div><p>Customers</p><strong>{store.parties.length.toString().padStart(2, '0')}</strong><span>{store.transactions.length} recorded transactions</span></div></div>
        </section>
        {loading ? <div className="loading"><LoaderCircle className="spin"/>Opening your ledgers…</div> : <section className="ledger-workspace">
          <aside className="customer-panel no-print"><div className="customer-panel-head"><h2>Customers <span>{store.parties.length}</span></h2><button className="icon-button" aria-label="Add customer" disabled={busy} onClick={() => setDialog({ type: 'party' })}><Plus size={18}/></button></div><label className="search-box"><Search size={16}/><input aria-label="Search customers" placeholder="Search name or phone…" value={search} onChange={e => setSearch(e.target.value)}/></label>
            <select className="customer-status-filter" aria-label="Customer status" value={customerView} onChange={e => setCustomerView(e.target.value)}><option value="active">Active customers</option><option value="archived">Archived customers</option><option value="all">All customers</option></select><div className="customer-list">{filtered.map(({ party: p, balance }) => <button key={p.id} className={'customer-item ' + (selected === p.id ? 'active' : '')} onClick={() => setSelected(p.id)}><span className="avatar">{p.name.split(' ').slice(0,2).map(x => x[0]).join('').toUpperCase()}</span><span className="customer-copy"><strong>{p.name}{p.archived === 1 ? ' · Archived' : ''}</strong><small className={balanceClass(balance)}>Rs {balanceText(balance)}</small></span>{selected === p.id && <ChevronRight size={15}/>}</button>)}
            {!filtered.length && <p className="list-empty">{search ? 'No matching customers.' : customerView === 'archived' ? 'No archived customers.' : 'No customers in this list.'}</p>}</div>
            <div className="customer-panel-foot"><span className="status-dot"/>All amounts in Pakistani Rupees</div>
          </aside>
          {party && statement ? <article className="ledger-panel">
            {party.archived === 1 && <div className="archived-banner no-print">Archived customer — ledger retained. Use Edit customer to restore them.</div>}<header className="ledger-heading"><div className="print-shop"><h1>{profile.name}</h1><p>{profile.tagline}</p><p>{[profile.owner, profile.phone, profile.email, profile.address].filter(Boolean).join(' · ')}</p><p>Customer account statement · All amounts in PKR</p></div><div className="ledger-title"><span className="eyebrow">CUSTOMER ACCOUNT</span><h2>{party.name}<button className="icon-button no-print" aria-label="Edit customer" onClick={() => setDialog({ type: 'party', party })}><Pencil size={14}/></button></h2><p>{[party.phone,party.address].filter(Boolean).join(' · ') || 'Customer details can be added using the edit button.'}</p></div><div className="ledger-actions no-print"><button className="button secondary compact" disabled={busy} onClick={() => void perform(exportPdf)}><Download size={15}/>PDF</button><button className="button secondary compact" disabled={busy} onClick={() => window.print()}><Printer size={15}/>Print A4</button></div></header>
            <div className="ledger-toolbar no-print"><div className="date-filters"><select aria-label="Statement period" value={period} onChange={e => { if (e.target.value === 'custom') setPeriod('custom'); else setRange(e.target.value); }}><option value="all">All time</option><option value="this">This month</option><option value="last">Last month</option><option value="custom">Custom dates</option></select><label><span>From</span><input aria-label="From date" type="date" min="1900-01-01" max="9999-12-31" value={from} onChange={e => { setFrom(e.target.value); setPeriod('custom'); }}/></label><span className="date-separator">—</span><label><span>To</span><input aria-label="To date" type="date" min="1900-01-01" max="9999-12-31" value={to} onChange={e => { setTo(e.target.value); setPeriod('custom'); }}/></label></div><button className="button primary compact" disabled={busy} onClick={() => setDialog({ type: 'transaction' })}><Plus size={16}/>Add transaction</button></div>
            <div className="statement-meta"><span>{from || to ? `${from ? dateText(from) : 'Beginning'} — ${to ? dateText(to) : 'Latest entry'}` : 'Complete account history'}</span><span>{statement.rows.length} transactions <span className="no-print">· Scroll to see all columns</span></span></div>
            <div className="table-scroll"><table className="ledger-table"><thead><tr><th>Date</th><th>Description</th><th>Brand</th><th>Vehicle no.</th><th>Bill no.</th><th className="numeric">Quantity</th><th className="numeric">Rate</th><th className="numeric">Debit (DR)</th><th className="numeric">Credit (CR)</th><th className="numeric">Balance</th><th className="no-print"><span className="sr-only">Actions</span></th></tr></thead><tbody>
              {from && <tr className="opening-row"><td>{dateText(from)}</td><td colSpan={8}><span>Balance brought forward</span></td><td className={'numeric balance-cell ' + balanceClass(statement.broughtForward)}>{balanceText(statement.broughtForward)}</td><td className="no-print"/></tr>}
              {statement.openingInPeriod && <tr className="opening-row"><td>{dateText(party.opening_date)}</td><td colSpan={8}><span>Opening balance</span></td><td className={'numeric balance-cell ' + balanceClass(party.opening_paisa)}>{balanceText(party.opening_paisa)}</td><td className="no-print"><button className="row-edit" aria-label="Edit opening balance" onClick={() => setDialog({ type: 'party', party })}><Pencil size={13}/></button></td></tr>}

              {statement.rows.map(tx => <tr key={tx.id}><td className="date-cell">{dateText(tx.date)}</td><td className="description-cell">{tx.description}</td><td>{tx.brand || '—'}</td><td>{tx.vehicle_number || '—'}</td><td>{tx.bill_number || '—'}</td><td className="numeric">{tx.quantity_milli ? (tx.quantity_milli/1000).toLocaleString('en-PK', { maximumFractionDigits: 3 }) : '—'}</td><td className="numeric">{tx.rate_paisa ? money(tx.rate_paisa) : '—'}</td><td className="numeric debit-text">{tx.debit_paisa ? money(tx.debit_paisa) : '—'}</td><td className="numeric credit-text">{tx.credit_paisa ? money(tx.credit_paisa) : '—'}</td><td className={'numeric balance-cell ' + balanceClass(tx.balance)}>{balanceText(tx.balance)}</td><td className="no-print"><button className="row-edit" aria-label={'Edit ' + tx.description + ' on ' + tx.date} onClick={() => setDialog({ type: 'transaction', transaction: tx })}><Pencil size={13}/></button></td></tr>)}
              {!statement.rows.length && <tr><td colSpan={11} className="empty-ledger"><FileText size={27}/><strong>{store.transactions.some(t => t.party_id === party.id) ? 'No transactions in this period' : 'A fresh page in your Khata'}</strong><span>{store.transactions.some(t => t.party_id === party.id) ? 'Choose different dates to see more records.' : 'Record a delivery, payment, or charge to get started.'}</span></td></tr>}
            </tbody><tfoot><tr><td colSpan={7}>Period totals / Closing balance</td><td className="numeric debit-text">{money(statement.debit)}</td><td className="numeric credit-text">{money(statement.credit)}</td><td className={'numeric balance-cell ' + balanceClass(statement.closing)}>{balanceText(statement.closing)}</td><td className="no-print"/></tr></tfoot></table></div>
            <footer className="ledger-footer"><div><span className="legend-dot debit"/>DR: customer owes the shop<span className="legend-dot credit"/>CR: customer advance</div><span>Opening balance is separate from period totals.</span></footer>
            <p className="statement-note">{profile.statement_note}</p><div className="closing-strip"><div><span className="eyebrow">CLOSING BALANCE</span><p>{statement.closing > 0 ? 'Amount receivable from customer' : statement.closing < 0 ? 'Advance held for customer' : 'Account is settled'}</p></div><strong className={balanceClass(statement.closing)}><small>Rs</small> {balanceText(statement.closing)}</strong></div>
          </article> : rangeError && party ? <article className="ledger-panel"><div className="ledger-toolbar date-filters"><label>From<input aria-label="From date" type="date" value={from} onChange={e => setFrom(e.target.value)}/></label><label>To<input aria-label="To date" type="date" value={to} onChange={e => setTo(e.target.value)}/></label><button className="button secondary" onClick={() => setRange('all')}>Reset dates</button></div><p className="error" role="alert">{rangeError}</p></article> : <div className="welcome"><span className="welcome-icon"><BookOpen size={38}/></span><span className="eyebrow">A BETTER WAY TO KEEP YOUR KHATA</span><h2>{store.parties.length ? 'Choose a customer list' : <>Every customer. Every entry.<br/>One clear balance.</>}</h2><p>{store.parties.length ? 'Use the customer status filter to find active or archived customers.' : <>Add a customer and their opening balance.<br/>Your deliveries and payments will follow here.</>}</p><button className="button primary" onClick={() => setDialog({ type: 'party' })}><Plus size={17}/>{store.parties.length ? 'Add customer' : 'Add your first customer'}</button><span className="welcome-foot"><HardDrive size={14}/>Saved locally · Works offline</span></div>}
        </section>}
        </>}
        <footer className="page-footer no-print"><span>{profile.name} <span> / </span> {profile.tagline}</span><span><HardDrive size={13}/>{desktop ? 'Your records stay on your computer.' : 'Preview records are stored in this browser.'}</span></footer>
      </main>
    </div>
    {notice && <div className="toast no-print" role="status"><CheckCircle2 size={18}/>{notice}</div>}
    {busy && <div className="busy-indicator no-print" role="status"><LoaderCircle className="spin" size={16}/>Working…</div>}
    {dialog?.type === 'party' && <PartyForm archive={dialog.party ? async () => { const p = dialog.party!; await setCustomerArchived(p.id, p.archived !== 1); if (p.archived === 1) setCustomerView('active'); await refresh(p.archived === 1 ? p.id : undefined); setNotice(p.archived === 1 ? 'Customer restored to active customers.' : 'Customer archived. Ledger retained.'); } : undefined} remove={() => dialog.party && setDialog({ type: 'delete', party: dialog.party })} importExcel={() => setDialog({type: 'import'})} party={dialog.party} close={() => setDialog(null)} save={async p => { await saveParty(p, store); await refresh(p.id); setNotice('Customer saved.'); }}/>}
    {dialog?.type === 'delete' && <DeleteCustomer party={dialog.party} count={store.transactions.filter(t => t.party_id === dialog.party.id).length} balance={ledger(dialog.party, store.transactions).closing} close={() => setDialog(null)} remove={async () => {
      const current = await loadStore();
      const target = current.parties.find(p => p.id === dialog.party.id);
      if (!target || target.name !== dialog.party.name) throw new Error('Customer details changed. Reopen the customer and try again.');
      if (!await backup(current, 'shop-before-customer-delete-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json')) return false;
      await deleteCustomer(target.id, target.name); await refresh(); setNotice('Customer and ledger permanently deleted. Safety backup saved.'); return true;
    }}/>}
    {dialog?.type === 'import' && <ImportCustomer existingNames={store.parties.map(p=>p.name)} close={() => setDialog(null)} save={async (p,txs) => { await importCustomer(p,txs); await refresh(p.id); setRange('all'); setNotice(`Customer imported with ${txs.length} transactions.`); }}/> }
    {dialog?.type === 'transaction' && party && <TransactionForm party={party} profile={profile} transactions={store.transactions} transaction={dialog.transaction} close={() => setDialog(null)} save={async tx => { await saveTransaction(tx, party); await refresh(); setNotice('Transaction saved. Balances updated.'); }}/>}
    {dialog?.type === 'restore' && <Modal title="Restore a backup" subtitle="Replace the records in this app with the selected backup." close={() => setDialog(null)} busy={busy}><div className="restore-content"><FolderOpen size={32}/><p>This backup contains <strong>{dialog.store.parties.length} customers</strong> and <strong>{dialog.store.transactions.length} customer transactions</strong>, <strong>{dialog.store.suppliers?.length ?? 0} suppliers</strong> and <strong>{dialog.store.supplierTransactions?.length ?? 0} supplier entries</strong>.</p>{dialog.store.cash === undefined && <p>This older backup contains no cash book. Current drawer settings, cash history and counts will be kept.</p>}{dialog.store.suppliers === undefined && <p>This older backup contains no supplier section. Existing suppliers and their ledgers will be kept.</p>}<p>First, save a safety backup of your current records. Cancelling that save leaves your records unchanged.</p><p className="form-note">Records covered by this backup will be replaced. This cannot be undone without your safety backup.</p></div><div className="modal-foot"><button className="button secondary" disabled={busy} onClick={() => setDialog(null)}>Cancel</button><button className="button primary" disabled={busy} onClick={() => void perform(async () => { if (!await backup(store, 'shop-before-restore-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json')) return; await restoreStore(dialog.store); await refresh(); setDialog(null); setRange('all'); setNotice('Backup restored successfully.'); })}>Save safety backup & restore</button></div></Modal>}
  </div>;
}





import { useState, type FormEvent } from 'react';
import { Modal } from './forms';
import { balanceClass, balanceText, type Party } from './domain';
export default function DeleteCustomer({party, count, balance, close, remove, supplier=false}: {supplier?:boolean;party:Party;count:number;balance:number;close:()=>void;remove:()=>Promise<boolean>}) {
 const entity=supplier?'supplier':'customer';
 const [typed,setTyped]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState('');
 async function submit(e:FormEvent) {
  e.preventDefault();if(typed!==party.name)return;setBusy(true);setError('');
  try{if(await remove())close();else setError(`Backup save was cancelled. The ${entity} and ledger have not been deleted.`);}catch(e){setError((e as Error).message);}finally{setBusy(false);}
 }
 return <Modal title={'Permanently delete '+entity} subtitle={party.name} close={close} busy={busy}><form onSubmit={submit}>
  <div className="delete-content"><p>This permanently removes <strong>{party.name}</strong>, their opening balance and <strong>{count} transactions</strong>.</p><p>Current balance: <strong className={balanceClass(supplier?-balance:balance)}>Rs {balanceText(balance)}</strong></p><p>First save a safety backup of all records. You can recover deleted records by restoring that backup, which replaces the app’s current records.</p><label>Type the {entity}’s exact name to confirm<input autoFocus autoComplete="off" value={typed} onChange={e=>setTyped(e.target.value)} placeholder={party.name}/></label><p className="form-note">To keep the ledger instead, cancel and choose Archive {entity}.</p>{error&&<p className="error" role="alert">{error}</p>}</div>
  <div className="modal-foot"><button type="button" className="button secondary" onClick={close} disabled={busy}>Cancel</button><button className="button danger" disabled={busy||typed!==party.name}>{busy?'Working…':'Save safety backup & permanently delete'}</button></div>
 </form></Modal>;
}

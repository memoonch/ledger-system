---
title: "Source: src/GlobalSearch.tsx"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/GlobalSearch.tsx"
sha256: "3c872accad7d6932db475ba2a73da2a61cb88ac4f311f57d2855bd0ab49ca233"
tags: [shop-ledger, development]
---

# Source snapshot: src/GlobalSearch.tsx

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/GlobalSearch.tsx`.
- SHA-256 of original file bytes: `3c872accad7d6932db475ba2a73da2a61cb88ac4f311f57d2855bd0ab49ca233`.
- Original bytes: 2389; source lines: 9.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`GlobalSearch`.

## Complete source

```tsx
import {useMemo,useState,type KeyboardEvent} from 'react';
import {Modal} from './forms';
import {searchRecords,type SearchHit,type SearchScope} from './discovery';
export default function GlobalSearch({index,close,jump}:{index:SearchHit[];close:()=>void;jump:(hit:SearchHit)=>void}){
 const [query,setQuery]=useState(''),[scope,setScope]=useState<SearchScope>('all'),[active,setActive]=useState(0);
 const result=useMemo(()=>searchRecords(index,query,scope),[index,query,scope]);
 function key(e:KeyboardEvent){if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const next=result.hits.length?(active+(e.key==='ArrowDown'?1:-1)+result.hits.length)%result.hits.length:0;setActive(next);document.getElementById('search-result-'+next)?.scrollIntoView({block:'nearest'});}if(e.key==='Enter'&&result.hits[active]){e.preventDefault();jump(result.hits[active]);}}
 return <Modal title="Search all records" subtitle="Customers, suppliers, bill numbers, vehicles and cash entries · Ctrl+K" close={close}><div className="global-search-panel"><label>Search<input autoFocus aria-label="Global search query" placeholder="Name, phone, bill or vehicle number…" value={query} onChange={e=>{setQuery(e.target.value);setActive(0);}} onKeyDown={key} aria-controls="global-search-results"/></label><label>Search in<select aria-label="Search in" value={scope} onChange={e=>{setScope(e.target.value as SearchScope);setActive(0);}}><option value="all">All records</option><option value="customers">Customers</option><option value="suppliers">Suppliers</option><option value="bills">Bill numbers</option><option value="vehicles">Vehicle numbers</option><option value="cash">Cash book</option></select></label><p className="form-note">↑ ↓ to choose · Enter to open · Esc to close. Archived accounts are included.</p><div id="global-search-results" className="global-search-results">{result.hits.map((hit,i)=><button id={'search-result-'+i} key={hit.id} className={'global-result '+(i===active?'is-active':'')} onMouseEnter={()=>setActive(i)} onClick={()=>jump(hit)}><strong>{hit.title}</strong><span>{hit.detail}</span></button>)}{query&&!result.total&&<p>No matching records.</p>}{!query&&<p>Type a name, bill number or vehicle number to begin.</p>}</div>{result.total>0&&<p className="form-note">Showing {result.hits.length} of {result.total} matching records.</p>}</div></Modal>;
}
```

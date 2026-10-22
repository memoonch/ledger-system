---
title: "Source: .qa/native-profile-check.cjs"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: ".qa/native-profile-check.cjs"
sha256: "94bdfef25c31f938cd384a979ea507cf5cb18e7a6898fe35f6775e4d05744e9f"
tags: [shop-ledger, development]
---

# Source snapshot: .qa/native-profile-check.cjs

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/.qa/native-profile-check.cjs`.
- SHA-256 of original file bytes: `94bdfef25c31f938cd384a979ea507cf5cb18e7a6898fe35f6775e4d05744e9f`.
- Original bytes: 2770; source lines: 14.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.
- Local, ignored QA instrumentation. Paths are machine-specific. Original UI-check currency expectations may predate whole-rupee formatting.

## Complete source

```javascript
const {chromium}=require('C:/Users/FROST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');const assert=require('node:assert/strict');const fs=require('node:fs/promises');
(async()=>{let b; for(let attempt=0;attempt<30;attempt++){try{b=await chromium.connectOverCDP('http://127.0.0.1:9223');break}catch(e){if(attempt===29)throw e;await new Promise(r=>setTimeout(r,200));}}const p=b.contexts()[0].pages()[0];await p.getByText('Local SQLite database',{exact:true}).waitFor();await p.waitForFunction(()=>!document.querySelector('.loading'));assert.equal(await p.getByRole('alert').count(),0);
 const original=await p.evaluate(()=>window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT data FROM shop_profile WHERE id=1',values:[]}));
 const counts=await p.evaluate(()=>window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT (SELECT COUNT(*) FROM parties) AS parties,(SELECT COUNT(*) FROM ledger_transactions) AS transactions',values:[]}));
 await fs.writeFile('.qa/native-profile-original.json',original[0].data);
 try{
 await p.getByRole('button',{name:'Open shop profile'}).click();await p.getByLabel('Shop name',{exact:true}).fill('Native Profile QA');await p.getByLabel('Tagline',{exact:true}).fill('Works offline.');await p.getByLabel('Brand names').fill('Native Test Brand');await p.getByRole('button',{name:'Save shop profile'}).click();await p.getByText('Shop profile saved.',{exact:true}).waitFor();
 const rows=await p.evaluate(()=>window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT data FROM shop_profile WHERE id=1',values:[]}));assert.equal(JSON.parse(rows[0].data).name,'Native Profile QA');assert.deepEqual(JSON.parse(rows[0].data).brands,['Native Test Brand']);
 await p.reload();await p.getByRole('button',{name:'Open shop profile'}).waitFor();await p.waitForFunction(()=>!document.querySelector('.loading'));assert.match(await p.locator('.brand').innerText(),/Native Profile QA/);
 const after=await p.evaluate(()=>window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT (SELECT COUNT(*) FROM parties) AS parties,(SELECT COUNT(*) FROM ledger_transactions) AS transactions',values:[]}));assert.deepEqual(after,counts);console.log('Native profile checks passed: migration 2, SQLite save, reload persistence, customer data preserved.');
 }finally{await p.evaluate(data=>window.__TAURI_INTERNALS__.invoke('plugin:sql|execute',{db:'sqlite:alfazal.db',query:'UPDATE shop_profile SET data=$1 WHERE id=1',values:[data]}),original[0].data);await b.close();console.log('Restored original shop profile after testing.');}
})().catch(e=>{console.error(e);process.exit(1)});
```

---
title: "Source: .qa/generic-check.cjs"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: ".qa/generic-check.cjs"
sha256: "765268d0d97e690cb7062b5d04529433af1c5b76e1a9820bcbad188cb21e5eac"
tags: [shop-ledger, development]
---

# Source snapshot: .qa/generic-check.cjs

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/.qa/generic-check.cjs`.
- SHA-256 of original file bytes: `765268d0d97e690cb7062b5d04529433af1c5b76e1a9820bcbad188cb21e5eac`.
- Original bytes: 5765; source lines: 46.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.
- Local, ignored QA instrumentation. Paths are machine-specific. Original UI-check currency expectations may predate whole-rupee formatting.

## Complete source

```javascript
const {chromium}=require('C:/Users/FROST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict'); const fs=require('node:fs/promises');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
 try {
 const p=await b.newPage({viewport:{width:1500,height:1000}}); const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:1420');await p.getByRole('button',{name:'Try sample data'}).click();await p.getByRole('heading',{name:'Muhammad Aslam'}).waitFor();
 assert.match(await p.locator('.closing-strip').innerText(),/419,500 DR/);assert.doesNotMatch(await p.locator('.ledger-table').innerText(),/\.00/);
 assert.equal(await p.locator('.closing-strip strong').evaluate(e=>getComputedStyle(e).color),'rgb(185, 57, 57)');
 await p.getByRole('button',{name:'Open shop profile'}).click();await p.getByRole('heading',{name:'Shop profile',exact:true}).waitFor();
 await p.getByLabel('Shop name',{exact:true}).fill('City Hardware');await p.getByLabel('Tagline',{exact:true}).fill('Quality for every project.');
 await p.getByLabel('Shop phone',{exact:true}).fill('0300 1112233');await p.getByLabel('Shop address',{exact:true}).fill('Main Market, Lahore');
 await p.getByLabel('Statement footer message').fill('Thank you for shopping locally.');await p.getByLabel('Descriptions',{exact:true}).fill('Delivery\nPayment');
 await p.getByLabel('Brand names').fill('Test Brand');await p.getByLabel('Vehicle numbers').fill('ABC-123');
 await p.getByRole('button',{name:'Save shop profile'}).click();await p.getByText('Shop profile saved.',{exact:true}).waitFor();
 await p.screenshot({path:'.qa/shop-profile.png',fullPage:true});
 await p.reload();await p.getByRole('button',{name:'Open shop profile'}).waitFor();assert.match(await p.locator('.brand').innerText(),/City Hardware/);
 await p.getByRole('button',{name:'Add transaction',exact:true}).click();
 assert.ok((await p.locator('#descriptions option').evaluateAll(es=>es.map(e=>e.value))).includes('Delivery'));
 assert.ok((await p.locator('#descriptions option').evaluateAll(es=>es.map(e=>e.value))).includes('Cement'));
 assert.ok((await p.locator('#brands option').evaluateAll(es=>es.map(e=>e.value))).includes('Test Brand'));
 assert.ok((await p.locator('#vehicles option').evaluateAll(es=>es.map(e=>e.value))).includes('ABC-123'));
 await p.getByLabel('Description',{exact:true}).fill('Custom Goods');await p.getByLabel('Brand',{exact:true}).fill('Fresh Brand');await p.getByLabel('Vehicle number',{exact:true}).fill('XYZ-777');await p.getByLabel('Bill / receipt number').fill('NEW-100');
 await p.getByLabel('Amount calculation').selectOption('material');await p.getByLabel('Quantity',{exact:true}).fill('2.5');await p.getByLabel('Rate per unit (PKR)').fill('101');
 assert.match(await p.locator('.calculation').innerText(),/253 DR/);
 await p.getByRole('button',{name:'Save transaction',exact:true}).click();await p.getByRole('dialog').waitFor({state:'hidden'});
 assert.match(await p.locator('.closing-strip').innerText(),/419,753 DR/);
 await p.getByRole('button',{name:'Add transaction',exact:true}).click();
 for(const [id,text] of [['descriptions','Custom Goods'],['brands','Fresh Brand'],['vehicles','XYZ-777'],['bills','NEW-100']])assert.ok((await p.locator('#'+id+' option').evaluateAll(es=>es.map(e=>e.value))).includes(text));
 await p.getByRole('button',{name:'Cancel',exact:true}).click();
 await p.getByRole('button',{name:/Ali Raza/}).click();assert.equal(await p.locator('.closing-strip strong').evaluate(e=>getComputedStyle(e).color),'rgb(32, 128, 78)');
 await p.getByRole('button',{name:/Muhammad Aslam/}).click();
 const download=p.waitForEvent('download');await p.getByRole('button',{name:'PDF',exact:true}).click();await(await download).saveAs('.qa/generic-statement.pdf');
 await p.pdf({path:'.qa/generic-print.pdf',preferCSSPageSize:true,printBackground:true});
 const backup=p.waitForEvent('download');await p.getByRole('button',{name:'Back up records',exact:true}).click();await(await backup).saveAs('.qa/generic-backup.json');
 const snapshot=JSON.parse(await fs.readFile('.qa/generic-backup.json','utf8'));assert.equal(snapshot.version,2);assert.equal(snapshot.data.profile.name,'City Hardware');
 const legacy={format:'alfazal-ledger',version:1,data:{parties:snapshot.data.parties,transactions:snapshot.data.transactions}};await fs.writeFile('.qa/legacy-backup.json',JSON.stringify(legacy));
 const file=p.waitForEvent('filechooser');await p.getByRole('button',{name:'Restore backup',exact:true}).click();await(await file).setFiles('.qa/legacy-backup.json');
 const safety=p.waitForEvent('download');await p.getByRole('button',{name:'Save safety backup & restore'}).click();await(await safety).saveAs('.qa/generic-safety.json');await p.getByRole('dialog').waitFor({state:'hidden'});
 assert.match(await p.locator('.brand').innerText(),/City Hardware/);
 await p.locator('.toast').waitFor({state:'hidden'});await p.screenshot({path:'.qa/generic-ledger.png',fullPage:true});
 await p.setViewportSize({width:1100,height:850});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 await p.getByRole('button',{name:'Open shop profile'}).click();await p.setViewportSize({width:390,height:844});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 assert.deepEqual(errors,[]);console.log('Generic shop checks passed: profile persistence, reusable/manual suggestions, whole rupees, DR/CR colors, PDF/print, backup profile and legacy compatibility.');
 }finally{await b.close()}
})().catch(e=>{console.error(e);process.exit(1)});
```

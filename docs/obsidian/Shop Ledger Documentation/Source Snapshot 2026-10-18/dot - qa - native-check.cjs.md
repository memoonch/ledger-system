---
title: "Source: .qa/native-check.cjs"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: ".qa/native-check.cjs"
sha256: "64c0ba553708a8ae580e2e882efdd0012674e616163bd7b2b5b8237160f36d7d"
tags: [shop-ledger, development]
---

# Source snapshot: .qa/native-check.cjs

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/.qa/native-check.cjs`.
- SHA-256 of original file bytes: `64c0ba553708a8ae580e2e882efdd0012674e616163bd7b2b5b8237160f36d7d`.
- Original bytes: 3807; source lines: 52.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.
- Local, ignored QA instrumentation. Paths are machine-specific. Original UI-check currency expectations may predate whole-rupee formatting.

## Complete source

```javascript
const {chromium}=require('C:/Users/FROST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs/promises');
(async()=>{
  const browser=await chromium.connectOverCDP('http://127.0.0.1:9223');
  const context=browser.contexts()[0];
  const page=context.pages()[0];
  console.log('Native URL:',page.url());
  page.on('pageerror',error=>console.error('Native page error:',error.message));
  await page.getByText('Local SQLite database',{exact:true}).waitFor();
  await page.getByRole('button',{name:'Add customer',exact:true}).first().waitFor({state:'visible'});
  await page.waitForFunction(()=>!document.querySelector('.loading'));
  if(await page.getByRole('alert').count()) throw new Error(await page.getByRole('alert').innerText());
  const original=await page.evaluate(async()=>({parties:await window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT * FROM parties',values:[]}),transactions:await window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT * FROM ledger_transactions',values:[]})}));
  await fs.writeFile('.qa/native-original.json',JSON.stringify(original));
  if(original.parties.length||original.transactions.length) throw new Error('Existing data present; skipping native mutation tests.');
  try {
    await page.getByRole('button',{name:'Add customer',exact:true}).first().click();
    await page.getByLabel('Customer / contractor name').fill('Native QA Customer');
    await page.getByLabel('Opening balance date').fill('2026-01-01');
    await page.getByLabel('Opening balance (PKR)').fill('10000');
    await page.getByRole('button',{name:'Save customer',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'hidden'});
    await page.getByRole('button',{name:'Add transaction',exact:true}).click();
    await page.getByLabel('Date',{exact:true}).fill('2026-01-02');
    await page.getByLabel('Description',{exact:true}).fill('Cement');
    await page.getByLabel('Amount calculation').selectOption('material');
    await page.getByLabel('Quantity',{exact:true}).fill('10');
    await page.getByLabel('Rate per unit (PKR)').fill('1500');
    await page.getByRole('button',{name:'Save transaction',exact:true}).click();
    await page.getByRole('dialog').waitFor({state:'hidden'});
    assert.match(await page.locator('.closing-strip').innerText(),/25,000.00 DR/);
    await page.reload();
    await page.getByRole('heading',{name:'Native QA Customer'}).waitFor();
    assert.match(await page.locator('.closing-strip').innerText(),/25,000.00 DR/);
    await page.screenshot({path:'.qa/native-ledger.png'});
    const persisted=await page.evaluate(()=>window.__TAURI_INTERNALS__.invoke('plugin:sql|select',{db:'sqlite:alfazal.db',query:'SELECT debit_paisa FROM ledger_transactions',values:[]}));
    assert.equal(persisted[0].debit_paisa,1500000);
    await context.setOffline(true);
    await page.reload();
    await page.getByRole('heading',{name:'Native QA Customer'}).waitFor();
    assert.match(await page.locator('.closing-strip').innerText(),/25,000.00 DR/);
    await context.setOffline(false);
    console.log('Native checks passed: Tauri startup, SQLite migrations, party/transaction writes, persistence, bundled offline reload.');
  } finally {
    await context.setOffline(false);
    await page.evaluate(data=>window.__TAURI_INTERNALS__.invoke('plugin:sql|execute',{db:'sqlite:alfazal.db',query:'INSERT INTO restore_requests(payload) VALUES ($1)',values:[JSON.stringify(data)]}),original);
    await page.reload();
    console.log('Restored original empty native ledger after testing.');
  }
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
```

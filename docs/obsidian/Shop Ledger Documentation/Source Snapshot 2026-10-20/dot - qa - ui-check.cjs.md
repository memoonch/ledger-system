---
title: "Source: .qa/ui-check.cjs"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: ".qa/ui-check.cjs"
sha256: "bb0b62fd471d64dbfdcf47c494e32c92f1d50a571f3e4bf7b32daf40d50c5006"
tags: [shop-ledger, development]
---

# Source snapshot: .qa/ui-check.cjs

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/.qa/ui-check.cjs`.
- SHA-256 of original file bytes: `bb0b62fd471d64dbfdcf47c494e32c92f1d50a571f3e4bf7b32daf40d50c5006`.
- Original bytes: 5111; source lines: 72.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.
- Local, ignored QA instrumentation. Paths are machine-specific. Original UI-check currency expectations may predate whole-rupee formatting.

## Complete source

```javascript
const { chromium } = require('C:/Users/FROST/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({headless:true,executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'});
  const page = await browser.newPage({ viewport:{width:1600,height:1050} });
  const errors = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto('http://127.0.0.1:1420');
  await page.getByRole('button',{name:'Try sample data'}).click();
  await page.getByRole('heading',{name:'Muhammad Aslam'}).waitFor();
  assert.match(await page.locator('.closing-strip').innerText(), /419,500.00 DR/);
  await page.screenshot({path:'.qa/ledger-desktop.png',fullPage:true});
  await page.getByRole('button',{name:'Add transaction',exact:true}).click();
  await page.getByLabel('Description',{exact:true}).fill('Extra Cement');
  await page.getByLabel('Amount calculation').selectOption('material');
  await page.getByLabel('Quantity',{exact:true}).fill('10');
  await page.getByLabel('Rate per unit (PKR)').fill('1500');
  await page.screenshot({path:'.qa/add-transaction.png',fullPage:true});
  await page.getByRole('button',{name:'Save transaction',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
  assert.match(await page.locator('.closing-strip').innerText(), /434,500.00 DR/);
  await page.reload();
  await page.getByRole('button',{name:/Muhammad Aslam/}).click();
  assert.match(await page.locator('.closing-strip').innerText(), /434,500.00 DR/);
  await page.getByRole('button',{name:/Edit Extra Cement/}).click();
  await page.getByLabel('Quantity',{exact:true}).fill('20');
  await page.getByRole('button',{name:'Save transaction',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
  assert.match(await page.locator('.closing-strip').innerText(), /449,500.00 DR/);
  const month = await page.locator('body').evaluate(() => JSON.parse(localStorage.getItem('alfazal-browser-preview-v1')).parties[0].opening_date.slice(0,7));
  await page.getByLabel('From date',{exact:true}).fill(month+'-06');
  await page.getByLabel('To date',{exact:true}).fill(month+'-10');
  assert.match(await page.locator('.closing-strip').innerText(), /426,750.00 DR/);
  assert.match(await page.locator('.opening-row').innerText(), /603,750.00 DR/);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button',{name:'PDF',exact:true}).click();
  const download = await downloadPromise; await download.saveAs('.qa/statement.pdf');
  await page.pdf({path:'.qa/print-a4.pdf',preferCSSPageSize:true,printBackground:true});
  const backupPromise = page.waitForEvent('download');
  await page.getByRole('button',{name:'Back up records',exact:true}).click();
  await (await backupPromise).saveAs('.qa/backup.json');
  await page.getByRole('button',{name:'Add customer',exact:true}).first().click();
  await page.getByLabel('Customer / contractor name').fill('QA Customer');
  await page.getByLabel('Opening balance (PKR)').fill('2000');
  await page.getByLabel('Balance type').selectOption('CR');
  await page.getByRole('button',{name:'Save customer',exact:true}).click();
  await page.getByRole('dialog').waitFor({state:'hidden'});
  await page.getByLabel('Statement period').selectOption('all');
  assert.match(await page.locator('.closing-strip').innerText(), /2,000.00 CR/);
  const chooserPromise = page.waitForEvent('filechooser');
  await page.getByRole('button',{name:'Restore backup',exact:true}).click();
  await (await chooserPromise).setFiles('.qa/backup.json');
  await page.getByRole('dialog').waitFor();
  const safetyPromise = page.waitForEvent('download');
  await page.getByRole('button',{name:'Save safety backup & restore'}).click();
  await (await safetyPromise).saveAs('.qa/safety-backup.json');
  await page.getByRole('dialog').waitFor({state:'hidden'});
  assert.equal(await page.locator('.customer-item').count(),4);
  await page.getByRole('button',{name:/Muhammad Aslam/}).click();
  await page.getByLabel('From date',{exact:true}).fill(month+'-20');
  await page.getByLabel('To date',{exact:true}).fill(month+'-10');
  await page.getByRole('alert').waitFor();
  await page.getByRole('button',{name:'Reset dates'}).click();
  await page.setViewportSize({width:1100,height:850});
  await page.screenshot({path:'.qa/ledger-small-desktop.png',fullPage:true});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:'.qa/ledger-mobile.png',fullPage:true});
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false);
  assert.deepEqual(errors,[]);
  console.log('UI checks passed: material add/edit, persistence, date filtering, PDF download, A4 print, backup/restore, CR opening, invalid range, responsive layouts.');
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
```

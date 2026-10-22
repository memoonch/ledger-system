---
title: "Source: src/styles.css"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/styles.css"
sha256: "b763418b159e8715ca32b1607e550584d92c619dd9c67f0994eef8afcbabe163"
tags: [shop-ledger, development]
---

# Source snapshot: src/styles.css

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/styles.css`.
- SHA-256 of original file bytes: `b763418b159e8715ca32b1607e550584d92c619dd9c67f0994eef8afcbabe163`.
- Original bytes: 29551; source lines: 137.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```css
@import "tailwindcss";
@theme { --font-sans: "Segoe UI", Arial, sans-serif; }
:root { font-family: "Segoe UI", Arial, sans-serif; color: #263b33; background: #f5f6f3; font-synthesis: none; font-size: 14px; }
* { box-sizing: border-box; }
body { margin: 0; } button, input, select { font: inherit; } button { cursor: pointer; } button:disabled { cursor: wait; opacity: .55; } button, input, select { outline-offset: 3px; } button:focus-visible, a:focus-visible { outline: 2px solid #b48b45; } input:focus, select:focus { outline: 2px solid #6f9b86; outline-offset: 0; border-color: #6f9b86; } a { color: inherit; text-decoration: none; }
.app-shell { display: flex; min-height: 100vh; }
.sidebar { width: 204px; flex: 0 0 204px; background: #133f34; color: #c7d8cd; padding: 30px 15px 0; display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; }
.brand { display: flex; align-items: center; gap: 10px; margin: 0 8px 49px; color: #fff; font-weight: 700; letter-spacing: 1.7px; font-size: 18px; }
.brand small { display: block; font-size: 7px; letter-spacing: 1.5px; font-weight: 500; margin-top: 4px; color: #b7cfbd; }
.brand-mark { color: #e9d3a4; border: 1px solid #91aa8b66; border-radius: 9px; padding: 8px; }
.sidebar-label { font-size: 9px; letter-spacing: 1.6px; font-weight: 600; color: #80a491; margin: 0 13px 14px; }
.nav-active { display: flex; gap: 10px; align-items: center; background: #ffffff12; border: 1px solid #ffffff0d; color: #f2f6ef; border-radius: 7px; padding: 13px 10px; font-size: 12px; font-weight: 600; }
.nav-active > svg:last-child { margin-left: auto; color: #96b19c; }
.sidebar-context { margin: 65px 15px 0; color: #9bb6a2; } .sidebar-context > svg { color: #b9b995; margin-bottom: 14px; }
.sidebar-context p { font-size: 20px; line-height: 1.65; font-weight: 300; letter-spacing: -.4px; }.sidebar-context strong { color: #e0e9db; font-weight: 400; }
.sidebar-bottom { margin-top: auto; padding-top: 40px; }.sidebar-bottom > button { display: flex; align-items: center; gap: 11px; padding: 11px 13px; width: 100%; background: none; border: 0; color: #c3d4c6; font-size: 12px; text-align: left; border-radius: 6px; }.sidebar-bottom > button:hover { background: #ffffff0c; }
.storage-status { border-top: 1px solid #ffffff16; padding: 22px 0; margin: 20px 6px 0; display: flex; gap: 8px; align-items: center; font-size: 10px; }.storage-status small { display: block; margin-top: 4px; color: #80a491; font-size: 9px; }.storage-status > svg { margin-left: auto; color: #7da48b; }
.status-dot { display: inline-block; width: 6px; height: 6px; background: #7fae88; border-radius: 50%; flex-shrink: 0; }
.main-shell { min-width: 0; flex: 1; }.topbar { height: 65px; border-bottom: 1px solid #e4e8df; background: #fafbf8; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; font-size: 11px; color: #879187; }.topbar > div, .topbar > span { display: flex; align-items: center; gap: 13px; }.topbar strong { color: #42584a; font-weight: 500; }.topbar-divider { height: 13px; width: 1px; background: #dce2d8; margin: 0 4px; }
main { padding: 31px 30px 18px; max-width: 1900px; margin: auto; }.page-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 26px; }.eyebrow { font-size: 9px; font-weight: 700; letter-spacing: 1.7px; color: #8b937e; } h1 { font-size: 29px; font-weight: 600; letter-spacing: -.9px; margin: 7px 0; color: #203f32; }.page-heading p { color: #879084; font-size: 12px; margin: 7px 0 0; }
.button { border: 1px solid transparent; display: inline-flex; align-items: center; justify-content: center; gap: 8px; border-radius: 6px; padding: 11px 16px; font-size: 12px; font-weight: 600; line-height: 1.3; white-space: nowrap; transition: background .15s; }.primary { background: #205543; color: #fff; box-shadow: 0 2px 2px #153d3010; }.primary:hover { background: #164333; }.secondary { background: #fff; color: #526256; border-color: #dce3d9; }.secondary:hover { background: #f4f7f2; }.compact { padding: 9px 11px; font-size: 11px; }.icon-button { border: 0; background: none; color: #879383; padding: 5px; display: inline-flex; align-items: center; justify-content: center; border-radius: 4px; }.icon-button:hover { color: #205543; background: #eaf0e6; }
.preview-banner { background: #f1eee3; border: 1px solid #e5deca; color: #80734c; display: flex; gap: 9px; align-items: center; padding: 10px 13px; border-radius: 6px; font-size: 11px; margin-bottom: 20px; }.preview-banner strong { font-weight: 600; }.preview-banner button { display: flex; align-items: center; gap: 4px; border: 0; background: transparent; margin-left: auto; color: #665b35; font-size: 11px; font-weight: 600; white-space: nowrap; }
.stats-grid { display: grid; grid-template-columns: 1.12fr 1.12fr .8fr; gap: 17px; margin-bottom: 27px; }.stat-card { border: 1px solid #e1e6dc; background: #fff; padding: 21px 20px; border-radius: 8px; display: flex; align-items: flex-start; gap: 14px; box-shadow: 0 2px 3px #233b2c02; }.stat-icon { display: inline-flex; padding: 11px; border-radius: 9px; }.receivable { background: #edf3eb; color: #608568; }.advance { background: #f7f1e3; color: #b29352; }.people { background: #eef0f5; color: #818a9e; }.stat-card p { font-size: 11px; color: #7d8a7c; margin: 0 0 6px; }.stat-card strong { font-weight: 600; font-size: 24px; line-height: 1.2; color: #2c4235; font-variant-numeric: tabular-nums; letter-spacing: -.6px; }.stat-card strong small { font-size: 12px; font-weight: 400; color: #97a08f; }.stat-card div > span { display: block; margin-top: 9px; font-size: 10px; color: #929b8d; }

.ledger-workspace { display: flex; border: 1px solid #dfe5da; border-radius: 9px; background: white; min-height: 530px; box-shadow: 0 3px 9px #1b3a2a03; overflow: hidden; }.customer-panel { width: 245px; flex: 0 0 245px; border-right: 1px solid #e3e8de; display: flex; flex-direction: column; background: #fdfefb; }.customer-panel-head { display: flex; align-items: center; justify-content: space-between; padding: 21px 17px 11px; }.customer-panel-head h2 { font-size: 13px; font-weight: 600; margin: 0; }.customer-panel-head h2 span { display: inline-block; background: #edf1e9; color: #89937c; border-radius: 4px; padding: 2px 6px; font-size: 9px; margin-left: 5px; }.search-box { display: flex; align-items: center; gap: 7px; background: #f5f7f1; border: 1px solid #e8ecdf; margin: 0 15px 18px; border-radius: 5px; color: #8c9684; padding: 0 9px; }.search-box input { min-width: 0; width: 100%; padding: 9px 0; border: none; background: transparent; font-size: 10px; outline: 0; }.search-box:focus-within { outline: 2px solid #6f9b86; }.customer-list { padding: 0 9px; max-height: 650px; overflow-y: auto; }.customer-item { display: flex; align-items: center; gap: 10px; width: 100%; text-align: left; border: 1px solid transparent; border-radius: 6px; background: transparent; padding: 14px 9px; margin-bottom: 4px; }.customer-item:hover { background: #f1f5ec; }.customer-item.active { background: #edf3e8; border-color: #dce7d3; }.avatar { width: 33px; height: 33px; flex: 0 0 33px; display: flex; align-items: center; justify-content: center; background: #eaf0e5; color: #7d9275; font-size: 10px; font-weight: 600; border-radius: 8px; }.active .avatar { background: #dce8d4; color: #58744e; }.customer-copy { flex: 1; min-width: 0; }.customer-copy strong { display: block; color: #3c513f; font-size: 11px; font-weight: 600; overflow-wrap: anywhere; }.customer-copy small { display: block; margin-top: 5px; color: #7c8876; font-size: 10px; font-variant-numeric: tabular-nums; }.customer-item > svg { color: #769466; flex-shrink: 0; }.list-empty { color: #8c9685; font-size: 12px; padding: 15px; text-align: center; line-height: 1.7; }.customer-panel-foot { margin-top: auto; padding: 22px 17px; color: #97a08e; font-size: 9px; display: flex; align-items: center; gap: 6px; border-top: 1px solid #edf0e7; }
.ledger-panel { flex: 1; min-width: 0; }.ledger-heading { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 24px 23px 20px; }.ledger-title { min-width: 0; }.ledger-title h2 { font-weight: 600; font-size: 21px; letter-spacing: -.6px; display: flex; align-items: center; gap: 9px; margin: 6px 0; overflow-wrap: anywhere; }.ledger-title p { margin: 0; color: #96a08c; font-size: 10px; overflow-wrap: anywhere; }.ledger-actions { display: flex; gap: 7px; }.ledger-toolbar { border-top: 1px solid #edf0e8; border-bottom: 1px solid #edf0e8; background: #fafbf8; padding: 13px 20px; display: flex; align-items: center; justify-content: space-between; gap: 10px; flex-wrap: wrap; }.date-filters { display: flex; gap: 7px; align-items: center; flex-wrap: wrap; }.date-filters > select { font-size: 10px; border: 1px solid #dfe5d8; border-radius: 5px; padding: 8px; background: white; color: #57634f; }.date-filters label { display: flex; align-items: center; gap: 5px; font-size: 9px; color: #96a08e; }.date-filters input { width: 114px; color: #63705c; border: 1px solid #dfe5d8; border-radius: 5px; background: white; font-size: 10px; padding: 7px 4px; }.date-separator { color: #b0b7a7; font-size: 10px; }.statement-meta { display: flex; justify-content: space-between; align-items: center; padding: 16px 21px 11px; color: #909b86; font-size: 9px; gap: 12px; }.statement-meta > span:first-child { color: #65755c; font-weight: 500; }
.table-scroll { position: relative; overflow-x: auto; padding-bottom: 2px; }.ledger-table { border-collapse: collapse; width: 100%; font-size: 10px; white-space: nowrap; }.ledger-table th { background: #f5f7f1; border-block: 1px solid #e6ebdf; font-weight: 500; color: #88937d; font-size: 9px; padding: 13px 10px; text-align: left; }.ledger-table th:first-child,.ledger-table td:first-child { padding-left: 22px; }.ledger-table td { padding: 15px 10px; border-bottom: 1px solid #eff2e9; color: #77836d; }.ledger-table tbody tr:hover { background: #fcfdf9; }.ledger-table .numeric { text-align: right; font-variant-numeric: tabular-nums; }.ledger-table .description-cell { color: #41563b; font-weight: 500; white-space: normal; min-width: 120px; max-width: 220px; overflow-wrap: anywhere; }.ledger-table .balance-cell { color: #3e5638; font-weight: 600; }.ledger-table .credit-text,.credit-text { color: #678e7b !important; }.ledger-table .debit-text { color: #756e52; }.ledger-table .opening-row { background: #fafbf7; }.opening-row td { padding-block: 13px; font-size: 9px; }.opening-row td > span { font-style: italic; color: #98a08c; }.ledger-table tfoot td { background: #f2f6eb; color: #526447; font-size: 10px; font-weight: 600; padding-block: 17px; border-block: 1px solid #e5ecda; }.row-edit { display: flex; background: transparent; border: 0; color: #9ca991; padding: 4px; border-radius: 4px; }.row-edit:hover { background: #e5eedd; color: #3f6636; }.empty-ledger { text-align: center; padding: 42px 15px !important; white-space: normal; }.empty-ledger > svg { display: block; margin: 0 auto 13px; color: #adbba1; }.empty-ledger strong { font-size: 13px; display: block; font-weight: 500; color: #63765a; }.empty-ledger span { display: block; margin-top: 6px; font-size: 11px; color: #9aa58f; }

.ledger-footer { padding: 17px 21px; font-size: 8px; color: #99a38e; display: flex; gap: 8px; justify-content: space-between; flex-wrap: wrap; }.ledger-footer > div { display: flex; align-items: center; gap: 5px; }.legend-dot { display: inline-block; width: 5px; height: 5px; border-radius: 50%; }.legend-dot.debit { background: #bcab81; }.legend-dot.credit { background: #80a991; margin-left: 10px; }.closing-strip { margin: 9px 21px 24px; padding: 20px; border: 1px solid #e0e8d6; background: #f8faf4; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; gap: 14px; }.closing-strip .eyebrow { font-size: 8px; color: #8d9b7f; }.closing-strip p { color: #a0a993; font-size: 10px; margin: 6px 0 0; }.closing-strip strong { font-size: 21px; color: #3a5a32; letter-spacing: -.5px; font-weight: 600; font-variant-numeric: tabular-nums; }.closing-strip strong small { font-size: 11px; font-weight: 400; color: #97a388; }
.welcome { flex: 1; text-align: center; display: flex; align-items: center; flex-direction: column; justify-content: center; padding: 55px 25px; }.welcome-icon { background: #f0f4e9; border: 1px solid #e6ecdc; color: #7a986b; border-radius: 18px; padding: 22px; margin-bottom: 28px; }.welcome h2 { font-size: 28px; line-height: 1.4; letter-spacing: -.6px; font-weight: 500; margin: 14px 0; color: #385333; }.welcome p { color: #9ba48f; font-size: 12px; line-height: 1.9; margin: 0 0 24px; }.welcome-foot { display: flex; align-items: center; gap: 7px; color: #a0aa94; margin-top: 23px; font-size: 10px; }
.page-footer { padding: 21px 1px 0; display: flex; justify-content: space-between; gap: 12px; font-size: 9px; color: #a4ad9b; }.page-footer > span:last-child { display: flex; align-items: center; gap: 6px; }.page-footer > span:first-child { letter-spacing: .6px; }.page-footer > span > span { margin: 0 7px; color: #c1c9b8; }
.loading { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 100px 0; color: #7b8d71; }.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }.error { color: #9f463d; background: #fff3f0; border: 1px solid #efcfc8; border-radius: 5px; padding: 12px 14px; font-size: 12px; line-height: 1.6; }.page-error { margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; }.toast { position: fixed; bottom: 25px; left: 50%; transform: translateX(-50%); background: #214e3d; color: #fff; box-shadow: 0 5px 30px #133f3430; border-radius: 8px; padding: 15px 20px; display: flex; gap: 10px; align-items: center; font-size: 12px; z-index: 20; }.busy-indicator { position: fixed; bottom: 18px; right: 20px; border: 1px solid #dce5d4; border-radius: 6px; background: #fff; padding: 10px 14px; display: flex; align-items: center; gap: 7px; color: #628151; font-size: 11px; z-index: 30; }
.modal { border: 1px solid #e0e5d8; border-radius: 12px; padding: 0; width: 560px; max-width: calc(100vw - 32px); max-height: calc(100vh - 40px); overflow-y: auto; color: #334d36; box-shadow: 0 20px 80px #112c3440; margin: auto; }.modal::backdrop { background: #142e2670; backdrop-filter: blur(3px); }.modal-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 15px; padding: 25px 26px 19px; border-bottom: 1px solid #edf0e6; }.modal h2 { margin: 0; font-size: 21px; font-weight: 600; letter-spacing: -.4px; }.modal-head p { margin: 7px 0 0; font-size: 11px; color: #8b9a7f; }.form-grid { padding: 22px 26px 0; display: grid; grid-template-columns: 1fr 1fr; gap: 17px; }.form-grid label { display: flex; flex-direction: column; gap: 7px; font-size: 11px; color: #718165; font-weight: 500; min-width: 0; }.form-grid .full { grid-column: 1 / -1; }.form-grid input,.form-grid select { width: 100%; border: 1px solid #dce3d3; background: #fff; border-radius: 5px; color: #3c5437; padding: 10px 11px; font-size: 12px; font-weight: 400; }.form-grid input::placeholder { color: #afb8a3; }.form-note { margin: 16px 26px; font-size: 11px; line-height: 1.7; color: #8f9c82; }.modal form > .error { margin: 17px 26px; }.modal-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 20px 26px; border-top: 1px solid #edf0e6; margin-top: 20px; background: #fafcf7; }.side-selector { display: flex; gap: 10px; margin: 21px 26px 0; }.side-selector button { display: flex; align-items: center; gap: 10px; flex: 1; text-align: left; background: #fff; border: 1px solid #e1e7d9; border-radius: 6px; padding: 12px; color: #8c9980; font-size: 12px; }.side-selector button.selected { border-color: #7da06c; color: #4d7540; background: #f0f6e9; }.side-selector small { display: block; margin-top: 4px; font-size: 9px; color: #9aa58e; }.calculation { margin: 20px 26px 0; display: flex; align-items: center; justify-content: space-between; gap: 15px; border: 1px solid #e0e8d5; border-radius: 6px; background: #f5f9ef; padding: 16px; font-size: 12px; color: #688154; }.calculation small { display: block; margin-top: 5px; color: #97a689; font-size: 9px; }.calculation strong { font-size: 18px; font-weight: 600; white-space: nowrap; }.restore-content { padding: 24px 26px 0; font-size: 13px; line-height: 1.8; }.restore-content > svg { color: #8ba17b; margin-bottom: 12px; }.restore-content .form-note { margin: 15px 0; }.print-shop { display: none; }
@media (min-width: 1650px) { .customer-panel { width: 275px; flex-basis: 275px; }.ledger-table { font-size: 11px; }.ledger-table th { font-size: 10px; }.ledger-table td { padding-block: 18px; } }
@media (max-width: 1250px) { .sidebar { width: 174px; flex-basis: 174px; padding-inline: 10px; }.brand { font-size: 15px; gap: 7px; }.brand small { font-size: 6px; }.brand-mark { padding: 6px; } main { padding: 25px 20px 15px; }.stat-card { padding: 17px 13px; gap: 10px; }.stat-card strong { font-size: 21px; }.stat-icon { padding: 8px; }.customer-panel { width: 220px; flex-basis: 220px; }.ledger-heading { padding-inline: 17px; }.ledger-toolbar { padding-inline: 15px; }.ledger-title h2 { font-size: 19px; }.ledger-actions { flex-wrap: wrap; justify-content: flex-end; } }

@media (max-width: 950px) { .sidebar { width: 68px; flex-basis: 68px; padding-inline: 8px; }.brand { margin-inline: 2px; }.brand > span:last-child,.sidebar-label,.nav-active span,.nav-active > svg:last-child,.sidebar-context,.storage-status { display: none; }.nav-active { padding: 14px; }.sidebar-bottom > button { font-size: 0; justify-content: center; padding: 18px 0; }.sidebar-bottom > button svg { width: 21px; height: 21px; }.topbar { padding-inline: 21px; }.stats-grid { gap: 10px; }.stat-icon { display: none; }.customer-panel { width: 200px; flex-basis: 200px; }.stat-card div > span { font-size: 9px; }.ledger-title p { max-width: 220px; }.ledger-actions .button { font-size: 0; gap: 0; }.ledger-actions .button svg { width: 16px; }.ledger-title h2 { font-size: 18px; }.closing-strip strong { font-size: 18px; } }
@media (max-width: 680px) { main { padding: 20px 12px; }.page-heading { align-items: flex-start; }.page-heading h1 { font-size: 24px; }.page-heading p { max-width: 200px; line-height: 1.7; }.page-heading .button { font-size: 10px; padding: 10px; }.stats-grid { grid-template-columns: 1fr; gap: 7px; margin-bottom: 16px; }.stat-card { padding: 11px 14px; }.stat-card > div { display: flex; align-items: center; width: 100%; gap: 8px; flex-wrap: wrap; }.stat-card p { margin: 0; flex: 1; }.stat-card strong { font-size: 18px; }.stat-card div > span { display: none; }.preview-banner { flex-wrap: wrap; line-height: 1.7; }.ledger-workspace { display: block; }.customer-panel { width: 100%; border-right: 0; border-bottom: 1px solid #e2e8d9; }.customer-list { display: flex; max-height: 150px; overflow-x: auto; }.customer-item { min-width: 170px; max-width: 210px; }.customer-panel-foot { display: none; }.customer-panel-head { padding-top: 12px; }.search-box { margin-bottom: 10px; }.ledger-heading { align-items: flex-start; }.date-filters input { width: 112px; }.closing-strip { padding: 13px; flex-wrap: wrap; }.page-footer > span:first-child { display: none; }.form-grid { padding-inline: 18px; gap: 13px; }.modal-head { padding-inline: 18px; }.side-selector { margin-inline: 18px; }.calculation { margin-inline: 18px; flex-wrap: wrap; }.toast { width: calc(100vw - 35px); }.statement-meta { font-size: 8px; }.statement-meta .no-print { display: none; } }
@page { size: A4 landscape; margin: 12mm; }
@media print {
  :root,body { background: white; color: #111; font-size: 10pt; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .no-print,dialog,.toast,.busy-indicator { display: none !important; }
  .app-shell,.main-shell,main,.ledger-workspace,.ledger-panel { display: block; width: auto; min-height: 0; max-width: none; padding: 0; margin: 0; border: 0; border-radius: 0; box-shadow: none; overflow: visible; }
  .ledger-heading { display: block; padding: 0 0 6mm; }.print-shop { display: block; border-bottom: 1px solid #ccc; margin-bottom: 5mm; padding-bottom: 3mm; }.print-shop h1 { font-size: 19pt; margin: 0 0 2mm; }.print-shop p { font-size: 9pt; margin: 0; }.ledger-title .eyebrow { display: none; }.ledger-title h2 { font-size: 14pt; margin-bottom: 2mm; }.ledger-title p { font-size: 9pt; color: #444; max-width: none; }
  .statement-meta { padding: 0 0 3mm; font-size: 9pt; color: #444; }.table-scroll { overflow: visible; padding: 0; }.ledger-table { width: 100%; white-space: normal; font-size: 8pt; table-layout: auto; }.ledger-table th { font-size: 8pt; background: #edf1e9; color: #222; }.ledger-table th,.ledger-table td { padding: 2.5mm 1.5mm !important; border-bottom: 1px solid #ddd; overflow-wrap: anywhere; }.ledger-table .description-cell { min-width: 0; max-width: 44mm; }.ledger-table .numeric { white-space: nowrap; }.ledger-table .date-cell { white-space: nowrap; }.ledger-table thead { display: table-header-group; }.ledger-table tfoot { display: table-row-group; }.ledger-table tr { break-inside: avoid; }.ledger-table tfoot td { font-size: 8pt; }.ledger-footer { padding: 4mm 0; color: #666; font-size: 7pt; }.closing-strip { margin: 3mm 0; padding: 4mm; break-inside: avoid; }.closing-strip strong { font-size: 14pt; }.closing-strip p { font-size: 8pt; }.closing-strip .eyebrow { font-size: 7pt; }.opening-row td { font-size: 8pt; }
}




/* Keep the ledger legible on the shop's desktop display. */
@media screen { .ledger-table { font-size: 11px; } .ledger-table th { font-size: 10px; } .customer-copy strong { font-size: 12px; } }
/* Shop identity and account sides. */
.brand { background: none; border: 0; padding: 0; text-align: left; letter-spacing: .5px; }
.brand > span:last-child { min-width: 0; overflow-wrap: anywhere; }
.brand small { letter-spacing: .4px; line-height: 1.5; text-transform: none; }
.brand-mark { flex-shrink: 0; }
.nav-active { width: 100%; text-align: left; }
.debit-text, .ledger-table .debit-text, .customer-copy .debit-text, .closing-strip .debit-text { color: #b93939 !important; }
.credit-text, .ledger-table .credit-text, .customer-copy .credit-text, .closing-strip .credit-text { color: #20804e !important; }
.neutral-text { color: #77836d !important; }
.legend-dot.debit { background: #b93939; }
.legend-dot.credit { background: #20804e; }
.receivable { background: #fceeee; color: #b93939; }
.advance { background: #eaf5ed; color: #20804e; }
.side-selector .selected.debit-selected { border-color: #c87e7e; color: #b93939; background: #fff3f1; }
.statement-note { padding: 0 21px; margin: 4px 0 12px; font-size: 10px; color: #849078; }
.profile-page { max-width: 1050px; margin: auto; }
.profile-card { background: #fff; border: 1px solid #dfe5da; border-radius: 8px; margin-bottom: 20px; padding-bottom: 24px; }
.profile-section-title { display: flex; align-items: flex-start; gap: 13px; padding: 23px 26px 0; color: #759267; }
.profile-section-title h2 { margin: 0; font-size: 16px; font-weight: 600; color: #345231; }
.profile-section-title p { margin: 6px 0 0; font-size: 11px; color: #8a987d; line-height: 1.6; }
.profile-card textarea { width: 100%; resize: vertical; border: 1px solid #dce3d3; padding: 11px; border-radius: 5px; font: inherit; font-size: 12px; line-height: 1.8; color: #3c5437; }
.profile-card textarea:focus { outline: 2px solid #6f9b86; outline-offset: 0; }
.suggestion-grid { grid-template-columns: repeat(3, 1fr); }
.profile-save { display: flex; align-items: center; justify-content: space-between; gap: 15px; }
.profile-save p { font-size: 11px; color: #8a987d; }
@media(max-width:680px) { .profile-page .page-heading { flex-wrap: wrap; }.profile-card .form-grid { grid-template-columns: 1fr; }.profile-section-title { padding-inline:18px; }.profile-save { flex-wrap:wrap; } }
@media print { .statement-note { padding: 0; margin: 3mm 0; font-size: 8pt; }.print-shop p { margin-top: 2mm; } }
@media print {
  .ledger-heading { padding-bottom: 3mm; }
  .print-shop { margin-bottom: 3mm; padding-bottom: 2mm; }
  .print-shop p { margin-top: 1mm; }
  .statement-meta { padding-bottom: 2mm; }
  .ledger-table th, .ledger-table td { padding: 2mm 1.5mm !important; }
  .ledger-footer { padding: 3mm 0; }
  .closing-strip { margin: 2mm 0; padding: 3mm; }
}
@media print { .ledger-table { line-height: 1.2; } .print-shop p { line-height: 1.25; } .closing-strip p { line-height: 1.3; } }

.import-form { padding: 0 24px; }
.modal:has(.import-form) { width: min(1120px, calc(100vw - 32px)); }
.import-form > .button { margin: 12px 0; }
.import-form details { margin: 16px 0; }
.import-form summary { cursor: pointer; margin-bottom: 12px; }
.import-preview { max-height: 300px; overflow: auto; border: 1px solid #dfe5e2; margin: 16px 0; }
.import-confirm { display: flex; gap: 10px; align-items: center; margin: 18px 0; }
.import-confirm input { width: 18px; height: 18px; flex-shrink: 0; }

.customer-management { margin: 0 24px 18px; padding: 16px; border: 1px solid #dfe5e2; border-radius: 8px; }
.customer-management p { margin: 0 0 12px; color: #62736b; }
.customer-management > div { display: flex; flex-wrap: wrap; gap: 10px; }
.button.danger { color: white; background: #b93939; }
.button.danger-outline { color: #b93939; background: white; border: 1px solid #b93939; }
.delete-content { padding: 0 24px 12px; }
.delete-content p { margin: 12px 0; }
.delete-content label { display: grid; gap: 8px; }
.customer-status-filter { display: block; margin: 0 18px 12px; width: calc(100% - 36px); padding: 9px; border: 1px solid #dfe5e2; border-radius: 6px; }
.archived-banner { padding: 10px 24px; background: #fff4d9; color: #71541d; }

.supplier-actions { display:flex; flex-wrap:wrap; gap:8px; padding:0 24px 16px; }
.supplier-payment-details { display:block; color:#6c7a72; font-size:11px; margin-top:4px; }
.modal:has(.supplier-bill-form) { width:min(1000px,calc(100vw - 32px)); }
.supplier-bill-form { padding:0 24px; }
.supplier-lines { margin:16px 0; }
.supplier-lines fieldset { border:1px solid #dfe5e2; border-radius:8px; margin:12px 0; padding:14px; }
.supplier-lines legend { font-weight:600; padding:0 6px; }
.supplier-line-remove { display:flex; align-items:end; }
@media print { .supplier-actions { display:none; } .supplier-payment-details { font-size:7px; } }

.nav-item { display:flex; width:100%; align-items:center; gap:10px; padding:13px 10px; text-align:left; border-radius:7px; font-size:12px; font-weight:600; }
.nav-item:not(.nav-active) { background:transparent; border:1px solid transparent; color:#c7d8cd; }
.nav-item > svg:last-child { margin-left:auto; }
.nav-item + .nav-item { margin-top:6px; }
@media (max-width:950px) { .nav-item span,.nav-item > svg:last-child { display:none; } .nav-item { padding:14px; } }

.cash-closing { padding:20px 24px; border-top:1px solid #dfe5e2; }
.cash-closing h2 { font-size:18px; margin-bottom:12px; }
.cash-closing p { margin:10px 0; }
textarea { border:1px solid #dfe5e2; border-radius:6px; min-height:80px; padding:10px; width:100%; font:inherit; }

.cash-actions { align-items:center; padding-left:0; }
.cash-actions label { display:flex; align-items:center; gap:10px; }
.cash-actions input { padding:9px 10px; background:white; border:1px solid #dfe5e2; border-radius:6px; }
.cash-book-panel { background:white; border:1px solid #dfe5e2; border-radius:10px; overflow:hidden; margin-bottom:16px; }

.global-search-trigger{display:flex;align-items:center;gap:10px;border:1px solid #dce2e6;background:#fff;color:#687680;border-radius:8px;padding:9px 12px;min-width:240px;cursor:pointer;margin-left:auto;margin-right:24px}.global-search-trigger kbd{margin-left:auto;font:11px inherit;border:1px solid #dde3e6;border-radius:4px;padding:2px 5px}.global-search-panel{padding:20px 26px}.global-search-panel label,.dues-filters label{display:flex;flex-direction:column;gap:6px;font-size:12px;font-weight:600;color:#53636b}.global-search-panel input,.global-search-panel select,.dues-filters input,.dues-filters select{padding:10px;border:1px solid #d9e1e4;border-radius:7px;background:#fff;color:#243b44;min-width:0}.global-search-panel>label{margin-bottom:12px}.global-search-results{max-height:45vh;overflow-y:auto}.global-result{width:100%;display:flex;flex-direction:column;gap:6px;text-align:left;padding:13px;border:1px solid transparent;background:#fff;border-radius:7px;cursor:pointer}.global-result span{font-size:12px;color:#667780;line-height:1.5}.global-result.is-active,.global-result:focus{background:#edf6f4;border-color:#8dc6b9}.ledger-table tr.search-highlight td{background:#fff3cf}.dues-filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;background:#fff;padding:20px;border:1px solid #e0e6e8;border-radius:10px;margin-bottom:20px}.dues-filters .dues-check{flex-direction:row;align-items:center}.dues-panel{background:white;border:1px solid #e0e6e8;border-radius:10px;overflow:hidden}.sidebar-context{margin-top:20px}@media(max-width:1100px){.global-search-trigger{min-width:170px;margin-right:10px}.global-search-trigger kbd{display:none}}@media(max-width:800px){.topbar>div{display:none}.dues-filters{grid-template-columns:repeat(2,minmax(0,1fr))}}@media print{.dues-panel{border:0}.search-highlight td{background:transparent!important}}
```

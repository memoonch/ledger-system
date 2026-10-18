# Development history and handoff

## 2026-10-18 — initial planning

Owner supplied two Obsidian Markdown documents for an offline cement/steel building-materials shop ledger. We reviewed the intended stack and Windows prerequisites.

Node and Rust existed but were not visible correctly in the session PATH. The user PATH was updated; Rust was verified outside restricted filesystem execution. C++ tools, WebView2 and later native compilation were confirmed. Windows SDK/build-tool setup was initially still in progress.

## Decisions clarified with the owner

Customers only; separate material entries; dated opening balances; editing allowed; English; PKR. Supplies/charges are debit and payments are credit. Add PDF download, custom/month date filtering and A4 printing.

Changes during development were explicitly expected.

## First implementation

Started in an empty working folder and implemented:
- React/TypeScript/Vite/Tailwind UI;
- customer list and ledger;
- opening balances and add/edit transactions;
- deterministic running balances and inclusive date filtering;
- native SQLite migration 1 and browser preview storage;
- offline PDF, A4 print styles and JSON backup/restore;
- parameterized persistence and atomic restore trigger.

18 automated tests passed at that stage. Browser integration and native offline/persistence checks passed. PDF pagination/header/layout issues found during verification were corrected.

Initial dependency audit issues were resolved by updating jsPDF and Vitest. Local compiler and preview-watcher problems are recorded in [[08 Setup Build and Troubleshooting]].

## Generic-shop update

Owner requested:
1. Replace fixed Alfazal branding with a generic shop identity.
2. Clicking the top-left brand opens an editable profile.
3. Remove currency decimal places.
4. Show DR/debit red and CR/credit green.
5. Make reusable descriptions, brands, vehicle numbers and other prior values selectable while retaining manual typing.

Implemented profile/contact/footer fields and managed suggestion arrays, plus transaction-derived suggestions. Added migration 2 without rewriting ledger values. Backup format became shop-ledger version 2, with legacy version-1 support.

Current automated suite: 27 passing tests. Browser checks verified persistence, free typing and suggestions, rounding, colors, PDF/print and backups. Native profile checks verified migration/save/reload and preserved customer row counts. Temporary profile test values were restored afterward.

A4 print spacing was tightened so the sample eight-transaction branded ledger fits on one page.

## Documentation request

Owner attached Engram AI Memory and requested comprehensive records in Obsidian for future editing and use.

Engram tools were available, but list_vaults returned no accessible vaults and search reported no vault found, suggesting sync from Obsidian. Documentation was prepared for direct local Obsidian publication while preserving the two original notes. No claim should be made that these notes were saved through Engram's service until a vault is accessible.

The new documentation contains architecture, requirements, function/file map, schema/migrations, accounting rules, UI/profile/suggestions, statements/backups, setup, verification, roadmap, exact dependency metadata and full source snapshots.

## Ready-to-use future handoff

> Continue the Shop Ledger Windows desktop project at C:/Users/FROST/Documents/GitHub/ledger-system. Read REQUIREMENTS.md, README.md and this documentation, then inspect current code before editing. It uses React/TypeScript/Vite/Tailwind, Tauri 2 and local SQLite. Customers only; dated opening balances; DR means customer owes, CR means advance/payment; whole-rupee UI; quantity supports thousandths. Keep existing app identifier/database/storage keys so data remains available. Migration versions 1, 2 and 3 already exist; add new numbered migrations instead of rewriting shipped SQL. Browser preview data is separate from native SQLite. Keep screen/PDF/print/backups consistent. The last verified implementation had 39 passing tests and native offline/profile persistence checks; do not describe those as new checks unless rerun. Inventory, invoices, multi-user access, audit history and WhatsApp are not implemented. The owner expects incremental changes and may revise scope. Follow their latest instructions, preserve data, document the change and refresh these notes.

## What is not ongoing automatically

No recurring automation, background documentation watcher, cloud backup, automatic code-to-Obsidian mirror or Engram sync task was created. Future updates require a deliberate documentation refresh or a separately approved automation.


## Excel / CSV import

Implemented Add Customer import with preview, editable mapping and opening balance detection; migration 3 atomically inserts a new customer and their transactions without replacing existing records. See [[13 Excel and CSV Import]].

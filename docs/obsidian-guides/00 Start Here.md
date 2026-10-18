# Shop Ledger — start here

This is the development and usage reference for **Shop Ledger**, originally started for Alfazal Building Materials and later made generic for other shops. It records the implemented application, the owner's decisions, and the source code as of **2026-10-18, Asia/Karachi**.

## Where the project lives

- Repository: `C:/Users/FROST/Documents/GitHub/ledger-system`
- Original Obsidian project: `C:/Users/FROST/Documents/Obsidian Vault/Alfazal Ledgher System`
- Source of truth for executable code: the repository files.
- Source snapshots in this documentation are dated reference copies. Editing a code block in Obsidian does **not** change the application.
- Public product name: **Shop Ledger**. Default editable shop name: **Shop Name**. Default tagline: **Your business, in balance.**
- Internal package/database identifiers still contain `alfazal` to preserve access to existing data.

## Read according to what you need

| Need | Read |
|---|---|
| Import old Excel/CSV customer ledgers | [[13 Excel and CSV Import]] |
| What the owner approved and what is still pending | [[01 Requirements and Decisions]] |
| How React, Tauri and SQLite work together | [[02 Architecture and Data Flow]] |
| Which file/function to edit | [[03 Code Map and API]] |
| Database tables, triggers and safe schema updates | [[04 Database and Migrations]] |
| DR/CR, opening balances, dates and whole-rupee calculations | [[05 Accounting and Validation]] |
| Screens, shop profile and reusable suggestions | [[06 Interface Profile and Suggestions]] |
| PDFs, A4 printing, backups and restoring | [[07 Statements and Backups]] |
| Install, run, build and troubleshoot | [[08 Setup Build and Troubleshooting]] |
| Tests and what was actually verified | [[09 Tests and Verification]] |
| How to implement common future changes | [[10 Editing Playbook and Roadmap]] |
| Project history and next-assistant handoff | [[11 History and Handoff]] |
| Exact dependency versions, file hashes and full source copies | [[12 Dependencies and Source Manifest]] |

## Quick commands

Run from the repository in PowerShell:

```powershell
npm.cmd ci
npm.cmd run dev
npm.cmd test
npm.cmd run build
npm.cmd run tauri dev
npm.cmd run tauri build -- --debug --no-bundle
```

The browser preview is `http://127.0.0.1:1420/`. It uses **separate browser storage**. Daily shop use is the Windows application with SQLite.

The current review executable is `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/target/debug/alfazal-ledger.exe`. It is a debug/review build; a final NSIS installer has not been packaged and validated.

## Current implementation status

Customer ledgers, dated opening balances, editable transactions, date filters, shop profile, reusable suggestions, whole-rupee amounts, DR/CR colors, PDF export, A4 print layout and JSON backup/restore are implemented.

**27 automated tests passed** at the last implementation verification. Browser checks passed for the generic-shop update. Native checks passed for SQLite migration/profile persistence and preservation of customer data. See [[09 Tests and Verification]] for limits and evidence.

Inventory, invoice generation, multi-user access, audit history and WhatsApp integration are not implemented.

## Documentation maintenance

The project also contains these notes under `docs/obsidian/` and the generation tool under `scripts/export-obsidian.py`. Topic templates are in `docs/obsidian-guides/`. Update the templates after approved code changes, regenerate source snapshots, then publish the refreshed documentation to this Obsidian folder.

This is a snapshot, **not an automatic background sync or monitoring task**. Engram currently reports no accessible synced vault; local Obsidian documentation can still be read normally.


Excel/CSV import is implemented through Add Customer. See [[13 Excel and CSV Import]] for rules, limitations and latest checks.

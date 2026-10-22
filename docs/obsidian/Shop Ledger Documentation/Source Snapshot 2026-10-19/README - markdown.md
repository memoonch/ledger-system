---
title: "Source: README.md"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "README.md"
sha256: "b1a82ced1f37ef64c0484ca66f13e2055ad0eccfec154505b7b3b0088316a5de"
tags: [shop-ledger, development]
---

# Source snapshot: README.md

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/README.md`.
- SHA-256 of original file bytes: `b1a82ced1f37ef64c0484ca66f13e2055ad0eccfec154505b7b3b0088316a5de`.
- Original bytes: 8575; source lines: 81.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```markdown
# Shop Ledger

An offline Windows customer Khata built with React, TypeScript, Vite, Tailwind CSS, Tauri 2, and the Tauri SQLite plugin.

## Run
- Install Node.js LTS, Rust MSVC, Microsoft C++ Build Tools, Windows 10/11 SDK, and WebView2.
- Run `npm install`.
- Browser preview: `npm run dev`, then open http://127.0.0.1:1420.
- Native desktop: `npm run tauri dev`.
- Production frontend: `npm run build`.
- Windows installer: `npm run tauri build`.
- Tests: `npm test`.

Browser preview uses separate localStorage data, clearly labelled. The optional sample button appears only in an empty browser preview. Native use always uses SQLite and starts empty; it never falls back to browser storage on a database error.

## First version
- Customers with dated DR/CR opening balances, phone and address.
- Separate material entries, carriage, direct-amount payments, cheque receipts, returns.
- Add/edit entries and customer details, deterministic chronological running balances.
- Date ranges, this/last month, brought-forward balance and closing balance.
- Local A4 landscape PDF export, repeated headings, page numbers.
- A4 landscape print stylesheet; print full or filtered ledger.
- JSON backup and restore with validation, explicit replacement dialog, safety backup step, and an atomic SQLite restore.

DR increases what the customer owes. CR reduces it; a net CR is an advance. Money uses integer paisa, quantities use integer thousandths. Material amounts round once to the nearest whole rupee. Opening balances are shown separately from period transaction totals. No transactions can precede their customer's opening date. Same-day order is creation timestamp then ID; editing preserves the timestamp.

## Local database
`src-tauri/migrations/001_initial.sql` is migration 1 and initializes `parties` and `ledger_transactions`. Tauri loads it on startup. The database is `alfazal.db` under the app configuration directory (normally `%APPDATA%/com.alfazal.ledger/` on Windows). Future schema changes must use new numbered migrations rather than editing migrations already released.

The restore staging trigger applies one validated snapshot in one SQL statement, so invalid imports roll back entirely even with the plugin's connection pool. Backups are versioned JSON and contain customer information. Keep backup copies on a separate drive. Browser downloads cannot confirm a completed disk save, so confirm a safety backup downloaded before restoring preview data.

## Offline operation
All UI assets, fonts (system fonts), database code and PDF generation are local. The Windows installer is configured to bundle the offline WebView2 installer; its first build needs internet to download dependencies and that runtime. Installed daily use needs no server, account, or internet.

## Scope
This first version does not implement inventory, generated invoices, WhatsApp integration, multi-user access, encryption, or audit history. Edits replace saved values as requested. Cheques are credited immediately; clearing/bounced-cheque workflows are not yet implemented. Shop identity defaults to Shop Name and can be edited from the top-left profile button.


## Verification
- Unit/integration tests exercise ledger arithmetic, dated opening balances, backdated edits, inclusive ranges, input precision, SQLite constraints, atomic restore rollback, and PDF pagination.
- Browser checks cover adding/editing a material, reopening persisted records, CR opening balances, filtering, PDF and A4 print output, JSON backup/restore, invalid ranges, and smaller viewports.
- Browser preview and native database are intentionally separate. Do not enter production records in preview storage.

Native verification: the Windows executable successfully started, initialized its SQLite migration, saved a customer and material entry, retained them after reload, and reloaded bundled assets with network access disabled. Temporary native test records were removed afterward. Physical printer output still needs checking. Windows installer and upgrade validation is recorded in docs/release-validation-0.1.1.json.

## Shop profile and reusable options
Click the top-left shop name/icon to edit the shop name, tagline, owner/contact person, phone, email, address and statement footer. Branding is shared by the sidebar, PDFs and A4 printouts. Set reusable descriptions, brands and vehicle numbers one per line; transaction fields also suggest previously saved values across all customers and always allow free typing. Bill numbers are suggested from saved entries.

Currency inputs and displays use whole rupees. Quantities still support three decimal places, and quantity × rate rounds once to the nearest rupee. Storage remains integer paisa for compatibility; migration 2 does not rewrite historical transactions. A DR balance is red; a CR balance is green; a settled account is neutral.

Profile data is included in version 2 backups. Legacy version 1 backups remain supported and preserve the current shop profile when they do not contain one. Internal database filenames and the application identifier remain unchanged so existing customer records stay available.

## Import an old customer ledger

Choose Add Customer > Import Excel / CSV instead. Supports `.xlsx` and UTF-8 `.csv`, one customer per import, with worksheet/header/column mapping, dated opening balance detection, row validation and confirmation before saving. Existing customers are preserved; import creates a new customer. PDFs and old `.xls` are not import inputs. See `docs/obsidian-guides/13 Excel and CSV Import.md` for details.

## Windows setup and updates

Release 0.1.1 is packaged as an x64 NSIS installer with offline WebView2 included. See [installation and update instructions](docs/WINDOWS-INSTALL.md). The application identifier and database location remain stable across upgrades.

## Archive and delete customers

In Edit Customer, Archive keeps the ledger and hides the account from the active list. Use the Active / Archived / All filter and Restore Customer to bring it back. Shop totals include archived balances. Permanent Delete requires the exact customer name and a successful safety backup first, then atomically removes that customer and their ledger. The feature ships in version 0.1.2 with migration 4; legacy backups remain supported.

## Supplier Khata (0.1.3)

Supplier ledgers is a separate section with dated opening balances, multi-line purchase bills, brands/vehicles/invoice numbers, quantities/units/rates, cash/cheque/bank payments, material returns, date filters, PDF/A4 statements and archive/delete. Purchases are credit (amount owed, red); payments/returns are debit (advance, green). Backups are version 3 and cover both ledgers; old customer-only backups preserve current suppliers. Purchases do not update inventory yet. See `docs/obsidian-guides/16 Purchase and Supplier Ledger.md`.

## Roznamcha / daily cash book (0.1.4)

Daily Cash Book tracks explicitly marked customer cash receipts/refunds and supplier cash payments, shop expenses and other counter movements. Start with a dated drawer opening balance, then save end-of-day physical counts with shortage/excess and stale-closing detection. Cheque/bank/material entries do not affect physical cash. Old customer credits remain unclassified. Backup format 4 includes cash; older backups preserve current cash history. See `docs/obsidian-guides/17 Daily Cash Book and Expenses.md`.


## Advanced search and collections (0.1.5)

Use topbar search or Ctrl+K to find customer/supplier accounts, bill and vehicle numbers, descriptions and active cash entries across archived and active records. Outstanding dues shows positive customer balances with as-of/status/age/minimum/overdue filters, highest-balance or oldest-date sorting, ledger jumps and A4 printing. Optional opening/charge due dates support actual overdue amounts; FIFO aging is an estimate, not invoice allocation. SQLite migration 7 and backup v5 preserve existing records and accept older backups.


## Installer for another computer (0.1.6)

The separate `releases/Shop Ledger 0.1.6 - New Computer/` folder contains the offline Windows installer, new icon, instructions and checksum. No live database or backups are bundled. A new computer starts empty with a generic profile; an existing installation keeps its records. `scripts/package-new-computer.py` validates fresh SQLite initialization, NSIS payloads and embedded icon resources before copying the distribution.
```

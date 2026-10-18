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

Native verification: the Windows executable successfully started, initialized its SQLite migration, saved a customer and material entry, retained them after reload, and reloaded bundled assets with network access disabled. Temporary native test records were removed afterward. Physical printer output and Windows installer packaging still need checking after the first UI review.

## Shop profile and reusable options
Click the top-left shop name/icon to edit the shop name, tagline, owner/contact person, phone, email, address and statement footer. Branding is shared by the sidebar, PDFs and A4 printouts. Set reusable descriptions, brands and vehicle numbers one per line; transaction fields also suggest previously saved values across all customers and always allow free typing. Bill numbers are suggested from saved entries.

Currency inputs and displays use whole rupees. Quantities still support three decimal places, and quantity × rate rounds once to the nearest rupee. Storage remains integer paisa for compatibility; migration 2 does not rewrite historical transactions. A DR balance is red; a CR balance is green; a settled account is neutral.

Profile data is included in version 2 backups. Legacy version 1 backups remain supported and preserve the current shop profile when they do not contain one. Internal database filenames and the application identifier remain unchanged so existing customer records stay available.

## Import an old customer ledger

Choose Add Customer > Import Excel / CSV instead. Supports `.xlsx` and UTF-8 `.csv`, one customer per import, with worksheet/header/column mapping, dated opening balance detection, row validation and confirmation before saving. Existing customers are preserved; import creates a new customer. PDFs and old `.xls` are not import inputs. See `docs/obsidian-guides/13 Excel and CSV Import.md` for details.

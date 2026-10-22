---
title: "Dependencies and source manifest"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Dependencies and source manifest

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository: `C:/Users/FROST/Documents/GitHub/ledger-system`.
- Product version: 0.1.8.
- Git HEAD: `be91ed9aea1eb3ae5b305ec248a07c4896c9448d`.
- Latest commit: be91ed9 Update added Supplier and daily expense.
- Working-tree state at generation (documentation can itself be new/uncommitted):

```text
M .gitignore
 M README.md
 M REQUIREMENTS.md
 M assets/icon.svg
 M "docs/obsidian-guides/00 Start Here.md"
 M "docs/obsidian-guides/01 Requirements and Decisions.md"
 M "docs/obsidian-guides/03 Code Map and API.md"
 M "docs/obsidian-guides/04 Database and Migrations.md"
 M "docs/obsidian-guides/05 Accounting and Validation.md"
 M "docs/obsidian-guides/06 Interface Profile and Suggestions.md"
 M "docs/obsidian-guides/07 Statements and Backups.md"
 M "docs/obsidian-guides/09 Tests and Verification.md"
 M "docs/obsidian-guides/11 History and Handoff.md"
 M "docs/obsidian-guides/14 Windows Installer and Updates.md"
 M "docs/obsidian/Project Documentation.md"
 M "docs/obsidian/Shop Ledger Documentation/00 Start Here.md"
 M "docs/obsidian/Shop Ledger Documentation/01 Requirements and Decisions.md"
 M "docs/obsidian/Shop Ledger Documentation/02 Architecture and Data Flow.md"
 M "docs/obsidian/Shop Ledger Documentation/03 Code Map and API.md"
 M "docs/obsidian/Shop Ledger Documentation/04 Database and Migrations.md"
 M "docs/obsidian/Shop Ledger Documentation/05 Accounting and Validation.md"
 M "docs/obsidian/Shop Ledger Documentation/06 Interface Profile and Suggestions.md"
 M "docs/obsidian/Shop Ledger Documentation/07 Statements and Backups.md"
 M "docs/obsidian/Shop Ledger Documentation/08 Setup Build and Troubleshooting.md"
 M "docs/obsidian/Shop Ledger Documentation/09 Tests and Verification.md"
 M "docs/obsidian/Shop Ledger Documentation/10 Editing Playbook and Roadmap.md"
 M "docs/obsidian/Shop Ledger Documentation/11 History and Handoff.md"
 M "docs/obsidian/Shop Ledger Documentation/12 Dependencies and Source Manifest.md"
 M "docs/obsidian/Shop Ledger Documentation/13 Excel and CSV Import.md"
 M "docs/obsidian/Shop Ledger Documentation/14 Windows Installer and Updates.md"
 M "docs/obsidian/Shop Ledger Documentation/15 Customer Archive Restore and Delete.md"
 M "docs/obsidian/Shop Ledger Documentation/16 Purchase and Supplier Ledger.md"
 M "docs/obsidian/Shop Ledger Documentation/17 Daily Cash Book and Expenses.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/README - markdown.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/REQUIREMENTS - markdown.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/assets - icon.svg.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/dot - gitignore.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/dot - qa - generic-check.cjs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/dot - qa - native-check.cjs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/dot - qa - native-profile-check.cjs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/dot - qa - ui-check.cjs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/index.html.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/package-lock.json.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/package.json.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/scripts - export-obsidian.py.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - App.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - CashBookPage.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - DeleteCustomer.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - ImportCustomer.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - ProfilePage.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - SupplierPage.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - cash.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - cash.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - database.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - domain.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - domain.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - forms.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - import-ledger.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - import-ledger.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - main.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - pdf.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - pdf.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - profile.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - profile.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - sample.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - storage.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - styles.css.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - supplier-forms.tsx.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - suppliers.test.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - Cargo.lock.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - Cargo.toml.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - build.rs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - capabilities - default.json.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 001_initial.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 002_shop_profile.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 003_customer_import.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 004_customer_archive.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 005_suppliers.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 006_cash_book.sql.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - src - lib.rs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - src - main.rs.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - tauri.conf.json.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/tsconfig.json.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/vite.config.ts.md"
 M "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/vitest.config.ts.md"
 M docs/obsidian/documentation-manifest.json
 M package-lock.json
 M package.json
 M scripts/export-obsidian.py
 M src-tauri/Cargo.lock
 M src-tauri/Cargo.toml
 M src-tauri/icons/128x128.png
 M src-tauri/icons/128x128@2x.png
 M src-tauri/icons/32x32.png
 M src-tauri/icons/64x64.png
 M src-tauri/icons/Square107x107Logo.png
 M src-tauri/icons/Square142x142Logo.png
 M src-tauri/icons/Square150x150Logo.png
 M src-tauri/icons/Square284x284Logo.png
 M src-tauri/icons/Square30x30Logo.png
 M src-tauri/icons/Square310x310Logo.png
 M src-tauri/icons/Square44x44Logo.png
 M src-tauri/icons/Square71x71Logo.png
 M src-tauri/icons/Square89x89Logo.png
 M src-tauri/icons/StoreLogo.png
 M src-tauri/icons/icon.icns
 M src-tauri/icons/icon.ico
 M src-tauri/icons/icon.png
 M src-tauri/tauri.conf.json
 M src/App.tsx
 M src/CashBookPage.tsx
 M src/DuesPage.tsx
 M src/GlobalSearch.tsx
 M src/SupplierPage.tsx
 M src/pdf.test.ts
 M src/pdf.ts
 M src/styles.css
?? "docs/obsidian-guides/18 Advanced Search and Outstanding Dues.md"
?? "docs/obsidian-guides/19 New Computer Installer and App Icon.md"
?? "docs/obsidian/Shop Ledger Documentation/18 Advanced Search and Outstanding Dues.md"
?? "docs/obsidian/Shop Ledger Documentation/19 New Computer Installer and App Icon.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/scripts - package-new-computer.py.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - DuesPage.tsx.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - GlobalSearch.tsx.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - discovery.test.ts.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src - discovery.ts.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-19/src-tauri - migrations - 007_customer_due_dates.sql.md"
?? "docs/obsidian/Shop Ledger Documentation/Source Snapshot 2026-10-20/"
?? docs/release-validation-0.1.5.json
?? docs/release-validation-0.1.6.json
?? docs/release-validation-0.1.7.json
?? scripts/package-new-computer.py
?? src/discovery.test.ts
```

## Direct npm dependencies

| Package | Declared range | Locked version | Group |
|---|---|---|---|
| @tauri-apps/api | ^2.0.0 | 2.12.4 | dependencies |
| @tauri-apps/plugin-dialog | ^2.0.0 | 2.8.3 | dependencies |
| @tauri-apps/plugin-fs | ^2.0.0 | 2.7.1 | dependencies |
| @tauri-apps/plugin-sql | ^2.0.0 | 2.6.0 | dependencies |
| exceljs | ^4.4.0 | 4.4.0 | dependencies |
| jspdf | ^4.2.1 | 4.2.1 | dependencies |
| jspdf-autotable | ^5.0.0 | 5.0.9 | dependencies |
| lucide-react | ^0.468.0 | 0.468.0 | dependencies |
| react | ^19.0.0 | 19.3.1 | dependencies |
| react-dom | ^19.0.0 | 19.3.1 | dependencies |
| @tailwindcss/vite | ^4.0.0 | 4.3.3 | devDependencies |
| @tauri-apps/cli | ^2.0.0 | 2.12.3 | devDependencies |
| @types/node | ^24.0.0 | 24.19.2 | devDependencies |
| @types/react | ^19.0.0 | 19.3.0 | devDependencies |
| @types/react-dom | ^19.0.0 | 19.3.0 | devDependencies |
| @vitejs/plugin-react | ^4.4.0 | 4.7.0 | devDependencies |
| tailwindcss | ^4.0.0 | 4.3.3 | devDependencies |
| typescript | ~5.8.3 | 5.8.3 | devDependencies |
| vite | ^6.3.0 | 6.4.4 | devDependencies |
| vitest | ^5.0.5 | 5.0.5 | devDependencies |

## Direct Rust dependencies

| Crate | Declaration | Locked version(s) | Group |
|---|---|---|---|
| serde_json | "1" | 1.0.154 | dependencies |
| tauri | {"version": "2", "features": []} | 2.12.4 | dependencies |
| tauri-plugin-dialog | "2" | 2.8.3 | dependencies |
| tauri-plugin-fs | "2" | 2.7.1 | dependencies |
| tauri-plugin-sql | {"version": "2", "features": ["sqlite"]} | 2.6.0 | dependencies |
| tauri-build | {"version": "2", "features": []} | 2.7.3 | build-dependencies |

## Complete source copies

Every production source/config file, test file, both dependency lockfiles, the icon SVG, the exporter and selected QA script sources are archived below. No node_modules, Rust registry sources, build outputs, customer databases, JSON backup payloads, credentials or WebView profiles are included.

| Repository file | Bytes | SHA-256 prefix | Source note |
|---|---:|---|---|
| `.gitignore` | 128 | 0bf33cbc0e43d69d | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/dot - gitignore|Full source]] |
| `.qa/generic-check.cjs` | 5765 | 765268d0d97e690c | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/dot - qa - generic-check.cjs|Full source]] |
| `.qa/native-check.cjs` | 3807 | 64c0ba553708a8ae | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/dot - qa - native-check.cjs|Full source]] |
| `.qa/native-profile-check.cjs` | 2770 | 94bdfef25c31f938 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/dot - qa - native-profile-check.cjs|Full source]] |
| `.qa/ui-check.cjs` | 5111 | bb0b62fd471d64db | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/dot - qa - ui-check.cjs|Full source]] |
| `README.md` | 8575 | b1a82ced1f37ef64 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/README - markdown|Full source]] |
| `REQUIREMENTS.md` | 4531 | 863af9fef52dc460 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/REQUIREMENTS - markdown|Full source]] |
| `assets/icon.svg` | 1527 | b8a04582e4eb25b0 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/assets - icon.svg|Full source]] |
| `index.html` | 302 | c6a37b7c0518ad03 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/index.html|Full source]] |
| `package-lock.json` | 209079 | a0c2869074c9fcbb | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/package-lock.json|Full source]] |
| `package.json` | 1067 | 674b40d8bf3fbf85 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/package.json|Full source]] |
| `scripts/export-obsidian.py` | 13287 | 51f4f8509b830cdb | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/scripts - export-obsidian.py|Full source]] |
| `scripts/package-new-computer.py` | 5761 | f056ad3b141a012f | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/scripts - package-new-computer.py|Full source]] |
| `src-tauri/Cargo.lock` | 135309 | 1d504bc0cfaed611 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - Cargo.lock|Full source]] |
| `src-tauri/Cargo.toml` | 486 | 6572d9d7d398ddd7 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - Cargo.toml|Full source]] |
| `src-tauri/build.rs` | 36 | ce55d94ef836cc13 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - build.rs|Full source]] |
| `src-tauri/capabilities/default.json` | 465 | d96c2e21b8f36f23 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - capabilities - default.json|Full source]] |
| `src-tauri/migrations/001_initial.sql` | 3713 | 5c837f8b44922a37 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 001_initial.sql|Full source]] |
| `src-tauri/migrations/002_shop_profile.sql` | 1797 | 49ffafdf1fb5dfc5 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 002_shop_profile.sql|Full source]] |
| `src-tauri/migrations/003_customer_import.sql` | 1210 | 2100b85d11543c06 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 003_customer_import.sql|Full source]] |
| `src-tauri/migrations/004_customer_archive.sql` | 1672 | 1cda48800dd68745 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 004_customer_archive.sql|Full source]] |
| `src-tauri/migrations/005_suppliers.sql` | 7419 | 2968e0a3da00ce2c | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 005_suppliers.sql|Full source]] |
| `src-tauri/migrations/006_cash_book.sql` | 10386 | d826e05cc6c3bf9d | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 006_cash_book.sql|Full source]] |
| `src-tauri/migrations/007_customer_due_dates.sql` | 4370 | 8cb78d1ea84fe380 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - migrations - 007_customer_due_dates.sql|Full source]] |
| `src-tauri/src/lib.rs` | 1763 | 92df3f878664b748 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - src - lib.rs|Full source]] |
| `src-tauri/src/main.rs` | 108 | c7a31644d3747aff | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - src - main.rs|Full source]] |
| `src-tauri/tauri.conf.json` | 1432 | b356c322c794c2ff | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src-tauri - tauri.conf.json|Full source]] |
| `src/App.tsx` | 26553 | ef072cbe2ab45796 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - App.tsx|Full source]] |
| `src/CashBookPage.tsx` | 10897 | 6998a2e232163b5d | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - CashBookPage.tsx|Full source]] |
| `src/DeleteCustomer.tsx` | 1996 | c5b4467fb97cc5b8 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - DeleteCustomer.tsx|Full source]] |
| `src/DuesPage.tsx` | 5076 | c19499a641167252 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - DuesPage.tsx|Full source]] |
| `src/GlobalSearch.tsx` | 2389 | 3c872accad7d6932 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - GlobalSearch.tsx|Full source]] |
| `src/ImportCustomer.tsx` | 8311 | 0a372d7bb821151d | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - ImportCustomer.tsx|Full source]] |
| `src/ProfilePage.tsx` | 4272 | 6879f89e90f616ca | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - ProfilePage.tsx|Full source]] |
| `src/SupplierPage.tsx` | 13987 | 8d386c2d2d7f679f | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - SupplierPage.tsx|Full source]] |
| `src/cash.test.ts` | 9150 | 1eb8e5dc3ed90237 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - cash.test.ts|Full source]] |
| `src/cash.ts` | 5485 | 1d8377a012380479 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - cash.ts|Full source]] |
| `src/database.test.ts` | 8028 | de7010b7d62c1e3c | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - database.test.ts|Full source]] |
| `src/discovery.test.ts` | 6477 | da320894574baca1 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - discovery.test.ts|Full source]] |
| `src/discovery.ts` | 5728 | a799c7ddc79d1b05 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - discovery.ts|Full source]] |
| `src/domain.test.ts` | 5671 | 94573622920a272a | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - domain.test.ts|Full source]] |
| `src/domain.ts` | 13975 | f083e8ed36596621 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - domain.ts|Full source]] |
| `src/forms.tsx` | 11899 | 89177164164ab659 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - forms.tsx|Full source]] |
| `src/import-ledger.test.ts` | 4947 | d408baa34d183449 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - import-ledger.test.ts|Full source]] |
| `src/import-ledger.ts` | 9736 | 3e19e1c450594d21 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - import-ledger.ts|Full source]] |
| `src/main.tsx` | 225 | 86393317a594c30b | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - main.tsx|Full source]] |
| `src/pdf.test.ts` | 2167 | 78a1d964bfe4cd1b | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - pdf.test.ts|Full source]] |
| `src/pdf.ts` | 7122 | 5ccb8975818aaf1b | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - pdf.ts|Full source]] |
| `src/profile.test.ts` | 1028 | 7f610ac098ebc330 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - profile.test.ts|Full source]] |
| `src/profile.ts` | 1776 | c316f239e32d31ba | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - profile.ts|Full source]] |
| `src/sample.ts` | 1649 | 3bea936ec62e7bfe | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - sample.ts|Full source]] |
| `src/storage.ts` | 15297 | 8d7f0737087df326 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - storage.ts|Full source]] |
| `src/styles.css` | 29551 | b763418b159e8715 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - styles.css|Full source]] |
| `src/supplier-forms.tsx` | 11245 | db6de3636ce1d7b4 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - supplier-forms.tsx|Full source]] |
| `src/suppliers.test.ts` | 8288 | 48d27d932ea6a613 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/src - suppliers.test.ts|Full source]] |
| `tsconfig.json` | 453 | f55c101738bafa21 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/tsconfig.json|Full source]] |
| `vite.config.ts` | 354 | efbb958bcc3f1f73 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/vite.config.ts|Full source]] |
| `vitest.config.ts` | 142 | ee17157b192e07de | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-20/vitest.config.ts|Full source]] |

## Test names at this snapshot

### cash.test.ts

- counts only explicit cash and treats customer refunds as cash out
- carries expected cash forward and excludes earlier/future/voided movements
- detects stale closing after a backdated correction but not a future movement
- synchronizes edits without duplicates and voids a reclassified noncash payment
- rejects invalid amounts and duplicate movements; requires drawer setup
- writes full backup v4 and accepts older customer/supplier backups
- initializes cash schema without assuming old customer credits are cash
- mirrors customer cash once, updates it, excludes cheques and preserves history on account deletion
- restores cash snapshots atomically and keeps current cash for old backups
- synchronizes supplier cash payment group edits without counting cheques
- backfills only previously explicit supplier cash on migration, excluding unspecified customer credits

### database.test.ts

- initializes a snapshot and never retains a restore payload
- rolls back the entire restore when even one new entry is invalid
- guards both transaction edits and opening-date edits
- upgrades an existing ledger without changing customer or transaction values
- restores the shop profile atomically and preserves it for legacy snapshots
- atomically imports a new customer without replacing existing customers and rolls back invalid batches
- upgrades existing customers to active, preserves archive in backups, and restores legacy backups as active
- permanently deletes only the chosen customer and their transactions in one statement
- rolls back child transaction removal if parent deletion fails

### discovery.test.ts

- finds normalized names, phone, punctuated bill and vehicle across archived customers and suppliers
- limits large result lists without hiding the total, and ignores empty searches and voided cash
- preserves Urdu names and exact bill matches before partial matches
- reduces oldest charges first, including partial settlement of a dated opening
- applies opening advances and overpayments to later charges without negative dues
- excludes future charges and openings but includes archived debt; today is not overdue
- sorts largest balance, oldest charge, or real due dates with undated balances last
- validates optional due dates only on customer debit charges and debit openings
- round trips due dates with full v5 backups
- migrates and restores dated and legacy backups without losing cash snapshots

### domain.test.ts

- adds deliveries and subtracts payments, including customer advances
- brings earlier activity forward and includes both boundary dates
- shows zero before the dated opening balance
- includes opening once when the period starts on its date
- recalculates after a backdated entry and an edited amount
- sorts same-day entries deterministically and excludes other customers
- keeps carried balances when a range has no entries
- rejects an inverted date range
- parses decimal money exactly and rounds fractional quantities once
- rejects excess precision, negative, malformed and oversized values
- validates real calendar dates
- rejects transactions before opening and overlapping DR/CR
- rejects malformed backups and duplicate IDs
- displays whole rupees, including zero and legacy fractional values
- rounds a fractional material quantity once to whole rupees
- assigns debit red and credit green classes by the signed balance
- accepts legacy and archived customer backups but rejects invalid archive status

### import-ledger.test.ts

- handles the printable ledger headings and metadata
- imports opening once, payment/returns as credit, and keeps same-day order
- ignores blank prefilled formulas and repeated headings
- calculates only recognized quantity times rate without a cached debit
- reports bad dates, missing amounts and both debit/credit without silently dropping rows
- preserves decimals, identifiers and identical legitimate deliveries
- parses quoted multiline CSV, escaped quotes and accounting separators
- requires explicit mappings and rejects reused columns
- validates opening date and Excel serial dates
- rejects unsupported and oversized files
- reads a real xlsx with formulas, dates and non-ledger sheets

### pdf.test.ts

- generates landscape A4 statements with filtered dates
- paginates long ledgers and repeats headings
- uses shop profile branding and whole rupees in exported statements

### profile.test.ts

- deduplicates saved and historical options without changing their text
- requires a shop name and validates optional fields and suggestion lengths
- accepts legacy backups and rejects malformed profile data

### suppliers.test.ts

- adds purchases to amounts owed, deducts payments, and uses supplier-specific colors
- handles an advance, returned goods and filtered balance brought forward
- keeps different units as separate lines and rounds each material line
- rejects reversed sides, missing bank references and incorrect quantity-rate totals
- rejects mixed suppliers or invoices inside a group and duplicate payment groups
- validates opening dates against transactions and missing supplier references
- writes backup v3 with both ledgers and reads legacy backups without inventing suppliers
- prints supplier-specific signs, units and payment references in PDF
- initializes supplier tables without changing existing customers
- saves a multi-line invoice atomically and rolls back a failed edit
- prevents cross-supplier bill replacement and invalid side/date edits
- restores suppliers with archive flags, preserves them for legacy backups, and rolls back all sections on failure
- deletes only the targeted supplier ledger and retains customer data

Discovered named test cases: **77**. This is a source inventory, not a new test run.

## Generated icon assets

These are reproducible assets generated from assets/icon.svg. Binary files are inventoried, not embedded as Markdown source.

| File | Bytes | SHA-256 prefix |
|---|---:|---|
| src-tauri/icons/128x128.png | 5784 | 0f8eeebd5eb46d58 |
| src-tauri/icons/128x128@2x.png | 11710 | d2d8f6a9e922dd85 |
| src-tauri/icons/32x32.png | 1425 | 0a8c88d91796a399 |
| src-tauri/icons/64x64.png | 2819 | f3a7a81a731a25a8 |
| src-tauri/icons/icon.icns | 150211 | 2a435701e7fb74e9 |
| src-tauri/icons/icon.ico | 23806 | 3843883dc00d6f96 |
| src-tauri/icons/icon.png | 25557 | aa00f4ee7e49a214 |
| src-tauri/icons/Square107x107Logo.png | 4896 | 904179432a437b92 |
| src-tauri/icons/Square142x142Logo.png | 6654 | 8ff9b4b6c629fb26 |
| src-tauri/icons/Square150x150Logo.png | 6957 | b988b5ddea96c473 |
| src-tauri/icons/Square284x284Logo.png | 13169 | 0833fdb5fc4af9e5 |
| src-tauri/icons/Square30x30Logo.png | 1446 | d17bc49ffa0c27c3 |
| src-tauri/icons/Square310x310Logo.png | 14931 | 2ae445fae1b54c10 |
| src-tauri/icons/Square44x44Logo.png | 2066 | fd6a56723f2f07ab |
| src-tauri/icons/Square71x71Logo.png | 3364 | 5458b65bd15314cc |
| src-tauri/icons/Square89x89Logo.png | 4235 | 503df7c51249acf4 |
| src-tauri/icons/StoreLogo.png | 2223 | 10efc4da99e2a5f1 |

## Verification and drift

Source-note hashes refer to original file bytes. Compare with the repository before relying on a dated copy. Exact dependency graphs are retained in the complete package-lock.json and Cargo.lock source notes. Refreshing notes does not install dependencies, rerun tests, commit code, or sync Engram.

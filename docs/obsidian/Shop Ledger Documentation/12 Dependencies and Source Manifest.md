---
title: "Dependencies and source manifest"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Dependencies and source manifest

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository: `C:/Users/FROST/Documents/GitHub/ledger-system`.
- Product version: 0.1.0.
- Git HEAD: `03f3110214d4c5129273b7072a041f16785bd474`.
- Latest commit: 03f3110 First Version Ledgers.
- Working-tree state at generation (documentation can itself be new/uncommitted):

```text
M README.md
 M package-lock.json
 M package.json
 M src-tauri/capabilities/default.json
 M src-tauri/src/lib.rs
 M src/App.tsx
 M src/database.test.ts
 M src/forms.tsx
 M src/storage.ts
 M src/styles.css
?? docs/
?? scripts/
?? src-tauri/migrations/003_customer_import.sql
?? src/ImportCustomer.tsx
?? src/import-ledger.test.ts
?? src/import-ledger.ts
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
| `.gitignore` | 106 | ec3cabb0e095e7ba | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/dot - gitignore|Full source]] |
| `.qa/generic-check.cjs` | 5765 | 765268d0d97e690c | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/dot - qa - generic-check.cjs|Full source]] |
| `.qa/native-check.cjs` | 3807 | 64c0ba553708a8ae | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/dot - qa - native-check.cjs|Full source]] |
| `.qa/native-profile-check.cjs` | 2770 | 94bdfef25c31f938 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/dot - qa - native-profile-check.cjs|Full source]] |
| `.qa/ui-check.cjs` | 5111 | bb0b62fd471d64db | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/dot - qa - ui-check.cjs|Full source]] |
| `README.md` | 5615 | c6b0c9d9610b01f9 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/README - markdown|Full source]] |
| `REQUIREMENTS.md` | 2676 | ed5d5721d4167d95 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/REQUIREMENTS - markdown|Full source]] |
| `assets/icon.svg` | 383 | 5d9b09e5045a3b71 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/assets - icon.svg|Full source]] |
| `index.html` | 302 | c6a37b7c0518ad03 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/index.html|Full source]] |
| `package-lock.json` | 209079 | efc210c70b440825 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/package-lock.json|Full source]] |
| `package.json` | 1067 | e444b15e92df6917 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/package.json|Full source]] |
| `scripts/export-obsidian.py` | 13034 | 032828b47a3a8fe3 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/scripts - export-obsidian.py|Full source]] |
| `src-tauri/Cargo.lock` | 129922 | 0e6535903e4b2af2 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - Cargo.lock|Full source]] |
| `src-tauri/Cargo.toml` | 467 | dbda88afb9a18eaf | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - Cargo.toml|Full source]] |
| `src-tauri/build.rs` | 36 | ce55d94ef836cc13 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - build.rs|Full source]] |
| `src-tauri/capabilities/default.json` | 465 | d96c2e21b8f36f23 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - capabilities - default.json|Full source]] |
| `src-tauri/migrations/001_initial.sql` | 3713 | 5c837f8b44922a37 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - migrations - 001_initial.sql|Full source]] |
| `src-tauri/migrations/002_shop_profile.sql` | 1797 | 49ffafdf1fb5dfc5 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - migrations - 002_shop_profile.sql|Full source]] |
| `src-tauri/migrations/003_customer_import.sql` | 1210 | 2100b85d11543c06 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - migrations - 003_customer_import.sql|Full source]] |
| `src-tauri/src/lib.rs` | 1015 | 17cb9d773a91a8d1 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - src - lib.rs|Full source]] |
| `src-tauri/src/main.rs` | 108 | c7a31644d3747aff | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - src - main.rs|Full source]] |
| `src-tauri/tauri.conf.json` | 1185 | e443ee841365c26c | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src-tauri - tauri.conf.json|Full source]] |
| `src/App.tsx` | 20344 | a4a5c48a508536cb | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - App.tsx|Full source]] |
| `src/ImportCustomer.tsx` | 8311 | 0a372d7bb821151d | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - ImportCustomer.tsx|Full source]] |
| `src/ProfilePage.tsx` | 4272 | 6879f89e90f616ca | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - ProfilePage.tsx|Full source]] |
| `src/database.test.ts` | 5481 | 522b0434e72edf77 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - database.test.ts|Full source]] |
| `src/domain.test.ts` | 5309 | 883112f8661203e7 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - domain.test.ts|Full source]] |
| `src/domain.ts` | 7358 | 9e90bbc29200adf5 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - domain.ts|Full source]] |
| `src/forms.tsx` | 9757 | 88f8f0123bacace2 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - forms.tsx|Full source]] |
| `src/import-ledger.test.ts` | 4947 | d408baa34d183449 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - import-ledger.test.ts|Full source]] |
| `src/import-ledger.ts` | 9736 | 3e19e1c450594d21 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - import-ledger.ts|Full source]] |
| `src/main.tsx` | 225 | 86393317a594c30b | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - main.tsx|Full source]] |
| `src/pdf.test.ts` | 1967 | e15222cdb1ba48c1 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - pdf.test.ts|Full source]] |
| `src/pdf.ts` | 4639 | 4965956d2f335b6a | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - pdf.ts|Full source]] |
| `src/profile.test.ts` | 1028 | 7f610ac098ebc330 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - profile.test.ts|Full source]] |
| `src/profile.ts` | 1776 | c316f239e32d31ba | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - profile.ts|Full source]] |
| `src/sample.ts` | 1649 | 3bea936ec62e7bfe | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - sample.ts|Full source]] |
| `src/storage.ts` | 6795 | 1c636c747fb18bbd | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - storage.ts|Full source]] |
| `src/styles.css` | 25066 | 1c400483ca55498f | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/src - styles.css|Full source]] |
| `tsconfig.json` | 453 | f55c101738bafa21 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/tsconfig.json|Full source]] |
| `vite.config.ts` | 354 | efbb958bcc3f1f73 | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/vite.config.ts|Full source]] |
| `vitest.config.ts` | 142 | ee17157b192e07de | [[Alfazal Ledgher System/Shop Ledger Documentation/Source Snapshot 2026-10-18/vitest.config.ts|Full source]] |

## Test names at this snapshot

### database.test.ts

- initializes a snapshot and never retains a restore payload
- rolls back the entire restore when even one new entry is invalid
- guards both transaction edits and opening-date edits
- upgrades an existing ledger without changing customer or transaction values
- restores the shop profile atomically and preserves it for legacy snapshots
- atomically imports a new customer without replacing existing customers and rolls back invalid batches

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

Discovered named test cases: **39**. This is a source inventory, not a new test run.

## Generated icon assets

These are reproducible assets generated from assets/icon.svg. Binary files are inventoried, not embedded as Markdown source.

| File | Bytes | SHA-256 prefix |
|---|---:|---|
| src-tauri/icons/128x128.png | 2043 | a31e9065d95ccbad |
| src-tauri/icons/128x128@2x.png | 3808 | 39f559290b315bc2 |
| src-tauri/icons/32x32.png | 637 | c5a7ab610f150424 |
| src-tauri/icons/64x64.png | 1192 | 1071c88ff6f1f716 |
| src-tauri/icons/icon.icns | 47880 | 3d308fce591cd683 |
| src-tauri/icons/icon.ico | 8779 | 477c97500214e87e |
| src-tauri/icons/icon.png | 7691 | 1cfabba41dcddd74 |
| src-tauri/icons/Square107x107Logo.png | 1790 | a67aff79846bc436 |
| src-tauri/icons/Square142x142Logo.png | 2163 | 18d92e83bfacf85c |
| src-tauri/icons/Square150x150Logo.png | 2375 | 93559de13a899e5e |
| src-tauri/icons/Square284x284Logo.png | 4470 | ff5f4607879fe699 |
| src-tauri/icons/Square30x30Logo.png | 600 | b5cc92d26a875785 |
| src-tauri/icons/Square310x310Logo.png | 4936 | c93a1e851f300a80 |
| src-tauri/icons/Square44x44Logo.png | 844 | 6b649fac45d82600 |
| src-tauri/icons/Square71x71Logo.png | 1285 | 59f5c12ed63ae86b |
| src-tauri/icons/Square89x89Logo.png | 1462 | 88ee88163b47ba4f |
| src-tauri/icons/StoreLogo.png | 966 | 88d99a233ca75466 |

## Verification and drift

Source-note hashes refer to original file bytes. Compare with the repository before relying on a dated copy. Exact dependency graphs are retained in the complete package-lock.json and Cargo.lock source notes. Refreshing notes does not install dependencies, rerun tests, commit code, or sync Engram.

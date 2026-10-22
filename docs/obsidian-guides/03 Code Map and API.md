# Code map and API

## Production modules

| File | Responsibility | Main edit reasons |
|---|---|---|
| `src/main.tsx` | Mount React StrictMode and CSS | App bootstrap |
| `src/App.tsx` | Ledger shell, customer list, state, date filters, exports/backups | Navigation, main layout, workflow wiring |
| `src/forms.tsx` | Modal, customer form, transaction form | Entry fields, input behavior |
| `src/ProfilePage.tsx` | Editable shop profile and reusable option lists | Profile fields and settings layout |
| `src/domain.ts` | Domain interfaces, precision, ledger rules and validation | Accounting and date behavior |
| `src/profile.ts` | ShopProfile, defaults, validation, option deduplication | Profile schema and suggestions |
| `src/storage.ts` | SQLite/browser adapters; file save/read; restore | Data access and persistence |
| `src/pdf.ts` | jsPDF/AutoTable statement generator | PDF branding, columns, layout and colors |
| `src/styles.css` | Tailwind import/theme, custom UI and A4 media rules | Screen styles and physical print layout |
| `src/sample.ts` | Explicit browser-preview sample customers/transactions | Demonstration data |
| `src-tauri/src/lib.rs` | Plugins, SQL migration registration, Tauri startup | Native integration |
| `src-tauri/migrations/*.sql` | Database structure and triggers | Additive schema evolution |

See [[12 Dependencies and Source Manifest]] for the complete file-by-file source snapshot.

## Domain interfaces

- `Party`: ID, name, phone, address, opening date and signed opening amount in paisa.
- `LedgerTransaction`: ID, customer ID, transaction date, description, brand, vehicle/bill strings, quantity in thousandths, rate/debit/credit in paisa, creation timestamp.
- `Store`: parties, transactions, optional profile. Profile is optional for legacy-backup compatibility.
- `LedgerRow`: transaction plus its derived signed balance.
- `ShopProfile`: identity/contact/footer strings and reusable option arrays.

## domain.ts exports

| Symbol | Input / result |
|---|---|
| `today()` | Local-calendar YYYY-MM-DD, without UTC-date shifting |
| `validDate(value)` | Strict real calendar date, years 1900–9999 |
| `decimal(value, places=2)` | Decimal string to scaled integer; currently used for quantities and legacy tests |
| `materialAmount(quantity, rate)` | Legacy nearest-paisa helper; retained but current form uses wholeMaterialAmount |
| `wholeRupees(value)` | Digits-only whole PKR string → paisa integer |
| `wholeMaterialAmount(quantity, rate)` | Quantity thousandths × rate paisa → nearest-whole-rupee amount stored as paisa |
| `money(paisa)` | Absolute whole-rupee formatted string |
| `balanceText(paisa)` | Formatted absolute amount plus signed DR/CR suffix |
| `balanceClass(value)` | debit-text / credit-text / neutral-text |
| `dateText(value)` | Human-readable date using en-GB |
| `ordered(transactions)` | Copy sorted by date, creation timestamp, ID |
| `ledger(party, transactions, from='', to='')` | rows, broughtForward, openingInPeriod, debit, credit, closing |
| `validateParty(party, transactions)` | Throws on invalid customer/opening date/amount |
| `validateTransaction(tx, party)` | Throws on invalid date, fields, amounts or debit-credit combination |
| `validateStore(value)` | Validates backups including optional profile and references; returns Store |

## profile.ts exports

- `defaultProfile`: Shop Name / Your business, in balance.; blank contacts; thank-you footer; generic description suggestions.
- `validateProfile(value)`: string lengths, nonblank name, bounded option arrays.
- `uniqueOptions(values)`: trims, removes blanks, deduplicates case-insensitively while retaining the first spelling, then alphabetically sorts.

## storage.ts exports

- `desktop`: environment boolean.
- `loadStore()`: reads parties, transactions and profile.
- `saveParty(party, current)`: validates against current transactions and UPSERTs.
- `saveTransaction(tx, party)`: validates and UPSERTs; creation timestamp remains unchanged on conflict.
- `saveProfile(profile)`: validates and saves singleton JSON.
- `restoreStore(value)`: validates snapshot, fills absent legacy profile from the current store, performs atomic native restore or one browser localStorage replacement.
- `saveFile(name, bytes, extension)`: returns false for cancelled native save, otherwise writes through native dialog/filesystem or browser download.
- `readBackup()`: selected file text or null.

## UI props and local helpers

- `Modal({title, subtitle, children, close, busy})` uses an HTML dialog; handles Escape and disables closing while busy.
- `PartyForm({party?, close, save})` adds/edits a customer and opening balance.
- `TransactionForm({party, transaction?, profile, transactions, close, save})` calculates one debit or credit and builds suggestions across customers.
- `ProfilePage({profile, save, back})` uses one option per textarea line; inputs validate before persistence.
- App helpers: `refresh` reloads store/selection; `setRange` sets month shortcuts; `perform` wraps async errors/busy status; `backup` writes JSON; `chooseRestore` checks envelope/version; `exportPdf` creates and saves the selected statement.

## Configuration files

`package.json` defines commands and dependency ranges; `package-lock.json` locks npm versions. `Cargo.toml`/`Cargo.lock` define Rust dependencies. `vite.config.ts` fixes port 1420 and ignores Rust/QA folders in the watcher. `vitest.config.ts` discovers only `src/**/*.test.ts`. `tauri.conf.json` defines native title/window/CSP/bundling. `capabilities/default.json` defines plugin permissions.

Generated artifacts such as `dist/`, `target/`, `node_modules/` and Tauri schemas are not source-edit targets.



## 0.1.5 — Advanced search and collections (2026-10-19)

Topbar Ctrl+K search, archived-account jumps, outstanding customer dues with FIFO aging and optional actual due dates. Migration 7 adds blank-default due-date fields; backups are now v5 with v1–v4 compatibility. See [[Alfazal Ledgher System/Shop Ledger Documentation/18 Advanced Search and Outstanding Dues]] for behavior, source map and verification.

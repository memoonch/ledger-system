# Excel and CSV customer import

Open **Add customer → Import Excel / CSV instead**. Choose one customer's `.xlsx` workbook or UTF-8 `.csv`, select the worksheet and heading row, review column mappings, customer details and opening balance, check the confirmation box, then import.

The source file remains unchanged. Import creates a new customer. Existing customers are preserved. A matching customer name triggers an explicit duplicate warning; this version does not append/merge into an existing account. PDFs are reference material, not accepted import inputs. Save older `.xls` files as `.xlsx` first.

## Accounting and interpretation

- Required mapped columns: date, description, debit and credit. Optional brand, vehicle, bill, quantity and rate.
- Headers are detected in the first 100 rows; users can choose another heading row and manually map columns.
- Text dates: `DD/MM/YYYY` or `YYYY-MM-DD`. XLSX typed dates and Excel serial dates supported. Dates are never invented for transaction rows.
- First `Balance F/C`, `Balance B/F`, `Opening Balance` or `Brought Forward` is moved to the dated opening fields, excluded from transactions. Users must confirm these fields. Later opening rows are errors.
- Debit/credit columns are authoritative. Cached Excel results are read. For an uncached debit, only the same-row quantity-times-rate formula is supported; other uncached formulas block import. Formulas are never executed.
- Empty template rows and repeated headings/totals are skipped. Invalid nonempty rows block the whole import with source row numbers. No silent partial import.
- Source running balances are ignored. App balances recalculate chronologically; same-date rows keep source order. Identical deliveries are retained because they may be legitimate.
- Legacy fractional amounts up to two decimal places are preserved in paisa, with a warning. Normal app screens display rounded whole rupees. Editing imported fractional values through normal whole-rupee forms can change their precision.
- File limit 10 MB; each sheet/CSV max 20,000 rows and 100 columns. XLSX loads in memory; encrypted files and arbitrary formula evaluation are unsupported. CSV must be UTF-8.

## Code and persistence

- `src/import-ledger.ts`: file loading, ExcelJS lazy import, CSV parsing, header aliases, customer metadata, date/money parsing, preview/validation.
- `src/ImportCustomer.tsx`: file/worksheet/header/mapping selection, review, warnings, opening fields and save confirmation.
- `src/forms.tsx`: Add Customer import entry point.
- `src/App.tsx`: import dialog, save callback, refresh/select imported customer/reset dates.
- `src/storage.ts`: `readSpreadsheet()` with user-selected file access, `importCustomer()` validation and persistence.
- `src-tauri/migrations/003_customer_import.sql`: `import_requests` and `import_customer` trigger. A single INSERT creates the party and all transactions, then removes the request. Any constraint failure rolls back the entire statement. Existing records are never deleted by import.
- `src-tauri/src/lib.rs`: registers migration 3.
- Capabilities add `fs:allow-read-file` and `fs:allow-stat`; file scope comes from the native picker.
- Browser uses one localStorage snapshot write after full validation; native uses SQLite. The two stores remain separate.
- ExcelJS is bundled for offline use and loaded only on Excel import. UUID dependency overridden to a patched compatible version; npm audit reports zero vulnerabilities at this change.

## Verification

39 automated tests pass across five files, including 11 import parser tests and a SQLite atomic import/rollback test. An isolated browser verified the supplied empty workbook, a populated CSV with opening/payment/return, explicit confirmation, persistence after reload, invalid-row blocking and unchanged records after cancellation. Original customer files were not modified or automatically imported into the user's app.

The supplied workbook contains the Memoon customer header and blank formula-driven transaction rows. The PDF supplied later illustrates populated entries, opening balance, cheque receipt, return and out-of-date-order rows; it was inspected as reference only. Customer source data is intentionally excluded from documentation snapshots.

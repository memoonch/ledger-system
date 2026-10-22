---
title: "Purchase and supplier ledger"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Purchase and supplier ledger

## Workflow

Open **Supplier ledgers** beside Customer ledgers. Add a manufacturer/wholesaler with name, contact person, phone, address and dated opening balance. CR opening means the shop owes the supplier; DR means money advanced to that supplier.

**Add purchase bill** records an invoice date, supplier bill/invoice number and truck/vehicle number. Add up to 200 material lines; each line has description, brand, quantity, unit and rate. Unit suggestions include bags, kg, tons and pieces, and custom units are allowed. Descriptions, brands and vehicles use editable suggestions from the profile and saved supplier entries. Quantity has up to three decimal places; rates and amounts use whole rupees. Each line rounds once and the bill total is the sum of those rounded lines.

Each material appears separately in the supplier ledger under Date, Description, Brand, Vehicle no., Bill no., Quantity/unit, Rate, Debit, Credit and Running Balance. Lines on the same purchase share the bill group, date, invoice number and vehicle. Editing any purchase/return row opens the entire grouped document; changes replace all its lines atomically and recalculate subsequent balances.

**Add payment** records date, whole-rupee amount, Cash/Cheque/Bank transfer, reference, receipt/bill number and description. Cheque and bank references are required. Method and reference appear in the ledger description and PDFs. Payments apply to the supplier's overall account; invoice settlement allocation is not implemented.

**Add supplier return** records material lines at the agreed return rate and reduces the amount owed. It requires a bill/reference number and records no stock movement yet.

## Supplier accounting

The same signed arithmetic is used internally: opening + debit − credit. Supplier meanings are:

| Entry | Column | Effect |
|---|---|---|
| Purchase | Credit | More owed to supplier |
| Supplier payment | Debit | Less owed / more advance |
| Return to supplier | Debit | Less owed / more advance |
| Negative closing balance | CR, red | You owe supplier |
| Positive closing balance | DR, green | Your advance with supplier |

Customer signs and colors remain unchanged. Supplier totals are separate from customer receivables. Archived supplier balances remain in payable/advance totals.

## Statements and management

All-time, this month, last month and custom inclusive From/To date ranges are supported. Statements show balance brought forward, dated opening balance where applicable, period debit/credit and closing balance. Running order is date, creation timestamp and identifier. Same-day bill lines retain their stored order when edited.

PDF and A4 landscape printing show the supplier legend, units, payment details and the shop profile branding. Accounts support Archive/Restore and backup-first exact-name Permanent Delete, matching customer management. Archived ledgers remain viewable/editable/exportable. Permanent supplier deletion removes only that supplier and its entries.

## Storage and migration 5

- `suppliers`: separate table with customer-like identity/opening/archive fields plus `contact_person`.
- `supplier_transactions`: separate entries with all customer-ledger columns plus `group_id`, `entry_type` (purchase/payment/return), `unit`, `payment_method`, `reference`.
- `supplier_bill_requests`: transient JSON staging table. A single bound INSERT replaces one group and inserts all its rows. Failed validation/constraints roll back the entire statement, including removed old rows.
- Date/opening triggers prevent entries before the opening date and invalid opening-date edits. Purchases require credit; payments and returns require debit.
- A supplier-delete trigger removes only the associated supplier transactions atomically. Customer tables are untouched.
- Supplier groups must share supplier/type/date/invoice/vehicle. Payment groups contain exactly one entry. Validation limits group size to 200 and rejects unsafe aggregate totals.

Migration `005_suppliers.sql` creates these tables/indexes/triggers and extends atomic backup restore. Versions 1–4 remain unchanged, preserving existing customer data.

## Backup version 3

The JSON envelope now uses `format: shop-ledger`, `version: 3`. `data` includes `parties`, `transactions`, `profile`, `suppliers` and `supplierTransactions`. Version 3 requires both supplier arrays, including empty arrays when clearing them deliberately. A successful full restore replaces both sections atomically; a failure in either section rolls back the whole restore.

Legacy version 1 and 2 customer backups remain supported. When supplier sections are absent, current suppliers and their ledger entries are preserved; the restore dialog explicitly explains this. Customer deletion and supplier deletion both save a complete version-3 safety backup. Older app versions cannot restore version-3 backups: use 0.1.3 or later.

## Code map

- `src/domain.ts`: Supplier/SupplierTransaction types, supplier validators, reversed supplier balance presentation, backup envelope serialization/decoding.
- `src/storage.ts`: load supplier arrays, save supplier, atomic bill save, archive/delete, legacy restore preservation.
- `src/supplier-forms.tsx`: supplier account, multi-line purchase/return document and payment forms.
- `src/SupplierPage.tsx`: supplier lists, search/status, totals, ledger, filters, forms, statements and backup-first deletion.
- `src/App.tsx`: separate navigation, version-3 backup/restore and supplier page wiring.
- `src/DeleteCustomer.tsx`: shared role-aware exact-name deletion confirmation; customer behavior remains default.
- `src/pdf.ts`: optional supplier rendering mode with supplier legend/colors, units, contact and payment reference. Existing customer calls retain their original behavior.
- `src/styles.css`: supplier forms/actions and shared sidebar navigation styling.
- `src-tauri/migrations/005_suppliers.sql`, `src-tauri/src/lib.rs`: migration/schema registration.
- `src/suppliers.test.ts`: supplier domain, PDF, SQLite atomicity and compatibility regressions.

## Verification and limits

56 tests pass across six files. Isolated browser tests cover supplier creation, multi-line purchases, payment reference, material return, grouped editing, debt-to-advance crossing, colors, date filtering, PDF, A4 output, archive/restore, deletion, backup/restore and customer isolation. The sample printed statement fits one A4 landscape page. Native installation/persistence verification is recorded in `docs/release-validation-0.1.3.json`.

No inventory, purchase tax/discount engine, invoice-level payment matching, cheque clearance/bounce workflow or profit reporting is introduced. Supplier Excel/PDF import is not included; the existing Excel/CSV importer remains for customers. There is no automatic stock update from purchases yet. The app remains offline and single-user in operation.

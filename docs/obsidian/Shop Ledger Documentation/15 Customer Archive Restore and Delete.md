---
title: "Archive, restore and permanently delete customers"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Archive, restore and permanently delete customers

## Use

Open a customer and click **Edit customer**.

- **Archive customer** hides the account from Active customers while keeping the customer details, opening balance and full transaction history. Shop receivable/advance totals continue to include archived accounts so debts never disappear from totals.
- Choose **Archived customers** in the list filter to find hidden accounts. Their ledger remains available for viewing, editing, PDFs and printing. **Restore customer** puts the account back into Active customers.
- **All customers** shows both groups. Archive status is visibly labelled.
- **Permanently delete…** opens a separate confirmation showing transaction count and current balance. Type the exact customer name, then choose **Save safety backup & permanently delete**. Cancellation or a failed backup save leaves records unchanged. The backup contains all customers, transactions and profile, not just the chosen account.
- Permanent deletion removes the chosen customer, their opening balance and all their transactions. Other customer records and shop profile are retained. There is no recycle bin. Recovery uses Restore backup, replacing the current store; later work after the backup is not merged automatically.

The feature is available in Windows release 0.1.2. It does not automatically archive or delete existing customers.

## Data and migration

`Party.archived?: number` uses 0 (active) / 1 (archived). It is optional in TypeScript only for legacy backup compatibility. Validation rejects every other value. SQLite migration **004_customer_archive.sql** adds the non-null checked column with default 0, so existing customers remain active.

The migration also updates the atomic restore trigger to restore archive flags using `COALESCE(...,0)`. Older backups without the property restore as active. Backup envelope remains version 2; archived is an additive customer property. Older app versions do not preserve archive status when restoring new backups, so use the current version for recovery. Imported new customers default active.

`delete_customer_ledger` is a BEFORE DELETE trigger on parties. It removes only transactions matching `OLD.id` before the foreign-key-restricted parent is removed. The entire DELETE statement is atomic; failure of the parent deletion rolls back child removals. Existing restore operations still work with this trigger.

## Code map

- `src/domain.ts`: optional archive property and validation.
- `src/storage.ts`: `setCustomerArchived(id, archived)` and `deleteCustomer(id, confirmedName)`. Browser writes one validated snapshot; native SQL uses bound parameters and a single DELETE with id/name guard.
- `src/forms.tsx`: Edit Customer archive/restore/delete controls. Normal customer edits preserve archive status.
- `src/DeleteCustomer.tsx`: exact-name input, balance/transaction summary, backup-first action, failure/cancellation feedback.
- `src/App.tsx`: active/archived/all filter, selection after status change, labelled archived accounts, all-customer financial totals, fresh-store safety backup before deletion.
- `src/styles.css`: customer management controls, archive banner and danger buttons.
- `src-tauri/src/lib.rs`: registers migration 4 after migrations 1–3.
- `src/database.test.ts`: upgrade/backup compatibility, deletion isolation and rollback on simulated parent-delete failure.
- `src/domain.test.ts`: old/archived backup acceptance and invalid archive status rejection.

## Verification

43 automated tests pass across five files. Isolated browser checks with sample data cover archive/restore, unchanged financial totals, reload persistence, preservation of archive state while editing, backup contents, wrong-name protection, cancellation, failed backup retention and successful deletion without changing other customers/profile. No real customer is archived or deleted during verification. The Windows release is built and tested against the existing records; see the 0.1.2 release report for native upgrade results.

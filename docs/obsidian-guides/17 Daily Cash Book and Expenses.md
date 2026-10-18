# Daily cash book and shop expenses (Roznamcha)

## Start using it

Open **Daily cash book** and choose **Set drawer opening balance**. Set a starting date and cash physically present **before the first cash movement on that date**. Entries before this date do not affect the drawer calculation. Expected cash carries forward across days, including days with no entries.

Customer transactions now have a payment-method selector. Mark **Cash** only when physical money is received (credit) or refunded (debit). Leave material sales/returns as Not a payment / unspecified. Cheques and bank transfers never enter the drawer register. Existing customer credits are not guessed from descriptions: confirm payment methods manually where needed. Imported customer rows have no cash classification unless subsequently confirmed.

Supplier entries of type payment and method Cash automatically become cash out. Existing explicitly marked supplier cash payments are backfilled on migration; their dates still must be on/after the drawer starting date to affect totals. Supplier purchases and material returns are excluded.

Do not enter an already linked payment again as a manual cash movement.

## Expenses and other counter movements

**Add shop expense** records cash out with date, description, category and amount. Suggestions include labor wages, loading/unloading, truck rent, electricity and tea/office costs. Categories are editable. **Add cash in / out** covers cash introduced, drawings, bank deposits/withdrawals and other physical drawer changes. A bank transfer alone is not a physical cash movement.

Manual entries can be edited, voided and restored. Voiding retains the record but excludes it from totals. Linked payments are edited at the originating ledger rather than independently in the cash book. Changing a cash payment to bank/cheque voids its projection; changing it back to Cash reactivates the same entry without duplicates.

Deleting a customer/supplier retains their already-recorded cash history and captured account name. Historical cash rows with a deleted source cannot be edited through the deleted account; record an explicit correcting movement after investigation. The cash book is not an editable bank ledger.

## Closing the day

Select a cash-book date and press **Calculate / close day**. Enter the counted physical cash and an optional note. The saved closing records:

- expected cash at the time of count;
- physically counted cash;
- shortage/excess (counted minus expected);
- timestamp and note;
- a deterministic financial-state fingerprint.

Expected cash = dated opening cash + confirmed cash in − confirmed cash out. Negative expected cash is shown with its minus sign and a warning. Count differences do not silently create money or change the next day's opening. Investigate and record explicit corrections as appropriate.

If an earlier movement, its cash classification or drawer opening changes, affected saved closings become **out of date**. Future movements do not invalidate an earlier closing. Recount and save a new closing; this replaces the latest count for that date. This is a reconciliation snapshot, not a locked accounting period or an audit archive of every count revision. Future dates cannot be closed from the UI.

The page supports A4 landscape printing. All amounts are PKR and entered as whole rupees, matching the app's existing currency policy.

## Model and persistence

`src/cash.ts` defines CashSettings, CashMovement, CashClosing and CashData; validates data; projects known cash payments; calculates opening/daily/closing balances; and fingerprints the financial inputs using deterministic 64-bit hashing for change detection (not a security signature).

`Store.cash` is optional only for legacy compatibility. Once present, it has settings (null until configured), movements and closings. Linked identifiers are `customer:<transaction id>` and `supplier:<transaction id>`, keeping sources independent. Each source update refreshes its one projection, preventing duplicate counting.

Migration **006_cash_book.sql**:

- adds `payment_method` to customer ledger transactions with an empty default;
- creates cash_settings, cash_movements and cash_closings;
- projects explicit customer cash receipts/refunds and supplier cash payments through insert/update triggers;
- extends atomic supplier-group replacement to void old payment mirrors before replacement;
- backfills only known supplier cash payments;
- leaves cash history intact on account deletion;
- suppresses projection triggers during full snapshot restore, then restores the explicit cash snapshot atomically.

Browser storage uses the matching syncCash logic. It initializes older stores from explicitly marked source payments only. Native settings/manual-entry/closing writes use bound SQLite queries. Source payments and their projections commit in the same SQL statement/trigger transaction.

## Backups

New backups use **version 4**, including both ledgers and the complete cash snapshot. Version 4 requires cash data; versions 1–3 remain readable. Restoring an older backup without a cash section preserves the current drawer settings, movements and closing counts, and the dialog explains this. Restoring version 4 replaces cash and ledger sections atomically. Older app versions cannot restore version-4 backups.

## Code map

- `src/cash.ts`: model, validation, linked projections, daily calculation, signed cash formatting, closing fingerprint.
- `src/CashBookPage.tsx`: drawer setup, date, register, expense/manual movement forms, editing/voiding, closing count and print.
- `src/domain.ts`: customer payment method, cash validation and version-4 backup envelope.
- `src/forms.tsx`: explicit customer payment method and direct-amount handling.
- `src/storage.ts`: load/sync/save cash, preserve legacy cash during restore.
- `src/App.tsx`: Daily cash book navigation and restore messaging.
- `src-tauri/migrations/006_cash_book.sql`, `src-tauri/src/lib.rs`: database migration/registration.
- `src/cash.test.ts`: accounting, stale counts, synchronization, source deletion, migration and restore regression coverage.

## Verification and limits

67 tests pass across seven files. Isolated browser checks cover customer cash receipt, bank exclusion, supplier cash payment, opening setup, wages expense, shortage/matching count, stale count after correction, voiding, carry-forward, backup version 4 and reload. The sample print fits one A4 landscape page. Native upgrade and SQLite checks are recorded in `docs/release-validation-0.1.4.json`.

One shop drawer is supported. There is no bank reconciliation, multi-cashier separation, denomination counter, locked period or full edit audit trail. Shop expenses affect cash only; they do not post another customer/supplier charge automatically. Concurrent editing by multiple running app instances is not covered.

# Advanced Search and Outstanding Dues

Implemented in Shop Ledger 0.1.5, 2026-10-19. All search and collection calculations run offline on locally loaded records.

## Global search

Click the top search button or press Ctrl+K (Command+K also works). Type a customer/supplier name, phone, description, brand, bill number or vehicle. Search includes archived accounts, customer and supplier ledger lines, and active cash-book entries. Select a scope to narrow results. Matching ignores case, accents, and punctuation differences such as ABC-123 versus ABC123. Multi-word queries require every token. Exact identifiers rank ahead of partial matches; results are capped at 50 with total matches shown. There is no fuzzy spelling correction.

Use Up/Down and Enter, click a result, or Escape to close. Ctrl+K is blocked while another dialog is open so unfinished entries remain safe. Customer/supplier entries open their owner account with all account statuses visible, exact-day statement dates, and a highlighted row. Account results open all history. Cash entries open their date. Search reads the store; it does not change records.

## Collections dashboard

Open Outstanding dues in the sidebar. Positive customer balances only are included; advances and settled accounts are excluded. Archived debts are included by default. Choose an as-of date, highest balance / oldest recorded due date / oldest unpaid charge sorting, account status, 30/60/90-day age threshold, minimum whole-rupee balance, customer name/phone, or recorded-overdue-only filtering. Summary amounts reflect the visible rows. Open ledger retains the as-of cutoff. Print A4 uses the existing print layout.

## Dates and aging

Opening customer debit balances and customer debit charges support optional payment due dates. These must be valid calendar dates on/after the balance/transaction date. Credits and payments/refunds cannot carry charge due dates. Existing records receive blank due dates, without changing money or guessing an agreement.

Aging is an estimate: payments and returns reduce the oldest charges first (FIFO); advances reduce future charges. Partial unpaid lots remain outstanding. Future activity is excluded by the as-of date. The oldest remaining charge controls age. The earliest nonblank remaining due date controls due-date sorting, with undated accounts afterward. Recorded overdue amount sums remaining charges whose due date is strictly before the as-of date; due today is not yet overdue. Undated charges do not count as contractually overdue. This is a collections aid, not invoice payment allocation.

## Code and schema

- `src/discovery.ts`: normalized search index, ranked filtered search, JumpTarget, FIFO outstandingDues and sortDues.
- `src/GlobalSearch.tsx`: modal, scopes and keyboard result navigation.
- `src/DuesPage.tsx`: dashboard filters, totals, rows, printing and ledger navigation.
- `src/App.tsx`: Ctrl+K listener, topbar, sidebar, customer jumps; supplier/cash pages accept initial jump targets.
- `src/forms.tsx`, `src/domain.ts`, `src/storage.ts`: due-date input, validation, persistence.
- `007_customer_due_dates.sql`: additive blank-default `parties.opening_due_date` and `ledger_transactions.due_date`, full restore trigger preserving supplier/cash behavior. Registered as migration 7 in Rust. Never edit older applied migrations.
- Backup v5 carries due dates; v1–v4 remain readable. Old backups restore blank due dates. They cannot reconstruct due dates never recorded.

## Verification and limits

77 automated tests across eight files pass, including ten search/aging/migration tests. Browser checks cover Ctrl+K, archived customer bill jump, supplier vehicle jump, highlighted rows, dues sorting/filtering, as-of navigation, optional due-date save, dialog guard and Escape, and A4 export. Native installer and data-preservation evidence is stored in `docs/release-validation-0.1.5.json` after release validation.

No inventory reservation, collection messaging, reminders, interest, payment-to-invoice allocation, promised-date history, or full-text SQL index is introduced. Search indexes currently loaded records and rebuilds when the store changes. Do not add real customer details or backup databases to source snapshots.

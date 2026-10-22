# First iteration: agreed behavior

## Confirmed with the shop owner
- Offline Windows desktop app; no cloud dependency.
- React + TypeScript + Vite, Tauri, local SQLite, Tailwind CSS.
- Customers/contractors only, English interface, PKR.
- Record each material separately.
- Opening balance has a date, amount, and DR/CR side.
- Supplies and charges are debits; customer payments and returns are credits.
- Saved entries and customer opening balances can be edited.
- Running balances recalculate after edits and backdated entries.
- Statements support custom dates, month shortcuts, PDF download, and A4 landscape printing.
- Filtered statements include the balance brought forward and closing balance.

## Implemented accounting choices
- Opening balance is separate from period transaction totals.
- Transactions cannot predate the opening balance date.
- A negative net balance displays CR (customer advance); a positive one displays DR.
- Money is stored as integer paisa; quantity supports three decimal places.
- Quantity times rate rounds once to the nearest whole rupee.
- Manual bill/receipt numbers; cheques are credited when entered.
- Same-day entries use creation order with ID as a deterministic tie-breaker.
- An edit preserves the entry's original creation timestamp.

## Review next
- Confirm table spacing, the material quantity/rate workflow, and statement appearance using sample records.
- Test A4 output on the actual shop printer.
- Confirm the shop's display name, address, phone, and any statement branding.
- Package a Windows installer after UI review.
- Gather detailed requirements for inventory and invoice generation in a later stage.

## Changes during development
Keep this document aligned with agreed decisions. Add a new numbered SQLite migration for changes to an already distributed database. Preserve existing customer data when shipping updates. Browser preview records and native SQLite records are separate.

## Generic shop update
- Default identity: Shop Name / Your business, in balance.
- Top-left brand opens a shop profile page.
- Editable name, tagline, owner, phone, email, address and statement footer.
- Whole-rupee currency entry/display, with fractional material quantities supported.
- DR balances and debit amounts red; CR balances and credit amounts green.
- Reusable descriptions, brands and vehicles can be entered in profile settings. Saved transactions contribute suggestions automatically, including bill numbers; manual typing is always allowed.
- Branding and colors apply to PDFs and A4 printing as well.
- Existing ledger data and legacy backups remain compatible.

## Customer management update

- Archive/restore customers without losing ledger entries.
- Filter active, archived or all customers; retain archived balances in shop totals.
- Permanent deletion removes one customer and all their ledger entries only after exact-name confirmation and saving a full safety backup.
- Cancelled/failed backup prevents deletion. Preserve existing records and legacy backup support on upgrade.

## Purchase and supplier ledgers

Separate supplier accounts, contact details, dated openings, purchases with multiple material lines and brand/vehicle/bill/quantity/unit/rate, cash/cheque/bank payments, supplier returns, running debit/credit balances, date filters, PDF/A4 and backup/restore. Supplier CR means payable; DR means advance. Retain customer records and separate totals. Inventory integration and invoice allocation are later work.

## Daily cash book and expenses

Track physical customer cash receipts/refunds, supplier cash payments and petty-cash expenses. Exclude cheque/bank/material movements. Configure dated opening drawer cash; compare expected closing with actual count, show shortage/excess and flag prior closings affected by edits. Preserve cash history across account deletion and include it in backups.


## Advanced search and collections (0.1.5)

Use topbar search or Ctrl+K to find customer/supplier accounts, bill and vehicle numbers, descriptions and active cash entries across archived and active records. Outstanding dues shows positive customer balances with as-of/status/age/minimum/overdue filters, highest-balance or oldest-date sorting, ledger jumps and A4 printing. Optional opening/charge due dates support actual overdue amounts; FIFO aging is an estimate, not invoice allocation. SQLite migration 7 and backup v5 preserve existing records and accept older backups.

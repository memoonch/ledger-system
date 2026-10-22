# Requirements and decisions

## Original context

The shop sells cement and steel/building materials. The owner initially supplied `Context.md` and `Functional Requiremts.md` in the Obsidian project folder. They described an offline desktop Khata, material distribution columns, customers, inventory and billing as broader goals.

Those original notes are preserved. The decisions below capture subsequent clarifications; they are more specific than the initial broad goal.

## Owner-confirmed scope

| Topic | Agreed behavior |
|---|---|
| Platform | Windows desktop, 100% offline daily operation |
| Stack | React + TypeScript + Vite; Tauri; SQLite; Tailwind CSS |
| Accounts | Customers/contractors only for now |
| Entry style | Each material separately |
| Opening balance | Date, amount, and DR/CR selection |
| Editing | Saved customer details, opening balances and transactions can be edited |
| Language | English |
| Currency | PKR; whole-rupee entry/display, without decimal points |
| Debit | Goods or charges supplied to customer; increases what customer owes |
| Credit | Payment received or material return credited; reduces what customer owes |
| Statements | Full history or selected inclusive From/To dates, including month shortcuts |
| Exports | Offline PDF download and A4 landscape printing |
| Generic use | Editable shop name/tagline and profile instead of fixed Alfazal branding |
| Reusable inputs | Saved descriptions, brands, vehicles and prior bill numbers suggested; free typing allowed |

## Required transaction columns

Date; Description; Brand; Vehicle Number; Bill/Receipt Number; Quantity; Rate; Debit Amount; Credit Amount; automatically computed Running Balance with DR/CR indicator.

Quantity is allowed to be fractional, up to three decimal places. The no-decimal request concerns currency.

## Shop profile fields implemented

Name, tagline, owner/contact person, phone, email, address, statement footer message, reusable descriptions, reusable brand names and reusable vehicle numbers.

A click on the top-left shop icon/name opens the profile page. Profile identity is used in the sidebar, page footer, PDF and printout.

## Accounting decisions

- Signed balance = signed opening balance + debits − credits.
- Positive balance is DR and red; customer owes the shop.
- Negative balance is CR and green; the customer has an advance.
- Zero is neutral.
- Opening balance is displayed separately from period transaction totals.
- Statements bring forward entries strictly before the start date.
- Dates on both range boundaries are included.
- No entry may predate its customer's opening date.
- Transactions on the opening date are permitted.
- Editing an entry preserves its creation timestamp and recomputes later balances.
- Cheques are credited immediately when recorded. Clearing/bouncing is a future workflow, not currently modeled.

## Implementation choices, not additional owner requests

The application includes JSON backup/restore and safety-backup handling as part of making the local data usable. IDs use `crypto.randomUUID()`. Bill numbers are manually entered. Transaction ordering is date, creation timestamp, then ID.

Internal identifiers remain `alfazal-ledger` / `com.alfazal.ledger` / `alfazal.db`. Renaming those requires a planned compatibility/data-location migration.

## Ideas only — not implemented or promised

Logo upload; tax/registration number; bank/payment details; invoice numbering prefix; business hours; inventory management; generated invoices; WhatsApp sharing; access control; audit trails; multiple users/computers.

## Still to review

Actual shop-printer output, clean-machine installer testing, UI feedback from daily use, and detailed inventory/billing requirements.

Future changes are expected. Confirm changed business rules with the owner, preserve existing records, update `REQUIREMENTS.md`, and record the decision here.



## 0.1.5 — Advanced search and collections (2026-10-19)

Topbar Ctrl+K search, archived-account jumps, outstanding customer dues with FIFO aging and optional actual due dates. Migration 7 adds blank-default due-date fields; backups are now v5 with v1–v4 compatibility. See [[Alfazal Ledgher System/Shop Ledger Documentation/18 Advanced Search and Outstanding Dues]] for behavior, source map and verification.

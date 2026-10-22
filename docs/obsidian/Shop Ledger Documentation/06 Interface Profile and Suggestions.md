---
title: "Interface, profile and suggestions"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Interface, profile and suggestions

## Ledger workspace

- Dark-green sidebar with the editable shop identity.
- Customer-ledgers navigation button.
- Backup and restore actions.
- Desktop/browser storage status.
- Header and summary cards: total receivable, customer advances, customer count and recorded-entry count.
- Searchable customer list with signed current balances.
- Selected customer's ledger with opening/brought-forward rows, entries, totals and closing balance.
- PDF and Print A4 actions.
- Date range select plus From/To inputs.
- Add/edit customer and transaction dialogs.

Customer list balances and global summary cards are all-time values; date filtering applies to the selected statement, not those global summaries.

The current selected date range persists when switching customers. Reload initializes the selected customer from the first returned party; selection/range are not separate persistent preferences.

## Customer form

Add a name, optional phone/address, opening date, opening amount and DR/CR side. Existing customers can be edited using the pencil beside their name or opening-balance row.

Opening CR is stored negative. The form checks existing transactions before moving an opening date forward. Existing entries must not predate the new date.

## Transaction form

Choose Debit or Credit explicitly. Description text does not automatically determine the accounting side.

Fields: date, bill/receipt, description, brand, vehicle, calculation method, and either quantity/rate or a direct amount.

- Quantity × rate is suitable for materials and returns.
- Direct amount is suitable for payments, carriage and other charges.
- The calculated amount and side appear before saving.
- New entries currently default to the direct-amount method; an existing material entry opens with quantity × rate selected.
- Debit selection and debit amount use red; credit uses green.
- Saving recomputes later balances.
- There is no transaction deletion UI or audit trail.

The HTML dialog supports keyboard focus and Escape. Close/cancel are disabled while a form save is pending. Validation messages appear inside the form.

## Shop profile page

Open it by clicking the top-left name/icon. Back to ledgers or the sidebar ledger button returns to the ledger view.

| Field | Purpose |
|---|---|
| name | Visible shop identity and statement branding |
| tagline | Sidebar and statement subtitle |
| owner | Owner/contact person for statement contact details |
| phone / email / address | Shop contact details printed on statements |
| statement_note | Thank-you or other statement footer message |
| descriptions | Managed reusable descriptions |
| brands | Managed reusable brand names |
| vehicles | Managed reusable vehicle numbers |

Default profile:

```json
{
  "name": "Shop Name",
  "tagline": "Your business, in balance.",
  "owner": "",
  "phone": "",
  "email": "",
  "address": "",
  "statement_note": "Thank you for your business.",
  "descriptions": ["Sale", "Cash Received", "Cheque Received", "Bank Transfer", "Carriage", "Returns"],
  "brands": [],
  "vehicles": []
}
```

Profile is local to the app installation/store; there is one active shop profile, not a multi-shop selector. Logo upload and currency switching are not implemented.

## Suggestion behavior

Transaction inputs use HTML datalists, so users may select a suggestion **or type any new value**.

| Input | Suggested values |
|---|---|
| Description | Managed profile descriptions + all current saved transaction descriptions |
| Brand | Managed profile brands + all current saved transaction brands |
| Vehicle | Managed profile vehicles + all current saved transaction vehicles |
| Bill/receipt | All current saved transaction bill numbers |

Values are trimmed, blanks removed, deduplicated case-insensitively and sorted. Suggestions are across all customers, not just the selected customer. New free-typed values appear in future suggestions after the transaction is saved.

The learned list is derived from records currently stored. If the only transaction containing a value is edited away, that value disappears unless retained in a profile-managed list. There is no separate permanent catalog/history table.

Profile textareas accept one option per line. Explicit aria-labels are set for descriptions, brand names and vehicle numbers.

## Styling and printing

`styles.css` imports Tailwind CSS, sets the system-font theme and supplies the custom layout. Key classes include `sidebar`, `ledger-workspace`, `customer-panel`, `ledger-table`, `closing-strip`, `modal` and `profile-card`.

Color helpers resolve to:
- DR: `#b93939`.
- CR: `#20804e`.
- Neutral: muted gray/green.

Print rules hide the sidebar/actions and show print-only shop identity. The layout uses A4 landscape, 12 mm page margins, repeated table headings and compact line spacing. Keep print changes inside print-specific rules so screen spacing is not unintentionally changed.

Responsive rules adapt the sidebar and customer pane to smaller windows; the wide ledger scrolls horizontally inside its table container.



## 0.1.5 — Advanced search and collections (2026-10-19)

Topbar Ctrl+K search, archived-account jumps, outstanding customer dues with FIFO aging and optional actual due dates. Migration 7 adds blank-default due-date fields; backups are now v5 with v1–v4 compatibility. See [[Alfazal Ledgher System/Shop Ledger Documentation/18 Advanced Search and Outstanding Dues]] for behavior, source map and verification.

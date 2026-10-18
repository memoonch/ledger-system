---
title: "Source: REQUIREMENTS.md"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "REQUIREMENTS.md"
sha256: "ed5d5721d4167d9570cc0f1b6f8aa634995d74ac281a0ffee7d300de75bedc12"
tags: [shop-ledger, development]
---

# Source snapshot: REQUIREMENTS.md

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/REQUIREMENTS.md`.
- SHA-256 of original file bytes: `ed5d5721d4167d9570cc0f1b6f8aa634995d74ac281a0ffee7d300de75bedc12`.
- Original bytes: 2676; source lines: 43.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```markdown
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
```

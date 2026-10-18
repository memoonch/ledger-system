---
title: "Editing playbook and roadmap"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Editing playbook and roadmap

## Before changing the app

1. Read the owner's latest request and [[01 Requirements and Decisions]].
2. Inspect current repository code; these notes are a dated snapshot.
3. Back up real ledger data before changing schema or financial behavior.
4. Locate the relevant module using [[03 Code Map and API]].
5. Keep the change scoped to the requested behavior.
6. Run the relevant existing tests and add meaningful coverage for new accounting/storage behavior.
7. Rebuild, review the interface/export if affected, and record the actual verification result.
8. Update `REQUIREMENTS.md` / `README.md` and the documentation templates.
9. Regenerate the source snapshot and publish refreshed notes.

Keep the existing Git history. The base commit when this documentation work began was 03f3110, First Version Ledgers. The generated manifest records the precise snapshot commit and working-tree status.

## Common edit recipes

### Change screen colors or spacing

Edit `src/styles.css`. Use the shared debit-text/credit-text classes rather than duplicating sign checks with inconsistent colors. Update PDF RGB colors separately in `src/pdf.ts` if the color policy itself changes. Check print media rules independently.

### Add a transaction field

Touch:
- LedgerTransaction in `domain.ts`;
- validation and form limits;
- a new SQL migration;
- migration registration in `lib.rs`;
- INSERT/UPSERT/SELECT or restore JSON extraction in `storage.ts`/SQL triggers;
- `TransactionForm` inputs;
- ledger table columns in `App.tsx`;
- PDF columns and print width;
- backup compatibility/default handling;
- relevant tests.

Do not just add a form input without storing, exporting and restoring it.

### Add a profile field

Update ShopProfile, defaultProfile, validateProfile, ProfilePage, any output consuming the field, backup validation/default handling and tests.

Existing profile JSON lacks new fields; add a compatibility normalization or a new migration to supply defaults before making validation require the field. Merely adding a required TypeScript member can break loading old profiles.

### Change currency or rounding

Start in `domain.ts` and review all form conversions, legacy behavior, PDF/print formatting and backup values. Internal *_paisa fields are part of the data contract. Do not relabel stored numbers as rupees without conversion/migration planning.

Fractional historical records need special care when editing through whole-rupee forms.

### Change opening-balance rules

Review ledger initialization, period/brought-forward logic, customer-form validation, transaction validation and all three date triggers. Test periods before/on/after opening and edits that would move opening past an existing entry.

### Change reusable suggestions

Profile-managed arrays are in `profile.ts`/ProfilePage. Automatic learning is computed from the complete current transaction array in `forms.tsx`. Bill numbers are historical suggestions only. Add a separate catalog table only if persistent catalog lifecycle is actually required.

### Add inventory

This is a new domain, not just another ledger column. Clarify products/SKUs, brands, units, purchases, stock receipts/issues, returns, opening stock and stock adjustments. Decide how material ledger entries link to stock movements and avoid double-counting. Suppliers are not currently implemented.

### Add invoices/billing

Clarify one bill/multiple material rows, numbering, print format, receipts, taxes/discounts and cancellation behavior. Current bill_number is manually entered text on each transaction and is not an invoice entity.

### Add WhatsApp

Clarify manual PDF sharing versus automated messages, internet requirements and authorization. Core accounting must remain offline. No WhatsApp API/account integration exists now.

## Release checklist for an approved version

- Existing data backed up.
- New numbered migrations registered and upgrade tested.
- Relevant tests pass.
- Full/filtered statements match ledger rules.
- Generic shop branding remains editable.
- Desktop app starts offline with the expected database location.
- Actual printer/installer checks completed when part of the release.
- Source/lockfiles and documentation versioned in Git.
- Test data and temporary debugging flags are not shipped as real shop data.

## Refresh this documentation

The templates are editable source material; generated source notes are snapshots.

```powershell
# From the repository:
& 'C:/Users/FROST/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe' scripts/export-obsidian.py
```

Generated notes appear under `docs/obsidian/Shop Ledger Documentation/`, with a root `Project Documentation.md` bridge. Review the generated files, then copy them into the corresponding Obsidian project folder. Preserve original Context.md and Functional Requiremts.md and any user-authored notes.

For a later snapshot date, the exporter creates a correspondingly dated source-snapshot folder. It does not delete older snapshots. Refresh topic templates and keep new chronology in the history note rather than presenting old test results as freshly rerun.

## Current roadmap

1. Collect UI feedback from the shop owner.
2. Test the actual A4 printer.
3. Finalize shop branding/contact details through the profile.
4. Package and test the Windows installer on a clean machine.
5. Clarify detailed inventory and billing requirements.
6. Consider logo, registration/tax ID, payment details and invoice prefix.
7. Improve portable browser/native tests and larger-ledger performance as needed.

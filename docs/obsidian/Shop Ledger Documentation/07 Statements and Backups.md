---
title: "Statements and backups"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Statements and backups

## Shared statement meaning

Screen, PDF and print use the selected customer and current inclusive date range. The PDF generator calls the same domain `ledger` function used on screen.

Every statement distinguishes:
- balance brought forward;
- a dated opening balance when it lies within the period;
- period transactions;
- period debit/credit totals;
- closing signed DR/CR balance.

Opening balance is not counted again in period transaction totals.

## PDF implementation

`statementPdf(party, transactions, from, to, profile=defaultProfile)` in `src/pdf.ts` returns a jsPDF document.

- Landscape A4, dimensions approximately 297 × 210 mm.
- jsPDF with AutoTable; all libraries are bundled locally.
- Shop name, tagline and contact details wrap before the customer header.
- Customer name/address wrap so long text does not collide with the table.
- Ten statement columns, right-aligned quantities/money.
- Red debit/DR and green credit/CR values.
- Header row repeats on later pages.
- Totals are the last-page table footer, allowing pagination with the last transaction.
- Shop statement note, shop name and page X of Y appear at the bottom.
- Extra bottom margin reserves room for the footer.
- The current fonts are built-in Helvetica; full Urdu/non-Latin font support has not been implemented.

PDF filename is derived from a sanitized customer name and From/To dates. Missing bounds use all/latest-date labels.

`App.exportPdf` loads the PDF module lazily, obtains bytes from `doc.output('arraybuffer')` and sends them through `saveFile`.

## Native save versus browser download

Native: open a Tauri save dialog; cancellation returns false; filesystem write is awaited.

Browser preview: create a Blob URL and trigger an anchor download. The app can initiate the download but cannot confirm that the user completed a disk save. Object URLs are revoked after a delay.

## A4 printing

Print A4 calls `window.print()`. CSS determines A4 landscape with 12 mm margins and hides application controls. Print shows the active profile and currently filtered ledger.

The sample eight-transaction statement was verified to fit on one A4 page after spacing adjustments. Longer statements naturally paginate. Physical output from the owner's shop printer is still pending.

PDF export and print CSS are separate renderers: changing one does not automatically style the other. Test both after changes to headings, columns, branding or currency formatting.

## Backup format

Current version 2:

```json
{
  "format": "shop-ledger",
  "version": 2,
  "exported_at": "ISO timestamp",
  "data": {
    "parties": [],
    "transactions": [],
    "profile": {}
  }
}
```

The empty profile above is illustrative; an actual present profile must pass ShopProfile validation.

Legacy version 1:

```json
{
  "format": "alfazal-ledger",
  "version": 1,
  "exported_at": "ISO timestamp",
  "data": {
    "parties": [],
    "transactions": []
  }
}
```

The restore UI accepts exactly those supported format/version pairs. Missing profile in a legacy snapshot preserves the current profile rather than overwriting it with generic defaults.

Regular filenames start `shop-backup-YYYY-MM-DD.json`. Before-restore safety filenames start `shop-before-restore-` and include a timestamp to avoid default-name collisions.

## Restore flow

1. Select and read JSON.
2. Validate the envelope/version.
3. Validate parties, transactions, references and optional profile.
4. Show replacement confirmation with customer/transaction counts.
5. Save a safety backup of the current store.
6. If the native save is cancelled, abort without replacing records.
7. Fill absent legacy profile from the current store/default.
8. Apply one atomic SQL restore statement, or one browser localStorage replacement.
9. Reload store/selection and reset date range.
10. Show completion notification.

Restoring replaces ledger records; it is not a merge. SQLite trigger atomicity is explained in [[04 Database and Migrations]].

A JSON backup is a data export, not a compiled app or database-schema backup. Keep source code/lockfiles separately. Raw copying a live SQLite .db without its WAL is not equivalent to the app's validated JSON backup.

The documentation/source snapshots deliberately exclude real database files and QA backup payloads.


## Supplier / version-3 update

Statements now have a supplier mode with payable/advance colors, units and payment references. New full backups use version 3 and include suppliers and supplierTransactions arrays. Versions 1/2 remain readable and preserve current suppliers when supplier sections are absent. Earlier version-2 notes describe the previous customer-only format. See [[16 Purchase and Supplier Ledger]].

## Daily cash book update

Backups now use version 4 and include drawer settings, cash movements and closing counts. Versions 1–3 preserve current cash when no cash section is supplied. See [[17 Daily Cash Book and Expenses]].


## 0.1.5 — Advanced search and collections (2026-10-19)

Topbar Ctrl+K search, archived-account jumps, outstanding customer dues with FIFO aging and optional actual due dates. Migration 7 adds blank-default due-date fields; backups are now v5 with v1–v4 compatibility. See [[Alfazal Ledgher System/Shop Ledger Documentation/18 Advanced Search and Outstanding Dues]] for behavior, source map and verification.


## 0.1.7 — Center numeric PDF columns (2026-10-20)

Customer and supplier PDF exports center Quantity, Rate, Debit, Credit and Balance, including headers, opening/brought-forward balances and numeric totals. Date, Description, Brand, Vehicle no. and Bill no. retain their existing alignment. Only `src/pdf.ts` table alignment changes; data and schema remain unchanged. Both rendered A4 sample exports were visually checked.


## 0.1.8 — PDF closing summary (2026-10-20)

Replaces the final ledger totals row with a compact bottom-right themed summary box, spanning the Debit/Credit/Balance columns with one outer border: Total Debit, Total Credit and Current Balance with Debit, Credit or Settled. Totals remain for the selected period; balance includes opening/brought-forward activity. Customer/supplier colors preserve their existing meaning. The summary stays together on one page, moving to a new page when necessary; page numbering includes that page. Ledger numeric columns remain centered. Customer/supplier sample PDFs visually checked; existing long-ledger test verifies the summary is not split.

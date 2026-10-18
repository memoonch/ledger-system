---
title: "Tests and verification"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Tests and verification

## Current evidence

At the last implementation check on 2026-10-18:

- **27 automated tests passed across four test files.**
- TypeScript/Vite production frontend build passed.
- Updated native Windows executable built successfully.
- Browser checks passed for profile, whole rupees, DR/CR colors, suggestions, export, print and backup compatibility.
- Native profile migration/save/reload checks passed and customer row counts were preserved.
- Temporary QA profile values were restored to the original profile after testing.

These are session results, not a guarantee that a future changed checkout still passes. This documentation task itself does not rerun the app test suite unnecessarily.

## Automated suite

```powershell
npm.cmd test
```

`vitest.config.ts` restricts discovery to `src/**/*.test.ts` with Node environment.

| File | Tests | Main coverage |
|---|---:|---|
| `src/domain.test.ts` | 16 | Signed balances, ranges, opening dates, backdated edits, deterministic ordering, precision, malformed data, whole rupees, side classes |
| `src/database.test.ts` | 5 | Initial schema, atomic restore and rollback, date guards, upgrade to profile schema, profile restore/legacy preservation |
| `src/pdf.test.ts` | 3 | Landscape A4, filtered content, pagination/repeated headings, profile branding and whole-rupee output |
| `src/profile.test.ts` | 3 | Suggestion normalization, profile validation, legacy backup acceptance |

SQLite tests use Node's built-in `node:sqlite` DatabaseSync with an in-memory database and the actual migration SQL files.

## Browser integration checks

The local helper `.qa/generic-check.cjs` uses Playwright from the bundled development runtime and a headless Microsoft Edge executable.

It checks:
1. Generic default setup and no .00 in the ledger.
2. Red DR and green CR computed styles.
3. Profile fields and reusable options.
4. Profile persistence after reload.
5. Manual descriptions/brands/vehicles/bills.
6. Quantity 2.5 × rate 101 → whole amount 253.
7. Learned suggestions in a subsequent form.
8. PDF download and print-to-PDF.
9. Version-2 backup containing profile.
10. Version-1 restore preserving profile.
11. Responsive widths and absence of page errors.

The earlier `.qa/ui-check.cjs` checked the original ledger add/edit, persistence, date filtering, CR opening and restore workflow. Some of its currency expectations contain .00 from before the generic update. Treat it as historical instrumentation, not a current pass/fail command without updating those expectations.

## Native checks

The native profile test attaches to a **temporary** WebView2 local debugging port. It verifies:
- startup and SQL migration;
- saving name/tagline/suggestion profile fields;
- JSON data present in shop_profile;
- persistence after reload;
- unchanged customer/transaction counts;
- restoration of the original profile in a finally block.

Earlier native checks verified party/transaction writes, saved balances after reload, and reloading bundled assets with network access disabled.

Debugging port 9223 and custom test WebView profile were process-local QA settings. They are not shipping configuration. The test app process was stopped afterward.

## Visual statement checks

PDF and print-to-PDF output were rendered with Poppler and inspected visually for branding, columns, amounts, colors and page layout.

- Normal generic sample statement: A4 landscape.
- Eight-transaction sample printout: fits on one A4 page after final spacing adjustments.
- Long statement: tested with wrapped descriptions and multiple pages.
- Column headings repeat; totals remain with a last transaction rather than alone on a page.
- Long customer names/addresses were checked during the first iteration.

Physical shop-printer output remains untested.

## Where QA artifacts live

`.qa/` is ignored by Git and contains local scripts, screenshots and test export files. Do not rely on that directory surviving a clean checkout. Documentation includes selected script-source snapshots, but excludes database/backup payloads and WebView profiles.

Portable browser/native regression tooling is a future improvement; the current helper scripts contain this computer's bundled-runtime and Edge paths.

## What to test after common changes

- Accounting/date changes: domain suite, edited/backdated entries, matching on-screen/PDF totals.
- Schema/storage changes: fresh database, upgrade from previous schema, invalid restore rollback, legacy backups.
- Profile changes: persistence, backup/restore, sidebar, PDF, print.
- UI/column changes: screen widths and both PDF and physical print layout.
- Packaging changes: clean-machine installer and offline startup.

No encryption, audit log, multi-instance concurrency, performance-at-scale or installer-release certification has been performed.


## Excel / CSV import update

The latest automated run passed **39 tests across five files**, including 11 importer tests and atomic SQLite import/rollback. Browser import checks passed. See [[13 Excel and CSV Import]]. Earlier 27-test results above describe the previous implementation.

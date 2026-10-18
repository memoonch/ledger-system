---
title: "Accounting and validation"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Accounting and validation

## Balance convention

**DR / debit:** customer owes the shop. **CR / credit:** payment or credit reduces the debt; a net CR means advance held for the customer.

```text
signed closing balance = signed opening balance + sum(debits) - sum(credits)
opening DR = positive
opening CR = negative
positive result -> DR -> red
negative result -> CR -> green
zero -> neutral
```

Example: opening 10,000 DR, materials 15,000 DR, payment 8,000 CR → closing 17,000 DR.

A material return is entered on the credit side. A carriage/other charge uses debit. A refund paid to a customer can be represented by a debit with a clear description; no separate refund workflow exists.

## Stored units versus displayed units

Money is stored as **integer paisa** for compatibility, even though the current UI accepts/displays whole rupees.

- 1 PKR = 100 stored units.
- Quantity uses integer thousandths: 2.5 units = 2500.
- Rate is paisa per unit: Rs 101 = 10100.
- New material amount = quantity × rate, rounded once, half up, to a whole rupee.
- `wholeRupees` accepts digits only, multiplies by 100 and checks the integer/value cap.
- `money` displays absolute whole rupees with grouping and zero decimal places.
- `balanceText` adds the side according to the signed stored value.

Current exact integer calculation:

```typescript
((BigInt(quantity_milli) * BigInt(rate_paisa) + 50000n) / 100000n) * 100n
```

For quantity 2.5 and rate Rs 101: exact Rs 252.5 → saved Rs 253 → stored amount 25300.

BigInt is used for the multiplication/rounding step, then converted back to a validated number.

### Legacy fractional amounts

Migration 2 does not change historical paisa values. The display rounds them to whole rupees. Existing form defaults also round old rates/amounts to whole rupees; explicitly saving an edited legacy fractional entry can therefore replace its amount with the displayed rounded value. A future requirement to preserve fractional historical edits needs explicit treatment.

`decimal` and `materialAmount` retain older scaled-decimal/nearest-paisa behavior for compatibility/reference tests. The current transaction form uses `wholeMaterialAmount` instead.

## Ordering and dates

`ordered` sorts a copy by:
1. transaction date;
2. original creation timestamp;
3. transaction ID.

Editing preserves created_at. Changing a transaction date or adding a backdated entry therefore recalculates later balances deterministically.

Dates are stored as YYYY-MM-DD, allowing lexical comparison. Frontend validation checks the real calendar date and limits years to 1900–9999. `today()` uses the computer's local calendar day.

Opening date is mandatory even for a zero opening balance. Entries before it are rejected, but entries on it are allowed.

## Statement algorithm

For an inclusive range from F through T:

1. Include the signed opening balance in closing only if its date is on/before T, or T is absent.
2. Brought-forward balance includes the opening balance only if it is strictly before F.
3. Add all transaction movements before F to brought forward.
4. Include transactions from F through T as visible rows, calculating each row's balance.
5. If the opening date falls inside the range, show a separate opening row.
6. Period debit/credit totals contain transaction movements only.
7. Closing is the balance as of T, or the latest recorded activity if no T.
8. A period with no transactions can still have a brought-forward/closing balance.

For all-time statements, there is no brought-forward row; the dated opening row is shown.

A range entirely before the customer's opening date shows zero balance and no opening row. An inverted range is rejected.

## Validation limits

- Customer name: required, at most 120 characters.
- Description: required, at most 240.
- Customer phone/address form limits: 50/300.
- Transaction brand/vehicle/bill form limits: 80/50/80.
- Opening balance and transaction numeric fields: safe integer; field cap 100,000,000,000.
- Quantity: up to three decimals.
- Exactly one of debit/credit is positive.
- Backup: at most 10,000 parties and 100,000 transactions; unique IDs and valid party references.
- Profile name: required, max 80; tagline 120; owner 100; phone 60; email 120; address 300; footer 180.
- Profile suggestion arrays: max 500 each; per-item length follows description/brand/vehicle limits.

Form validation, domain validation and SQLite constraints overlap but are not identical. Changes should keep them consistent.

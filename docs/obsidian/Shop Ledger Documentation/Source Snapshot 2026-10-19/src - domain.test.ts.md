---
title: "Source: src/domain.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/domain.test.ts"
sha256: "94573622920a272af76fdd40630c9e40c34058110959774779036d0226bdf798"
tags: [shop-ledger, development]
---

# Source snapshot: src/domain.test.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/domain.test.ts`.
- SHA-256 of original file bytes: `94573622920a272af76fdd40630c9e40c34058110959774779036d0226bdf798`.
- Original bytes: 5671; source lines: 82.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { describe, expect, it } from 'vitest';
import { decimal, money, wholeRupees, wholeMaterialAmount, balanceClass, ledger, materialAmount, validDate, validateParty, validateStore, validateTransaction, type LedgerTransaction, type Party } from './domain';
const party: Party = { id: 'a', name: 'Customer', phone: '', address: '', opening_date: '2026-01-01', opening_paisa: 100000 };
const tx = (id: string, date: string, debit: number, credit = 0): LedgerTransaction => ({ id, party_id: 'a', date, description: 'Cement', brand: '', bill_number: '', vehicle_number: '', quantity_milli: 0, rate_paisa: 0, debit_paisa: debit, credit_paisa: credit, created_at: '2026-01-01T12:00:00Z' });
describe('ledger accounting', () => {
  it('adds deliveries and subtracts payments, including customer advances', () => {
    const result = ledger(party, [tx('1','2026-01-02',50000),tx('2','2026-01-03',0,180000)]);
    expect(result.rows.map(r => r.balance)).toEqual([150000,-30000]);
    expect(result.closing).toBe(-30000);
  });
  it('brings earlier activity forward and includes both boundary dates', () => {
    const result = ledger(party, [tx('1','2026-01-02',50000),tx('2','2026-02-01',0,20000),tx('3','2026-02-28',10000),tx('4','2026-03-01',90000)], '2026-02-01','2026-02-28');
    expect(result.broughtForward).toBe(150000); expect(result.rows).toHaveLength(2);
    expect(result.closing).toBe(140000); expect(result.debit).toBe(10000); expect(result.credit).toBe(20000);
  });
  it('shows zero before the dated opening balance', () => {
    expect(ledger(party, [], '2025-12-01','2025-12-31')).toMatchObject({ closing: 0, broughtForward: 0, openingInPeriod: false });
  });
  it('includes opening once when the period starts on its date', () => {
    expect(ledger(party, [], '2026-01-01','2026-01-31')).toMatchObject({ closing: 100000, broughtForward: 0, openingInPeriod: true, debit: 0 });
  });
  it('recalculates after a backdated entry and an edited amount', () => {
    const entries = [tx('3','2026-01-20',0,50000),tx('2','2026-01-10',20000),tx('1','2026-01-05',10000)];
    expect(ledger(party,entries).rows.map(r => r.balance)).toEqual([110000,130000,80000]);
    entries[2].debit_paisa = 30000;
    expect(ledger(party,entries).rows.map(r => r.balance)).toEqual([130000,150000,100000]);
  });
  it('sorts same-day entries deterministically and excludes other customers', () => {
    const other = { ...tx('x','2026-01-02',990000), party_id: 'b' };
    expect(ledger(party,[tx('b','2026-01-02',200),tx('a','2026-01-02',100),other]).rows.map(r => r.id)).toEqual(['a','b']);
  });
  it('keeps carried balances when a range has no entries', () => {
    expect(ledger(party,[tx('a','2026-01-02',50000)],'2026-02-01','2026-02-28')).toMatchObject({ broughtForward: 150000, closing: 150000, rows: [] });
  });
  it('rejects an inverted date range', () => { expect(() => ledger(party,[],'2026-02-01','2026-01-01')).toThrow(); });
});
describe('input precision and validation', () => {
  it('parses decimal money exactly and rounds fractional quantities once', () => {
    expect(decimal('0.29')).toBe(29); expect(decimal('1.005',3)).toBe(1005);
    expect(materialAmount(1005,100)).toBe(101);
    expect(materialAmount(1250000,26500)).toBe(33125000);
  });
  it('rejects excess precision, negative, malformed and oversized values', () => {
    for (const value of ['1.234','-2','1e4','NaN','1,000','10000000000000']) expect(() => decimal(value)).toThrow();
  });
  it('validates real calendar dates', () => {
    expect(validDate('2026-02-30')).toBe(false); expect(validDate('2024-02-29')).toBe(true); expect(validDate('')).toBe(false);
  });
  it('rejects transactions before opening and overlapping DR/CR', () => {
    expect(() => validateTransaction(tx('a','2025-12-31',1),party)).toThrow();
    expect(() => validateTransaction(tx('a','2026-01-01',1,1),party)).toThrow();
    expect(() => validateParty({...party,opening_date:'2026-01-03'},[tx('a','2026-01-02',1)])).toThrow();
  });
  it('rejects malformed backups and duplicate IDs', () => {
    expect(() => validateStore({ parties: [party,party], transactions: [] })).toThrow();
    expect(() => validateStore({ parties: [party], transactions: [{...tx('a','2026-01-01',1),party_id:'missing'}] })).toThrow();
    expect(() => validateStore({ parties: [party], transactions: [tx('a','2026-01-01',1),tx('a','2026-01-01',1)] })).toThrow();
  });
});


describe('whole rupee entry and account sides', () => {
  it('displays whole rupees, including zero and legacy fractional values', () => {
    expect(money(0)).toBe('0'); expect(money(100000)).toBe('1,000'); expect(money(1050)).toBe('11');
    expect(wholeRupees('1250')).toBe(125000);
    expect(() => wholeRupees('1.5')).toThrow();
  });
  it('rounds a fractional material quantity once to whole rupees', () => {
    expect(wholeMaterialAmount(1495,100)).toBe(100);
    expect(wholeMaterialAmount(1500,100)).toBe(200);
    expect(wholeMaterialAmount(1250500,26500)).toBe(33138300);
  });
  it('assigns debit red and credit green classes by the signed balance', () => {
    expect(balanceClass(100)).toBe('debit-text'); expect(balanceClass(-100)).toBe('credit-text'); expect(balanceClass(0)).toBe('neutral-text');
  });
});

it('accepts legacy and archived customer backups but rejects invalid archive status',()=>{
 expect(validateStore({parties:[party],transactions:[]})).toBeTruthy();
 expect(validateStore({parties:[{...party,archived:1}],transactions:[]})).toBeTruthy();
 expect(()=>validateStore({parties:[{...party,archived:2}],transactions:[]})).toThrow('archive status');
});
```

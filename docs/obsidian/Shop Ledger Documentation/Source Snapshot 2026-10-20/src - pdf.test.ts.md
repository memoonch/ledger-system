---
title: "Source: src/pdf.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src/pdf.test.ts"
sha256: "78a1d964bfe4cd1b8e77a6a520871d1a160f8ba725f615eaa6b0f0222b0f190c"
tags: [shop-ledger, development]
---

# Source snapshot: src/pdf.test.ts

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/pdf.test.ts`.
- SHA-256 of original file bytes: `78a1d964bfe4cd1b8e77a6a520871d1a160f8ba725f615eaa6b0f0222b0f190c`.
- Original bytes: 2167; source lines: 34.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { defaultProfile } from './profile';
import { describe, expect, it } from 'vitest';
import { statementPdf } from './pdf';
import { sampleStore } from './sample';
describe('PDF statements', () => {
  it('generates landscape A4 statements with filtered dates', () => {
    const data = sampleStore();
    const doc = statementPdf(data.parties[0],data.transactions,data.parties[0].opening_date.slice(0,7)+'-06',data.parties[0].opening_date.slice(0,7)+'-10');
    expect(doc.internal.pageSize.getWidth()).toBeCloseTo(297,0);
    expect(doc.internal.pageSize.getHeight()).toBeCloseTo(210,0);
    const text = doc.output();
    expect(text).toContain('Balance brought forward'); expect(text).toContain('Cash Received');
    expect(text).not.toContain('Rickshaw Carriage'); expect(text).not.toContain('Cement Returns');
  });
  it('paginates long ledgers and repeats headings', () => {
    const data = sampleStore();
    const many = Array.from({ length: 150 },(_,i) => ({...data.transactions[0],id:'long-'+i.toString().padStart(3,'0')}));
    const doc = statementPdf(data.parties[0],many,'','');
    expect(doc.getNumberOfPages()).toBeGreaterThan(3);
    expect(doc.output().split('(Date)').length - 1).toBeGreaterThanOrEqual(doc.getNumberOfPages() - 1);
    expect((doc as typeof doc & {lastAutoTable:{pageNumber:number}}).lastAutoTable.pageNumber).toBe(1);
    expect(doc.output().split('(Current Balance)').length - 1).toBe(1);
    expect(doc.output()).toContain('Page 1 of');
  });
});



it('uses shop profile branding and whole rupees in exported statements', () => {
  const data=sampleStore(); const profile={...defaultProfile,name:'Generic Hardware',tagline:'Built on trust.',phone:'0300 9999999',address:'Main Market',statement_note:'Please keep this statement.'};
  const text=statementPdf(data.parties[0],data.transactions,'','',profile).output();
  expect(text).toContain('Generic Hardware'); expect(text).toContain('Built on trust.'); expect(text).toContain('Main Market'); expect(text).toContain('Please keep this statement.');
  expect(text).not.toContain('Alfazal'); expect(text).not.toContain('125,000.00');
});
```

---
title: "Source: src/sample.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/sample.ts"
sha256: "3bea936ec62e7bfe9ee2b0f8d3bfd942bfd3068004c082952c57a9285cecf21c"
tags: [shop-ledger, development]
---

# Source snapshot: src/sample.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/sample.ts`.
- SHA-256 of original file bytes: `3bea936ec62e7bfe9ee2b0f8d3bfd942bfd3068004c082952c57a9285cecf21c`.
- Original bytes: 1649; source lines: 25.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`sampleStore`.

## Complete source

```typescript
import { today, type Store } from './domain';
export function sampleStore(): Store {
  const month = today().slice(0, 7);
  const parties = [
    { id: 'demo-1', name: 'Muhammad Aslam', phone: '0300 1234567', address: 'Model Town, Lahore', opening_date: month + '-01', opening_paisa: 12500000 },
    { id: 'demo-2', name: 'Hassan Builders', phone: '0321 5550123', address: 'Canal Road, Lahore', opening_date: month + '-01', opening_paisa: 28000000 },
    { id: 'demo-3', name: 'Ali Raza', phone: '0301 9876543', address: 'Johar Town, Lahore', opening_date: month + '-01', opening_paisa: -1500000 },
    { id: 'demo-4', name: 'Usman Contractors', phone: '', address: 'DHA, Lahore', opening_date: month + '-01', opening_paisa: 0 },
  ];
  const entries = [
    ['02', 'Cement', 'Pak Cem', 'LEA-2045', '1001', 100000, 145000, 14500000, 0],
    ['04', 'Steel', 'Tayyaba', 'LHR-8812', '1002', 1250000, 26500, 33125000, 0],
    ['04', 'Rickshaw Carriage', '', 'LEA-2045', '1002', 0, 0, 250000, 0],
    ['06', 'Cash Received', '', '', 'R-001', 0, 0, 0, 10000000],
    ['08', 'Cement', 'Pak Cem', 'LEB-6031', '1008', 50000, 146000, 7300000, 0],
    ['10', 'Cheque Received', '', '', 'R-002', 0, 0, 0, 15000000],
    ['12', 'Cement Returns', 'Pak Cem', '', '1001', 5000, 145000, 0, 725000],
  ] as const;
  return { parties, transactions: entries.map((e, i) => ({
    id: 'demo-tx-' + i, party_id: 'demo-1', date: month + '-' + e[0], description: e[1], brand: e[2],
    vehicle_number: e[3], bill_number: e[4], quantity_milli: e[5], rate_paisa: e[6], debit_paisa: e[7], credit_paisa: e[8],
    created_at: month + '-' + e[0] + 'T10:00:00.000Z',
  })) };
}
```

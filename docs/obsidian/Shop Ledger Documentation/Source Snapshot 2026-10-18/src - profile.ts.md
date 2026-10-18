---
title: "Source: src/profile.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src/profile.ts"
sha256: "c316f239e32d31bace552254c55fd6dc239a903966223386563819d330f944bb"
tags: [shop-ledger, development]
---

# Source snapshot: src/profile.ts

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/profile.ts`.
- SHA-256 of original file bytes: `c316f239e32d31bace552254c55fd6dc239a903966223386563819d330f944bb`.
- Original bytes: 1776; source lines: 33.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`ShopProfile`, `defaultProfile`, `validateProfile`, `uniqueOptions`.

## Complete source

```typescript
export interface ShopProfile {
  name: string; tagline: string; owner: string; phone: string; email: string; address: string; statement_note: string;
  descriptions: string[]; brands: string[]; vehicles: string[];
}
export const defaultProfile: ShopProfile = {
  name: 'Shop Name', tagline: 'Your business, in balance.', owner: '', phone: '', email: '', address: '',
  statement_note: 'Thank you for your business.',
  descriptions: ['Sale', 'Cash Received', 'Cheque Received', 'Bank Transfer', 'Carriage', 'Returns'],
  brands: [], vehicles: [],
};
export function validateProfile(value: unknown): ShopProfile {
  const p = value as ShopProfile;
  if (!p || typeof p !== 'object') throw new Error('Invalid shop profile.');
  const limits = { name: 80, tagline: 120, owner: 100, phone: 60, email: 120, address: 300, statement_note: 180 };
  for (const [key, limit] of Object.entries(limits)) {
    const text = p[key as keyof typeof limits];
    if (typeof text !== 'string' || text.length > limit) throw new Error('Invalid shop profile field: ' + key);
  }
  if (!p.name.trim()) throw new Error('Enter your shop name.');
  for (const key of ['descriptions', 'brands', 'vehicles'] as const) {
    if (!Array.isArray(p[key]) || p[key].length > 500 || p[key].some(s => typeof s !== 'string' || !s.trim() || s.length > (key === 'descriptions' ? 240 : key === 'brands' ? 80 : 50))) throw new Error('Invalid saved ' + key + '.');
  }
  return p;
}
export function uniqueOptions(values: string[]) {
  const result = new Map<string, string>();
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed && !result.has(trimmed.toLowerCase())) result.set(trimmed.toLowerCase(), trimmed);
  }
  return [...result.values()].sort((a, b) => a.localeCompare(b));
}
```

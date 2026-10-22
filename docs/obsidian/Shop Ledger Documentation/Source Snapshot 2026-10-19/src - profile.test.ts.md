---
title: "Source: src/profile.test.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/profile.test.ts"
sha256: "7f610ac098ebc330bb3ea03605f5937c778e4a1889d46f71b7dc64041e633f08"
tags: [shop-ledger, development]
---

# Source snapshot: src/profile.test.ts

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/profile.test.ts`.
- SHA-256 of original file bytes: `7f610ac098ebc330bb3ea03605f5937c778e4a1889d46f71b7dc64041e633f08`.
- Original bytes: 1028; source lines: 17.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { describe, expect, it } from 'vitest';
import { defaultProfile, uniqueOptions, validateProfile } from './profile';
import { validateStore } from './domain';
describe('shop profile and entry suggestions', () => {
  it('deduplicates saved and historical options without changing their text', () => {
    expect(uniqueOptions([' Cement ', 'cement', '', 'Steel', 'Steel'])).toEqual(['Cement','Steel']);
  });
  it('requires a shop name and validates optional fields and suggestion lengths', () => {
    expect(() => validateProfile({...defaultProfile,name:' '})).toThrow();
    expect(() => validateProfile({...defaultProfile,brands:['x'.repeat(81)]})).toThrow();
    expect(validateProfile(defaultProfile)).toEqual(defaultProfile);
  });
  it('accepts legacy backups and rejects malformed profile data', () => {
    expect(validateStore({parties:[],transactions:[]})).toEqual({parties:[],transactions:[]});
    expect(() => validateStore({parties:[],transactions:[],profile:{name:'Missing fields'}})).toThrow();
  });
});
```

---
title: "Source: vitest.config.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "vitest.config.ts"
sha256: "ee17157b192e07deaee880f58d07d0f7aa2144ae409afb0f9a6e0e462264de35"
tags: [shop-ledger, development]
---

# Source snapshot: vitest.config.ts

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/vitest.config.ts`.
- SHA-256 of original file bytes: `ee17157b192e07deaee880f58d07d0f7aa2144ae409afb0f9a6e0e462264de35`.
- Original bytes: 142; source lines: 2.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { include: ['src/**/*.test.ts'], environment: 'node' } });
```

---
title: "Source: vite.config.ts"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "vite.config.ts"
sha256: "efbb958bcc3f1f7307346b29595a35fcac1f36a23c7ffad3f8ccdc888b54efd8"
tags: [shop-ledger, development]
---

# Source snapshot: vite.config.ts

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/vite.config.ts`.
- SHA-256 of original file bytes: `efbb958bcc3f1f7307346b29595a35fcac1f36a23c7ffad3f8ccdc888b54efd8`.
- Original bytes: 354; source lines: 9.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 1420, strictPort: true, watch: { ignored: ['**/src-tauri/**', '**/.qa/**'] } },
  clearScreen: false,
  envPrefix: ['VITE_', 'TAURI_ENV_'],
});
```

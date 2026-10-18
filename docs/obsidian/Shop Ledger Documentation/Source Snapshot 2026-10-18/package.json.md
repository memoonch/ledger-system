---
title: "Source: package.json"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "package.json"
sha256: "e444b15e92df691739700c006ae0c18f66e542208635e4b8d84ea723a88f6cd7"
tags: [shop-ledger, development]
---

# Source snapshot: package.json

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/package.json`.
- SHA-256 of original file bytes: `e444b15e92df691739700c006ae0c18f66e542208635e4b8d84ea723a88f6cd7`.
- Original bytes: 1067; source lines: 42.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```json
{
  "name": "alfazal-ledger",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "tauri": "tauri"
  },
  "dependencies": {
    "@tauri-apps/api": "^2.0.0",
    "@tauri-apps/plugin-dialog": "^2.0.0",
    "@tauri-apps/plugin-fs": "^2.0.0",
    "@tauri-apps/plugin-sql": "^2.0.0",
    "exceljs": "^4.4.0",
    "jspdf": "^4.2.1",
    "jspdf-autotable": "^5.0.0",
    "lucide-react": "^0.468.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0",
    "@tauri-apps/cli": "^2.0.0",
    "@types/node": "^24.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.4.0",
    "tailwindcss": "^4.0.0",
    "typescript": "~5.8.3",
    "vite": "^6.3.0",
    "vitest": "^5.0.5"
  },
  "overrides": {
    "exceljs": {
      "uuid": "^11.1.1"
    }
  }
}
```

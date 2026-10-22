---
title: "Source: tsconfig.json"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "tsconfig.json"
sha256: "f55c101738bafa210b3c5f4c1e5bd9cae60b5b2d1c1f5b0d5334d4fb6b9d035e"
tags: [shop-ledger, development]
---

# Source snapshot: tsconfig.json

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/tsconfig.json`.
- SHA-256 of original file bytes: `f55c101738bafa210b3c5f4c1e5bd9cae60b5b2d1c1f5b0d5334d4fb6b9d035e`.
- Original bytes: 453; source lines: 26.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true,
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "types": [
      "vite/client",
      "node"
    ]
  },
  "include": [
    "src",
    "vite.config.ts"
  ]
}
```

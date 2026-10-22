---
title: "Source: src-tauri/capabilities/default.json"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/capabilities/default.json"
sha256: "d96c2e21b8f36f234eb095c47f70f8567e0a5bc39c586275268b0ac49d30d3c9"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/capabilities/default.json

- Captured: 2026-10-19T01:48:00+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/capabilities/default.json`.
- SHA-256 of original file bytes: `d96c2e21b8f36f234eb095c47f70f8567e0a5bc39c586275268b0ac49d30d3c9`.
- Original bytes: 465; source lines: 19.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```json
{
  "$schema": "../gen/schemas/desktop-schema.json",
  "identifier": "main-capability",
  "description": "Local ledger database and user-selected export and backup files",
  "windows": [
    "main"
  ],
  "permissions": [
    "core:default",
    "sql:default",
    "sql:allow-execute",
    "dialog:allow-save",
    "dialog:allow-open",
    "fs:allow-write-file",
    "fs:allow-read-text-file",
    "fs:allow-read-file",
    "fs:allow-stat"
  ]
}
```

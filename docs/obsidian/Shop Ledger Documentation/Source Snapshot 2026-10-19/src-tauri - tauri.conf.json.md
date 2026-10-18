---
title: "Source: src-tauri/tauri.conf.json"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/tauri.conf.json"
sha256: "eda7374da030eb0e64014045b8ab418f7a595170ca03cad3bc7112594d887847"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/tauri.conf.json

- Captured: 2026-10-19T01:12:18+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/tauri.conf.json`.
- SHA-256 of original file bytes: `eda7374da030eb0e64014045b8ab418f7a595170ca03cad3bc7112594d887847`.
- Original bytes: 1342; source lines: 58.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Shop Ledger",
  "version": "0.1.4",
  "identifier": "com.alfazal.ledger",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "devUrl": "http://127.0.0.1:1420",
    "frontendDist": "../dist"
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "Shop Ledger",
        "width": 1440,
        "height": 960,
        "minWidth": 1024,
        "minHeight": 700
      }
    ],
    "security": {
      "csp": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src ipc: http://ipc.localhost; font-src 'self' data:; object-src 'none'"
    }
  },
  "bundle": {
    "active": true,
    "targets": [
      "nsis"
    ],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.ico"
    ],
    "windows": {
      "webviewInstallMode": {
        "type": "offlineInstaller"
      },
      "allowDowngrades": false,
      "nsis": {
        "installMode": "currentUser",
        "languages": [
          "English"
        ]
      }
    }
  },
  "plugins": {
    "sql": {
      "preload": [
        "sqlite:alfazal.db"
      ]
    }
  }
}
```

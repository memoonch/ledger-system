---
title: "Source: src-tauri/tauri.conf.json"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/tauri.conf.json"
sha256: "b356c322c794c2ff3f30ea0cf1cfda77df1a28caa825e2f49b0b8ad623d36314"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/tauri.conf.json

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/tauri.conf.json`.
- SHA-256 of original file bytes: `b356c322c794c2ff3f30ea0cf1cfda77df1a28caa825e2f49b0b8ad623d36314`.
- Original bytes: 1432; source lines: 60.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Shop Ledger",
  "version": "0.1.8",
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
        ],
        "installerIcon": "icons/icon.ico",
        "uninstallerIcon": "icons/icon.ico"
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

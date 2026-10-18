---
title: "Source: src-tauri/Cargo.toml"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/Cargo.toml"
sha256: "dbda88afb9a18eafeb394647ee6dd9ce8dc2b312bdca0005c761448d5fe52059"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/Cargo.toml

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/Cargo.toml`.
- SHA-256 of original file bytes: `dbda88afb9a18eafeb394647ee6dd9ce8dc2b312bdca0005c761448d5fe52059`.
- Original bytes: 467; source lines: 23.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```toml
[package]
name = "alfazal-ledger"
version = "0.1.0"
description = "Offline customer ledgers for local shops"
authors = ["Shop Ledger"]
edition = "2021"

[lib]
name = "alfazal_ledger_lib"
crate-type = ["rlib"]

[build-dependencies]
tauri-build = { version = "2", features = [] }

[dependencies]
tauri = { version = "2", features = [] }
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
tauri-plugin-dialog = "2"
tauri-plugin-fs = "2"

serde_json = "1"
```

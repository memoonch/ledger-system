---
title: "Source: src-tauri/src/lib.rs"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
source_path: "src-tauri/src/lib.rs"
sha256: "17cb9d773a91a8d1d325e8b6f5e570e4e43a4a30d8dc1fb35df00d8ed2a0865a"
tags: [shop-ledger, development]
---

# Source snapshot: src-tauri/src/lib.rs

- Captured: 2026-10-18T23:19:27+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src-tauri/src/lib.rs`.
- SHA-256 of original file bytes: `17cb9d773a91a8d1d325e8b6f5e570e4e43a4a30d8dc1fb35df00d8ed2a0865a`.
- Original bytes: 1015; source lines: 27.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```rust
use tauri_plugin_sql::{Migration, MigrationKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "customers_and_ledger",
        sql: include_str!("../migrations/001_initial.sql"),
        kind: MigrationKind::Up,
    }, Migration {
        version: 2,
        description: "shop_profile",
        sql: include_str!("../migrations/002_shop_profile.sql"),
        kind: MigrationKind::Up,
    }, Migration {
        version: 3,
        description: "customer_import",
        sql: include_str!("../migrations/003_customer_import.sql"),
        kind: MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:alfazal.db", migrations).build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("Unable to start Shop Ledger");
}
```

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
    }, Migration {
        version: 4,
        description: "customer_archive_and_delete",
        sql: include_str!("../migrations/004_customer_archive.sql"),
        kind: MigrationKind::Up,
    }, Migration {
        version: 5,
        description: "supplier_ledgers",
        sql: include_str!("../migrations/005_suppliers.sql"),
        kind: MigrationKind::Up,
    }, Migration {
        version: 6,
        description: "daily_cash_book",
        sql: include_str!("../migrations/006_cash_book.sql"),
        kind: MigrationKind::Up,
    }, Migration {
        version: 7,
        description: "customer_due_dates",
        sql: include_str!("../migrations/007_customer_due_dates.sql"),
        kind: MigrationKind::Up,
    }];
    tauri::Builder::default()
        .plugin(tauri_plugin_sql::Builder::default().add_migrations("sqlite:alfazal.db", migrations).build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .run(tauri::generate_context!())
        .expect("Unable to start Shop Ledger");
}

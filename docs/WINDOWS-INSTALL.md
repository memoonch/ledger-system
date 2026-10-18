# Installing and updating Shop Ledger on Windows

## Install

1. Run the supplied `Shop Ledger_0.1.4_x64-setup.exe`.
2. Keep the current-user installation option and finish setup.
3. Open **Shop Ledger** from the Windows Start menu.

The installer includes the offline Microsoft WebView2 runtime. The app uses local SQLite and needs no shop account or internet connection for ledger work. This installer is for 64-bit Windows.

## Update without losing records

1. In Shop Ledger, choose **Back up records** and keep the JSON backup somewhere safe.
2. Close Shop Ledger.
3. Run the newer Shop Ledger setup file under the same Windows user account.
4. Keep the existing installation location. Let setup update the installed app.
5. Open Shop Ledger and confirm customers and balances are present.

Do not uninstall first. Do not select **Delete application data** if you use the uninstaller. The program and database live in separate locations:

- Program: normally `%LOCALAPPDATA%\Shop Ledger` (the setup location may vary).
- Ledger database: `%APPDATA%\com.alfazal.ledger\alfazal.db`.

Keep the application identifier and database filename unchanged in future releases. Schema changes must use new migration versions. Installing under a different Windows user account opens that account's separate data folder.

## Recovery

If records appear missing, first confirm you are using the Windows desktop app under the original Windows user account. Browser preview records are separate. Use **Restore backup** only when you intend to replace the app's current records; the app first asks you to save a safety backup.

## Build for developers

Run `npm.cmd run tauri build -- --bundles nsis` on Windows with the documented Node, Rust and C++ build tools installed. Setup files are generated in `src-tauri/target/release/bundle/nsis`. Building may download packaging tools and WebView2; using the completed installer does not need those downloads.

Increase the version together in `package.json`, `package-lock.json`, `src-tauri/Cargo.toml`, `src-tauri/Cargo.lock` and `src-tauri/tauri.conf.json`. Keep `com.alfazal.ledger`, the Rust executable name and `sqlite:alfazal.db` stable. Test the old installer followed by the newer installer, compare stored rows and verify SQLite integrity. A successful compilation alone is not an upgrade test.

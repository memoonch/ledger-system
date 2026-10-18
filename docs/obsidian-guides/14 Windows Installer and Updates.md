# Windows installer and updates

The Windows distribution is an x64 NSIS setup executable. Version 0.1.1 keeps the stable application identity `com.alfazal.ledger`, executable `alfazal-ledger.exe` and database `sqlite:alfazal.db`. Versions match across npm metadata, Cargo metadata/lockfile and Tauri config.

## Install and upgrade

See the repository's `docs/WINDOWS-INSTALL.md` for the user instructions and recovery steps. Run setup as the same Windows user; update the existing installation instead of uninstalling first. Export a JSON backup before an update. Do not select Delete application data in an uninstaller.

Program files normally live under `%LOCALAPPDATA%/Shop Ledger`. SQLite data remains under `%APPDATA%/com.alfazal.ledger/alfazal.db`. Browser preview storage is separate. The package includes the offline WebView2 installer, so it is considerably larger than the application executable alone.

## Configuration

`src-tauri/tauri.conf.json` specifies `bundle.targets = ["nsis"]`, current-user English setup, offline WebView2 installation and `allowDowngrades = false`. That downgrade setting blocks an older installer with the setting in silent/passive/update mode; interactive removal can still allow an intentional downgrade. It does not retroactively change previously distributed installers.

Database migrations 1–3 remain unchanged. Never ship a customer database inside the installer. Do not rename the identifier/database or overwrite a database when updating. Each future schema change needs a new numbered migration and an upgrade test.

## Build

`npm.cmd run tauri build -- --bundles nsis` builds optimized app files and packages setup. Output is `src-tauri/target/release/bundle/nsis/Shop Ledger_0.1.1_x64-setup.exe`. Build tools are only needed on the development computer. Packaging may download NSIS and Microsoft WebView2; using the finished offline package does not require those build downloads.

The first release compilation encountered a compiler process failure. Retrying with process-local `RUSTC_BOOTSTRAP=1`, `CARGO_INCREMENTAL=0` and `CARGO_BUILD_JOBS=4` completed. These are not global environment changes or app-runtime requirements.

## Test scope and evidence

The test machine already had WebView2 and existing ledger data. A consistent SQLite safety backup and canonical per-table hashes were captured before installing. The old 0.1.0 setup was installed and launched; the newer 0.1.1 setup is tested over that installation. Validation compares every party, transaction and profile value, not just row counts, and runs `PRAGMA integrity_check`. Neither sample customer records nor real source Excel/PDF files are added during installer testing.

The release validation report in `docs/release-validation-0.1.1.json` records completed checks and limits. Do not claim clean-machine WebView2 installation, other Windows versions, signing or future migration compatibility beyond what that report confirms. Setup is unsigned unless a signing certificate is configured later. This is a manual offline update workflow, not a cloud updater.

References: [Tauri Windows installer documentation](https://v2.tauri.app/distribute/windows-installer/) and [Tauri configuration](https://v2.tauri.app/reference/config/).

## Release 0.1.2

Adds migration 4 and customer Archive/Restore/Permanent Delete. The same install/update workflow applies. See [[15 Customer Archive Restore and Delete]] and `docs/release-validation-0.1.2.json`. The earlier 0.1.1 report remains historical verification for that release.

## Release 0.1.3

Adds migration 5, supplier ledgers and backup version 3. Native purchase/payment persistence and upgrade preservation passed. See [[16 Purchase and Supplier Ledger]] and `docs/release-validation-0.1.3.json`. The earlier installer reports remain historical.

## Daily cash book update

Release 0.1.4 adds migration 6 and the cash book. See [[17 Daily Cash Book and Expenses]] and docs/release-validation-0.1.4.json for completed native checks.

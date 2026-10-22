---
title: "New Computer Installer and App Icon"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# New Computer Installer and App Icon

Prepared 2026-10-19 as Shop Ledger 0.1.6. This release changes desktop/installer icon artwork and distribution packaging; the existing SQLite schema remains migration 7. The current computer's installed app and records are not modified by creating the package.

## Transfer to another computer

Use the separate repository folder `releases/Shop Ledger 0.1.6 - New Computer/`. Copy the whole folder to a USB drive and run `Shop Ledger_0.1.6_x64-setup.exe` on Windows 10/11 x64. The package includes the offline WebView2 runtime. A new computer/Windows account starts with empty customer/supplier ledgers, no cash movements or closing counts, unconfigured cash drawer, and generic Shop Name profile. Set the profile using the top-left shop button. Default transaction-description suggestions are not customer records.

No existing customer data, suppliers, bills, vehicles, cash history, profile, backups or databases are copied into the installer. Installation on an existing Shop Ledger computer preserves that computer's records; it does not reset them. Do not restore a backup when an empty ledger is intended. The app remains offline and unsigned.

## Icon source and build

`assets/icon.svg` is an editable vector icon: cream ledger with gold spine, a gold check badge and green rounded background. `npm.cmd run tauri icon -- assets/icon.svg` generates multi-size Windows icons and PNG assets. The Tauri bundle uses `icons/icon.ico`; NSIS explicitly sets both installerIcon and uninstallerIcon to this path. The executable, installed shortcuts, installer and uninstaller receive the icon. Original internal package/database identifiers remain unchanged to preserve existing upgrade compatibility.

Build with the established Rust environment workaround described in the setup guide, then run `scripts/package-new-computer.py` from the repository root. This helper is for the 0.1.6 release and writes only the dedicated distribution folder and validation report. It does not read or modify the live shop database. It copies the completed installer, preview PNG, instructions and SHA256 file; release binaries are excluded from Git.

## Verification

The helper initializes every migration in a fresh in-memory SQLite database and asserts all business/staging tables are empty, profile contact fields are blank, and cash settings are null. It rejects extra Tauri resources/sidecars and unexpected NSIS File payload directives. It parses the application and installer PE resources and checks every ICO image is actually embedded. The output folder is restricted to the four intended files; copied installer SHA256 must match.

`docs/release-validation-0.1.6.json` records the package hash, empty-table counts, icon-resource checks and payload audit. This verifies fresh schema initialization and package contents; a second physical computer installation is not claimed. Keep the user's live records and backup files outside the distributable folder.

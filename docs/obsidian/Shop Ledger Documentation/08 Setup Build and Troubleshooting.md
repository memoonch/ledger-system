---
title: "Setup, build and troubleshooting"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-18"
generated_by: "shop-ledger-docs"
tags: [shop-ledger, development]
---

# Setup, build and troubleshooting

## Working directory

`C:/Users/FROST/Documents/GitHub/ledger-system`

Commands below use PowerShell and `npm.cmd` to avoid PowerShell execution-policy ambiguity around npm.ps1.

## Development prerequisites

- Node.js LTS with npm.
- Git.
- Rust MSVC toolchain and Cargo.
- Microsoft C++ Build Tools with Desktop development with C++.
- Windows 10/11 SDK.
- Microsoft Edge WebView2 Runtime.
- VS Code is optional.

Session-verified tool versions were Node 24.22.0, npm 11.19.1, Rust/Cargo 1.99.1, Git 2.50.1 and VS Code 1.138.0. Native compilation and execution succeeded; those observed versions are historical evidence, not a requirement to install those exact versions.

Exact locked library versions are in [[12 Dependencies and Source Manifest]].

## Install dependencies

For a checkout with existing lockfiles:

```powershell
npm.cmd ci
```

Use `npm.cmd install` when intentionally changing package declarations/lockfiles. Cargo downloads Rust crates as needed during native commands. First-time dependency downloads need internet.

## Browser preview

```powershell
npm.cmd run dev
```

Open `http://127.0.0.1:1420/`. Use Try sample data only in an empty preview. Preview localStorage is separate from native SQLite.

Port 1420 is strict. Do not run two standalone preview servers on that port.

## Native development

```powershell
npm.cmd run tauri dev
```

Tauri starts its configured beforeDevCommand, which runs Vite. Close a separately running standalone Vite process first rather than starting a second server on port 1420.

## Tests and frontend build

```powershell
npm.cmd test
npm.cmd run build
```

The frontend build type-checks with `tsc -b` and emits `dist/` through Vite.

## Windows review executable

```powershell
npm.cmd run tauri build -- --debug --no-bundle
```

Expected output: `src-tauri/target/debug/alfazal-ledger.exe`.

Alternative with dependencies already cached and a fresh frontend build:

```powershell
npm.cmd run build
cargo build --manifest-path src-tauri/Cargo.toml --bins --features tauri/custom-protocol --offline -j 8
```

The internal executable/package name remains for compatibility. Visible product/window name is Shop Ledger. The shop's own name is controlled by the local profile.

## Windows installer

```powershell
npm.cmd run tauri build
```

Configuration targets NSIS and requests an offline WebView2 installer. The first packaging run may download runtime/bundler tools. Installer output and installation on a separate shop computer have not yet been validated.

## Issues encountered and how they were handled

### Node/Rust absent from PATH

Node existed at `C:/Program Files/nodejs` and Rust at `C:/Users/FROST/.cargo/bin`. They were added to the user PATH. Restart the terminal/app to see a newly updated PATH.

### Rust reported it could not create .rustup

The installation itself worked when checked with sufficient filesystem access. The earlier error came from restricted execution, not evidence that Rust needed reinstalling.

### Vite EBUSY while watching Rust build files

The preview server tried to watch a locked executable under `src-tauri/target`. The lasting fix is the Vite watcher exclusion for `**/src-tauri/**` and `**/.qa/**`. Keep those exclusions.

### Missing serde_json in generate_context

`serde_json = "1"` was added to Cargo dependencies because Tauri's generated context code required it.

### Package audit findings

Initial selected PDF/test-runner major versions had advisories. jsPDF was updated to 4.2.1 and Vitest to 5.0.5. The audit then reported zero known vulnerabilities at that check. That result is dated; run a fresh audit when updating dependencies.

### A local native rebuild stalled

Some rebuild attempts stalled on this machine. Obsolete task-owned compiler processes were stopped, incremental compilation was disabled for a diagnostic attempt, and the Windows library output was simplified to rlib.

A successful diagnostic build used process-local `RUSTC_BOOTSTRAP=1` and `CARGO_INCREMENTAL=0`. The final executable was built and tested afterward. No global Rust environment setting or Cargo configuration was added for this workaround. Prefer normal stable commands; do not treat enabling internal compiler diagnostics as a normal deployment requirement.

### Native browser-test startup race

CDP connection can be attempted before WebView2 opens its test port. Tests now retry connection briefly and wait for the application's loading state to finish before checking the persisted profile. Seeing the initial generic profile before async SQLite loading completes is not proof of lost data.

## Documentation commands

`scripts/export-obsidian.py` regenerates the repository copy of these notes and full source snapshots. Use the bundled Python executable on this computer or another Python 3.11+ installation. See [[10 Editing Playbook and Roadmap]] for publishing.

Do not delete customer data to fix a build or preview problem. App data, browser data and build output are different locations.

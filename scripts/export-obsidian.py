"""Export linked Obsidian references and complete, dated project-source snapshots.

Run from a checkout with Python 3.11+. This writes only inside docs/obsidian.
It never reads customer databases, backup payloads, .env files, or WebView profiles.
Topic prose lives in docs/obsidian-guides and should be reviewed when code changes.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import re
import subprocess
import tomllib
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PREFIX = "Alfazal Ledgher System/Shop Ledger Documentation"
OUT = ROOT / "docs" / "obsidian"
BOOK = OUT / "Shop Ledger Documentation"
GUIDES = ROOT / "docs" / "obsidian-guides"
BACKTICK = chr(96)

def read(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")

def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def git(*args: str) -> str:
    try:
        return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True, check=True).stdout.strip()
    except (OSError, subprocess.CalledProcessError):
        return "Unavailable"

def frontmatter(title: str, date: str, extra: dict | None = None) -> str:
    fields = {"title": title, "type": "Reference", "project": "Shop Ledger",
              "updated": date, "generated_by": "shop-ledger-docs"}
    fields.update(extra or {})
    return "---\n" + "".join(f"{k}: {json.dumps(v, ensure_ascii=False)}\n" for k, v in fields.items()) + "tags: [shop-ledger, development]\n---\n\n"

def write_note(path: Path, title: str, body: str, date: str, extra: dict | None = None):
    if path.exists() and "generated_by: " not in read(path)[:800]:
        raise RuntimeError(f"Refusing to replace a non-generated note: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(frontmatter(title, date, extra) + body.rstrip() + "\n", encoding="utf-8", newline="\n")

def wiki(relative: str, label: str | None = None) -> str:
    return "[[" + PREFIX + "/" + relative.removesuffix(".md") + ("|" + label if label else "") + "]]"

def file_note_name(relative: str) -> str:
    label = relative.replace("/", " - ")
    if label.startswith("."):
        label = "dot - " + label[1:]
    return label.removesuffix(".md") + (" - markdown.md" if relative.endswith(".md") else ".md")

def source_files() -> list[Path]:
    names = [
        ".gitignore", "README.md", "REQUIREMENTS.md", "package.json", "package-lock.json",
        "index.html", "tsconfig.json", "vite.config.ts", "vitest.config.ts",
        "src-tauri/Cargo.toml", "src-tauri/Cargo.lock", "src-tauri/build.rs",
        "src-tauri/tauri.conf.json", "src-tauri/capabilities/default.json",
        "assets/icon.svg", "scripts/export-obsidian.py",
    ]
    files = [ROOT / name for name in names if (ROOT / name).is_file()]
    files += [p for p in (ROOT / "src").rglob("*") if p.is_file() and p.suffix in {".ts", ".tsx", ".css"}]
    files += list((ROOT / "src-tauri" / "src").glob("*.rs"))
    files += list((ROOT / "src-tauri" / "migrations").glob("*.sql"))
    # Only explicit script sources; never QA exports, app data or earlier one-off mutation scripts.
    files += [ROOT / ".qa" / name for name in
              ["ui-check.cjs", "generic-check.cjs", "native-check.cjs", "native-profile-check.cjs"]
              if (ROOT / ".qa" / name).is_file()]
    return sorted(set(files), key=lambda p: p.relative_to(ROOT).as_posix())

def language(path: Path) -> str:
    return {".ts": "typescript", ".tsx": "tsx", ".css": "css", ".json": "json",
            ".rs": "rust", ".sql": "sql", ".toml": "toml", ".md": "markdown",
            ".py": "python", ".svg": "xml", ".html": "html", ".cjs": "javascript"}.get(path.suffix, "text")

def outside_code(text: str) -> str:
    output = []
    fence = None
    for line in text.splitlines():
        marker = re.match(r"^(`{3,})", line)
        if marker:
            if fence is None:
                fence = len(marker[1])
            elif len(marker[1]) >= fence:
                fence = None
            continue
        if fence is None:
            output.append(line)
    return "\n".join(output)

def verify_links() -> dict:
    notes = list(BOOK.rglob("*.md"))
    known = {PREFIX + "/" + p.relative_to(BOOK).with_suffix("").as_posix() for p in notes}
    known.update(p.stem for p in notes)
    known.update(p.relative_to(BOOK).with_suffix("").as_posix() for p in notes)
    missing = []
    for path in [*notes, OUT / "Project Documentation.md"]:
        for target in re.findall(r"\[\[([^\]]+)\]\]", outside_code(read(path))):
            target = target.split("|", 1)[0].split("#", 1)[0].removesuffix(".md")
            if target and target not in known:
                missing.append({"note": path.name, "target": target})
    if missing:
        raise RuntimeError("Unresolved documentation links: " + json.dumps(missing))
    return {"notes": len(notes), "unresolved_links": 0}

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", help="Snapshot date YYYY-MM-DD; defaults to local Asia/Karachi date.")
    args = parser.parse_args()
    captured = datetime.now(timezone(timedelta(hours=5), "Asia/Karachi"))
    date = args.date or captured.date().isoformat()
    datetime.strptime(date, "%Y-%m-%d")
    snapshot = f"Source Snapshot {date}"
    BOOK.mkdir(parents=True, exist_ok=True)
    for template in sorted(GUIDES.glob("*.md")):
        body = read(template)
        title = next((line[2:] for line in body.splitlines() if line.startswith("# ")), template.stem)
        write_note(BOOK / template.name, title, body, date)

    manifest = []
    for path in source_files():
        relative = path.relative_to(ROOT).as_posix()
        text = read(path)
        max_ticks = max((len(x) for x in re.findall(r"`+", text)), default=0)
        fence = BACKTICK * max(3, max_ticks + 1)
        note_relative = snapshot + "/" + file_note_name(relative)
        symbols = re.findall(r"export\s+(?:default\s+)?(?:async\s+)?(?:function|interface|const)\s+(\w+)", text)

        note = f"# Source snapshot: {relative}\n\n"
        note += f"- Captured: {captured.isoformat(timespec='seconds')} (Asia/Karachi).\n"
        note += f"- Repository source: {BACKTICK}{path.as_posix()}{BACKTICK}.\n"
        note += f"- SHA-256 of original file bytes: {BACKTICK}{sha(path)}{BACKTICK}.\n"
        note += f"- Original bytes: {path.stat().st_size}; source lines: {len(text.splitlines())}.\n"
        note += "- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.\n"
        if relative.startswith(".qa/"):
            note += "- Local, ignored QA instrumentation. Paths are machine-specific. Original UI-check currency expectations may predate whole-rupee formatting.\n"
        if symbols:
            note += "\n## Exported symbols\n\n" + ", ".join(BACKTICK + s + BACKTICK for s in symbols) + ".\n"
        note += f"\n## Complete source\n\n{fence}{language(path)}\n{text.rstrip()}\n{fence}\n"
        write_note(BOOK / note_relative, "Source: " + relative, note, date,
                   {"source_path": relative, "sha256": sha(path)})
        manifest.append({"source": relative, "sha256": sha(path), "bytes": path.stat().st_size,
                         "lines": len(text.splitlines()), "note": note_relative})

    package = json.loads(read(ROOT / "package.json"))
    lock = json.loads(read(ROOT / "package-lock.json"))
    cargo_manifest = tomllib.loads(read(ROOT / "src-tauri/Cargo.toml"))
    cargo_lock = tomllib.loads(read(ROOT / "src-tauri/Cargo.lock"))
    title = "Dependencies and source manifest"
    body = "# " + title + "\n\n"
    body += f"- Captured: {captured.isoformat(timespec='seconds')} (Asia/Karachi).\n"
    body += f"- Repository: {BACKTICK}{ROOT.as_posix()}{BACKTICK}.\n"
    body += f"- Product version: {package['version']}.\n"
    body += f"- Git HEAD: {BACKTICK}{git('rev-parse', 'HEAD')}{BACKTICK}.\n"
    body += f"- Latest commit: {git('log', '-1', '--format=%h %s')}.\n"
    body += "- Working-tree state at generation (documentation can itself be new/uncommitted):\n\n"
    body += BACKTICK * 3 + "text\n" + (git("status", "--short") or "Clean") + "\n" + BACKTICK * 3 + "\n"
    body += "\n## Direct npm dependencies\n\n| Package | Declared range | Locked version | Group |\n|---|---|---|---|\n"
    for section in ["dependencies", "devDependencies"]:
        for name, version in sorted(package.get(section, {}).items()):
            resolved = lock.get("packages", {}).get("node_modules/" + name, {}).get("version", "See lockfile")
            body += f"| {name} | {version} | {resolved} | {section} |\n"
    body += "\n## Direct Rust dependencies\n\n| Crate | Declaration | Locked version(s) | Group |\n|---|---|---|---|\n"
    for section in ["dependencies", "build-dependencies"]:
        for name, declaration in sorted(cargo_manifest.get(section, {}).items()):
            versions = sorted({p["version"] for p in cargo_lock.get("package", []) if p["name"] == name})
            body += f"| {name} | {json.dumps(declaration)} | {', '.join(versions)} | {section} |\n"
    body += "\n## Complete source copies\n\n"
    body += "Every production source/config file, test file, both dependency lockfiles, the icon SVG, the exporter and selected QA script sources are archived below. No node_modules, Rust registry sources, build outputs, customer databases, JSON backup payloads, credentials or WebView profiles are included.\n\n"
    body += "| Repository file | Bytes | SHA-256 prefix | Source note |\n|---|---:|---|---|\n"
    for item in manifest:
        body += f"| {BACKTICK}{item['source']}{BACKTICK} | {item['bytes']} | {item['sha256'][:16]} | {wiki(item['note'], 'Full source')} |\n"
    body += "\n## Test names at this snapshot\n\n"
    test_count = 0
    for path in sorted((ROOT / "src").glob("*.test.ts")):
        tests = re.findall(r"^\s*it\(\s*(['\"])(.*?)\1\s*,", read(path), re.MULTILINE)
        body += f"### {path.name}\n\n"
        for _, name in tests:
            body += "- " + name + "\n"
        body += "\n"
        test_count += len(tests)
    body += f"Discovered named test cases: **{test_count}**. This is a source inventory, not a new test run.\n"
    body += "\n## Generated icon assets\n\n"
    body += "These are reproducible assets generated from assets/icon.svg. Binary files are inventoried, not embedded as Markdown source.\n\n"
    body += "| File | Bytes | SHA-256 prefix |\n|---|---:|---|\n"
    for path in sorted((ROOT / "src-tauri" / "icons").rglob("*")):
        if path.is_file():
            body += f"| {path.relative_to(ROOT).as_posix()} | {path.stat().st_size} | {sha(path)[:16]} |\n"
    body += "\n## Verification and drift\n\nSource-note hashes refer to original file bytes. Compare with the repository before relying on a dated copy. Exact dependency graphs are retained in the complete package-lock.json and Cargo.lock source notes. Refreshing notes does not install dependencies, rerun tests, commit code, or sync Engram.\n"
    write_note(BOOK / "12 Dependencies and Source Manifest.md", title, body, date)
    bridge = "# Project documentation\n\n"
    bridge += "The original Context.md and Functional Requiremts.md are preserved. The current implementation and later owner-approved changes are documented here:\n\n"
    bridge += "- " + wiki("00 Start Here", "Open Shop Ledger documentation") + "\n"
    bridge += "- " + wiki("03 Code Map and API", "Find the file or function to edit") + "\n"
    bridge += "- " + wiki("08 Setup Build and Troubleshooting", "Run or rebuild the app") + "\n"
    bridge += "- " + wiki("12 Dependencies and Source Manifest", "Full source snapshots and exact dependency versions") + "\n"
    bridge += "\nEngram currently reports no accessible synced vault. These are local Obsidian notes. Sync/connect the vault in Engram to make them available through that connector.\n"

    write_note(OUT / "Project Documentation.md", "Shop Ledger project documentation", bridge, date)
    summary = verify_links()
    summary.update({"captured_at": captured.isoformat(timespec="seconds"), "snapshot_date": date,
                    "source_files": len(manifest), "named_tests": test_count,
                    "root_bridge": "Project Documentation.md", "source_manifest": manifest})
    for item in manifest:
        assert sha(ROOT / item["source"]) == item["sha256"], "Source changed during export: " + item["source"]
    outputs = sorted(BOOK.rglob("*.md")) + [OUT / "Project Documentation.md"]
    summary["output_files"] = [{"path": p.relative_to(OUT).as_posix(), "sha256": sha(p)} for p in outputs]
    (OUT / "documentation-manifest.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print(json.dumps({k: summary[k] for k in ["notes", "source_files", "named_tests", "unresolved_links", "captured_at"]}, indent=2))

if __name__ == "__main__":
    main()



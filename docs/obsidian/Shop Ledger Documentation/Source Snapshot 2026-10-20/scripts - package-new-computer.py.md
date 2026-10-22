---
title: "Source: scripts/package-new-computer.py"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-20"
generated_by: "shop-ledger-docs"
source_path: "scripts/package-new-computer.py"
sha256: "f056ad3b141a012f8925ad2591a7162f23423be93d83e801bd46ae7521ff1cbf"
tags: [shop-ledger, development]
---

# Source snapshot: scripts/package-new-computer.py

- Captured: 2026-10-20T23:30:14+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/scripts/package-new-computer.py`.
- SHA-256 of original file bytes: `f056ad3b141a012f8925ad2591a7162f23423be93d83e801bd46ae7521ff1cbf`.
- Original bytes: 5761; source lines: 66.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Complete source

```python
from pathlib import Path
import sqlite3,json,struct,hashlib,shutil
root=Path(__file__).resolve().parents[1]
version='0.1.6';out=root/'releases'/('Shop Ledger '+version+' - New Computer');out.mkdir(parents=True,exist_ok=True)
config=json.loads((root/'src-tauri/tauri.conf.json').read_text())
assert not config['bundle'].get('resources') and not config['bundle'].get('externalBin')
assert config['bundle']['windows']['nsis']['installerIcon']=='icons/icon.ico'
with sqlite3.connect(':memory:') as db:
 for migration in sorted((root/'src-tauri/migrations').glob('*.sql')):db.executescript(migration.read_text(encoding='utf-8-sig'))
 counts={t:db.execute('SELECT count(*) FROM '+t).fetchone()[0] for t in ['parties','ledger_transactions','suppliers','supplier_transactions','cash_movements','cash_closings','restore_requests','supplier_bill_requests']}
 assert all(n==0 for n in counts.values())
 profile=json.loads(db.execute('SELECT data FROM shop_profile').fetchone()[0]);assert profile['name']=='Shop Name' and not any(profile[k] for k in ['owner','phone','email','address','brands','vehicles'])
 assert db.execute('SELECT data FROM cash_settings').fetchone()[0]=='null'
 assert db.execute('PRAGMA integrity_check').fetchone()[0]=='ok'
# Confirm the only installer File directives are the application and Microsoft's offline WebView2 installer.
nsi=(root/'src-tauri/target/release/nsis/x64/installer.nsi').read_text(encoding='utf-8-sig')
files=[line.strip() for line in nsi.splitlines() if line.strip().startswith('File ')]
assert files and all(any(token in line for token in ['${MAINBINARYSRCPATH}','${WEBVIEW2INSTALLERPATH}','${WEBVIEW2BOOTSTRAPPERPATH}']) for line in files),files
assert '!define INSTALLERICON ""' not in nsi
# Verify each supplied ICO image is embedded in both Windows PE resources.
ico=(root/'src-tauri/icons/icon.ico').read_bytes();icons=[]
for i in range(struct.unpack_from('<H',ico,4)[0]):
 size,offset=struct.unpack_from('<II',ico,6+i*16+8);icons.append(ico[offset:offset+size])
def pe_icons(path):
 data=path.read_bytes();pe=struct.unpack_from('<I',data,60)[0];sections=struct.unpack_from('<H',data,pe+6)[0];opt=pe+24;optsize=struct.unpack_from('<H',data,pe+20)[0];magic=struct.unpack_from('<H',data,opt)[0];dd=opt+(112 if magic==0x20b else 96);rva=struct.unpack_from('<I',data,dd+16)[0]
 def off(r):
  for i in range(sections):
   vsize,va,rawsize,raw=struct.unpack_from('<IIII',data,opt+optsize+40*i+8)
   if va<=r<va+max(vsize,rawsize):return raw+r-va
  raise ValueError('RVA outside sections')
 base=off(rva);result=[]
 def walk(rel,path):
  count=sum(struct.unpack_from('<HH',data,base+rel+12))
  for i in range(count):
   name,target=struct.unpack_from('<II',data,base+rel+16+8*i);p=path+[name]
   if target&0x80000000:walk(target&0x7fffffff,p)
   elif p[0]==3:
    address,size=struct.unpack_from('<II',data,base+target);start=off(address);result.append(data[start:start+size])
 walk(0,[]);return result
setup=root/'src-tauri/target/release/bundle/nsis'/('Shop Ledger_'+version+'_x64-setup.exe')
icon_checks={}
for label,path in [('installer',setup),('application',root/'src-tauri/target/release/alfazal-ledger.exe')]:
 embedded=pe_icons(path);assert all(icon in embedded for icon in icons),label+' icon mismatch';icon_checks[label]={'matching_icon_images':len(icons),'verified':True}
shutil.copy2(setup,out/setup.name);shutil.copy2(root/'src-tauri/icons/128x128@2x.png',out/'Shop Ledger Icon.png')
readme='''SHOP LEDGER 0.1.6 - NEW COMPUTER SETUP

1. Copy this entire folder to the other Windows 10/11 64-bit computer using a USB drive.
2. Run Shop Ledger_0.1.6_x64-setup.exe and follow the installer.
3. Open Shop Ledger. On a new Windows account/computer, the customer and supplier lists are empty. Click Shop Name in the top-left corner to set the shop profile.
4. Add your customers and suppliers, then set the cash drawer opening balance when ready.

The installer includes the offline Microsoft WebView2 runtime. Normal use requires no internet. Windows may ask you to confirm an unsigned installer.

NO SHOP RECORDS ARE INCLUDED
This folder contains the application installer, icon, these instructions and a SHA-256 checksum only. No customer/supplier records, ledgers, cash records, personal shop profile, database or backup files are copied from the current computer.

Installing on a computer that already has Shop Ledger preserves that computer's existing records; it does not erase them. A fresh computer starts with a generic Shop Name profile and default transaction-description suggestions. Do not restore a backup if you want to start empty.

Keep periodic backups on a separate drive after you start using the app.
'''
(out/'READ ME FIRST.txt').write_text(readme,encoding='utf-8')
digest=hashlib.sha256(setup.read_bytes()).hexdigest();(out/'SHA256.txt').write_text(digest+'  '+setup.name+'\n')
allowed={setup.name,'Shop Ledger Icon.png','READ ME FIRST.txt','SHA256.txt'};assert {p.name for p in out.iterdir()}==allowed
assert hashlib.sha256((out/setup.name).read_bytes()).hexdigest()==digest
report={'version':version,'distribution_folder':str(out.relative_to(root)),'installer':setup.name,'sha256':digest,'bytes':setup.stat().st_size,'fresh_database_rows':counts,'profile_generic':True,'cash_not_initialized':True,'bundle_extra_resources':False,'nsis_payload_directives':files,'embedded_icons':icon_checks,'distribution_files':sorted(allowed),'shop_data_included':False,'existing_installation_modified':False,'tests_passed':77,'fresh_database_integrity':'ok','validation_note':'Fresh SQLite initialization and package payload/resource audit; not a second physical computer install.'}
(root/'docs/release-validation-0.1.6.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(report,indent=2))
```

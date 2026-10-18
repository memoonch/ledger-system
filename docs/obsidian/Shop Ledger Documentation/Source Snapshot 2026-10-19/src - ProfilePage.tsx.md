---
title: "Source: src/ProfilePage.tsx"
type: "Reference"
project: "Shop Ledger"
updated: "2026-10-19"
generated_by: "shop-ledger-docs"
source_path: "src/ProfilePage.tsx"
sha256: "6879f89e90f616cab67b026fe23a558381da419340919f2a9f673028dfe7f2fe"
tags: [shop-ledger, development]
---

# Source snapshot: src/ProfilePage.tsx

- Captured: 2026-10-19T01:12:18+05:00 (Asia/Karachi).
- Repository source: `C:/Users/FROST/Documents/GitHub/ledger-system/src/ProfilePage.tsx`.
- SHA-256 of original file bytes: `6879f89e90f616cab67b026fe23a558381da419340919f2a9f673028dfe7f2fe`.
- Original bytes: 4272; source lines: 36.
- This is a reference snapshot. Edit the repository source to change the app. Displayed source uses normalized line endings.

## Exported symbols

`ProfilePage`.

## Complete source

```tsx
import { useState, type FormEvent } from 'react';
import { ArrowLeft, Building2, Check, ListPlus, UserRound } from 'lucide-react';
import { uniqueOptions, validateProfile, type ShopProfile } from './profile';
export default function ProfilePage({ profile, save, back }: { profile: ShopProfile; save: (profile: ShopProfile) => Promise<void>; back: () => void }) {
  const [busy, setBusy] = useState(false), [error, setError] = useState('');
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); const form = new FormData(e.currentTarget); setError('');
    try {
      const field = (key: string) => String(form.get(key) ?? '').trim();
      const next = validateProfile({
        name: field('name'), tagline: field('tagline'), owner: field('owner'), phone: field('phone'), email: field('email'), address: field('address'), statement_note: field('statement_note'),
        descriptions: uniqueOptions(field('descriptions').split('\n')), brands: uniqueOptions(field('brands').split('\n')), vehicles: uniqueOptions(field('vehicles').split('\n')),
      });
      setBusy(true); await save(next);
    } catch (error) { setError(error instanceof Error ? error.message : String(error)); } finally { setBusy(false); }
  }
  return <section className="profile-page no-print">
    <div className="page-heading"><div><div className="eyebrow">MAKE IT YOUR OWN</div><h1>Shop profile</h1><p>Your shop's identity, statement details, and reusable entry options.</p></div><button className="button secondary" disabled={busy} onClick={back}><ArrowLeft size={16}/>Back to ledgers</button></div>
    <form onSubmit={submit}>
      <section className="profile-card"><div className="profile-section-title"><Building2 size={21}/><div><h2>Shop identity</h2><p>Shown in the sidebar, PDFs, and printed statements.</p></div></div>
        <div className="form-grid"><label>Shop name<input name="name" required maxLength={80} defaultValue={profile.name}/></label><label>Tagline<input name="tagline" maxLength={120} defaultValue={profile.tagline}/></label></div>
      </section>
      <section className="profile-card"><div className="profile-section-title"><UserRound size={21}/><div><h2>Contact & statement details</h2><p>Add the details customers need when reading a statement.</p></div></div>
        <div className="form-grid"><label>Owner / contact person<input name="owner" maxLength={100} defaultValue={profile.owner}/></label><label>Shop phone<input name="phone" maxLength={60} defaultValue={profile.phone}/></label><label className="full">Email<input name="email" type="email" maxLength={120} defaultValue={profile.email}/></label><label className="full">Shop address<input name="address" maxLength={300} defaultValue={profile.address}/></label><label className="full">Statement footer message<input name="statement_note" maxLength={180} defaultValue={profile.statement_note}/></label></div>
      </section>
      <section className="profile-card"><div className="profile-section-title"><ListPlus size={21}/><div><h2>Saved entry options</h2><p>One option per line. You can always type a new value when entering a transaction.</p></div></div>
        <div className="form-grid suggestion-grid"><label>Descriptions<textarea aria-label="Descriptions" name="descriptions" rows={6} defaultValue={profile.descriptions.join('\n')} placeholder={'Sale\nCash Received'}/></label><label>Brand names<textarea aria-label="Brand names" name="brands" rows={6} defaultValue={profile.brands.join('\n')} placeholder={'Brand One\nBrand Two'}/></label><label>Vehicle numbers<textarea aria-label="Vehicle numbers" name="vehicles" rows={6} defaultValue={profile.vehicles.join('\n')} placeholder={'LEA-2045\nLHR-8812'}/></label></div>
        <p className="form-note">Descriptions, brands, vehicle numbers, and bill numbers from saved transactions also appear automatically, across all customers. Existing records keep their original text.</p>
      </section>
      {error && <p className="error" role="alert">{error}</p>}
      <div className="profile-save"><p>Saved locally on this computer. Included in your backups.</p><button className="button primary" disabled={busy}><Check size={17}/>{busy ? 'Saving…' : 'Save shop profile'}</button></div>
    </form>
  </section>;
}
```

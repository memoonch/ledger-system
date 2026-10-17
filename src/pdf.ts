import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { balanceText, dateText, ledger, money, type Party, type LedgerTransaction } from './domain';
import { defaultProfile, type ShopProfile } from './profile';
export function statementPdf(party: Party, transactions: LedgerTransaction[], from: string, to: string, profile: ShopProfile = defaultProfile) {
  const statement = ledger(party, transactions, from, to);
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
  doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(22, 77, 63);
  const shopLines = doc.splitTextToSize(profile.name, 270); doc.text(shopLines, 12, 17);
  let y = 17 + shopLines.length * 8;
  doc.setFontSize(10); doc.setFont('helvetica', 'normal'); doc.setTextColor(90);
  if (profile.tagline) { const lines = doc.splitTextToSize(profile.tagline, 270); doc.text(lines, 12, y); y += lines.length * 4.5; }
  const shopContact = [profile.owner, profile.phone, profile.email, profile.address].filter(Boolean).join(' | ');
  if (shopContact) { doc.setFontSize(8); const lines = doc.splitTextToSize(shopContact, 270); doc.text(lines, 12, y); y += lines.length * 3.5; }
  y += 7;
  doc.setTextColor(35); doc.setFontSize(13); const nameLines = doc.splitTextToSize(party.name, 160); doc.text(nameLines, 12, y);
  doc.setFontSize(9);
  const details = [party.phone, party.address].filter(Boolean).join(' | ');
  const detailsY = y + nameLines.length * 5 + 1; const detailLines = doc.splitTextToSize(details, 170); doc.text(detailLines, 12, detailsY);
  doc.text(`Period: ${from ? dateText(from) : 'Beginning'} to ${to ? dateText(to) : 'Latest entry'}`, 285, y, { align: 'right' });
  doc.text('All amounts in PKR | DR: customer owes | CR: customer advance', 285, y + 7, { align: 'right' });
  const body: string[][] = [];
  if (from) body.push([dateText(from), 'Balance brought forward', '', '', '', '', '', '', '', balanceText(statement.broughtForward)]);
  if (statement.openingInPeriod) body.push([dateText(party.opening_date), 'Opening balance', '', '', '', '', '', '', '', balanceText(party.opening_paisa)]);
  for (const tx of statement.rows) body.push([
    dateText(tx.date), tx.description, tx.brand, tx.vehicle_number, tx.bill_number,
    tx.quantity_milli ? (tx.quantity_milli / 1000).toLocaleString('en-PK', { maximumFractionDigits: 3 }) : '-',
    tx.rate_paisa ? money(tx.rate_paisa) : '-', tx.debit_paisa ? money(tx.debit_paisa) : '-',
    tx.credit_paisa ? money(tx.credit_paisa) : '-', balanceText(tx.balance),
  ]);
  autoTable(doc, {
    startY: Math.max(y + 16, detailsY + detailLines.length * 4 + 6), margin: { left: 12, right: 12, bottom: 23, top: 15 },
    head: [['Date', 'Description', 'Brand', 'Vehicle no.', 'Bill no.', 'Quantity', 'Rate', 'Debit (DR)', 'Credit (CR)', 'Balance']],
    body, foot: [[{ content: 'Period totals / Closing balance', colSpan: 7, styles: { halign: 'left' } }, money(statement.debit), money(statement.credit), balanceText(statement.closing)]],
    showFoot: 'lastPage', footStyles: { fillColor: [231, 240, 234], textColor: [45, 52, 48], fontStyle: 'bold', halign: 'right' },
    theme: 'grid', styles: { fontSize: 8, cellPadding: 2.5, lineColor: [222, 228, 224], textColor: [45, 52, 48], overflow: 'linebreak' },
    headStyles: { fillColor: [22, 77, 63], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 249, 247] },
    columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 45 }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' }, 9: { halign: 'right', cellWidth: 32 } },
    didParseCell: data => {
      if (data.section === 'head') return;
      const text = data.cell.text.join(' ');
      if (data.column.index === 9) {
        if (text.endsWith(' DR')) data.cell.styles.textColor = [185, 57, 57];
        else if (text.endsWith(' CR')) data.cell.styles.textColor = [32, 128, 78];
      } else if (data.column.index === 7 && text !== '-' && text !== '' && text !== '0') data.cell.styles.textColor = [185, 57, 57];
      else if (data.column.index === 8 && text !== '-' && text !== '' && text !== '0') data.cell.styles.textColor = [32, 128, 78];
    },
  });
  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) {
    doc.setPage(page); doc.setFontSize(8); doc.setTextColor(110);
    if (profile.statement_note) doc.text(doc.splitTextToSize(profile.statement_note, 270), 12, 194);
    doc.text(profile.name + ' | Customer ledger', 12, 205);
    doc.text(`Page ${page} of ${count}`, 285, 205, { align: 'right' });
  }
  return doc;
}


import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import { balanceText, dateText, ledger, money, type Party, type LedgerTransaction, type SupplierTransaction, type Supplier } from './domain';
import { defaultProfile, type ShopProfile } from './profile';
export function statementPdf(party: Party, transactions: LedgerTransaction[], from: string, to: string, profile: ShopProfile = defaultProfile, supplier = false) {
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
  const details = [supplier ? (party as Party & Partial<Supplier>).contact_person : '', party.phone, party.address].filter(Boolean).join(' | ');
  const detailsY = y + nameLines.length * 5 + 1; const detailLines = doc.splitTextToSize(details, 170); doc.text(detailLines, 12, detailsY);
  doc.text(`Period: ${from ? dateText(from) : 'Beginning'} to ${to ? dateText(to) : 'Latest entry'}`, 285, y, { align: 'right' });
  doc.text(supplier ? 'Supplier ledger | CR: you owe supplier | DR: your advance | PKR' : 'All amounts in PKR | DR: customer owes | CR: customer advance', 285, y + 7, { align: 'right' });
  const body: string[][] = [];
  if (from) body.push([dateText(from), 'Balance brought forward', '', '', '', '', '', '', '', balanceText(statement.broughtForward)]);
  if (statement.openingInPeriod) body.push([dateText(party.opening_date), 'Opening balance', '', '', '', '', '', '', '', balanceText(party.opening_paisa)]);
  for (const tx of statement.rows) body.push([
    dateText(tx.date), supplier ? [tx.description,(tx as LedgerTransaction & Partial<SupplierTransaction>).payment_method,(tx as LedgerTransaction & Partial<SupplierTransaction>).reference].filter(Boolean).join(' | ') : tx.description, tx.brand, tx.vehicle_number, tx.bill_number,
    tx.quantity_milli ? (tx.quantity_milli / 1000).toLocaleString('en-PK', { maximumFractionDigits: 3 }) + (supplier ? ' ' + ((tx as LedgerTransaction & Partial<SupplierTransaction>).unit || '') : '') : '-',
    tx.rate_paisa ? money(tx.rate_paisa) : '-', tx.debit_paisa ? money(tx.debit_paisa) : '-',
    tx.credit_paisa ? money(tx.credit_paisa) : '-', balanceText(tx.balance),
  ]);
  autoTable(doc, {
    startY: Math.max(y + 16, detailsY + detailLines.length * 4 + 6), margin: { left: 12, right: 12, bottom: 23, top: 15 },
    head: [['Date', 'Description', 'Brand', 'Vehicle no.', 'Bill no.', 'Quantity', 'Rate', 'Debit (DR)', 'Credit (CR)', 'Balance']],
    body,
    theme: 'grid', styles: { fontSize: 8, cellPadding: 2.5, lineColor: [222, 228, 224], textColor: [45, 52, 48], overflow: 'linebreak' },
    headStyles: { fillColor: [22, 77, 63], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 249, 247] },
    columnStyles: { 0: { cellWidth: 24 }, 1: { cellWidth: 45 }, 5: { halign: 'center' }, 6: { halign: 'center' }, 7: { halign: 'center' }, 8: { halign: 'center' }, 9: { halign: 'center', cellWidth: 32 } },
    didParseCell: data => {
      // Apply to headers, entries, opening balances and numeric totals alike.
      if (data.column.index >= 5) data.cell.styles.halign = 'center';
      if (data.section === 'head') return;
      const text = data.cell.text.join(' ');
      if (data.column.index === 9) {
        if (text.endsWith(supplier ? ' CR' : ' DR')) data.cell.styles.textColor = [185, 57, 57];
        else if (text.endsWith(supplier ? ' DR' : ' CR')) data.cell.styles.textColor = [32, 128, 78];
      } else if (data.column.index === 7 && text !== '-' && text !== '' && text !== '0') data.cell.styles.textColor = supplier ? [32,128,78] : [185, 57, 57];
      else if (data.column.index === 8 && text !== '-' && text !== '' && text !== '0') data.cell.styles.textColor = supplier ? [185,57,57] : [32, 128, 78];
    },
  });
  const table = (doc as jsPDF & { lastAutoTable: { finalY: number; head: { cells: Record<number, { x: number }> }[] } }).lastAutoTable;
  const summaryLeft = table.head[0].cells[7].x, summaryWidth = 285 - summaryLeft;
  const red: [number, number, number] = [185, 57, 57], green: [number, number, number] = [32, 128, 78];
  const balanceColor = statement.closing === 0 ? [45, 52, 48] as [number, number, number] : (supplier ? statement.closing < 0 : statement.closing > 0) ? red : green;
  autoTable(doc, {
    startY: table.finalY + 4, margin: { left: summaryLeft, right: 12, top: 15, bottom: 23 },
    pageBreak: 'avoid', theme: 'plain', tableWidth: summaryWidth, tableLineColor: [22, 77, 63], tableLineWidth: 0.3,
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.2, minCellHeight: 8, textColor: [45, 52, 48], lineWidth: 0, valign: 'middle' },
    columnStyles: { 0: { cellWidth: summaryWidth * 0.40, fontStyle: 'bold' }, 1: { cellWidth: summaryWidth * 0.07, halign: 'center', cellPadding: 0 }, 2: { cellWidth: summaryWidth * 0.34, halign: 'right' }, 3: { cellWidth: summaryWidth * 0.19, halign: 'center', cellPadding: 1 } },
    body: [
      ['Total Debit', 'Rs', money(statement.debit), ''],
      ['Total Credit', 'Rs', money(statement.credit), ''],
      ['Current Balance', 'Rs', money(Math.abs(statement.closing)), statement.closing > 0 ? 'Debit' : statement.closing < 0 ? 'Credit' : 'Settled'],
    ],
    didParseCell: data => {
      if (data.row.index === 2) {
        data.cell.styles.fillColor = [231, 240, 234]; data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fontSize = data.column.index === 3 ? 9 : 10; data.cell.styles.minCellHeight = 13;
        data.cell.styles.textColor = data.column.index === 0 ? [22, 77, 63] : balanceColor;
      } else if (data.column.index > 0) data.cell.styles.textColor = data.row.index === 0 ? (supplier ? green : red) : (supplier ? red : green);
    },
  });
  const count = doc.getNumberOfPages();
  for (let page = 1; page <= count; page++) {
    doc.setPage(page); doc.setFontSize(8); doc.setTextColor(110);
    if (profile.statement_note) doc.text(doc.splitTextToSize(profile.statement_note, 270), 12, 194);
    doc.text(profile.name + (supplier ? ' | Supplier ledger' : ' | Customer ledger'), 12, 205);
    doc.text(`Page ${page} of ${count}`, 285, 205, { align: 'right' });
  }
  return doc;
}


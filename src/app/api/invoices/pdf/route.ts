import { NextResponse } from 'next/server';

// Generate professional invoice HTML for PDF printing
export async function POST(request: Request) {
  try {
    const { invoice, client, settings } = await request.json();

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice data required' }, { status: 400 });
    }

    const company = settings || {
      company_name: 'Vassweb s. r. o.',
      company_email: 'info@vassweb.com',
      company_phone: '+421 918 668 728',
      company_address: 'Bratislava, Slovenská republika',
      company_ico: '56921021',
      company_dic: '2122501524',
      company_ic_dph: 'SK2122501524',
      company_iban: 'SK11 0900 0000 0052 3252 7162',
    };

    const items = invoice.items || [];
    const subtotal = items.reduce((s: number, it: { qty: number; price: number }) => s + it.qty * it.price, 0);
    const dph = Math.round(subtotal * 0.2 * 100) / 100;
    const total = subtotal + dph;

    const statusLabel: Record<string, string> = {
      draft: 'Koncept', sent: 'Odoslaná', paid: 'Zaplatená', overdue: 'Po splatnosti',
    };

    // QR code for SK payment (simple text-based, real QR would need a library)
    const qrData = `SPD*1.0*ACC:${company.company_iban?.replace(/\s/g, '')}*AM:${total.toFixed(2)}*CC:EUR*MSG:${invoice.number}*X-VS:${invoice.number?.replace(/\D/g, '')}`;

    const html = `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Faktúra ${invoice.number}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', system-ui, sans-serif;
    color: #1a1a1a;
    background: #fff;
    font-size: 13px;
    line-height: 1.5;
  }

  .page {
    max-width: 800px;
    margin: 0 auto;
    padding: 48px;
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 24px;
    border-bottom: 3px solid #d4a843;
  }

  .logo {
    font-size: 28px;
    font-weight: 700;
    color: #d4a843;
    letter-spacing: 0.05em;
  }

  .logo small {
    display: block;
    font-size: 11px;
    font-weight: 400;
    color: #999;
    letter-spacing: 0.08em;
    margin-top: 2px;
  }

  .invoice-badge {
    text-align: right;
  }

  .invoice-badge h1 {
    font-size: 24px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 0.02em;
  }

  .invoice-badge .number {
    font-size: 14px;
    color: #d4a843;
    font-weight: 600;
    margin-top: 2px;
  }

  .invoice-badge .status {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 6px;
  }

  .status-paid { background: #e8f5e9; color: #2e7d32; }
  .status-sent { background: #e3f2fd; color: #1565c0; }
  .status-draft { background: #f5f5f5; color: #757575; }
  .status-overdue { background: #ffebee; color: #c62828; }

  /* Parties */
  .parties {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 32px;
  }

  .party-label {
    font-size: 10px;
    font-weight: 600;
    color: #d4a843;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .party-name {
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 4px;
  }

  .party-detail {
    font-size: 12px;
    color: #666;
    line-height: 1.7;
  }

  /* Dates */
  .dates {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
    padding: 16px;
    background: #faf8f3;
    border-radius: 8px;
    border: 1px solid #f0ead6;
  }

  .date-item label {
    font-size: 10px;
    font-weight: 600;
    color: #999;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    display: block;
    margin-bottom: 4px;
  }

  .date-item span {
    font-size: 13px;
    font-weight: 500;
  }

  /* Items table */
  .items-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
  }

  .items-table thead th {
    text-align: left;
    padding: 10px 12px;
    font-size: 10px;
    font-weight: 600;
    color: #fff;
    background: #1a1a1a;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .items-table thead th:last-child,
  .items-table thead th:nth-child(2),
  .items-table thead th:nth-child(3) {
    text-align: right;
  }

  .items-table tbody td {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 13px;
  }

  .items-table tbody td:last-child,
  .items-table tbody td:nth-child(2),
  .items-table tbody td:nth-child(3) {
    text-align: right;
    white-space: nowrap;
  }

  .items-table tbody tr:nth-child(even) {
    background: #fafafa;
  }

  /* Totals */
  .totals {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 32px;
  }

  .totals-box {
    width: 280px;
  }

  .total-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    font-size: 13px;
    border-bottom: 1px solid #f0f0f0;
  }

  .total-row.grand {
    border-top: 2px solid #d4a843;
    border-bottom: none;
    padding-top: 12px;
    margin-top: 4px;
  }

  .total-row.grand .label {
    font-size: 15px;
    font-weight: 700;
  }

  .total-row.grand .value {
    font-size: 22px;
    font-weight: 700;
    color: #d4a843;
  }

  /* Payment info */
  .payment {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    padding: 24px;
    background: #1a1a1a;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 32px;
  }

  .payment h3 {
    font-size: 12px;
    font-weight: 600;
    color: #d4a843;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .payment-detail {
    font-size: 12px;
    color: rgba(255,255,255,0.6);
    line-height: 1.8;
  }

  .payment-detail strong {
    color: #fff;
    font-weight: 500;
  }

  .iban {
    font-family: monospace;
    font-size: 14px;
    color: #d4a843;
    font-weight: 600;
    letter-spacing: 0.05em;
  }

  /* QR placeholder */
  .qr-section {
    text-align: center;
  }

  .qr-placeholder {
    width: 100px;
    height: 100px;
    background: #fff;
    border-radius: 8px;
    margin: 0 auto 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    color: #999;
    border: 1px solid #333;
  }

  .qr-label {
    font-size: 10px;
    color: rgba(255,255,255,0.4);
  }

  /* Notes */
  .notes {
    padding: 16px;
    background: #faf8f3;
    border-radius: 8px;
    border-left: 3px solid #d4a843;
    margin-bottom: 32px;
    font-size: 12px;
    color: #666;
  }

  .notes h4 {
    font-size: 11px;
    font-weight: 600;
    color: #d4a843;
    margin-bottom: 6px;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  /* Footer */
  .footer {
    text-align: center;
    padding-top: 24px;
    border-top: 1px solid #f0f0f0;
    font-size: 11px;
    color: #999;
  }

  .footer a { color: #d4a843; text-decoration: none; }

  @media print {
    body { padding: 0; }
    .page { padding: 20px; max-width: none; }
    @page { margin: 15mm; size: A4; }
    .no-print { display: none !important; }
  }

  .print-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #1a1a1a;
    padding: 12px 24px;
    display: flex;
    justify-content: center;
    gap: 12px;
    z-index: 100;
  }

  .print-btn {
    padding: 8px 24px;
    border: none;
    border-radius: 6px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
  }

  .print-btn.primary {
    background: #d4a843;
    color: #1a1a1a;
  }

  .print-btn.secondary {
    background: transparent;
    color: #d4a843;
    border: 1px solid #d4a843;
  }
</style>
</head>
<body>
  <div class="print-bar no-print" style="padding-top:12px;">
    <button class="print-btn primary" onclick="window.print()">🖨 Tlačiť / Uložiť PDF</button>
    <button class="print-btn secondary" onclick="window.close()">Zavrieť</button>
  </div>

  <div class="page" style="margin-top:60px;">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo">V&Co.<small>${company.company_name || 'Vassweb s. r. o.'}</small></div>
      </div>
      <div class="invoice-badge">
        <h1>FAKTÚRA</h1>
        <div class="number">${invoice.number || '—'}</div>
        <div class="status status-${invoice.status || 'draft'}">${statusLabel[invoice.status] || invoice.status || 'Koncept'}</div>
      </div>
    </div>

    <!-- Parties -->
    <div class="parties">
      <div>
        <div class="party-label">Dodávateľ</div>
        <div class="party-name">${company.company_name || 'Vassweb s. r. o.'}</div>
        <div class="party-detail">
          ${company.company_address || 'Bratislava'}<br>
          IČO: ${company.company_ico || '56921021'}<br>
          DIČ: ${company.company_dic || '2122501524'}<br>
          IČ DPH: ${company.company_ic_dph || 'SK2122501524'}<br>
          ${company.company_email || 'info@vassweb.com'}<br>
          ${company.company_phone || '+421 918 668 728'}
        </div>
      </div>
      <div>
        <div class="party-label">Odberateľ</div>
        <div class="party-name">${client?.company || client?.name || '—'}</div>
        <div class="party-detail">
          ${client?.name || ''}<br>
          ${client?.email || ''}<br>
          ${client?.phone || ''}
        </div>
      </div>
    </div>

    <!-- Dates -->
    <div class="dates">
      <div class="date-item">
        <label>Dátum vystavenia</label>
        <span>${invoice.issued || '—'}</span>
      </div>
      <div class="date-item">
        <label>Dátum splatnosti</label>
        <span>${invoice.due || '—'}</span>
      </div>
      <div class="date-item">
        <label>Forma úhrady</label>
        <span>Bankový prevod</span>
      </div>
      <div class="date-item">
        <label>Variabilný symbol</label>
        <span>${invoice.number?.replace(/\D/g, '') || '—'}</span>
      </div>
    </div>

    <!-- Items -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Popis</th>
          <th>Množstvo</th>
          <th>Jedn. cena</th>
          <th>Spolu</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it: { desc: string; qty: number; price: number }) => `
          <tr>
            <td>${it.desc || '—'}</td>
            <td>${it.qty || 1}</td>
            <td>${(it.price || 0).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
            <td>${((it.qty || 1) * (it.price || 0)).toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- Totals -->
    <div class="totals">
      <div class="totals-box">
        <div class="total-row">
          <span class="label">Základ DPH</span>
          <span class="value">${subtotal.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div class="total-row">
          <span class="label">DPH 20%</span>
          <span class="value">${dph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div class="total-row grand">
          <span class="label">CELKOM K ÚHRADE</span>
          <span class="value">${total.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
      </div>
    </div>

    <!-- Payment -->
    <div class="payment">
      <div>
        <h3>Platobné údaje</h3>
        <div class="payment-detail">
          <strong>Banka:</strong> Slovenská sporiteľňa<br>
          <strong>IBAN:</strong> <span class="iban">${company.company_iban || 'SK11 0900 0000 0052 3252 7162'}</span><br>
          <strong>SWIFT:</strong> GIBASKBX<br>
          <strong>VS:</strong> ${invoice.number?.replace(/\D/g, '') || '—'}
        </div>
      </div>
      <div class="qr-section">
        <h3>QR platba</h3>
        <div class="qr-placeholder">
          <img src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(qrData)}" width="100" height="100" alt="QR" style="border-radius:4px;" />
        </div>
        <div class="qr-label">Naskenujte pre platbu</div>
      </div>
    </div>

    ${invoice.notes ? `
    <div class="notes">
      <h4>Poznámky</h4>
      ${invoice.notes}
    </div>` : ''}

    <!-- Footer -->
    <div class="footer">
      ${company.company_name || 'Vassweb s. r. o.'} | IČO: ${company.company_ico || '56921021'} |
      DIČ: ${company.company_dic || '2122501524'} |
      <a href="https://vassweb.com">vassweb.com</a>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Invoice PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate invoice' }, { status: 500 });
  }
}

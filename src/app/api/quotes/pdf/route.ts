import { NextResponse } from 'next/server';

// Generate professional quote/proposal HTML for PDF printing
export async function POST(request: Request) {
  try {
    const { quote, client, settings } = await request.json();

    if (!quote) {
      return NextResponse.json({ error: 'Quote data required' }, { status: 400 });
    }

    const company = settings || {
      company_name: 'VVD s. r. o.',
      company_email: 'info@vassweb.sk',
      company_phone: '+421 918 668 728',
      company_address: 'Bratislava, Slovenská republika',
      company_ico: '56921021',
      company_dic: '2122501524',
      company_ic_dph: 'SK2122501524',
    };

    const items = quote.items || [];
    const subtotal = items.reduce((s: number, it: { qty: number; price: number }) => s + it.qty * it.price, 0);
    const dph = Math.round(subtotal * 0.2 * 100) / 100;
    const total = subtotal + dph;

    const statusLabel: Record<string, string> = {
      draft: 'Koncept', sent: 'Odoslaná', accepted: 'Prijatá', rejected: 'Odmietnutá', invoiced: 'Fakturovaná',
    };

    const statusColor: Record<string, string> = {
      draft: '#757575', sent: '#1565c0', accepted: '#2e7d32', rejected: '#c62828', invoiced: '#6a1b9a',
    };

    const statusBg: Record<string, string> = {
      draft: '#f5f5f5', sent: '#e3f2fd', accepted: '#e8f5e9', rejected: '#ffebee', invoiced: '#f3e5f5',
    };

    const validDate = quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('sk-SK') : '—';
    const createdDate = quote.created_at ? new Date(quote.created_at).toLocaleDateString('sk-SK') : new Date().toLocaleDateString('sk-SK');

    const html = `<!DOCTYPE html>
<html lang="sk">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Cenová ponuka ${quote.number}</title>
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

  .quote-badge {
    text-align: right;
  }

  .quote-badge h1 {
    font-size: 22px;
    font-weight: 700;
    color: #1a1a1a;
    letter-spacing: 0.02em;
  }

  .quote-badge .number {
    font-size: 14px;
    color: #d4a843;
    font-weight: 600;
    margin-top: 2px;
  }

  .quote-badge .status {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-top: 6px;
    background: ${statusBg[quote.status] || '#f5f5f5'};
    color: ${statusColor[quote.status] || '#757575'};
  }

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
    grid-template-columns: repeat(3, 1fr);
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

  /* Intro message */
  .intro {
    padding: 20px;
    background: #faf8f3;
    border-radius: 8px;
    border-left: 3px solid #d4a843;
    margin-bottom: 28px;
    font-size: 13px;
    color: #444;
    line-height: 1.7;
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

  /* Terms */
  .terms {
    margin-bottom: 32px;
  }

  .terms h3 {
    font-size: 12px;
    font-weight: 600;
    color: #d4a843;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }

  .terms ul {
    list-style: none;
    padding: 0;
  }

  .terms ul li {
    padding: 6px 0;
    font-size: 12px;
    color: #666;
    border-bottom: 1px solid #f5f5f5;
    padding-left: 16px;
    position: relative;
  }

  .terms ul li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: #d4a843;
    font-weight: 600;
  }

  /* CTA */
  .cta {
    text-align: center;
    padding: 28px;
    background: #1a1a1a;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 32px;
  }

  .cta h3 {
    font-size: 16px;
    font-weight: 600;
    color: #d4a843;
    margin-bottom: 8px;
  }

  .cta p {
    font-size: 13px;
    color: rgba(255,255,255,0.6);
    margin-bottom: 16px;
  }

  .cta .accept-info {
    display: inline-block;
    padding: 10px 28px;
    background: #d4a843;
    color: #1a1a1a;
    border-radius: 6px;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 0.02em;
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

  /* Signature */
  .signature {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    margin-bottom: 32px;
    padding-top: 16px;
  }

  .sig-box {
    border-top: 1px solid #ddd;
    padding-top: 12px;
    text-align: center;
  }

  .sig-box .sig-label {
    font-size: 10px;
    color: #999;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 40px;
  }

  .sig-box .sig-line {
    border-top: 1px solid #999;
    margin-top: 40px;
    padding-top: 8px;
    font-size: 11px;
    color: #666;
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
  <div class="print-bar no-print">
    <button class="print-btn primary" onclick="window.print()">🖨 Tlačiť / Uložiť PDF</button>
    <button class="print-btn secondary" onclick="window.close()">Zavrieť</button>
  </div>

  <div class="page" style="margin-top:60px;">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="logo">V&Co.<small>${company.company_name || 'VVD s. r. o.'}</small></div>
      </div>
      <div class="quote-badge">
        <h1>CENOVÁ PONUKA</h1>
        <div class="number">${quote.number || '—'}</div>
        <div class="status">${statusLabel[quote.status] || quote.status || 'Koncept'}</div>
      </div>
    </div>

    <!-- Parties -->
    <div class="parties">
      <div>
        <div class="party-label">Dodávateľ</div>
        <div class="party-name">${company.company_name || 'VVD s. r. o.'}</div>
        <div class="party-detail">
          ${company.company_address || 'Bratislava'}<br>
          IČO: ${company.company_ico || '56921021'}<br>
          DIČ: ${company.company_dic || '2122501524'}<br>
          ${company.company_email || 'info@vassweb.sk'}<br>
          ${company.company_phone || '+421 918 668 728'}
        </div>
      </div>
      <div>
        <div class="party-label">Pre klienta</div>
        <div class="party-name">${client?.company || client?.name || '—'}</div>
        <div class="party-detail">
          ${client?.name ? `Kontakt: ${client.name}<br>` : ''}
          ${client?.email ? `${client.email}<br>` : ''}
          ${client?.phone || ''}
        </div>
      </div>
    </div>

    <!-- Dates -->
    <div class="dates">
      <div class="date-item">
        <label>Dátum vystavenia</label>
        <span>${createdDate}</span>
      </div>
      <div class="date-item">
        <label>Platná do</label>
        <span>${validDate}</span>
      </div>
      <div class="date-item">
        <label>Číslo ponuky</label>
        <span>${quote.number || '—'}</span>
      </div>
    </div>

    <!-- Intro -->
    <div class="intro">
      Vážený/á ${client?.name || 'klient'},<br><br>
      ďakujeme za Váš záujem o naše služby. Na základe nášho rozhovoru Vám predkladáme nasledujúcu cenovú ponuku. V prípade otázok nás neváhajte kontaktovať.
    </div>

    <!-- Items -->
    <table class="items-table">
      <thead>
        <tr>
          <th>Služba / Položka</th>
          <th>Množstvo</th>
          <th>Jedn. cena</th>
          <th>Spolu</th>
        </tr>
      </thead>
      <tbody>
        ${items.map((it: { desc: string; qty: number; price: number }, idx: number) => `
          <tr>
            <td><strong>${idx + 1}.</strong> ${it.desc || '—'}</td>
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
          <span class="label">Základ</span>
          <span class="value">${subtotal.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div class="total-row">
          <span class="label">DPH 20%</span>
          <span class="value">${dph.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
        <div class="total-row grand">
          <span class="label">CELKOVÁ CENA</span>
          <span class="value">${total.toLocaleString('sk-SK', { minimumFractionDigits: 2 })} €</span>
        </div>
      </div>
    </div>

    <!-- Terms -->
    <div class="terms">
      <h3>Podmienky spolupráce</h3>
      <ul>
        <li>Cena je vrátane DPH 20%</li>
        <li>Platba: 40% záloha pred začatím, 60% po odovzdaní</li>
        <li>Predpokladaný čas realizácie: 4–6 týždňov od schválenia</li>
        <li>Ponuka je platná do ${validDate}</li>
        <li>Cena zahŕňa 2 kolá revízií, ďalšie sa účtujú hodinovou sadzbou</li>
        <li>Po dokončení poskytujeme 30 dní bezplatný support</li>
      </ul>
    </div>

    <!-- CTA -->
    <div class="cta">
      <h3>Máte záujem? Poďme do toho!</h3>
      <p>Stačí odpovedať na tento email alebo zavolať — dohodneme sa na ďalšom postupe.</p>
      <div class="accept-info">📧 ${company.company_email || 'info@vassweb.sk'} &nbsp;|&nbsp; 📞 ${company.company_phone || '+421 918 668 728'}</div>
    </div>

    ${quote.notes ? `
    <div class="notes">
      <h4>Poznámky</h4>
      ${quote.notes}
    </div>` : ''}

    <!-- Signature -->
    <div class="signature">
      <div class="sig-box">
        <div class="sig-label">Za dodávateľa</div>
        <div class="sig-line">${company.company_name || 'VVD s. r. o.'}</div>
      </div>
      <div class="sig-box">
        <div class="sig-label">Za odberateľa</div>
        <div class="sig-line">${client?.company || client?.name || '—'}</div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer">
      ${company.company_name || 'VVD s. r. o.'} | IČO: ${company.company_ico || '56921021'} |
      DIČ: ${company.company_dic || '2122501524'} |
      <a href="https://vassweb.sk">vassweb.sk</a>
    </div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    });
  } catch (error) {
    console.error('Quote PDF error:', error);
    return NextResponse.json({ error: 'Failed to generate quote' }, { status: 500 });
  }
}

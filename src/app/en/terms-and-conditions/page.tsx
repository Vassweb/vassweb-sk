import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and conditions of Vassweb for digital services.',
};

export default function TermsAndConditions() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Terms &amp; Conditions
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Last updated: March 15, 2026
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. General Provisions</h2>
          <p style={paragraph}>
            These terms and conditions govern the relationship between Vassweb (hereinafter &quot;provider&quot;)
            and the client (hereinafter &quot;client&quot;) in the provision of digital services including
            website development, automation, and AI solutions.
          </p>
          <p style={paragraph}>
            Provider contact details: email{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>, phone{' '}
            <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Order and Contract Conclusion</h2>
          <p style={paragraph}>
            A contractual relationship is established based on a written order (including email),
            a signed contract for work, or acceptance of a price quotation by the client.
            The price quotation is valid for 30 days from the date of issue, unless stated otherwise.
          </p>
          <p style={paragraph}>
            Each project begins with a free initial consultation during which requirements,
            scope of work, and preliminary timeline are defined.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Price and Payment Terms</h2>
          <p style={paragraph}>
            Service prices are listed in the price list on the website or in an individual price quotation.
            All prices are listed without VAT, unless stated otherwise.
          </p>
          <p style={paragraph}>
            Standard payment terms: 50% advance payment before work begins, 50% upon delivery.
            For larger projects, a different payment schedule may be agreed upon.
            Invoice due date is 14 days from the date of issue.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Implementation and Delivery</h2>
          <p style={paragraph}>
            The delivery deadline is agreed individually for each project. The provider undertakes
            to inform the client about the progress of work and any changes to the schedule.
          </p>
          <p style={paragraph}>
            The client is obliged to provide the necessary cooperation — especially materials, access,
            and feedback within agreed deadlines. Delays on the client&apos;s side may affect the delivery date.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Copyright</h2>
          <p style={paragraph}>
            Upon full payment, all property rights to the work are transferred to the client
            to the extent agreed in the contract. The provider reserves the right to include
            the project in their portfolio, unless agreed otherwise.
          </p>
          <p style={paragraph}>
            The client is responsible for ensuring that provided materials (texts, images, logos)
            do not infringe the rights of third parties.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Warranty</h2>
          <p style={paragraph}>
            We provide a 3-month warranty on delivered work from the date of handover.
            During the warranty period, we will fix bugs that arose on the provider&apos;s side free of charge.
            The warranty does not cover modifications made by the client or third parties.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Contract Termination</h2>
          <p style={paragraph}>
            The client may terminate the contract at any time by written notice. In such case,
            the client is obliged to pay for work performed up to the moment of termination.
            The provider may terminate the contract if the client fails to provide necessary
            cooperation even after repeated requests.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Liability</h2>
          <p style={paragraph}>
            The provider is not liable for damages caused by improper use of the work,
            interference by third parties, outages of third-party services (hosting, domain registrar),
            or force majeure. The provider&apos;s total liability is limited to the amount paid for the work.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Final Provisions</h2>
          <p style={paragraph}>
            These terms and conditions are governed by the laws of the Slovak Republic.
            Any disputes shall be resolved primarily by agreement between the parties.
            The provider reserves the right to modify these terms, and will inform clients
            of changes through the website.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a href="/en" style={{ color: '#d4a843', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'opacity 0.3s' }}>
            ← Back to homepage
          </a>
        </div>
      </div>
    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading), Playfair Display, serif',
  fontSize: '22px', fontWeight: 600, color: '#ffeebb', marginBottom: '16px', marginTop: 0,
};

const paragraph: React.CSSProperties = {
  fontSize: '15px', color: 'rgba(232, 224, 208, 0.8)', marginBottom: '12px', lineHeight: '1.8',
};

const linkStyle: React.CSSProperties = {
  color: '#d4a843', textDecoration: 'underline', textUnderlineOffset: '3px',
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy of Vassweb for personal data protection.',
};

export default function PrivacyPolicy() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Last updated: April 24, 2026
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Who We Are — Data Controller Identification</h2>
          <p style={paragraph}>
            The data controller within the meaning of Art. 4(7) GDPR is{' '}
            <strong style={{ color: '#e8e0d0' }}>Vassweb s. r. o.</strong>, operating under the Vassweb brand
            (hereinafter &quot;we&quot; or &quot;operator&quot;).
          </p>
          <div
            style={{
              background: 'rgba(212, 168, 67, 0.05)',
              border: '1px solid rgba(212, 168, 67, 0.15)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
            }}
          >
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Company name:</strong> Vassweb s. r. o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Registered office:</strong> Školská 981/36, 931 01 Šamorín, Slovakia</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Reg. No.:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Tax ID:</strong> 2122501524 · <strong style={{ color: '#d4a843' }}>VAT ID:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Registration:</strong> Commercial Register of the District Court Trnava, Section: Sro, File No. 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Managing Director:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Email:</strong>{' '}
              <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Phone:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            We take your privacy seriously. This page describes what data we collect, why we collect it,
            and what rights you have regarding its processing under Regulation (EU) 2016/679 (GDPR).
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. What Data We Collect</h2>
          <h3 style={subTitle}>a) Contact Form</h3>
          <p style={paragraph}>
            When you send us a message through the contact form, we collect your name, email address,
            and message text. We use this data exclusively to respond to your inquiry.
            We do not send any marketing emails and we do not share your data with third parties.
          </p>
          <h3 style={subTitle}>b) Analytical Cookies (Google Analytics 4)</h3>
          <p style={paragraph}>
            We use Google Analytics 4 (operated by Google Ireland Limited) to analyze website traffic.
            This service collects anonymized data about how visitors use our website — for example,
            which pages they visited, how long they stayed, and what device they used.
          </p>
          <p style={paragraph}>
            <strong style={{ color: '#d4a843' }}>Important:</strong> Google Analytics is only activated
            if you explicitly consent via the cookie banner. If you decline cookies, no analytical data is collected.
          </p>
          <h3 style={subTitle}>c) Technical Data</h3>
          <p style={paragraph}>
            Our server (Vercel) automatically records basic technical data such as IP address,
            browser type, and access time. This data is used solely to ensure the website functions
            properly and to protect against misuse.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Purpose and Legal Basis</h2>
          <p style={paragraph}>We process your data based on the following legal grounds:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Legitimate Interest</strong> (Art. 6(1)(f) GDPR) —
              processing contact form data to respond to your message and technical data to ensure website operation.
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Consent</strong> (Art. 6(1)(a) GDPR) —
              analytical cookies (Google Analytics) are activated only with your explicit consent,
              which you can withdraw at any time.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Sharing Data with Third Parties</h2>
          <p style={paragraph}>
            We do not share your personal data with any third parties for marketing purposes.
            Data may be processed by the following service providers acting as our processors:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Vercel Inc.</strong> — website hosting (USA, protected by standard contractual clauses)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Google Ireland Limited</strong> — traffic analytics (only with consent)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Resend Inc.</strong> — delivery of emails from the contact form</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Data Retention Period</h2>
          <p style={paragraph}>
            Contact form data is retained for the period necessary to handle your request,
            up to a maximum of 12 months. Analytics data in Google Analytics is retained for 14 months
            (GA4 default setting) and is then automatically deleted.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Your Rights</h2>
          <p style={paragraph}>Under GDPR, you have the following rights:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right of Access</strong> — you have the right to know what data we process about you</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Rectification</strong> — you can request correction of inaccurate data</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Erasure</strong> — you can request deletion of your data</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Restriction</strong> — you can request restriction of processing</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Portability</strong> — you can request export of your data</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Withdraw Consent</strong> — you can withdraw cookie consent at any time by clearing cookies in your browser</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Right to Lodge a Complaint</strong> — you have the right to file a complaint with the Office for Personal Data Protection of the SR (<a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>dataprotection.gov.sk</a>)</p>
          </div>
          <p style={paragraph}>
            To exercise any of your rights, contact us at{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Cookies</h2>
          <p style={paragraph}>
            Our website uses only analytical cookies (Google Analytics), exclusively based on your consent.
            We do not use any advertising, tracking, or third-party cookies for marketing purposes.
          </p>
          <div style={{ background: 'rgba(212, 168, 67, 0.05)', border: '1px solid rgba(212, 168, 67, 0.15)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
            <p style={{ ...paragraph, marginBottom: '8px' }}>
              <strong style={{ color: '#d4a843' }}>_ga, _ga_*</strong> — Google Analytics cookies
            </p>
            <p style={{ ...paragraph, color: 'rgba(232, 224, 208, 0.6)', fontSize: '14px', marginBottom: 0 }}>
              Purpose: Measuring traffic and behavior on the website · Duration: 14 months ·
              Type: Analytical · Activation: Only with consent
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Changes to This Policy</h2>
          <p style={paragraph}>
            We may update this policy from time to time. We will inform you of significant changes
            through a notice on our website. We recommend checking this policy regularly.
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

const subTitle: React.CSSProperties = {
  fontSize: '16px', fontWeight: 600, color: '#d4a843', marginBottom: '8px', marginTop: '20px',
};

const paragraph: React.CSSProperties = {
  fontSize: '15px', color: 'rgba(232, 224, 208, 0.8)', marginBottom: '12px', lineHeight: '1.8',
};

const linkStyle: React.CSSProperties = {
  color: '#d4a843', textDecoration: 'underline', textUnderlineOffset: '3px',
};

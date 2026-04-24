import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions',
  description: 'Terms and Conditions of Vassweb s. r. o. (Vassweb) for provision of digital services.',
};

export default function TermsAndConditions() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0908',
        color: '#e8e0d0',
        fontFamily: 'var(--font-inter), Inter, sans-serif',
        paddingTop: '120px',
        paddingBottom: '80px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 24px',
          lineHeight: '1.8',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-heading), Playfair Display, serif',
            fontSize: 'clamp(28px, 5vw, 42px)',
            fontWeight: 700,
            background: 'linear-gradient(135deg, #ffeebb, #d4a843)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '16px',
          }}
        >
          Terms and Conditions
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '12px' }}>
          Effective from: 8 April 2026 · Last updated: 8 April 2026
        </p>
        <p style={{ color: 'rgba(232, 224, 208, 0.4)', fontSize: '13px', marginBottom: '48px', fontStyle: 'italic' }}>
          This is an English translation provided for convenience. In case of any conflict or ambiguity,
          the Slovak language version shall prevail as the legally binding document.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. General Provisions and Identification of the Provider</h2>
          <p style={paragraph}>
            These Terms and Conditions govern the relationship between the company{' '}
            <strong style={{ color: '#e8e0d0' }}>Vassweb s. r. o.</strong>, operating under the Vassweb brand
            (hereinafter the &quot;Provider&quot;), and the customer of services (hereinafter the &quot;Client&quot;) in
            the provision of digital services including website development, automation, and AI solutions.
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
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Registered office:</strong> Školská 981/36, 931 01 Šamorín, Slovak Republic</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Reg. No.:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Tax ID:</strong> 2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>VAT ID:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Registration:</strong> Commercial Register of the District Court Trnava, Section: Sro, File No. 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Managing Director:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>E-mail:</strong>{' '}
              <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Phone:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            <strong style={{ color: '#e8e0d0' }}>Supervisory authority:</strong> Slovak Trade Inspection (SOI),
            SOI Inspectorate for the Trnava Region, Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Order and Conclusion of Contract</h2>
          <p style={paragraph}>
            The contractual relationship arises on the basis of a written order (including e-mail),
            a signed contract for work, or the Client&apos;s acceptance of a price quote. A price quote is valid
            for 30 days from its issuance unless otherwise stated.
          </p>
          <p style={paragraph}>
            Every project begins with a free initial consultation during which requirements, scope of work,
            and preliminary schedule are defined.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Price and Payment Terms</h2>
          <p style={paragraph}>
            Service prices are stated in the price list on the website or in an individual price quote.
            All prices are stated excluding VAT unless otherwise stated.
          </p>
          <p style={paragraph}>
            Standard payment terms: 70% deposit before the start of work, 30% upon delivery. For projects
            over €2,000, a different payment schedule may be agreed (e.g., 50/50). Invoice maturity is 14 days
            from issuance.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Performance and Delivery</h2>
          <p style={paragraph}>
            The delivery deadline is agreed individually for each project. The Provider undertakes to inform
            the Client about the progress of work and any changes to the schedule.
          </p>
          <p style={paragraph}>
            The Client is obliged to provide necessary cooperation — in particular materials, access credentials,
            and feedback within agreed deadlines. Delays on the Client&apos;s side may affect the delivery date.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Copyright and Intellectual Property</h2>
          <p style={paragraph}>
            Upon full payment of the price of the work, all property rights to the work are transferred to
            the Client to the extent agreed in the contract. The Provider reserves the right to list the project
            in its portfolio unless otherwise agreed.
          </p>
          <p style={paragraph}>
            The Client is responsible for ensuring that the materials provided (texts, images, logos) do not
            infringe the rights of third parties.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Warranty</h2>
          <p style={paragraph}>
            We provide a 3-month warranty on the delivered work from the date of handover. During the warranty
            period, we will repair defects attributable to the Provider free of charge. The warranty does not
            cover modifications made by the Client or a third party.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Termination by Business Client (B2B)</h2>
          <p style={paragraph}>
            A business Client (legal entity or sole trader acting within their business activity) may terminate
            the contract at any time by written notice. In such a case, the Client is obliged to pay for work
            performed up to the moment of termination. The Provider may terminate the contract if the Client
            fails to provide necessary cooperation even after repeated requests.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Right of Withdrawal — Consumer (B2C)</h2>
          <p style={paragraph}>
            If the Client is a <strong style={{ color: '#e8e0d0' }}>consumer</strong> (a natural person not
            acting within their business activity), they have the right, pursuant to Act No. 102/2014 Coll.
            on Consumer Protection in Distance Contracts, to <strong style={{ color: '#d4a843' }}>withdraw from
            the contract within 14 days</strong> of its conclusion, without giving any reason and without any penalty.
          </p>
          <p style={paragraph}>
            The consumer may exercise the right to withdraw from the contract in writing at the Provider&apos;s
            registered office (Školská 981/36, 931 01 Šamorín) or by e-mail at{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>. The consumer may also use the
            sample withdrawal form provided below.
          </p>

          <h3 style={subTitle}>Consequences of Withdrawal</h3>
          <p style={paragraph}>
            The Provider is obliged, without undue delay and no later than 14 days from the date of receipt of
            the withdrawal notice, to return to the consumer all payments received from them under the contract,
            by the same means used by the consumer, unless a different method is agreed.
          </p>

          <h3 style={subTitle}>Start of Service Performance Before the 14-Day Period Expires</h3>
          <p style={paragraph}>
            If the consumer requests that the provision of the service begin <strong style={{ color: '#e8e0d0' }}>before
            the expiry of the withdrawal period</strong>, they thereby give their express consent to the start of
            the service and acknowledge that <strong style={{ color: '#e8e0d0' }}>upon full performance of the service
            they lose the right to withdraw from the contract</strong> (Section 7(6)(a) of Act 102/2014). If the consumer
            withdraws during the provision of the service, they are obliged to pay the Provider the price for
            actually performed work up to the date of delivery of the withdrawal notice.
          </p>

          <h3 style={subTitle}>Exceptions to the Right of Withdrawal</h3>
          <p style={paragraph}>
            The consumer may not withdraw from a contract whose subject is:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              a) the provision of a service that has started with the consumer&apos;s express consent and the consumer
              has declared that they have been properly informed that by giving such consent they lose the right
              to withdraw from the contract upon full performance of the service, and full performance has occurred;
            </p>
            <p style={paragraph}>
              b) the sale of goods or provision of services whose price depends on fluctuations in the financial
              market, which the Provider cannot influence;
            </p>
            <p style={paragraph}>
              c) the sale of goods made to the consumer&apos;s specifications, custom-made goods, or goods intended
              specifically for one consumer (e.g., a custom website developed according to the Client&apos;s specifications);
            </p>
            <p style={paragraph}>
              d) the provision of digital content not supplied on a tangible medium, if its provision began with
              the consumer&apos;s express consent and the consumer declared that they have been properly informed that
              by giving such consent they lose the right to withdraw from the contract.
            </p>
          </div>

          <h3 style={subTitle}>Sample Withdrawal Form</h3>
          <div
            style={{
              background: 'rgba(212, 168, 67, 0.05)',
              border: '1px solid rgba(212, 168, 67, 0.15)',
              borderRadius: '12px',
              padding: '24px',
              marginTop: '12px',
              fontSize: '14px',
              lineHeight: '1.8',
            }}
          >
            <p style={{ ...paragraph, marginBottom: '16px', fontStyle: 'italic', color: 'rgba(232, 224, 208, 0.6)' }}>
              (complete and return this form only if you wish to withdraw from the contract)
            </p>
            <p style={{ ...paragraph, marginBottom: '8px' }}><strong style={{ color: '#d4a843' }}>To:</strong></p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>Vassweb s. r. o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>Školská 981/36, 931 01 Šamorín, Slovakia</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>E-mail: info@vassweb.com</p>
            <p style={{ ...paragraph, marginBottom: '16px' }}>Reg. No.: 56 921 021</p>

            <p style={{ ...paragraph, marginBottom: '12px' }}>
              I hereby notify you of my withdrawal from the contract for the provision of the following service: ...........................................
            </p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Date of order / contract conclusion: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Consumer&apos;s name: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Consumer&apos;s address: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Consumer&apos;s e-mail: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Consumer&apos;s signature (only if the form is submitted in paper form): ...........................................</p>
            <p style={{ ...paragraph, marginBottom: 0 }}>Date: ...........................................</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Complaints and Complaint Procedure</h2>
          <p style={paragraph}>
            The consumer is entitled to file a complaint regarding a service provided within a period of{' '}
            <strong style={{ color: '#e8e0d0' }}>24 months</strong> from its acceptance. Complaints may be filed
            in writing at the Provider&apos;s registered office or by e-mail at{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>.
          </p>
          <p style={paragraph}>
            The Provider is obliged to issue the consumer with a confirmation of the complaint and to decide
            on the method of handling it immediately, or in complex cases no later than 3 working days. Handling
            of a complaint must not take longer than <strong style={{ color: '#e8e0d0' }}>30 days</strong> from
            its filing. After this period, the consumer has the right to withdraw from the contract.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>10. Liability and Limitation of Liability</h2>
          <p style={paragraph}>
            The Provider is not liable for damages caused by incorrect use of the work, interference by third
            parties, failures of third-party services (hosting, domain registrar), or force majeure. The total
            liability of the Provider is limited to the amount of the price paid for the work.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>11. Alternative Dispute Resolution</h2>
          <p style={paragraph}>
            If a consumer Client is not satisfied with the way the Provider handled their complaint, or believes
            that the Provider has violated their rights, they have the right to contact the Provider with a
            request for redress. If the Provider responds negatively or does not respond within 30 days, the
            consumer has the right to file a proposal for alternative dispute resolution (ADR) pursuant to Act
            No. 391/2015 Coll.
          </p>
          <p style={paragraph}>
            The competent ADR entity is the Slovak Trade Inspection (<a href="https://www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi</a>),
            or another authorized legal entity listed in the register of ADR entities. The consumer may also
            use the European Commission ODR platform:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={linkStyle}>ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>12. Final Provisions</h2>
          <p style={paragraph}>
            These Terms and Conditions and all legal relationships between the Provider and the Client are
            governed by the laws of the Slovak Republic, in particular Act No. 40/1964 Coll. Civil Code, Act
            No. 513/1991 Coll. Commercial Code, Act No. 250/2007 Coll. on Consumer Protection, Act No. 102/2014
            Coll. on Consumer Protection in Distance Contracts, Act No. 22/2004 Coll. on Electronic Commerce,
            Regulation (EU) 2016/679 (GDPR), and Act No. 18/2018 Coll. on Personal Data Protection.
          </p>
          <p style={paragraph}>
            Any disputes shall be resolved primarily by agreement. If a dispute cannot be resolved by agreement,
            the general court of the Slovak Republic has jurisdiction. A consumer additionally has the right to
            contact an ADR entity (see section 11) or the supervisory authority — the Slovak Trade Inspection,
            SOI Inspectorate for the Trnava Region, Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
          <p style={paragraph}>
            If any provision of these Terms and Conditions becomes invalid or ineffective, this does not affect
            the validity of the other provisions.
          </p>
          <p style={paragraph}>
            The Provider reserves the right to unilaterally change these Terms and Conditions due to changes in
            legislation or business conditions. Clients will be informed of changes via the website at least 14
            days before the change takes effect.
          </p>
          <p style={paragraph}>
            These Terms and Conditions take effect on <strong style={{ color: '#e8e0d0' }}>8 April 2026</strong>.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a
            href="/en"
            style={{
              color: '#d4a843',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'opacity 0.3s',
            }}
          >
            ← Back to homepage
          </a>
        </div>
      </div>
    </main>
  );
}

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading), Playfair Display, serif',
  fontSize: '22px',
  fontWeight: 600,
  color: '#ffeebb',
  marginBottom: '16px',
  marginTop: 0,
};

const subTitle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#d4a843',
  marginBottom: '8px',
  marginTop: '20px',
};

const paragraph: React.CSSProperties = {
  fontSize: '15px',
  color: 'rgba(232, 224, 208, 0.8)',
  marginBottom: '12px',
  lineHeight: '1.8',
};

const linkStyle: React.CSSProperties = {
  color: '#d4a843',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
};

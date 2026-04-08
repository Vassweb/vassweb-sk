import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov',
  description: 'Zásady ochrany osobných údajov na stránke Vassweb.',
};

export default function OchranaUdajov() {
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
          Ochrana osobných údajov
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Účinnosť od: 8. apríla 2026 · Posledná aktualizácia: 8. apríla 2026
        </p>

        {/* --- Úvod --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Kto sme — identifikácia prevádzkovateľa</h2>
          <p style={paragraph}>
            Prevádzkovateľom osobných údajov v zmysle čl. 4 ods. 7 GDPR je spoločnosť{' '}
            <strong style={{ color: '#e8e0d0' }}>VVD s.r.o.</strong>, podnikajúca pod značkou Vassweb
            (ďalej len &quot;my&quot; alebo &quot;prevádzkovateľ&quot;).
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
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Obchodné meno:</strong> VVD s.r.o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Sídlo:</strong> Blatná na Ostrove 281, 930 32 Blatná na Ostrove</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>IČO:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>DIČ:</strong> 2122501524 · <strong style={{ color: '#d4a843' }}>IČ DPH:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Zápis:</strong> OR OS Trnava, oddiel Sro, vložka č. 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Konateľ:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>E-mail:</strong>{' '}
              <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Telefón:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            Vaše súkromie berieme vážne. Táto stránka popisuje, aké údaje zbierame, prečo ich
            zbierame a aké máte práva v súvislosti s ich spracovaním v zmysle Nariadenia Európskeho
            parlamentu a Rady (EÚ) 2016/679 (GDPR) a zákona č. 18/2018 Z. z. o ochrane osobných údajov.
          </p>
        </section>

        {/* --- Aké údaje zbierame --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Aké údaje zbierame</h2>

          <h3 style={subTitle}>a) Kontaktný formulár</h3>
          <p style={paragraph}>
            Keď nám pošlete správu cez kontaktný formulár, zbierame vaše meno, e-mailovú adresu
            a text správy. Tieto údaje používame výhradne na to, aby sme vám odpovedali.
            Neposielame žiadne marketingové e-maily a vaše údaje nezdieľame s tretími stranami.
          </p>

          <h3 style={subTitle}>b) Analytické cookies (Google Analytics 4)</h3>
          <p style={paragraph}>
            Na analýzu návštevnosti používame službu Google Analytics 4 (prevádzkovateľ: Google Ireland Limited).
            Táto služba zbiera anonymizované údaje o tom, ako návštevníci používajú našu stránku — napríklad
            aké stránky navštívili, ako dlho na nich zostali a z akého zariadenia prišli.
          </p>
          <p style={paragraph}>
            <strong style={{ color: '#d4a843' }}>Dôležité:</strong> Google Analytics sa spustí
            len vtedy, ak s tým výslovne súhlasíte cez cookie banner. Ak cookies odmietnete,
            žiadne analytické údaje sa nezbierajú.
          </p>

          <h3 style={subTitle}>c) Technické údaje</h3>
          <p style={paragraph}>
            Náš server (Vercel) automaticky zaznamenáva základné technické údaje ako IP adresu,
            typ prehliadača a čas prístupu. Tieto údaje slúžia výhradne na zabezpečenie fungovania
            stránky a ochranu pred zneužitím.
          </p>
        </section>

        {/* --- Účel spracovania --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Účel a právny základ spracovania</h2>
          <p style={paragraph}>
            Vaše údaje spracúvame na základe týchto právnych základov:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Oprávnený záujem</strong> (čl. 6 ods. 1 písm. f) GDPR) —
              spracovanie údajov z kontaktného formulára za účelom odpovede na vašu správu a technické
              údaje na zabezpečenie fungovania stránky.
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Súhlas</strong> (čl. 6 ods. 1 písm. a) GDPR) —
              analytické cookies (Google Analytics) sa aktivujú len na základe vášho výslovného súhlasu,
              ktorý môžete kedykoľvek odvolať.
            </p>
          </div>
        </section>

        {/* --- Zdieľanie údajov --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Zdieľanie údajov s tretími stranami</h2>
          <p style={paragraph}>
            Vaše osobné údaje nezdieľame so žiadnymi tretími stranami na marketingové účely.
            Údaje môžu byť spracované nasledovnými poskytovateľmi služieb, ktorí konajú ako
            naši sprostredkovatelia:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Vercel Inc.</strong> — hosting webovej stránky (USA,
              chránené štandardnými zmluvnými doložkami)
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Google Ireland Limited</strong> — analytika návštevnosti
              (len so súhlasom)
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Resend Inc.</strong> — doručovanie e-mailov z kontaktného
              formulára
            </p>
          </div>
        </section>

        {/* --- Doba uchovávania --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Doba uchovávania údajov</h2>
          <p style={paragraph}>
            Údaje z kontaktného formulára uchovávame po dobu nevyhnutnú na vybavenie vašej požiadavky,
            maximálne 12 mesiacov. Analytické údaje v Google Analytics sa uchovávajú 14 mesiacov
            (predvolené nastavenie GA4) a potom sa automaticky vymažú.
          </p>
        </section>

        {/* --- Vaše práva --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Vaše práva</h2>
          <p style={paragraph}>
            Podľa GDPR máte nasledujúce práva:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na prístup</strong> — máte právo vedieť, aké údaje o vás spracúvame</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na opravu</strong> — môžete požiadať o opravu nesprávnych údajov</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na vymazanie</strong> — môžete požiadať o vymazanie vašich údajov</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na obmedzenie spracovania</strong> — môžete požiadať o obmedzenie spracovania</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na prenosnosť</strong> — môžete požiadať o export vašich údajov</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo odvolať súhlas</strong> — súhlas s cookies môžete kedykoľvek odvolať vymazaním cookies vo vašom prehliadači</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo podať sťažnosť</strong> — máte právo podať sťažnosť na Úrad na ochranu osobných údajov SR (<a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>dataprotection.gov.sk</a>)</p>
          </div>
          <p style={paragraph}>
            Pre uplatnenie akýchkoľvek práv nás kontaktujte na{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>.
          </p>
        </section>

        {/* --- Cookies --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Cookies</h2>
          <p style={paragraph}>
            Naša stránka používa len analytické cookies (Google Analytics), a to výhradne na základe
            vášho súhlasu. Nepoužívame žiadne reklamné, sledovacie ani cookies tretích strán na
            marketingové účely.
          </p>
          <div
            style={{
              background: 'rgba(212, 168, 67, 0.05)',
              border: '1px solid rgba(212, 168, 67, 0.15)',
              borderRadius: '12px',
              padding: '20px',
              marginTop: '16px',
            }}
          >
            <p style={{ ...paragraph, marginBottom: '8px' }}>
              <strong style={{ color: '#d4a843' }}>_ga, _ga_*</strong> — Google Analytics cookies
            </p>
            <p style={{ ...paragraph, color: 'rgba(232, 224, 208, 0.6)', fontSize: '14px', marginBottom: 0 }}>
              Účel: Meranie návštevnosti a správania na stránke · Doba platnosti: 14 mesiacov ·
              Typ: Analytické · Aktivácia: Len so súhlasom
            </p>
          </div>
        </section>

        {/* --- Zmeny --- */}
        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Zmeny týchto zásad</h2>
          <p style={paragraph}>
            Tieto zásady môžeme príležitostne aktualizovať. O významných zmenách vás budeme informovať
            prostredníctvom oznámenia na našej stránke. Odporúčame vám tieto zásady pravidelne kontrolovať.
          </p>
        </section>

        {/* --- Späť --- */}
        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a
            href="/"
            style={{
              color: '#d4a843',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'opacity 0.3s',
            }}
          >
            ← Späť na hlavnú stránku
          </a>
        </div>
      </div>
    </main>
  );
}

// Opakovateľné štýly
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

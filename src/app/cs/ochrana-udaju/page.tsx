import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ochrana osobních údajů',
  description: 'Zásady ochrany osobních údajů na stránce Vassweb.',
};

export default function OchranaUdaju() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Ochrana osobních údajů
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Poslední aktualizace: 24. dubna 2026
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Kdo jsme — identifikace správce</h2>
          <p style={paragraph}>
            Správcem osobních údajů ve smyslu čl. 4 odst. 7 GDPR je společnost{' '}
            <strong style={{ color: '#e8e0d0' }}>Vassweb s. r. o.</strong>, podnikající pod značkou Vassweb
            (dále jen &quot;my&quot; nebo &quot;provozovatel&quot;).
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
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Obchodní jméno:</strong> Vassweb s. r. o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Sídlo:</strong> Školská 981/36, 931 01 Šamorín, Slovensko</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>IČO:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>DIČ:</strong> 2122501524 · <strong style={{ color: '#d4a843' }}>IČ DPH:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Zápis:</strong> OR OS Trnava, oddíl Sro, vložka č. 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Jednatel:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>E-mail:</strong>{' '}
              <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Telefon:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            Vaše soukromí bereme vážně. Tato stránka popisuje, jaké údaje shromažďujeme, proč je
            shromažďujeme a jaká máte práva v souvislosti s jejich zpracováním podle Nařízení Evropského
            parlamentu a Rady (EU) 2016/679 (GDPR).
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Jaké údaje shromažďujeme</h2>
          <h3 style={subTitle}>a) Kontaktní formulář</h3>
          <p style={paragraph}>
            Když nám pošlete zprávu přes kontaktní formulář, shromažďujeme vaše jméno, e-mailovou adresu
            a text zprávy. Tyto údaje používáme výhradně k tomu, abychom vám odpověděli.
            Neposíláme žádné marketingové e-maily a vaše údaje nesdílíme s třetími stranami.
          </p>
          <h3 style={subTitle}>b) Analytické cookies (Google Analytics 4)</h3>
          <p style={paragraph}>
            Na analýzu návštěvnosti používáme službu Google Analytics 4 (provozovatel: Google Ireland Limited).
            Tato služba shromažďuje anonymizované údaje o tom, jak návštěvníci používají naši stránku — například
            jaké stránky navštívili, jak dlouho na nich zůstali a z jakého zařízení přišli.
          </p>
          <p style={paragraph}>
            <strong style={{ color: '#d4a843' }}>Důležité:</strong> Google Analytics se spustí
            jen tehdy, pokud s tím výslovně souhlasíte přes cookie banner. Pokud cookies odmítnete,
            žádné analytické údaje se neshromažďují.
          </p>
          <h3 style={subTitle}>c) Technické údaje</h3>
          <p style={paragraph}>
            Náš server (Vercel) automaticky zaznamenává základní technické údaje jako IP adresu,
            typ prohlížeče a čas přístupu. Tyto údaje slouží výhradně k zajištění fungování
            stránky a ochraně před zneužitím.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Účel a právní základ zpracování</h2>
          <p style={paragraph}>Vaše údaje zpracováváme na základě těchto právních důvodů:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Oprávněný zájem</strong> (čl. 6 odst. 1 písm. f) GDPR) —
              zpracování údajů z kontaktního formuláře za účelem odpovědi na vaši zprávu a technické
              údaje pro zajištění fungování stránky.
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Souhlas</strong> (čl. 6 odst. 1 písm. a) GDPR) —
              analytické cookies (Google Analytics) se aktivují pouze na základě vašeho výslovného souhlasu,
              který můžete kdykoli odvolat.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Sdílení údajů s třetími stranami</h2>
          <p style={paragraph}>
            Vaše osobní údaje nesdílíme s žádnými třetími stranami pro marketingové účely.
            Údaje mohou být zpracovány následujícími poskytovateli služeb, kteří jednají jako
            naši zpracovatelé:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Vercel Inc.</strong> — hosting webové stránky (USA, chráněno standardními smluvními doložkami)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Google Ireland Limited</strong> — analytika návštěvnosti (pouze se souhlasem)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Resend Inc.</strong> — doručování e-mailů z kontaktního formuláře</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Doba uchovávání údajů</h2>
          <p style={paragraph}>
            Údaje z kontaktního formuláře uchováváme po dobu nezbytnou k vyřízení vaší žádosti,
            maximálně 12 měsíců. Analytické údaje v Google Analytics se uchovávají 14 měsíců
            (výchozí nastavení GA4) a poté se automaticky vymažou.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Vaše práva</h2>
          <p style={paragraph}>Podle GDPR máte následující práva:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na přístup</strong> — máte právo vědět, jaké údaje o vás zpracováváme</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na opravu</strong> — můžete požádat o opravu nesprávných údajů</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na výmaz</strong> — můžete požádat o vymazání vašich údajů</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na omezení zpracování</strong> — můžete požádat o omezení zpracování</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo na přenositelnost</strong> — můžete požádat o export vašich údajů</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo odvolat souhlas</strong> — souhlas s cookies můžete kdykoli odvolat vymazáním cookies ve vašem prohlížeči</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Právo podat stížnost</strong> — máte právo podat stížnost na Úřad pro ochranu osobních údajů SR (<a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>dataprotection.gov.sk</a>)</p>
          </div>
          <p style={paragraph}>
            Pro uplatnění jakýchkoli práv nás kontaktujte na{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Cookies</h2>
          <p style={paragraph}>
            Naše stránka používá pouze analytické cookies (Google Analytics), a to výhradně na základě
            vašeho souhlasu. Nepoužíváme žádné reklamní, sledovací ani cookies třetích stran pro
            marketingové účely.
          </p>
          <div style={{ background: 'rgba(212, 168, 67, 0.05)', border: '1px solid rgba(212, 168, 67, 0.15)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
            <p style={{ ...paragraph, marginBottom: '8px' }}>
              <strong style={{ color: '#d4a843' }}>_ga, _ga_*</strong> — Google Analytics cookies
            </p>
            <p style={{ ...paragraph, color: 'rgba(232, 224, 208, 0.6)', fontSize: '14px', marginBottom: 0 }}>
              Účel: Měření návštěvnosti a chování na stránce · Doba platnosti: 14 měsíců ·
              Typ: Analytické · Aktivace: Pouze se souhlasem
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Změny těchto zásad</h2>
          <p style={paragraph}>
            Tyto zásady můžeme příležitostně aktualizovat. O významných změnách vás budeme informovat
            prostřednictvím oznámení na naší stránce. Doporučujeme vám tyto zásady pravidelně kontrolovat.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a href="/cs" style={{ color: '#d4a843', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'opacity 0.3s' }}>
            ← Zpět na hlavní stránku
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

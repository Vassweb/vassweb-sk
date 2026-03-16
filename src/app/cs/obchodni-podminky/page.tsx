import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obchodní podmínky',
  description: 'Obchodní podmínky společnosti Vassweb pro poskytování digitálních služeb.',
};

export default function ObchodniPodminky() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Obchodní podmínky
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Poslední aktualizace: 15. března 2026
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Základní ustanovení</h2>
          <p style={paragraph}>
            Tyto obchodní podmínky upravují vztahy mezi společností Vassweb (dále jen &quot;poskytovatel&quot;)
            a objednatelem služeb (dále jen &quot;klient&quot;) při poskytování digitálních služeb včetně
            tvorby webových stránek, automatizací a AI řešení.
          </p>
          <p style={paragraph}>
            Kontaktní údaje poskytovatele: e-mail{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>, telefon{' '}
            <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Objednávka a uzavření smlouvy</h2>
          <p style={paragraph}>
            Smluvní vztah vzniká na základě písemné objednávky (včetně e-mailové), podepsané smlouvy
            o dílo nebo akceptace cenové nabídky klientem. Cenová nabídka je platná 30 dní od jejího
            vystavení, pokud není uvedeno jinak.
          </p>
          <p style={paragraph}>
            Každý projekt začíná bezplatnou úvodní konzultací, během které se definují požadavky,
            rozsah prací a předběžný harmonogram.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Cena a platební podmínky</h2>
          <p style={paragraph}>
            Ceny služeb jsou uvedeny v ceníku na webové stránce nebo v individuální cenové nabídce.
            Všechny ceny jsou uvedeny bez DPH, pokud není uvedeno jinak.
          </p>
          <p style={paragraph}>
            Standardní platební podmínky: 50 % záloha před zahájením prací, 50 % po předání díla.
            U větších projektů může být dohodnut jiný platební harmonogram. Splatnost faktur
            je 14 dní od vystavení.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Realizace a dodání</h2>
          <p style={paragraph}>
            Termín dodání se dohodne individuálně u každého projektu. Poskytovatel se zavazuje
            informovat klienta o průběhu prací a případných změnách v harmonogramu.
          </p>
          <p style={paragraph}>
            Klient je povinen poskytnout potřebnou součinnost — zejména podklady, přístupy a zpětnou vazbu
            v dohodnutých termínech. Zpoždění na straně klienta může ovlivnit termín dodání.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Autorská práva</h2>
          <p style={paragraph}>
            Po úplném zaplacení ceny díla přecházejí na klienta všechna majetková práva k dílu
            v rozsahu dohodnutém ve smlouvě. Poskytovatel si vyhrazuje právo uvést projekt ve svém
            portfoliu, pokud se strany nedohodnou jinak.
          </p>
          <p style={paragraph}>
            Klient odpovídá za to, že poskytnuté podklady (texty, obrázky, loga) neporušují práva
            třetích stran.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Záruční podmínky</h2>
          <p style={paragraph}>
            Na dodané dílo poskytujeme záruku 3 měsíce od předání. Během záruční doby
            bezplatně opravíme chyby, které vznikly na straně poskytovatele. Záruka se nevztahuje
            na úpravy provedené klientem nebo třetí stranou.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Odstoupení od smlouvy</h2>
          <p style={paragraph}>
            Klient může od smlouvy odstoupit kdykoli písemným oznámením. V takovém případě je povinen
            uhradit práce provedené do okamžiku odstoupení. Poskytovatel může od smlouvy odstoupit, pokud klient
            neposkytuje potřebnou součinnost ani po opakované výzvě.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Odpovědnost</h2>
          <p style={paragraph}>
            Poskytovatel neodpovídá za škody způsobené nesprávným používáním díla, zásahy třetích
            stran, výpadky služeb třetích stran (hosting, doménový registrátor) nebo vyšší mocí.
            Celková odpovědnost poskytovatele je omezena na výši zaplacené ceny za dílo.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Závěrečná ustanovení</h2>
          <p style={paragraph}>
            Tyto obchodní podmínky se řídí právním řádem Slovenské republiky. Jakékoli spory
            se strany zavazují řešit přednostně dohodou. Poskytovatel si vyhrazuje právo tyto podmínky
            změnit, přičemž o změnách bude klienty informovat prostřednictvím webové stránky.
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

const paragraph: React.CSSProperties = {
  fontSize: '15px', color: 'rgba(232, 224, 208, 0.8)', marginBottom: '12px', lineHeight: '1.8',
};

const linkStyle: React.CSSProperties = {
  color: '#d4a843', textDecoration: 'underline', textUnderlineOffset: '3px',
};

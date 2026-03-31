import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obchodné podmienky',
  description: 'Obchodné podmienky spoločnosti Vassweb pre poskytovanie digitálnych služieb.',
};

export default function ObchodnePodmienky() {
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
          Obchodné podmienky
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Posledná aktualizácia: 15. marca 2026
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Základné ustanovenia</h2>
          <p style={paragraph}>
            Tieto obchodné podmienky upravujú vzťahy medzi spoločnosťou Vassweb (ďalej len &quot;poskytovateľ&quot;)
            a objednávateľom služieb (ďalej len &quot;klient&quot;) pri poskytovaní digitálnych služieb vrátane
            tvorby webových stránok, automatizácií a AI riešení.
          </p>
          <p style={paragraph}>
            Kontaktné údaje poskytovateľa: e-mail{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>, telefón{' '}
            <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Objednávka a uzatvorenie zmluvy</h2>
          <p style={paragraph}>
            Zmluvný vzťah vzniká na základe písomnej objednávky (vrátane e-mailovej), podpísanej zmluvy
            o dielo alebo akceptácie cenovej ponuky klientom. Cenová ponuka je platná 30 dní od jej
            vystavenia, pokiaľ nie je uvedené inak.
          </p>
          <p style={paragraph}>
            Každý projekt začína bezplatnou úvodnou konzultáciou, počas ktorej sa definujú požiadavky,
            rozsah prác a predbežný harmonogram.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Cena a platobné podmienky</h2>
          <p style={paragraph}>
            Ceny služieb sú uvedené v cenníku na webovej stránke alebo v individuálnej cenovej ponuke.
            Všetky ceny sú uvedené bez DPH, pokiaľ nie je uvedené inak.
          </p>
          <p style={paragraph}>
            Štandardné platobné podmienky: 70 % záloha pred začatím prác, 30 % po odovzdaní diela.
            Pri projektoch nad 2 000 € môže byť dohodnutý iný platobný harmonogram (napr. 50/50).
            Splatnosť faktúr je 14 dní od vystavenia.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Realizácia a dodanie</h2>
          <p style={paragraph}>
            Termín dodania sa dohodne individuálne pri každom projekte. Poskytovateľ sa zaväzuje
            informovať klienta o priebehu prác a prípadných zmenách v harmonograme.
          </p>
          <p style={paragraph}>
            Klient je povinný poskytnúť potrebnú súčinnosť — najmä podklady, prístupy a spätnú väzbu
            v dohodnutých termínoch. Oneskorenie na strane klienta môže ovplyvniť termín dodania.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Autorské práva</h2>
          <p style={paragraph}>
            Po úplnom zaplatení ceny diela prechádzajú na klienta všetky majetkové práva k dielu
            v rozsahu dohodnutom v zmluve. Poskytovateľ si vyhradzuje právo uviesť projekt vo svojom
            portfóliu, pokiaľ sa strany nedohodnú inak.
          </p>
          <p style={paragraph}>
            Klient zodpovedá za to, že poskytnuté podklady (texty, obrázky, logá) neporušujú práva
            tretích strán.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Záručné podmienky</h2>
          <p style={paragraph}>
            Na dodané dielo poskytujeme záruku 3 mesiace od odovzdania. Počas záručnej doby
            bezplatne opravíme chyby, ktoré vznikli na strane poskytovateľa. Záruka sa nevzťahuje
            na úpravy vykonané klientom alebo treťou stranou.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Odstúpenie od zmluvy</h2>
          <p style={paragraph}>
            Klient môže od zmluvy odstúpiť kedykoľvek písomným oznámením. V takom prípade je povinný
            uhradiť práce vykonané do momentu odstúpenia. Poskytovateľ môže od zmluvy odstúpiť, ak klient
            neposkytuje potrebnú súčinnosť ani po opakovanej výzve.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Zodpovednosť</h2>
          <p style={paragraph}>
            Poskytovateľ nezodpovedá za škody spôsobené nesprávnym používaním diela, zásahmi tretích
            strán, výpadkami služieb tretích strán (hosting, doménový registrátor) alebo vyššou mocou.
            Celková zodpovednosť poskytovateľa je obmedzená na výšku zaplatenej ceny za dielo.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Záverečné ustanovenia</h2>
          <p style={paragraph}>
            Tieto obchodné podmienky sa riadia právnym poriadkom Slovenskej republiky. Akékoľvek spory
            sa strany zaväzujú riešiť prednostne dohodou. Poskytovateľ si vyhradzuje právo tieto podmienky
            zmeniť, pričom o zmenách bude klientov informovať prostredníctvom webovej stránky.
          </p>
        </section>

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

const sectionTitle: React.CSSProperties = {
  fontFamily: 'var(--font-heading), Playfair Display, serif',
  fontSize: '22px',
  fontWeight: 600,
  color: '#ffeebb',
  marginBottom: '16px',
  marginTop: 0,
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

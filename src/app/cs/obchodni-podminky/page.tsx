import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Obchodní podmínky',
  description: 'Obchodní podmínky společnosti Vassweb s. r. o. (Vassweb) pro poskytování digitálních služeb.',
};

export default function ObchodniPodminky() {
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
          Obchodní podmínky
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '12px' }}>
          Účinnost od: 8. dubna 2026 · Poslední aktualizace: 8. dubna 2026
        </p>
        <p style={{ color: 'rgba(232, 224, 208, 0.4)', fontSize: '13px', marginBottom: '48px', fontStyle: 'italic' }}>
          Toto je český překlad poskytnutý pro pohodlí. V případě rozporu nebo nejasnosti je právně závazná
          slovenská jazyková verze.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Základní ustanovení a identifikace poskytovatele</h2>
          <p style={paragraph}>
            Tyto obchodní podmínky upravují vztahy mezi společností{' '}
            <strong style={{ color: '#e8e0d0' }}>Vassweb s. r. o.</strong>, podnikající pod značkou Vassweb
            (dále jen &quot;poskytovatel&quot;) a objednatelem služeb (dále jen &quot;klient&quot;) při poskytování
            digitálních služeb včetně tvorby webových stránek, automatizací a AI řešení.
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
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Sídlo:</strong> Školská 981/36, 931 01 Šamorín, Slovenská republika</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>IČO:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>DIČ:</strong> 2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>IČ DPH:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Zápis:</strong> Obchodní rejstřík Okresního soudu Trnava, oddíl Sro, vložka č. 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Jednatel:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>E-mail:</strong>{' '}
              <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Telefon:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            <strong style={{ color: '#e8e0d0' }}>Orgán dozoru:</strong> Slovenská obchodní inspekce (SOI),
            Inspektorát SOI pro Trnavský kraj, Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Objednávka a uzavření smlouvy</h2>
          <p style={paragraph}>
            Smluvní vztah vzniká na základě písemné objednávky (včetně e-mailové), podepsané smlouvy o dílo
            nebo akceptace cenové nabídky klientem. Cenová nabídka je platná 30 dní od jejího vystavení,
            pokud není uvedeno jinak.
          </p>
          <p style={paragraph}>
            Každý projekt začíná bezplatnou úvodní konzultací, během které se definují požadavky, rozsah
            prací a předběžný harmonogram.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Cena a platební podmínky</h2>
          <p style={paragraph}>
            Ceny služeb jsou uvedeny v ceníku na webové stránce nebo v individuální cenové nabídce. Všechny
            ceny jsou uvedeny bez DPH, pokud není uvedeno jinak.
          </p>
          <p style={paragraph}>
            Standardní platební podmínky: 70% záloha před zahájením prací, 30% po odevzdání díla. U projektů
            nad 2 000 € může být dohodnut jiný platební harmonogram (např. 50/50). Splatnost faktur je 14 dní
            od vystavení.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Realizace a dodání</h2>
          <p style={paragraph}>
            Termín dodání se dohodne individuálně u každého projektu. Poskytovatel se zavazuje informovat
            klienta o průběhu prací a případných změnách v harmonogramu.
          </p>
          <p style={paragraph}>
            Klient je povinen poskytnout potřebnou součinnost — zejména podklady, přístupy a zpětnou vazbu
            v dohodnutých termínech. Zpoždění na straně klienta může ovlivnit termín dodání.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Autorská práva</h2>
          <p style={paragraph}>
            Po úplném zaplacení ceny díla přecházejí na klienta všechna majetková práva k dílu v rozsahu
            dohodnutém ve smlouvě. Poskytovatel si vyhrazuje právo uvést projekt ve svém portfoliu, pokud
            se strany nedohodnou jinak.
          </p>
          <p style={paragraph}>
            Klient odpovídá za to, že poskytnuté podklady (texty, obrázky, loga) neporušují práva třetích stran.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Záruční podmínky</h2>
          <p style={paragraph}>
            Na dodané dílo poskytujeme záruku 3 měsíce od odevzdání. Během záruční doby bezplatně opravíme
            chyby, které vznikly na straně poskytovatele. Záruka se nevztahuje na úpravy provedené klientem
            nebo třetí stranou.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Odstoupení od smlouvy — klient podnikatel (B2B)</h2>
          <p style={paragraph}>
            Klient (podnikatel — právnická osoba nebo OSVČ jednající v rámci své obchodní činnosti) může
            od smlouvy odstoupit kdykoliv písemným oznámením. V takovém případě je povinen uhradit práce
            provedené do okamžiku odstoupení. Poskytovatel může od smlouvy odstoupit, pokud klient neposkytuje
            potřebnou součinnost ani po opakované výzvě.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Odstoupení od smlouvy — spotřebitel (B2C)</h2>
          <p style={paragraph}>
            Pokud je klient <strong style={{ color: '#e8e0d0' }}>spotřebitelem</strong> (fyzická osoba, která
            při uzavírání a plnění smlouvy nejedná v rámci předmětu své obchodní činnosti nebo jiné podnikatelské
            činnosti), má podle zákona č. 102/2014 Z. z. (SR) o ochraně spotřebitele při prodeji na dálku právo
            odstoupit od smlouvy <strong style={{ color: '#d4a843' }}>do 14 dnů</strong> od jejího uzavření,
            a to bez uvedení důvodu a bez jakékoliv sankce.
          </p>
          <p style={paragraph}>
            Spotřebitel může uplatnit právo na odstoupení od smlouvy písemně na adrese sídla poskytovatele
            (Školská 981/36, 931 01 Šamorín) nebo e-mailem na{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>. Spotřebitel může použít
            i vzorový formulář na odstoupení od smlouvy uvedený níže.
          </p>

          <h3 style={subTitle}>Důsledky odstoupení</h3>
          <p style={paragraph}>
            Poskytovatel je povinen bez zbytečného odkladu, nejpozději do 14 dnů ode dne doručení oznámení
            o odstoupení od smlouvy, vrátit spotřebiteli všechny platby, které od něj přijal na základě
            smlouvy, a to stejným způsobem, jakým spotřebitel provedl platbu.
          </p>

          <h3 style={subTitle}>Zahájení poskytování služby před uplynutím 14 dnů</h3>
          <p style={paragraph}>
            Pokud spotřebitel požádá, aby se poskytování služby zahájilo <strong style={{ color: '#e8e0d0' }}>před
            uplynutím lhůty na odstoupení od smlouvy</strong>, udělí tímto výslovný souhlas se zahájením
            poskytování služby a bere na vědomí, že <strong style={{ color: '#e8e0d0' }}>po úplném poskytnutí
            služby ztrácí právo na odstoupení od smlouvy</strong> (§ 7 odst. 6 písm. a) zák. 102/2014 Z. z.).
            Pokud spotřebitel odstoupí od smlouvy v průběhu poskytování služby, je povinen uhradit poskytovateli
            cenu za skutečně poskytnuté plnění do dne doručení oznámení o odstoupení.
          </p>

          <h3 style={subTitle}>Výjimky z práva na odstoupení</h3>
          <p style={paragraph}>Spotřebitel nemůže odstoupit od smlouvy, jejímž předmětem je:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              a) poskytnutí služby, pokud se její poskytování začalo s výslovným souhlasem spotřebitele a
              spotřebitel prohlásil, že byl řádně poučen, že vyjádřením tohoto souhlasu ztrácí právo na
              odstoupení od smlouvy po úplném poskytnutí služby, a pokud došlo k úplnému poskytnutí služby;
            </p>
            <p style={paragraph}>
              b) prodej zboží nebo poskytnutí služby, jejichž cena závisí na pohybu cen na finančním trhu;
            </p>
            <p style={paragraph}>
              c) prodej zboží zhotoveného podle zvláštních požadavků spotřebitele, zboží vyrobeného na míru
              nebo zboží určeného zvlášť pro jednoho spotřebitele (například webstránka vytvořená na míru
              podle zadání klienta, jejíž vývoj se začal);
            </p>
            <p style={paragraph}>
              d) poskytování elektronického obsahu jinak než na hmotném nosiči, pokud se jeho poskytování
              začalo s výslovným souhlasem spotřebitele.
            </p>
          </div>

          <h3 style={subTitle}>Vzorový formulář na odstoupení od smlouvy</h3>
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
              (vyplňte a zašlete tento formulář pouze v případě, že si přejete odstoupit od smlouvy)
            </p>
            <p style={{ ...paragraph, marginBottom: '8px' }}><strong style={{ color: '#d4a843' }}>Komu:</strong></p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>Vassweb s. r. o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>Školská 981/36, 931 01 Šamorín, Slovensko</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>E-mail: info@vassweb.com</p>
            <p style={{ ...paragraph, marginBottom: '16px' }}>IČO: 56 921 021</p>

            <p style={{ ...paragraph, marginBottom: '12px' }}>
              Tímto oznamuji, že odstupuji od smlouvy o poskytnutí této služby: ...........................................
            </p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Datum objednání / datum uzavření smlouvy: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Jméno a příjmení spotřebitele: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Adresa spotřebitele: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>E-mail spotřebitele: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Podpis spotřebitele (pokud se tento formulář podává v listinné podobě): ...........................................</p>
            <p style={{ ...paragraph, marginBottom: 0 }}>Datum: ...........................................</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Reklamace a reklamační řád</h2>
          <p style={paragraph}>
            Spotřebitel je oprávněn uplatnit reklamaci na poskytnutou službu ve lhůtě{' '}
            <strong style={{ color: '#e8e0d0' }}>24 měsíců</strong> od jejího převzetí. Reklamaci je možné
            uplatnit písemně na adrese sídla poskytovatele nebo e-mailem na{' '}
            <a href="mailto:info@vassweb.com" style={linkStyle}>info@vassweb.com</a>.
          </p>
          <p style={paragraph}>
            Poskytovatel je povinen vydat spotřebiteli potvrzení o uplatnění reklamace a o způsobu jejího
            vyřízení rozhodnout ihned, ve složitých případech nejpozději do 3 pracovních dnů. Vyřízení
            reklamace nesmí trvat déle než <strong style={{ color: '#e8e0d0' }}>30 dnů</strong> od jejího
            uplatnění. Po uplynutí této lhůty má spotřebitel právo od smlouvy odstoupit.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>10. Odpovědnost a omezení odpovědnosti</h2>
          <p style={paragraph}>
            Poskytovatel neodpovídá za škody způsobené nesprávným používáním díla, zásahy třetích stran,
            výpadky služeb třetích stran (hosting, doménový registrátor) nebo vyšší mocí. Celková odpovědnost
            poskytovatele je omezena na výši zaplacené ceny za dílo.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>11. Alternativní řešení sporů</h2>
          <p style={paragraph}>
            V případě, že klient — spotřebitel není spokojen se způsobem, kterým poskytovatel vyřídil jeho
            reklamaci nebo se domnívá, že poskytovatel porušil jeho práva, má právo obrátit se na poskytovatele
            s žádostí o nápravu. Pokud poskytovatel na žádost odpoví zamítavě nebo neodpoví do 30 dnů, má
            spotřebitel právo podat návrh na zahájení alternativního řešení sporu subjektu ARS podle zákona
            č. 391/2015 Z. z.
          </p>
          <p style={paragraph}>
            Příslušným subjektem ARS je Slovenská obchodní inspekce (<a href="https://www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi</a>),
            případně jiná oprávněná právnická osoba zapsaná v seznamu subjektů ARS. Spotřebitel může využít
            i platformu ODR Evropské komise:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={linkStyle}>ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>12. Závěrečná ustanovení</h2>
          <p style={paragraph}>
            Tyto obchodní podmínky a všechny právní vztahy mezi poskytovatelem a klientem se řídí právním
            řádem Slovenské republiky, zejména zákonem č. 40/1964 Zb. Občanský zákoník, zákonem č. 513/1991
            Zb. Obchodní zákoník, zákonem č. 250/2007 Z. z. o ochraně spotřebitele, zákonem č. 102/2014 Z. z.,
            zákonem č. 22/2004 Z. z. o elektronickém obchodě, Nařízením (EU) 2016/679 (GDPR) a zákonem
            č. 18/2018 Z. z. o ochraně osobních údajů.
          </p>
          <p style={paragraph}>
            Jakékoliv spory se strany zavazují řešit přednostně dohodou. V případě, že spor nelze vyřešit
            dohodou, je příslušný všeobecný soud Slovenské republiky. Spotřebitel má navíc právo obrátit se
            na orgán alternativního řešení sporů (viz sekce 11) nebo na orgán dozoru — Slovenskou obchodní
            inspekci, Inspektorát SOI pro Trnavský kraj, Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
          <p style={paragraph}>
            Pokud se některé ustanovení těchto obchodních podmínek stane neplatným nebo neúčinným, neovlivní
            to platnost ostatních ustanovení.
          </p>
          <p style={paragraph}>
            Poskytovatel si vyhrazuje právo tyto obchodní podmínky jednostranně změnit. O změnách bude klienty
            informovat prostřednictvím webové stránky nejméně 14 dnů před nabytím účinnosti změny.
          </p>
          <p style={paragraph}>
            Tyto obchodní podmínky nabývají účinnosti dne <strong style={{ color: '#e8e0d0' }}>8. dubna 2026</strong>.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a
            href="/cs"
            style={{
              color: '#d4a843',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'opacity 0.3s',
            }}
          >
            ← Zpět na hlavní stránku
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

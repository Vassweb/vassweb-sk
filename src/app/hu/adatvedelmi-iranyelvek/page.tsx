import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adatvédelmi irányelvek',
  description: 'A Vassweb adatvédelmi irányelvei a személyes adatok védelméről.',
};

export default function AdatvedelmiIranyelvek() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Adatvédelmi irányelvek
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Utolsó frissítés: 2026. március 15.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Kik vagyunk</h2>
          <p style={paragraph}>
            Ennek a weboldalnak az üzemeltetője a Vassweb (a továbbiakban &quot;mi&quot; vagy &quot;üzemeltető&quot;).
            Elérhet minket az{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a> e-mail címen vagy
            telefonon a{' '}
            <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a> számon.
          </p>
          <p style={paragraph}>
            Komolyan vesszük az Ön magánéletének védelmét. Ez az oldal leírja, milyen adatokat gyűjtünk,
            miért gyűjtjük őket, és milyen jogai vannak az adatkezeléssel kapcsolatban az Európai Parlament
            és a Tanács (EU) 2016/679 rendelete (GDPR) értelmében.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Milyen adatokat gyűjtünk</h2>
          <h3 style={subTitle}>a) Kapcsolatfelvételi űrlap</h3>
          <p style={paragraph}>
            Amikor üzenetet küld nekünk a kapcsolatfelvételi űrlapon keresztül, gyűjtjük az Ön nevét,
            e-mail címét és az üzenet szövegét. Ezeket az adatokat kizárólag arra használjuk, hogy
            válaszoljunk Önnek. Nem küldünk marketing e-maileket és nem osztjuk meg adatait harmadik felekkel.
          </p>
          <h3 style={subTitle}>b) Analitikai sütik (Google Analytics 4)</h3>
          <p style={paragraph}>
            A weboldal forgalmának elemzéséhez a Google Analytics 4 szolgáltatást használjuk (üzemeltető: Google Ireland Limited).
            Ez a szolgáltatás anonimizált adatokat gyűjt arról, hogyan használják a látogatók weboldalunkat — például
            milyen oldalakat látogattak, mennyi időt töltöttek rajtuk és milyen eszközről érkeztek.
          </p>
          <p style={paragraph}>
            <strong style={{ color: '#d4a843' }}>Fontos:</strong> A Google Analytics csak akkor aktiválódik,
            ha Ön kifejezetten hozzájárul a süti banneren keresztül. Ha elutasítja a sütiket,
            semmilyen analitikai adat nem kerül gyűjtésre.
          </p>
          <h3 style={subTitle}>c) Technikai adatok</h3>
          <p style={paragraph}>
            Szerverünk (Vercel) automatikusan rögzíti az alapvető technikai adatokat, mint az IP-cím,
            böngésző típusa és hozzáférés ideje. Ezek az adatok kizárólag a weboldal működésének
            biztosítására és a visszaélések elleni védelemre szolgálnak.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Az adatkezelés célja és jogalapja</h2>
          <p style={paragraph}>Adatait az alábbi jogalapok alapján kezeljük:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Jogos érdek</strong> (GDPR 6. cikk (1) bekezdés f) pont) —
              a kapcsolatfelvételi űrlap adatainak kezelése az üzenetére való válaszadás céljából, valamint
              technikai adatok a weboldal működésének biztosítására.
            </p>
            <p style={paragraph}>
              <strong style={{ color: '#e8e0d0' }}>Hozzájárulás</strong> (GDPR 6. cikk (1) bekezdés a) pont) —
              az analitikai sütik (Google Analytics) csak az Ön kifejezett hozzájárulása alapján aktiválódnak,
              amelyet bármikor visszavonhat.
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Adatok megosztása harmadik felekkel</h2>
          <p style={paragraph}>
            Személyes adatait nem osztjuk meg semmilyen harmadik féllel marketing célokra.
            Az adatokat az alábbi szolgáltatók kezelhetik, akik adatfeldolgozóinkként járnak el:
          </p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Vercel Inc.</strong> — weboldal tárhely (USA, standard szerződéses záradékokkal védve)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Google Ireland Limited</strong> — forgalmi analitika (csak hozzájárulással)</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Resend Inc.</strong> — e-mailek kézbesítése a kapcsolatfelvételi űrlapról</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Adatmegőrzési időszak</h2>
          <p style={paragraph}>
            A kapcsolatfelvételi űrlap adatait a kérés kezeléséhez szükséges ideig őrizzük meg,
            legfeljebb 12 hónapig. A Google Analytics analitikai adatai 14 hónapig kerülnek megőrzésre
            (GA4 alapértelmezett beállítás), majd automatikusan törlődnek.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Az Ön jogai</h2>
          <p style={paragraph}>A GDPR értelmében az alábbi jogokkal rendelkezik:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Hozzáférési jog</strong> — jogában áll tudni, milyen adatokat kezelünk Önről</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Helyesbítéshez való jog</strong> — kérheti a helytelen adatok javítását</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Törléshez való jog</strong> — kérheti adatai törlését</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Adatkezelés korlátozásához való jog</strong> — kérheti az adatkezelés korlátozását</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Adathordozhatósághoz való jog</strong> — kérheti adatai exportálását</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Hozzájárulás visszavonásának joga</strong> — a sütikhez adott hozzájárulást bármikor visszavonhatja a böngésző sütijének törlésével</p>
            <p style={paragraph}><strong style={{ color: '#e8e0d0' }}>Panasztételi jog</strong> — jogában áll panaszt tenni a Szlovák Köztársaság Személyes Adatok Védelmi Hivatalánál (<a href="https://dataprotection.gov.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>dataprotection.gov.sk</a>)</p>
          </div>
          <p style={paragraph}>
            Bármely joga érvényesítéséhez forduljon hozzánk az{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a> címen.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Sütik</h2>
          <p style={paragraph}>
            Weboldalunk kizárólag analitikai sütiket használ (Google Analytics), és csak az Ön
            hozzájárulása alapján. Nem használunk semmilyen reklám-, követő vagy harmadik féltől
            származó sütiket marketing célokra.
          </p>
          <div style={{ background: 'rgba(212, 168, 67, 0.05)', border: '1px solid rgba(212, 168, 67, 0.15)', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
            <p style={{ ...paragraph, marginBottom: '8px' }}>
              <strong style={{ color: '#d4a843' }}>_ga, _ga_*</strong> — Google Analytics sütik
            </p>
            <p style={{ ...paragraph, color: 'rgba(232, 224, 208, 0.6)', fontSize: '14px', marginBottom: 0 }}>
              Cél: Forgalom és viselkedés mérése a weboldalon · Érvényesség: 14 hónap ·
              Típus: Analitikai · Aktiválás: Csak hozzájárulással
            </p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Az irányelvek változásai</h2>
          <p style={paragraph}>
            Ezeket az irányelveket időről időre frissíthetjük. A jelentős változásokról
            weboldalunkon keresztül értesítjük Önt. Javasoljuk, hogy rendszeresen ellenőrizze ezeket az irányelveket.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a href="/hu" style={{ color: '#d4a843', textDecoration: 'none', fontSize: '15px', fontWeight: 500, transition: 'opacity 0.3s' }}>
            ← Vissza a főoldalra
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

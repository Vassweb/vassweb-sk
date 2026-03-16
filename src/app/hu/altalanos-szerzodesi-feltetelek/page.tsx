import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Általános szerződési feltételek',
  description: 'A Vassweb általános szerződési feltételei digitális szolgáltatások nyújtásához.',
};

export default function AltalanosSzerzodesi() {
  return (
    <main style={{ minHeight: '100vh', background: '#0a0908', color: '#e8e0d0', fontFamily: 'var(--font-inter), Inter, sans-serif', paddingTop: '120px', paddingBottom: '80px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px', lineHeight: '1.8' }}>
        <h1 style={{ fontFamily: 'var(--font-heading), Playfair Display, serif', fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: 700, background: 'linear-gradient(135deg, #ffeebb, #d4a843)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '16px' }}>
          Általános szerződési feltételek
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '48px' }}>
          Utolsó frissítés: 2026. március 15.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Alapvető rendelkezések</h2>
          <p style={paragraph}>
            Ezek az általános szerződési feltételek szabályozzák a Vassweb (a továbbiakban &quot;szolgáltató&quot;)
            és a szolgáltatások megrendelője (a továbbiakban &quot;ügyfél&quot;) közötti kapcsolatokat
            digitális szolgáltatások nyújtása során, beleértve weboldalak készítését, automatizációkat és AI megoldásokat.
          </p>
          <p style={paragraph}>
            A szolgáltató elérhetőségei: e-mail{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>, telefon{' '}
            <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Megrendelés és szerződéskötés</h2>
          <p style={paragraph}>
            A szerződéses kapcsolat írásbeli megrendelés (beleértve az e-mailt), aláírt munkaszerződés
            vagy az ügyfél által elfogadott árajánlat alapján jön létre. Az árajánlat a kiállítástól
            számított 30 napig érvényes, hacsak másként nem jelezzük.
          </p>
          <p style={paragraph}>
            Minden projekt egy ingyenes bevezető konzultációval kezdődik, amelynek során meghatározzák
            a követelményeket, a munka terjedelmét és az előzetes ütemtervet.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Ár és fizetési feltételek</h2>
          <p style={paragraph}>
            A szolgáltatások árai a weboldalon található árlistában vagy egyedi árajánlatban szerepelnek.
            Minden ár ÁFA nélkül értendő, hacsak másként nem jelezzük.
          </p>
          <p style={paragraph}>
            Standard fizetési feltételek: 50% előleg a munka megkezdése előtt, 50% az átadáskor.
            Nagyobb projektek esetén eltérő fizetési ütemezésben lehet megállapodni.
            A számlák fizetési határideje a kiállítástól számított 14 nap.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Megvalósítás és átadás</h2>
          <p style={paragraph}>
            Az átadási határidőt minden projektnél egyénileg állapítják meg. A szolgáltató vállalja,
            hogy tájékoztatja az ügyfelet a munka előrehaladásáról és az ütemterv esetleges változásairól.
          </p>
          <p style={paragraph}>
            Az ügyfél köteles megadni a szükséges együttműködést — különösen az anyagokat, hozzáféréseket
            és visszajelzéseket a megállapodott határidőkön belül. Az ügyfél oldalán felmerülő késedelem
            befolyásolhatja az átadási határidőt.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Szerzői jogok</h2>
          <p style={paragraph}>
            A munka teljes kifizetése után az ügyfélre szállnak a mű összes vagyoni jogai
            a szerződésben megállapodott terjedelemben. A szolgáltató fenntartja a jogot, hogy
            a projektet portfóliójában szerepeltesse, hacsak a felek másként nem állapodnak meg.
          </p>
          <p style={paragraph}>
            Az ügyfél felelős azért, hogy a rendelkezésre bocsátott anyagok (szövegek, képek, logók)
            nem sértik harmadik felek jogait.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Garanciális feltételek</h2>
          <p style={paragraph}>
            Az átadott munkára 3 hónapos garanciát vállalunk az átadástól számítva.
            A garanciális időszak alatt díjmentesen javítjuk a szolgáltató oldalán felmerült hibákat.
            A garancia nem terjed ki az ügyfél vagy harmadik fél által végzett módosításokra.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Szerződéstől való elállás</h2>
          <p style={paragraph}>
            Az ügyfél bármikor elállhat a szerződéstől írásbeli értesítéssel. Ebben az esetben
            köteles kifizetni az elállás pillanatáig elvégzett munkát. A szolgáltató elállhat
            a szerződéstől, ha az ügyfél ismételt felszólítás ellenére sem nyújtja a szükséges együttműködést.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Felelősség</h2>
          <p style={paragraph}>
            A szolgáltató nem felel a mű helytelen használatából, harmadik felek beavatkozásából,
            harmadik féltől származó szolgáltatások kieséseiből (tárhely, domain regisztrátor)
            vagy vis maiorból eredő károkért. A szolgáltató teljes felelőssége a munkáért fizetett
            összegre korlátozódik.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Záró rendelkezések</h2>
          <p style={paragraph}>
            Ezeket az általános szerződési feltételeket a Szlovák Köztársaság jogrendje szabályozza.
            A felek vállalják, hogy az esetleges vitákat elsősorban egyeztetéssel rendezik.
            A szolgáltató fenntartja a jogot ezen feltételek módosítására, amelyről a weboldalon
            keresztül tájékoztatja az ügyfeleket.
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

const paragraph: React.CSSProperties = {
  fontSize: '15px', color: 'rgba(232, 224, 208, 0.8)', marginBottom: '12px', lineHeight: '1.8',
};

const linkStyle: React.CSSProperties = {
  color: '#d4a843', textDecoration: 'underline', textUnderlineOffset: '3px',
};

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Általános szerződési feltételek',
  description: 'A VVD s.r.o. (Vassweb) általános szerződési feltételei digitális szolgáltatások nyújtásához.',
};

export default function ASZF() {
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
          Általános szerződési feltételek
        </h1>
        <p style={{ color: 'rgba(232, 224, 208, 0.5)', fontSize: '14px', marginBottom: '12px' }}>
          Hatályos: 2026. április 8-tól · Utolsó frissítés: 2026. április 8.
        </p>
        <p style={{ color: 'rgba(232, 224, 208, 0.4)', fontSize: '13px', marginBottom: '48px', fontStyle: 'italic' }}>
          Ez a magyar fordítás csupán a kényelem céljából készült. Bármilyen eltérés vagy kétértelműség esetén
          a szlovák nyelvű verzió a jogilag kötelező érvényű.
        </p>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>1. Általános rendelkezések és a szolgáltató azonosítása</h2>
          <p style={paragraph}>
            Jelen általános szerződési feltételek (ÁSZF) a{' '}
            <strong style={{ color: '#e8e0d0' }}>VVD s.r.o.</strong> társaság — amely a Vassweb márkanév
            alatt működik (a továbbiakban: &quot;szolgáltató&quot;) — és a szolgáltatásokat megrendelő
            (a továbbiakban: &quot;ügyfél&quot;) közötti kapcsolatokat szabályozzák a digitális szolgáltatások
            nyújtása során, beleértve a weboldal-fejlesztést, automatizációt és AI megoldásokat.
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
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Cégnév:</strong> VVD s.r.o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Székhely:</strong> Blatná na Ostrove 281, 930 32 Blatná na Ostrove, Szlovák Köztársaság</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Cégjegyzékszám:</strong> 56 921 021</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Adószám:</strong> 2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>ÁFA-szám:</strong> SK2122501524</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Cégbíróság:</strong> Nagyszombati Járásbíróság, Sro szakasz, 59422/T</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>Ügyvezető:</strong> Richard Vass</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}><strong style={{ color: '#d4a843' }}>E-mail:</strong>{' '}
              <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a>
            </p>
            <p style={{ ...paragraph, marginBottom: 0 }}><strong style={{ color: '#d4a843' }}>Telefon:</strong>{' '}
              <a href="tel:+421918668728" style={linkStyle}>+421 918 668 728</a>
            </p>
          </div>
          <p style={paragraph}>
            <strong style={{ color: '#e8e0d0' }}>Felügyeleti hatóság:</strong> Szlovák Kereskedelmi Felügyelet
            (SOI), SOI Felügyelőség a Nagyszombati kerületre, Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>2. Megrendelés és szerződéskötés</h2>
          <p style={paragraph}>
            A szerződéses viszony írásos megrendelés alapján (beleértve az e-mailt), aláírt vállalkozási
            szerződés vagy az ügyfél által elfogadott árajánlat alapján jön létre. Az árajánlat 30 napig
            érvényes a kibocsátás napjától, hacsak másképp nincs feltüntetve.
          </p>
          <p style={paragraph}>
            Minden projekt ingyenes előzetes konzultációval kezdődik, amely során meghatározzuk az
            igényeket, a munka terjedelmét és az előzetes ütemtervet.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>3. Ár és fizetési feltételek</h2>
          <p style={paragraph}>
            A szolgáltatások árai a weboldalon található árlistában vagy az egyéni árajánlatban vannak
            feltüntetve. Minden ár ÁFA nélkül értendő, hacsak másképp nincs feltüntetve.
          </p>
          <p style={paragraph}>
            Általános fizetési feltételek: 70% előleg a munka megkezdése előtt, 30% a mű átadása után.
            A 2 000 € feletti projekteknél eltérő fizetési ütemterv is megállapítható (pl. 50/50).
            A számlák fizetési határideje 14 nap a kibocsátástól.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>4. Megvalósítás és szállítás</h2>
          <p style={paragraph}>
            A szállítási határidőt minden projekthez egyénileg állapítjuk meg. A szolgáltató vállalja,
            hogy tájékoztatja az ügyfelet a munka előrehaladásáról és az ütemterv esetleges változásairól.
          </p>
          <p style={paragraph}>
            Az ügyfél köteles biztosítani a szükséges együttműködést — különösen az anyagok, hozzáférések
            és visszajelzések a megbeszélt határidőkön belül. Az ügyfél oldali késedelmek befolyásolhatják
            a szállítási határidőt.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>5. Szerzői jogok és szellemi tulajdon</h2>
          <p style={paragraph}>
            A mű árának teljes kifizetését követően a mű minden vagyoni joga átszáll az ügyfélre a
            szerződésben megállapított mértékben. A szolgáltató fenntartja a jogot, hogy a projektet
            portfóliójában feltüntesse, hacsak a felek másképp nem állapodnak meg.
          </p>
          <p style={paragraph}>
            Az ügyfél felelős azért, hogy a biztosított anyagok (szövegek, képek, logók) ne sértsék
            harmadik felek jogait.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>6. Jótállási feltételek</h2>
          <p style={paragraph}>
            A leszállított műre 3 hónap jótállást biztosítunk az átadástól számítva. A jótállási idő
            alatt ingyenesen javítjuk a szolgáltató oldalán felmerült hibákat. A jótállás nem vonatkozik
            az ügyfél vagy harmadik fél által végzett módosításokra.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>7. Szerződéstől való elállás — vállalkozó ügyfél (B2B)</h2>
          <p style={paragraph}>
            Az üzleti ügyfél (jogi személy vagy üzleti tevékenysége keretében eljáró egyéni vállalkozó)
            bármikor írásbeli értesítéssel elállhat a szerződéstől. Ebben az esetben köteles kifizetni
            az elállás pillanatáig elvégzett munkát. A szolgáltató akkor állhat el a szerződéstől, ha
            az ügyfél az ismételt felszólítás ellenére sem biztosítja a szükséges együttműködést.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>8. Elállás joga — fogyasztó (B2C)</h2>
          <p style={paragraph}>
            Ha az ügyfél <strong style={{ color: '#e8e0d0' }}>fogyasztó</strong> (olyan természetes személy,
            aki nem az üzleti tevékenysége keretében jár el), joga van a 102/2014 Z. z. sz. szlovák törvény
            értelmében <strong style={{ color: '#d4a843' }}>14 napon belül</strong> elállni a szerződéstől
            annak megkötésétől számítva, indoklás és szankció nélkül.
          </p>
          <p style={paragraph}>
            A fogyasztó az elállási jogát írásban gyakorolhatja a szolgáltató székhelyén (Blatná na Ostrove
            281, 930 32) vagy e-mailben az{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a> címen. A fogyasztó
            használhatja az alábbi mintaformanyomtatványt is.
          </p>

          <h3 style={subTitle}>Az elállás következményei</h3>
          <p style={paragraph}>
            A szolgáltató köteles haladéktalanul, legkésőbb az elállási értesítés kézhezvételétől számított
            14 napon belül visszatéríteni a fogyasztónak minden, a szerződés alapján tőle kapott fizetést,
            ugyanazon fizetési mód használatával, amelyet a fogyasztó alkalmazott.
          </p>

          <h3 style={subTitle}>A szolgáltatás megkezdése a 14 napos határidő lejárta előtt</h3>
          <p style={paragraph}>
            Ha a fogyasztó kéri, hogy a szolgáltatás nyújtása{' '}
            <strong style={{ color: '#e8e0d0' }}>az elállási határidő lejárta előtt megkezdődjön</strong>,
            ezzel kifejezett hozzájárulását adja a szolgáltatás megkezdéséhez, és tudomásul veszi, hogy{' '}
            <strong style={{ color: '#e8e0d0' }}>a szolgáltatás teljes teljesítése után elveszti az
            elállási jogát</strong> (a 102/2014 Z. z. törvény 7. § 6. bek. a) pontja). Ha a fogyasztó
            a szolgáltatás nyújtása közben eláll a szerződéstől, köteles megfizetni a szolgáltatónak
            a ténylegesen teljesített szolgáltatás árát az elállási értesítés kézbesítésének napjáig.
          </p>

          <h3 style={subTitle}>Kivételek az elállási jog alól</h3>
          <p style={paragraph}>A fogyasztó nem állhat el olyan szerződéstől, amelynek tárgya:</p>
          <div style={{ paddingLeft: '20px', marginBottom: '16px' }}>
            <p style={paragraph}>
              a) olyan szolgáltatás nyújtása, amelynek teljesítése a fogyasztó kifejezett hozzájárulásával
              megkezdődött, és a fogyasztó kijelentette, hogy megfelelő tájékoztatást kapott arról, hogy
              e hozzájárulás megadásával a szolgáltatás teljes teljesítése után elveszti elállási jogát,
              és a teljes teljesítés megtörtént;
            </p>
            <p style={paragraph}>
              b) olyan áru vagy szolgáltatás értékesítése, amelynek ára a pénzügyi piac mozgásaitól függ,
              amelyet a szolgáltató nem tud befolyásolni;
            </p>
            <p style={paragraph}>
              c) a fogyasztó egyedi igényei szerint készült áru, méretre készült áru vagy egy adott
              fogyasztó számára kifejezetten meghatározott áru értékesítése (például egyedi igények
              szerint fejlesztett weboldal, amelynek fejlesztése megkezdődött);
            </p>
            <p style={paragraph}>
              d) digitális tartalom szolgáltatása nem tárgyi adathordozón, ha annak teljesítése a
              fogyasztó kifejezett hozzájárulásával kezdődött.
            </p>
          </div>

          <h3 style={subTitle}>Minta elállási nyilatkozat</h3>
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
              (csak akkor töltse ki és küldje vissza ezt a nyomtatványt, ha el kíván állni a szerződéstől)
            </p>
            <p style={{ ...paragraph, marginBottom: '8px' }}><strong style={{ color: '#d4a843' }}>Címzett:</strong></p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>VVD s.r.o.</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>Blatná na Ostrove 281, 930 32 Blatná na Ostrove, Szlovákia</p>
            <p style={{ ...paragraph, marginBottom: '4px' }}>E-mail: info@vassweb.sk</p>
            <p style={{ ...paragraph, marginBottom: '16px' }}>Cégjegyzékszám: 56 921 021</p>

            <p style={{ ...paragraph, marginBottom: '12px' }}>
              Alulírott ezennel kijelentem, hogy elállok a következő szolgáltatás nyújtására vonatkozó szerződéstől: ...........................................
            </p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Megrendelés dátuma / szerződéskötés dátuma: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Fogyasztó neve: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Fogyasztó címe: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Fogyasztó e-mail címe: ...........................................</p>
            <p style={{ ...paragraph, marginBottom: '12px' }}>Fogyasztó aláírása (ha a nyomtatványt papír alapon adja be): ...........................................</p>
            <p style={{ ...paragraph, marginBottom: 0 }}>Dátum: ...........................................</p>
          </div>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>9. Panaszok és panaszkezelési szabályzat</h2>
          <p style={paragraph}>
            A fogyasztó jogosult panaszt tenni a nyújtott szolgáltatásra{' '}
            <strong style={{ color: '#e8e0d0' }}>24 hónapon</strong> belül annak átvételétől. A panaszt
            írásban lehet benyújtani a szolgáltató székhelyén vagy e-mailben az{' '}
            <a href="mailto:info@vassweb.sk" style={linkStyle}>info@vassweb.sk</a> címen.
          </p>
          <p style={paragraph}>
            A szolgáltató köteles a fogyasztónak igazolást kiadni a panasz benyújtásáról és annak
            kezelési módjáról haladéktalanul, összetett esetekben legkésőbb 3 munkanapon belül
            dönteni. A panasz kezelése nem tarthat tovább, mint{' '}
            <strong style={{ color: '#e8e0d0' }}>30 nap</strong> a benyújtástól. E határidő leteltével
            a fogyasztó jogosult elállni a szerződéstől.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>10. Felelősség és a felelősség korlátozása</h2>
          <p style={paragraph}>
            A szolgáltató nem felel a mű helytelen használatából, harmadik felek beavatkozásából, harmadik
            felek szolgáltatásainak (tárhely, domain regisztrátor) kieséséből vagy vis maior helyzetekből
            eredő károkért. A szolgáltató teljes felelőssége a műért fizetett ár mértékére korlátozódik.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>11. Alternatív vitarendezés</h2>
          <p style={paragraph}>
            Ha a fogyasztó ügyfél nincs megelégedve azzal, ahogyan a szolgáltató kezelte a panaszát,
            vagy úgy véli, hogy a szolgáltató megsértette jogait, joga van a szolgáltatóhoz fordulni
            jogorvoslati kérelemmel. Ha a szolgáltató elutasítóan válaszol vagy 30 napon belül nem válaszol,
            a fogyasztónak joga van alternatív vitarendezésre (ARS) javaslatot benyújtani a 391/2015 Z. z.
            sz. törvény szerint.
          </p>
          <p style={paragraph}>
            Az illetékes ARS szerv a Szlovák Kereskedelmi Felügyelet (<a href="https://www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk/sk/alternativne-riesenie-spotrebitelskych-sporov.soi</a>),
            illetve az ARS-szervek nyilvántartásába bejegyzett egyéb felhatalmazott jogi személy. A fogyasztó
            használhatja az Európai Bizottság ODR platformját is:{' '}
            <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" style={linkStyle}>ec.europa.eu/consumers/odr</a>.
          </p>
        </section>

        <section style={{ marginBottom: '40px' }}>
          <h2 style={sectionTitle}>12. Záró rendelkezések</h2>
          <p style={paragraph}>
            Jelen ÁSZF és a szolgáltató és az ügyfél közötti minden jogviszony a Szlovák Köztársaság
            jogrendje alá tartozik, különösen a 40/1964 Zb. sz. Polgári Törvénykönyv, az 513/1991 Zb.
            sz. Kereskedelmi Törvénykönyv, a 250/2007 Z. z. sz. fogyasztóvédelmi törvény, a 102/2014 Z. z.
            sz. törvény, a 22/2004 Z. z. sz. elektronikus kereskedelemről szóló törvény, az (EU) 2016/679
            rendelet (GDPR) és a 18/2018 Z. z. sz. adatvédelmi törvény.
          </p>
          <p style={paragraph}>
            Bármilyen jogvitát a felek elsősorban megállapodás útján törekszenek rendezni. Ha a jogvita
            megállapodással nem rendezhető, a Szlovák Köztársaság általános bírósága az illetékes.
            A fogyasztónak emellett joga van ARS szervhez (lásd 11. szakasz) vagy a felügyeleti hatósághoz
            fordulni — Szlovák Kereskedelmi Felügyelet, SOI Felügyelőség a Nagyszombati kerületre,
            Pekárska 23, 917 01 Trnava 1,{' '}
            <a href="https://www.soi.sk" target="_blank" rel="noopener noreferrer" style={linkStyle}>www.soi.sk</a>.
          </p>
          <p style={paragraph}>
            Ha jelen ÁSZF valamely rendelkezése érvénytelenné vagy hatálytalanná válik, az nem érinti
            a többi rendelkezés érvényességét.
          </p>
          <p style={paragraph}>
            A szolgáltató fenntartja a jogot, hogy jelen ÁSZF-et egyoldalúan módosítsa. A változásokról
            az ügyfeleket a weboldalon keresztül tájékoztatja legalább 14 nappal a változás hatályba
            lépése előtt.
          </p>
          <p style={paragraph}>
            Jelen ÁSZF <strong style={{ color: '#e8e0d0' }}>2026. április 8-án</strong> lép hatályba.
          </p>
        </section>

        <div style={{ marginTop: '60px', paddingTop: '32px', borderTop: '1px solid rgba(212, 168, 67, 0.15)' }}>
          <a
            href="/hu"
            style={{
              color: '#d4a843',
              textDecoration: 'none',
              fontSize: '15px',
              fontWeight: 500,
              transition: 'opacity 0.3s',
            }}
          >
            ← Vissza a főoldalra
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

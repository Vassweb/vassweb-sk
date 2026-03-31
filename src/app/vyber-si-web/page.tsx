'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

// ═══════════════════════════════════════════════════════════════
// FONTS
// ═══════════════════════════════════════════════════════════════
const font = 'var(--font-inter), Inter, system-ui, sans-serif';
const heading = 'var(--font-heading), Playfair Display, Georgia, serif';

// ═══════════════════════════════════════════════════════════════
// SVG ICONS — minimalistické path data pre každú šablónu
// ═══════════════════════════════════════════════════════════════
const icons: Record<string, string> = {
  restaurant: 'M11 3V7H13V3H11ZM7.5 3C7.22 3 7 3.22 7 3.5V9C7 10.1 7.9 11 9 11V20C9 20.55 9.45 21 10 21H10C10.55 21 11 20.55 11 20V11C12.1 11 13 10.1 13 9V3.5C13 3.22 12.78 3 12.5 3H12.5C12.22 3 12 3.22 12 3.5V8H11V3.5C11 3.22 10.78 3 10.5 3H10.5C10.22 3 10 3.22 10 3.5V8H9V3.5C9 3.22 8.78 3 8.5 3H8.5C8.22 3 8 3.22 8 3.5V8L7.5 3ZM16 3C14.9 3 14 4.9 14 7C14 8.74 14.63 10.19 15.5 10.78V20C15.5 20.55 15.95 21 16.5 21H16.5C17.05 21 17.5 20.55 17.5 20V10.78C18.37 10.19 19 8.74 19 7C19 4.9 18.1 3 17 3H16Z',
  beauty: 'M6.2 2C5.54 2 5 2.54 5 3.2V11H5C3.9 11 3 11.9 3 13V15C3 16.1 3.9 17 5 17H6V21C6 21.55 6.45 22 7 22H7C7.55 22 8 21.55 8 21V17H9C10.1 17 11 16.1 11 15V13C11 11.9 10.1 11 9 11H9V3.2C9 2.54 8.46 2 7.8 2H6.2ZM13 2L16.5 8.5L20 2H13ZM16.5 10C14.84 10 13.5 11.34 13.5 13C13.5 14.3 14.36 15.41 15.5 15.82V21C15.5 21.55 15.95 22 16.5 22C17.05 22 17.5 21.55 17.5 21V15.82C18.64 15.41 19.5 14.3 19.5 13C19.5 11.34 18.16 10 16.5 10Z',
  auto: 'M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13S8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13S19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z',
  fitness: 'M20.57 14.86L22 13.43L20.57 12L17 15.57L8.43 7L12 3.43L10.57 2L9.14 3.43L7.71 2L5.57 4.14L4.14 2.71L2.71 4.14L4.14 5.57L2 7.71L3.43 9.14L2 10.57L3.43 12L7 8.43L15.57 17L12 20.57L13.43 22L14.86 20.57L16.29 22L18.43 19.86L19.86 21.29L21.29 19.86L19.86 18.43L22 16.29L20.57 14.86Z',
  firma: 'M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z',
  zubar: 'M12 2C9.24 2 7 4.24 7 7C7 9.85 8.41 11.56 9.5 12.83C10 13.4 10.45 13.91 10.71 14.42C11.28 15.56 11 17 11 18C11 19.1 11.5 20 12 20S13 19.1 13 18C13 17 12.72 15.56 13.29 14.42C13.55 13.91 14 13.4 14.5 12.83C15.59 11.56 17 9.85 17 7C17 4.24 14.76 2 12 2Z',
  veterinar: 'M4.5 9.5C5.88 9.5 7 8.38 7 7S5.88 4.5 4.5 4.5S2 5.62 2 7S3.12 9.5 4.5 9.5ZM9 5.5C10.38 5.5 11.5 4.38 11.5 3S10.38 0.5 9 0.5S6.5 1.62 6.5 3S7.62 5.5 9 5.5ZM15 5.5C16.38 5.5 17.5 4.38 17.5 3S16.38 0.5 15 0.5S12.5 1.62 12.5 3S13.62 5.5 15 5.5ZM19.5 9.5C20.88 9.5 22 8.38 22 7S20.88 4.5 19.5 4.5S17 5.62 17 7S18.12 9.5 19.5 9.5ZM17.34 14.86C14.28 11.8 8.67 12.56 6.34 16.14C4.01 19.72 5.07 22.5 8.5 22.5C10.43 22.5 11.22 20.5 12 20.5C12.78 20.5 13.57 22.5 15.5 22.5C18.93 22.5 20.4 17.92 17.34 14.86Z',
  foto: 'M12 10.8C13.77 10.8 15.2 12.23 15.2 14C15.2 15.77 13.77 17.2 12 17.2C10.23 17.2 8.8 15.77 8.8 14C8.8 12.23 10.23 10.8 12 10.8ZM9 2L7.17 4H4C2.9 4 2 4.9 2 6V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V6C22 4.9 21.1 4 20 4H16.83L15 2H9ZM12 19C9.24 19 7 16.76 7 14C7 11.24 9.24 9 12 9C14.76 9 17 11.24 17 14C17 16.76 14.76 19 12 19Z',
  cukraren: 'M12 6C12 4.9 11.1 4 10 4C10 2.9 9.1 2 8 2S6 2.9 6 4C4.9 4 4 4.9 4 6H12ZM3 8V10C3 11.1 3.9 12 5 12V20C5 21.1 5.9 22 7 22H9C10.1 22 11 21.1 11 20V12C12.1 12 13 11.1 13 10V8H3ZM19 6H15V8H19V10H15V12H19C20.1 12 21 11.1 21 10V8C21 6.9 20.1 6 19 6ZM17 14H15V20C15 21.1 15.9 22 17 22C18.1 22 19 21.1 19 20V14H17Z',
  autoskola: 'M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12H12V6Z',
  ucto: 'M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM11 17H7V15H11V17ZM11 13H7V11H11V13ZM11 9H7V7H11V9ZM17 17H13V15H17V17ZM17 13H13V11H17V13ZM17 9H13V7H17V9Z',
  realitka: 'M12 3L2 12H5V20H11V14H13V20H19V12H22L12 3ZM12 7.7L17 12.2V18H15V12H9V18H7V12.2L12 7.7Z',
  hotel: 'M7 13C8.66 13 10 11.66 10 10C10 8.34 8.66 7 7 7C5.34 7 4 8.34 4 10C4 11.66 5.34 13 7 13ZM19 7H11V14H3V5H1V19H3V17H21V19H23V11C23 8.79 21.21 7 19 7Z',
  svadobny: 'M12 2C9.79 2 8 3.79 8 6C8 7.2 8.54 8.27 9.38 9L12 21L14.62 9C15.46 8.27 16 7.2 16 6C16 3.79 14.21 2 12 2ZM12 8C10.9 8 10 7.1 10 6C10 4.9 10.9 4 12 4C13.1 4 14 4.9 14 6C14 7.1 13.1 8 12 8Z',
  portfolio: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
  eshop: 'M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22S9 21.1 9 20S8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1Z',
};

// ═══════════════════════════════════════════════════════════════
// SVG Icon Component — vždy renderuje <svg>, nikdy emoji
// ═══════════════════════════════════════════════════════════════
function TemplateIcon({ id, color, size = 32 }: { id: string; color: string; size?: number }) {
  const d = icons[id];
  if (!d) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block', flexShrink: 0 }}>
      <path d={d} fill={color} />
    </svg>
  );
}

// ═══════════════════════════════════════════════════════════════
// ŠABLÓNY (16) — kontextové preview texty pre každú
// ═══════════════════════════════════════════════════════════════
const templatePreviewText: Record<string, { headline: string; tagline: string; heroDesc: string; navItems: string[] }> = {
  restaurant: { headline: 'La Cucina', tagline: 'Reštaurácia & Kaviareň', heroDesc: 'Objavte naše špeciality a rezervujte si stôl online. Čerstvé suroviny, taliansky šéfkuchár.', navItems: ['Menu', 'Rezervácie', 'Galéria'] },
  beauty: { headline: 'Salon Lucia', tagline: 'Kaderníctvo & Kozmetika', heroDesc: 'Profesionálna starostlivosť o váš vzhľad. Strih, farba, líčenie — všetko pod jednou strechou.', navItems: ['Služby', 'Cenník', 'Galéria'] },
  auto: { headline: 'AutoFix', tagline: 'Autoservis & Pneuservis', heroDesc: 'Spoľahlivý servis pre vaše auto. Diagnostika, opravy, prezutie pneumatík — rýchlo a kvalitne.', navItems: ['Služby', 'Cenník', 'Kontakt'] },
  fitness: { headline: 'FitZone', tagline: 'Fitness & Wellness', heroDesc: 'Moderné fitness centrum s osobnými trénermi. Skupinové cvičenia, joga, masáže.', navItems: ['Rozvrh', 'Cenník', 'Tréneri'] },
  firma: { headline: 'BuildPro', tagline: 'Stavebná firma', heroDesc: 'Stavby na kľúč, rekonštrukcie a renovácie. 15 rokov skúseností a stovky spokojných klientov.', navItems: ['Služby', 'Referencie', 'Kontakt'] },
  zubar: { headline: 'DentCare', tagline: 'Zubná klinika', heroDesc: 'Profesionálna zubná starostlivosť pre celú rodinu. Moderné vybavenie, bezbolestné ošetrenia.', navItems: ['Služby', 'Tím', 'Ordinácia'] },
  veterinar: { headline: 'VetPet', tagline: 'Veterinárna ambulancia', heroDesc: 'Staráme sa o zdravie vašich miláčikov. Preventívna starostlivosť, chirurgia, očkovanie.', navItems: ['Služby', 'Cenník', 'Tím'] },
  foto: { headline: 'Studio Krea', tagline: 'Fotograf & Videograf', heroDesc: 'Zachytíme vaše najkrajšie momenty. Svadby, portréty, firemné fotografie.', navItems: ['Portfólio', 'Balíčky', 'Kontakt'] },
  cukraren: { headline: 'Sweet House', tagline: 'Cukráreň & Pekáreň', heroDesc: 'Ručne robené torty, zákusky a pečivo. Objednajte si na oslavu alebo len tak.', navItems: ['Menu', 'Objednávky', 'Galéria'] },
  autoskola: { headline: 'DriveAcademy', tagline: 'Autoškola', heroDesc: 'Získajte vodičský preukaz rýchlo a bezpečne. Kvalitní inštruktori, moderné vozidlá.', navItems: ['Kurzy', 'Cenník', 'Prihlášky'] },
  ucto: { headline: 'DaňPro', tagline: 'Daňové poradenstvo', heroDesc: 'Účtovníctvo, dane a mzdy pre malé aj stredné firmy. Šetríme vám čas a peniaze.', navItems: ['Služby', 'Referencie', 'Kontakt'] },
  realitka: { headline: 'RealHome', tagline: 'Realitná kancelária', heroDesc: 'Nájdeme pre vás vysnívaný domov. Predaj, prenájom a správa nehnuteľností.', navItems: ['Ponuky', 'Vyhľadávanie', 'Kontakt'] },
  hotel: { headline: 'Hotel Panoráma', tagline: 'Hotel & Penzión', heroDesc: 'Luxusné ubytovanie s výhľadom na hory. Wellness, reštaurácia, konferenčné priestory.', navItems: ['Izby', 'Galéria', 'Rezervácia'] },
  svadobny: { headline: 'Bridal House', tagline: 'Svadobný salón', heroDesc: 'Nádherné svadobné šaty a doplnky. Pomôžeme vám nájsť tie pravé na váš veľký deň.', navItems: ['Kolekcie', 'Galéria', 'Termíny'] },
  portfolio: { headline: 'Ján Novák', tagline: 'Dizajnér & Developer', heroDesc: 'Kreatívny dizajn a moderný vývoj. Portfólio mojich najlepších projektov.', navItems: ['Práce', 'Bio', 'Kontakt'] },
  eshop: { headline: 'ShopStar', tagline: 'Online obchod', heroDesc: 'Nakupujte pohodlne z domu. Široký výber produktov, rýchle doručenie.', navItems: ['Produkty', 'Akcie', 'Košík'] },
};

const templates = [
  { id: 'restaurant', name: 'Reštaurácia / Kaviareň', desc: 'Jedálny lístok, rezervácie, galéria jedál, otváracie hodiny', preview: '', price: 'od 299 €', category: 'gastro', features: ['Menu', 'Rezervácie', 'Galéria'], hasDemo: false },
  { id: 'beauty', name: 'Kaderníctvo / Kozmetika', desc: 'Služby, cenník, galéria prác, online rezervácia', preview: '', price: 'od 299 €', category: 'beauty', features: ['Cenník', 'Galéria', 'Rezervácia'], hasDemo: false },
  { id: 'auto', name: 'Autoservis / Pneuservis', desc: 'Služby, cenník, otváracie hodiny, kontakt s mapou', preview: '', price: 'od 299 €', category: 'sluzby', features: ['Služby', 'Cenník', 'Kontakt'], hasDemo: false },
  { id: 'fitness', name: 'Fitness / Joga / Masáže', desc: 'Rozvrh lekcií, cenník, trénerský tím, galéria', preview: '', price: 'od 299 €', category: 'health', features: ['Rozvrh', 'Cenník', 'Tréneri'], hasDemo: false },
  { id: 'firma', name: 'Stavebná firma / Remeselník', desc: 'O nás, služby, referencie, portfólio realizácií', preview: '', price: 'od 299 €', category: 'sluzby', features: ['Referencie', 'Portfólio', 'Služby'], hasDemo: false },
  { id: 'zubar', name: 'Zubár / Lekár / Klinika', desc: 'Ordinačné hodiny, služby, tím lekárov, kontakt', preview: '', price: 'od 299 €', category: 'health', features: ['Ordinácia', 'Tím', 'Služby'], hasDemo: false },
  { id: 'veterinar', name: 'Veterinár / Pet salón', desc: 'Služby, cenník, tím, galéria, otváracie hodiny', preview: '', price: 'od 299 €', category: 'health', features: ['Služby', 'Cenník', 'Tím'], hasDemo: false },
  { id: 'foto', name: 'Fotograf / Videograf', desc: 'Portfólio, cenníky balíčkov, galéria, kontakt', preview: '', price: 'od 299 €', category: 'creative', features: ['Portfólio', 'Balíčky', 'Galéria'], hasDemo: false },
  { id: 'cukraren', name: 'Cukráreň / Pekáreň', desc: 'Menu, objednávky, galéria výrobkov, o nás', preview: '', price: 'od 299 €', category: 'gastro', features: ['Menu', 'Objednávky', 'Galéria'], hasDemo: false },
  { id: 'autoskola', name: 'Autoškola', desc: 'Kurzy, cenník, inštruktori, prihlášky online', preview: '', price: 'od 299 €', category: 'sluzby', features: ['Kurzy', 'Cenník', 'Prihlášky'], hasDemo: false },
  { id: 'ucto', name: 'Účtovník / Daňový poradca', desc: 'Služby, cenník, referencie, formulár na dopyt', preview: '', price: 'od 299 €', category: 'sluzby', features: ['Služby', 'Referencie', 'Formulár'], hasDemo: false },
  { id: 'realitka', name: 'Realitná kancelária', desc: 'Ponuky nehnuteľností, vyhľadávanie, kontakt', preview: '', price: 'od 590 €', category: 'sluzby', features: ['Ponuky', 'Filtrovanie', 'Kontakt'], hasDemo: false },
  { id: 'hotel', name: 'Hotel / Penzión', desc: 'Izby, galéria, cenník, online rezervácia', preview: '', price: 'od 590 €', category: 'gastro', features: ['Izby', 'Galéria', 'Rezervácia'], hasDemo: false },
  { id: 'svadobny', name: 'Svadobný salón / Krajčír', desc: 'Kolekcie, galéria, cenník, objednávka termínu', preview: '', price: 'od 299 €', category: 'creative', features: ['Kolekcie', 'Galéria', 'Termíny'], hasDemo: false },
  { id: 'portfolio', name: 'Portfólio / Osobná stránka', desc: 'Práce, bio, kontakt, moderný dizajn', preview: '', price: 'od 299 €', category: 'creative', features: ['Práce', 'Bio', 'Kontakt'], hasDemo: false },
  { id: 'eshop', name: 'E-shop', desc: 'Produkty, košík, platby, admin panel', preview: '', price: 'od 1 990 €', category: 'eshop', features: ['Produkty', 'Košík', 'Platby'], hasDemo: false },
];

const categories = [
  { key: 'all', label: 'Všetky' },
  { key: 'gastro', label: 'Gastro' },
  { key: 'beauty', label: 'Krása' },
  { key: 'health', label: 'Zdravie' },
  { key: 'sluzby', label: 'Služby' },
  { key: 'creative', label: 'Kreativita' },
  { key: 'eshop', label: 'E-shop' },
];

// ═══════════════════════════════════════════════════════════════
// RÝCHLE TÉMY ako KCars
// ═══════════════════════════════════════════════════════════════
const quickThemes = [
  { name: 'Fire', primary: '#ef4444', accent: '#f97316', bg: '#0a0608' },
  { name: 'Ocean', primary: '#3b82f6', accent: '#06b6d4', bg: '#060a14' },
  { name: 'Forest', primary: '#10b981', accent: '#22c55e', bg: '#060e0a' },
  { name: 'Gold', primary: '#d4a843', accent: '#f59e0b', bg: '#0a0908' },
  { name: 'Stealth', primary: '#94a3b8', accent: '#64748b', bg: '#0f172a' },
  { name: 'Light', primary: '#2563eb', accent: '#3b82f6', bg: '#ffffff' },
  { name: 'Cream', primary: '#b8860b', accent: '#d4a843', bg: '#faf8f5' },
];

// ═══════════════════════════════════════════════════════════════
// FONT PRESETS — Google Fonts sa načítajú cez link v head
// ═══════════════════════════════════════════════════════════════
const fontPresets = [
  { name: 'Elegant', headingFont: "'Playfair Display', Georgia, serif", bodyFont: "'Inter', system-ui, sans-serif" },
  { name: 'Modern', headingFont: "'Inter', system-ui, sans-serif", bodyFont: "'Inter', system-ui, sans-serif" },
  { name: 'Sporty', headingFont: "'Outfit', system-ui, sans-serif", bodyFont: "'Inter', system-ui, sans-serif" },
  { name: 'Luxus', headingFont: "'Cormorant Garamond', Georgia, serif", bodyFont: "'Lato', system-ui, sans-serif" },
  { name: 'Tech', headingFont: "'Space Grotesk', system-ui, sans-serif", bodyFont: "'IBM Plex Sans', system-ui, sans-serif" },
  { name: 'Rounded', headingFont: "'Nunito', system-ui, sans-serif", bodyFont: "'Nunito Sans', system-ui, sans-serif" },
  { name: 'Classic', headingFont: "'Merriweather', Georgia, serif", bodyFont: "'Source Sans 3', system-ui, sans-serif" },
  { name: 'Hravý', headingFont: "'Poppins', system-ui, sans-serif", bodyFont: "'Poppins', system-ui, sans-serif" },
];

// Google Fonts URL pre všetky fonty v preview
const googleFontsUrl = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@400;700&family=Space+Grotesk:wght@400;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=Nunito:wght@400;600;700;800&family=Nunito+Sans:wght@400;600;700&family=Merriweather:wght@400;700&family=Source+Sans+3:wght@400;600;700&family=Poppins:wght@400;500;600;700&display=swap';

// ═══════════════════════════════════════════════════════════════
// FARBY (12 presetov)
// ═══════════════════════════════════════════════════════════════
const colorPresets = [
  { name: 'Zlato', primary: '#d4a843', bg: '#0a0908' },
  { name: 'Modrá', primary: '#3b82f6', bg: '#0a1628' },
  { name: 'Zelená', primary: '#10b981', bg: '#0a1a12' },
  { name: 'Červená', primary: '#ef4444', bg: '#1a0a0a' },
  { name: 'Fialová', primary: '#8b5cf6', bg: '#12081a' },
  { name: 'Oranžová', primary: '#f59e0b', bg: '#1a1408' },
  { name: 'Ružová', primary: '#ec4899', bg: '#1a081a' },
  { name: 'Tyrkysová', primary: '#06b6d4', bg: '#081a1a' },
  { name: 'Tmavá elegancia', primary: '#94a3b8', bg: '#0f172a' },
  { name: 'Svetlá modrá', primary: '#2563eb', bg: '#ffffff' },
  { name: 'Svetlá zelená', primary: '#059669', bg: '#ffffff' },
  { name: 'Svetlá zlato', primary: '#b8860b', bg: '#ffffff' },
];

// ═══════════════════════════════════════════════════════════════
// FEATURE ICONS for live preview
// ═══════════════════════════════════════════════════════════════
const featureIcons = [
  'M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z',
  'M13 2.05V4.07C16.95 4.56 20 7.92 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 9.87 4.93 7.96 6.4 6.63L7.83 8.06C6.69 9.01 6 10.42 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.95 15.71 6.41 12.74 6.07L13 2.05ZM11 2.05L10.95 6.07C9.45 6.28 8.09 6.96 7.05 7.96L4.22 5.14C6.04 3.19 8.38 2.2 11 2.05Z',
  'M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM10 17L6 13L7.41 11.59L10 14.17L16.59 7.58L18 9L10 17Z',
];

const packages = [
  { id: 'starter', name: 'Štarter', price: 299, desc: 'Prezentačný web, 5 sekcií, kontakt', includes: [] as string[] },
  { id: 'basic', name: 'Basic', price: 590, desc: 'SEO, galéria, kontaktné formuláre', includes: ['seo', 'gallery'] },
  { id: 'business', name: 'Business', price: 990, desc: 'CMS/Blog, viacjazyčnosť, SEO, galéria', includes: ['seo', 'cms', 'multilang', 'gallery'] },
  { id: 'premium', name: 'Premium', price: 1990, desc: 'E-shop, rezervácie, logo + všetko z Business', includes: ['seo', 'cms', 'multilang', 'gallery', 'eshop', 'booking', 'logo'] },
];

const addonsList = [
  { id: 'seo', name: 'SEO optimalizácia', price: 149, monthly: false },
  { id: 'cms', name: 'Blog / CMS', price: 199, monthly: false },
  { id: 'multilang', name: 'Viacjazyčnosť', price: 149, monthly: false },
  { id: 'booking', name: 'Online rezervácie', price: 199, monthly: false },
  { id: 'gallery', name: 'Galéria', price: 99, monthly: false },
  { id: 'eshop', name: 'E-shop', price: 499, monthly: false },
  { id: 'chatbot', name: 'AI Chatbot', price: 299, monthly: false },
  { id: 'logo', name: 'Logo dizajn', price: 199, monthly: false },
  { id: 'copy', name: 'Copywriting', price: 149, monthly: false },
  { id: 'ads', name: 'Google Ads setup', price: 199, monthly: false },
  { id: 'maintenance', name: 'Mesačná údržba', price: 59, monthly: true },
];

const stepLabels = ['Šablóna', 'Dizajn', 'Kontakt'];


// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════
export default function VyberSiWeb() {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedColor, setSelectedColor] = useState(colorPresets[0]);
  const [secondaryColor, setSecondaryColor] = useState('#ffffff');
  const [customColor, setCustomColor] = useState('#d4a843');
  const [customBg, setCustomBg] = useState('#0a0908');
  const [logoFile, setLogoFile] = useState<string | null>(null);
  const [logoName, setLogoName] = useState('');
  const [logoError, setLogoError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ firma: '', meno: '', email: '', telefon: '', web: '', poznamky: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const [calcPackage, setCalcPackage] = useState('basic');
  const [calcAddons, setCalcAddons] = useState<Set<string>>(new Set());

  // Sidebar controls (KCars-style)
  const [borderRadius, setBorderRadius] = useState(16);
  const [darkness, setDarkness] = useState(6);
  const [fontPreset, setFontPreset] = useState(0);
  const [animSpeed, setAnimSpeed] = useState(100);
  const [activeTheme, setActiveTheme] = useState<string | null>('Gold');

  const selectedTmpl = templates.find(t => t.id === selectedTemplate);
  const filteredTemplates = categoryFilter === 'all' ? templates : templates.filter(t => t.category === categoryFilter);
  const isLight = selectedColor.bg === '#ffffff' || selectedColor.bg === '#faf8f5' || (selectedColor.bg.startsWith('rgb(') && parseInt(selectedColor.bg.match(/\d+/)?.[0] || '0') > 180);
  const textColor = isLight ? '#1a1a1a' : '#ffffff';
  const mutedColor = isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)';
  const subtleColor = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)';
  const previewText = selectedTmpl ? templatePreviewText[selectedTmpl.id] : null;

  // ═══ PRICE CALCULATOR COMPUTED ═══
  const currentPkg = packages.find(p => p.id === calcPackage)!;
  const calcTotal = currentPkg.price + [...calcAddons]
    .filter(id => id !== 'maintenance' && !currentPkg.includes.includes(id))
    .reduce((s, id) => s + (addonsList.find(a => a.id === id)?.price || 0), 0);
  const calcMaintenance = calcAddons.has('maintenance') ? 59 : 0;
  const smartTip = (() => {
    const selectedAddonIds = [...calcAddons].filter(id => id !== 'maintenance');
    const currentTotal = currentPkg.price + selectedAddonIds
      .filter(id => !currentPkg.includes.includes(id))
      .reduce((s, id) => s + (addonsList.find(a => a.id === id)?.price || 0), 0);
    const nextPackages = packages.filter(p => p.price > currentPkg.price);
    for (const pkg of nextPackages) {
      const withPkg = pkg.price + selectedAddonIds
        .filter(id => !pkg.includes.includes(id))
        .reduce((s, id) => s + (addonsList.find(a => a.id === id)?.price || 0), 0);
      const savings = currentTotal - withPkg;
      const newlyCovered = selectedAddonIds.filter(id => pkg.includes.includes(id) && !currentPkg.includes.includes(id));
      if (savings >= 50 && newlyCovered.length > 0) {
        return { text: `Balík ${pkg.name} obsahuje vybrané doplnky a ušetríte ${savings}€`, targetPackage: pkg.id };
      }
    }
    return null;
  })();

  useEffect(() => { setAnimKey(k => k + 1); }, [step]);

  // ═══ Logo Handler ═══
  const processLogoFile = useCallback((file: File) => {
    setLogoError('');
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Povolené formáty: PNG, JPG, SVG, WEBP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError('Maximálna veľkosť je 5 MB');
      return;
    }
    setLogoName(file.name);
    const reader = new FileReader();
    reader.onload = () => setLogoFile(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoFile(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback(() => setIsDragging(false), []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processLogoFile(file);
  }, [processLogoFile]);

  // ═══ Navigate Step ═══
  const goStep = (s: number) => {
    if (s === 1) setStep(1);
    if (s === 2 && selectedTemplate) setStep(2);
    if (s === 3 && selectedTemplate) setStep(3);
  };

  // ═══ Apply Quick Theme ═══
  const applyQuickTheme = (theme: typeof quickThemes[0]) => {
    setActiveTheme(theme.name);
    setSelectedColor({ name: theme.name, primary: theme.primary, bg: theme.bg });
    setSecondaryColor(theme.accent);
    setCustomColor(theme.primary);
    setCustomBg(theme.bg);
  };

  // ═══ Reset Theme ═══
  const resetTheme = () => {
    const gold = colorPresets[0];
    setSelectedColor(gold);
    setCustomColor(gold.primary);
    setCustomBg(gold.bg);
    setSecondaryColor('#ffffff');
    setBorderRadius(16);
    setDarkness(6);
    setFontPreset(0);
    setAnimSpeed(100);
    setActiveTheme('Gold');
  };

  // ═══ Submit ═══
  const [submitError, setSubmitError] = useState('');
  const handleSubmit = async () => {
    setSubmitError('');
    if (!form.firma || !form.email) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setSubmitError('Zadajte platnú emailovú adresu');
      return;
    }
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.meno,
          email: form.email,
          phone: form.telefon,
          company: form.firma,
          message: `KONFIGURÁTOR WEBU\n\nŠablóna: ${selectedTmpl?.name || 'Neurčená'}\n\n── CENOVÁ KALKULÁCIA ──\nBalík: ${currentPkg.name} (${currentPkg.price}€)\nDoplnky: ${[...calcAddons].filter(id => id !== 'maintenance').map(id => { const a = addonsList.find(x => x.id === id); return a ? `${a.name} +${a.price}€` : id; }).join(', ') || 'Žiadne'}\nMesačná údržba: ${calcMaintenance > 0 ? `${calcMaintenance}€/mes` : 'Nie'}\nODHAD CELKOM: ${calcTotal}€${calcMaintenance > 0 ? ` + ${calcMaintenance}€/mes` : ''}\n\n── DIZAJN ──\nFarba: ${selectedColor.name} (${selectedColor.primary})\nPozadie: ${selectedColor.bg}\nFont: ${fontPresets[fontPreset].name}\nZaoblenie: ${borderRadius}px\nLogo: ${logoName || 'Žiadne'}\nExistujúci web: ${form.web || 'Žiadny'}\n\nPoznámky:\n${form.poznamky}`,
          source: 'konfigurator',
        }),
      });
      if (!res.ok) throw new Error('API error');
      setSent(true);
    } catch {
      setSubmitError('Nepodarilo sa odoslať. Skúste to znova.');
    }
    setSending(false);
  };

  // ═══════════════════════════════════════════════════════════════
  // ĎAKOVACIA STRÁNKA
  // ═══════════════════════════════════════════════════════════════
  if (sent) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0908', color: '#fff', fontFamily: font, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 560, animation: 'konfFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(212,168,67,0.1)', border: '2px solid rgba(212,168,67,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#d4a843" /></svg>
          </div>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 700, marginBottom: 16, lineHeight: 1.2 }}>
            Ďakujeme, <span style={{ color: '#d4a843' }}>{form.firma}</span>!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
            Váš výber sme prijali. Ozveme sa vám do 24 hodín s návrhom a cenovou ponukou.
          </p>
          <div style={{ padding: 24, background: 'rgba(212,168,67,0.06)', border: '1px solid rgba(212,168,67,0.15)', borderRadius: 16, textAlign: 'left', marginBottom: 36 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Rekapitulácia</div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 16 }}>
              {selectedTmpl && <TemplateIcon id={selectedTmpl.id} color="#d4a843" size={36} />}
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{selectedTmpl?.name}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Balík {currentPkg.name} — {calcTotal}€{calcMaintenance > 0 ? ` + ${calcMaintenance}€/mes` : ''}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 22, height: 22, borderRadius: 6, background: selectedColor.primary, border: '2px solid rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{selectedColor.name}</span>
              </div>
              {logoFile && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <img src={logoFile} alt="logo" style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'contain' }} />
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{logoName}</span>
                </div>
              )}
            </div>
            {form.meno && <div style={{ marginTop: 12, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Kontakt: {form.meno} / {form.email}</div>}
          </div>
          <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="#d4a843" /></svg>
            Späť na vassweb.sk
          </a>
        </div>
        <style>{`@keyframes konfFadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════
  return (
    <>
    {/* eslint-disable-next-line @next/next/no-page-custom-font */}
    <link rel="stylesheet" href={googleFontsUrl} />
    <div style={{ minHeight: '100vh', background: '#0a0908', color: '#fff', fontFamily: font }}>
      <style>{`
        @keyframes konfFadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes konfPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .konf-card { transition: all 0.25s cubic-bezier(0.16,1,0.3,1); }
        .konf-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .konf-color-btn { transition: all 0.2s ease; }
        .konf-color-btn:hover { transform: scale(1.08); }
        .konf-input:focus { border-color: ${selectedColor.primary} !important; outline: none; box-shadow: 0 0 0 3px ${selectedColor.primary}20; }
        .konf-btn-primary { transition: all 0.2s ease; }
        .konf-btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px ${selectedColor.primary}40; }
        .konf-btn-secondary { transition: all 0.2s ease; }
        .konf-btn-secondary:hover { border-color: rgba(255,255,255,0.15) !important; color: rgba(255,255,255,0.6) !important; }
        .konf-progress-step { transition: all 0.3s ease; cursor: pointer; }
        .konf-progress-step:hover { opacity: 0.85; }
        .konf-drop-zone { transition: all 0.25s ease; }
        .konf-sidebar-section { margin-bottom: 20px; }
        .konf-sidebar-label { font-size: 10px; font-weight: 700; color: rgba(255,255,255,0.3); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .konf-range { width: 100%; accent-color: ${selectedColor.primary}; cursor: pointer; height: 4px; }
        .konf-range::-webkit-slider-thumb { width: 16px; height: 16px; }
        .konf-theme-btn { transition: all 0.2s ease; }
        .konf-theme-btn:hover { transform: scale(1.05); border-color: rgba(255,255,255,0.2) !important; }
        @media (max-width: 768px) {
          .konf-step2-grid { grid-template-columns: 1fr !important; }
          .konf-sidebar { order: 2; }
          .konf-preview-wrap { order: 1; }
        }
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header style={{ textAlign: 'center', padding: '48px 24px 36px', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 0%, ${selectedColor.primary}12 0%, transparent 55%)`, transition: 'background 0.5s ease' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontSize: 20, fontWeight: 700, letterSpacing: '0.02em' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 8 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#d4a843" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
            Vassweb
          </a>
          <h1 style={{ fontFamily: heading, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 700, margin: '20px 0 10px', lineHeight: 1.25 }}>
            Nakonfigurujte si{' '}
            <span style={{ color: selectedColor.primary, transition: 'color 0.3s' }}>vlastný web</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15, maxWidth: 500, margin: '0 auto 16px', lineHeight: 1.6 }}>
            3 kroky a hotovo. Vyberte šablónu, upravte dizajn, zanechajte kontakt — a my to postavíme.
          </p>
          {/* Social proof badges */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 999, fontSize: 12, color: 'rgba(212,168,67,0.9)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="#d4a843" /></svg>
              Hotové do 14 dní
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="rgba(255,255,255,0.5)" /></svg>
              Konzultácia zadarmo
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 999, fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
              ⭐ 4.9 / 5 hodnotenie
            </div>
          </div>
        </div>
      </header>

      {/* ═══ PROGRESS BAR — klikateľný ═══ */}
      <div style={{ maxWidth: 640, margin: '0 auto 36px', padding: '0 24px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {[1, 2, 3].map((s, i) => {
            const isActive = step === s;
            const isCompleted = step > s;
            const canClick = s === 1 || (s === 2 && !!selectedTemplate) || (s === 3 && !!selectedTemplate);
            return (
              <div key={s} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  className="konf-progress-step"
                  onClick={() => canClick && goStep(s)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none',
                    cursor: canClick ? 'pointer' : 'default', padding: 0, width: '100%',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, fontFamily: font,
                    background: isActive ? selectedColor.primary : isCompleted ? `${selectedColor.primary}30` : 'rgba(255,255,255,0.04)',
                    color: isActive ? (isLight ? '#fff' : '#000') : isCompleted ? selectedColor.primary : 'rgba(255,255,255,0.2)',
                    border: `2px solid ${isActive ? selectedColor.primary : isCompleted ? `${selectedColor.primary}50` : 'rgba(255,255,255,0.06)'}`,
                    transition: 'all 0.3s ease',
                  }}>
                    {isCompleted ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={selectedColor.primary} /></svg>
                    ) : s}
                  </div>
                  <span style={{
                    fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                    color: isActive ? selectedColor.primary : isCompleted ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
                    transition: 'color 0.3s',
                  }}>
                    {stepLabels[i]}
                  </span>
                </button>
                <div style={{
                  height: 3, borderRadius: 2,
                  background: isActive || isCompleted ? selectedColor.primary : 'rgba(255,255,255,0.04)',
                  transition: 'background 0.4s ease',
                }} />
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 24px 64px' }}>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 1 — ŠABLÓNA                                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div key={`step1-${animKey}`} style={{ animation: 'konfFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, textAlign: 'center', fontFamily: heading }}>Aký web potrebujete?</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 24 }}>Vyberte si odvetvie a my pripravíme web na mieru.</p>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 28, flexWrap: 'wrap' }}>
              {categories.map(c => (
                <button key={c.key} onClick={() => setCategoryFilter(c.key)}
                  style={{
                    padding: '8px 18px', borderRadius: 24, fontSize: 13, fontWeight: 600, fontFamily: font,
                    cursor: 'pointer', transition: 'all 0.2s ease',
                    border: `1.5px solid ${categoryFilter === c.key ? selectedColor.primary : 'rgba(255,255,255,0.06)'}`,
                    background: categoryFilter === c.key ? `${selectedColor.primary}12` : 'transparent',
                    color: categoryFilter === c.key ? selectedColor.primary : 'rgba(255,255,255,0.35)',
                  }}>
                  {c.label}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {filteredTemplates.map(t => {
                const isSelected = selectedTemplate === t.id;
                return (
                  <button key={t.id} onClick={() => setSelectedTemplate(t.id)} className="konf-card"
                    style={{
                      textAlign: 'left', padding: 22, borderRadius: 16, cursor: 'pointer', fontFamily: font,
                      background: isSelected ? `${selectedColor.primary}0a` : 'rgba(255,255,255,0.02)',
                      border: `2px solid ${isSelected ? selectedColor.primary : 'rgba(255,255,255,0.04)'}`,
                      color: '#fff', position: 'relative', overflow: 'hidden',
                    }}>
                    <div style={{ marginBottom: 14, opacity: isSelected ? 1 : 0.6, transition: 'opacity 0.2s' }}>
                      <TemplateIcon id={t.id} color={isSelected ? selectedColor.primary : 'rgba(255,255,255,0.5)'} size={36} />
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.55, marginBottom: 14 }}>{t.desc}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 17, fontWeight: 800, color: selectedColor.primary }}>{t.price}</span>
                      {t.hasDemo && t.preview ? (
                        <a href={t.preview} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}
                          style={{
                            fontSize: 11, color: selectedColor.primary, textDecoration: 'none', fontWeight: 600,
                            padding: '5px 12px', borderRadius: 8,
                            border: `1px solid ${selectedColor.primary}25`,
                            background: `${selectedColor.primary}08`,
                            transition: 'all 0.2s',
                          }}>
                          Náhľad
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
                            <path d="M5 12h14M12 5l7 7-7 7" stroke={selectedColor.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </a>
                      ) : (
                        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 500 }}>Pripravujeme</span>
                      )}
                    </div>
                    {isSelected && (
                      <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, borderRadius: '50%', background: selectedColor.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={isLight ? '#fff' : '#000'} /></svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Next button */}
            <div style={{ textAlign: 'center', marginTop: 32 }}>
              <button onClick={() => { if (selectedTemplate) setStep(2); }} disabled={!selectedTemplate}
                className="konf-btn-primary"
                style={{
                  padding: '14px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font,
                  cursor: selectedTemplate ? 'pointer' : 'not-allowed',
                  background: selectedTemplate ? `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)` : 'rgba(255,255,255,0.03)',
                  color: selectedTemplate ? (isLight ? '#fff' : '#000') : 'rgba(255,255,255,0.15)',
                  border: 'none', opacity: selectedTemplate ? 1 : 0.5,
                }}>
                Ďalej — Dizajn
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
                  <path d="M5 12h14M12 5l7 7-7 7" stroke={selectedTemplate ? (isLight ? '#fff' : '#000') : 'rgba(255,255,255,0.15)'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 2 — DIZAJN (KCars-style sidebar + Live Preview)  */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div key={`step2-${animKey}`} style={{ animation: 'konfFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, textAlign: 'center', fontFamily: heading }}>Upravte si dizajn</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: 14, marginBottom: 28 }}>Meňte farby, fonty, zaoblenie — sledujte zmeny naživo.</p>

            <div className="konf-step2-grid" style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>

              {/* ═══ LEFT — SIDEBAR PANEL (KCars-style) ═══ */}
              <div className="konf-sidebar" style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16, padding: '20px 18px', position: 'sticky', top: 20,
              }}>
                {/* Panel header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97s-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1s.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64L19.43 12.97z" fill={selectedColor.primary} />
                    </svg>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>Téma</span>
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.2)', fontWeight: 400 }}>by Vassweb</span>
                  </div>
                </div>

                {/* Rýchle témy */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Rýchle témy</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {quickThemes.map(t => (
                      <button key={t.name} onClick={() => applyQuickTheme(t)} className="konf-theme-btn"
                        style={{
                          padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                          cursor: 'pointer', fontFamily: font,
                          background: activeTheme === t.name ? `${t.primary}18` : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${activeTheme === t.name ? t.primary : 'rgba(255,255,255,0.06)'}`,
                          color: activeTheme === t.name ? t.primary : 'rgba(255,255,255,0.4)',
                          display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.primary }} />
                        {t.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primárna farba */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Primárna farba</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
                    {colorPresets.slice(0, 9).map(c => (
                      <button key={c.name} onClick={() => { setSelectedColor(c); setCustomColor(c.primary); setCustomBg(c.bg); setActiveTheme(null); }}
                        className="konf-color-btn"
                        title={c.name}
                        style={{
                          width: '100%', aspectRatio: '1', borderRadius: 8, cursor: 'pointer',
                          background: c.primary, border: `2px solid ${selectedColor.name === c.name ? '#fff' : 'transparent'}`,
                          boxShadow: selectedColor.name === c.name ? `0 0 0 1px ${c.primary}` : 'none',
                        }} />
                    ))}
                    <div style={{ position: 'relative' }}>
                      <input type="color" value={customColor} onChange={e => {
                        setCustomColor(e.target.value);
                        setSelectedColor({ name: 'Vlastná', primary: e.target.value, bg: customBg });
                        setActiveTheme(null);
                      }} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
                      <div style={{
                        width: '100%', aspectRatio: '1', borderRadius: 8, border: '2px dashed rgba(255,255,255,0.15)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(255,255,255,0.03)', fontSize: 14, color: 'rgba(255,255,255,0.3)',
                      }}>+</div>
                    </div>
                  </div>
                </div>

                {/* Akcentová farba */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Akcentová farba</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)}
                      style={{ width: 32, height: 28, border: 'none', borderRadius: 6, cursor: 'pointer', background: 'transparent', padding: 0 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{secondaryColor}</span>
                  </div>
                </div>

                {/* Tmavosť */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Tmavosť pozadia</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="range" min={0} max={100} value={darkness}
                      onChange={e => {
                        const v = Number(e.target.value);
                        setDarkness(v);
                        // 0 = biela, 100 = čierna (tmavosť = koľko tmavé)
                        const inv = 100 - v;
                        const lightness = Math.round(inv * 2.55);
                        const bgColor = inv > 90 ? '#ffffff' : inv > 70 ? `rgb(${lightness}, ${lightness}, ${lightness})` : `rgb(${Math.round(inv * 0.4)}, ${Math.round(inv * 0.35)}, ${Math.round(inv * 0.5)})`;
                        setSelectedColor(prev => ({ ...prev, bg: bgColor }));
                        setActiveTheme(null);
                      }}
                      className="konf-range"
                      style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', minWidth: 20, textAlign: 'right' }}>{darkness}%</span>
                  </div>
                </div>

                {/* Štýl písma */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Štýl písma</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                    {fontPresets.map((fp, i) => (
                      <button key={fp.name} onClick={() => setFontPreset(i)}
                        style={{
                          padding: '8px 6px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                          cursor: 'pointer', textAlign: 'center',
                          fontFamily: fp.headingFont,
                          background: fontPreset === i ? `${selectedColor.primary}15` : 'rgba(255,255,255,0.03)',
                          border: `1.5px solid ${fontPreset === i ? selectedColor.primary : 'rgba(255,255,255,0.06)'}`,
                          color: fontPreset === i ? selectedColor.primary : 'rgba(255,255,255,0.35)',
                          transition: 'all 0.15s ease',
                        }}>
                        {fp.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zaoblenie rohov */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Zaoblenie rohov</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="range" min={0} max={32} value={borderRadius}
                      onChange={e => setBorderRadius(Number(e.target.value))}
                      className="konf-range"
                      style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', minWidth: 28, textAlign: 'right' }}>{borderRadius}px</span>
                  </div>
                </div>

                {/* Rýchlosť animácií */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Rýchlosť animácií</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="range" min={50} max={200} value={animSpeed}
                      onChange={e => setAnimSpeed(Number(e.target.value))}
                      className="konf-range"
                      style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', minWidth: 32, textAlign: 'right' }}>{animSpeed}%</span>
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Logo (voliteľné)</div>
                  <input ref={fileRef} type="file" accept=".png,.jpg,.jpeg,.svg,.webp" onChange={handleLogo} style={{ display: 'none' }} />
                  <div
                    onClick={() => fileRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className="konf-drop-zone"
                    style={{
                      padding: logoFile ? 10 : 16,
                      borderRadius: 10, cursor: 'pointer',
                      background: isDragging ? `${selectedColor.primary}08` : 'rgba(255,255,255,0.02)',
                      border: `2px dashed ${isDragging ? selectedColor.primary : logoFile ? `${selectedColor.primary}50` : 'rgba(255,255,255,0.06)'}`,
                      textAlign: 'center',
                    }}>
                    {logoFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <img src={logoFile} alt="logo preview" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'contain', background: 'rgba(255,255,255,0.05)', padding: 2 }} />
                        <div style={{ textAlign: 'left', flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{logoName}</div>
                          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Klik pre zmenu</div>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); setLogoFile(null); setLogoName(''); setLogoError(''); }}
                          style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 14 }}>
                          &times;
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 4px', display: 'block', opacity: 0.3 }}>
                          <path d="M9 16h6v-6h4l-7-7-7 7h4v6zm-4 2h14v2H5v-2z" fill="#fff" />
                        </svg>
                        <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)' }}>
                          Pretiahnite logo alebo kliknite
                        </div>
                        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.15)' }}>PNG, JPG, SVG — max 5 MB</div>
                      </>
                    )}
                  </div>
                  {logoError && (
                    <div style={{ marginTop: 6, fontSize: 11, color: '#ef4444', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444" /></svg>
                      {logoError}
                    </div>
                  )}
                </div>

                {/* Názov firmy */}
                <div className="konf-sidebar-section">
                  <div className="konf-sidebar-label">Názov firmy</div>
                  <input
                    value={form.firma}
                    onChange={e => setForm(f => ({ ...f, firma: e.target.value }))}
                    placeholder={previewText?.headline || 'Napr. Kaderníctvo Lucia'}
                    className="konf-input"
                    style={{
                      width: '100%', padding: '9px 12px', background: 'rgba(255,255,255,0.03)',
                      border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 8, color: '#fff',
                      fontSize: 13, fontFamily: font,
                    }}
                  />
                </div>

                {/* Reset */}
                <button onClick={resetTheme}
                  style={{
                    width: '100%', padding: '9px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', fontFamily: font,
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.3)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; e.currentTarget.style.color = '#ef4444'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; }}
                >
                  Resetovať na predvolené
                </button>
              </div>

              {/* ═══ RIGHT — LIVE PREVIEW ═══ */}
              <div className="konf-preview-wrap">
                <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ verticalAlign: 'middle', marginRight: 6 }}>
                    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14z" fill="rgba(255,255,255,0.5)" />
                  </svg>
                  Živý náhľad
                </div>

                <div style={{
                  position: 'relative', borderRadius: borderRadius, overflow: 'hidden',
                  border: `1px solid ${selectedColor.primary}20`,
                  boxShadow: `0 0 60px ${selectedColor.primary}08`,
                  transition: `all ${animSpeed / 100 * 0.4}s ease`,
                }}>
                  {/* Browser chrome */}
                  <div style={{
                    padding: '8px 14px', background: isLight ? '#e8e8e8' : '#1a1a1a',
                    display: 'flex', alignItems: 'center', gap: 8,
                    borderBottom: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
                  }}>
                    <div style={{ display: 'flex', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                    </div>
                    <div style={{
                      flex: 1, height: 24, borderRadius: 6, fontSize: 11, fontFamily: 'monospace',
                      background: isLight ? '#fff' : 'rgba(255,255,255,0.05)',
                      color: isLight ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.2)',
                      display: 'flex', alignItems: 'center', padding: '0 10px',
                    }}>
                      {form.firma ? `www.${form.firma.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '')}.sk` : 'www.vasafirma.sk'}
                    </div>
                  </div>

                  {/* ═══ VODOTLAČ — DEMO — VASSWEB.SK diagonálne ═══ */}
                  <div style={{ position: 'absolute', inset: 0, zIndex: 10, pointerEvents: 'none', overflow: 'hidden' }}>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-35deg)',
                      display: 'flex', flexDirection: 'column', gap: 60, opacity: 0.07,
                    }}>
                      {[0, 1, 2, 3, 4].map(row => (
                        <div key={row} style={{ display: 'flex', gap: 40, whiteSpace: 'nowrap' }}>
                          {[0, 1, 2, 3].map(col => (
                            <span key={col} style={{
                              fontSize: 18, fontWeight: 900, letterSpacing: '0.12em',
                              color: isLight ? '#000' : '#fff',
                              userSelect: 'none',
                            }}>DEMO — VASSWEB.SK</span>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ═══ Preview Content — kontextový podľa šablóny ═══ */}
                  <div style={{
                    background: selectedColor.bg, padding: 0, minHeight: 420,
                    transition: `background ${animSpeed / 100 * 0.4}s ease`,
                    position: 'relative',
                  }}>
                    {/* Navbar */}
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '14px 24px',
                      borderBottom: `1px solid ${subtleColor}`,
                      backdropFilter: 'blur(10px)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {logoFile ? (
                          <img src={logoFile} alt="logo" style={{ width: 30, height: 30, borderRadius: Math.min(borderRadius, 10), objectFit: 'contain' }} />
                        ) : (
                          <div style={{
                            width: 30, height: 30, borderRadius: Math.min(borderRadius, 10), background: selectedColor.primary,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 14, fontWeight: 900,
                            color: isLight ? '#fff' : '#000',
                          }}>
                            {(form.firma || previewText?.headline || 'V')[0].toUpperCase()}
                          </div>
                        )}
                        <span style={{ fontSize: 14, fontWeight: 700, color: textColor, fontFamily: fontPresets[fontPreset].bodyFont }}>
                          {form.firma || previewText?.headline || 'Vaša firma'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 18 }}>
                        {(previewText?.navItems || ['Služby', 'O nás', 'Kontakt']).map(l => (
                          <span key={l} style={{ fontSize: 11, color: mutedColor, fontWeight: 500, cursor: 'default', fontFamily: fontPresets[fontPreset].bodyFont }}>{l}</span>
                        ))}
                      </div>
                    </div>

                    {/* Hero */}
                    <div style={{ padding: '36px 24px 28px' }}>
                      <div style={{
                        fontSize: 9, color: selectedColor.primary, fontWeight: 700,
                        letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10,
                        fontFamily: fontPresets[fontPreset].bodyFont,
                      }}>
                        {previewText?.tagline || selectedTmpl?.name || 'Profesionálne služby'}
                      </div>
                      <h3 style={{
                        fontFamily: fontPresets[fontPreset].headingFont, fontSize: 24, fontWeight: 800, color: textColor,
                        marginBottom: 10, lineHeight: 1.25,
                      }}>
                        Vitajte v{' '}
                        <span style={{ color: selectedColor.primary }}>{form.firma || previewText?.headline || 'Vašej firme'}</span>
                      </h3>
                      <p style={{ fontSize: 12, color: mutedColor, lineHeight: 1.65, marginBottom: 18, maxWidth: 360, fontFamily: fontPresets[fontPreset].bodyFont }}>
                        {previewText?.heroDesc || 'Profesionálne služby pre vás a vašu rodinu. Kontaktujte nás ešte dnes a presvedčte sa sami.'}
                      </p>
                      <div style={{ display: 'flex', gap: 10 }}>
                        <div style={{
                          padding: '9px 20px', borderRadius: Math.min(borderRadius, 12),
                          background: selectedColor.primary,
                          color: isLight ? '#fff' : '#000',
                          fontSize: 12, fontWeight: 700,
                          fontFamily: fontPresets[fontPreset].bodyFont,
                        }}>Kontaktujte nás</div>
                        <div style={{
                          padding: '9px 20px', borderRadius: Math.min(borderRadius, 12),
                          border: `1.5px solid ${selectedColor.primary}40`,
                          color: selectedColor.primary, fontSize: 12, fontWeight: 600,
                          fontFamily: fontPresets[fontPreset].bodyFont,
                        }}>{previewText?.navItems?.[0] || 'Naše služby'}</div>
                      </div>
                    </div>

                    {/* Features */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, padding: '0 24px 20px' }}>
                      {(selectedTmpl?.features || ['Kvalita', 'Rýchlosť', 'Spoľahlivosť']).map((f, i) => (
                        <div key={f} style={{
                          padding: 14, borderRadius: Math.min(borderRadius, 12),
                          background: `${selectedColor.primary}06`,
                          border: `1px solid ${selectedColor.primary}10`,
                          textAlign: 'center',
                        }}>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 6px', display: 'block' }}>
                            <path d={featureIcons[i % 3]} fill={selectedColor.primary} opacity="0.7" />
                          </svg>
                          <div style={{ fontSize: 11, fontWeight: 600, color: textColor, fontFamily: fontPresets[fontPreset].bodyFont }}>{f}</div>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div style={{
                      padding: '14px 24px',
                      borderTop: `1px solid ${subtleColor}`,
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 10, color: mutedColor, fontFamily: fontPresets[fontPreset].bodyFont }}>
                        &copy; 2026 {form.firma || previewText?.headline || 'Vaša firma'}
                      </span>
                      <span style={{ fontSize: 10, color: mutedColor }}>
                        Vytvoril{' '}
                        <span style={{ color: selectedColor.primary, fontWeight: 600 }}>Vassweb</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ═══ PRICE CALCULATOR ═══ */}
            <div style={{ marginTop: 28, padding: '24px 28px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h3 style={{ fontFamily: heading, fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#fff' }}>Kalkulačka ceny</h3>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', margin: 0 }}>Odhadnite cenu — nezáväzne</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>Odhadovaná cena</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: selectedColor.primary, fontFamily: heading, lineHeight: 1 }}>{calcTotal}€</div>
                  {calcMaintenance > 0 && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>+ {calcMaintenance}€/mes</div>}
                </div>
              </div>

              {/* Packages */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Balík</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                  {packages.map(pkg => {
                    const isSel = calcPackage === pkg.id;
                    return (
                      <button key={pkg.id} onClick={() => setCalcPackage(pkg.id)}
                        style={{
                          padding: '14px 12px', borderRadius: 12, cursor: 'pointer', textAlign: 'left',
                          background: isSel ? `${selectedColor.primary}12` : 'rgba(255,255,255,0.02)',
                          border: `2px solid ${isSel ? selectedColor.primary : 'rgba(255,255,255,0.05)'}`,
                          color: '#fff', transition: 'all 0.2s ease', fontFamily: font,
                        }}>
                        <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2, color: isSel ? selectedColor.primary : '#fff' }}>{pkg.name}</div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: isSel ? selectedColor.primary : 'rgba(255,255,255,0.7)', marginBottom: 6 }}>{pkg.price}€</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', lineHeight: 1.4 }}>{pkg.desc}</div>
                        {pkg.includes.length > 0 && (
                          <div style={{ marginTop: 6, fontSize: 10, color: isSel ? `${selectedColor.primary}80` : 'rgba(255,255,255,0.2)' }}>
                            Zahŕňa {pkg.includes.length} doplnkov
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Add-ons */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Doplnky à la carte</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
                  {addonsList.map(addon => {
                    const isChecked = calcAddons.has(addon.id);
                    const isIncluded = currentPkg.includes.includes(addon.id);
                    return (
                      <button key={addon.id} onClick={() => {
                        if (isIncluded) return;
                        setCalcAddons(prev => {
                          const next = new Set(prev);
                          if (next.has(addon.id)) next.delete(addon.id); else next.add(addon.id);
                          return next;
                        });
                      }}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10,
                          cursor: isIncluded ? 'default' : 'pointer',
                          background: isChecked || isIncluded ? `${selectedColor.primary}08` : 'rgba(255,255,255,0.02)',
                          border: `1.5px solid ${isChecked || isIncluded ? selectedColor.primary + '40' : 'rgba(255,255,255,0.05)'}`,
                          color: '#fff', transition: 'all 0.2s ease', textAlign: 'left', opacity: isIncluded ? 0.65 : 1,
                          fontFamily: font,
                        }}>
                        <div style={{
                          width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                          background: isChecked || isIncluded ? selectedColor.primary : 'rgba(255,255,255,0.05)',
                          border: `1.5px solid ${isChecked || isIncluded ? selectedColor.primary : 'rgba(255,255,255,0.15)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {(isChecked || isIncluded) && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill={isLight ? '#fff' : '#000'} />
                            </svg>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.3 }}>{addon.name}</div>
                          <div style={{ fontSize: 11, color: isIncluded ? selectedColor.primary : 'rgba(255,255,255,0.35)' }}>
                            {isIncluded ? 'V balíku' : `+${addon.price}€${addon.monthly ? '/mes' : ''}`}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Smart tip */}
              {smartTip && (
                <div style={{
                  marginTop: 16, padding: '12px 16px', borderRadius: 10,
                  background: `${selectedColor.primary}10`, border: `1px solid ${selectedColor.primary}25`,
                  display: 'flex', alignItems: 'flex-start', gap: 10,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26C17.81 13.47 19 11.38 19 9c0-3.86-3.14-7-7-7z" fill={selectedColor.primary} />
                  </svg>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selectedColor.primary, marginBottom: 2 }}>Tip na úsporu</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>{smartTip.text}</div>
                    <button onClick={() => setCalcPackage(smartTip.targetPackage)}
                      style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: selectedColor.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textDecoration: 'underline' }}>
                      Prepnúť na balík {packages.find(p => p.id === smartTip.targetPackage)?.name}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 32 }}>
              <button onClick={() => setStep(1)} className="konf-btn-secondary"
                style={{ padding: '13px 28px', borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="rgba(255,255,255,0.35)" />
                </svg>
                Späť
              </button>
              <button onClick={() => setStep(3)} className="konf-btn-primary"
                style={{ padding: '13px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font, cursor: 'pointer', background: `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`, color: isLight ? '#fff' : '#000', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Ďalej — Kontakt
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke={isLight ? '#fff' : '#000'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* STEP 3 — KONTAKT                                      */}
        {/* ═══════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div key={`step3-${animKey}`} style={{ animation: 'konfFadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both', maxWidth: 580, margin: '0 auto' }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6, textAlign: 'center', fontFamily: heading }}>Povedzte nám o sebe</h2>
            <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.62)', fontSize: 14, marginBottom: 24 }}>Ozveme sa do 24 hodín s návrhom a cenovou ponukou.</p>

            {/* Recap card */}
            <div style={{
              padding: 18, borderRadius: 14, marginBottom: 16,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)',
            }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {selectedTmpl && <TemplateIcon id={selectedTmpl.id} color={selectedColor.primary} size={32} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedTmpl?.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Šablóna</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: selectedColor.primary, border: '2px solid rgba(255,255,255,0.1)' }} />
                  {logoFile && <img src={logoFile} alt="" style={{ width: 22, height: 22, borderRadius: 6, objectFit: 'contain' }} />}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', marginBottom: 2 }}>
                    Balík <strong style={{ color: selectedColor.primary }}>{currentPkg.name}</strong>
                    {[...calcAddons].filter(id => id !== 'maintenance').length > 0 && (
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}> + {[...calcAddons].filter(id => id !== 'maintenance').length} doplnk{[...calcAddons].filter(id => id !== 'maintenance').length === 1 ? '' : 'y'}</span>
                    )}
                  </div>
                  {calcMaintenance > 0 && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>+ {calcMaintenance}€/mes údržba</div>}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: selectedColor.primary, fontFamily: heading }}>{calcTotal}€</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>odhadovaná cena</div>
                </div>
              </div>
            </div>

            {/* Timeline / proces */}
            <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                { step: '1', label: 'Dnes', desc: 'Odoslanie formulára' },
                { step: '2', label: '24h', desc: 'Cenová ponuka' },
                { step: '3', label: '14 dní', desc: 'Hotový web' },
              ].map((s, i) => (
                <div key={i} style={{ flex: 1, padding: '12px 10px', textAlign: 'center', background: i === 0 ? `${selectedColor.primary}15` : 'rgba(255,255,255,0.02)', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: i === 0 ? selectedColor.primary : 'rgba(255,255,255,0.4)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Názov firmy <span style={{ color: selectedColor.primary }}>*</span>
                </label>
                <input value={form.firma} onChange={e => setForm(f => ({ ...f, firma: e.target.value }))}
                  placeholder="Napr. Kaderníctvo Lucia" className="konf-input"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Vaše meno</label>
                  <input value={form.meno} onChange={e => setForm(f => ({ ...f, meno: e.target.value }))}
                    placeholder="Meno a priezvisko" className="konf-input"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Telefón</label>
                  <input value={form.telefon} onChange={e => setForm(f => ({ ...f, telefon: e.target.value }))}
                    placeholder="+421 9XX XXX XXX" className="konf-input"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>
                  Email <span style={{ color: selectedColor.primary }}>*</span>
                </label>
                <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="vas@email.sk" type="email" className="konf-input"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Existujúca webstránka</label>
                <input value={form.web} onChange={e => setForm(f => ({ ...f, web: e.target.value }))}
                  placeholder="www.priklad.sk" className="konf-input"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font }} />
              </div>

              <div>
                <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Čo by ste chceli na webe?</label>
                <textarea value={form.poznamky} onChange={e => setForm(f => ({ ...f, poznamky: e.target.value }))} rows={3}
                  placeholder="Napr. galériu prác, online rezerváciu, jedálny lístok..." className="konf-input"
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.02)', border: '1.5px solid rgba(255,255,255,0.06)', borderRadius: 10, color: '#fff', fontSize: 14, fontFamily: font, resize: 'vertical' }} />
              </div>
            </div>

            {/* Navigation */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginTop: 28 }}>
              <button onClick={() => setStep(2)} className="konf-btn-secondary"
                style={{ padding: '13px 28px', borderRadius: 12, fontSize: 13, fontWeight: 600, fontFamily: font, cursor: 'pointer', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill="rgba(255,255,255,0.35)" />
                </svg>
                Späť
              </button>
              <button onClick={handleSubmit} disabled={sending || !form.firma || !form.email} className="konf-btn-primary"
                style={{
                  padding: '13px 40px', borderRadius: 12, fontSize: 15, fontWeight: 700, fontFamily: font,
                  cursor: (!form.firma || !form.email) ? 'not-allowed' : 'pointer',
                  background: (!form.firma || !form.email) ? 'rgba(255,255,255,0.03)' : `linear-gradient(135deg, ${selectedColor.primary}, ${selectedColor.primary}cc)`,
                  color: (!form.firma || !form.email) ? 'rgba(255,255,255,0.15)' : (isLight ? '#fff' : '#000'),
                  border: 'none', opacity: (!form.firma || !form.email) ? 0.5 : 1,
                }}>
                {sending ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke={isLight ? '#fff' : '#000'} strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    Odosielam...
                  </span>
                ) : (
                  <>
                    Odoslať — Chcem web!
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginLeft: 8, verticalAlign: 'middle' }}>
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill={isLight ? '#fff' : '#000'} />
                    </svg>
                  </>
                )}
              </button>
              {submitError && (
                <div style={{ marginTop: 12, fontSize: 13, color: '#ef4444', textAlign: 'center' }}>{submitError}</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(255,255,255,0.03)', fontSize: 12, color: 'rgba(255,255,255,0.15)' }}>
        &copy; 2026 Vassweb — VVD s.r.o. |{' '}
        <a href="https://vassweb.sk" style={{ color: '#d4a843', textDecoration: 'none', fontWeight: 600 }}>vassweb.sk</a>
      </footer>
    </div>
    </>
  );
}

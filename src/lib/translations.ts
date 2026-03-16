export type Locale = 'sk' | 'en' | 'cs' | 'hu';

export interface Translations {
  locale: Locale;
  hero: {
    line1: string;
    line2: string;
    typewriter: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  services: {
    label: string;
    heading: string;
    items: Array<{ title: string; desc: string }>;
  };
  about: {
    label: string;
    heading: string;
    stats: Array<{ num: string; lbl: string; desc: string; suffix: string }>;
    tagline: string;
  };
  benefits: {
    label: string;
    heading: string;
    items: Array<{ title: string; desc: string }>;
  };
  process: {
    label: string;
    heading: string;
    steps: Array<{ step: string; title: string; desc: string }>;
  };
  pricing: {
    label: string;
    heading: string;
    note: string;
    popular: string;
    selected: string;
    from: string;
    cta: string;
    plans: Array<{ name: string; price: string; featured: boolean; features: string[] }>;
  };
  contact: {
    label: string;
    heading1: string;
    heading2: string;
    subtext: string;
    namePlaceholder: string;
    emailPlaceholder: string;
    messagePlaceholder: string;
    sendBtn: string;
    sendingBtn: string;
    successTitle: string;
    successText: string;
    sendAnother: string;
    errorDefault: string;
    errorNetwork: string;
    nameLabel: string;
    emailLabel: string;
    messageLabel: string;
  };
  footer: {
    tagline: string;
    navHeading: string;
    navLinks: Array<{ label: string; href: string }>;
    contactHeading: string;
    legalHeading: string;
    privacy: string;
    terms: string;
    copyright: string;
  };
  navbar: {
    links: Array<{ label: string; href: string }>;
    langLabel: string;
  };
  faq: {
    label: string;
    heading: string;
    items: Array<{ question: string; answer: string }>;
  };
  testimonials: {
    label: string;
    heading: string;
    items: Array<{ name: string; role: string; text: string }>;
  };
  portfolio: {
    label: string;
    heading: string;
    subtext: string;
    viewProject: string;
    items: Array<{ title: string; category: string; desc: string; tags: string[]; href?: string }>;
    viewDemo: string;
  };
  cookieBanner: {
    text: string;
    accept: string;
    decline: string;
  };
}

const sk: Translations = {
  locale: 'sk',
  hero: {
    line1: 'Menej práce.',
    line2: 'Viac výsledkov.',
    typewriter: 'Tvoríme weby, automatizácie a AI riešenia, ktoré šetria čas a zarábajú peniaze',
    ctaPrimary: 'Začnime spoluprácu',
    ctaSecondary: 'Naše služby',
  },
  services: {
    label: 'Čo ponúkame',
    heading: 'Naše služby',
    items: [
      { title: 'Webové stránky', desc: 'Stránka, ktorá predáva — rýchla, optimalizovaná a navrhnutá tak, aby z návštevníkov robila zákazníkov.' },
      { title: 'AI Riešenia', desc: 'Chatbot, ktorý odpovedá za vás. AI, ktorá analyzuje dáta. Šetríme vám hodiny práce denne.' },
      { title: 'Automatizácia', desc: 'Faktúry, e-maily, reporty — nechajte rutinnú prácu na nás a venujte sa tomu, v čom ste najlepší.' },
      { title: 'Aplikácie', desc: 'Webové a mobilné aplikácie presne podľa vašich potrieb — od jednoduchých nástrojov po komplexné systémy.' },
    ],
  },
  about: {
    label: 'Prečo my',
    heading: 'Prečo Vassweb?',
    stats: [
      { num: '3', lbl: 'konverzia', desc: 'Naši klienti majú v priemere 3× viac dopytov po spustení nového webu', suffix: '×' },
      { num: 'AI', lbl: 'native', desc: 'AI nie je doplnok — je základ všetkého, čo robíme', suffix: '' },
      { num: '100', lbl: 'spokojnosť', desc: 'Žiadny projekt neopúšťame, kým nie ste nadšení z výsledku', suffix: '%' },
    ],
    tagline: 'Veríme, že technológia nemá byť zložitá. Preto ju robíme jednoducho — tak, aby fungovala pre vás, nie naopak.',
  },
  benefits: {
    label: 'Čo získate',
    heading: 'Kvalita v každom detaile',
    items: [
      { title: 'Rýchlosť', desc: 'Stránky, ktoré sa načítajú pod 2 sekundy' },
      { title: 'Bezpečnosť', desc: 'SSL, šifrovanie a ochrana dát' },
      { title: 'Responzívnosť', desc: 'Perfektne na mobile aj desktope' },
      { title: 'SEO', desc: 'Optimalizácia pre vyhľadávače od začiatku' },
      { title: 'Údržba', desc: 'Pravidelné aktualizácie a monitoring' },
      { title: 'Analytika', desc: 'Dáta o návštevnosti a konverziách' },
    ],
  },
  process: {
    label: 'Postup',
    heading: 'Ako pracujeme',
    steps: [
      { step: '01', title: 'Konzultácia', desc: 'Stretneme sa, vypočujeme vaše potreby a navrhneme riešenie — bez záväzkov.' },
      { step: '02', title: 'Návrh', desc: 'Pripravíme dizajn a plán projektu. Nič sa nerobí, kým neodsúhlasíte.' },
      { step: '03', title: 'Vývoj', desc: 'Staviame iteratívne — priebežne ukazujeme pokrok a zapracovávame vaše pripomienky.' },
      { step: '04', title: 'Spustenie', desc: 'Nasadíme, otestujeme na všetkých zariadeniach a zabezpečíme hladký štart.' },
    ],
  },
  pricing: {
    label: 'Cenník',
    heading: 'Transparentné ceny',
    note: 'Všetky ceny sú bez DPH. Konečná cena závisí od rozsahu projektu.',
    popular: 'Najobľúbenejší',
    selected: 'Vybraný',
    from: 'od',
    cta: 'Kontaktovať',
    plans: [
      { name: 'Starter', price: '1 500', featured: false, features: ['Responzívna webstránka', 'Až 5 podstránok', 'Kontaktný formulár', 'SEO optimalizácia', 'SSL certifikát'] },
      { name: 'Business', price: '3 500', featured: true, features: ['Všetko zo Starter', 'Až 15 podstránok', 'CMS systém', 'AI chatbot integrácia', 'Analytika a reporting', 'E-mail automatizácia'] },
      { name: 'Premium', price: '6 000+', featured: false, features: ['Všetko z Business', 'Vlastná aplikácia', 'Pokročilá AI integrácia', 'Workflow automatizácia', 'Prioritná podpora', 'Individuálny vývoj'] },
    ],
  },
  contact: {
    label: 'Kontakt',
    heading1: 'Poďme na to',
    heading2: 'spoločne',
    subtext: 'Prvá konzultácia je zadarmo a bez záväzkov. Povedzte nám o vašom projekte a my navrhneme, ako ho posunúť ďalej.',
    namePlaceholder: 'Vaše meno',
    emailPlaceholder: 'Váš e-mail',
    messagePlaceholder: 'Opíšte váš projekt alebo potrebu...',
    sendBtn: 'Odoslať správu',
    sendingBtn: 'Odosielam...',
    successTitle: 'Ďakujeme!',
    successText: 'Vašu správu sme prijali. Ozveme sa vám do 24 hodín.',
    sendAnother: 'Odoslať ďalšiu správu',
    errorDefault: 'Nastala chyba. Skúste to znova.',
    errorNetwork: 'Nepodarilo sa pripojiť k serveru. Skúste to znova.',
    nameLabel: 'Meno',
    emailLabel: 'E-mail',
    messageLabel: 'Správa',
  },
  footer: {
    tagline: 'Váš partner pre digitálnu transformáciu',
    navHeading: 'Navigácia',
    navLinks: [
      { label: 'Služby', href: '#sluzby' },
      { label: 'O nás', href: '#o-nas' },
      { label: 'Proces', href: '#proces' },
      { label: 'Cenník', href: '#cennik' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    contactHeading: 'Kontakt',
    legalHeading: 'Právne',
    privacy: 'Ochrana osobných údajov',
    terms: 'Obchodné podmienky',
    copyright: '© 2026 Vassweb s.r.o. Všetky práva vyhradené.',
  },
  navbar: {
    links: [
      { label: 'Služby', href: '#sluzby' },
      { label: 'O nás', href: '#o-nas' },
      { label: 'Proces', href: '#proces' },
      { label: 'Cenník', href: '#cennik' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    langLabel: 'SK',
  },
  faq: {
    label: 'FAQ',
    heading: 'Časté otázky',
    items: [
      { question: 'Ako dlho trvá vytvorenie webstránky?', answer: 'Štandardný web trvá 2–4 týždne od schválenia návrhu. Zložitejšie projekty s vlastnou aplikáciou alebo AI integráciou môžu trvať 4–8 týždňov.' },
      { question: 'Koľko stojí web?', answer: 'Ceny začínajú od 1 500 € za jednoduchý responzívny web. Konečná cena závisí od rozsahu — po bezplatnej konzultácii vám pripravíme presnú cenovú ponuku.' },
      { question: 'Čo ak potrebujem zmeny po spustení?', answer: 'Poskytujeme ongoing podporu a údržbu. Menšie úpravy sú často zahrnuté v balíku, väčšie zmeny nacením individuálne.' },
      { question: 'Pracujete aj s firmami mimo Slovenska?', answer: 'Áno! Pracujeme s klientmi z celej Európy. Komunikujeme v slovenčine, češtine, maďarčine a angličtine.' },
      { question: 'Ako funguje AI integrácia?', answer: 'Podľa vašich potrieb implementujeme AI chatboty, automatické analýzy dát, smart formuláre alebo workflow automatizácie. Všetko prispôsobíme vašim procesom.' },
      { question: 'Aký hosting odporúčate?', answer: 'Väčšinu projektov nasadzujeme na Vercel — je rýchly, bezpečný a škálovateľný. Pre špecifické potreby ponúkame aj vlastné riešenia.' },
    ],
  },
  testimonials: {
    label: 'Referencie',
    heading: 'Čo hovoria naši klienti',
    items: [
      { name: 'Klient', role: 'CEO, technologická firma', text: 'Nový web konvertuje 3x lepšie ako predtým. Profesionálny prístup a rýchle dodanie.' },
      { name: 'Klient', role: 'Marketing manažér', text: 'AI chatbot nám ušetril 20 hodín týždenne na zákazníckej podpore. Odporúčam každému.' },
      { name: 'Klient', role: 'Konateľ, konzultačná firma', text: 'Od konzultácie po spustenie — všetko prebehlo hladko. Konečne mám web, na ktorý som hrdý.' },
    ],
  },
  portfolio: {
    label: 'Portfólio',
    heading: 'Naše práce',
    subtext: 'Vybrané projekty, na ktoré sme hrdí. Kliknite a pozrite si živú ukážku.',
    viewProject: 'Zobraziť projekt',
    viewDemo: 'Živá ukážka',
    items: [
      { title: 'La Cucina Reštaurácia', category: 'Web + Rezervácie', desc: 'Elegantná stránka pre reštauráciu s online rezerváciami, galériou jedál a interaktívnym menu.', tags: ['Dizajn', 'Rezervácie', 'Responzivita'], href: '/demo/restaurant' },
      { title: 'ModaShop E-commerce', category: 'E-shop + AI', desc: 'Moderný e-shop s produktovým katalógom, košíkom a AI odporúčaniami. Pripravený na predaj.', tags: ['Next.js', 'E-shop', 'AI'], href: '/demo/eshop' },
      { title: 'BuildPro Stavebná firma', category: 'Firemný web', desc: 'Profesionálna firemná prezentácia so službami, portfóliom projektov a kontaktným formulárom.', tags: ['B2B', 'SEO', 'Animácie'], href: '/demo/firma' },
      { title: 'Portfólio Dizajnéra', category: 'Portfólio', desc: 'Kreatívne portfólio s filtrovanými projektmi, skill barmi a moderným minimalistickým dizajnom.', tags: ['Portfólio', 'Dizajn', 'Freelancer'], href: '/demo/portfolio' },
      { title: 'FitZone Fitness', category: 'Web + Aplikácia', desc: 'Dynamická stránka pre fitness štúdio s rozvrhom, trénermi, cenníkom a online registráciou.', tags: ['Fitness', 'Booking', 'PWA'], href: '/demo/fitness' },
      { title: 'AI & Automatizácia', category: 'AI + Automatizácia', desc: 'Interaktívne demo AI chatbotu, email automatizácie, automatickej fakturácie a real-time analytiky.', tags: ['AI', 'Chatbot', 'Automatizácia'], href: '/demo-app/ai-automation' },
      { title: 'Rezervačný systém', category: 'Aplikácia', desc: 'Kompletný booking systém s kalendárom, časovými slotmi, admin panelom a notifikáciami.', tags: ['Booking', 'Kalendár', 'Admin'], href: '/demo-app/booking' },
      { title: 'CRM Dashboard', category: 'Aplikácia', desc: 'Moderný CRM s pipeline kanbanom, správou klientov, grafmi príjmov a aktivitami.', tags: ['CRM', 'Dashboard', 'Kanban'], href: '/demo-app/crm' },
    ],
  },
  cookieBanner: {
    text: 'Používame cookies na analýzu návštevnosti (Google Analytics). Súhlasíte?',
    accept: 'Súhlasím',
    decline: 'Odmietnuť',
  },
};

const en: Translations = {
  locale: 'en',
  hero: {
    line1: 'Less work.',
    line2: 'More results.',
    typewriter: 'We build websites, automations and AI solutions that save time and earn money',
    ctaPrimary: "Let's work together",
    ctaSecondary: 'Our services',
  },
  services: {
    label: 'What we offer',
    heading: 'Our Services',
    items: [
      { title: 'Websites', desc: 'A site that sells — fast, optimised and designed to turn visitors into customers.' },
      { title: 'AI Solutions', desc: 'A chatbot that answers for you. AI that analyses data. We save you hours of work every day.' },
      { title: 'Automation', desc: 'Invoices, emails, reports — let us handle the routine work so you can focus on what you do best.' },
      { title: 'Applications', desc: 'Web and mobile applications tailored to your needs — from simple tools to complex systems.' },
    ],
  },
  about: {
    label: 'Why us',
    heading: 'Why Vassweb?',
    stats: [
      { num: '3', lbl: 'conversion', desc: 'Our clients get on average 3× more enquiries after launching their new website', suffix: '×' },
      { num: 'AI', lbl: 'native', desc: "AI isn't an add-on — it's the foundation of everything we do", suffix: '' },
      { num: '100', lbl: 'satisfaction', desc: "We don't leave a project until you're thrilled with the result", suffix: '%' },
    ],
    tagline: "We believe technology shouldn't be complicated. So we make it simple — working for you, not the other way around.",
  },
  benefits: {
    label: 'What you get',
    heading: 'Quality in every detail',
    items: [
      { title: 'Speed', desc: 'Pages that load in under 2 seconds' },
      { title: 'Security', desc: 'SSL, encryption and data protection' },
      { title: 'Responsive', desc: 'Perfect on mobile and desktop' },
      { title: 'SEO', desc: 'Search engine optimisation from day one' },
      { title: 'Maintenance', desc: 'Regular updates and monitoring' },
      { title: 'Analytics', desc: 'Traffic and conversion data' },
    ],
  },
  process: {
    label: 'Process',
    heading: 'How we work',
    steps: [
      { step: '01', title: 'Consultation', desc: 'We meet, listen to your needs and propose a solution — no commitment required.' },
      { step: '02', title: 'Design', desc: 'We prepare the design and project plan. Nothing moves forward until you approve it.' },
      { step: '03', title: 'Development', desc: 'We build iteratively — showing progress along the way and incorporating your feedback.' },
      { step: '04', title: 'Launch', desc: 'We deploy, test on all devices and ensure a smooth go-live.' },
    ],
  },
  pricing: {
    label: 'Pricing',
    heading: 'Transparent Pricing',
    note: 'All prices exclude VAT. Final price depends on project scope.',
    popular: 'Most Popular',
    selected: 'Selected',
    from: 'from',
    cta: 'Get in touch',
    plans: [
      { name: 'Starter', price: '1 500', featured: false, features: ['Responsive website', 'Up to 5 sub-pages', 'Contact form', 'SEO optimisation', 'SSL certificate'] },
      { name: 'Business', price: '3 500', featured: true, features: ['Everything in Starter', 'Up to 15 sub-pages', 'CMS system', 'AI chatbot integration', 'Analytics & reporting', 'Email automation'] },
      { name: 'Premium', price: '6 000+', featured: false, features: ['Everything in Business', 'Custom application', 'Advanced AI integration', 'Workflow automation', 'Priority support', 'Custom development'] },
    ],
  },
  contact: {
    label: 'Contact',
    heading1: "Let's do this",
    heading2: 'together',
    subtext: 'The first consultation is free and non-binding. Tell us about your project and we will suggest how to move it forward.',
    namePlaceholder: 'Your name',
    emailPlaceholder: 'Your email',
    messagePlaceholder: 'Describe your project or need...',
    sendBtn: 'Send message',
    sendingBtn: 'Sending...',
    successTitle: 'Thank you!',
    successText: 'We have received your message. We will get back to you within 24 hours.',
    sendAnother: 'Send another message',
    errorDefault: 'An error occurred. Please try again.',
    errorNetwork: 'Could not connect to the server. Please try again.',
    nameLabel: 'Name',
    emailLabel: 'Email',
    messageLabel: 'Message',
  },
  footer: {
    tagline: 'Your partner for digital transformation',
    navHeading: 'Navigation',
    navLinks: [
      { label: 'Services', href: '#sluzby' },
      { label: 'About', href: '#o-nas' },
      { label: 'Process', href: '#proces' },
      { label: 'Pricing', href: '#cennik' },
      { label: 'Contact', href: '#kontakt' },
    ],
    contactHeading: 'Contact',
    legalHeading: 'Legal',
    privacy: 'Privacy Policy',
    terms: 'Terms & Conditions',
    copyright: '© 2026 Vassweb s.r.o. All rights reserved.',
  },
  navbar: {
    links: [
      { label: 'Services', href: '#sluzby' },
      { label: 'About', href: '#o-nas' },
      { label: 'Process', href: '#proces' },
      { label: 'Pricing', href: '#cennik' },
      { label: 'Contact', href: '#kontakt' },
    ],
    langLabel: 'EN',
  },
  faq: {
    label: 'FAQ',
    heading: 'Frequently Asked Questions',
    items: [
      { question: 'How long does it take to build a website?', answer: 'A standard website takes 2–4 weeks from design approval. More complex projects with custom apps or AI integration may take 4–8 weeks.' },
      { question: 'How much does a website cost?', answer: 'Prices start from €1,500 for a simple responsive website. The final price depends on scope — after a free consultation we will prepare an exact quote.' },
      { question: 'What if I need changes after launch?', answer: 'We provide ongoing support and maintenance. Minor tweaks are often included in the package, larger changes are quoted individually.' },
      { question: 'Do you work with companies outside Slovakia?', answer: 'Yes! We work with clients across Europe. We communicate in Slovak, Czech, Hungarian and English.' },
      { question: 'How does AI integration work?', answer: 'Based on your needs, we implement AI chatbots, automated data analysis, smart forms or workflow automations. Everything is tailored to your processes.' },
      { question: 'What hosting do you recommend?', answer: 'We deploy most projects on Vercel — it is fast, secure and scalable. For specific needs we also offer custom solutions.' },
    ],
  },
  testimonials: {
    label: 'Testimonials',
    heading: 'What our clients say',
    items: [
      { name: 'Client', role: 'CEO, tech company', text: 'The new website converts 3x better than before. Professional approach and fast delivery.' },
      { name: 'Client', role: 'Marketing Manager', text: 'The AI chatbot saved us 20 hours per week on customer support. Highly recommended.' },
      { name: 'Client', role: 'Managing Director, consulting firm', text: 'From consultation to launch — everything went smoothly. I finally have a website I am proud of.' },
    ],
  },
  portfolio: {
    label: 'Portfolio',
    heading: 'Our Work',
    subtext: 'Selected projects we are proud of. Click to see a live demo.',
    viewProject: 'View project',
    viewDemo: 'Live demo',
    items: [
      { title: 'La Cucina Restaurant', category: 'Web + Bookings', desc: 'Elegant restaurant website with online reservations, food gallery and interactive menu.', tags: ['Design', 'Bookings', 'Responsive'], href: '/demo/restaurant' },
      { title: 'ModaShop E-commerce', category: 'E-shop + AI', desc: 'Modern e-shop with product catalog, cart and AI recommendations. Ready to sell.', tags: ['Next.js', 'E-shop', 'AI'], href: '/demo/eshop' },
      { title: 'BuildPro Construction', category: 'Corporate', desc: 'Professional company website with services, project portfolio and contact form.', tags: ['B2B', 'SEO', 'Animations'], href: '/demo/firma' },
      { title: 'Designer Portfolio', category: 'Portfolio', desc: 'Creative portfolio with filtered projects, skill bars and modern minimalist design.', tags: ['Portfolio', 'Design', 'Freelancer'], href: '/demo/portfolio' },
      { title: 'FitZone Fitness', category: 'Web + App', desc: 'Dynamic fitness studio website with schedule, trainers, pricing and online registration.', tags: ['Fitness', 'Booking', 'PWA'], href: '/demo/fitness' },
      { title: 'AI & Automation', category: 'AI + Automation', desc: 'Interactive demo of AI chatbot, email automation, auto-invoicing and real-time analytics dashboard.', tags: ['AI', 'Chatbot', 'Automation'], href: '/demo-app/ai-automation' },
      { title: 'Booking System', category: 'Application', desc: 'Complete booking system with calendar, time slots, admin panel and notifications.', tags: ['Booking', 'Calendar', 'Admin'], href: '/demo-app/booking' },
      { title: 'CRM Dashboard', category: 'Application', desc: 'Modern CRM with pipeline kanban, client management, revenue charts and activity feed.', tags: ['CRM', 'Dashboard', 'Kanban'], href: '/demo-app/crm' },
    ],
  },
  cookieBanner: {
    text: 'We use cookies for traffic analysis (Google Analytics). Do you agree?',
    accept: 'Accept',
    decline: 'Decline',
  },
};

const cs: Translations = {
  locale: 'cs',
  hero: {
    line1: 'Méně práce.',
    line2: 'Více výsledků.',
    typewriter: 'Tvoříme weby, automatizace a AI řešení, která šetří čas a vydělávají peníze',
    ctaPrimary: 'Začněme spolupráci',
    ctaSecondary: 'Naše služby',
  },
  services: {
    label: 'Co nabízíme',
    heading: 'Naše služby',
    items: [
      { title: 'Webové stránky', desc: 'Stránka, která prodává — rychlá, optimalizovaná a navržená tak, aby z návštěvníků dělala zákazníky.' },
      { title: 'AI Řešení', desc: 'Chatbot, který odpovídá za vás. AI, která analyzuje data. Šetříme vám hodiny práce denně.' },
      { title: 'Automatizace', desc: 'Faktury, e-maily, reporty — nechte rutinní práci na nás a věnujte se tomu, v čem jste nejlepší.' },
      { title: 'Aplikace', desc: 'Webové a mobilní aplikace přesně podle vašich potřeb — od jednoduchých nástrojů po komplexní systémy.' },
    ],
  },
  about: {
    label: 'Proč my',
    heading: 'Proč Vassweb?',
    stats: [
      { num: '3', lbl: 'konverze', desc: 'Naši klienti mají v průměru 3× více poptávek po spuštění nového webu', suffix: '×' },
      { num: 'AI', lbl: 'native', desc: 'AI není doplněk — je základem všeho, co děláme', suffix: '' },
      { num: '100', lbl: 'spokojenost', desc: 'Žádný projekt neopouštíme, dokud nejste nadšení z výsledku', suffix: '%' },
    ],
    tagline: 'Věříme, že technologie nemusí být složitá. Proto ji děláme jednoduše — tak, aby fungovala pro vás, ne naopak.',
  },
  benefits: {
    label: 'Co získáte',
    heading: 'Kvalita v každém detailu',
    items: [
      { title: 'Rychlost', desc: 'Stránky, které se načtou pod 2 sekundy' },
      { title: 'Bezpečnost', desc: 'SSL, šifrování a ochrana dat' },
      { title: 'Responzivita', desc: 'Perfektně na mobilu i desktopu' },
      { title: 'SEO', desc: 'Optimalizace pro vyhledávače od začátku' },
      { title: 'Údržba', desc: 'Pravidelné aktualizace a monitoring' },
      { title: 'Analytika', desc: 'Data o návštěvnosti a konverzích' },
    ],
  },
  process: {
    label: 'Postup',
    heading: 'Jak pracujeme',
    steps: [
      { step: '01', title: 'Konzultace', desc: 'Setkáme se, vyslechneme vaše potřeby a navrhneme řešení — bez závazků.' },
      { step: '02', title: 'Návrh', desc: 'Připravíme design a plán projektu. Nic se nedělá, dokud neodsouhlasíte.' },
      { step: '03', title: 'Vývoj', desc: 'Stavíme iterativně — průběžně ukazujeme pokrok a zapracováváme vaše připomínky.' },
      { step: '04', title: 'Spuštění', desc: 'Nasadíme, otestujeme na všech zařízeních a zajistíme hladký start.' },
    ],
  },
  pricing: {
    label: 'Ceník',
    heading: 'Transparentní ceny',
    note: 'Všechny ceny jsou bez DPH. Konečná cena závisí na rozsahu projektu.',
    popular: 'Nejoblíbenější',
    selected: 'Vybraný',
    from: 'od',
    cta: 'Kontaktovat',
    plans: [
      { name: 'Starter', price: '1 500', featured: false, features: ['Responzivní webstránka', 'Až 5 podstránek', 'Kontaktní formulář', 'SEO optimalizace', 'SSL certifikát'] },
      { name: 'Business', price: '3 500', featured: true, features: ['Vše ze Starter', 'Až 15 podstránek', 'CMS systém', 'AI chatbot integrace', 'Analytika a reporting', 'E-mail automatizace'] },
      { name: 'Premium', price: '6 000+', featured: false, features: ['Vše z Business', 'Vlastní aplikace', 'Pokročilá AI integrace', 'Workflow automatizace', 'Prioritní podpora', 'Individuální vývoj'] },
    ],
  },
  contact: {
    label: 'Kontakt',
    heading1: 'Pojďme na to',
    heading2: 'společně',
    subtext: 'První konzultace je zdarma a bez závazků. Řekněte nám o svém projektu a my navrhneme, jak ho posunout dál.',
    namePlaceholder: 'Vaše jméno',
    emailPlaceholder: 'Váš e-mail',
    messagePlaceholder: 'Popište váš projekt nebo potřebu...',
    sendBtn: 'Odeslat zprávu',
    sendingBtn: 'Odesílám...',
    successTitle: 'Děkujeme!',
    successText: 'Vaši zprávu jsme obdrželi. Ozveme se vám do 24 hodin.',
    sendAnother: 'Odeslat další zprávu',
    errorDefault: 'Nastala chyba. Zkuste to znovu.',
    errorNetwork: 'Nepodařilo se připojit k serveru. Zkuste to znovu.',
    nameLabel: 'Jméno',
    emailLabel: 'E-mail',
    messageLabel: 'Zpráva',
  },
  footer: {
    tagline: 'Váš partner pro digitální transformaci',
    navHeading: 'Navigace',
    navLinks: [
      { label: 'Služby', href: '#sluzby' },
      { label: 'O nás', href: '#o-nas' },
      { label: 'Postup', href: '#proces' },
      { label: 'Ceník', href: '#cennik' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    contactHeading: 'Kontakt',
    legalHeading: 'Právní',
    privacy: 'Ochrana osobních údajů',
    terms: 'Obchodní podmínky',
    copyright: '© 2026 Vassweb s.r.o. Všechna práva vyhrazena.',
  },
  navbar: {
    links: [
      { label: 'Služby', href: '#sluzby' },
      { label: 'O nás', href: '#o-nas' },
      { label: 'Postup', href: '#proces' },
      { label: 'Ceník', href: '#cennik' },
      { label: 'Kontakt', href: '#kontakt' },
    ],
    langLabel: 'CZ',
  },
  faq: {
    label: 'FAQ',
    heading: 'Časté dotazy',
    items: [
      { question: 'Jak dlouho trvá vytvoření webu?', answer: 'Standardní web trvá 2–4 týdny od schválení návrhu. Složitější projekty s vlastní aplikací nebo AI integrací mohou trvat 4–8 týdnů.' },
      { question: 'Kolik stojí web?', answer: 'Ceny začínají od 1 500 € za jednoduchý responzivní web. Konečná cena závisí na rozsahu — po bezplatné konzultaci vám připravíme přesnou cenovou nabídku.' },
      { question: 'Co když potřebuji změny po spuštění?', answer: 'Poskytujeme ongoing podporu a údržbu. Menší úpravy jsou často zahrnuty v balíčku, větší změny oceníme individuálně.' },
      { question: 'Pracujete i s firmami mimo Slovenska?', answer: 'Ano! Pracujeme s klienty z celé Evropy. Komunikujeme slovensky, česky, maďarsky a anglicky.' },
      { question: 'Jak funguje AI integrace?', answer: 'Podle vašich potřeb implementujeme AI chatboty, automatické analýzy dat, smart formuláře nebo workflow automatizace. Vše přizpůsobíme vašim procesům.' },
      { question: 'Jaký hosting doporučujete?', answer: 'Většinu projektů nasazujeme na Vercel — je rychlý, bezpečný a škálovatelný. Pro specifické potřeby nabízíme i vlastní řešení.' },
    ],
  },
  testimonials: {
    label: 'Reference',
    heading: 'Co říkají naši klienti',
    items: [
      { name: 'Klient', role: 'CEO, technologická firma', text: 'Nový web konvertuje 3x lépe než předtím. Profesionální přístup a rychlé dodání.' },
      { name: 'Klient', role: 'Marketing manažer', text: 'AI chatbot nám ušetřil 20 hodin týdně na zákaznické podpoře. Doporučuji každému.' },
      { name: 'Klient', role: 'Jednatel, konzultační firma', text: 'Od konzultace po spuštění — vše proběhlo hladce. Konečně mám web, na který jsem hrdý.' },
    ],
  },
  portfolio: {
    label: 'Portfolio',
    heading: 'Naše práce',
    subtext: 'Vybrané projekty, na které jsme hrdí. Klikněte a prohlédněte si živou ukázku.',
    viewProject: 'Zobrazit projekt',
    viewDemo: 'Živá ukázka',
    items: [
      { title: 'La Cucina Restaurace', category: 'Web + Rezervace', desc: 'Elegantní stránka pro restauraci s online rezervacemi, galerií jídel a interaktivním menu.', tags: ['Design', 'Rezervace', 'Responzivita'], href: '/demo/restaurant' },
      { title: 'ModaShop E-commerce', category: 'E-shop + AI', desc: 'Moderní e-shop s produktovým katalogem, košíkem a AI doporučeními. Připravený k prodeji.', tags: ['Next.js', 'E-shop', 'AI'], href: '/demo/eshop' },
      { title: 'BuildPro Stavební firma', category: 'Firemní web', desc: 'Profesionální firemní prezentace se službami, portfoliem projektů a kontaktním formulářem.', tags: ['B2B', 'SEO', 'Animace'], href: '/demo/firma' },
      { title: 'Portfolio Designéra', category: 'Portfolio', desc: 'Kreativní portfolio s filtrovanými projekty, skill bary a moderním minimalistickým designem.', tags: ['Portfolio', 'Design', 'Freelancer'], href: '/demo/portfolio' },
      { title: 'FitZone Fitness', category: 'Web + Aplikace', desc: 'Dynamická stránka pro fitness studio s rozvrhem, trenéry, ceníkem a online registrací.', tags: ['Fitness', 'Booking', 'PWA'], href: '/demo/fitness' },
      { title: 'AI & Automatizace', category: 'AI + Automatizace', desc: 'Interaktivní demo AI chatbotu, emailové automatizace, automatické fakturace a real-time analytiky.', tags: ['AI', 'Chatbot', 'Automatizace'], href: '/demo-app/ai-automation' },
      { title: 'Rezervační systém', category: 'Aplikace', desc: 'Kompletní booking systém s kalendářem, časovými sloty, admin panelem a notifikacemi.', tags: ['Booking', 'Kalendář', 'Admin'], href: '/demo-app/booking' },
      { title: 'CRM Dashboard', category: 'Aplikace', desc: 'Moderní CRM s pipeline kanbanem, správou klientů, grafy příjmů a aktivitami.', tags: ['CRM', 'Dashboard', 'Kanban'], href: '/demo-app/crm' },
    ],
  },
  cookieBanner: {
    text: 'Používáme cookies pro analýzu návštěvnosti (Google Analytics). Souhlasíte?',
    accept: 'Souhlasím',
    decline: 'Odmítnout',
  },
};

const hu: Translations = {
  locale: 'hu',
  hero: {
    line1: 'Kevesebb munka.',
    line2: 'Több eredmény.',
    typewriter: 'Weboldalakat, automatizációkat és AI megoldásokat készítünk, amelyek időt takarítanak meg és pénzt hoznak',
    ctaPrimary: 'Kezdjük együtt',
    ctaSecondary: 'Szolgáltatásaink',
  },
  services: {
    label: 'Mit kínálunk',
    heading: 'Szolgáltatásaink',
    items: [
      { title: 'Weboldalak', desc: 'Egy oldal, ami elad — gyors, optimalizált és úgy tervezett, hogy látogatóból vásárló legyen.' },
      { title: 'AI Megoldások', desc: 'Chatbot, ami válaszol helyetted. AI, ami elemzi az adatokat. Napi órákat spórolunk neked.' },
      { title: 'Automatizáció', desc: 'Számlák, e-mailek, riportok — bízd ránk a rutinmunkát, és koncentrálj arra, amiben a legjobb vagy.' },
      { title: 'Alkalmazások', desc: 'Web- és mobilalkalmazások pontosan az igényeid szerint — egyszerű eszközöktől összetett rendszerekig.' },
    ],
  },
  about: {
    label: 'Miért mi',
    heading: 'Miért a Vassweb?',
    stats: [
      { num: '3', lbl: 'konverzió', desc: 'Ügyfeleink átlagosan 3× több megkeresést kapnak az új weboldal indítása után', suffix: '×' },
      { num: 'AI', lbl: 'natív', desc: 'Az AI nem kiegészítő — minden, amit csinálunk, ezen alapul', suffix: '' },
      { num: '100', lbl: 'elégedettség', desc: 'Egyetlen projektet sem hagyunk el, amíg nem vagy elragadtatva az eredménytől', suffix: '%' },
    ],
    tagline: 'Hisszük, hogy a technológiának nem kell bonyolultnak lennie. Ezért tesszük egyszerűvé — hogy neked dolgozzon, ne fordítva.',
  },
  benefits: {
    label: 'Mit kapsz',
    heading: 'Minőség minden részletben',
    items: [
      { title: 'Sebesség', desc: '2 másodpercen belül betöltő oldalak' },
      { title: 'Biztonság', desc: 'SSL, titkosítás és adatvédelem' },
      { title: 'Reszponzív', desc: 'Tökéletes mobilon és asztali gépen' },
      { title: 'SEO', desc: 'Keresőoptimalizálás az első naptól' },
      { title: 'Karbantartás', desc: 'Rendszeres frissítések és monitorozás' },
      { title: 'Analitika', desc: 'Látogatottsági és konverziós adatok' },
    ],
  },
  process: {
    label: 'Folyamat',
    heading: 'Hogyan dolgozunk',
    steps: [
      { step: '01', title: 'Konzultáció', desc: 'Találkozunk, meghallgatjuk az igényeidet és megoldást javaslunk — kötelezettség nélkül.' },
      { step: '02', title: 'Tervezés', desc: 'Elkészítjük a designt és a projekttervt. Semmi sem indul el, amíg jóvá nem hagyod.' },
      { step: '03', title: 'Fejlesztés', desc: 'Iteratívan építünk — folyamatosan mutatjuk a haladást és beépítjük a visszajelzéseidet.' },
      { step: '04', title: 'Indítás', desc: 'Telepítünk, tesztelünk minden eszközön és gondoskodunk a zökkenőmentes indításról.' },
    ],
  },
  pricing: {
    label: 'Árak',
    heading: 'Átlátható árak',
    note: 'Az árak ÁFA nélkül értendők. A végső ár a projekt terjedelmétől függ.',
    popular: 'Legnépszerűbb',
    selected: 'Kiválasztott',
    from: 'tól',
    cta: 'Kapcsolat',
    plans: [
      { name: 'Starter', price: '1 500', featured: false, features: ['Reszponzív weboldal', 'Legfeljebb 5 aloldal', 'Kapcsolatfelvételi űrlap', 'SEO optimalizáció', 'SSL tanúsítvány'] },
      { name: 'Business', price: '3 500', featured: true, features: ['Minden a Starterből', 'Legfeljebb 15 aloldal', 'CMS rendszer', 'AI chatbot integráció', 'Analitika és riportálás', 'E-mail automatizáció'] },
      { name: 'Premium', price: '6 000+', featured: false, features: ['Minden a Businessből', 'Egyéni alkalmazás', 'Fejlett AI integráció', 'Workflow automatizáció', 'Elsőbbségi támogatás', 'Egyedi fejlesztés'] },
    ],
  },
  contact: {
    label: 'Kapcsolat',
    heading1: 'Gyerünk',
    heading2: 'együtt',
    subtext: 'Az első konzultáció ingyenes és kötelezettségmentes. Mesélj a projektedről és mi javaslatot teszünk, hogyan vigyük előre.',
    namePlaceholder: 'A neved',
    emailPlaceholder: 'Az e-mailed',
    messagePlaceholder: 'Írd le a projektedet vagy igényedet...',
    sendBtn: 'Üzenet küldése',
    sendingBtn: 'Küldöm...',
    successTitle: 'Köszönjük!',
    successText: 'Megkaptuk az üzenetedet. 24 órán belül visszajelzünk.',
    sendAnother: 'Újabb üzenet küldése',
    errorDefault: 'Hiba történt. Kérjük, próbáld újra.',
    errorNetwork: 'Nem sikerült csatlakozni a szerverhez. Kérjük, próbáld újra.',
    nameLabel: 'Név',
    emailLabel: 'E-mail',
    messageLabel: 'Üzenet',
  },
  footer: {
    tagline: 'Az Ön partnere a digitális átalakulásban',
    navHeading: 'Navigáció',
    navLinks: [
      { label: 'Szolgáltatások', href: '#sluzby' },
      { label: 'Rólunk', href: '#o-nas' },
      { label: 'Folyamat', href: '#proces' },
      { label: 'Árak', href: '#cennik' },
      { label: 'Kapcsolat', href: '#kontakt' },
    ],
    contactHeading: 'Kapcsolat',
    legalHeading: 'Jogi',
    privacy: 'Adatvédelmi irányelvek',
    terms: 'Általános szerződési feltételek',
    copyright: '© 2026 Vassweb s.r.o. Minden jog fenntartva.',
  },
  navbar: {
    links: [
      { label: 'Szolgáltatások', href: '#sluzby' },
      { label: 'Rólunk', href: '#o-nas' },
      { label: 'Folyamat', href: '#proces' },
      { label: 'Árak', href: '#cennik' },
      { label: 'Kapcsolat', href: '#kontakt' },
    ],
    langLabel: 'HU',
  },
  faq: {
    label: 'GYIK',
    heading: 'Gyakran ismételt kérdések',
    items: [
      { question: 'Mennyi idő alatt készül el egy weboldal?', answer: 'Egy standard weboldal 2–4 hét alatt készül el a terv jóváhagyásától. Összetettebb projektek egyedi alkalmazással vagy AI integrációval 4–8 hetet vehetnek igénybe.' },
      { question: 'Mennyibe kerül egy weboldal?', answer: 'Az árak 1 500 €-tól indulnak egy egyszerű reszponzív weboldalért. A végső ár a terjedelmétől függ — egy ingyenes konzultáció után pontos árajánlatot készítünk.' },
      { question: 'Mi van, ha az indítás után változtatásokra van szükségem?', answer: 'Folyamatos támogatást és karbantartást biztosítunk. A kisebb módosítások gyakran a csomagban szerepelnek, a nagyobb változtatásokat egyénileg árazzuk.' },
      { question: 'Dolgoznak Szlovákián kívüli cégekkel is?', answer: 'Igen! Egész Európából dolgozunk ügyfelekkel. Szlovák, cseh, magyar és angol nyelven kommunikálunk.' },
      { question: 'Hogyan működik az AI integráció?', answer: 'Az igényeid alapján AI chatbotokat, automatikus adatelemzést, smart űrlapokat vagy workflow automatizációkat implementálunk. Mindent a te folyamataidhoz igazítunk.' },
      { question: 'Milyen tárhelyet ajánlanak?', answer: 'A legtöbb projektet Vercelre telepítjük — gyors, biztonságos és skálázható. Speciális igényekre egyedi megoldásokat is kínálunk.' },
    ],
  },
  testimonials: {
    label: 'Referenciák',
    heading: 'Mit mondanak ügyfeleink',
    items: [
      { name: 'Ügyfél', role: 'CEO, technológiai cég', text: 'Az új weboldal 3x jobban konvertál, mint korábban. Profi hozzáállás és gyors szállítás.' },
      { name: 'Ügyfél', role: 'Marketing menedzser', text: 'Az AI chatbot heti 20 órát spórolt nekünk az ügyfélszolgálaton. Mindenkinek ajánlom.' },
      { name: 'Ügyfél', role: 'Ügyvezető, tanácsadó cég', text: 'A konzultációtól az indításig — minden simán ment. Végre van egy weboldalam, amire büszke vagyok.' },
    ],
  },
  portfolio: {
    label: 'Portfólió',
    heading: 'Munkáink',
    subtext: 'Válogatott projektek, amelyekre büszkék vagyunk. Kattintson az élő demóért.',
    viewProject: 'Projekt megtekintése',
    viewDemo: 'Élő demó',
    items: [
      { title: 'La Cucina Étterem', category: 'Web + Foglalás', desc: 'Elegáns éttermi weboldal online foglalással, ételgalériával és interaktív menüvel.', tags: ['Design', 'Foglalás', 'Reszponzív'], href: '/demo/restaurant' },
      { title: 'ModaShop Webáruház', category: 'E-shop + AI', desc: 'Modern webáruház termékkatalógussal, kosárral és AI ajánlásokkal. Értékesítésre kész.', tags: ['Next.js', 'E-shop', 'AI'], href: '/demo/eshop' },
      { title: 'BuildPro Építőipari cég', category: 'Céges web', desc: 'Professzionális céges bemutatkozó szolgáltatásokkal, projektportfólióval és kapcsolatfelvételi űrlappal.', tags: ['B2B', 'SEO', 'Animációk'], href: '/demo/firma' },
      { title: 'Dizájner Portfólió', category: 'Portfólió', desc: 'Kreatív portfólió szűrt projektekkel, skill sávokkal és modern minimalista dizájnnal.', tags: ['Portfólió', 'Dizájn', 'Szabadúszó'], href: '/demo/portfolio' },
      { title: 'FitZone Fitness', category: 'Web + Alkalmazás', desc: 'Dinamikus fitness stúdió oldal órarenddel, edzőkkel, árlista és online regisztrációval.', tags: ['Fitness', 'Foglalás', 'PWA'], href: '/demo/fitness' },
      { title: 'AI & Automatizálás', category: 'AI + Automatizálás', desc: 'Interaktív AI chatbot, email automatizálás, automatikus számlázás és valós idejű analitikai demó.', tags: ['AI', 'Chatbot', 'Automatizálás'], href: '/demo-app/ai-automation' },
      { title: 'Foglalási rendszer', category: 'Alkalmazás', desc: 'Teljes foglalási rendszer naptárral, időpontokkal, admin panellel és értesítésekkel.', tags: ['Foglalás', 'Naptár', 'Admin'], href: '/demo-app/booking' },
      { title: 'CRM Dashboard', category: 'Alkalmazás', desc: 'Modern CRM pipeline kanbannal, ügyfélkezeléssel, bevételi grafikonokkal és tevékenységekkel.', tags: ['CRM', 'Dashboard', 'Kanban'], href: '/demo-app/crm' },
    ],
  },
  cookieBanner: {
    text: 'Sütiket használunk a forgalomelemzéshez (Google Analytics). Elfogadod?',
    accept: 'Elfogadom',
    decline: 'Elutasítom',
  },
};

export const translations: Record<Locale, Translations> = { sk, en, cs, hu };

export function getT(locale: Locale): Translations {
  return translations[locale] ?? translations.sk;
}

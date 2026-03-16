# Prompt pre Cowork — Vassweb App & Migrácia existujúcich appiek

---

## Kto som
Richard Vass, CEO Vass & Co. s.r.o. (VVD s.r.o.), firma Vassweb — robíme weby, AI riešenia, automatizácie a aplikácie. Web: vassweb.sk

## Zariadenia
- **Notebook** (MacBook) — hlavný stroj, Cowork + Claude Code
- **Miničko** (Mac Mini, 192.168.0.80) — sekundárny stroj, prístup cez SSH

## Čo máme hotové (vassweb-sk projekt)

### Hlavná stránka vassweb.sk
- Next.js 14 + App Router + TypeScript + Tailwind CSS
- 4 jazyky: SK (root), EN (/en), CS (/cs), HU (/hu) cez translations.ts
- Premium dark dizajn s gold akcentmi (#d4a843)
- Sekcie: Hero, Služby, O nás, Benefits, Proces, Cenník, Portfólio, Testimonials, FAQ, Kontakt
- Film grain, vignette, gold scrollbar, animácie, PWA ready
- Vercel hosting, GitHub repo: Vassweb/vassweb-sk, Cloudflare DNS

### Demo webstránky (src/app/demo/)
5 vzorových webov s prepínateľnými farebnými témami (Elegance/Ocean/Forest/Minimal/Royal):
- /demo/restaurant — La Cucina reštaurácia
- /demo/eshop — ModaShop e-commerce
- /demo/firma — BuildPro stavebná firma
- /demo/portfolio — Freelancer portfólio
- /demo/fitness — FitZone fitness štúdio

### Demo aplikácie (src/app/demo-app/)
3 interaktívne demo appky s theme switcherom:
- /demo-app/booking — Rezervačný systém (kalendár, time sloty, admin panel)
- /demo-app/crm — CRM Dashboard (pipeline kanban, klienti, grafy)
- /demo-app/admin — E-shop Admin (produkty CRUD, objednávky, stock)
- /demo-app/ai-automation — AI & Automatizácia demo (chatbot, email flow, faktúry, analytics)

### Business App (src/app/app/)
- Vassweb Business App v2.0 na vassweb.sk/app
- CRM: klienti, projekty, faktúry, AI asistent, nastavenia
- Supabase backend (fetch-based, bez SDK) — src/lib/supabase.ts
- Auth, RLS, real-time polling
- PWA (manifest-app.json, sw-app.js)
- **STAV: Supabase ešte nie je nakonfigurovaný!**
- SQL schema: supabase-schema.sql (7 tabuliek s RLS, triggermi)
- Treba: vytvoriť Supabase projekt, spustiť SQL, nastaviť .env.local + Vercel env

### Technológie
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Lucide React ikony
- **Backend**: Supabase (PostgreSQL + Auth + RLS), fetch-based klient
- **Hosting**: Vercel (auto-deploy z GitHub main branch)
- **DNS**: Cloudflare
- **Git**: github.com/Vassweb/vassweb-sk
- **Dizajn**: Dark téma, gold akcenty (#d4a843), Playfair Display + Inter fonty

---

## Existujúce appky na migráciu

### BizHub (stará Firebase appka)
- Standalone HTML app s Firebase (vassco-bizapp)
- Lead management pre VVD s.r.o. (čistiaca firma)
- AI Agent (Node.js) s Claude API — analyzuje leady, posiela emaily
- Beží na Macu cez LaunchAgent každých 5 min
- Lokácia: ~/Desktop/vassco-functions/
- Cloud kópia: Vass&Co. drive/appka/index.html
- **CIeľ: Migrovať na nový Vassweb systém (Next.js + Supabase)**

### Prístupy
- SMTP: smtp.m1.websupport.sk, port 465, user: info@vassco.sk
- IMAP: imap.m1.websupport.sk, port 993
- Firebase: vassco-bizapp (otvorené pravidlá)
- Firma: VVD s.r.o., IČO: 56921021, DIČ: 2122501524

---

## Čo chcem spraviť v tomto session

### 1. Supabase Setup
- Vytvoriť Supabase projekt "vassweb" (Frankfurt region)
- Spustiť supabase-schema.sql v SQL Editore
- Nastaviť .env.local s NEXT_PUBLIC_SUPABASE_URL a NEXT_PUBLIC_SUPABASE_ANON_KEY
- Pridať env premenné aj do Vercel
- Overiť že vassweb.sk/app funguje s reálnou databázou

### 2. Migrácia BizHub → Vassweb App
- Preniesť lead management, AI analýzu, email notifikácie do nového systému
- Nahradiť Firebase za Supabase
- Integrovať do vassweb.sk/app

### 3. Vylepšenie Business App
- Reálne dáta namiesto demo dát
- AI asistent napojený na Claude API
- Email integrácia (IMAP/SMTP)
- PDF export faktúr
- Dashboard s reálnymi štatistikami

---

## Claude Code na Mac Mini (Miničko)

### Inštalácia (ak ešte nie je):
```bash
curl -fsSL https://claude.ai/install.sh | bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc && source ~/.zshrc
claude --version
```

### Spustenie cez SSH z Notebooku:
```bash
ssh vass@192.168.0.80
cd ~/Projects/vassweb-sk    # alebo iný projekt
claude
```

### Spustenie priamo na Miničku:
```bash
cd ~/Projects/vassweb-sk
claude
```

### Užitočné Claude Code príkazy:
- Píšeš normálne po slovensky/anglicky čo chceš
- `/cost` — spotreba tokenov
- `/help` — pomoc
- `Esc` — zastaviť akciu
- `Ctrl+C` — ukončiť Claude Code
- `Shift+Tab` — prepnúť accept edits mode

### Príklady promptov pre Claude Code:
```
"pozri sa na celý projekt a povedz mi čo by sa dalo zlepšiť"
"pridaj nový modul pre správu zamestnancov"
"oprav TypeScript chyby a pushni"
"spusti npm run dev a over že všetko funguje"
```

---

## Pravidlá
- Komunikácia v slovenčine
- Git: VŽDY pred git operáciou: rm -f .git/HEAD.lock .git/index.lock
- Na konci poskytnúť tabuľku terminálových príkazov (spustiť/zastaviť/testovať/logy/odinštalovať)
- Projekt: ~/Projects/vassweb-sk na oboch strojoch

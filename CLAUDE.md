# Pravidlá pre Claude — Richard Vass

## Terminálové príkazy
Keď nastavujem čokoľvek čo beží na pozadí alebo v termináli (LaunchAgent, cron, skripty, sync, servery atď.), VŽDY na konci poskytnúť prehľadnú tabuľku príkazov:
- Ako spustiť
- Ako zastaviť
- Ako otestovať
- Ako pozrieť logy
- Ako odinštalovať

Richard si nepamätá terminálové príkazy, takže ich treba vždy uviesť aj keď sa nepýta.

## Jazyk
Komunikácia prebieha v slovenčine.

## Zariadenia
- **Notebook** (MacBook) — hlavný stroj, beží Cowork
- **Miničko** (Mac Mini, 192.168.0.80) — sekundárny stroj, prístup cez SSH alebo priamo

## Aktívne služby
- Cloud sync (iCloud <-> OneDrive) — beží na oboch strojoch každé 2h
  - Notebook: Cowork scheduled task
  - Miničko: macOS LaunchAgent `sk.vassco.cloud-sync`
  - Príkazy: viď `terminal-prikazy.md`

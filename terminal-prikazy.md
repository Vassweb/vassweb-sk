# Terminálové príkazy — Rýchly prehľad

## Cloud Sync (iCloud <-> OneDrive)

### Na notebooku (cez Cowork)
Beží automaticky každé 2h. Manuálne nie je potrebné.

### Na miničku (LaunchAgent)
| Čo | Príkaz |
|---|---|
| Zastaviť sync | `launchctl unload ~/Library/LaunchAgents/sk.vassco.cloud-sync.plist` |
| Spustiť sync | `launchctl load ~/Library/LaunchAgents/sk.vassco.cloud-sync.plist` |
| Manuálny beh | `python3 ~/cloud-sync/sync_clouds.py` |
| Dry run (test) | `python3 ~/cloud-sync/sync_clouds.py --dry` |
| Pozrieť log | `cat ~/Library/Logs/cloud-sync.log` |
| Odinštalovať | `launchctl unload ~/Library/LaunchAgents/sk.vassco.cloud-sync.plist && rm ~/Library/LaunchAgents/sk.vassco.cloud-sync.plist && rm -rf ~/cloud-sync` |

## Základné Terminal skratky
| Skratka | Čo robí |
|---|---|
| `Ctrl + C` | Zastaví bežiaci príkaz |
| `Ctrl + Z` | Pozastaví príkaz (pokračovanie: `fg`) |
| `Ctrl + L` | Vyčistí obrazovku |
| `Tab` | Automatické doplnenie |
| `↑` / `↓` | Prechádzanie histórie príkazov |
| `Ctrl + A` | Skok na začiatok riadku |
| `Ctrl + E` | Skok na koniec riadku |
| `Ctrl + R` | Hľadanie v histórii |

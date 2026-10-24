# Kotoba 言葉 – Japanisch lernen

Private Lern-App (PWA) für iPhone und Mac. Keine Abhängigkeiten, kein Build-Schritt – reine HTML/CSS/JS-Dateien.

## Was drin ist

| Bereich | Inhalt |
|---|---|
| **Kana** | Hiragana & Katakana in Reihen (Vokale, K, S …, Dakuten, Yōon, erweiterte Katakana). Pro Reihe: *Lernen* (Eselsbrücke + Emoji, 3 Schriftarten, Aussprache) → *Test*. Dann Gruppen-Test, Gesamttest, gemischter Test, eigener Test (wie bei Tofugu). Modi: Romaji tippen, Auswahl, umgekehrt. Fehler werden am Ende wiederholt, Schwachstellen auf der Startseite. |
| **Vokabeln** | ~360 Alltagswörter in 13 Kategorien (Kanji · Kana · Romaji · Deutsch), 96 N5-Kanji mit On/Kun-Lesung und Beispiel, eigene Vokabeln. Spaced Repetition wie Anki (Nochmal / Schwer / Gut / Einfach). |
| **Phrasen** | 12 Situationen (Vorstellen, Konbini, Restaurant, Bahn, Arzt, Notfall …), ~150 Sätze. Markiert, ob *du* es sagst oder es *hörst*. Kultur-Tipps. |
| **Allgemein** | Tägliche Wiederholung, Streak, Aktivitäts-Heatmap, Sprachausgabe (japanische Systemstimme), Dark Mode, offline nutzbar, Sync per GitHub Gist, Backup als JSON. |

Tastatur (Mac): Leertaste = aufdecken / „Gut“, `1`–`4` = bewerten, `Z` = rückgängig, `R` = nochmal vorlesen, Pfeiltasten beim Kana-Lernen.

## Lokal starten (Mac)

```bash
cd ~/Desktop/japanisch
python3 -m http.server 8000
```
Dann <http://localhost:8000> öffnen.

## Online stellen (nötig fürs iPhone)

Das iPhone braucht eine HTTPS-Adresse. Am einfachsten über **GitHub Pages** (kostenlos):

1. Repository auf GitHub anlegen (z. B. `kotoba`) und diesen Ordner hochladen.
2. Repo → *Settings → Pages* → Source: *Deploy from a branch*, Branch `main`, Ordner `/ (root)`.
3. Nach ~1 Minute läuft die App unter `https://<dein-name>.github.io/kotoba/`.

Alternativ: Ordner per Drag & Drop auf <https://app.netlify.com/drop> ziehen (geht auch mit privatem Repo).

Updates: Dateien ändern und neu hochladen – die App holt sich beim nächsten Öffnen automatisch die neue Version.

## Als App installieren

- **iPhone:** URL in Safari öffnen → Teilen → *Zum Home-Bildschirm*.
- **Mac:** URL in Safari öffnen → *Ablage → Zum Dock hinzufügen…* (eigenes Fenster, Icon im Dock/Launchpad).

## Sync zwischen iPhone und Mac

Der Fortschritt wird in einem **privaten (geheimen) GitHub Gist** gespeichert:

1. <https://github.com/settings/tokens/new?scopes=gist&description=Kotoba%20Sync> – Token (classic) nur mit Scope **gist** erstellen.
2. In der App: *Einstellungen → Sync* → Token einfügen. Auf beiden Geräten denselben Token.

Die App findet/erstellt das Gist automatisch. Synchronisiert wird beim Öffnen, nach dem Lernen und beim Schließen. Gleichzeitiges Lernen auf beiden Geräten ist kein Problem: Die Stände werden pro Karte zusammengeführt (neuere Bewertung gewinnt, Statistiken werden pro Gerät addiert).

Der Token liegt nur lokal auf dem Gerät und wird nie mit synchronisiert.

## Struktur

```
index.html, manifest.webmanifest, sw.js   App-Hülle, Installierbarkeit, Offline-Cache
css/app.css                               Design (hell/dunkel)
js/app.js                                 Router
js/store.js                               Zustand, Speichern, Merge für Sync
js/srs.js                                 Spaced-Repetition-Algorithmus
js/cards.js                               Kartenkatalog
js/sync.js                                GitHub-Gist-Sync
js/romaji.js                              Kana ⇄ Romaji
js/views/                                 Seiten (Start, Kana, Vokabeln, Phrasen, Wiederholung, Einstellungen)
data/                                     Lerninhalte (Kana, Vokabeln, Kanji, Phrasen)
```

Neue Vokabeln/Phrasen dauerhaft hinzufügen: einfach in `data/vocab.js` bzw. `data/phrases.js` ergänzen (Romaji werden automatisch erzeugt). Bestehende Einträge nicht umsortieren – Phrasen werden über ihre Position identifiziert.

## Tägliche Erinnerung (Push auf dem iPhone)

Ein GitHub-Actions-Job (`.github/workflows/reminder.yml`, stündlich) liest den Fortschritt aus dem Sync-Gist und schickt eine Push-Nachricht – nur wenn du bis zur gewählten Uhrzeit noch nicht gelernt hast.

Einmalig einrichten: Repo → *Settings → Secrets and variables → Actions* → zwei Secrets anlegen:
- `GIST_TOKEN` – derselbe Token wie für den Sync (Scope `gist`)
- `VAPID_PRIVATE_KEY` – privater Schlüssel aus `.secrets/VAPID_PRIVATE_KEY.txt` (liegt nur lokal, nicht im Repo)

Dann in der App (vom Home-Bildschirm geöffnet, iOS 16.4+): *Einstellungen → Tägliche Erinnerung* einschalten.
Testen: Repo → *Actions → Lern-Erinnerung → Run workflow* schickt sofort eine Nachricht an alle Geräte.

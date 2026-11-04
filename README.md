# Kotoba 言葉 – Japanisch lernen

Private Lern-App (PWA) für iPhone und Mac. Keine Abhängigkeiten, kein Build-Schritt – reine HTML/CSS/JS-Dateien.

## Was drin ist

### 📖 Lesen (Hauptmodus)

Geschichten über Allgemeinwissen – Philosophie, Geschichte, Natur, Geographie, Weltall – auf Deutsch, mit eingewobenen japanischen Wörtern. Je besser du ein Wort kannst, desto weniger Hilfe bekommt es im Text:

| Stand | Im Text |
|---|---|
| neu / vergessen | 🌊 海 mit Lesung (うみ) und Übersetzung |
| gelernt | 海 mit Lesung |
| sitzt (≥ 3 Wochen) | nur 海 |

- **52 Geschichten** in der Bibliothek (`data/stories/`, eingebunden über `data/stories.js`), ab Geschichte 5 mit echten japanischen Sätzen und kleinen Grammatik-Häppchen (は/です, の, あります, を/ます, ません, ました, か, から).
- **Nach jeder Geschichte ein Mini-Quiz**: neue und fällige Wörter + 3 Wissensfragen. Danach sind die Wörter in der Wiederholung (Spaced Repetition), abgefragt im Satz-Kontext der Geschichte.
- Wörter antippen → Details, Aussprache, alle Fundstellen. Wer beim Lesen ein „gelerntes“ Wort nachschaut, bekommt es heute nochmal in der Wiederholung.

### 🗂️ Legacy

Der bisherige Karteikarten-Modus, unverändert:

| Bereich | Inhalt |
|---|---|
| **Kana** | Hiragana & Katakana in Reihen mit Eselsbrücken, Tests, Schwachstellen. |
| **Vokabeln** | ~360 Alltagswörter, 96 N5-Kanji, eigene Vokabeln. Spaced Repetition wie Anki. |
| **Phrasen** | 12 Situationen, ~150 Sätze, Kultur-Tipps. |

### Allgemein

Streak, Aktivitäts-Heatmap, Sprachausgabe (japanische Systemstimme), Dark Mode, offline nutzbar, Sync per GitHub Gist (inkl. Wortschatz und Lesefortschritt), Backup als JSON.

Tastatur (Mac): im Quiz `1`–`4` = Antwort, Leertaste = weiter, `R` = vorlesen. Legacy: Leertaste = aufdecken / „Gut“, `1`–`4` = bewerten, `Z` = rückgängig.

Weitere Geschichten können später als Dateien in `data/stories/` ergänzt und in `data/stories.js` eingebunden werden. Der automatische Geschichten-Generator ist noch nicht implementiert.

## Lokal starten (Mac)

```bash
cd ~/Desktop/japanisch
python3 -m http.server 8000
```
Dann <http://localhost:8000> öffnen.

Inhalte, Quiz-Daten und die Vollständigkeit des Offline-Caches prüfen: `node scripts/check.mjs`.

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
js/stories.js                             Geschichten: Text-Parser, Hilfestufen, Wortschatz
js/views/read.js                          Lesen, Quiz, Wiederholung, Wörterliste
js/views/                                 Weitere Seiten (Legacy: Kana, Vokabeln, Phrasen …; Einstellungen)
data/stories.js, data/stories/            Geschichten-Bibliothek (Syntax in data/stories.js)
data/words.js                             Wortschatz für den Lesemodus
data/                                     Legacy-Inhalte (Kana, Vokabeln, Kanji, Phrasen)
```

Neue Vokabeln/Phrasen dauerhaft hinzufügen: einfach in `data/vocab.js` bzw. `data/phrases.js` ergänzen (Romaji werden automatisch erzeugt). Bestehende Einträge nicht umsortieren – Phrasen werden über ihre Position identifiziert.

## Tägliche Erinnerung (Push auf dem iPhone)

Ein GitHub-Actions-Job (`.github/workflows/reminder.yml`, stündlich) liest den Fortschritt aus dem Sync-Gist und schickt eine Push-Nachricht – nur wenn du bis zur gewählten Uhrzeit noch nicht gelernt hast.

Einmalig einrichten: Repo → *Settings → Secrets and variables → Actions* → zwei Secrets anlegen:
- `GIST_TOKEN` – derselbe Token wie für den Sync (Scope `gist`)
- `VAPID_PRIVATE_KEY` – privater Schlüssel aus `.secrets/VAPID_PRIVATE_KEY.txt` (liegt nur lokal, nicht im Repo)

Dann in der App (vom Home-Bildschirm geöffnet, iOS 16.4+): *Einstellungen → Tägliche Erinnerung* einschalten.
Testen: Repo → *Actions → Lern-Erinnerung → Run workflow* schickt sofort eine Nachricht an alle Geräte.

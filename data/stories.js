// Geschichten-Bibliothek: Allgemeinwissen auf Deutsch mit eingewobenen japanischen Wörtern.
//
// Wörter stehen in data/words.js.
//
// Syntax im Text:
//   Leerzeile                    neuer Absatz
//   {海}                         Wort aus WORDS (Hilfe je nach Lernstand: Emoji + Lesung + Deutsch → nur Lesung → nur Japanisch)
//   > 日本語 | Deutsch            japanischer Satz mit Übersetzung (mehrere Zeilen = ein Block)
//   {食べる|食べました|たべました}   gebeugte Form in japanischen Sätzen: Grundform|Form|Lesung
//   漢字《かんじ》                  Lesung für Kanji, die (noch) keine Vokabel sind
//   ! Text                       Grammatik-Häppchen
//   **fett**
//
// Reihenfolge der Geschichten = empfohlene Lesereihenfolge. IDs nie ändern (Lesefortschritt hängt daran).

import { STORIES as S01 } from './stories/01.js';
import { STORIES as S02 } from './stories/02.js';
import { STORIES as S03 } from './stories/03.js';
import { STORIES as S04 } from './stories/04.js';
import { STORIES as S05 } from './stories/05.js';

export const STORIES = [...S01, ...S02, ...S03, ...S04, ...S05];

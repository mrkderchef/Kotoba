// Japanische Sprachausgabe über die eingebaute Stimme des Geräts (iOS/macOS: Kyoko, Otoya …)
import { local } from './store.js';

let voices = [];
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices().filter(v => v.lang.replace('_', '-').toLowerCase().startsWith('ja'));
}
if ('speechSynthesis' in window) {
  loadVoices();
  speechSynthesis.addEventListener?.('voiceschanged', loadVoices);
}

export const canSpeak = () => 'speechSynthesis' in window;
export function japaneseVoices() { loadVoices(); return voices; }

export function speak(text) {
  if (!canSpeak() || !text) return;
  // 〜 und Platzhalter nicht vorlesen
  const clean = text.replace(/[〜~]/g, '、').replace(/〇〇/g, '');
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = 'ja-JP';
  u.rate = local.rate || 0.9;
  const v = voices.find(v => v.voiceURI === local.voiceURI) || voices.find(v => /kyoko|o-ren|otoya|google/i.test(v.name)) || voices[0];
  if (v) u.voice = v;
  speechSynthesis.speak(u);
}

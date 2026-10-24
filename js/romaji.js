// Kana <-> Romaji (Hepburn, "wāpuro"-Stil: おう = ou, ー = Vokal doppelt)

const BASE = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','ゐ':'wi','ゑ':'we','を':'wo','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ゔ':'vu',
  'ぁ':'a','ぃ':'i','ぅ':'u','ぇ':'e','ぉ':'o','ゃ':'ya','ゅ':'yu','ょ':'yo','ゎ':'wa',
};

// Zwei-Zeichen-Kombinationen (Yōon + erweiterte Katakana-Laute, in Hiragana notiert)
const COMBO = {
  'きゃ':'kya','きゅ':'kyu','きょ':'kyo','しゃ':'sha','しゅ':'shu','しょ':'sho',
  'ちゃ':'cha','ちゅ':'chu','ちょ':'cho','にゃ':'nya','にゅ':'nyu','にょ':'nyo',
  'ひゃ':'hya','ひゅ':'hyu','ひょ':'hyo','みゃ':'mya','みゅ':'myu','みょ':'myo',
  'りゃ':'rya','りゅ':'ryu','りょ':'ryo','ぎゃ':'gya','ぎゅ':'gyu','ぎょ':'gyo',
  'じゃ':'ja','じゅ':'ju','じょ':'jo','ぢゃ':'ja','ぢゅ':'ju','ぢょ':'jo',
  'びゃ':'bya','びゅ':'byu','びょ':'byo','ぴゃ':'pya','ぴゅ':'pyu','ぴょ':'pyo',
  'ふぁ':'fa','ふぃ':'fi','ふぇ':'fe','ふぉ':'fo','てぃ':'ti','でぃ':'di',
  'とぅ':'tu','どぅ':'du','うぃ':'wi','うぇ':'we','うぉ':'wo','しぇ':'she',
  'じぇ':'je','ちぇ':'che','ゔぁ':'va','ゔぃ':'vi','ゔぇ':'ve','ゔぉ':'vo','つぁ':'tsa',
};

export function kataToHira(s) {
  return s.replace(/[ァ-ヶ]/g, c => String.fromCharCode(c.charCodeAt(0) - 0x60));
}
export function hiraToKata(s) {
  return s.replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
}

export function toRomaji(input) {
  const s = kataToHira(input);
  let out = '';
  let geminate = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === 'っ') { geminate = true; continue; }
    if (c === 'ー') {
      const m = out.match(/[aeiou]$/);
      if (m) out += m[0];
      continue;
    }
    let r = COMBO[c + (s[i + 1] || '')];
    if (r) i++;
    else r = BASE[c];
    if (r === undefined) { // kein Kana: unverändert übernehmen
      if (geminate) geminate = false;
      out += c === '　' ? ' ' : c === '、' ? ', ' : c === '。' ? '. ' : c === '？' ? '?' : c === '！' ? '!' : c;
      continue;
    }
    if (geminate) {
      out += r.startsWith('ch') ? 't' : r[0];
      geminate = false;
    }
    // ん vor Vokal/y -> n' (z. B. きんえん = kin'en)
    if (out.endsWith('n') && s[i - 1] === 'ん' && /^[aeiouy]/.test(r)) out += "'";
    out += r;
  }
  return out.replace(/\s+/g, ' ').trim();
}

// ---- Romaji -> Hiragana (für Eingabefelder) ----
const R2K = {};
for (const [k, v] of Object.entries(BASE)) if (!R2K[v] && !'ぁぃぅぇぉゃゅょゎゐゑ'.includes(k)) R2K[v] = k;
for (const [k, v] of Object.entries(COMBO)) if (!R2K[v]) R2K[v] = k;
Object.assign(R2K, {
  si:'し', ti:'ち', tu:'つ', hu:'ふ', zi:'じ', di:'ぢ', du:'づ', o:'お', wo:'を',
  sya:'しゃ', syu:'しゅ', syo:'しょ', tya:'ちゃ', tyu:'ちゅ', tyo:'ちょ',
  cya:'ちゃ', cyu:'ちゅ', cyo:'ちょ', zya:'じゃ', zyu:'じゅ', zyo:'じょ',
  jya:'じゃ', jyu:'じゅ', jyo:'じょ', nn:'ん', "n'":'ん', '-':'ー',
  xa:'ぁ', xi:'ぃ', xu:'ぅ', xe:'ぇ', xo:'ぉ', xya:'ゃ', xyu:'ゅ', xyo:'ょ', xtsu:'っ', xtu:'っ',
});
R2K.ti = 'ち'; R2K.di = 'ぢ'; R2K.du = 'づ'; R2K.tu = 'つ';

export function toHiragana(input) {
  const s = input.toLowerCase();
  let out = '';
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    // Doppelkonsonant -> っ
    if (c === s[i + 1] && /[bcdfghjkmpqrstvwxyz]/.test(c)) { out += 'っ'; i++; continue; }
    if (c === 't' && s[i + 1] === 'c' && s[i + 2] === 'h') { out += 'っ'; i++; continue; }
    // nn vor Vokal: こんにちは = konnichiha
    if (c === 'n' && s[i + 1] === 'n' && /[aeiouy]/.test(s[i + 2] || '')) { out += 'ん'; i++; continue; }
    // n vor Konsonant (nicht y) -> ん
    if (c === 'n' && s[i + 1] && !/[aeiouyn']/.test(s[i + 1])) { out += 'ん'; i++; continue; }
    let hit = false;
    for (let len = 4; len >= 1; len--) {
      const part = s.slice(i, i + len);
      if (R2K[part]) { out += R2K[part]; i += len; hit = true; break; }
    }
    if (!hit) {
      if (c === 'n' && i === s.length - 1) { out += 'ん'; i++; continue; }
      out += c; i++;
    }
  }
  return out;
}

export const hasKana = s => /[぀-ヿ]/.test(s);
export const hasKanji = s => /[一-龯㐀-䶿々]/.test(s);

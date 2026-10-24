// Hiragana & Katakana: Reihen, Eselsbrücken, Abschnitte.
import { hiraToKata } from '../js/romaji.js';

// [Zeichen, Romaji, Emoji, Eselsbrücke]
const HIRA = {
  vowels: [
    ['あ','a','🍎','Im Zeichen steckt ein großes <b>A</b> (Querstrich + Schrägstrich) – unten rollt ein <b>A</b>pfel drumherum.'],
    ['い','i','🌾','Zwei kleine Striche nebeneinander, wie zwei <b>i</b>-Striche: „<b>ii</b>“.'],
    ['う','u','🤢','Ein Bauch mit einem Haar oben drauf – ihm ist übel: „<b>uuuh</b>“. Oder: ein auf die Seite gekipptes <b>U</b>.'],
    ['え','e','🦆','Eine <b>E</b>nte mit Federschmuck auf dem Kopf, die mit ihrem Schwanz davonpaddelt.'],
    ['お','o','⛳','Fast wie あ – aber rechts oben fliegt ein Golfball weg: „<b>O</b>h!“'],
  ],
  k: [
    ['か','ka','🦟','Eine Mücke mit Stachel und Flügel – auf Japanisch heißt Mücke 蚊 (<b>ka</b>)!'],
    ['き','ki','🔑','Ein Schlüssel mit zwei Zacken – englisch „key“ = <b>ki</b>.'],
    ['く','ku','🐦','Ein offener Vogelschnabel &lt; der „<b>ku</b>-ku“ ruft.'],
    ['け','ke','🛢️','Ein Fass (engl. „<b>ke</b>g“) mit Zapfhahn links. Oder: sieht aus wie ein schiefes <b>K</b>.'],
    ['こ','ko','🐟','Zwei Striche übereinander – zwei <b>Ko</b>i-Fische, die im Teich umeinander kreisen.'],
  ],
  s: [
    ['さ','sa','🙂','Wie き, aber nur mit einem Querstrich. Ein Gesicht mit Kreuz, das „<b>Sa</b>yōnara“ winkt.'],
    ['し','shi','🍣','Ein Angelhaken – daran hängt der Fisch für Su<b>shi</b>.'],
    ['す','su','🥄','Ein Tropfen <b>Su</b>ppe läuft am Löffel runter und dreht eine Schlaufe.'],
    ['せ','se','🧛','Ein Mund mit einem langen Vampirzahn – der Vampir sagt „<b>Se</b>rvus!“'],
    ['そ','so','🪡','Eine Zickzack-Naht: <b>so</b> näht man (engl. „sew“).'],
  ],
  t: [
    ['た','ta','🔤','Die Buchstaben <b>t</b> und <b>a</b> zusammengeschrieben – fast lesbar: „<b>ta</b>“.'],
    ['ち','chi','🍟','Sieht aus wie eine gespiegelte 5 – fünf Tüten <b>Chi</b>ps.'],
    ['つ','tsu','🌊','Eine <b>Tsu</b>nami-Welle, die sich gerade überschlägt.'],
    ['て','te','✋','Ein geschwungenes <b>T</b> – und 手 (<b>te</b>) heißt „Hand“.'],
    ['と','to','🦶','Ein Dorn steckt in einem Zeh – engl. „<b>to</b>e“.'],
  ],
  n: [
    ['な','na','🪢','Links ein Kreuz, rechts ein Knoten – ein Seemann zieht dran: „<b>Na</b>, hält’s?“'],
    ['に','ni','🦵','Links ein Bein, rechts zwei Striche (こ) – das <b>Kn</b>ie (engl. „knee“ = <b>ni</b>).'],
    ['ぬ','nu','🍜','Verknotete <b>Nu</b>deln mit einer Schlaufe am Ende. (め hat keine Schlaufe!)'],
    ['ね','ne','🐈','Eine Katze mit eingerolltem Schwanz – Katze heißt 猫 (<b>ne</b>ko).'],
    ['の','no','🚫','Ein rundes Verbotsschild: „<b>No</b>!“'],
  ],
  h: [
    ['は','ha','😄','Links ein Strich, rechts ein lachender Mund: „<b>Ha</b>!“ (Als Partikel wird は „wa“ gelesen.)'],
    ['ひ','hi','😁','Ein breites Grinsen: „<b>hi</b> hi hi“.'],
    ['ふ','fu','🗻','Der Berg <b>Fu</b>ji mit Gipfel und zwei Wolken an den Seiten.'],
    ['へ','he','⛰️','Ein kleiner Hügel – oben steht jemand und ruft „<b>He</b>y!“ (Als Partikel „e“ gelesen.)'],
    ['ほ','ho','🎅','Wie は, aber mit Schornstein oben – der Weihnachtsmann ruft „<b>Ho</b> ho ho“.'],
  ],
  m: [
    ['ま','ma','👩','Ein Kreuz mit Schleife unten – die <b>Ma</b>ma bindet ihre Schürze.'],
    ['み','mi','2️⃣','Sieht aus wie eine handgeschriebene 21 – „<b>Mi</b>tte zwanzig“.'],
    ['む','mu','🐄','Eine Kuh: links der Kopf mit Horn, rechts der Schwanz – „<b>Muh</b>!“'],
    ['め','me','👁️','Ein Auge – auf Japanisch 目 (<b>me</b>). Ohne Schlaufe (anders als ぬ).'],
    ['も','mo','🎣','Ein Angelhaken (wie し) mit zwei gefangenen Fischen – „<b>Mo</b>rgen gibt’s Fisch“.'],
  ],
  y: [
    ['や','ya','🐂','Ein <b>Ya</b>k mit seinen Hörnern.'],
    ['ゆ','yu','♨️','Steht auf jedem Onsen-Vorhang: 湯 (<b>yu</b>) = heißes Wasser.'],
    ['よ','yo','🪀','Ein <b>Yo</b>-Yo an der Schnur.'],
  ],
  r: [
    ['ら','ra','🐇','Ein Hase (engl. „<b>ra</b>bbit“) mit einem Ohr oben.'],
    ['り','ri','🏞️','Zwei Ufer eines Flusses (engl. „<b>ri</b>ver“).'],
    ['る','ru','🎢','Eine Achterbahn mit Looping am Ende – auf dem <b>Ru</b>mmel. (ろ hat keinen Looping.)'],
    ['れ','re','🤸','Jemand stützt sich ab und streckt das Bein – ein <b>Re</b>ck-Turner.'],
    ['ろ','ro','🌹','Sieht aus wie eine 3 – drei <b>Ro</b>sen. Ohne Schlaufe (anders als る).'],
  ],
  w: [
    ['わ','wa','🐋','Links ein Strich, rechts ein runder Bauch – ein <b>Wa</b>l.'],
    ['を','wo','😲','Jemand stolpert kopfüber: „<b>Wo</b>ah!“ (Nur als Partikel benutzt, gesprochen „o“.)'],
    ['ん','n','✍️','Ein kleines <b>n</b> in Schreibschrift.'],
  ],
};

// Katakana-Eselsbrücken nach Romaji
const KATA = {
  a:['🪓','Eine <b>A</b>xt.'],
  i:['🧍','Ein Mensch lehnt sich an: „<b>I</b>ch bin müde.“'],
  u:['🔲','Wie う, nur eckig – mit Hut oben drauf.'],
  e:['🏗️','Ein Stahlträger – aus <b>E</b>isen.'],
  o:['🤾','Wie お, nur eckig: ein Kreuz, über das ein Ball fliegt – „<b>O</b>h!“'],
  ka:['🦟','Wie か – nur ohne den Strich rechts.'],
  ki:['🔑','Wie き, nur kantiger – wieder der Schlüssel (key).'],
  ku:['🍰','Ein Kuchenstück von der Seite – <b>Ku</b>chen.'],
  ke:['🔤','Ein schiefes <b>K</b> – <b>ke</b>.'],
  ko:['🧳','Wie こ, aber die Enden verbunden – ein <b>Ko</b>ffer von der Seite.'],
  sa:['🚪','Wie さ, eckiger – eine <b>Sa</b>loontür mit zwei Pfosten.'],
  shi:['😊','Ein Gesicht, das von unten links nach oben lächelt. Die zwei Striche liegen fast <b>waagerecht</b>, der lange Strich geht von unten nach oben. (Achtung: ツ!)'],
  su:['🏃','Ein Strichmännchen rennt davon – „<b>Su</b>per schnell!“'],
  se:['🧛','Wie せ, nur eckig – der Vampirzahn ist noch da.'],
  so:['🪡','Zwei Striche fallen von <b>oben</b> herab – Nadelstiche beim Nähen (sew). (Achtung: ン!)'],
  ta:['👜','Wie ク, aber mit Strich innen – eine <b>Ta</b>sche mit Inhalt.'],
  chi:['🎽','Ein T mit schrägem Hut – eine <b>Chi</b>-Cheerleaderin. (Erinnert an 千.)'],
  tsu:['🌊','Die Striche stehen eher <b>senkrecht</b> oben, der lange Strich fällt von oben rechts nach unten – die <b>Tsu</b>nami bricht herunter. (Achtung: シ!)'],
  te:['📡','Eine Antenne – ein <b>Te</b>lefonmast mit zwei Querstreben.'],
  to:['🌿','Ein Pfosten mit einem Zweig – ein <b>To</b>rpfosten.'],
  na:['📌','Ein Kreuz mit langem Bein – ein <b>Na</b>gel.'],
  ni:['〰️','Wie に, ohne den linken Strich – einfach zwei Linien.'],
  nu:['🥢','Wie ス mit einem Strich durch – Stäbchen in den <b>Nu</b>deln.'],
  ne:['🧑‍🌾','Eine Vogelscheuche mit Hut, die die <b>Ne</b>ko (Katze) verscheucht.'],
  no:['🚫','Ein einziger Schrägstrich – wie ein Strich durch die Rechnung: „<b>No</b>!“'],
  ha:['🏠','Zwei Striche auseinander wie ein Dach – „<b>Ha</b>us“. (Wie 八 = hachi = acht.)'],
  hi:['🥄','Ein Löffel, der nach rechts zeigt – „<b>hi</b> hi“.'],
  fu:['🗻','Ein halber Haken – eine Seite des <b>Fu</b>ji.'],
  he:['⛰️','Genau wie へ – der gleiche Hügel!'],
  ho:['🎄','Ein Weihnachtsbaum mit Füßchen – „<b>Ho</b> ho ho“.'],
  ma:['👄','Ein Mund mit Zunge – „<b>Ma</b>mpf!“'],
  mi:['🍃','Drei schräge Striche – drei <b>Mi</b>nze-Blätter.'],
  mu:['💪','Ein angewinkelter Arm – „<b>Mu</b>skeln!“'],
  me:['❌','Ein X – wie ein zugekniffenes Auge (目 = <b>me</b>).'],
  mo:['🎣','Wie も, nur eckig – der Haken mit zwei Fischen.'],
  ya:['🐂','Wie や, nur eckig – das <b>Ya</b>k.'],
  yu:['🛁','Wie eine kleine Badewanne – <b>Yu</b> = heißes Wasser.'],
  yo:['🔤','Ein gespiegeltes E: „<b>Yo</b>!“'],
  ra:['🐇','Wie ら, eckig – der Hase mit Ohr.'],
  ri:['🏞️','Wie り – fast gleich, der Fluss.'],
  ru:['🦵','Zwei Beine, das rechte macht einen Kick nach oben – <b>Ru</b>gby.'],
  re:['🏒','Ein Hockeyschläger – ein Häkchen nach <b>re</b>chts.'],
  ro:['🤖','Ein Quadrat – der Kopf eines <b>Ro</b>boters.'],
  wa:['🥣','Wie ク mit Dach – eine <b>Wa</b>schschüssel.'],
  wo:['🪝','Wie ヨ mit Schwung – selten, „<b>wo</b>/o“ (nur als Partikel).'],
  n:['🌱','Ein Strich von <b>unten nach oben</b> – wie ein Spross, der wächst. (Achtung: ソ fällt von oben!)'],
};

const ROW_LABELS = {
  vowels:'Vokale', k:'K-Reihe', s:'S-Reihe', t:'T-Reihe', n:'N-Reihe', h:'H-Reihe',
  m:'M-Reihe', y:'Y-Reihe', r:'R-Reihe', w:'W-Reihe + N',
  g:'G (か + ゛)', z:'Z (さ + ゛)', d:'D (た + ゛)', b:'B (は + ゛)', p:'P (は + ゜)',
  ky:'KY', sh:'SH', ch:'CH', ny:'NY', hy:'HY', my:'MY', ry:'RY', gy:'GY', j:'J', by:'BY', py:'PY',
  ext1:'F-Laute', ext2:'T/D/W-Laute', ext3:'SH/J/CH/V',
};

const DAKU = {
  g: [['が','ga','か'],['ぎ','gi','き'],['ぐ','gu','く'],['げ','ge','け'],['ご','go','こ']],
  z: [['ざ','za','さ'],['じ','ji','し'],['ず','zu','す'],['ぜ','ze','せ'],['ぞ','zo','そ']],
  d: [['だ','da','た'],['ぢ','ji','ち'],['づ','zu','つ'],['で','de','て'],['ど','do','と']],
  b: [['ば','ba','は'],['び','bi','ひ'],['ぶ','bu','ふ'],['べ','be','へ'],['ぼ','bo','ほ']],
  p: [['ぱ','pa','は'],['ぴ','pi','ひ'],['ぷ','pu','ふ'],['ぺ','pe','へ'],['ぽ','po','ほ']],
};

const YOON_BASE = { ky:'き', sh:'し', ch:'ち', ny:'に', hy:'ひ', my:'み', ry:'り', gy:'ぎ', j:'じ', by:'び', py:'ぴ' };

const EXT = {
  ext1: [['ファ','fa'],['フィ','fi'],['フェ','fe'],['フォ','fo']],
  ext2: [['ティ','ti'],['ディ','di'],['トゥ','tu'],['ドゥ','du'],['ウィ','wi'],['ウェ','we'],['ウォ','wo']],
  ext3: [['シェ','she'],['ジェ','je'],['チェ','che'],['ヴ','vu'],['ヴァ','va']],
};
const EXT_NOTE = {
  ファ:'Für Fremdwörter: ファミリー (famirī) = Familie.', フィ:'フィルム (firumu) = Film.', フェ:'カフェ (kafe) = Café.', フォ:'フォーク (fōku) = Gabel.',
  ティ:'パーティー (pātī) = Party.', ディ:'ディズニー (dizunī) = Disney.', トゥ:'タトゥー (tatū) = Tattoo.', ドゥ:'Selten, z. B. in Namen.',
  ウィ:'ウィキペディア = Wikipedia.', ウェ:'ウェブ (webu) = Web.', ウォ:'ウォーター (wōtā) = Wasser (engl. water).',
  シェ:'シェフ (shefu) = Koch/Chef.', ジェ:'ジェット (jetto) = Jet.', チェ:'チェック (chekku) = Check.', ヴ:'Für „v“ – heute meist durch ブ ersetzt.', ヴァ:'ヴァイオリン = Violine (meist バイオリン).',
};

// Akzeptierte alternative Eingaben
export const ALT = {
  shi:['si'], chi:['ti'], tsu:['tu'], fu:['hu'], ji:['zi','di','dji'], zu:['du','dzu'], wo:['o'], n:['nn'],
  sha:['sya'], shu:['syu'], sho:['syo'], cha:['tya','cya'], chu:['tyu','cyu'], cho:['tyo','cyo'],
  ja:['jya','zya'], ju:['jyu','zyu'], jo:['jyo','zyo'], vu:['bu'], va:['ba'],
};

function mk(script, rowId, items, groupId) {
  return { id: `${script}-${rowId}`, script, row: rowId, group: groupId, label: ROW_LABELS[rowId], kana: items };
}

function build(script) {
  const K = script === 'k';
  const conv = s => (K ? hiraToKata(s) : s);
  const groups = [];

  const basic = Object.entries(HIRA).map(([rowId, list]) => mk(script, rowId, list.map(([c, r, e, m]) => {
    if (K) { const [ke, km] = KATA[r]; return { c: conv(c), r, e: ke, m: km, hira: c }; }
    return { c, r, e, m };
  }), 'basic'));
  groups.push({ id: `${script}-basic`, title: 'Grundzeichen', rows: basic });

  const daku = Object.entries(DAKU).map(([rowId, list]) => mk(script, rowId, list.map(([c, r, base]) => ({
    c: conv(c), r, e: rowId === 'p' ? '⭕' : '〃',
    m: `${conv(base)} + ${rowId === 'p' ? 'Handakuten ゜(kleiner Kreis)' : 'Dakuten ゛(zwei Striche)'} → <b>${r}</b>.` +
      (c === 'ぢ' ? ' Selten – meist wird じ benutzt.' : c === 'づ' ? ' Selten – meist wird ず benutzt.' : ''),
  })), 'daku'));
  groups.push({
    id: `${script}-daku`, title: 'Dakuten & Handakuten', rows: daku,
    intro: {
      title: 'Zwei Striche & ein Kreis',
      html: `<p>Du musst hier <b>nichts Neues</b> auswendig lernen – nur zwei Regeln:</p>
        <p><span class="big-inline">゛</span> <b>Dakuten</b> („Tenten“) macht den Laut stimmhaft:<br>
        k → <b>g</b> · s → <b>z</b> · t → <b>d</b> · h → <b>b</b></p>
        <p><span class="big-inline">゜</span> <b>Handakuten</b> („Maru“) gibt es nur bei der H-Reihe:<br>h → <b>p</b></p>
        <p class="muted">Beispiel: ${conv('か')} ka → ${conv('が')} ga · ${conv('は')} ha → ${conv('ば')} ba → ${conv('ぱ')} pa</p>`,
    },
  });

  const yoon = Object.entries(YOON_BASE).map(([rowId, base]) => mk(script, rowId, ['ゃ', 'ゅ', 'ょ'].map((sm, i) => {
    const r = rowId + 'auo'[i];
    const big = 'やゆよ'[i];
    return { c: conv(base + sm), r, e: '🔗', m: `${conv(base)} + kleines ${conv(sm)} → <b>${r}</b> (eine Silbe – nicht „${conv(base)}${conv(big)}“).` };
  }), 'yoon'));
  groups.push({
    id: `${script}-yoon`, title: 'Kombinationen (Yōon)', rows: yoon,
    intro: {
      title: 'Kleine ya, yu, yo',
      html: `<p>Nimm ein Zeichen, das auf <b>-i</b> endet (${conv('き')}, ${conv('し')}, ${conv('ち')} …) und hänge ein <b>kleines</b> ${conv('ゃ')} ${conv('ゅ')} ${conv('ょ')} an.</p>
        <p>Das „i“ verschmilzt: ${conv('き')} ki + ${conv('ゃ')} ya → <b>${conv('きゃ')} kya</b> (eine Silbe!)</p>
        <p>Sonderfälle: ${conv('しゃ')} = <b>sha</b>, ${conv('ちゃ')} = <b>cha</b>, ${conv('じゃ')} = <b>ja</b></p>
        <p class="muted">Achte auf die Größe: ${conv('きや')} (ki-ya, zwei Silben) ≠ ${conv('きゃ')} (kya)</p>`,
    },
  });

  if (K) {
    const ext = Object.entries(EXT).map(([rowId, list]) => mk(script, rowId, list.map(([c, r]) => ({ c, r, e: '🌍', m: `Laut für Fremdwörter: <b>${r}</b>. ${EXT_NOTE[c] || ''}` })), 'ext'));
    groups.push({
      id: 'k-ext', title: 'Erweiterte Laute', rows: ext,
      intro: {
        title: 'Laute für Fremdwörter',
        html: `<p>Für Wörter aus anderen Sprachen kombiniert Katakana Zeichen mit <b>kleinen Vokalen</b> ァ ィ ゥ ェ ォ.</p>
          <p>フ fu + ァ → <b>ファ fa</b> · テ te + ィ → <b>ティ ti</b> · シ shi + ェ → <b>シェ she</b></p>
          <p>Außerdem: <b>ー</b> verlängert den Vokal davor: コーヒー = kōhī (Kaffee).<br>
          Und ein kleines <b>ッ</b> verdoppelt den nächsten Konsonanten: ベッド = beddo (Bett).</p>`,
      },
    });
  }
  return groups;
}

export const KANA = { h: build('h'), k: build('k') };
export const SCRIPT_NAMES = { h: 'Hiragana', k: 'Katakana' };

export const ALL_ROWS = [...KANA.h, ...KANA.k].flatMap(g => g.rows);
export const ROW_BY_ID = Object.fromEntries(ALL_ROWS.map(r => [r.id, r]));
export const KANA_BY_CHAR = Object.fromEntries(ALL_ROWS.flatMap(r => r.kana.map(k => [k.c, { ...k, row: r.id, script: r.script }])));

export function answers(item) {
  return [item.r, ...(ALT[item.r] || [])];
}

// Hinweis für leicht verwechselbare Zeichen
export const CONFUSABLES = [
  ['シ', 'ツ', 'シ: Striche waagerecht, langer Strich von unten nach oben. ツ: Striche senkrecht, langer Strich fällt nach unten.'],
  ['ソ', 'ン', 'ソ: Strich fällt von oben. ン: Strich geht von unten nach oben.'],
  ['ぬ', 'め', 'ぬ hat am Ende eine Schlaufe (Nudel), め nicht (Auge).'],
  ['る', 'ろ', 'る hat unten einen Looping, ろ nicht.'],
  ['ね', 'れ', 'ね endet in einer Schlaufe (Katzenschwanz), れ in einem Kick nach außen.'],
  ['わ', 'れ', 'わ endet rund (Walbauch), れ mit Kick.'],
  ['さ', 'き', 'さ hat einen Querstrich, き zwei.'],
  ['は', 'ほ', 'ほ hat oben einen zusätzlichen Querstrich (Schornstein).'],
  ['ク', 'タ', 'タ hat einen zusätzlichen Strich innen.'],
  ['ウ', 'ワ', 'ウ hat oben einen kleinen Strich (Hut).'],
];

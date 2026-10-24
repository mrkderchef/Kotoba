// Texte der Lern-Erinnerung – benutzt von der App (Probe-Nachricht) und vom GitHub-Job.
// {due} = fällige Karten, {streak} = Tage in Folge

const ROAST = [
  { t: 'Willst du dein Leben lang allein bleiben und versauern? Dann lern halt weiter nichts. {due} Karten warten.', due: true },
  { t: 'Du lebst in Japan und bestellst immer noch per Fingerzeig wie ein Kleinkind. 👉🍜 {due} Karten. Jetzt.', due: true },
  { t: 'Die Konbini-Kassiererin lacht innerlich über dich. Jeden. Einzelnen. Tag.' },
  { t: 'Deine 🔥 {streak}-Tage-Serie stirbt heute. Genau wie dein Sozialleben, wenn du jetzt nicht lernst.', streak: true },
  { t: 'Selbst der Fahrkartenautomat kann mehr Japanisch als du. Und der ist ein Automat. 🤖' },
  { t: 'In 10 Jahren: allein in einer 1K-Wohnung, verbittert und immer noch „arigato“ mit Akzent. Oder du machst jetzt 5 Minuten.' },
  { t: 'Dein Japanisch ist so leer wie dein Kühlschrank. {due} Karten füllen wenigstens eins davon.', due: true },
  { t: 'Wieder Netflix statt Kanji? Respekt. So wird man der einsame Gaijin, über den die Nachbarn tuscheln.' },
  { t: '{due} Karten fällig. Dein zukünftiges, einsames Ich bedankt sich schon mal für gar nichts.', due: true },
  { t: 'Du kannst nicht mal „Ich brauch keine Tüte“ sagen. Erbärmlich. 袋はいりません – lern es endlich.' },
  { t: 'Japanische Kleinkinder sprechen besser Japanisch als du. Die sind zwei.' },
  { t: 'Weißt du, wer dir heute schreibt? Niemand. Außer mir. Weil du kein Japanisch kannst. {due} Karten.', due: true },
  { t: 'Dein Japanisch: „Sumimasen“ und verzweifeltes Lächeln. Mehr ist da nicht. Ändere das.' },
  { t: 'Wenn du heute nicht lernst, war der Umzug nach Japan nur ein sehr teurer Urlaub. 💸' },
  { t: 'Ganbatte? Ach was, du machst ja eh nichts. Beweis mir das Gegenteil: {due} Karten.', due: true },
  { t: 'Die Katze vom Nachbarn versteht mehr Japanisch als du. 🐈 にゃー。' },
  { t: 'Willst du für immer die Person sein, die beim Arzt nur stumm auf ihren Bauch zeigt? 🫃' },
  { t: 'Für immer allein bleiben ist natürlich auch ein Lebensmodell. Ansonsten: {due} Karten, 5 Minuten.', due: true },
  { t: 'Heute schon gelernt? Nein. Überrascht? Niemand.' },
  { t: '{streak} Tage am Stück – und heute willst du alles wegwerfen? Peinlich. Steh auf.', streak: true },
  { t: 'Jeder Tag ohne Japanisch ist ein Tag, an dem du in Japan einfach nur Tourist bist. Für immer.' },
  { t: 'Deine Dates in Japan werden genau so laufen: „…“ – „…“ – Rechnung bitte. Lern deine {due} Karten.', due: true },
];

const ROAST_TITLES = ['おい！Faulpelz.', 'Kotoba 言葉 – 😤', 'Schon wieder du …', 'Hey, du Versager 🙃', 'Zeit, dich zu schämen', 'だめだよ！'];

const NICE = [
  { t: '🔥 Deine {streak}-Tage-Serie läuft heute ab! {due} Karten sind fällig.', streak: true, due: true },
  { t: '🔥 Halte deine {streak}-Tage-Serie am Leben – ein paar Minuten reichen.', streak: true },
  { t: '{due} Karten sind fällig – 5 Minuten reichen. がんばって！', due: true },
  { t: 'Heute noch nichts gelernt – ein paar neue Wörter oder Kana? がんばって！' },
];

function fill(t, v) {
  return t.replace('{due}', v.due).replace('{streak}', v.streak);
}

// rnd: Zufallszahl 0..1 (für Tests überschreibbar)
export function reminderMessage({ due = 0, streak = 0, tone = 'roast' }, rnd = Math.random) {
  const pool = (tone === 'nice' ? NICE : ROAST).filter(m => (!m.due || due > 0) && (!m.streak || streak >= 2));
  // Bei laufender Serie bevorzugt die Serien-Sprüche
  const streakOnes = pool.filter(m => m.streak);
  const list = streakOnes.length && rnd() < 0.5 ? streakOnes : pool;
  const m = list[Math.floor(rnd() * list.length)];
  const title = tone === 'nice' ? 'Kotoba 言葉 – Zeit zum Lernen' : ROAST_TITLES[Math.floor(rnd() * ROAST_TITLES.length)];
  return { title, body: fill(m.t, { due, streak }).replace('1 Karten', '1 Karte') };
}

export const ROAST_COUNT = ROAST.length;

// Geschichten 1–12: Grundlagen und erste Sätze (は/です, の, あります, を/ます, ません, ました, か, から).
// Quiz: [Frage, richtige Antwort, falsch, falsch, falsch]
export const STORIES = [
  {
    id: 'kraken', emoji: '🐙', topic: 'Natur',
    title: 'Warum Kraken wie Aliens sind',
    teaser: 'Drei Herzen, blaues Blut und Arme, die selbst denken.',
    text: `
Stell dir vor, du tauchst hinab ins {海}. Es wird dunkler und kälter – und plötzlich gleitet eine {タコ} an dir vorbei. In einer Sekunde wechselt sie die Farbe, wird erst glatt, dann rau wie ein Felsen, und verschwindet in einer Spalte, die kaum größer ist als ihr {目}. Kein Wunder, dass Biologen sagen: Wer Außerirdischen begegnen will, sollte zuerst Kraken studieren.

Schon ihr Körper ist seltsam. Eine {タコ} hat drei {心臓}: Zwei pumpen Blut durch die Kiemen, das dritte durch den restlichen Körper. Und ihr Blut ist {青い} – es transportiert Sauerstoff nicht mit Eisen wie unseres, sondern mit Kupfer. Im kalten, sauerstoffarmen {海} ist das ein Vorteil.

Noch verrückter ist ihr Gehirn. Ein Krake hat rund 500 Millionen Nervenzellen, etwa so viele, wie ein Hund in seiner Großhirnrinde hat. Aber zwei Drittel davon sitzen nicht im Kopf, sondern in den acht Armen. Jeder Arm kann tasten, schmecken und ein Stück weit selbst entscheiden. In Aquarien schrauben Kraken Gläser auf, um an einen {魚} zu kommen, und manche klettern nachts aus ihrem Becken, um im Nachbarbecken zu jagen.

Und dann das {目}. Das Auge eines Kraken sieht unserem verblüffend ähnlich: Linse, Iris, Netzhaut. Dabei war unser letzter gemeinsamer Vorfahre ein wurmartiges Tierchen ohne richtige Augen. Die Evolution hat das Kamera-Auge also zweimal erfunden – und beim Kraken sogar besser: Er hat keinen blinden Fleck.

Das größte Rätsel: Kraken sind Meister der Tarnung und trotzdem wahrscheinlich farbenblind. Wie sie Farben nachahmen, die sie nicht sehen, ist bis heute nicht ganz geklärt. Vielleicht „sieht“ ihre Haut mit: In ihr hat man lichtempfindliche Eiweiße gefunden, wie sie sonst nur im {目} vorkommen.`,
    quiz: [
      ['Wie viele Herzen hat ein Krake?', 'Drei', 'Eins', 'Zwei', 'Acht'],
      ['Warum ist Krakenblut blau?', 'Es transportiert Sauerstoff mit Kupfer', 'Es enthält Tinte', 'Es ist besonders kalt', 'Es enthält viel Eisen'],
      ['Wo sitzen die meisten Nervenzellen eines Kraken?', 'In den Armen', 'Im Kopf', 'In den Herzen', 'In der Haut'],
    ],
  },
  {
    id: 'sokrates', emoji: '🏛️', topic: 'Philosophie',
    title: 'Sokrates – der Mann, der nur Fragen stellte',
    teaser: 'Er schrieb kein einziges Buch und veränderte trotzdem das Denken.',
    text: `
Athen, um 400 vor Christus. Auf dem Marktplatz der {町} steht ein barfüßiger Mann mit Stupsnase und stellt jedem, der vorbeikommt, eine {質問}: „Was ist Mut?“ „Was ist Gerechtigkeit?“ Der Mann heißt Sokrates, und er treibt die halbe Stadt in den Wahnsinn.

Sokrates war kein gewöhnlicher {先生}. Er nahm kein Geld, hielt keine Vorträge und schrieb kein einziges Buch. Was wir über ihn wissen, stammt vor allem von seinem Schüler Platon. Seine Methode war simpel und gnadenlos: Er fragte so lange nach, bis sein Gegenüber merkte, dass es seine eigene Meinung gar nicht begründen konnte. Jede {質問} war wie ein kleiner Stein, der ein ganzes Gedankengebäude zum Einsturz brachte.

Warum tat er das? Ein Freund hatte das Orakel von Delphi gefragt, ob es einen weiseren {人} gebe als Sokrates. Die Antwort: Nein. Sokrates war verwirrt – er hielt sich nicht für weise. Also prüfte er Politiker, Dichter und Handwerker. Sein Ergebnis: Alle glaubten, viel zu {知る}, und wussten doch wenig. Er selbst wusste wenigstens, dass er nichts wusste. Darin, meinte er, liege vielleicht seine Weisheit.

Nicht jeder {人} mag es, öffentlich vorgeführt zu werden. 399 vor Christus wurde Sokrates angeklagt: Er verderbe die Jugend und missachte die Götter der {町}. Ein Gericht aus 501 Bürgern sprach ihn schuldig. Statt um Gnade zu bitten, schlug er spöttisch vor, man solle ihn zur Belohnung lebenslang auf Staatskosten verpflegen. Das Urteil: Tod durch {毒} – einen Becher Schierling.

Seine Freunde hatten bereits eine Flucht organisiert. Sokrates lehnte ab: Wer sein Leben lang über Gesetze diskutiert, könne nicht davonlaufen, wenn sie ihm nicht passen. Er trank das {毒} ruhig, im Kreis seiner Schüler. Einer seiner berühmtesten Sätze, überliefert von Platon: „Ein ungeprüftes Leben ist nicht lebenswert.“ Vielleicht ist das die beste {質問} für heute: Was habe ich eigentlich schon einmal wirklich geprüft?`,
    quiz: [
      ['Wie viele Bücher hat Sokrates geschrieben?', 'Keines', 'Eines', 'Zwölf', 'Über hundert'],
      ['Woran starb Sokrates?', 'An einem Becher Schierling', 'Im Kampf', 'An Altersschwäche', 'Er floh und verschwand'],
      ['Woher wissen wir das meiste über Sokrates?', 'Von seinem Schüler Platon', 'Aus seinen eigenen Briefen', 'Von Homer', 'Aus Inschriften auf dem Marktplatz'],
    ],
  },
  {
    id: 'fuji', emoji: '🗻', topic: 'Geographie',
    title: 'Der Fuji – ein heiliger Vulkan',
    teaser: 'Der berühmteste Berg Japans schläft nur.',
    text: `
Wenn du an einem klaren Wintermorgen in Tokio aus dem Fenster schaust, siehst du ihn manchmal am Horizont: einen fast perfekten Kegel mit weißer Spitze. Der Fuji ist der höchste {山} in {日本} – 3.776 Meter {高い}. Und er ist nicht irgendein {山}: Er ist ein Vulkan, und er schläft nur.

Zum letzten Mal spuckte er 1707 {火}. Damals regnete es im rund 100 Kilometer entfernten Edo, dem heutigen Tokio, tagelang Asche. Seitdem ist es ruhig. Den größten Teil des Jahres liegt {雪} auf dem Gipfel, und an manchen Tagen spiegelt sich der Berg in den fünf Seen an seinem Fuß – im stillen {水} sieht man ihn dann doppelt.

Für viele Menschen in {日本} ist der Fuji heilig. Pilger stiegen schon vor Jahrhunderten in weißen Gewändern hinauf. Frauen war der Gipfel übrigens bis 1872 verboten. Heute klettern jeden Sommer rund 200.000 Menschen nach oben, oft in der Nacht, um den Sonnenaufgang zu sehen. Ein japanisches Sprichwort sagt: Wer den Fuji nie besteigt, ist ein Narr – wer ihn zweimal besteigt, auch.

Auch Künstler hat der {美しい} Berg verzaubert. Der Holzschnittmeister Hokusai schuf um 1830 die Serie „36 Ansichten des Berges Fuji“. Das berühmteste Bild daraus kennst du bestimmt: eine riesige Welle aus dem {海}, die wie eine Klaue nach kleinen Booten greift. Und ganz klein im Hintergrund, ruhig und voller {雪}: der Fuji.

2013 wurde der Fuji UNESCO-Welterbe – aber nicht als Natur-, sondern als Kulturerbe, als „heiliger Ort und Quelle künstlerischer Inspiration“. Ein Berg, der vor allem deshalb geschützt wird, weil {人} ihn seit Jahrhunderten mit staunenden {目} betrachten.`,
    quiz: [
      ['Wie hoch ist der Fuji?', '3.776 Meter', '2.962 Meter', '4.807 Meter', '8.848 Meter'],
      ['Wann ist der Fuji zuletzt ausgebrochen?', '1707', '1923', '1192', 'Noch nie'],
      ['Als was ist der Fuji UNESCO-Welterbe?', 'Als Kulturerbe', 'Als Naturerbe', 'Als Geopark', 'Er ist kein Welterbe'],
    ],
  },
  {
    id: 'kaffee', emoji: '☕', topic: 'Geschichte',
    title: 'Wie tanzende Ziegen den Kaffee entdeckten',
    teaser: 'Eine Legende, nächtliche Mönche und ein Trick in deinem Gehirn.',
    text: `
Äthiopien, vor vielen hundert Jahren. Ein Ziegenhirte namens Kaldi wundert sich über seine Herde: Die Ziegen springen herum, meckern die ganze {夜} hindurch und wollen einfach nicht {寝る}. Am nächsten {朝} sieht er, woran es liegt – sie knabbern an den {赤い} Früchten eines kleinen Strauchs. Kaldi probiert selbst und ist plötzlich hellwach.

Eine schöne Geschichte – leider vermutlich erfunden. Aufgeschrieben wurde sie erst 1671, lange nachdem Kaffee bekannt war. Sicher ist: Die Kaffeepflanze stammt aus dem Hochland Äthiopiens. Sie ist ein Strauch oder kleiner {木}, und ihre Früchte heißen Kaffeekirschen. Die Bohnen sind eigentlich die Kerne darin.

Die Ersten, von denen wir sicher {知る}, dass sie Kaffee tranken, waren Sufi-Mönche im Jemen im 15. Jahrhundert. Sie beteten nachts und brauchten etwas, um bis zum {朝} wach zu bleiben. Also kochten sie geröstete Bohnen mit heißem {水} – und ein Getränk war geboren, das heute fast die ganze Welt {飲む} will.

Über den Hafen Mokka verbreitete sich der Kaffee. In Mekka, Kairo und Konstantinopel entstanden Kaffeehäuser – {店}, in denen {人} redeten, Schach spielten und über Politik stritten. Herrschern war das unheimlich: Mehrmals wurde Kaffee verboten – ohne Erfolg. Im 17. Jahrhundert erreichte er Europa; als eines der ersten Kaffeehäuser gilt eines in Venedig um 1645. Bald hatte jede größere {町} eins.

Und warum macht Kaffee wach? Den ganzen Tag über sammelt sich in deinem Gehirn ein Stoff namens Adenosin, der dich langsam müde macht. Koffein sieht ihm ähnlich und besetzt seine Andockstellen. Die Müdigkeit ist also nicht weg – sie wird nur nicht gemeldet. Deshalb solltest du nach dem Abendkaffee nicht überrascht sein, wenn du in der {夜} nicht {寝る} kannst.`,
    quiz: [
      ['Wer trank nachweislich als Erste Kaffee?', 'Sufi-Mönche im Jemen', 'Der Hirte Kaldi', 'Römische Soldaten', 'Venezianische Händler'],
      ['Was blockiert Koffein im Gehirn?', 'Die Andockstellen von Adenosin', 'Die Produktion von Zucker', 'Den Herzschlag', 'Das Langzeitgedächtnis'],
      ['Was sind Kaffeebohnen eigentlich?', 'Die Kerne von Kaffeekirschen', 'Getrocknete Blätter', 'Wurzelknollen', 'Nüsse eines Baumes'],
    ],
  },
  {
    id: 'mond', emoji: '🌕', topic: 'Weltall',
    title: 'Der Hase im Mond',
    teaser: 'Warum Japaner im Vollmond einen Hasen sehen – und was die „Meere“ dort wirklich sind.',
    text: `
Schau heute Nacht in den {空}. Wenn der {月} voll ist, siehst du helle und dunkle Flecken. In Europa erkennen viele darin ein Gesicht, den „Mann im Mond“. In {日本} sieht man etwas ganz anderes: eine {うさぎ}, die mit einem Holzhammer Reiskuchen stampft – Mochi.

Dahinter steckt eine alte Legende aus Indien, die über China nach {日本} kam. Ein Affe, ein Fuchs und eine {うさぎ} treffen einen hungrigen alten Mann. Der Affe sammelt Früchte, der Fuchs fängt einen {魚}. Die {うさぎ} findet nichts – und springt deshalb selbst ins {火}, um dem Mann etwas zu essen zu geben. Der Alte ist in Wahrheit ein Gott. Gerührt zeichnet er ihr Bild auf den {月}, damit sich alle an sie erinnern.

Die dunklen Flecken haben auch einen wissenschaftlichen Namen: Astronomen nannten sie „Maria“, also Meere – auf Japanisch würde man {海} sagen. Früher hielt man sie wirklich für Wasser. Tatsächlich sind es riesige Ebenen aus erkalteter Lava. Im „Meer der Ruhe“ landete 1969 Apollo 11. Echtes {水} gibt es auf dem Mond vor allem als Eis, versteckt in ewig dunklen Kratern an den Polen.

Der {月} ist rund 384.000 Kilometer entfernt und hat etwa ein Viertel des Erddurchmessers. Er zeigt uns immer dieselbe Seite, weil er sich genau einmal um sich selbst dreht, während er die Erde umkreist. Und er bewegt die Erde: Seine Anziehung zieht am {海} und erzeugt Ebbe und Flut. Gleichzeitig entfernt er sich jedes Jahr um knapp vier Zentimeter von uns.

! Zeit für deine ersten japanischen Sätze! Das Muster: **A は B です** = „A ist B“. は wird hier „wa“ gesprochen. です macht den Satz höflich. Tippe auf einen Satz für die Übersetzung.

> {月}は{白い}です。 | Der Mond ist weiß.
> {空}は{青い}です。 | Der Himmel ist blau.
> {海}は{大きい}です。 | Das Meer ist groß.

Wenn du das nächste Mal den {大きい}, {白い} Vollmond siehst: Such die {うさぎ}. Sie stampft immer noch.`,
    quiz: [
      ['Was sieht man in Japan im Mond?', 'Einen Hasen, der Reiskuchen stampft', 'Einen Mann mit Laterne', 'Einen Drachen', 'Eine schlafende Katze'],
      ['Was sind die dunklen „Meere“ auf dem Mond wirklich?', 'Ebenen aus erkalteter Lava', 'Ausgetrocknete Ozeane', 'Schatten von Bergen', 'Staubwolken'],
      ['Warum sehen wir immer dieselbe Seite des Mondes?', 'Er dreht sich pro Erdumrundung genau einmal um sich selbst', 'Er dreht sich gar nicht', 'Die Erde verdeckt die andere Seite', 'Die Rückseite ist unsichtbar schwarz'],
    ],
  },
  {
    id: 'samurai', emoji: '⚔️', topic: 'Geschichte',
    title: 'Samurai – die Wahrheit hinter dem Mythos',
    teaser: 'Einsame Krieger? Eher Beamte mit Schwert.',
    text: `
Wenn du „Samurai“ hörst, denkst du vielleicht an einsame Krieger, die mit blitzendem {刀} für ihre Ehre kämpfen. Die Wirklichkeit war … bürokratischer.

Die {侍} entstanden im 12. Jahrhundert als bewaffnete Gefolgsleute mächtiger Familien. Das {家} – also der Clan – war alles: Man kämpfte für seinen Herrn, nicht für ein Land. Jahrhundertelang führten die Clans Krieg gegeneinander. In dieser Zeit entstanden viele {城} mit hohen Steinmauern und geschwungenen Dächern. Die schönste ist wohl Burg Himeji, so {白い}, dass man sie „Weißer Reiher“ nennt.

Dann kam der Frieden. Ab 1603 regierten die Tokugawa-Shogune {日本} mehr als 250 Jahre lang fast ohne Krieg. Die {侍} – nur einige Prozent der Bevölkerung – hatten plötzlich niemanden mehr zu bekämpfen. Viele wurden Beamte, Lehrer oder Verwalter, viele waren arm und verschuldet. Nur sie durften zwei Schwerter tragen, das lange {刀} und ein kurzes – oft mehr Statussymbol als Waffe.

Auch der berühmte „Bushidō“, der Ehrenkodex der Samurai, ist zum Teil ein jüngeres Bild. Bekannt wurde er vor allem durch ein Buch, das Nitobe Inazō um 1900 schrieb – auf Englisch, für westliche Leser, als es längst keine Samurai mehr gab. Denn 1876 war das Tragen von Schwertern verboten worden; der Stand der {侍} war abgeschafft.

Übrigens: Einer der überraschendsten Gefolgsleute jener Zeit kam aus Afrika. Yasuke reiste 1579 mit einem Jesuiten nach {日本}, und der Kriegsherr Oda Nobunaga nahm ihn in seine Dienste. Welchen Rang er genau hatte, darüber streiten Historiker bis heute. Wenn du einmal eine {古い} Burg besuchst, denk daran: Geschichte ist oft bunter als die Filme.

! Neues Muster: **の** verbindet zwei Nomen wie ein Genitiv: 日本の城 = „Japans Burg“. Und **これ** heißt „das hier“.

> {これ}は{侍}の{刀}です。 | Das ist das Schwert eines Samurai.
> {日本}の{城}は{古い}です。 | Japans Burgen sind alt.
> {侍}の{家}は{大きい}です。 | Das Haus des Samurai ist groß.`,
    quiz: [
      ['Was taten viele Samurai in der friedlichen Edo-Zeit?', 'Sie arbeiteten als Beamte und Verwalter', 'Sie kämpften täglich Duelle', 'Sie wurden alle Mönche', 'Sie wanderten nach China aus'],
      ['Wann wurde in Japan das Tragen von Schwertern verboten?', '1876', '1603', '1945', '1192'],
      ['In welcher Sprache schrieb Nitobe Inazō sein Buch über Bushidō?', 'Englisch', 'Japanisch', 'Chinesisch', 'Portugiesisch'],
    ],
  },
  {
    id: 'wald', emoji: '🌲', topic: 'Natur',
    title: 'Reden Bäume miteinander?',
    teaser: 'Das „Wood Wide Web“ unter deinen Füßen – und warum Forscher skeptisch bleiben.',
    text: `
Unter deinen Füßen, wenn du durch einen {森} gehst, liegt ein Netzwerk, das manche Forscher „Wood Wide Web“ nennen. Im {土} wachsen unzählige feine Pilzfäden, die sich um die Wurzeln der Bäume wickeln und sie miteinander verbinden.

Das Geschäft ist uralt: Der Pilz liefert dem {木} {水} und Mineralien, die er aus dem {土} holt. Der {木} bezahlt mit Zucker, den er mithilfe von Sonnenlicht herstellt. Ohne diese Partnerschaft könnten viele Bäume kaum überleben.

Berühmt wurde die Idee durch die kanadische Forscherin Suzanne Simard. 1997 zeigte sie, dass Kohlenstoff über solche Pilznetze von einer Birke zu einer Douglasie wandern kann. Später sprach sie von „Mutterbäumen“: {古い}, {大きい} Bäume, die ihre {子供} im Schatten mitversorgen. Bücher wie „Das geheime Leben der Bäume“ machten daraus ein Bild, das viele lieben: Bäume als {友達}, die miteinander {話す} können.

Aber Wissenschaft lebt vom Zweifel. 2023 prüften Forschende die Studien noch einmal und fanden, dass viele populäre Aussagen – etwa, dass eine {母} gezielt ihre eigenen {子供} füttert – schwächer belegt sind als gedacht. Dass Pilznetze existieren und wichtig sind, bezweifelt niemand. Wie viel „Absicht“ darin steckt, ist offen.

In {日本} gibt es übrigens ein eigenes Wort dafür, was ein {森} mit {人} macht: Shinrin-yoku, „Waldbaden“. Die japanische Forstbehörde prägte den Begriff 1982 – und Studien deuten darauf hin, dass ein Spaziergang zwischen Bäumen Stresshormone senken kann. Ob die Bäume dabei über dich {話す}? Wer weiß.

! Neues Muster: **X に Y が あります** = „In X gibt es Y“ – für Dinge und Pflanzen. Für Lebewesen sagst du **います**.

> {森}に{大きい}{木}があります。 | Im Wald gibt es einen großen Baum.
> {土}に{水}があります。 | In der Erde gibt es Wasser.
> {森}に{うさぎ}がいます。 | Im Wald gibt es einen Hasen.`,
    quiz: [
      ['Was bekommen Bäume von den Pilzen im Boden?', 'Wasser und Mineralien', 'Zucker', 'Licht', 'Wärme'],
      ['Was bedeutet Shinrin-yoku?', 'Waldbaden', 'Baumschule', 'Pilzsuppe', 'Holzhaus'],
      ['Was ergab eine Überprüfung der Studien im Jahr 2023?', 'Viele populäre Aussagen sind schwächer belegt als gedacht', 'Bäume können wirklich sprechen', 'Pilznetze gibt es gar nicht', 'Nur Birken haben Pilznetze'],
    ],
  },
  {
    id: 'tee', emoji: '🍵', topic: 'Japan',
    title: 'Der Teemeister, der sterben musste',
    teaser: 'Sen no Rikyū, eine winzige Tür und die Schönheit des Unvollkommenen.',
    text: `
Kyoto, 16. Jahrhundert. Ein mächtiger Kriegsherr kriecht auf Knien durch eine winzige Tür, kaum 70 Zentimeter hoch. Sein {刀} musste er draußen lassen. Drinnen: ein {部屋} von gerade mal zwei Tatami-Matten, gedämpftes Licht, ein Kessel über dem {火}. Willkommen bei Sen no Rikyū, dem berühmtesten Teemeister von {日本}. Durch die niedrige Tür muss sich jeder bücken – im Teeraum sind alle gleich.

Die Teezeremonie, Sadō oder Chadō genannt – der „Weg des Tees“ –, ist mehr als {お茶} zu {飲む}. Jede Bewegung der {手} ist festgelegt: wie man die Schale dreht, wie man das grüne Pulver mit heißem {水} aufschlägt, wie man sich verbeugt. Das Ziel ist nicht Perfektion, sondern Aufmerksamkeit. In einem {静か} {部屋} soll man ganz im Moment sein.

Rikyū prägte ein Schönheitsideal, das man Wabi-Sabi nennt: {美しい} ist nicht das Prunkvolle, sondern das Schlichte, Unregelmäßige, Vergängliche. Eine schiefe, rissige Teeschale kann schöner sein als eine aus Gold. Zerbrochene Schalen werden in {日本} sogar mit Goldlack repariert – Kintsugi. Der Riss wird nicht versteckt, er wird Teil der Geschichte.

Ausgerechnet Rikyūs Herr sah das anders. Toyotomi Hideyoshi, der mächtigste Mann des Landes, ließ sich einen tragbaren Teeraum bauen – komplett mit Blattgold verkleidet. Die beiden waren so etwas wie {友達} – aber es war eine schwierige Freundschaft. 1591 befahl Hideyoshi seinem Teemeister plötzlich, sich das Leben zu nehmen. Warum, weiß bis heute niemand genau. Rikyū soll vorher ein letztes Mal {お茶} für seine Schüler zubereitet haben.

Ein Ausdruck aus der Welt des Tees ist bis heute berühmt: Ichi-go ichi-e, „ein Mal, eine Begegnung“. Jedes Treffen ist einzigartig und kommt nie wieder. Vielleicht ist das der Kern: Nicht der Tee ist wichtig, sondern dass du ihn jetzt trinkst, mit genau diesen {人}.

! Neues Muster: **を** (gesprochen „o“) markiert, was man tut. Verben bekommen in der höflichen Form die Endung **ます**: 飲む → 飲みます.

> {侍}は{お茶}を{飲む|飲みます|のみます}。 | Der Samurai trinkt Tee.
> {部屋}は{静か}です。 | Der Raum ist still.
> {これ}は{古い}{お茶}の{部屋}です。 | Das ist ein alter Teeraum.`,
    quiz: [
      ['Warum war die Tür zum Teeraum so niedrig?', 'Jeder musste sich bücken – im Teeraum sind alle gleich', 'Um Holz zu sparen', 'Als Schutz vor Dieben', 'Damit die Wärme drinnen bleibt'],
      ['Was bedeutet Ichi-go ichi-e?', 'Ein Mal, eine Begegnung', 'Ein Tee, ein Leben', 'Erst die Arbeit, dann der Tee', 'Grün ist das Leben'],
      ['Was ist Kintsugi?', 'Reparatur zerbrochener Keramik mit Goldlack', 'Eine Teesorte', 'Eine Schwerttechnik', 'Ein Gedicht mit 17 Silben'],
    ],
  },
  {
    id: 'wale', emoji: '🐋', topic: 'Natur',
    title: 'Das Lied der Wale',
    teaser: 'Hits, die um die Welt gehen – und der einsamste Wal der Welt.',
    text: `
1970 erschien eine Schallplatte, die die Welt verändert hat. Darauf: keine Band, kein Orchester – sondern {クジラ}. Der Biologe Roger Payne hatte die {歌} von Buckelwalen aufgenommen. Zum ersten Mal konnten Millionen {人} diese seltsame, traurige, wunderschöne {声} {聞く}. Die Platte wurde zum Soundtrack der Bewegung „Rettet die Wale“.

Buckelwal-{歌} sind erstaunlich komplex. Nur die Männchen singen. Eine {母} und ihr Kalb dagegen „flüstern“ eher miteinander – vermutlich, damit keine Schwertwale mithören. Themen wiederholen sich, ein Lied kann zwanzig Minuten dauern – und dann stundenlang von vorn beginnen. Alle Männchen einer Region singen ungefähr dasselbe {歌}. Und es verändert sich: Im Südpazifik beobachteten Forschende, wie sich neue Lieder von Population zu Population nach Osten ausbreiteten, über Tausende Kilometer – wie ein Hit, der um die Welt geht.

Im {海} trägt Schall viel weiter als in der Luft. Die tiefen Rufe großer Wale können Hunderte Kilometer weit reisen. Für sie ist ein {遠い} Artgenosse also gar nicht so {遠い}.

Und dann gibt es den einsamsten Wal der Welt. 1989 fingen Unterwassermikrofone der US-Marine einen Ruf auf, der zu keiner bekannten Art passte: 52 Hertz, höher als bei Blau- oder Finnwalen. Jahr für Jahr zog diese {声} durch den Pazifik, allein. Die Medien nannten ihn den Wal, den niemand {聞く} kann. Vielleicht ist er gar nicht {一人} – vielleicht ist er ein Mischling, und andere verstehen ihn sehr wohl. Gesehen hat ihn noch nie jemand.

Übrigens fliegt ein Walgesang gerade durchs All: Auf der goldenen Schallplatte der Voyager-Sonden, gestartet 1977, ist neben Grüßen in 55 Sprachen auch die {声} eines Buckelwals.

! Neues Muster: **ません** ist das höfliche „nicht“: 歌います (singt) → 歌いません (singt nicht).

> {クジラ}は{歌}を歌《うた》います。 | Wale singen Lieder.
> {魚}は歌《うた》いません。 | Fische singen nicht.
> {人}は{クジラ}の{声}を{聞く|聞きます|ききます}。 | Menschen hören die Stimme der Wale.`,
    quiz: [
      ['Welche Buckelwale singen?', 'Nur die Männchen', 'Nur die Weibchen', 'Nur die Jungtiere', 'Alle gleichermaßen'],
      ['Was ist besonders am „einsamsten Wal der Welt“?', 'Er ruft auf 52 Hertz – keine bekannte Art klingt so', 'Er ist der größte Wal der Welt', 'Er ist komplett weiß', 'Er lebt in einem Süßwassersee'],
      ['Wohin breiteten sich neue Buckelwal-Lieder im Südpazifik aus?', 'Nach Osten', 'Nach Westen', 'Zum Südpol', 'Gar nicht – jede Gruppe bleibt bei ihrem Lied'],
    ],
  },
  {
    id: 'pompeji', emoji: '🌋', topic: 'Geschichte',
    title: 'Pompeji – der letzte Tag',
    teaser: 'Römisches Fast Food, ein Hund aus Gips und ein falsches Datum.',
    text: `
Ein ganz gewöhnlicher Tag im Jahr 79 nach Christus. In Pompeji öffnen die {店}. An steinernen Theken – Archäologen haben rund 80 solcher Garküchen gefunden – kaufen {人} warmes Essen für unterwegs. Viele Römer hatten keine eigene Küche und wollten schnell etwas {食べる}, mitten im Gewimmel der {町}. Ein Bäcker schiebt runde {パン} in den Ofen, in acht Stücke vorgeschnitten.

Über der Stadt liegt ein grüner {山} voller Weinberge: der Vesuv. Kaum jemand ahnt, dass er ein Vulkan ist – er war seit Jahrhunderten ruhig. Dann explodiert er. Eine Säule aus Asche und Bimsstein schießt über 30 Kilometer {高い} in den {空}. Stundenlang regnet es Steine. In der Nacht und am {朝} danach rasen Glutwolken aus heißem Gas den Berg hinunter – schneller als jedes Pferd. Wer noch in der Stadt ist, hat keine Chance.

Pompeji verschwindet unter Metern von Asche – und genau das konserviert es. Als man im 18. Jahrhundert zu graben begann, fand man eine eingefrorene Welt: {道} mit Wagenspuren, Wandmalereien, Wahlwerbung und freche Graffiti. Verkohlte {パン} lag noch im Ofen. Am Eingang eines {家} warnt ein Mosaik mit einem schwarzen {犬}: „Cave canem“ – Vorsicht vor dem Hund.

1863 hatte der Archäologe Giuseppe Fiorelli eine geniale Idee. Die Körper der Opfer waren in der Asche zerfallen und hatten Hohlräume hinterlassen. Fiorelli goss Gips hinein. So entstanden die erschütternden Abgüsse, die man heute sieht: Menschen, die sich die {手} vors Gesicht halten, und ein {犬}, der sich an seiner Kette windet.

Lange hieß es, der Ausbruch sei am 24. August gewesen – so steht es in Abschriften der Briefe von Plinius dem Jüngeren, der alles von der anderen Seite der Bucht beobachtete. 2018 fand man aber eine Kohle-Inschrift, die auf Mitte Oktober datiert ist. Vermutlich war es also Herbst. Geschichte ist nie ganz fertig.

! Neues Muster – die Vergangenheit: **ます → ました**, **います → いました**.

> {人}は{パン}を{食べる|食べました|たべました}。 | Die Menschen aßen Brot.
> {犬}は{家}にいました。 | Der Hund war im Haus.
> {道}は{古い}です。 | Die Straßen sind alt.`,
    quiz: [
      ['Wie entstanden die berühmten Körper-Abgüsse von Pompeji?', 'Man goss Gips in Hohlräume in der Asche', 'Die Körper versteinerten von selbst', 'Künstler meißelten sie im Mittelalter', 'Sie wurden aus Wachs nachgebildet'],
      ['Was steht auf dem berühmten Mosaik am Hauseingang?', 'Vorsicht vor dem Hund', 'Betreten verboten', 'Hier gibt es Brot', 'Vorsicht, Vulkan'],
      ['Was spricht dafür, dass der Ausbruch im Herbst war?', 'Eine 2018 gefundene Kohle-Inschrift', 'Ein Brief von Julius Caesar', 'Schnee in der Asche', 'Ein goldener Kalender'],
    ],
  },
  {
    id: 'aurel', emoji: '🏺', topic: 'Philosophie',
    title: 'Der Kaiser, der sich selbst Briefe schrieb',
    teaser: 'Marc Aurel, die Stoa und eine Übung, die heute noch funktioniert.',
    text: `
Stell dir vor, du bist der mächtigste {人} der Welt. Rom, 2. Jahrhundert, dein Reich reicht von Britannien bis Ägypten. Und was tust du abends, {一人} im Feldlager? Du schreibst dir selbst Notizen, wie du ein besserer Mensch wirst.

Marc Aurel war von 161 bis 180 römischer Kaiser. Einen großen Teil seiner Herrschaft verbrachte er mit Kriegen an der Donau und einer verheerenden Seuche. Trotzdem nahm er sich fast {毎日} Zeit, um zu {書く}. Nicht für Leser, sondern für sich – auf Griechisch. Die Notizen hießen schlicht „An sich selbst“; heute kennen wir sie als „Selbstbetrachtungen“. Im ersten Buch dankt er jedem {先生}, der ihn geprägt hat – einer lieh ihm die Schriften des Epiktet, eines ehemaligen Sklaven.

Marc Aurel war Stoiker. Die Stoa lehrt eine einfache, aber schwere Übung: Unterscheide, was in deiner Macht liegt und was nicht. Das Wetter, die Meinung anderer, Krankheit, Tod – nicht in deiner Macht. Dein Urteil, deine Haltung, dein Handeln – schon. Wer das wirklich verinnerlicht, hat ein {強い} {心} – gemeint ist nicht das {心臓}, sondern der Geist.

Einer seiner Gedanken klingt erstaunlich modern: Wenn dich etwas Äußeres quält, dann quält dich nicht die Sache selbst, sondern dein Urteil darüber – und das kannst du ändern. Morgens erinnerte er sich daran, dass ihm heute undankbare und unhöfliche {人} begegnen würden – und dass er trotzdem nicht wütend werden müsse. Statt sich über die Zukunft zu sorgen, wollte er lieber darüber {考える}, was jetzt zu tun ist.

Seine Reiterstatue in Rom hat übrigens nur überlebt, weil man im Mittelalter glaubte, sie zeige Konstantin, den ersten christlichen Kaiser. Sonst wäre die Bronze wohl eingeschmolzen worden. Ein Irrtum hat den Philosophen gerettet – fast schon stoisch.

! Neues Muster: **か** am Satzende macht eine Frage – ein gesprochenes Fragezeichen.

> マルクス・アウレリウスは{毎日}{書く|書きました|かきました}。 | Marc Aurel schrieb jeden Tag.
> 何《なに》を{考える|考えますか|かんがえますか}。 | Woran denkst du?
> {強い}{人}は誰《だれ》ですか。 | Wer ist ein starker Mensch?
> {強い}{心}は{静か}です。 | Ein starker Geist ist ruhig.`,
    quiz: [
      ['In welcher Sprache schrieb Marc Aurel seine Notizen?', 'Griechisch', 'Latein', 'Aramäisch', 'Ägyptisch'],
      ['Was ist die Kernübung der Stoiker?', 'Unterscheiden, was in deiner Macht liegt und was nicht', 'Möglichst viel besitzen', 'Gefühle immer laut zeigen', 'Nie über den Tod nachdenken'],
      ['Warum überlebte seine Reiterstatue das Mittelalter?', 'Man hielt ihn für Kaiser Konstantin', 'Sie war unter der Erde vergraben', 'Sie war aus Stein statt Bronze', 'Sie stand in Ägypten'],
    ],
  },
  {
    id: 'nihon', emoji: '🎌', topic: 'Japan',
    title: 'Warum Japan „Ursprung der Sonne“ heißt',
    teaser: 'Ein frecher Brief an den Kaiser von China und doppelt so viele Inseln wie gedacht.',
    text: `
Wie heißt Japan eigentlich auf Japanisch? {日本} – Nihon oder Nippon. Die beiden Zeichen bedeuten „Sonne“ und „Ursprung“: das Land, wo die Sonne herkommt. Aber warum gibt sich ein Land so einen {名前}?

Die Antwort liegt im Westen – in China. Von dort aus gesehen liegt Japan im {東}, dort, wo der {太陽} morgens aufgeht. Früher nannten die Chinesen die Inseln „Wa“, ein Name, den man in Japan bald nicht mehr mochte. Im 7. Jahrhundert setzte sich der neue {名前} durch. Berühmt ist ein Brief, den der japanische Hof 607 an den Kaiser von China schickte: „Der Himmelssohn im Land der aufgehenden Sonne an den Himmelssohn im Land der untergehenden Sonne.“ Der chinesische Kaiser soll nicht amüsiert gewesen sein.

Und „Japan“? Das kam auf Umwegen. Marco Polo hörte in China von einem Inselreich namens „Cipangu“ – einer chinesischen Aussprache von {日本}{国}, „Land Japan“. Über Portugiesen und Holländer wurde daraus „Japan“. Das Wort, das die ganze Welt benutzt, ist also die Übersetzung einer Übersetzung.

Wie viele {島} hat {日本}? Lange lautete die offizielle Antwort: 6.852. 2023 zählte die Vermessungsbehörde mit modernen Karten neu – und kam auf 14.125. Das Land war nicht gewachsen, man hatte nur genauer hingeschaut. Die vier großen {島} – Honshū, Hokkaidō, Kyūshū und Shikoku – kennst du vielleicht. Auf Honshū liegen Tokio, Kyoto und der Fuji.

Sogar die Flagge erzählt die Geschichte: ein {赤い} Kreis auf {白い} Grund. Hinomaru, „Sonnenscheibe“. Ein {国}, das seinen {名前}, seine Flagge und ein bisschen seine Seele dem {太陽} verdankt.

! Zwei neue kleine Wörter: **から** = „von, aus“ und **と** = „und“ (zwischen Nomen). Und jetzt ein ganzer Block auf Japanisch – du kennst schon alle Wörter!

> {日本}は{島}の{国}です。 | Japan ist ein Land der Inseln.
> {太陽}は{東}から出《で》ます。 | Die Sonne geht im Osten auf (wörtlich: kommt aus dem Osten).
> {日本}の{名前}は「日《ひ》の本《もと》」です。 | Japans Name ist „Ursprung der Sonne“.
> {日本}に{山}と{海}があります。 | In Japan gibt es Berge und Meer.`,
    quiz: [
      ['Was bedeutet 日本 wörtlich?', 'Ursprung der Sonne', 'Land der Inseln', 'Reich der Mitte', 'Großer Berg'],
      ['Wie viele Inseln zählte Japan bei der Neuzählung 2023?', '14.125', '6.852', '4', '1.000'],
      ['Woher kommt das Wort „Japan“?', 'Von einer chinesischen Aussprache, über Marco Polo und Portugiesen', 'Von einem Kaiser namens Japan', 'Aus dem Lateinischen für „Osten“', 'Vom englischen Wort „jade“'],
    ],
  },
];

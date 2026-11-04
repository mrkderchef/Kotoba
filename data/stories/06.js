// Geschichten 45–52: Orientierung, Sicherheit, Wahrnehmung, Lernen, Licht, Berge, Treue, Wissenschaft.
// Muster: Ortsangaben, Adjektive verbinden, 〜より, 〜前に, 〜てください, 〜てもいい, います/あります, 〜てから.
export const STORIES = [
  {
    id: 'norden', emoji: '🧭', topic: 'Geographie',
    title: 'Warum Norden nicht immer oben ist',
    teaser: 'Eine Karte hat ein Oben. Die Erde im Weltall nicht.',
    text: `
Du öffnest eine {地図}: {北} liegt meistens {上}, {南} meistens {下}. Das wirkt so selbstverständlich, als wäre die Welt genau so gebaut. Doch eine Kugel hat kein eingebautes Oben. Karten könnten genauso gut den Süden an den oberen Rand setzen. Die vertraute Ausrichtung ist eine Vereinbarung, kein Naturgesetz.

Ein Kompass löst ein anderes Problem. Seine magnetische Nadel richtet sich am Magnetfeld der Erde aus. Der geografische Nordpol dagegen ist durch die Drehachse der Erde bestimmt. **Magnetischer und geografischer Norden sind nicht dasselbe.** Der Winkel zwischen den beiden Richtungen hängt vom Ort und vom Zeitpunkt ab. Gute Karten helfen dabei, diesen Unterschied zu berücksichtigen.

Stell dir vor, du stehst vor einem Bahnhof. Die {学校} liegt im {西}, der Park im Süden. Aber „links“ und „rechts“ ändern sich, sobald du dich umdrehst. Himmelsrichtungen bleiben als Bezugssystem erhalten. Deshalb sind sie für eine Beschreibung über große Entfernungen so nützlich.

Für den letzten Weg zur Verabredung brauchst du trotzdem oft andere Wörter: Ist dein Freund {中} im Gebäude oder {外}? Wartet er {横} neben dem Eingang, {向こう} auf der anderen Straßenseite oder ganz in deiner {そば}? Eine gute Wegbeschreibung verbindet die große Karte mit dem kleinen Blick vor Ort.

! **Ort + の + 上 / 下 / 中 / 外 / 横** beschreibt eine Lage: 本は机の上にあります = Das Buch liegt auf dem Tisch. **の** verbindet hier zwei Nomen.

> {地図}では、{北}は{上}です。 | Auf der Karte ist Norden oben.
> {学校}は{駅}の{西}にあります。 | Die Schule liegt westlich des Bahnhofs.
> {猫}は{家}の{中}にいます。 | Die Katze ist im Haus.
> {友達}は{外}にいます。 | Mein Freund ist draußen.
> {銀行}は{駅}の{横}にあります。 | Die Bank ist neben dem Bahnhof.
> {川}の{向こう}に{山}があります。 | Auf der anderen Seite des Flusses ist ein Berg.`,
    quiz: [
      ['Warum ist Norden auf vielen Karten oben?', 'Das ist eine kartografische Vereinbarung', 'Die Erde hat dort ihre Oberseite', 'Der Süden ist schwerer', 'Kompassnadeln zeigen nach oben'],
      ['Was bestimmt den geografischen Nordpol?', 'Die Drehachse der Erde', 'Das Wetter', 'Die Lage des Mondes', 'Die nächste Stadt'],
      ['Was ändert sich beim Umdrehen?', 'Links und rechts aus deiner Sicht', 'Die Lage des Nordpols', 'Die Himmelsrichtungen auf der Erde', 'Die Richtung der Erdrotation'],
    ],
  },
  {
    id: 'titanic', emoji: '🚢', topic: 'Geschichte',
    title: 'Die Titanic und die Regeln danach',
    teaser: 'Warum ein prächtiges Schiff noch kein sicheres Schiff ist.',
    text: `
Ein {新しい} Schiff kann {立派} aussehen und trotzdem Schwachstellen haben. Die Titanic wurde zum berühmten Beispiel dafür: Auf ihrer ersten Atlantikreise kollidierte sie 1912 mit einem Eisberg und sank. Das Unglück machte deutlich, wie {危ない} eine Reise werden kann, wenn Technik, Organisation und Rettungsmittel nicht zusammenpassen.

Auf einem Passagierschiff zählt nicht nur, ob die Maschinen funktionieren. Menschen müssen Warnungen verstehen, Wege finden und Rettungsboote erreichen können. Ob ein Koffer {重い} oder {軽い} ist, wird dann plötzlich nebensächlich. **Sicherheit ist ein System**, keine einzelne Eigenschaft eines Bauteils.

Als Reaktion auf die Katastrophe entstand 1914 die erste internationale SOLAS-Konvention. Der Name steht für „Safety of Life at Sea“, also den Schutz menschlichen Lebens auf See. Spätere Fassungen entwickelten die Regeln weiter. Das Unglück veränderte damit nicht nur die Geschichte eines Schiffes, sondern auch die internationale Zusammenarbeit.

Im Alltag verwechseln wir leicht sichtbare Qualität mit Sicherheit. Eine {厚い} Tür wirkt verlässlich, eine {薄い} Wand zerbrechlich. Doch der Eindruck allein reicht nicht. Entscheidend ist, ob etwas für seinen Zweck geprüft und richtig benutzt wird. Ein {有名} Name ersetzt diese Prüfung nicht. Auf See wie an Land ist es {大切}, auch an den Moment zu denken, in dem etwas schiefgeht.

! **い-Adjektive verbinden:** 新しい → 新しくて: 新しくて大きい = neu und groß. Bei **な-Adjektiven** steht **で**: 立派で有名 = prächtig und berühmt.

> {この}{船}は{新しい}です。 | Dieses Schiff ist neu.
> {荷物}は{重い}です。 | Das Gepäck ist schwer.
> {この}{本}は{厚い}です。{あの}{本}は{薄い}です。 | Dieses Buch ist dick. Jenes Buch ist dünn.
> {この}{建物}は{立派}で{有名}です。 | Dieses Gebäude ist prächtig und berühmt.
> ここは{危ない}です。 | Hier ist es gefährlich.
> {水}は{大切}です。 | Wasser ist wichtig.`,
    quiz: [
      ['Was löste die erste SOLAS-Konvention mit aus?', 'Der Untergang der Titanic', 'Die Erfindung des Flugzeugs', 'Ein Erdbeben in Tokio', 'Der Bau des Suezkanals'],
      ['Wann entstand die erste SOLAS-Konvention?', '1914', '1814', '1953', '2001'],
      ['Welche Aussage beschreibt die Lehre der Geschichte?', 'Sicherheit braucht Technik und Organisation', 'Neue Schiffe sind immer sicher', 'Berühmte Namen ersetzen Prüfungen', 'Nur die Dicke der Türen zählt'],
    ],
  },
  {
    id: 'kleine-welt', emoji: '🔎', topic: 'Wahrnehmung',
    title: 'Dieselbe Welt aus einer anderen Höhe',
    teaser: 'Für Erwachsene eine Pfütze, für Kinder ein kleiner See.',
    text: `
Nach dem Regen gehen ein {男の子}, eine {女の子} und ein {大人} durch einen Park. Vor ihnen liegt eine Pfütze. Für den Erwachsenen ist sie ein Hindernis auf dem Weg. Für die Kinder ist sie eine ganze Landschaft: Wolken spiegeln sich darin, ein Blatt schwimmt wie ein Boot, und am Rand entsteht ein Fluss aus Schlamm.

Alle sehen {同じ} Wasser. Trotzdem ist ihr Erlebnis nicht gleich. Körpergröße, Erfahrung und Absicht verändern, was auffällt. Wer {小さい} ist, entdeckt Dinge nah am Boden. Wer es eilig hat, achtet auf den kürzesten Weg. Wer spielen möchte, findet Möglichkeiten, die andere übersehen.

Auch unsere Bewertungen sind verschieden. Die Schuhe sind danach {汚い}; das findet ein Elternteil vielleicht {悪い}. Die Kinder finden den Ausflug {いい}, weil sie etwas ausprobiert haben. Der Park ist für sie nicht nur {きれい}, wenn alles ordentlich aussieht. Er ist interessant, wenn darin etwas passiert.

Das ist keine Regel, nach der jeder {若い} Mensch neugierig und jeder Erwachsene unaufmerksam wäre. Es ist eine Einladung zum Perspektivwechsel. Beim nächsten Spaziergang kannst du fragen: Was würde jemand bemerken, der halb so groß ist wie ich? Vielleicht brauchst du nichts Neues zu kaufen, obwohl du etwas Neues {欲しい} findest. Manchmal reicht ein anderer Blick auf dieselbe Welt.

! **A は B より …** = A ist … als B: この木はあの木より小さいです. **より** markiert den Vergleichspunkt.

> {この}{木}は{あの}{木}より{小さい}です。 | Dieser Baum ist kleiner als jener Baum.
> {男の子}と{女の子}が{公園}で{遊ぶ|遊んでいます|あそんでいます}。 | Ein Junge und ein Mädchen spielen im Park.
> {大人}も{遊ぶ|遊びます|あそびます}。 | Auch Erwachsene spielen.
> {靴}は{汚い}ですが、{花}は{きれい}です。 | Die Schuhe sind schmutzig, aber die Blumen sind schön.
> {私}も{同じ}{本}が{欲しい}です。 | Ich möchte auch dasselbe Buch haben.
> {この}{写真}と{あの}{写真}は{違う|違います|ちがいます}。 | Dieses Foto und jenes Foto unterscheiden sich.`,
    quiz: [
      ['Was ist für alle drei Personen gleich?', 'Die Pfütze, die sie betrachten', 'Ihre Körpergröße', 'Ihre Absicht', 'Ihre Bewertung der Schuhe'],
      ['Was beeinflusst laut Geschichte unsere Wahrnehmung?', 'Erfahrung und Absicht', 'Nur der Wochentag', 'Nur der Preis der Schuhe', 'Allein die Sprache'],
      ['Welche Idee regt die Geschichte an?', 'Die Umgebung aus einer anderen Perspektive betrachten', 'Bei Regen immer zu Hause bleiben', 'Für neue Erlebnisse immer etwas kaufen', 'Erwachsenen Neugier absprechen'],
    ],
  },
  {
    id: 'lernen', emoji: '🧠', topic: 'Wissen',
    title: 'Warum Vergessen zum Lernen gehört',
    teaser: 'Ein vertrautes Wort ist noch lange kein abrufbares Wort.',
    text: `
Du liest ein japanisches Wort und denkst: Das kenne ich! Dann deckst du die Übersetzung ab – und plötzlich fehlt die Antwort. Wiedererkennen und selbstständiges Erinnern sind verschiedene Aufgaben. Dass eine Seite vertraut aussieht, beweist noch nicht, dass du ihren Inhalt ohne Hilfe behalten kannst. Genau das meint {覚える}: sich etwas merken.

Genau deshalb kann ein kleiner {テスト} mehr sein als eine Kontrolle. Wenn du versuchst, eine Antwort aus dem Gedächtnis zu holen, übst du den Abruf selbst. Danach kannst du nachsehen und Fehler korrigieren. Eine falsche Antwort ist dabei Information: Sie zeigt, welche Verbindung noch {難しい} ist.

Eine zweite Idee ist das verteilte Üben. Statt alle Wiederholungen in einen Abend zu pressen, begegnest du dem Stoff an mehreren Tagen. Forschung zu **Abrufübungen und zeitlich verteiltem Lernen** zeigt, dass beide Verfahren das langfristige Behalten unterstützen können. Es gibt dabei keinen magischen Abstand, der für jedes Wort und jeden Menschen passt.

Für deine nächste {練習} reicht ein einfacher Ablauf: einen kurzen Abschnitt lesen, ihn schließen, eine Frage beantworten – {答える} – und anschließend vergleichen. Was du schon sicher kannst, braucht weniger Aufmerksamkeit. Was du nicht mehr weißt, kommt später zurück. {忘れる} gehört zum Prozess. So wird aus einem großen {問題} eine Reihe kleiner Aufgaben. Und irgendwann verstehst du eine ganze {話} auf Japanisch, die am Anfang unmöglich schien: {分かる}, verstehen, wird zum Erlebnis.

! **Verb in Grundform + 前に** = bevor man …: 読む前に = vor dem Lesen. **Nomen + の前に**: テストの前に = vor dem Test.

> {テスト}の前《まえ》に{練習}します。 | Vor dem Test übe ich.
> {本}を{読む}前《まえ》に、{写真}を{見る|見ます|みます}。 | Bevor ich das Buch lese, schaue ich die Fotos an.
> {この}{問題}は{難しい}です。 | Diese Aufgabe ist schwierig.
> {あの}{問題}は{易しい}です。 | Jene Aufgabe ist einfach.
> {日本語}の{話}が{分かる|分かります|わかります}。 | Ich verstehe die Geschichte auf Japanisch.
> {先生}の{問題}に{答える|答えます|こたえます}。 | Ich antworte auf die Frage des Lehrers.`,
    quiz: [
      ['Was übt man beim Antworten ohne Vorlage?', 'Den Abruf aus dem Gedächtnis', 'Nur die Handschrift', 'Nur das Wiedererkennen', 'Das schnellere Umblättern'],
      ['Was bedeutet verteiltes Lernen?', 'An mehreren Tagen wiederholen', 'Alles an einem Abend lernen', 'Mehrere Bücher gleichzeitig kaufen', 'Antworten immer offen liegen lassen'],
      ['Warum sind Fehler beim Üben nützlich?', 'Sie zeigen, was noch Übung braucht', 'Sie beweisen fehlende Begabung', 'Sie machen Rückmeldung überflüssig', 'Sie ersetzen jede Wiederholung'],
    ],
  },
  {
    id: 'blaues-licht', emoji: '💡', topic: 'Technik',
    title: 'Das blaue Licht, das Weiß möglich machte',
    teaser: 'Ein kleiner Halbleiter veränderte die Beleuchtung.',
    text: `
Du kommst abends nach Hause und willst das Licht {つける}. Ein Druck auf den Schalter genügt. Hinter dieser alltäglichen Bewegung steckt eine lange Geschichte: Feuer, Glühlampen, Leuchtstoffröhren und schließlich Leuchtdioden. Bei einer LED entsteht Licht in einem Halbleiter, wenn elektrischer Strom hindurchfließt.

Rote und grüne Leuchtdioden gab es schon, als eine leistungsfähige blaue LED noch ein schwieriges Forschungsproblem war. Doch gerade Blau wurde entscheidend für neue weiße Lichtquellen. Eine Möglichkeit besteht darin, blaues Licht mit einem Leuchtstoff teilweise in andere Farben umzuwandeln. Zusammen erscheint das Licht weiß.

2014 erhielten Isamu Akasaki, Hiroshi Amano und Shuji Nakamura dafür den Physik-Nobelpreis: für die Entwicklung effizienter blauer Leuchtdioden. Die Auszeichnung galt einer Erfindung, die helle und energiesparende weiße Lichtquellen ermöglichte. Ein winziges Bauteil hatte eine große Wirkung.

Im Alltag bleibt die Technik meistens unsichtbar. Wir {押す} einen Knopf, {使う} eine Lampe und {消す} sie wieder. Erst wenn das Licht plötzlich {消える}, merken wir, wie selbstverständlich es geworden ist. Dann können wir im Dunkeln kaum die richtige Tür finden: Soll man {押す} oder {引く}? Gute Technik hilft oft gerade dadurch, dass wir nicht ständig über sie nachdenken müssen.

! **て-Form + ください** = Bitte …: つけてください = Bitte einschalten. Bei Verben verändert sich die Form: 消す → 消して, 押す → 押して, 引く → 引いて.

> {電気}を{つける|つけて|つけて}ください。 | Schalte bitte das Licht an.
> {電気}を{消す|消して|けして}ください。 | Schalte bitte das Licht aus.
> ここを{押す|押して|おして}ください。 | Drücke bitte hier.
> ドアを{引く|引いて|ひいて}ください。 | Ziehe bitte an der Tür.
> {この}{電話}を{使う|使って|つかって}ください。 | Benutze bitte dieses Telefon.
> {電気}が{消える|消えました|きえました}。 | Das Licht ist ausgegangen.`,
    quiz: [
      ['Welche LED-Farbe war entscheidend für neue weiße Lichtquellen?', 'Blau', 'Braun', 'Schwarz', 'Grau'],
      ['Wofür wurden Akasaki, Amano und Nakamura 2014 ausgezeichnet?', 'Für effiziente blaue Leuchtdioden', 'Für den ersten Lichtschalter', 'Für die Glühlampe', 'Für die erste Batterie'],
      ['Wo entsteht bei einer LED das Licht?', 'In einem Halbleiter', 'In einer Kerzenflamme', 'In kochendem Wasser', 'In einem mechanischen Uhrwerk'],
    ],
  },
  {
    id: 'everest', emoji: '🏔️', topic: 'Geographie',
    title: 'Oben ist erst die halbe Strecke',
    teaser: 'Ein Gipfelfoto zeigt zwei Menschen. Dahinter steht eine Expedition.',
    text: `
Am 29. Mai 1953 erreichten Edmund Hillary und Tenzing Norgay den Gipfel des Mount Everest. Es war die erste bestätigte Besteigung des höchsten Berges der Erde. Hillary kam aus Neuseeland, Norgay war ein erfahrener Sherpa-Bergsteiger. Ihre Namen wurden weltbekannt – doch allein hätten sie diesen Erfolg nicht erreichen können.

Wer einen hohen {山} {登る} will, braucht mehr als Mut. Zur Expedition gehören Menschen, die Lasten tragen, Lager vorbereiten, Wege erkunden und gemeinsam Entscheidungen treffen. Im Foto auf dem Gipfel sieht man nur einen Augenblick. Die Arbeit davor ist viel größer als dieser einzelne Moment.

In großer Höhe enthält jeder Atemzug weniger Sauerstoff als auf Meereshöhe, weil der Luftdruck sinkt. Selbst einfache Bewegungen werden anstrengender. Einen Rucksack {持つ}, kurz {立つ}, wieder {座る}: Was zu Hause nebenbei geschieht, kostet hier Kraft. Hillary und Norgay benutzten bei ihrer Besteigung zusätzlichen Sauerstoff.

Und nach dem Gipfel wartet noch der Rückweg. Wer oben steht, muss auch wieder sicher ins Lager {帰る}. Erfolg bedeutet deshalb nicht nur, einen hohen Punkt zu erreichen. Er bedeutet, die eigene Kraft einzuteilen und zusammen zurückzukommen. Das gilt im Kleinen auch bei einer Wanderung: Eine Pause ist kein Scheitern, und eine Umkehr kann eine gute Entscheidung sein.

! **て-Form + もいいですか** = Darf ich …? 座ってもいいですか = Darf ich mich setzen? Die Antwort kann はい、いいですよ sein.

> ここに{座る|座って|すわって}もいいですか。 | Darf ich mich hier hinsetzen?
> {はい}、{いい}ですよ。 | Ja, gern.
> {明日}、{山}に{登る|登ります|のぼります}。 | Morgen besteige ich einen Berg.
> {重い}{荷物}を{持つ|持っています|もっています}。 | Ich trage schweres Gepäck.
> {少し}{休む|休んで|やすんで}もいいですか。 | Darf ich mich kurz ausruhen?
> {一緒に}{帰る|帰りましょう|かえりましょう}。 | Lass uns zusammen zurückgehen.`,
    quiz: [
      ['Wer erreichte 1953 gemeinsam den Everest-Gipfel?', 'Edmund Hillary und Tenzing Norgay', 'Philipp Reis und Alexander Bell', 'Ibn Battuta und Marco Polo', 'Akasaki und Amano'],
      ['Warum enthält ein Atemzug in großer Höhe weniger Sauerstoff?', 'Der Luftdruck ist geringer', 'Der Sauerstoffanteil ist dort null', 'Schnee verbraucht die gesamte Luft', 'Die Sonne zieht Sauerstoff an'],
      ['Was gehört laut Geschichte zum Erfolg am Berg?', 'Auch sicher zurückzukommen', 'Nur ein Gipfelfoto zu machen', 'Jede Pause zu vermeiden', 'Immer allein zu gehen'],
    ],
  },
  {
    id: 'hachiko', emoji: '🐕', topic: 'Gesellschaft',
    title: 'Hachikō wartet am Bahnhof',
    teaser: 'Eine Verabredung, zu der ein Mensch nicht mehr kommen konnte.',
    text: `
Vor dem Bahnhof Shibuya in Tokio steht ein Hund aus Bronze. Für viele ist seine Statue ein Treffpunkt: Man möchte {友達} {会う} und verabredet sich bei Hachikō. Hinter dem praktischen Ort steckt eine traurige {話} über einen echten Hund und seinen Menschen.

Der Professor Hidesaburō Ueno arbeitete an der Universität Tokio. Hachikō, ein Akita-Hund, lebte bei ihm und wurde dafür bekannt, am Bahnhof auf ihn zu warten. 1925 starb Ueno plötzlich an der Universität. Er konnte nicht mehr nach Hause {帰る}. Der Hund kam trotzdem über Jahre immer wieder zum Bahnhof.

Hachikō starb 1935. Seine Geschichte wurde in Japan berühmt und später auch in Filmen erzählt. An der Universität Tokio erinnert eine weitere Statue an Hund und Professor: Dort werden die beiden bei einem Wiedersehen gezeigt. Was im Leben nicht mehr möglich war, wurde in Bronze zu einem gemeinsamen Moment.

Warum bewegt uns diese Geschichte? Vielleicht, weil ein Bahnhof sonst ein Ort des Wechsels ist. Menschen {来る} und {行く}, steigen um und verschwinden in der Menge. Der wartende Hund steht dagegen für Beständigkeit. Wenn du heute dort auf jemanden wartest, machst du etwas ganz Alltägliches – und stehst zugleich neben einem Stück Stadtgeschichte.

! **います** für Menschen und Tiere, **あります** für Dinge: 犬がいます = Da ist ein Hund. 犬の像があります = Da ist eine Hundestatue. Die dargestellte Figur macht eine Statue nicht lebendig.

> {駅}に{友達}が{いる|います|います}。 | Am Bahnhof ist ein Freund.
> {駅}の前《まえ》に像《ぞう》が{ある|あります|あります}。 | Vor dem Bahnhof steht eine Statue.
> {明日}、{友達}に{会う|会います|あいます}。 | Morgen treffe ich einen Freund.
> {先生}は東京《とうきょう》に{住む|住んでいます|すんでいます}。 | Der Lehrer wohnt in Tokio.
> {友達}が{来る|来ました|きました}。 | Mein Freund ist gekommen.
> {一緒に}{家}に{帰る|帰ります|かえります}。 | Wir gehen zusammen nach Hause.`,
    quiz: [
      ['Wo steht die bekannte Hachikō-Statue als Treffpunkt?', 'Am Bahnhof Shibuya', 'Auf dem Fuji', 'Im Hafen von Osaka', 'Am Flughafen von Kyoto'],
      ['Was war Hidesaburō Ueno von Beruf?', 'Professor', 'Schiffskapitän', 'Bergführer', 'Kinodarsteller'],
      ['Was zeigt die weitere Statue an der Universität Tokio?', 'Ein Wiedersehen von Hund und Professor', 'Ein Rettungsboot', 'Eine Kompassnadel', 'Einen Hund auf dem Everest'],
    ],
  },
  {
    id: 'semmelweis', emoji: '🧼', topic: 'Wissenschaft',
    title: 'Die Frage, die Semmelweis nicht losließ',
    teaser: 'Zwei Stationen, unterschiedliche Zahlen und ein folgenreicher Verdacht.',
    text: `
In einem Wiener {病院} fiel dem {医者} Ignaz Semmelweis im 19. Jahrhundert ein erschreckender Unterschied auf. In einer Geburtsstation starben deutlich mehr Frauen an Kindbettfieber als in der anderen. Die Stationen gehörten zum selben Krankenhaus. Warum waren die Ergebnisse so verschieden?

Semmelweis verglich die Abläufe. Ärzte und Studenten kamen auch von Untersuchungen an Verstorbenen zu den Gebärenden. Er vermutete, dass sie etwas Schädliches an ihren Händen übertrugen. Die heutige Erklärung durch Mikroorganismen war damals noch nicht allgemein etabliert. Er hatte also zunächst eine Beobachtung und einen Verdacht, keine vollständige moderne Theorie.

1847 führte er die Reinigung der Hände mit einer Chlorkalklösung ein. Danach sank die Sterblichkeit in der betroffenen Station stark. Das war ein wichtiger Hinweis für seine Erklärung. Dennoch setzte sich die Maßnahme nicht sofort überall durch. Beobachtungen müssen nicht nur gemacht, sondern auch verständlich vermittelt und ernst genommen werden.

Die Geschichte ist ein Beispiel dafür, wie Wissenschaft beginnt: nicht mit „Ich weiß alles“, sondern mit „Hier passt etwas nicht zusammen“. Semmelweis nahm einen Unterschied ernst, den andere hinnahmen. Dass heute eine einfache Handlung selbstverständlich wirkt, bedeutet nicht, dass der Weg zu dieser Erkenntnis einfach war. Wissen wächst, wenn Menschen Fragen stellen, Abläufe vergleichen und bereit sind, vertraute Gewohnheiten zu ändern.

! **て-Form + から** = nachdem man …: 手を洗ってから = nachdem man sich die Hände gewaschen hat. Anders als **から** nach einem vollständigen Satz beschreibt es hier die Reihenfolge.

> {手}を{洗う|洗って|あらって}から、{食べる|食べます|たべます}。 | Nachdem ich mir die Hände gewaschen habe, esse ich.
> {医者}は{病院}で{働く|働いています|はたらいています}。 | Der Arzt arbeitet im Krankenhaus.
> {この}{問題}は{大切}です。 | Diese Frage ist wichtig.
> {先生}に{聞く|聞いて|きいて}から、{答える|答えます|こたえます}。 | Nachdem ich den Lehrer gefragt habe, antworte ich.
> {本}を{読む|読んで|よんで}から、{考える|考えます|かんがえます}。 | Nachdem ich das Buch gelesen habe, denke ich nach.
> {分かる|分かりました|わかりました}。{ありがとう}ございます。 | Ich habe verstanden. Vielen Dank.`,
    quiz: [
      ['Was untersuchte Semmelweis zunächst?', 'Unterschiedliche Sterblichkeit in zwei Geburtsstationen', 'Die Höhe des Everest', 'Die Farbe von Leuchtdioden', 'Die Richtung einer Kompassnadel'],
      ['Welche Maßnahme führte er 1847 ein?', 'Händereinigung mit Chlorkalklösung', 'Elektrische Beleuchtung aller Zimmer', 'Eine neue Zeitzone', 'Das Schließen aller Krankenhäuser'],
      ['Was geschah danach in der betroffenen Station?', 'Die Sterblichkeit sank stark', 'Die Sterblichkeit blieb unverändert', 'Alle Untersuchungen wurden abgeschafft', 'Das Krankenhaus wurde ein Bahnhof'],
    ],
  },
];

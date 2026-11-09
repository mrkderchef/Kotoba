// Geschichten 21–28: Essen, Trinken, Verkehr, Stadt, Schule, Schrift.
// Neue Muster: で (Werkzeug/Ort), 〜にします, 〜ましょう, 〜ませんか, が (aber), て-Form + ください, まで, Ortsangaben (の前/の隣 …), という意味.
export const STORIES = [
  {
    id: 'sushi', emoji: '🍣', topic: 'Geschichte',
    title: 'Sushi war einmal Fast Food',
    teaser: 'Vom stinkenden Gärfisch zum Förderband – eine Karriere über tausend Jahre.',
    text: `
Sushi gilt heute als Luxusessen. Dabei begann es als Konservierungstrick. In Südostasien und China legte man schon vor über tausend Jahren rohen Fisch in gekochten Reis, also {ご飯}, und ließ ihn monatelang gären. Die Milchsäure machte den Fisch haltbar. Den Reis warf man danach weg – gegessen wurde nur der Fisch. Am Biwa-See gibt es diese uralte Form bis heute: Funazushi, mit einem Geruch, der an kräftigen Käse erinnert.

Im Lauf der Jahrhunderte wurde die Gärzeit kürzer, und irgendwann aß man den Reis mit. Im 17. Jahrhundert kam der entscheidende Trick: Essig. Statt monatelang zu warten, würzte man die {ご飯} einfach mit Essig, {砂糖} und {塩}. Das schmeckte säuerlich wie früher, war aber sofort fertig.

Im frühen 19. Jahrhundert verkauften Straßenstände in Edo, dem heutigen Tokio, die ersten Nigiri: ein Bällchen Reis, darauf ein Stück Fisch, schnell aus der Hand zu essen – {食べ物} für Arbeiter ohne Zeit. Als einer der Erfinder gilt ein Koch namens Hanaya Yohei. Kühlschränke gab es nicht, also legte man den Fisch in {しょうゆ} ein oder garte ihn kurz. Fettiger Thunfisch, heute das teuerste Stück, galt damals als minderwertig.

1958 eröffnete in Osaka das erste Sushi-Restaurant mit Förderband. Der Besitzer Yoshiaki Shiraishi soll die Idee in einer Brauerei bekommen haben, wo Bierflaschen auf Bändern fuhren. Heute fahren die {皿} in ganz Japan im Kreis, und die Farbe der {皿} verrät den Preis. Längst gibt es nicht nur Fisch: Sushi mit {肉}, mit {野菜} oder mit süßem {卵}. Am Omelett aus {卵}, sagen Kenner, erkennt man übrigens, wie gut ein Sushi-Koch wirklich ist.

Gegessen wird mit {箸} – oder ganz traditionell mit den Fingern. Ein Tabu: {箸} nie senkrecht in die Reisschale stecken, so stellt man sie bei Beerdigungen für die Toten auf. In Europa setzte sich übrigens auch die {フォーク} erst spät durch; noch im 17. Jahrhundert aßen viele mit {ナイフ}, {スプーン} und Fingern. Die traditionelle japanische Küche, Washoku, ist seit 2013 immaterielles UNESCO-Kulturerbe. Ein gutes {料理} braucht nicht viel: guten Reis, frischen Fisch und ein paar {グラム} Wasabi. Und dann sagt man: {おいしい}!

! **で** zeigt das Werkzeug: 箸で食べます = Ich esse mit Stäbchen.

> {日本}の{人}は{箸}で{食べる|食べます|たべます}。 | Japaner essen mit Stäbchen.
> {ナイフ}と{フォーク}と{スプーン}もあります。 | Es gibt auch Messer, Gabel und Löffel.
> {魚}は{しょうゆ}で{食べる|食べます|たべます}。 | Fisch isst man mit Sojasoße.
> {砂糖}を{十}{グラム}と{塩}を{少し}{入れる|入れます|いれます}。 | Man gibt 10 Gramm Zucker und etwas Salz dazu.
> {肉}も{野菜}も{おいしい}です。 | Fleisch und Gemüse sind beide lecker.
> {卵}の{料理}が{好き}です。 | Ich mag Eiergerichte.
> {この}{食べ物}は{何|何|なん}ですか。 | Was ist das für ein Essen?`,
    quiz: [
      ['Wozu legte man Fisch ursprünglich in Reis?', 'Um ihn durch Gärung haltbar zu machen', 'Damit er süßer wird', 'Als Opfergabe', 'Um ihn warm zu halten'],
      ['Was beschleunigte im 17. Jahrhundert die Sushi-Herstellung?', 'Essig', 'Eis', 'Salzwasser', 'Feuer'],
      ['Woher hatte Yoshiaki Shiraishi angeblich die Idee zum Sushi-Förderband?', 'Aus einer Brauerei', 'Aus einem Bergwerk', 'Aus einer Autofabrik', 'Aus einem Flughafen'],
    ],
  },
  {
    id: 'bier', emoji: '🍺', topic: 'Geschichte',
    title: 'Bier, Milch und heiße Dosen',
    teaser: 'Warum Pyramidenbauer mit Bier bezahlt wurden und Japans Automaten zwei Farben haben.',
    text: `
Was war zuerst da: Brot oder {ビール}? Manche Archäologen vermuten, dass Menschen Getreide anfangs vielleicht gar nicht zum Backen anbauten, sondern zum Brauen. Bewiesen ist das nicht, aber {ビール} ist uralt: Rückstände in Krügen aus dem heutigen Iran sind über 5.000 Jahre alt. Ein sumerisches Loblied auf die Göttin Ninkasi, rund 3.800 Jahre alt, gilt als eines der ältesten überlieferten Braurezepte.

Im alten Ägypten war {ビール} ein Grundnahrungsmittel. Die Arbeiter an den Pyramiden von Gizeh erhielten Bier als Teil ihres Lohns. Es war dickflüssig, nahrhaft und oft sicherer als ungekochtes Wasser. In Bayern legte 1516 das Reinheitsgebot fest, was hineindarf: Gerste, Hopfen und Wasser – die Hefe kannte man noch gar nicht.

Ein anderes {飲み物} ist erstaunlich „neu“: {牛乳} für Erwachsene. Ursprünglich konnten Menschen nach dem Kleinkindalter Milchzucker kaum verdauen. Erst als Hirtenvölker Rinder hielten, breitete sich eine Genvariante aus, die das ermöglicht. Noch heute vertragen weltweit viele Erwachsene {牛乳} schlecht, besonders in Ostasien. In Japan wurde Milch erst ab dem 19. Jahrhundert populär – und nach dem Zweiten Weltkrieg mit den Schulmahlzeiten zum Alltag.

Japans Lieblingsgetränke sind grüner Tee und, vielleicht überraschend, {コーヒー}. Schwarzer Tee heißt {紅茶}, wörtlich „roter Tee“, nach der Farbe in der {カップ}. 1969 brachte eine japanische Firma {コーヒー} in der Dose auf den Markt, mit Milch und ziemlich {甘い}. Heute stehen Getränkeautomaten an fast jeder Straßenecke, selbst auf Bergpfaden und in winzigen Dörfern.

Das Besondere: Viele Automaten verkaufen im Winter {熱い} und {冷たい} Dosen nebeneinander. Rote Schilder bedeuten heiß, blaue kalt. Man kauft eine {熱い} Dose und wärmt sich daran die Hände. Und {お酒}? Japanischer Reiswein wird je nach Sorte warm oder gekühlt getrunken. In einer Kneipe bestellt man oft als Erstes: „Erst mal ein Bier!“ – und das kommt eiskalt in einer {コップ}. Wer keinen Alkohol trinkt, nimmt Oolong-Tee oder eine {ジュース}.

! Beim Bestellen: **〜にします** = Ich nehme … コーヒーにします = Ich nehme einen Kaffee.

> {何}を{飲む|飲みますか|のみますか}。 | Was trinkst du?
> {冷たい}{ビール}にします。 | Ich nehme ein kaltes Bier.
> {私}は{熱い}{コーヒー}にします。 | Ich nehme einen heißen Kaffee.
> {お酒}は{飲む|飲みません|のみません}。{ジュース}をください。 | Ich trinke keinen Alkohol. Einen Saft, bitte.
> {紅茶}は{甘い}ですか。 | Ist der schwarze Tee süß?
> {牛乳}を{コップ}に{入れる|入れます|いれます}。 | Ich gieße Milch ins Glas.
> {この}{カップ}は{熱い}です。 | Diese Tasse ist heiß.
> {好き}な{飲み物}は{何|何|なん}ですか。 | Was ist dein Lieblingsgetränk?`,
    quiz: [
      ['Was erhielten Arbeiter an den Pyramiden als Teil ihres Lohns?', 'Bier', 'Wein', 'Milch', 'Kaffee'],
      ['Was legte das bayerische Reinheitsgebot 1516 fest?', 'Welche Zutaten ins Bier dürfen', 'Wann Bier getrunken werden darf', 'Dass Bier nur aus Weizen sein darf', 'Wie viel Bier ein Mensch trinken darf'],
      ['Woran erkennt man an japanischen Automaten heiße Getränke?', 'An roten Schildern', 'An blauen Schildern', 'An einer Glocke', 'Gar nicht'],
    ],
  },
  {
    id: 'itadakimasu', emoji: '🍱', topic: 'Japan',
    title: 'Itadakimasu – Danke an alle, die für dich gerannt sind',
    teaser: 'Ein jahrhundertelanges Fleischverbot, Kunstwerke aus Reis und Kit Kat als Glücksbringer.',
    text: `
Bevor in Japan jemand isst, legt er die Hände zusammen und sagt: {いただきます}. Wörtlich heißt das etwa „Ich empfange demütig“. Gemeint ist ein Dank – an die Köchin, an die Bauern und nach buddhistischem Verständnis auch an die Pflanzen und Tiere, die ihr Leben gegeben haben. Nach dem Essen sagt man {ごちそうさまでした}. Darin steckt das Wort „chisō“, das ursprünglich „herumrennen“ bedeutete: Jemand ist für dich herumgelaufen, um ein Festmahl zu besorgen.

Lange aßen Japaner kaum Fleisch. 675 verbot Kaiser Tenmu, zu bestimmten Zeiten Rind, Pferd, Hund, Affe und Huhn zu essen, und unter buddhistischem Einfluss blieb Fleisch über Jahrhunderte verpönt – Fisch ausgenommen. Erst nach der Öffnung zum Westen änderte sich das: 1872 wurde öffentlich bekannt gemacht, dass der Meiji-Kaiser Rindfleisch aß. Westliches Essen galt plötzlich als modern, und für alles Westliche kam ein spöttischer Ausdruck auf: „riecht nach {バター}“.

Ein Klassiker der japanischen Küche ist das {弁当}, eine Box mit Reis und kleinen Beilagen. Eltern bereiten es morgens für ihre Kinder zu, manche gestalten es als Kunstwerk mit Figuren aus Reis und Seetang. An Bahnhöfen gibt es Ekiben, Bahnhofs-{弁当} mit regionalen Spezialitäten. Ein {昼ご飯} im Zug, während draußen die Landschaft vorbeizieht, ist für viele Japaner ein Stück Urlaub.

Ein traditionelles {朝ご飯} besteht aus Reis, Misosuppe, gegrilltem Fisch und eingelegtem Gemüse. Reis isst man aus einem {茶碗}, den man in der Hand hält – das ist nicht unhöflich, sondern richtig. Zum {晩ご飯} trifft man sich in einem einfachen {食堂}, einer edlen {レストラン} oder zu Hause. Und am Nachmittag? Da geht man ins {喫茶店}. Das erste Café dieser Art öffnete 1888 in Tokio; heute wirken die alten Kissaten mit Holzmöbeln und handgebrühtem Kaffee fast wie Museen.

Beim Essen ist man übrigens selten brutal ehrlich. Wer etwas {まずい} findet, sagt es kaum laut. Und {辛い} Essen? Lange galt Japans Küche als mild, heute lieben viele scharfes Curry. Bei {お菓子} ist man dagegen erfinderisch: Kit Kat gibt es in Japan in Hunderten Sorten, von grünem Tee bis Sake – auch weil der Name an „kitto katsu“ erinnert, „Du wirst bestimmt gewinnen“. Schüler bekommen es vor Prüfungen geschenkt.

! **〜ましょう** = Lass(t) uns …: 食べましょう! Und **〜ませんか** = Wollen wir nicht …?

> {いただきます}！ | Guten Appetit!
> {昼ご飯}を{食べる|食べましょう|たべましょう}。 | Lass uns zu Mittag essen.
> {今日}の{弁当}は{おいしい}です。 | Das Bentō heute ist lecker.
> {この}カレーは{辛い}ですね。でも、{まずい|まずくない|まずくない}です。 | Dieses Curry ist scharf, oder? Aber es schmeckt nicht schlecht.
> {明日}、{喫茶店}に{行く|行きませんか|いきませんか}。 | Wollen wir morgen ins Café gehen?
> {晩ご飯}は{レストラン}で{食べる|食べます|たべます}。 | Zu Abend esse ich im Restaurant.
> {朝ご飯}に{パン}と{バター}を{食べる|食べました|たべました}。 | Zum Frühstück habe ich Brot mit Butter gegessen.
> {ご飯}を{茶碗}に{入れる|入れます|いれます}。 | Ich fülle Reis in die Schale.
> {学校}の{食堂}は{安い}です。 | Die Schulkantine ist billig.
> {ごちそうさまでした}。 | Danke für das Essen!`,
    quiz: [
      ['Was bedeutete „chisō“ in ごちそうさま ursprünglich?', 'Herumrennen', 'Sattsein', 'Tempel', 'Reis'],
      ['Wann wurde bekannt, dass der Meiji-Kaiser Rindfleisch aß?', '1872', '675', '1603', '1945'],
      ['Warum ist Kit Kat in Japan ein Glücksbringer?', 'Der Name klingt wie „Du wirst bestimmt gewinnen“', 'Es wurde in Japan erfunden', 'Es ist rot wie die Flagge', 'Ein Kaiser aß es täglich'],
    ],
  },
  {
    id: 'shinkansen', emoji: '🚄', topic: 'Technik',
    title: 'Der Shinkansen – pünktlich auf die Sekunde',
    teaser: 'Sieben Minuten Putzen, 20 Sekunden zu früh und eine Bahn, die schwebt.',
    text: `
Am 1. Oktober 1964, neun Tage vor den Olympischen Spielen in Tokio, fuhr der erste Shinkansen los. Der „Hochgeschwindigkeitszug“ verband Tokio und Osaka mit 210 Kilometern pro Stunde – damals der schnellste {電車} der Welt. Die Fahrt dauerte plötzlich nur noch vier Stunden statt fast sieben. Heute schafft es der schnellste Zug in rund zweieinhalb Stunden.

Berühmt ist der Shinkansen für seine Pünktlichkeit: Die durchschnittliche Verspätung pro Zug liegt bei unter einer Minute – Taifune und Erdbeben eingerechnet. 2017 entschuldigte sich eine Bahngesellschaft bei Tokio öffentlich, weil ein Zug 20 Sekunden zu früh abgefahren war. Ein {遅い} Zug ist in Japan eine Nachricht wert; Pendler bekommen bei größeren Verspätungen sogar eine Bescheinigung für ihren Chef.

An der Endstation hat das Reinigungsteam oft nur etwa sieben Minuten. Sobald die Fahrgäste {降りる}, stürmen die Teams hinein, drehen alle Sitze in Fahrtrichtung, sammeln Müll und wischen die Tische. Dann verbeugen sie sich vor den Wartenden, und die nächsten Fahrgäste dürfen {乗る}. Seit 1964 ist im Shinkansen kein einziger Fahrgast durch Entgleisung oder Zusammenstoß ums Leben gekommen.

Im Großraum Tokio fahren die meisten Menschen nicht mit dem {車}, sondern mit {電車} und {地下鉄}. Der {駅} Shinjuku gilt als der verkehrsreichste der Welt: Täglich gehen dort Millionen Menschen durch. Kaum jemand kauft noch einen {切符} am Schalter – man hält eine aufladbare Karte an das Drehkreuz. Zur Hauptverkehrszeit schieben Bahnmitarbeiter mit weißen Handschuhen manchmal nach, damit alle in den Zug passen.

Für kurze Wege gibt es {バス} und {タクシー}; deren Türen öffnen sich übrigens automatisch, der Fahrer bedient sie per Hebel. Auf langen Strecken konkurriert der Shinkansen mit dem {飛行機}: Zwischen Tokio und Osaka nehmen die meisten den Zug, weil er mitten in der Stadt hält. Und die Zukunft schwebt: Eine Magnetschwebebahn erreichte bei Testfahrten 603 Kilometer pro Stunde. Sie soll Tokio und Nagoya in rund 40 Minuten verbinden – {速い} als jedes {自動車} und fast so {速い} wie ein {飛行機}. Dann ist {時間} wirklich Geld.

! **で** zeigt das Verkehrsmittel: 電車で行きます = Ich fahre mit dem Zug. **〜に乗ります** = einsteigen, **〜を降ります** = aussteigen. Und **が** zwischen zwei Sätzen heißt „aber“.

> {駅}で{切符}を{買う|買います|かいます}。 | Am Bahnhof kaufe ich eine Fahrkarte.
> {電車}に{乗る|乗ります|のります}。東京《とうきょう》で{電車}を{降りる|降ります|おります}。 | Ich steige in den Zug. In Tokio steige ich aus.
> {地下鉄}で{行く|行きます|いきます}。{バス}は{遅い}です。 | Ich fahre mit der U-Bahn. Der Bus ist langsam.
> {タクシー}は{速い}ですが、{高い}です。 | Taxis sind schnell, aber teuer.
> {飛行機}と{電車}と、{どちら}が{速い}ですか。 | Was ist schneller, Flugzeug oder Zug?
> {時間}がありません。{車}で{行く|行きましょう|いきましょう}。 | Ich habe keine Zeit. Lass uns mit dem Auto fahren.
> {日本}の{自動車}は{有名}です。 | Japanische Autos sind berühmt.`,
    quiz: [
      ['Wann fuhr der erste Shinkansen?', '1964', '1945', '1989', '1912'],
      ['Wofür entschuldigte sich 2017 eine Bahngesellschaft bei Tokio?', 'Ein Zug fuhr 20 Sekunden zu früh ab', 'Ein Zug kam eine Stunde zu spät', 'Ein Zug hatte keine Toilette', 'Der Fahrer sang'],
      ['Wie schnell fuhr Japans Magnetschwebebahn bei Testfahrten?', '603 km/h', '210 km/h', '320 km/h', '1.000 km/h'],
    ],
  },
  {
    id: 'fahrrad', emoji: '🚲', topic: 'Technik',
    title: 'Wie das Fahrrad die Frauen befreite',
    teaser: 'Ein Vulkan, ein Mannheimer Tüftler und warum man in Japan links fährt.',
    text: `
1816 war ein Jahr ohne Sommer. Im Jahr zuvor war in Indonesien der Vulkan Tambora ausgebrochen, und seine Asche verdunkelte weltweit den Himmel. In Europa gab es Missernten, Pferde verhungerten. 1817 stellte der Mannheimer Karl Drais eine Laufmaschine vor: zwei Räder, ein Sitz, keine Pedale. Man saß darauf und stieß sich mit den Füßen ab – halb {歩く}, halb {走る}. Ob der Pferdemangel ihn wirklich inspirierte, ist umstritten, aber die Geschichte wird gern erzählt.

Es folgten Hochräder mit riesigem Vorderrad – schnell, aber gefährlich: Wer plötzlich {止まる} musste, flog oft kopfüber. Erst um 1885 kam das „Sicherheitsrad“ mit zwei gleich großen Rädern und Kette, 1888 der luftgefüllte Reifen. Jetzt war das {自転車} bequem, bezahlbar – und revolutionär.

Besonders für Frauen. Mit dem {自転車} konnten sie sich zum ersten Mal ohne Begleitung frei durch die Stadt bewegen. Weite Röcke störten, also trugen manche Pumphosen, was Skandale auslöste. Die amerikanische Frauenrechtlerin Susan B. Anthony sagte 1896, das Fahrrad habe mehr für die Befreiung der Frauen getan als irgendetwas anderes auf der Welt.

In Japan sind Fahrräder allgegenwärtig. Typisch ist das Mamachari, das „Mama-Rad“ mit Korb und Kindersitz. Viele fahren auf dem Gehweg, mitten zwischen Menschen, die zu Fuß {歩く}. Wie Autos fahren auch Räder in Japan links. Eine verbreitete Legende erklärt das mit den Samurai: Sie trugen das Schwert links und gingen links, damit die Schwerter nicht aneinanderstießen. Wahrscheinlicher ist britischer Einfluss beim Bau der ersten Eisenbahnen.

Wer in Japan nach dem Weg fragt, hört selten Straßennamen – die meisten Straßen haben keine. Stattdessen heißt es: an der nächsten {角} nach {右} {曲がる}, dann {まっすぐ} bis zur {橋}, über die {橋} {渡る} und danach {左}. An roten Ampeln wird übrigens gewartet, auch nachts um drei ohne ein einziges Auto. Wer da einfach über die Straße will und bei Rot {渡る}, erntet strenge Blicke.

! Die **て-Form** verbindet Handlungen wie „und dann“ und bildet Bitten: 行ってください = Geh bitte. **まで** heißt „bis“.

> {まっすぐ}{行く|行って|いって}ください。 | Geh bitte geradeaus.
> {角}を{右}に{曲がる|曲がって|まがって}ください。 | Bieg bitte an der Ecke rechts ab.
> {橋}を{渡る|渡って|わたって}、{左}に{曲がる|曲がります|まがります}。 | Überquere die Brücke und bieg dann links ab.
> {自転車}で{走る|走ります|はしります}。{車}は{止まる|止まります|とまります}。 | Ich fahre Rad. Das Auto hält an.
> {駅}まで{歩く|歩きます|あるきます}。 | Ich gehe zu Fuß bis zum Bahnhof.
> {止まる|止まって|とまって}ください！ | Bitte anhalten!`,
    quiz: [
      ['Was fehlte der Laufmaschine von Karl Drais?', 'Pedale', 'Räder', 'Ein Sitz', 'Eine Lenkung'],
      ['Was sagte Susan B. Anthony 1896 über das Fahrrad?', 'Es habe mehr für die Befreiung der Frauen getan als irgendetwas sonst', 'Es sei zu gefährlich für Frauen', 'Es werde nie populär', 'Es sei nur etwas für Kinder'],
      ['Was ist ein Mamachari?', 'Ein Alltagsrad mit Korb und Kindersitz', 'Ein Rennrad', 'Ein Fahrradtaxi', 'Ein Fahrrad für Mönche'],
    ],
  },
  {
    id: 'tokio', emoji: '🏙️', topic: 'Geographie',
    title: 'Tokio – die Stadt ohne Straßennamen',
    teaser: '37 Millionen Menschen, Häuser nach Baujahr nummeriert und eine Kreuzung voller Menschen.',
    text: `
Im Großraum Tokio leben rund 37 Millionen Menschen – mehr als in jeder anderen Metropolregion der Welt. Schon im 18. Jahrhundert war Edo, wie Tokio damals hieß, mit etwa einer Million Einwohnern eine der größten Städte der Erde. Doch wer heute durch Tokio läuft, merkt schnell: Diese Stadt funktioniert anders.

Die meisten Straßen haben keinen Namen. Eine Adresse besteht stattdessen aus Bezirk, Viertel, Block und einer {番号} für das {建物}. Lange wurden die Häuser in einem Block nicht der Reihe nach nummeriert, sondern in der Reihenfolge, in der sie gebaut wurden. Wer einen bestimmten {所} sucht, orientiert sich deshalb an Wahrzeichen: Es ist das {建物} {隣} der {銀行}, gegenüber vom {郵便局}, {間} Café und Apotheke.

Vor dem Bahnhof Shibuya liegt die wohl berühmteste {交差点} der Welt. Wenn alle Fußgängerampeln gleichzeitig grün werden, strömen aus allen Richtungen Menschen auf die Kreuzung – bei einer einzigen Grünphase schätzungsweise bis zu 3.000. Erstaunlich: Kaum jemand stößt zusammen. Touristen filmen das Gewimmel von den Cafés in der {近く}.

Japanische Häuser leben nicht lange. Viele Wohnhäuser werden nach rund 30 Jahren abgerissen und neu gebaut – auch wegen strenger Erdbebenvorschriften, die immer wieder verschärft wurden. Eine typische {アパート} in Tokio ist klein, aber gut gelegen: In der {近く} gibt es fast immer einen Bahnhof und einen 24-Stunden-Laden. Gleichzeitig wachsen die {ビル} in den Himmel. Der Tokyo Skytree, eröffnet 2012, ist mit 634 Metern der höchste Turm Japans. Seine {エレベーター} braucht nur rund 50 Sekunden bis zur Aussichtsplattform auf 350 Metern.

Und wenn die Erde bebt? Moderne {ビル} stehen auf Gummilagern oder haben riesige Pendel, die das Schwanken dämpfen. Bei einem Erdbeben soll man die {エレベーター} meiden und die {階段} nehmen. In vielen Wohnungen steht {前} der Tür ein Notfallrucksack bereit – eine Lektion aus dem großen Erdbeben von 1923, das große Teile Tokios zerstörte.

! Ortsangaben mit **の**: 駅の前 = vor dem Bahnhof, 銀行の隣 = neben der Bank, 公園の後ろ = hinter dem Park, AとBの間 = zwischen A und B.

> {銀行}は{駅}の{前}にあります。 | Die Bank ist vor dem Bahnhof.
> {郵便局}は{銀行}の{隣}です。 | Die Post ist neben der Bank.
> {アパート}は{公園}の{後ろ}にあります。 | Die Wohnung ist hinter dem Park.
> {本屋}は{銀行}と{郵便局}の{間}です。 | Die Buchhandlung ist zwischen Bank und Post.
> {この}{建物}の{エレベーター}は{どこ}ですか。 | Wo ist der Aufzug in diesem Gebäude?
> {階段}を{使う|使って|つかって}ください。 | Bitte nehmen Sie die Treppe.
> {交差点}の{近く}に{いい}{所}があります。 | In der Nähe der Kreuzung gibt es einen schönen Ort.
> {電話}の{番号}を{教える|教えて|おしえて}ください。 | Bitte sag mir deine Telefonnummer.
> {後ろ}を{見る|見て|みて}！ | Schau nach hinten!`,
    quiz: [
      ['Wie viele Menschen leben im Großraum Tokio?', 'Rund 37 Millionen', 'Rund 8 Millionen', 'Rund 100 Millionen', 'Rund 1 Million'],
      ['Wie ist eine Adresse in Tokio meist aufgebaut?', 'Bezirk, Viertel, Block und Gebäudenummer', 'Straßenname und Hausnummer', 'Nur eine Postleitzahl', 'Nach der Farbe der Häuser'],
      ['Wie hoch ist der Tokyo Skytree?', '634 Meter', '333 Meter', '828 Meter', '1.000 Meter'],
    ],
  },
  {
    id: 'uni', emoji: '🎓', topic: 'Geschichte',
    title: 'Die älteste Universität der Welt',
    teaser: 'Gegründet von einer Frau, regiert von Studenten – und in Japan putzen Schüler selbst.',
    text: `
Die älteste noch bestehende Bildungsstätte der Welt steht nicht in Europa, sondern in Marokko. 859 gründete in Fès eine wohlhabende Frau namens Fatima al-Fihri mit ihrem Erbe eine Moschee, an der bald gelehrt wurde: al-Qarawiyyin. Das Guinness-Buch nennt sie die älteste noch bestehende Universität; zur staatlichen {大学} im modernen Sinn wurde sie allerdings erst 1963. Ihre {図書館} gehört zu den ältesten der Welt und bewahrt jahrhundertealte Handschriften.

In Europa gilt Bologna, gegründet 1088, als älteste {大学}. Das Spannende: Dort hatten anfangs die {学生} das Sagen. Sie schlossen sich zu einer Genossenschaft zusammen – einer „universitas“ – und stellten ihre Lehrer selbst ein. Wer schlecht unterrichtete oder zu spät kam, musste Strafe zahlen. Ein {先生}, der zu wenig Stoff schaffte, bekam Ärger mit seinen Studenten.

Japan hatte schon in der Edo-Zeit erstaunlich viele Menschen, die lesen und schreiben konnten. In Tausenden kleiner Tempelschulen, den Terakoya, durften Kinder von Bauern und Händlern Schrift, Rechnen und Moral {習う}. Bücher waren beliebt: Leihbuchhändler zogen mit Kisten voller {本} von Haus zu Haus.

Heute beginnt das Schuljahr in Japan im April, zur Kirschblüte. Eine Besonderheit: In fast jeder {学校} putzen die {生徒} ihr {教室} selbst – auch Flure und Toiletten. Die Idee: Wer selbst sauber macht, achtet mehr auf seine Umgebung. Nach dem Unterricht wartet {宿題}, und viele Schüler gehen abends in private Nachhilfeschulen, um für die gefürchteten Aufnahmeprüfungen zu {勉強}.

Japans Universitäten wollen internationaler werden. Die Zahl der {留学生} ist stark gestiegen, viele kommen aus China, Vietnam und Nepal. Wer in Japan studieren will, besucht meist zuerst eine Sprachschule – und dann gilt, was schon in Bologna vor 900 Jahren galt: Gute Lehrer können {教える}, aber {勉強} musst du selbst. Ein {留学生} sagte einmal: Das {本} ist der geduldigste {先生}.

! **で** = wo etwas passiert: 図書館で勉強します = Ich lerne in der Bibliothek. (**に** = wo etwas ist.)

> {私}は{学生}です。{大学}で{日本語}を{勉強}します。 | Ich bin Student. An der Uni lerne ich Japanisch.
> {図書館}で{本}を{読む|読みます|よみます}。 | In der Bibliothek lese ich Bücher.
> {先生}は{英語}を{教える|教えます|おしえます}。 | Der Lehrer unterrichtet Englisch.
> {生徒}は{教室}を{掃除}します。 | Die Schüler putzen das Klassenzimmer.
> {宿題}が{多い}です。 | Es gibt viele Hausaufgaben.
> {学校}で{ピアノ}を{習う|習いました|ならいました}。 | In der Schule habe ich Klavier gelernt.
> {留学生}が{たくさん}います。 | Es gibt viele Austauschstudenten.`,
    quiz: [
      ['Wer gründete 859 al-Qarawiyyin in Fès?', 'Fatima al-Fihri', 'Ibn Battuta', 'Karl der Große', 'Avicenna'],
      ['Wer stellte an der Universität Bologna anfangs die Lehrer ein?', 'Die Studenten', 'Der Papst', 'Der Kaiser', 'Die Stadt Venedig'],
      ['Wer putzt in japanischen Schulen die Klassenzimmer?', 'Die Schüler selbst', 'Die Eltern', 'Roboter', 'Nur die Hausmeister'],
    ],
  },
  {
    id: 'schrift', emoji: '✍️', topic: 'Sprache',
    title: 'Drei Schriften und die Frauen, die Romane erfanden',
    teaser: 'Warum ein Dichter sich als Frau ausgab, um in Hiragana schreiben zu dürfen.',
    text: `
Japanisch ist eine der wenigen Sprachen, die mit drei Schriften gleichzeitig geschrieben werden. In einem einzigen Satz stehen {漢字}, {平仮名} und {片仮名} nebeneinander – oft noch ergänzt durch lateinische Buchstaben. Wie konnte das passieren?

Ursprünglich hatte Japan keine Schrift. Ab etwa dem 5. Jahrhundert kamen über Korea chinesische Schriftzeichen ins Land, zusammen mit Büchern, Buddhismus und Verwaltung. Das Problem: Chinesisch und {日本語} sind völlig verschiedene Sprachen. Japanische Endungen ließen sich mit chinesischen Zeichen kaum schreiben. Also benutzte man manche {漢字} nur noch für ihren Klang und ignorierte ihre {意味}.

Aus schnell und schwungvoll geschriebenen Lautzeichen entstanden im 9. Jahrhundert die {平仮名}. Männer am Hof schrieben offizielle Texte weiter auf Chinesisch – so wie europäische Gelehrte auf Latein. Die runden {平仮名} galten als „Frauenhand“. Genau das machte Frauen zu Pionierinnen: Um das Jahr 1000 schrieb die Hofdame Murasaki Shikibu die „Geschichte vom Prinzen Genji“, oft der erste Roman der Welt genannt. Und Sei Shōnagon notierte in ihrem „Kopfkissenbuch“ Listen, Klatsch und scharfe Beobachtungen in elegantem {文章}.

Wie eng das Schreiben mit dem Geschlecht verbunden war, zeigt ein Trick: Um 935 schrieb der Dichter Ki no Tsurayuki ein Reisetagebuch und gab sich darin als Frau aus – denn für einen Mann war es unüblich, so etwas Persönliches in {平仮名} zu schreiben. Die {片仮名} entstanden dagegen in Klöstern: Mönche notierten zwischen den Zeilen buddhistischer Texte Lesehilfen und kürzten dafür {漢字} zu kleinen, eckigen Zeichen ab.

Heute braucht man für eine Zeitung rund 2.000 {漢字}; für Wörter aus dem Ausland, etwa aus dem {英語}, nimmt man {片仮名}. Viele Japaner lieben handgeschöpftes {紙}, Washi, das seit 2014 zum UNESCO-Kulturerbe gehört. Kinder schreiben in der Schule ihr erstes {作文} mit allen drei Schriften. Und wenn du diese Geschichte {読む}, hast du schon {言葉} aus allen dreien gelesen.

! **AはBという意味です** = A bedeutet B.

> {日本語}は{難しい}ですか。 | Ist Japanisch schwer?
> {平仮名}と{片仮名}は{易しい}です。{漢字}は{難しい}です。 | Hiragana und Katakana sind leicht. Kanji sind schwer.
> 「{言葉}」は「Wort」という{意味}です。 | „Kotoba“ bedeutet „Wort“.
> {紙}に{作文}を{書く|書きます|かきます}。 | Ich schreibe einen Aufsatz auf Papier.
> {英語}の{本}を{読む|読みます|よみます}。 | Ich lese ein englisches Buch.
> {この}{文章}は{長い}です。 | Dieser Text ist lang.`,
    quiz: [
      ['Woraus entstanden die Hiragana?', 'Aus schwungvoll geschriebenen chinesischen Lautzeichen', 'Aus koreanischen Buchstaben', 'Aus Tierbildern', 'Aus dem lateinischen Alphabet'],
      ['Wer schrieb die „Geschichte vom Prinzen Genji“?', 'Die Hofdame Murasaki Shikibu', 'Kaiser Tenmu', 'Der Mönch Kūkai', 'Ki no Tsurayuki'],
      ['Wozu benutzten Mönche ursprünglich die Katakana?', 'Als Lesehilfen zwischen den Zeilen', 'Für Liebesbriefe', 'Für Zahlen', 'Für Landkarten'],
    ],
  },
];

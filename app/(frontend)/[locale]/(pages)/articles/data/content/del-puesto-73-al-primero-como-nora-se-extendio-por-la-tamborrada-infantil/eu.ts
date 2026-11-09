import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, oneIn } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const copy: ArticleCopy = {
  story: [
    // Introduction: 2008 and 2026, without revealing the companies.
    {
      kind: 'text',
      text: (f) =>
        `2008an, Ane zen Donostiako Haurren Danborradako izenik errepikatuena. Edizio hartako ${f.int(figures.y2008.participants)} partaideen artean, Ane izeneko ${f.int(figures.y2008.ane)} zeuden. Haren atzetik zetozen Jon, Iñigo, Leire eta María, hiriko konpainien artean behin eta berriz entzuten ziren izenak.`,
    },
    text('Sailkapen hartan askoz beherago agertzen zen Nora.'),
    {
      kind: 'text',
      text: () =>
        `Hamalau partaidek bakarrik zuten izen hori. Erregistratutako ${figures.y2008.companies} konpainietatik zortzitan banatuta zeuden, eta izenak ${figures.y2008.rank}. postua zuen.`,
    },
    text('Hemezortzi urte geroago, zerrenda hura beste belaunaldi batekoa dirudi.'),
    {
      kind: 'text',
      text: () =>
        `2026an, Nora da sailkapenaren buru. Izen hori duten ${figures.y2026.nora} partaide daude, Ane (${figures.y2026.ane}), Jon (${figures.y2026.jon}) eta Sara (${figures.y2026.sara}) baino gehiago. Ez dago hura gainditzen duen beste izenik.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `2008an, ${f.int(oneIn.y2008)} partaidetik bat inguru deitzen zen Nora. Gaur, ${f.int(oneIn.y2026)} partaidetik bat. Hogei urte baino gutxiagoan, oso arrunta ez zen izen bat Haurren Danborradan gehien errepikatzen den izen bihurtu da.`,
    },
    text(
      'Nola iritsi zen 2008an ia entzuten ez zen izen bat sailkapenaren gailurrera? Jakiteko, urtez urte jarraitu behar da, eta gero hurbilagotik begiratu.'
    ),

    heading('Entzuten hasten den izen bat'),
    {
      kind: 'text',
      text: () =>
        'Lehen oztopoa da datuek ez dituztela urte guztiak hartzen. Tamborradatak hamasei edizio ditu, 2008koa, 2011tik 2020rakoak eta 2022tik 2026rakoak, eta ez dago 2009ko, 2010eko eta 2021eko erregistrorik. Horregatik ageri da Noraren lehen jauzia bat-batean: 2008an 73. postuan zegoen, 14 partaiderekin, eta 2011n 25. postuan zegoen jada, 30 partaiderekin. Hiru urtetan, bikoitza baino gehiago.',
    },
    {
      kind: 'text',
      text: () =>
        `Ondoren igoera mailakatuagoa da. 2013an Nora 16.a zen, 55 partaiderekin, eta postua eta zifra errepikatu zituen 2014an. ${figures.top10Year}ean lehen aldiz sartu zen lehen hamarren artean: bederatzigarrena, 65 partaiderekin. 2008tik ${figures.placesClimbed2015} postu igo zituen.`,
    },

    heading('Ane eta Jonen aurkari bat'),
    text(
      'Hurrengo jauzia 2016an etorri zen. Nora laugarrena izan zen, 78 partaiderekin, Ane (108), Ander (86) eta Jonen (85) atzetik. 2016 eta 2019 artean laugarren eta bosgarren postuen artean ibili zen, beti 75 eta 82 partaide artean. Ordoki luzea izan zen, baina sailkapenaren goialdean zegoen jada.'
    ),
    {
      kind: 'text',
      text: () =>
        `2020an ordokia hautsi zen: Nora bigarrena izan zen, 93 partaiderekin. Ane bakarrik zegoen aurretik, 113 partaiderekin. Bien arteko aldea 2008an ${figures.gap2008} partaide zen; 2020an, ${figures.gap2020} partaide.`,
    },

    heading('Lehen postua, izartxo batekin'),
    {
      kind: 'text',
      text: (f) =>
        `2021eko hutsunearen ondoren, oso bestelako edizio bat iritsi zen. 2022koa apartekoa izan zen, ${figures.y2022.companies} konpainia eta ${f.int(figures.y2022.participants)} partaiderekin, 2020ko ${figures.y2020.companies} konpainia eta ${f.int(figures.y2020.participants)} partaideen aldean. Hartan Nora lehen aldiz izan zen lehena: Nora izeneko ${figures.y2022.nora} partaide zeuden, eta Ane izeneko ${figures.y2022.ane}. Bi partaideko aldeak ez du aski aginte-aldaketaz hitz egiteko, eta datuek hala baieztatzen dute: 2023an eta 2024an Ane berriro gelditu zen aurretik, 118rekin 106ren aurrean, eta 114rekin 103ren aurrean.`,
    },
    text(
      'Baieztapena 2025ean iritsi zen. Nora lehena izan zen 101 partaiderekin, eta Ane bigarrena, 93rekin. 2026an lehen postua errepikatu zen Noraren serie osoko zifrarik altuenarekin: 110, 99ren aurrean. Oraingoan ez zegoen tartean edizio txikiagorik.'
    ),
    {
      kind: 'text',
      text: () =>
        `2008 eta 2026 artean Norak ${figures.y2026.nora - figures.y2008.nora} partaide gehitu ditu; Anek, aldiz, 2008an ${figures.y2008.ane} zituen eta 2026an ${figures.y2026.ane}, hamabost gutxiago. Noraren igoera izenen txandakatze zabalago baten parte da, «Donostiak izenak aldatzen ditu, baina abizenak gordetzen ditu» artikuluan kontatzen duguna.`,
    },
    highlight('Nora gailurrera Anek galdu zuenagatik baino, berak gehitu zuenagatik iritsi zen.'),

    heading('Danborradako lehena ez da konpainia bakoitzeko lehena'),
    text(
      'Orain arte Haurren Danborrada osoaz hitz egin dugu. Baina Danborrada ez da desfile bakarra: konpainia bakoitzak berea du. Nora osotasunean gehien errepikatzen den izena bada, zentzuzkoa dirudi konpainia gehienetan ere hala izatea espero dezakegula.'
    ),
    {
      kind: 'text',
      text: () =>
        `Ez da hala. 2026an Nora ${figures.y2026.companies} konpainietatik lautan soilik da izenik errepikatuena: Amara Berri (10 partaide), Kresala Txiki (9), Sagrado Corazón Mundaiz (7) eta Zurriola Ikastola (6). Gainerakoetan beste bat da gogokoena: Martín Ekintzan, Martina Deutsche Schulen, Ane Santo Tomásen, June Ikasbiden.`,
    },
    text(
      'Anek, guztizkoaren bigarrenak, hiru konpainia gidatzen ditu bakarrik, eta beste bitan lehen postua partekatzen du. Norak, guztizkoaren lehenak, lau gidatzen ditu bakarrik.'
    ),
    {
      kind: 'text',
      text: () =>
        `Osotasunaren lehena hain konpainia gutxitan lehena izateak azalpena du: bi lasterketa desberdin dira. Konpainia baten buru izateko 6 eta 10 partaide artean aski dira: Norak gidatzen dituen lauretan, 133 eta ${figures.amaraBerri2026} partaide artean dituztenak, zifra horrek ematen dio lehen postua. Osotasunaren buru izateko, toki guztietan batu behar da. Norak guztira ${figures.y2026.nora} partaide batzen ditu, agertzen den ${figures.y2026.companiesWithNora} konpainia bakoitzean hiru partaide baino zertxobait gehiagoko batez bestekoarekin, inon pilatu gabe: handienak, Amara Berrik, hamar biltzen ditu, guztizkoaren %${figures.biggestCompanySharePct}.`,
    },
    text(
      'La Sallen, adibidez, Anek 10 partaide ditu eta Norak 8. Anek irabazten du han, baina 8 horiek Noraren 110 horietako 8 ere badira. Konpainia bateko lehen postuak asko balio du konpainia horretan; bigarrenak edo hirugarrenak berdin batzen du guztizkoan.'
    ),
    {
      kind: 'text',
      text: () =>
        `Zenbaketa osoak erakusten du. Nora lehen hiru izenen artean dago ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} konpainiatan: lehena ${figures.noraRankBuckets.first} konpainiatan eta bigarrena edo hirugarrena beste ${figures.noraRankBuckets.second3} konpainiatan. Laugarren eta hamargarren postuen artean dago beste ${figures.noraRankBuckets.fourTo10} konpainiatan, beheragoko postuetan ${figures.noraRankBuckets.eleven} konpainiatan, eta ${figures.noraRankBuckets.none} konpainiatan ez du partaiderik.`,
    },
    highlight('Danborradako izenik errepikatuena izatea ez da berdin konpainia bakoitzean izatea.'),

    heading('Nola iritsi zen Nora hainbeste konpainiatara?'),
    {
      kind: 'text',
      text: () =>
        `Erantzuna alderaketa batekin hasten da. 2008an, Nora izeneko partaideak ${figures.y2008.companiesWithNora} konpainiatan zeuden (guztira ${figures.y2008.companies}). 2026an, ${figures.y2026.companiesWithNora} konpainiatan. Paradoxaren azalpena hemen dago: Nora Haurren Danborrada ia osoan nagusitu da, konpainia gehienetan gogokoena izatera iritsi gabe.`,
    },
    {
      kind: 'text',
      text: () =>
        `Eta hedapen hori lidergoa baino lehen etorri zen. 2011n Norak ${figures.companies2011} konpainiatan zeuden. 2013an, Nora osotasunean ${figures.companies2013Rank}.a zen oraindik, baina ${figures.companies2013} konpainiatan zegoen jada. 2014 eta 2020 artean zifra 32 eta 34 artean ibili zen, eta 2023an bere maximoa izan zuen: ${figures.companies2023} konpainiatan, edizio hartako ${figures.registered2023} zirenetatik. 2026an ${figures.y2026.companiesWithNora} dira.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Xehetasun bat gehiago dago. 2008 eta 2013 artean Nora 14 partaidetik 55era igaro zen, baina igoera hori konpainia berrietara iristearekin bat dator, ez konpainia bakoitzeko partaide gehiagorekin: batez bestekoak ia ez zuen aldaketarik izan (konpainiako ${f.decimal(figures.perCompany2008, 2)} eta ${f.decimal(figures.perCompany2013, 2)}). Urte horietan izena konpainiaz konpainia pasatuz hazten zen. 2013tik aurrera kontrakoa gertatu zen: ia guztietan zegoen jada, eta hazi zena konpainia bakoitzean zegoen Nora kopurua izan zen: 2020an ${f.decimal(figures.perCompany2020, 2)} eta 2026an ${f.decimal(figures.perCompany2026, 2)}.`,
    },
    highlight('Lehenik zabaldu zen; gero errotu zen.'),

    heading('Konpainia guztiek aukeratzen dituzte izen berberak?'),
    text(
      'Noraren paradoxak beste galdera bat sortzen du: konpainia bakoitzak bere gogokoenak baditu, neur daiteke zenbat antzekotasun dituzten elkarren artean.'
    ),
    text(
      'Lehentasun batzuk iraunkorrak dira. Deutsche Schulen, Martina izan da izenik errepikatuena 2023tik 2026ra bitarteko lau edizioetan. Ekintzan, Martínek lehen postua eskuratu edo partekatu du lauretan, eta lehen postu bakarra izan da 2025ean eta 2026an. Baina salbuespenak dira. Konpainia gehienetan lehen postua ia urtero aldatzen da. Santo Tomásen Jon izan zen 2023an, Jon eta Mikel 2024an, Maddi 2025ean eta Ane 2026an. La Sallen, Lucía 2023an eta 2024an, Ane eta Nora berdinduta 2025ean eta Ane 2026an.'
    ),
    text(
      'Noraren lidergoa bere lau konpainietan, gainera, berria da. 2023an ez zuen lauetako bat ere gidatzen; gaur lau guztiak gidatzen ditu. Amara Berrin, adibidez, lehen postua Nahiarena izan zen 2023an eta 2024an, Maddik eta Norak partekatu zuten 2025ean eta Norarena izan zen 2026an.'
    ),
    {
      kind: 'text',
      text: () =>
        `Konpainia bakoitzeko hamar izen gogokoenak ere gutxi antzekoak dira elkarren artean. 2023tik 2026ra bitarteko lau edizioetan agertzen diren ${figures.top10Overlap.companies} konpainiak alderatuz gero, edozein bi konpainiak, batez beste, bi izen baino gutxiago partekatzen dituzte beren hamar izen errepikatuenen artean. Partaideak konpainia horien artean zorizko moduan banatuko balira, lau baino zertxobait gehiago partekatuko lituzkete. Konpainiak elkarren antzeko gutxiago dira banaketa zorizkoa balitz espero litekeena baino.`,
    },
    {
      kind: 'text',
      text: () =>
        `Eta lehen mailako izen batzuk ia ez dira ikastetxe jakin batzuetara iristen. Ane, Danborradako bigarrena, ez da behin ere agertzen Amara Berriko ${figures.amaraBerri2026} partaideen artean 2026an. Noraren kasuan, San José Ikastetxean ez da inor agertu konpainia hori erregistratuta dagoen ${figures.sanJoseEditions} edizioetan, eta ${figures.deutscheEditions} edizioetan ageri den Deutsche Schulen Nora izan da ${figures.deutscheEditionsWithNora} edizioetan, baina beti zifra oso txikietan.`,
    },
    text(
      'Datuek desberdintasun horiek erakusten dituzte, ez haien kausa. Ez dute jasotzen familien maila ekonomikoa, jatorria edo konpainia bakoitzaren eredu linguistikoa, eta horregatik ez dizkiegu desberdintasunak faktore horietako bati ere egozten.'
    ),

    heading('Zergatik Nora?'),
    {
      kind: 'text',
      text: () =>
        `Geratzen den galdera da, eta erantzun daitekeen gutxiena. Kanpoko erreferentzia batek izena kokatzen laguntzen du. Eustatek, Euskadiko estatistika-erakundeak, Euskadin jaiotako nesken izenak argitaratzen ditu, eta 2022 eta 2025 artean Nora beti dago goian. Gipuzkoan nesken izenik ohikoena izan zen 2022an eta 2023an, bigarrena 2024an eta hirugarrena 2025ean. Donostian bigarrena, lehena, bigarrena eta hirugarrena izan zen. Euskadi osoan zazpigarren, laugarren, hirugarren eta laugarren postuak bete zituen, urtean 90 eta 113 jaiotza artean.`,
    },
    text(
      'Nora ez da Danborradaren berezko izena: gaur egun Gipuzkoan jaiotzen diren nesken artean gehien aukeratzen diren izenetako bat izaten jarraitzen du. Baina horrek ez du aukerarik ematen haren aurreko historia berreraikitzeko, ezta izen batek jaiotzetatik Danborradara pasatzeko zenbat denbora behar duen neurtzeko ere. Egiaztatu ahal izan ditugun Eustaten taulek 2022tik 2025era arteko urteak soilik hartzen dituzte, eta gure datuek ez dute partaide bakoitzaren adina jasotzen.'
    ),
    text(
      'Ez dugu aurkitu, halaber, familiek zergatik aukeratzen duten Nora azaltzen duen iturri egiaztaturik. Galdera irekia da, eta hala uztea nahiago dugu erantzun bat asmatu baino.'
    ),

    heading('Hamalau Nora zortzi konpainiatan'),
    {
      kind: 'text',
      text: () =>
        `2008an, Nora izatea salbuespena zen: hamalau partaide zortzi konpainiatan banatuta, eta gainerako ${figures.y2008.companies - figures.y2008.companiesWithNora} konpainietan ez zegoen bat ere. Hemezortzi urte geroago, proportzioa buelta eman da. ${figures.y2026.companiesWithNora} konpainiatan dago Nora izeneko partaideren bat, eta ${figures.y2026.companiesWithoutNora} konpainiatan bat ere ez.`,
    },
    text(
      'Baina ez da guztietako gogokoena bihurtu. Konpainia gehienetan izenik errepikatuena beste bat izaten jarraitzen du, eta bakoitzak bere lehentasunak gordetzen ditu. Noraren istorioa ez da konpainia guztien gogokoena bihurtu den izen batena, ia guztietan presente egotea lortu duen batena baizik.'
    ),
    text(
      'Haurren Danborradaren edizio bakoitza belaunaldi baten argazkia da. 2008an desfilatu zuenak Ane eta Jon nonahi izan zituen. Orain desfilatzen duenak Nora aurki dezake bost konpainiatik lau baino gehiagotan.'
    ),
  ],
  data: {
    heading: 'Istorioa datuetan',
    rise: {
      lede: (f) =>
        `**Norak ${figures.y2008.nora} partaide zituen 2008an eta ${figures.y2026.nora} 2026an, eta hiru edizioetan gainditu du Ane: 2022an, 2025ean eta 2026an.** Izen bakoitza duten partaideak edizio bakoitzean. 2022koa apartekoa izan zen, ${f.int(figures.y2022.participants)} partaiderekin (ez dago 2009ko, 2010eko eta 2021eko daturik).`,
      noraLabel: 'Nora',
      aneLabel: 'Ane',
    },
    milestones: {
      lede: '**Nora 2015ean sartzen da Top 10ean, eta lehena da 2022an, 2025ean eta 2026an.** Edizio bakoitzeko sailkapenean duen postua, partaide kopurua eta agertzen den konpainiak.',
      columns: ['Edizioa', 'Postua', 'Partaideak', 'Nora duten konpainiak'],
      companiesCell: (withNora, registered) => `${withNora} / ${registered}`,
    },
    leaders: {
      lede: '**Konpainia bakoitzak bere gogokoena du.** 2026an konpainia batzuetan izenik errepikatuena eta zenbat partaidek duten (sei partaide edo gehiago dituzten konpainiak soilik). Nora, nabarmenduta.',
      barUnit: 'partaide',
    },
    position: {
      lede: () =>
        `**Nora lehena da ${figures.noraRankBuckets.first} konpainiatan, lehen hiruren artean dago ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} konpainiatan eta ez du partaiderik ${figures.noraRankBuckets.none} konpainiatan (guztira ${figures.y2026.companies}).** Noraren postua konpainia bakoitzean 2026an (berdinketek postua partekatzen dute).`,
      first: '1.a',
      secondThird: '2.a edo 3.a',
      fourthToTenth: '4.a-10.a',
      eleventhOrLower: '11.a edo beherago',
      none: 'Bat ere ez',
    },
    waffles: {
      lede: '**2008an zortzi konpainiatan zeuden Norak; 2026an, 35 konpainiatan.** Nora izeneko partaide bat gutxienez duten konpainiak. Zirkulu bakoitza konpainia bat da.',
      label2008: () =>
        `2008: Nora duten konpainiak, ${figures.y2008.companiesWithNora} / ${figures.y2008.companies}`,
      label2026: () =>
        `2026: Nora duten konpainiak, ${figures.y2026.companiesWithNora} / ${figures.y2026.companies}`,
    },
    spread: {
      lede: () =>
        `**Nora ${figures.companies2013} konpainiatan zegoen jada 2013an, osotasunean ${figures.companies2013Rank}.a zenean.** Edizio bakoitzean Nora duten konpainiak. 2012an eta 2022an konpainia gutxiago izan ziren (25 eta 26, beste edizioetan 40 eta 45 artean). Ez dago 2009ko, 2010eko eta 2021eko daturik.`,
      label: 'Nora duten konpainiak',
    },
    perCompany: {
      lede: (f) =>
        `**Norak konpainiako batez beste ${f.decimal(figures.perCompany2013, 2)} dira 2013an eta ${f.decimal(figures.perCompany2026, 2)} 2026an.** Nora izeneko partaideak, agertzen diren konpainien artean zatituta.`,
      label: 'Norak konpainiako, Nora duten konpainietan',
    },
    persistence: {
      lede: '**Gogokoen batzuek irauten dute; gehienak ia urtero aldatzen dira.** Konpainia batzuetan edizio bakoitzean izenik errepikatuena.',
      columns: ['Konpainia', '2023', '2024', '2025', '2026'],
      and: 'eta',
      tie: '(berdinketa)',
      many: 'Hainbat izen berdinduta',
    },
    overlap: {
      lede: '**Bi konpainiak, batez beste, bi izen baino gutxiago partekatzen dituzte beren hamar gogokoenen artean; zorizko banaketarekin lau baino gehiago partekatuko lituzkete.** Bi konpainiaren hamar izen errepikatuenen artean komunean dauden izenak, 2023tik 2026ra bitarteko lau edizioetan agertzen diren 41 konpainiarekin.',
      leftLabel: 'Konpainia berdinen arteko zorizko banaketa',
      rightLabel: 'Benetako konpainiak',
      value: (shared) => `10etik ${shared} komunean`,
    },
    eustat: {
      lede: '**2022tik 2025era jaiotako nesken artean, Nora beti egon zen Gipuzkoako eta Donostiako lehen hiru izenen artean.** Noraren postua nesken izenen artean jaiotza-urte bakoitzeko (Eustat).',
      columns: ['Jaiotza-urtea', 'Euskadi', 'Gipuzkoa', 'Donostia'],
    },
  },
  used: {
    heading: 'Erabilitako datuak',
    blocks: [
      (f) =>
        `**Zer datu.** Tamborradataren argitaratutako estatistikak Haurren Danborradaren ${f.int(figures.editions)} edizioz: 2008, 2011tik 2020ra eta 2022tik 2026ra (ez dago 2009ko, 2010eko eta 2021eko daturik), eta edizio horietako parte-hartzeei buruzko zenbaketa agregatuak. Kontsulta 2026ko azaroaren 9koa da, 2026ko urriaren 18an argitaratutako bertsioen gainean.`,
      (f) =>
        `**Zer zenbatzen duen zifra bakoitzak.** Parte-hartzeak zenbatzen dira, ez pertsonak: urte batzuetan desfilatzen duena hainbat aldiz agertzen da. Partaide bakoitza behin zenbatzen da bere izen nagusiaren arabera, eta izen elkartuak lehenaren arabera. Datuek ez dute azentu-markarik ez eñerik (adibidez, «Inigo»). Sailkapenak argitaratuak dira. Partaide kopuru berarekin, ordena argitalpenak finkatzen du: 2008an lau izenek 14 partaide batzen zituzten eta Norarena da talde horretako azkena, 73. postua, 69 izen gainetik dituela; antzeko zerbait gertatzen da 2013an, 2015ean eta 2017an. Argitaratutako zerrendek ${f.int(4012)} izen identifikatu batzen dituzte 2008an eta ${f.int(5276)} 2026an, ${f.int(figures.y2008.participants)} eta ${f.int(figures.y2026.participants)} partaideetatik.`,
      () =>
        '**Zer da konpainia bat.** Tamborradatan erregistratutako entitateetako bakoitza: ikastetxeak, ikastolak eta beste talde batzuk. 2026an 43 dira; kopurua edizioaren arabera aldatzen da (45 konpainia 2011n, 2023an eta 2024an; 25 2012an eta 26 2022an). Izen batek konpainia bat «gidatzen» du beste inork baino partaide gehiago biltzen dituenean; berdinketa badago, hala esaten da. Anek hiru konpainia gidatzen ditu bakarrik eta beste bitan lehen postua partekatzen du; Norak lau gidatzen ditu bakarrik. Grafikoan, Noraren postuak konpainia bakoitzean berdinketei postua partekatzen uzten die.',
      () =>
        '**Konpainien gogokoenak nola alderatzen diren.** 2023tik 2026ra bitarteko lau edizioetan agertzen diren 41 konpainiak hartzen dira, lau edizioak batzen dira eta konpainia bakoitzeko hamar izen errepikatuenak kalkulatzen dira (hamargarren postuko berdinketak ordena alfabetikoz ebazten dira). Konpainien 820 bikote posibleek partekatzen dituzten izenak zenbatzen dira. Zorizko banaketarako, partaideak konpainia berdinen artean birbanatzen dira, bakoitzaren tamaina errespetatuz, eta kalkulua errepikatzen da: hiru errepikapenek 4,1 eta 4,2 izen komun eman zituzten.',
      () =>
        '**Mugak.** Datuek ez dituzte jasotzen partaideen adina, generoa edo jatorria, ezta familia bakoitzaren arrazoiak ere. 2012ko eta 2022ko edizioak txikiagoak dira (2.768 eta 2.849 partaide) eta haien alderaketak ez dira hain egonkorrak. Egiaztatu ahal izan ditugun Eustaten taulek 2022tik 2025era jaiotakoak soilik hartzen dituzte eta postuak erakusten dituzte, ez lurralde bakoitzeko jaiotzak. Ez dugu egiaztatu ahal izan Euskaltzaindiaren sarrera bat izenari buruz, ezta jaiotzen aurreko serie bat ere, beraz ez ditugu desfaseak neurtzen eta ez ditugu kausak azaltzen.',
      (f) =>
        `**Pribatutasuna.** Agregatuak bakarrik argitaratzen dira; ez dago 5 baino txikiagoko partaide-zifrarik (agertzen den txikiena ${f.int(figures.smallestFigure)} da). Konpainia eta edizio bakoitzeko zenbaketa txikiagoa denean, berdinketa gisa soilik erakusten da, edo ez da erakusten.`,
    ],
    sourcesLead: '**Egiaztatutako kanpoko iturriak.**',
  },
};

const texts: ArticleTexts = {
  title: '73. postutik lehenengora: Nora nola zabaldu zen Haurren Danborradan',
  description:
    '2008an, Nora 73. izena zen Donostiako Haurren Danborradan, 14 partaiderekin zortzi konpainiatan. 2026an izenik errepikatuena da, 110 partaiderekin 35 konpainiatan, nahiz eta lau konpainiatan bakarrik den buru.',
  category: 'Izenak',
  readTime: '11 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

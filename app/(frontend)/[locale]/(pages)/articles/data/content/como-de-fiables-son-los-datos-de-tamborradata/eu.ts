import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, participations, ambiguous } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = participations.length - 1;

const copy: ArticleCopy = {
  story: [
    {
      kind: 'text',
      text: (f) =>
        `2026an, Tamborradatak ${f.int(participations[last])} partaide jaso ditu Haurren Danborradan. Horietatik ${ambiguous[last]} ez dira izenen inongo sailkapenetan ageri: datuak ordenatzen dituen programak ez zekien zein zen izena eta zein abizena, eta asmatu baino nahiago izan zuen kanpoan uztea.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Zati oso txikia da, baina artikulu honen galderaren laburpena da. Tamborradatak Nora izenik errepikatuena dela edo García abizenik ohikoena dela dioen bakoitzean, atzean hamasei edizioan zehar argitaratutako zerrendetatik kopiatutako ${f.int(figures.total)} errenkada daude. Pertsona desberdinek idatzitako zerrendak dira, formatu desberdinetan eta batzuetan jatorritik zetozen akatsekin. Orduan, zein fidagarriak dira Tamborradataren datuak?`,
    },
    text(
      'Erantzuteko hiru proba egin ditugu. Lehenengoa, kanpoko iturriekin alderatzea, zorrotzenarekin hasita: antolakuntzaren beraren zifrekin. Bigarrena, kontuak beren baitan bat datozela egiaztatzea. Eta hirugarrena, erosoena ez dena: garbitu ezin izan dena erakustea.'
    ),

    heading('Proba gogorrena: antolakuntzaren zifrak'),
    {
      kind: 'text',
      text: (f) =>
        `Donostia Kulturak, Danborrada antolatzen duenak, urtero argitaratzen du zenbat neska-mutilek desfilatzen duten Haurren Danborradan eta zenbat zentrotatik datozen. Tamborradataren zifrak ez datoz bat lehen begiratuan, eta aldea bi norabidetan doa. 2020ra arte zertxobait baxuagoak dira. Tamborradatak eta antolakuntzak emandako zifrak, hurrenez hurren: 2017an ${f.int(4807)} eta ${f.int(4977)}; 2020an ${f.int(4683)} eta ${f.int(4828)}. 2023tik aurrera %10 eta %12 artean altuagoak dira: 2023an ${f.int(5219)} eta ${f.int(4731)}; 2024an ${f.int(5320)} eta ${f.int(4732)}; 2025ean ${f.int(5149)} eta ${f.int(4625)}.`,
    },
    text(
      'Azalpena lau konpainiatan dagoela dirudi. 2022tik Tamborradataren datuek hiru elkarteren haurren danborradak biltzen dituzte, Amaratarra Txiki, Kresala Txiki eta Gaztelubide Txiki, eta Unión Artesanarena. Antolakuntzak aparte aipatzen ditu bere memorietan, eta Unión Artesanarena 2023ko urtarrilaren 19an desfilatu zen, desfile nagusia baino egun bat lehenago.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Lau horiek kenduz gero, zifrak ia berdintzen dira. Tamborradatak eta antolakuntzak, hurrenez hurren: 2023an ${f.int(4672)} eta ${f.int(4731)}; 2024an ${f.int(4710)} eta ${f.int(4732)}; 2025ean ${f.int(4506)} eta ${f.int(4625)}, hau da, %0,5 eta %2,6 artean gutxiago. Konpainiak ere bat datoz: antolakuntzak 41 zentro aipatzen ditu 2023an eta 2024an, eta 38 2025ean, eta lau horiek gabe Tamborradatak 41, 41 eta 38 zenbatzen ditu. 2017an 42 dira bietan. Konpainia horiek gabe, gainera, 2023ko guztizkoa (${f.int(4672)}) 2020koa (${f.int(4683)}) baino zertxobait txikiagoa da: jauzi nabariaren zati handi bat datu-baseak konpainia berriak barne hartzen dituelako gertatzen da, ez neska-mutil gehiagok desfilatzen dutelako.`,
    },
    text(
      'Zifrekin bat datorren azalpena da, baina ez dago baieztatuta: antolakuntzak ez du zehazten zer sartzen duen bere zenbaketan. Eta hondar bat geratzen da. Tamborradatak %0,5 eta %3,4 artean partaide gutxiago ditu antolakuntzak baino alderatutako urte guztietan, eta 2020an konpainia bat gutxiago (40 eta 41, hurrenez hurren). Zerrendak jatorrian osatu gabe egoteagatik edo zenbaketa-desberdintasun bestelakoengatik izan daiteke; datuek ez dute hori esatea ahalbidetzen.'
    ),
    highlight('Txiki konpainiarik gabe, Tamborradataren 2023ko datuak 2020koak baino zertxobait txikiagoak dira.'),

    heading('Beste iturriek diotenarekin bat datoz?'),
    text(
      'Abizenak dira alderaketa garbiena. 2026an Haurren Danborradako hamar abizen errepikatuenak (García, González, Martínez, Fernández, Rodríguez, Pérez, López, Sánchez, Martín eta Gómez) Gipuzkoako egoiliarren lehen hamar abizenak dira, INEren arabera 2025eko urtarrilaren 1ean. Batzuek postua aldatzen dute: Martínez hirugarrena da Danborradan eta zortzigarrena Gipuzkoan. Baina ez dago bat ere falta, eta ez dago bat ere soberan.'
    ),
    text(
      'Izenekin alderaketa ahulagoa da, nahiz eta norabide berean seinalatu. Eustatek, Euskadiko estatistika-erakundeak, Gipuzkoako jaioberrien izenak argitaratzen ditu. 2022 eta 2025 artean buru izan ziren Nora eta June neskei dagokienez, eta Luka, Martin eta Markel mutilei dagokienez. Bost horietatik lau, Nora, June, Martin eta Markel, 2026ko Danborradaren lehen hamarren artean daude.'
    ),
    text(
      'Bat-etortze horiek zerbait zehatza diote, eta beste zerbait isiltzen dute. Danborradako abizenak Gipuzkoakoekin bat etortzeak adierazten du partaideak inguruko biztanleriaren antzekoak direla. Ez da frogatzen errenkada bakoitza ondo kopiatuta dagoenik: zoriz banatutako akatsak dituen zerrenda batek antzeko emaitza emango luke, zarata ez baita abizen ohikoenak aldatzen. Eta biztanleria horiek ez dira berberak: INEk adin guztietako egoiliarrak zenbatzen ditu eta lehen abizena bakarrik, eta Eustatek jaioberriak zenbatzen ditu, ez partaideak.'
    ),
    highlight('Datuak ingurunearen antzekoak izateak frogatzen du adierazgarriak direla, ez ondo kopiatuta daudela.'),

    heading('Kontuak bat datoz?'),
    {
      kind: 'text',
      text: (f) =>
        `Ondo kopiatuta dauden jakiteko, barrura begiratu behar da. Edizio bakoitzak bi zifra ditu: datu-baseko parte-hartzeak eta argitaratutako sailkapenek batzen dituzten izen identifikatuak. Ez datoz bat. 2026an ${f.int(participations[last])} parte-hartze eta ${f.int(participations[last] - ambiguous[last])} izen identifikatu daude; 2008an, ${f.int(participations[0])} eta ${f.int(participations[0] - ambiguous[0])}.`,
    },
    text(
      'Aldea ez da desbideratze bat, berez azaltzen den kontu bat baizik. Edizioz edizio, sailkapenetan falta diren parte-hartzeak ambiguoak dira zehazki: 2026an 22, 2008an 28, 2013an 10. Hamasei edizioak bat datoz, kasuz kasu. Nora izenaren zenbaketa propioak, errenkadetatik hasieratik eginda, argitaratutako sailkapenekin ere bat egiten du: 2008an 14 eta 2026an 110.'
    ),

    heading('Zer ezin izan da garbitu?'),
    text(
      'Hau da gehien erakutsi behar den zatia. Tamborradatak ez ditu datuak asmatzen: argitaratutako zerrendetatik kopiatzen ditu eta programa batekin ordenatzen. Baina badira jatorritik gaizki zetozen gauzak, eta ezein programak ezin ditu zuzendu asmatu gabe.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Nabarmenena parte-hartze ambiguoak dira: ${figures.ambiguous}, guztizkoaren %${f.decimal(figures.ambiguousPct, 1)}. Horien artean, idatzitako izenak hitz bat edo bi dituenak ${figures.ambiguousShortNames} dira, eta hiru hitz dituenak, ${figures.ambiguousThreeWords}: hitz hain gutxirekin, izena abizenetatik bereizteko ia ez dago zertan oinarritu. Izenen sailkapenetatik kanpo geratzen dira. Gainera, ${figures.noPrimaryName} parte-hartzetan programak ezin izan zuen izen nagusi bat finkatu.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Gero jatorriko formatuak daude. 2008an, sarreren %${f.decimal(figures.commaShare2008, 1)} «Abizenak, Izena» moduan idatzita zegoen, eta 2017an, %${f.decimal(figures.commaShare2017, 1)}; gainerako edizioetan, ia bat ere ez. Hitz bakarreko ${figures.singleWord} sarrera daude (horietatik 11 2012koak dira eta 5 2017koak), parentesiak dituzten ${figures.parentheses} eta sei hitz edo gehiago dituzten ${figures.sixOrMoreWords}. Gehienak ebatzi dira, baina ohiko formatutik aldentzen den errenkada bakoitzak okerreko esleipena izateko aukera handiagoa du.`,
    },
    highlight('Zalantzaz, Tamborradatak parte-hartzea izenetatik kanpo uzten du, asmatu baino lehen.'),
    {
      kind: 'text',
      text: (f) =>
        `Eta eremu grisa handiagoa ere badago: ${f.int(figures.lowConfidence)} parte-hartze, %${f.decimal(figures.lowConfidencePct, 1)}, konfiantza baxuarekin ebatzi ziren. Programak izen bat esleitu zien, baina ohikoa baino segurtasun txikiagoarekin. Haien pisua ez da konstantea: 2008an %${f.decimal(figures.lowConfidence2008Pct, 1)} zen, 2018 eta 2020 inguruan %${f.decimal(figures.lowConfidenceMin, 1)} izatera jaitsi zen, eta 2026an %${f.decimal(figures.lowConfidence2026Pct, 1)} izatera igo da berriro. Ez dakigu zergatik: datuek aldaketa jasotzeko bakarrik balio dute.`,
    },
    {
      kind: 'text',
      text: () =>
        `Jatorriko zarata gehiago dago itxuraz sinpleenean. Datu-baseko ${figures.companiesRegistered} konpainiak ${figures.companyAliases} modu desberdinetan idatzita ageri dira, eta konpainia batek ${figures.maxAliases} aldaera ditu gehienez; baliokidetasun-taula baten bidez bateratzen dira. Eta datuek ez dute azentu-markarik ez eñerik, beraz Iñigo «Inigo» gisa ageri da, eta Ane eta Ana izen desberdintzat hartzen dira.`,
    },

    heading('Hiru edizio osatu gabe'),
    {
      kind: 'text',
      text: (f) =>
        `Muga larriena ez dago errenkadetan, edizioetan baizik. 2012an eta 2022an konpainia osoak falta dira: ${figures.partial2012.companies} eta ${figures.partial2022.companies} konpainiatako datuak baino ez daude, gainerako edizioetan 40 eta 45 artean izan diren bitartean. Ageri direnek ohiko tamaina dute: 2013an ere ageri diren 2012ko ${figures.partial2012.sizeVs2013.common} konpainiek ${f.int(figures.partial2012.sizeVs2013.edition)} partaide batzen dituzte, eta hurrengo urtean ${f.int(figures.partial2012.sizeVs2013.reference)}; 2020an ere zeuden 2022ko ${figures.partial2022.sizeVs2020.common} konpainiek ${f.int(figures.partial2022.sizeVs2020.edition)} batzen dituzte, eta 2020an ${f.int(figures.partial2022.sizeVs2020.reference)}. Hutsunea konpainiena da, ez konpainia bakoitzeko partaideena.`,
    },
    text(
      '2011n kontrakoa gertatzen da: konpainia ia guztiak daude, 45, baina askok zerrenda erdizka dute. 2013an ere ageri diren 42 horietatik, 15 konpainiek bi urte geroago erregistratzen dituzten partaideen %60 baino gutxiago dituzte, eta 21 konpainiek %80 baino gutxiago.'
    ),
    text(
      'Ez dakigu falta diren desfilatu ez zutelako edo jatorriak argitaratu ez zituelako. Datuek ez daudela esatea baino ez dute uzten, eta horregatik edizioen arteko alderaketak proportzioekin egin behar dira, zifra absolutuekin baino hobeto.'
    ),

    heading('Zertarako balio duten eta zertarako ez'),
    text(
      'Erantzun zintzoak hiru zati ditu. Edizio oso baten barruan, izenen eta abizenen sailkapenak fidagarriak dira: kontuak bat datoz eta abizenak Gipuzkoakoekin bat datoz. Edizioen artean, proportzioek hobeto eusten diete zifra absolutuei baino, batez ere 2011ko, 2012ko eta 2022ko edizioekin. Eta xehetasun finean, urte jakin bateko konpainia jakin batean, gaizki ebatzitako kasu bakar batek izen bat postuz alda dezake.'
    ),
    {
      kind: 'text',
      text: () =>
        `Itzul gaitezen 2026ko ${ambiguous[last]} partaide haietara, izenetatik kanpo geratu zirenak: sistemak zalantza egin behar duenean egiten duela erakusten dute. Inoiz zalantzarik egiten ez duen zerrenda batek askoz gutxiago fidatzeko modukoa litzateke.`,
    },
  ],
  data: {
    heading: 'Istorioa datuetan',
    surnames: {
      lede: '**Danborradako hamar abizen errepikatuenak Gipuzkoako lehen hamarrak dira.** Abizen bakoitzaren postua 2026ko Haurren Danborradan eta Gipuzkoako egoiliarren artean (INE, 2025).',
      columns: ['Abizena', 'Danborrada 2026', 'Gipuzkoa (INE, 2025)'],
    },
    names: {
      lede: '**Gipuzkoako jaiotzetan buru diren bost izenetatik lau Danborradako Top 10ean daude.** 2026ko Top 10eko izenak, 2022 eta 2025 artean Gipuzkoako jaiotzetan ere buru izan zirenak (Eustat).',
      caption: 'Komunean dauden izenak',
    },
    official: {
      lede: '**Lau Txiki konpainiarik gabe, Tamborradata antolakuntzaren zifren azpitik dago, %0,5 eta %3,4 artean.** Partaideak eta zentroak Donostia Kulturaren arabera (2025eko zifra, Orainen arabera) eta Tamborradataren arabera, Unión Artesana, Amaratarra Txiki, Kresala Txiki eta Gaztelubide Txiki kenduta. Gainerako edizioetarako ez dago zifra alderagarririk.',
      columns: [
        'Edizioa',
        'Partaideak (antolakuntza)',
        'Partaideak (Tamborradata)',
        'Aldea',
        'Zentroak (antolakuntza)',
        'Konpainiak (Tamborradata)',
      ],
    },
    reconcile: {
      lede: '**Parte-hartzeen eta izen identifikatuen arteko aldea kasu ambiguoekin bat dator, edizioz edizio.** Parte-hartzeak, argitaratutako sailkapenetan identifikatutako izenak eta kasu ambiguoak (ez dago 2009ko, 2010eko eta 2021eko daturik).',
      columns: ['Edizioa', 'Parte-hartzeak', 'Izen identifikatuak', 'Aldea', 'Kasu ambiguoak'],
    },
    residue: {
      lede: (f) =>
        `**Parte-hartzeen %${f.decimal(figures.lowConfidencePct, 1)} konfiantza baxuarekin ebatzi zen eta %${f.decimal(figures.ambiguousPct, 1)} ambiguoa da.** Arazoak dituzten parte-hartzeak, hamasei edizioetan guztira ${f.int(figures.total)} direnetatik. Parte-hartze bera hainbat errenkadatan ager daiteke.`,
      columns: ['Zer', 'Parte-hartzeak', 'Guztizkoaren zatia'],
      rows: {
        lowConfidence: 'Konfiantza baxuarekin ebatziak',
        commaFormat: 'Idatzita «Abizenak, Izena» moduan',
        ambiguous: 'Ambiguoak (izenen sailkapenetatik kanpo)',
        noPrimaryName: 'Izen nagusirik gabeak',
        sixOrMoreWords: 'Sei hitz edo gehiagokoak',
        singleWord: 'Hitz bakarrekoak',
        parentheses: 'Parentesiak dituztenak',
      },
    },
    confidence: {
      lede: (f) =>
        `**Zalantzazko ebazpenen pisua jaitsi egin zen (2008an %${f.decimal(figures.lowConfidence2008Pct, 1)}, gutxienez %${f.decimal(figures.lowConfidenceMin, 1)}) eta berriro igo da (2026an %${f.decimal(figures.lowConfidence2026Pct, 1)}).** Edizio bakoitzeko parte-hartzeen zein zati ebatzi zen konfiantza baxuarekin (ez dago 2009ko, 2010eko eta 2021eko daturik).`,
      label: 'Konfiantza baxua (%)',
    },
    coverage: {
      lede: '**Hiru edizio osatu gabe daude, arrazoi desberdinengatik.** Edizio bakoitzean daturik duten konpainiak eta zer falta den.',
      columns: ['Edizioa', 'Konpainiak', 'Zer gertatzen den'],
      rows: [
        {
          edition: '2011',
          detail: () =>
            `Ia guztiak. 2013an ere ageri diren ${figures.partial2011.common} konpainietatik, ${figures.partial2011.under60} konpainiek 2013ko partaideen %60 baino gutxiago dituzte`,
        },
        {
          edition: '2012',
          detail: () => 'Konpainia osoak falta dira; dauden konpainiek ohiko tamaina dute',
        },
        {
          edition: '2022',
          detail: () => 'Konpainia osoak falta dira; dauden konpainiek ohiko tamaina dute',
        },
      ],
    },
  },
  used: {
    heading: 'Erabilitako datuak',
    blocks: [
      (f) =>
        `**Zer datu.** Tamborradataren argitaratutako estatistikak Haurren Danborradaren ${f.int(figures.editions)} edizioz: 2008, 2011tik 2020ra eta 2022tik 2026ra (ez dago 2009ko, 2010eko eta 2021eko daturik), eta edizio horietako parte-hartzeei buruzko zenbaketa agregatuak. Kontsulta 2026ko azaroaren 9koa da, 2026ko urriaren 18an argitaratutako bertsioen gainean.`,
      () =>
        '**Zer zenbatzen duen zifra bakoitzak.** Parte-hartzeak zenbatzen dira, ez pertsonak. «Ambiguoa» da programak izena abizenetatik ziurtasunez bereiztu ezin izan duen parte-hartzea; ez da sartzen izenen sailkapenetan. «Konfiantza baxua» programaren konfiantza 0,8 baino txikiagoa duen ebazpena da (gehienez 1); sailkapenetan sartzen da. Garbitu ezin izan denaren taulako kategoriak gainjar daitezke.',
      () =>
        '**Kanpoko iturriak nola alderatzen diren.** INEk lehen abizenik ohikoena ematen du egoitza-probintziaka, 2025eko urtarrilaren 1ean, adin guztietako egoiliarrentzat. Eustatek Gipuzkoan 2022 eta 2025 artean jaiotakoen izenik ohikoenak ematen ditu. Biztanleria horiek ez dira Danborradakoak: alderaketak antzekotasuna adierazten du, ez zehaztasuna. Donostia Kulturak Haurren Danborradako desfilearen partaideak eta zentroak ematen ditu; 2025eko zifra Orainek emana da, zeinak 4.625 partaide aipatzen baititu testuan eta «5000» izenburuan, eta 2024ko prentsa-oharrak 4.732 eta 4.731 jasotzen ditu. «Zentro» gisa zenbatzen den entitate-motak oharren artean aldatzen da (ikastetxeak, entitateak, elkarteak). 2022ko edizioa auzoetako bost desfiletan antolatu zen eta ez dauka zifra alderagarririk.',
      () =>
        '**Osatu gabeko edizioak.** Konpainia bakoitzaren tamaina inguruko edizio oso batean duenarekin alderatzen da (2011 eta 2012rako, 2013koa; 2022rako, 2020koa). Zerrenda erdizkakotzat jotzen da erreferentzia horretako partaideen %60 baino gutxiago jasotzen baditu.',
      () =>
        '**Mugak.** Datuek ez dute azentu-markarik ez eñerik, eta abizen baten idazkera bakoitza abizen desberdintzat hartzen da. Ez dakigu zergatik falta diren konpainiak 2012an eta 2022an, ezta zergatik igo den zalantzazko ebazpenen zatia. Ez dugu egiaztatu ahal izan 2008ko, 2011tik 2016rako, 2018ko, 2019ko eta 2026ko zifra ofizialik. Lau Txiki konpainiek antolakuntzarekiko aldea azaltzea zifrekin bat datorren azalpena da, ez baieztatutako egitatea.',
      (f) =>
        `**Pribatutasuna.** Agregatuak bakarrik argitaratzen dira; ez dago 5 baino txikiagoko zifrarik (agertzen den txikiena ${f.int(figures.smallestFigure)} da).`,
    ],
    sourcesLead: '**Egiaztatutako kanpoko iturriak.**',
  },
};

const texts: ArticleTexts = {
  title: 'Zein fidagarriak dira Tamborradataren datuak?',
  description:
    'Tamborradataren datuak antolakuntzaren zifrekin, INErekin eta Eustatekin alderatzen ditugu, kontuak bat datozela egiaztatzen dugu eta garbitu ezin izan dena erakusten dugu: ambiguotasunak, jatorriko formatuak eta osatu gabeko hiru edizio.',
  category: 'Datuak',
  readTime: '9 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { concentration, figures, perThousand, share, trajectories } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const copy: ArticleCopy = {
  story: [
    text(
      '2008an, Ane eta Jon ziren Donostiako Haurren Danborradako mutiko eta neskatoen artean gehien errepikatzen ziren izenak. Haien atzetik zetozen Iñigo, Leire, María, Ander eta Mikel. Belaunaldi hartako haurren artean behin eta berriz entzuten ziren izenak ziren.'
    ),
    text('Hemezortzi urte geroago, zerrenda hura beste garai batekoa dirudi.'),
    text(
      '2026an, gehien errepikatzen den izena Nora da. Haren atzetik datoz Ane, Jon, Sara eta Maddi. 2008ko sailkapenaren buru ziren hamar izenetatik bik bakarrik, Anek eta Jonek, jarraitzen dute lehen hamarren artean. Beste zortziak zerrendaren goialdetik irten dira.'
    ),
    text(
      'Baina garai bereko edizioetako abizenei erreparatzen diegunean, ustekabeko zerbait gertatzen da.'
    ),
    text(
      'García, Fernández, González, Martínez, Rodríguez, Pérez, Sánchez, López, Gómez eta Martín ziren 2008an hamar abizen ohikoenak. 2026an oraindik lehen hamarrak dira. Ez da inor sartu eta ez da inor irten: elkarren artean postuz aldatu baino ez dute egin.'
    ),
    text(
      'Nola alda daiteke hainbeste gure seme-alabei izena jartzeko modua, abizenak ia aldatu gabe dirauten bitartean?'
    ),
    text(
      'Jakiteko, Tamborradatan argitaratutako hamasei edizioak arakatu ditugu, 2008tik 2026ra, eta erantzunak datuetatik kanpo ere bilatu ditugu: artxibo ofizialetan, XX. mendeko migrazioei buruzko ikerketetan eta familia baten historian. Bidean, bigarren enigma bat agertu zen.'
    ),

    heading('Apurka-apurka berritzen den zerrenda'),
    text(
      'Tarteko edizioek lehenik erakusten dutena da izenen txandakatzea ez zela kolpe batean gertatu. Edizio batetik bestera, lehen hamar izenetatik bat eta hiru artean aldatu ohi dira. Aldaketa txikiak dira, baina ia bi hamarkadatan batuta, zerrenda ezagutezin utzi dute. Abizenekin kontrakoa gertatzen da: beste hamabost edizioetatik hamalautan, Top 10ak bederatzi edo hamar abizen partekatzen ditu 2008koarekin.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Nora da mantsotasun horren adibiderik onena. 2008an izen diskretua zen, ${f.int(trajectories.nora.count2008)} agerraldirekin. Kolpe handirik gabe hazi zen, 2026an ${f.int(trajectories.nora.count2026)}era iritsi arte, erregistratutako mila izenetatik gutxi gorabehera ${f.int(perThousand.nora[perThousand.nora.length - 1])}, eta horrek aski izan zuen zerrendaren buru izateko. Haren ondoan, Telmo, Markel eta Martin ere agerraldiak batzen joan ziren, gora-beherekin, Top 10ean sartu arte.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Balantzaren beste aldean, María 2008ko ${f.int(trajectories.maria.count2008)} agerraldietatik 2026ko ${f.int(trajectories.maria.count2026)}ra jaitsi zen, eta Andrea ${f.int(trajectories.andrea.count2008)}tik ${f.int(trajectories.andrea.count2026)}ra. Hirugarren eta laugarren ziren Iñigok eta Leirek pisuaren erdia baino gehiago galdu dute. Ane eta Jon goian eutsi zioten, orduan baino pisu pixka bat txikiagoarekin.`,
    },
    text(
      'Berritze hau ez da Danborradaren berezitasun bat. Eustatek, Euskadiko estatistika-erakundeak, jasotzen du 2022 eta 2025 artean Gipuzkoako jaiotzen artean izen nagusiak Nora eta June izan zirela neskentzat, eta Luka, Martin eta Markel mutilentzat. Lauk (Nora, June, Martin eta Markel) 2026ko Danborradako Top 10ean daude.'
    ),

    heading('Moda bat eta artxibo bat'),
    text(
      'Azalpenik errazena zer nola erabakitzen den da. Izena aukeratu egiten da: gurasoek une jakin batean hautatzen dute, beren belaunaldiaren gustuekin, eta horregatik modak joan eta etorri egiten dira. Abizena ez da aukeratzen: idatzita iristen da, bi familiatatik, eta hurrengoari transmititzen zaio.'
    ),
    highlight('Izenak moda baten antzekoak dira; abizenak, artxibo baten antzekoak.'),
    {
      kind: 'text',
      text: (f) =>
        `Danborradako erregistroek bi mekanismo horiek argi islatzen dituzte. Izenen Top 10ak 2008an erregistratutako bost izenetik bat biltzen zuen, eta gaur zazpitik bat: banaketa zabaldu da eta aniztasun handiagoa dago. Abizenetan alderantziz gertatzen da: lehen hamarrek lehen baino zerbait gehiago metatzen dute, agerraldien %${f.decimal(share(concentration.y2008.topSurnames, concentration.y2008.surnameAppearances), 1)}tik %${f.decimal(share(concentration.y2026.topSurnames, concentration.y2026.surnameAppearances), 1)}ra. Haurrak izen gehiagoren artean banatzen diren bitartean, abizenak betikoetan pixka bat gehiago kontzentratzen dira.`,
    },
    text(
      'Eta hori ere ez da Danborradaren berezitasun bat. INEren arabera, 2025eko urtarrilaren 1ean Gipuzkoako egoiliarren lehen hamar abizenak hamar horiek berak dira, García buru dela. INEk lehen abizena bakarrik zenbatzen du, baina emaitza bat dator.'
    ),
    highlight('Haurren Danborradako abizen-zerrendak probintziako abizenen mapa erreproduzitzen du.'),

    heading('Euskal izenak, gaztelaniazko abizenak'),
    text(
      'Zerrenda horietan ez datorrela ongi dirudien xehetasun bat dago. 2008ko hamar izen errepikatuenen artean, zortzik euskal forma dute: Ane, Jon, Iñigo, Leire, Ander, Mikel, Asier eta Iker. 2026an oraindik bost dira: Ane, Jon, Maddi, Nahia eta Markel. Gehien errepikatzen diren hamar abizenen artean, aldiz, ez dago euskal jatorriko bat bera ere, ez 2008an ez 2026an.'
    ),
    text(
      'Nola hereda ditzake euskal izenez betetako hiri batek gaztelaniazko abizenak? Erantzuna debeku batekin hasten da. 1938ko maiatzaren 18an, Francoren Gobernuko Justizia Ministerioaren agindu batek xedatu zuen «espainiarrei dagokienez, izenak gaztelaniaz jaso beharko direla». Hitzaurreak berariaz aipatzen zituen Iñaki, Kepa eta Koldobika, «zalantzarik gabeko esanahi separatista salatzen duten» izen gisa.'
    ),
    text(
      'Garaiko erregistroek efektua erakusten dute. Gorrotxategi Nietoren azterketaren arabera (Euskaltzaindiaren Onomastika Zerbitzukoa), 1937an Bilboko Zazpi Kaleetan jaiotakoen ia laurdenak euskarazko izena zuen; urte hartako uztailetik aurrera, egileak ez zuen euskal izen baten inskripziorik aurkitu. Jasotzen dituen estrategien artean, neskato bat María Teresa gisa inskribatzea dago, etxean Maite deitzeko.'
    ),
    text(
      'Dena aldatu zen urtarrilaren 4ko 17/1977 Legearekin, izenak «Espainiako hizkuntzaren batean» jasotzeko aukera eman zuena, eta hura garatu zuen erregelamenduarekin, urte hartako abenduan onartua. Eustatek emaitza ikusten du jaiotzei buruzko estatistiketan: 1979 eta 1993 artean jaiotako gurasoen artean, euskarazko izenak ziren nagusi, eta 1982 eta 1995 artean jaiotako amen hamar izen ohikoenetatik zortzi ere bai. Euskara debekatutako izen izatetik gogokoenetako bat izatera igaro zen.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Baina historia ez da lerro zuzena. Edizio bakoitzeko hogeita hamar izen errepikatuenen artean, euskal formakoak ${f.int(figures.basqueTop30.y2008)} izan ziren 2008an, ${f.int(figures.basqueTop30.peakLow)} edo ${f.int(figures.basqueTop30.peakHigh)}ra igo ziren 2013 eta 2019 artean, eta urtero jaitsi dira ordutik ${f.int(figures.basqueTop30.y2026)}ra 2026an. 2019tik aurrerako beheraldia probatu ditugun irizpide guztiekin ageri da, zorrotzagoak nahiz zabalagoak. Irizpidearen arabera aldatzen dena 2008rekiko alderaketa da: nola zenbatzen den, 2026 urte hartako mailatik lau puntu inguru gorago edo hamabost puntu beherago geratzen da. Euskal izenak oso presente jarraitzen dute, baina 2019tik terrenoa galtzen ari dira Top 30ean.`,
    },

    heading('Abizenak nondik datozen'),
    text(
      'Abizenek beste istorio bat kontatzen dute, ez baitiote une bakoitzeko gustuari erantzuten, nor iritsi zen eta nor geratu zen baizik. Valentín de Foronda Historia Sozialaren Institutuak (UPV/EHU) Euskadira egindako barne-migrazioak «XX. mendean ezohiko garrantzia izan zuen fenomeno bat» bezala deskribatzen ditu. Gipuzkoan, Fundación Ramón Rubialentzat Castells, Hernando, Izaola, Juaristi, López Romo eta Zuberok sinatutako ikerketak, 2018an argitaratua eta EFEk jasoa, biztanleria 1950ean 374.000 inguru eta 1970ean 631.000 ingurukoa dela ezartzen du.'
    ),
    text(
      'Lan horren arabera, Gipuzkoako egungo biztanleriaren erdiaren inguruk Euskaditik kanpo dauka jatorria. Iritsi zirenen artean, 1986ko erroldaren arabera gehienak Gaztela eta Leonetik zetozen (%35), ondoren Extremadura (ia %19), Nafarroa, Galizia eta Andaluzia.'
    ),
    text(
      'Pertsona horiek kokatu ziren, familiak osatu zituzten eta abizenak transmititu zituzten. Euskal abizenak badaude, baina INEren Gipuzkoako zerrendan agertzen den lehena Larrañaga da, 13. postuan, eta haren ondoren Garmendia. Eta nahastura ohikoa da: 1998ko errolda baten azterketak, Monterok 2015ean aipatua, kalkulatzen zuen Euskadin lau biztanletik batek euskal abizen bat eta euskalduna ez zen beste abizen bat konbinatzen zituela, eta erdia baino zerbait gehiagok ez zuela euskal abizenik batere.'
    ),
    text(
      'Jakinekoaz harago ez joatea komeni da. Danborradako datuek ez dute esaten familia bakoitza nondik datorren, eta gaztelaniazko abizen batek ez du berez frogatzen duela gutxi iritsi denik: hemen askoz lehenago kokatua izan zitekeen. Badakigu, ordea, XX. mendeko Euskadik abizen horiek zituzten pertsona ugari hartu zituela, eta abizenak, izenak ez bezala, ez direla moda guztiekin berritzen: oinordetzan jasotzen dira.'
    ),

    heading('Familia bat, bi bide'),
    text(
      'Neu naiz adibide bat. Julen Ramos Arruti naiz. Ramos aitarengandik iritsi zitzaidan, eta hark bere aitarengandik jaso zuen: nire aitona Segovian jaio zen eta Tolosara etorri zen bizimodu hobe baten bila, eta aurkitu zuen. Aitaren aldeko amona beti izan zen Tolosakoa.'
    ),
    text(
      'Arruti amaren familiatik dator. Nire amona Igantzikoa zen eta nire aitona, Gernikakoa, Donostiara iritsi zen Gernikako bonbardaketaren ondoren, 1937ko apirilaren 26an. Gaur egun nire ahaide hurbil ia guztiak Donostian bizi dira, eta lehengusuak eta bigarren mailako osaba-izebak ditut Gernikan, Igantzin, Tolosan eta beste leku batzuetan.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Nire izenean eta abizenetan, beraz, bi ibilbide desberdin bizi dira elkarrekin: Euskadi kanpotik Gipuzkoara etorri zenarena eta Bizkaitik Donostiara joan zenarena. Julen euskal formako izena da, ${f.int(figures.given.count2008)} aldiz agertzen dena 2008an eta ${f.int(figures.given.count2026)} 2026an; Ramos, ${f.int(figures.surname.count2008)} aldiz 2008an eta ${f.int(figures.surname.count2026)} 2026an, bi edizioetan pisu erlatibo bera. Ez da ezeren froga: kasu bakar batek ez du joera bat frogatzen. Baina joera ulertzen laguntzen du.`,
    },

    heading('Pasatzen diren izenak, gelditzen diren abizenak'),
    text(
      'Urtez urte ordenatuta, Haurren Danborradako izenek eta abizenek bi erritmo desberdin erakusten dituzte.'
    ),
    text(
      'Izenek gustuak aldatzen dituen hiri bat kontatzen dute, hamarkada luzeen debekuaren ondoren euskarazko izenak berreskuratzen dituena. Abizenek Donostiara toki askotatik iritsi ziren familien aztarnak gordetzen dituzte, eta ordurako hemen zeudenenak ere bai.'
    ),
    text(
      'Gaur desfilatzen duen haur bakoitzak bere garairako pentsatutako izena jaso zuen, eta aurreko belaunaldietatik zetorren abizena.'
    ),
    highlight(
      'Izenak aldatzen dira belaunaldi bakoitzak aukeratzen duelako. Abizenak geratzen dira oinordetzan jasotzen direlako.'
    ),
    text(
      'Eta Haurren Danborradaren edizio bakoitzak desfile berean biltzen ditu berriro.'
    ),
  ],
  data: {
    heading: 'Istorioa datuetan',
    names: {
      lede: '**Ane eta Jon bakarrik daude oraindik izenen Top 10ean.** Haurren Danborradako hamar izen errepikatuenak 2008an eta 2026an.',
      label2008: '2008',
      label2026: '2026',
    },
    overlap: {
      lede: '**Izenak 2008ko Top 10etik urruntzen dira; abizenak ia ez dira mugitzen.** Edizio bakoitzeko lehen hamarretatik zenbat zeuden 2008ko lehen hamarretan (2009, 2010 eta 2021eko daturik ez dago).',
      namesLabel: 'Izenak',
      surnamesLabel: 'Abizenak',
    },
    surnames: {
      lede: '**Hamar abizen errepikatuenak berak dira Danborradan eta Gipuzkoan.** Abizen bakoitzaren postua Haurren Danborradan (2008 eta 2026) eta Gipuzkoako egoiliarren artean (INE, 2025).',
      surnameColumn: 'Abizena',
      tamborrada2008Column: 'Danborrada 2008',
      tamborrada2026Column: 'Danborrada 2026',
      gipuzkoaColumn: 'Gipuzkoa (INE, 2025)',
    },
    perThousand: {
      lede: (f) =>
        `**Nora mila izeneko ${f.int(perThousand.nora[0])}tik ${f.int(perThousand.nora[perThousand.nora.length - 1])}era igaro zen; María, ${f.int(perThousand.maria[0])}etik ${f.int(perThousand.maria[perThousand.maria.length - 1])}era.** Edizio bakoitzean erregistratutako mila izenetako agerraldiak (2009, 2010 eta 2021eko daturik ez dago).`,
      noraLabel: 'Nora',
      telmoLabel: 'Telmo',
      mariaLabel: 'María',
      aneLabel: 'Ane',
    },
    compare: {
      lede: '**Euskal izenak gogokoenen artean, gaztelaniazko abizenak buruan.**',
      leftLabel: 'Euskal formako izenak Top 10ean',
      rightLabel: 'Euskal jatorriko abizenak Top 10ean',
      value: (early, recent) => `10etik ${early} 2008an · 10etik ${recent} 2026an`,
    },
    basque: {
      lede: '**Euskal formako izenek behera egiten dute 2019tik.** Edizio bakoitzeko hogeita hamar izen errepikatuenen agerraldien zer zati den euskal formako izenena, hiru irizpiderekin (2009, 2010 eta 2021eko daturik ez dago).',
      strictLabel: 'Irizpide zorrotza',
      restrictiveLabel: 'Murriztailea',
      broadLabel: 'Zabala',
      chipsCaption: 'Euskal formakotzat zenbatu ditugun izenak (irizpide zorrotza)',
    },
  },
  used: {
    heading: 'Erabilitako datuak',
    blocks: [
      (f) =>
        `**Zer datu.** Tamborradataren argitaratutako estatistikak Haurren Danborradaren ${f.int(figures.editions)} edizioz: 2008, 2011tik 2020ra eta 2022tik 2026ra (ez dago 2009ko, 2010eko eta 2021eko daturik). Kontsulta 2026ko azaroaren 9koa da, 2026ko urriaren 18an argitaratutako bertsioen gainean.`,
      () =>
        '**Zer zenbatzen duen zifra bakoitzak.** Parte-hartzeak zenbatzen dira, ez pertsonak: urte batzuetan desfilatzen duena hainbat aldiz agertzen da. Abizenetan lehena eta bigarrena zenbatzen dira, horregatik izenak baino gehiago batzen dute. «Milako» edizio horretan erregistratutako mila izeneko agerraldiak dira. Datuek ez dute azentu-markarik ez eñerik (adibidez, «Inigo») eta abizen baten grafia bakoitza abizen desberdintzat hartzen da (adibidez, Etxeberria eta Echeverria).',
      () =>
        '**Zer da euskal formako izen bat.** Sailkapen propioa da, datu-baseak ez baitu jasotzen, edizio bakoitzeko hogeita hamar izen errepikatuenen gainean. Irizpide zorrotzak berezko forma euskalduna duten izenak zenbatzen ditu; murriztaileak Nerea, Ainhoa, Iñigo, Aitor, Ander eta Alain uzten ditu kanpoan; zabalak Nora, June, Aitana, Alain, Laia, Luka eta Telmo gehitzen ditu. 2019tik aurrerako beheraldia hiruretan ageri da; 2008rekiko alderaketa, ez.',
      () =>
        '**Mugak.** Datuek ez dute esaten familia bakoitza nondik datorren, ezta izen bat zergatik aukeratzen den ere. 2011ko, 2012ko eta 2022ko edizioak txikiagoak dira (2.800 eta 3.300 parte-hartzaile artean) eta haien alderaketak ez dira hain egonkorrak. INEk lehen abizena bakarrik zenbatzen du, eta 1998ko erroldaren zifra Euskadi osokoa eta bigarren eskukoa da.',
      (f) =>
        `**Pribatutasuna.** Agregatuak bakarrik argitaratzen dira; ez dago 5 baino txikiagoko zifrarik (agertzen den txikiena ${f.int(figures.smallestFigure)} da).`,
    ],
    sourcesLead:
      '**Egiaztatutako kanpoko iturriak.** Tituluak jatorrizko hizkuntzan daude; testuko aipuak geuk itzuliak dira.',
    sourceNotes: {
      castells: 'Zifrak EFEk/Noticias de Gipuzkoak 2018-10-23an jaso zituen bezala.',
      montero: '1998ko erroldaren azterlan bat aipatzen du (Euskadi osokoa, bigarren eskukoa).',
    },
  },
};

const texts: ArticleTexts = {
  title: 'Donostiak izenak aldatzen ditu, baina abizenak gordetzen ditu',
  description:
    '2008ko Haurren Danborradako hamar izen errepikatuenetatik bi baino ez daude 2026ko Top 10ean, eta hamar abizen nagusiak berak dira: moden, debekuen eta migrazioen istorio bat.',
  category: 'Izenak eta abizenak',
  readTime: '11 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import {
  arrivals,
  coreShareOfAll,
  currentTopTwentyShare,
  figures,
  nameCounts,
  namedParticipants,
  noraHistory,
  noraShare,
  oldTopTwentyShare,
  pairDropPercent,
  sampledIncrease,
  sampledIncreasePercent,
  singleEditionShareOfNames,
  topTenShare,
  topTenStaying,
} from './figures';

const [martina, noa, laia, luka, leo] = arrivals;

const copy: ArticleCopy = {
  intro: {
    lead: 'Urtez urte, zailagoa da Haurren Danborradan zure izen bera duen beste parte-hartzailerik aurkitzea. Betiko izenak ez dira desagertu: aldatu dena da orain askoz izen gehiagoren artean banatzen direla.',
    moreNames:
      'Arrazoirik sinpleena da izen desberdin gehiago daudela. Parte-hartzaileak aukera gehiagoren artean banatzen direnean, zailagoa da haietako batzuek izen bera izatea, eta hori gertatzen da zerrendek tamaina berdina izan arren.',
    topWeighs:
      'Beste arrazoia zerrendaren gailurrean dago. Edizio bakoitzeko izen errepikatuenak parte-hartzaileen zati txikiagoa biltzen du gaur, gure datuen hasieran baino, eta gauza bera gertatzen da zerrenda gidatzen duten izenen multzoarekin. Izenik ezagunena izatea badago oraindik, baina ez du lehen bezala esan nahi: izen bakoitzaren atzean haur gutxiago daude.',
    classics:
      'Gainera, klasikoek pisua galtzen dute eta inork ez du erabat haien lekua betetzen. Lehen ohikoenak ziren izen batzuk askoz gutxiagotan agertzen dira gaur, eta gora egiten dutenek ez dituzte haiek bezainbeste haur biltzen.',
    newNames:
      'Eta urtero izen berriak sartzen dira. Parte-hartzaileen zati gero eta handiago batek aurretik zerrendetan agertzen ez zen izena dauka, eta izen berri bakoitzak besteek lehen zituzten haurren zati bat hartzen du.',
    stable:
      'Hori guztia oso egonkorra den gailur batekin batera gertatzen da. Izen gutxi batzuk goian mantentzen dira edizioz edizio, eta aldaketa ez da iraultza, mugimendu geldo eta etengabea baizik. Horregatik, zaila da urtez urte nabaritzea, eta argi ikusten da denboran zehar alderatuta.',
    summaryLabel: 'Laburbilduz',
    summary:
      'Besteek bezala deitzea posible da oraindik, baina urtero pixka bat gutxiago: izen gehiago daude, ezagunenek pisu txikiagoa dute eta klasikoak lausotzen ari dira. Jarraian dago froga, Haurren Danborradako datuekin.',
  },
  data: {
    heading: 'Zer datu erabili ditugu',
    coverage: (f) =>
      `Hemen ${f.int(figures.editionCount)} edizioko zerrendak erabili ditugu, ${figures.firstEdition}tik ${figures.lastEdition}ra; 2009an, 2010ean eta 2021ean ez dago daturik. Guztira, izena identifikatuta duten ${f.int(figures.namedParticipations)} parte-hartze dira. Parte-hartzaile bakoitzaren lehen izena bakarrik kontatzen dugu: Jon Ander Jon gisa kontatzen da.`,
    caveats: () =>
      'Bi ohar garrantzitsu. Parte-hartzeak kontatzen ditugu, ez pertsonak: urte batzuetan desfilatzen duen haur bat edizio guztietan agertzen da, eta azken edizioetan zerrendaren erdia inguru aurrekoan ere bazegoen. Gainera, zerrenda bakoitza adin desberdinetako haurren argazkia da; beraz, edizioak alderatzeak argazki hori nola aldatzen den ikusteko balio du, ez belaunaldi jakin bat jarraitzeko.',
    partial: (f) =>
      `2012ko eta 2022ko zerrendek ${f.int(figures.partialEditionSchools)} ikastetxe inguru biltzen dituzte, gainerakoetan ${f.int(figures.regularEditionSchoolsMin)} edo gehiago dauden bitartean. Zenbaketa orokorretan erabiltzen ditugu, baina ez dira agertzen bilakaeraren grafikoetan, gainerakoekin ez baitira alderagarriak. 2009, 2010 eta 2021 ere ez dira agertzen, daturik ez dagoelako.`,
  },
  concentration: {
    heading: 'Izena partekatzea gero eta zailagoa da',
    question: () =>
      'Izenak zenbat errepikatzen diren neurtzeko modu errazena da edizio bereko bi parte-hartzaile ausaz aukeratzea eta izen bera duten galdetzea.',
    pairValue: (f, oneIn) => `${f.int(oneIn)} bikotetik 1`,
    pairDescription: 'izen bera duten parte-hartzaileen bikoteak',
    pairCaption:
      'Edizio bereko ausaz aukeratutako bi parte-hartzailek lehen izen bera izateko probabilitatea.',
    conclusion: (f) =>
      `Beste modu batean esanda, gaur egun beste parte-hartzaile batekin izen bera izateko probabilitatea ${f.percent(pairDropPercent, 0)} txikiagoa da ${figures.firstEdition}an baino. Jarraian azaltzen da zergatik.`,
  },
  variety: {
    heading: 'Izen gehiago daude artean banatzeko',
    trap: (f) =>
      `Nahikoa izan liteke izen desberdinak kontatzea: ${f.int(figures.distinct2008)} izan ziren ${figures.firstEdition}an eta ${f.int(figures.distinct2026)} ${figures.lastEdition}an. Baina alderaketa hori bidegabea da. ${figures.lastEdition}an parte-hartzaile gehiago izan ziren (${f.int(namedParticipants[2026])}, eta ${figures.firstEdition}an ${f.int(namedParticipants[2008])}), eta zenbat eta parte-hartzaile gehiago izan, orduan eta izen desberdin gehiago agertzen dira, gustuak aldatzen ez badira ere.`,
    sample: (f) =>
      `Edizioak baldintza berdinetan alderatzeko zozketa bat egin dugu. Edizio bakoitzetik ${f.int(figures.sampleSize)} parte-hartzaile aukeratu ditugu ausaz, hau da, zerrenda txikienaren tamaina; zozketa ${f.int(figures.sampleDraws)} aldiz errepikatu dugu eta batez bestekoa hartu dugu. Neurri horrekin, ${figures.firstEdition}an ${f.int(figures.sampledDistinct2008)} izen desberdin inguru agertzen dira eta ${figures.lastEdition}an ${f.int(figures.sampledDistinct2026)} inguru: ${f.int(sampledIncrease)} gehiago (igoera: % ${f.int(sampledIncreasePercent)}).`,
    chartLabel: 'Espero daitezkeen izen desberdinak',
    chartCaption: (f) =>
      `Edizio bakoitzeko ${f.int(figures.sampleSize)} parte-hartzaileko zozketa batean espero daitezkeen izen desberdinak (${f.int(figures.sampleDraws)} zozketaren batez bestekoa).`,
    panel: (f) =>
      `Emaitza ez dago neurtzeko moduaren mende. Edizio oso guztietan (${f.int(figures.completeEditionCount)}) agertzen diren ${f.int(figures.panelSchools)} ikastetxeak soilik hartzen badira kontuan, igoerak bere horretan dirau: 2023tik ${figures.lastEdition}ra, ia parte-hartzaile kopuru berdinarekin (urtero ${f.int(figures.panelMinParticipants)} eta ${f.int(figures.panelMaxParticipants)} artean), izen desberdinen kopurua ${f.int(figures.panelDistinct2023)} zen 2023an eta ${f.int(figures.panelDistinct2026)} da ${figures.lastEdition}an.`,
    conclusion:
      'Hau da: izen gehiago daude artean banatzeko, eta aniztasun hori ez dago zerrenden tamainaren mende.',
  },
  top: {
    heading: 'Izenik ezagunenek pisu txikiagoa dute',
    lead: (f) =>
      `Lehenik eta behin, gailurra aldatzen da. ${figures.firstEdition}ko hamar izen errepikatuenek parte-hartzaileen ${f.percent(topTenShare[2008])} biltzen zuten; ${figures.lastEdition}an, ${f.percent(topTenShare[2026])}. Izen ezagun bakoitzaren atzean haur gutxiago daude.`,
    chartLabel: 'Hamar izen errepikatuenak',
    chartCaption:
      'Edizio bakoitzeko parte-hartzaileen ehunekoa, edizio horretako hamar izen errepikatuenetako bat dutenena.',
    paradoxLabel: 'Paradoxa',
    paradox: (f) =>
      `Izen errepikatuena izateak gero eta gutxiago esan nahi du: ${figures.lastEdition}an Nora izenak parte-hartzaileen **${f.percent(figures.leaderShare2026)}** biltzen ditu; ${figures.firstEdition}an buru zen Anek, berriz, **${f.percent(figures.leaderShare2008)}** biltzen zituen.`,
  },
  classics: {
    heading: 'Klasikoek pisua galtzen dute',
    fading: (f) =>
      `${figures.firstEdition}ko hogei izen errepikatuenek (tartean Ane, Jon, Iñigo, Leire, María, Ander, Mikel eta Asier) parte-hartzaileen ${f.percent(oldTopTwentyShare[2008])} biltzen zuten. ${figures.lastEdition}an, hogei izen horiek berak ${f.percent(oldTopTwentyShare[2026])} biltzen dute.`,
    oldLabel: '2008ko hogei izen errepikatuenak',
    currentLabel: '2026ko hogei izen errepikatuenak',
    chartCaption:
      'Edizio bakoitzeko parte-hartzaileen ehunekoa, 2008ko eta 2026ko hogei izen errepikatuenetako bat dutenena (multzo bakoitza bereizita).',
    spread: (f) =>
      `${figures.lastEdition}ko hogei gogokoenek (Nora, Ane, Jon, Sara, Maddi, Telmo, June…) ${f.percent(currentTopTwentyShare[2026])} osatzen dute: ${figures.firstEdition}ekoek baino gutxiago.`,
    individual: (f) =>
      `Kasu zehatzek erakusten dute. María izenak ${figures.firstEdition}an ${f.int(nameCounts.maria[2008])} parte-hartzaile zituen (${f.int(figures.mariaPosition2008)}. postuan) eta ${figures.lastEdition}an ${f.int(nameCounts.maria[2026])} (${f.int(figures.mariaPosition2026)}. postuan). Leire izenak, ${figures.firstEdition}an ${f.int(nameCounts.leire[2008])} eta ${figures.lastEdition}an ${f.int(nameCounts.leire[2026])}. Iñaki izenak, ${figures.firstEdition}an ${f.int(nameCounts.inaki[2008])} eta ${figures.lastEdition}an ${f.int(nameCounts.inaki[2026])}. Aldi berean, beste batzuk gora egiten dute: Martina eta Laia dagoeneko guztiak gainditzen dituzte.`,
    trajectoriesCaption: 'Izen bakoitza duten parte-hartzaileak, edizioko mila parte-hartzaileko.',
    conclusion:
      'Klasikoek haurrak galtzen dituzte beste izen batzuek irabazten dutenean, baina gora egiten duten izenetako batek ere ez du klasikoek lehen bildu zutena biltzen. Horregatik da banaketa gero eta zabalagoa.',
  },
  arrivals: {
    heading: 'Urtero izen berri gehiago iristen dira',
    intro: (f) =>
      `Duela hamarkada bat ia agertzen ez ziren izenak daude. 2013an Martina izeneko ${f.int(martina.in2013)} parte-hartzaile zegoen; ${figures.lastEdition}an, ${f.int(martina.in2026)}. Lukaren kasuan, 2013an ${f.int(luka.in2013)} eta ${figures.lastEdition}an ${f.int(luka.in2026)}; Laiarenean, ${f.int(laia.in2013)} eta ${f.int(laia.in2026)}; Noarenean, ${f.int(noa.in2013)} eta ${f.int(noa.in2026)}. Leo ez zegoen 2013ko parte-hartzaileen artean; ${figures.lastEdition}an ${f.int(leo.in2026)} dira.`,
    nameColumn: 'Izena',
    tableCaption: (f) =>
      `Izen bakoitza duten parte-hartzaileak 2013ko eta 2026ko edizioetan; haietan izena identifikatuta duten ${f.int(namedParticipants[2013])} eta ${f.int(namedParticipants[2026])} parte-hartzaile daude, hurrenez hurren.`,
    renewal: (f) =>
      `Berrikuntza multzo osoan nabaritzen da. ${figures.lastEdition}ko ${f.int(namedParticipants[2026])} parte-hartzaileen artean, ${f.int(figures.unseenParticipants2026)} dira ${figures.firstEdition}tik 2016ra bitarteko edizioetako batean ere agertzen ez den izena dutenak: hamarretik bat. 2017an, ehunekoa ${f.percent(figures.unseenShare2017)} zen.`,
    waffleLabel:
      '2026ko parte-hartzaileen hamarretik batek 2008 eta 2016 artean agertzen ez zen izena du',
    waffleCaption: (f) =>
      `${f.int(namedParticipants[2026])} parte-hartzaileren artean ${f.int(figures.unseenParticipants2026)} (${f.percent(figures.unseenShare2026, 2)}). 2009an eta 2010ean ez dago daturik; beraz, izen horietako batzuk urte horietan agertuko ziren agian.`,
    conclusion:
      'Zerrendetan sartzen den izen berri bakoitzak besteek lehen zituzten haurren zati bat hartzen du. Horregatik, gailurra ia mugitzen ez bada ere, izen bakoitzak parte-hartzaile gutxiago biltzen ditu.',
  },
  repertoire: {
    heading: 'Oinarri komuna estutzen ari da',
    core: (f) =>
      `Zerrendetan agertu diren izen guztien artean, ${f.int(figures.editionCount)} edizio guztietan egon diren ${f.int(figures.coreNames)} izen daude: betiko izenak dira, Danborradaren oinarri komuna. Guztiek batera parte-hartze guztien ${f.percent(coreShareOfAll)} biltzen dute. Baina urtero parte-hartzaile gutxiago biltzen dituzte: ${figures.firstEdition}an ${f.percent(figures.coreShare2008)} ziren; ${figures.lastEdition}an, ${f.percent(figures.coreShare2026)}.`,
    chartLabel: 'Betiko izenetako bat duten parte-hartzaileak',
    chartCaption: (f) =>
      `Edizio bakoitzeko parte-hartzaileen ehunekoa, ${f.int(figures.editionCount)} edizio guztietan agertu diren ${f.int(figures.coreNames)} izenetako bat dutenena.`,
    tail: (f) =>
      `Beste muturrean, ${f.int(figures.singleEditionNames)} izen, izen desberdin guztien herena baino gehiago (${f.percent(singleEditionShareOfNames, 0)}), edizio batean bakarrik agertu dira.`,
    conclusion:
      'Oinarri komuna gehiengoa izaten jarraitzen du, baina gero eta haur gutxiago biltzen ditu: gero eta gehiagok daukate izen ez-ohikoak.',
  },
  staying: {
    heading: 'Gailurra poliki aldatzen da',
    top: (f) =>
      `Hainbeste aldaketaren erdian, badira inoiz gailurretik jaitsi ez diren izenak. Ane eta Jon bost izen errepikatuenen artean egon dira ${f.int(figures.editionCount)} edizio guztietan. Ander, berriz, lehen hamarren artean egon da horietako ${f.int(topTenStaying[2].editions)} ediziotan.`,
    chipsCaption: (f) =>
      `${f.int(figures.editionCount)} ediziotatik zenbatetan egon den izen bakoitza hamar izen errepikatuenen artean.`,
    overlap: (f) =>
      `Egonkortasun horrek azaltzen du zergatik aldatzen den gailurra poliki: edizio batetik hurrengora, hamar izen errepikatuenetatik ${f.int(figures.topTenOverlapMin)} eta ${f.int(figures.topTenOverlapMax)} artean top 10ean geratzen dira.`,
  },
  nora: {
    heading: 'Nora: gailurreko erreleboa',
    opening: (f) =>
      `Nora da erreleboaren adibiderik onena. ${figures.firstEdition}an, izena identifikatuta zuten ${f.int(namedParticipants[2008])} parte-hartzaileren artean, ${f.int(figures.noraCount2008)} baino ez ziren **Nora** deitzen: zerrendako ${f.int(figures.noraPosition2008)}. postuan zegoen. ${figures.lastEdition}an izen errepikatuena da: *${f.int(namedParticipants[2026])} parte-hartzaileren artean ${f.int(figures.noraCount2026)}*.`,
    chartCaption: (f) =>
      `Edizio bakoitzeko parte-hartzaileen zer ehuneko deitzen den Nora, Ane edo Jon. Noraren ehunekoa: ${figures.firstEdition}an ${f.percent(noraShare[2008], 2)}, ${figures.lastEdition}an ${f.percent(noraShare[2026], 2)}.`,
    rise: (f) =>
      `Haren igoera erreala da, baina nabardurak ditu. 2013an ${f.int(noraHistory[2].position)}. postuan zegoen, 2016an ${f.int(noraHistory[3].position)}. postuan eta 2020an ${f.int(noraHistory[4].position)}. postuan. 2022ko zerrenda ere gidatu zuen, baina edizio hori osatu gabe dago eta ez dugu froga gisa hartzen.`,
    editionColumn: 'Edizioa',
    participantsColumn: 'Parte-hartzaileak',
    shareColumn: 'Edizioaren %',
    positionColumn: 'Postua',
    tableCaption:
      'Nora izeneko parte-hartzaileak, edizioarekiko ehunekoa eta izen errepikatuenen zerrendako postua.',
    nuance: (f) =>
      `Edizio osoetan, Nora bigarrena izan zen 2020an, 2023an eta 2024an, beti Aneren atzetik, eta lehena 2025ean eta ${figures.lastEdition}an bakarrik: 2025ean ${f.int(figures.noraCount2025 - figures.aneCount2025)} parte-hartzaileko aldearekin (Nora ${f.int(figures.noraCount2025)}, Ane ${f.int(figures.aneCount2025)}) eta ${figures.lastEdition}an ${f.int(figures.noraCount2026 - figures.aneCount2026)} parte-hartzaileko aldearekin (Nora ${f.int(figures.noraCount2026)}, Ane ${f.int(figures.aneCount2026)}). 2020tik haren pisua ia ez da mugitu: parte-hartzaileen ${f.percent(figures.noraShareSince2020Min)} eta ${f.percent(figures.noraShareSince2020Max)} artean dago. Nora ez da gehiago hazten; goian egonkortu da.`,
    conclusion:
      'Buru nor den aldatzen da, baina ez buruak zenbat pisatzen duen: gaur zerrenda gidatzen duenak lehen gidatzen zuenak baino parte-hartzaileen zati txikiago bat biltzen du.',
  },
  limits: {
    heading: 'Datuek esaten dutena eta esaten ez dutena',
    shows: () =>
      `Datu hauei esker esan daiteke ${figures.firstEdition}tik ${figures.lastEdition}ra, parte-hartzaileen lehen izenak aniztasun handiagoz banatzen direla: tamaina berdinarekin, edizio bakoitzak izen desberdin gehiago biltzen ditu, eta errepikatuenek pisu txikiagoa dute.`,
    doesNot: () =>
      `Ez dute esaten zergatik. Zerrendek ez dute adinik ez jaiotze-urterik jasotzen; beraz, ezin dugu belaunaldiez hitz egin, ezta aldaketak inongo kausari egotzi ere. Ez dituzte izen beraren aldaerak bereizten (Xabier eta Javier, Iñaki eta Ignacio edo Ane eta Ana izen desberdintzat kontatzen dira), eta ${figures.firstEdition}ko eta 2011ko edizioak ez daude guztiz osatuta agian.`,
  },
  conclusion: {
    heading: 'Askoren artean aukeratu',
    summary: () =>
      'Haurren Danborradaren zerrendek erakusten dutena ez da betiko izenen desagerpena, banaketa desberdin bat baizik. Ane eta Jon bost errepikatuenen artean jarraitzen dute, eta edizio batetik hurrengora top 10 ia osoa mantentzen da. Baina haien inguruan gero eta izen gehiago agertzen dira, eta ezagunenek edizio bakoitzaren zati txikiago bat biltzen dute.',
    synthesis:
      'Hori da azken azalpena: izen gehiago, gutxiago pisatzen duten gailurrak, lausotzen ari diren klasikoak eta sartzeari uzten ez dioten berritasunak. Pieza horietako bakoitzak, txikia izanda ere, zure izena duen beste haur bat aurkitzeko probabilitatea murrizten du.',
    closing: 'Betiko izenak hor jarraitzen dute. Aldatu dena haien inguruan dagoen guztia da.',
  },
};

const texts: ArticleTexts = {
  title: 'Gero eta zailagoa da besteen izen bera izatea',
  description:
    'Haurren Danborradak betidanik ezagutzen ditugun izenak gordetzen ditu. Baina, edizioz edizio, askoz gehiagorentzat egiten du lekua.',
  category: 'Izenak',
  readTime: '8 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

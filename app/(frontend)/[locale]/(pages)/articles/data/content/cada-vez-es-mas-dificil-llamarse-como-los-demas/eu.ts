import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import type { Formatter } from './format';
import {
  derived,
  expectedDistinctNames,
  figures,
  pairOneIn,
  participants,
  sampleSize,
  topNames2008,
  topNames2026,
  topTenShare,
  topTenTotal,
  totalParticipations,
} from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = <T>(values: readonly T[]) => values[values.length - 1];
const noData = '(2009, 2010, 2012, 2021 eta 2022 gabe)';

// Basque writes the percent sign before the figure and attaches suffixes to the figure itself,
// so percentages are built here instead of using the shared formatter (which adds a space).
const pct = (f: Formatter, value: number, digits = 1) => `%${f.decimal(value, digits)}`;

const copy: ArticleCopy = {
  story: [
    text('Imajinatu bi eskola-patio, hemezortzi urteko tartearekin.'),
    {
      kind: 'text',
      text: (f) =>
        `Lehenengoan, 2008an, Haurren Danborradako 4.000 bat parte-hartzaile daude. Izenik ohikoena ${topNames2008[0].name} da, ${f.int(topNames2008[0].count)} aldiz errepikatzen dena. Bigarrena ${topNames2008[1].name} da: ${f.int(topNames2008[1].count)} parte-hartzaile.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Orain 2026ra joango gara. Haur gehiago daude, ia herena gehiago: 5.200 baino gehiago. Hala ere, gehien errepikatzen den izena, ${topNames2026[0].name}, ${f.int(topNames2026[0].count)} aldiz agertzen da, eta bigarrena, ${topNames2026[1].name}, ${f.int(topNames2026[1].count)} aldiz.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Eta ez da lehen bi izenekin bakarrik gertatzen. Sailkapenean behera jarraituz gero, lehen postutik hamargarrenera, ikusiko dugu hamar izen ezagunenetako bakoitzak 2008ko bere parekoak baino parte-hartzaile gutxiago biltzen dituela. Edizio hartako laugarrenak ${f.int(topNames2008[3].count)} zituen; 2026koak, ${f.int(topNames2026[3].count)}.`,
    },
    text(
      'Nola izan daiteke parte-hartzaile gehiago egotea, baina izen ezagunenak gutxiagotan errepikatzea?'
    ),
    text(
      'Erantzuna ia bi hamarkadatan zehar gertatzen ari den aldaketa batean dago, eta urte batetik bestera nabaritzea zaila da. Hura aurkitzeko, Tamborradatan argitaratutako hamasei edizioetako zerrendak arakatu ditugu, 2008tik 2026ra.'
    ),

    heading('Lehen hamarrak, postuz posturako'),
    {
      kind: 'text',
      text: (f) =>
        `2008ko hamar izen errepikatuenek ${f.int(topTenTotal.y2008)} parte-hartzaile batzen zituzten. 2026koek ${f.int(topTenTotal.y2026)} batzen dituzte, edizioak 1.200 parte-hartzaile baino gehiago dituen arren. Postuz posturako emaitza bera da: guztiek duela hemezortzi urteko parekoek baino gutxiago biltzen dituzte, apur bat goiko aldean eta nabarmen gehiago sailkapenaren erdialdean.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Proportzioetan, duela hemezortzi urte parte-hartzaile bostetik batek zeraman hamar izen horietako bat (${pct(f, topTenShare[0])}). Gaur zazpitik batek zeramatza (${pct(f, last(topTenShare))}).`,
    },
    highlight('Izenik ezagunena izaten jarraitzen da, baina horrek ez du lehen bezala esan nahi.'),

    heading('Non geratu dira gainerakoak?'),
    {
      kind: 'text',
      text: (f) =>
        `Parte-hartzaileak ez dira desagertu: haien izenak aukera askoz gehiagoren artean banatzen dira. 2008an ${f.int(figures.distinct2008)} izen desberdin erregistratu ziren; 2026an, ${f.int(figures.distinct2026)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Baina alderaketa hori bidegabea litzateke, zenbat eta parte-hartzaile gehiago, orduan eta izen desberdin gehiago agertzen baitira, gustuak aldatu ez arren. Edizioak baldintza berdinetan alderatzeko, edizio bakoitzetik ausaz ${f.int(sampleSize)} parte-hartzaile aukeratzean zenbat izen desberdin espero daitezkeen neurtu dugu; hori da zerrenda txikienaren tamaina. 2008an ${f.int(expectedDistinctNames[0])} inguru izango lirateke; 2026an, ${f.int(last(expectedDistinctNames))} inguru: ${pct(f, derived.expectedIncreasePercent, 0)} gehiago.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Ez dirudi, ezta ere, zein ikastetxek parte hartzen duten kontua soilik denik. Edizio oso guztietan egon diren ${f.int(figures.panelSchools)} ikastetxeetan ${f.int(figures.panel2023.participants)} parte-hartzaile zeuden 2023an eta ${f.int(figures.panel2026.participants)} 2026an: ia haur-kopuru bera. Haien izen desberdinak ${f.int(figures.panel2023.distinctNames)}tik ${f.int(figures.panel2026.distinctNames)}ra igaro ziren.`,
    },
    text(
      'Hainbeste izen artean banatzeko, izen bera izatea zailagoa da. Imajinatu edizio berberetik bi parte-hartzaile ausaz aukeratzen direla eta izen bera izateko probabilitatea zein den galdetzen dela.'
    ),
    {
      kind: 'highlight',
      text: (f) =>
        `2008an, parte-hartzaileen ${f.int(pairOneIn[0])} bikotetik batek lehen izen bera zuen; 2026an, ${f.int(last(pairOneIn))} bikotetik batek bakarrik.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Aldea bereziki nabaritzen da zerrendaren isatsean. Gaur parte-hartzaile lauren artean ia batek (${pct(f, figures.uncommon2026.share, 0)}) ohikoa ez den izena darama, edizioan bost parte-hartzaile ere ez dituen izena; 2008an bostetik batek (${pct(f, figures.uncommon2008.share, 0)}). Eta parte-hartzaile bakar batek daraman izenak ${f.int(figures.uncommon2008.singleBearerNames)}etik ${f.int(figures.uncommon2026.singleBearerNames)}ra igaro dira.`,
    },

    heading('Zer gertatu da lehengo gogokoenekin?'),
    {
      kind: 'text',
      text: (f) =>
        `Klasikoek parte-hartzaileak galtzen dituzte. María izenak ${f.int(figures.counts.maria.y2008)} parte-hartzaile zituen 2008an eta ${f.int(figures.counts.maria.y2026)} 2026an; Leirek, ${f.int(figures.counts.leire.y2008)} eta ${f.int(figures.counts.leire.y2026)}. Hor jarraitzen dute, baina ez daude jada gailurrean.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Aldi berean, 2008an ia entzuten ez ziren beste batzuk gora egiten ari dira. Martinak, Noak eta Laiak bost parte-hartzaile baino gutxiago zituzten bakoitzak 2008an; 2026an ${f.int(figures.counts.martina.y2026)}, ${f.int(figures.counts.noa.y2026)} eta ${f.int(figures.counts.laia.y2026)} dira. Baina inork ez ditu gainditzen María eta Leire lehen bosten artean zeudenean zituzten ${f.int(figures.counts.maria.y2008)} eta ${f.int(figures.counts.leire.y2008)} parte-hartzaileak. Ezagun izatea ez da jada izen gutxi batzuetan pilatzen: batetik bestera pasatzen da, eta gehiagoren artean banatzen da.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Gainera, urtero lehen ikusi gabeko izenak iristen dira. 2026an, parte-hartzaile hamarretik batek 2008 eta 2016 artean argitaratutako edizioetako batean ere agertzen ez zen izena darama. 2017an, ${pct(f, figures.unseen2017.share, 0)} baino zertxobait gehiago ziren.`,
    },

    heading('Bat-batean gertatu al da?'),
    // Q10: the Top 10 keeps between 7 and 9 names from one published edition to the next.
    text(
      'Ez. Edizioak banan-banan alderatzen baditugu, urrats txikiak ikusten dira. Edizio batetik bestera, hamar izen errepikatuenetatik zazpi eta bederatzi artean mantentzen dira, eta Ane eta Jon lehen bosten artean egon dira hamasei edizioetan.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Banaketa urteetan zehar zabaltzen joan da, gora-beherekin. Beste parte-hartzaile batekin izen bera izateko probabilitatea honela aldatu da: 2008an ${f.int(pairOneIn[0])} bikotetik 1, 2013an ${f.int(pairOneIn[2])} bikotetik 1, 2019an ${f.int(pairOneIn[8])} bikotetik 1 eta 2026an ${f.int(last(pairOneIn))} bikotetik 1. Edizio batzuetan atzera egin zuen, 2020an bezala. Gailurrarekin gauza bera gertatzen da: hamar izen nagusien pisuak modu irregularrean egin du behera, 2018koa eta 2020koa bezalako gorakadekin. Aldaketa txikiak dira, baina batuta multzoa eraldatzen dute.`,
    },

    heading('Bi patioetara itzulita'),
    {
      kind: 'text',
      text: (f) =>
        `Itzul gaitezen bi patioetara. 2008koan, ${f.int(derived.leaderOneIn2008)} parte-hartzaileetatik batek ${topNames2008[0].name} zuen izena, izen errepikatuena. 2026koan, izen errepikatuena, ${topNames2026[0].name}, ${f.int(derived.leaderOneIn2026)} parte-hartzaileetatik batek darama.`,
    },
    text('Ane eta Jon hor jarraitzen dute, lehen hiruren artean. Izen ezagunak ez dira desagertu.'),
    highlight(
      'Aldatu dena inguruan duten guztia da: ehunka izen gehiago, bakoitza haur gutxi batzuekin.'
    ),
    text(
      'Haurren Danborradak milaka parte-hartzaile biltzen jarraitzen du. Ez da jada hain probablea haien artean zure izen bera duen norbait aurkitzea.'
    ),
  ],
  data: {
    heading: 'Istorioa datuetan',
    ranking: {
      lede: (f) =>
        `**Hamar izen errepikatuenek parte-hartzaile gutxiago biltzen dituzte gaur 2008an baino, edizio handiago batean.** Sailkapeneko postu bakoitzeko parte-hartzaileak, izena identifikatuta duten ${f.int(participants.y2008)} parte-hartzaileko edizio batean (2008) eta ${f.int(participants.y2026)}koan (2026).`,
      seriesLabel2008: '2008',
      seriesLabel2026: '2026',
      columns: [
        'Postua',
        'Izena 2008',
        'Parte-hartzaileak 2008',
        'Izena 2026',
        'Parte-hartzaileak 2026',
        'Aldea',
      ],
      totalLabel: 'Guztira',
    },
    topTen: {
      lede: (f) =>
        `**Hamar izen errepikatuenek 2008an baino zati txikiagoa biltzen dute gaur: ${pct(f, topTenShare[0])}tik ${pct(f, last(topTenShare))}era.** Edizio bakoitzeko parte-hartzaileen ehunekoa, edizio horretako hamar izen errepikatuenetako bat dutenena ${noData}.`,
      seriesLabel: 'Parte-hartzaileen ehunekoa',
    },
    pairs: {
      lede: (f) =>
        `**Izen gehiagorekin zailagoa da izena partekatzea: 2008an ${f.int(pairOneIn[0])} bikotetik 1ek izen bera zuen; 2026an, ${f.int(last(pairOneIn))} bikotetik 1ek.** Edizio bereko bi parte-hartzaile ausaz aukeratuz gero, bikote horietatik batek lehen izen bera du ${noData}.`,
      seriesLabel: 'Bikote bakoitzeko…',
    },
    distinct: {
      lede: (f) =>
        `**Parte-hartzaile kopuru berarekin, gaur izen desberdin gehiago daude.** Edizio bakoitzeko ${f.int(sampleSize)} parte-hartzaile ausaz aukeratzean espero daitezkeen izen desberdinak ${noData}.`,
      seriesLabel: 'Espero daitezkeen izen desberdinak',
      compareCaption: (f) =>
        `Ikastetxe berberetan (${f.int(figures.panelSchools)}) eta ia haur-kopuru berarekin, ${f.int(derived.panelExtraNames)} izen gehiago daude.`,
      left: {
        value: (f) => `${f.int(figures.panel2023.distinctNames)} izen desberdin`,
        description: (f) =>
          `${f.int(figures.panelSchools)} ikastetxetako ${f.int(figures.panel2023.participants)} parte-hartzaile`,
      },
      right: {
        value: (f) => `${f.int(figures.panel2026.distinctNames)} izen desberdin`,
        description: (f) =>
          `${f.int(figures.panelSchools)} ikastetxe berberetako ${f.int(figures.panel2026.participants)} parte-hartzaile`,
      },
    },
    uncommon: {
      lede: () => '**Gaur 2008an baino parte-hartzaile gehiagok darama ohikoa ez den izena.**',
      left: {
        value: (f) => pct(f, figures.uncommon2008.share, 0),
        description: (f) =>
          `parte-hartzaileek bost parte-hartzaile baino gutxiagok duten izena daramate (${f.int(figures.uncommon2008.participants)}, guztira ${f.int(participants.y2008)} direnetik). ${f.int(figures.uncommon2008.singleBearerNames)} izen parte-hartzaile bakar batek darama.`,
      },
      right: {
        value: (f) => pct(f, figures.uncommon2026.share, 0),
        description: (f) =>
          `(${f.int(figures.uncommon2026.participants)}, guztira ${f.int(participants.y2026)} direnetik). ${f.int(figures.uncommon2026.singleBearerNames)} izen parte-hartzaile bakar batek darama.`,
      },
    },
    classics: {
      lede: () =>
        '**Mariak eta Leirek parte-hartzaileak galtzen dituzte; Martinak, Noak eta Laiak irabazi egiten dituzte.** Izen bakoitza duten parte-hartzaileak.',
      columns: ['Izena', '2008', '2026'],
      lessThanFive: 'bost baino gutxiago',
    },
    unseen: {
      lede: (f) =>
        `**2026ko parte-hartzaile hamarretik batek 2008 eta 2016 artean agertzen ez zen izena darama.** 2017an ${pct(f, figures.unseen2017.share)} ziren. 2009an eta 2010ean ez dago daturik: izen batzuk urte horietan agertuak izan daitezke.`,
      waffleLabel: (f) =>
        `${f.int(participants.y2026)} parte-hartzaileetatik ${f.int(figures.unseen2026.participants)} (${pct(f, figures.unseen2026.share)})`,
    },
  },
  used: {
    heading: 'Erabilitako datuak',
    blocks: [
      (f) =>
        `**Zer datu.** Tamborradatak argitaratutako estatistikak, Haurren Danborradaren ${f.int(figures.editions)} edizioari buruzkoak: 2008, 2011tik 2020ra eta 2022tik 2026ra (2009an, 2010ean eta 2021ean ez dago daturik). 2026ko azaroaren 9ko kontsulta, 2026ko urriaren 18an argitaratutako bertsioen gainean. Bilakaeraren grafikoek 14 edizio erabiltzen dituzte: 2012 eta 2022 ez dira sartzen, 25 ikastetxe inguru dituztelako, gainerakoetan 40 edo gehiago dauden bitartean. 2008ko eta 2011ko edizioak apur bat osatugabeak izan daitezke.`,
      (f) =>
        `**Zer zenbatzen duen zifra bakoitzak.** «Parte-hartzaileak» lehen izena zalantzarik gabe identifikatuta duten parte-hartzeak dira: ${f.int(participants.y2008)} 2008an eta ${f.int(participants.y2026)} 2026an, guztira ${f.int(totalParticipations.y2008)} eta ${f.int(totalParticipations.y2026)} parte-hartze direnetik (gainerakoak zenbatzen ez diren izen anbiguoak dira). Parte-hartzeak zenbatzen ditugu, ez pertsonak: urte batzuetan desfilatzen duen haur bat edizio bakoitzean agertzen da. Lehen izena bakarrik zenbatzen da (Jon Ander Jon gisa zenbatzen da), jatorrizko datuetan azenturik eta tildeik gabe, eta aldaerak (Xabier eta Javier, Ane eta Ana) izen desberdintzat zenbatzen dira.`,
      (f) =>
        `**Neurriak nola kalkulatzen diren.** Izena partekatzeko probabilitatea edizio bateko parte-hartzaile-bikoteen artean lehen izen bera dutenen proportzioa da. «Espero daitezkeen» izen desberdinak edizio bakoitzetik ausaz ${f.int(sampleSize)} parte-hartzaile aukeratzean ateratzen den batez besteko balioa dira (zerrenda txikienaren tamaina), zehatz kalkulatua. Panelak 12 edizio osoetan (2013tik 2020ra eta 2023tik 2026ra) parte-hartzaileak izan dituzten ${f.int(figures.panelSchools)} ikastetxeak biltzen ditu. «Ohikoak ez diren» izenak edizio horretan bost parte-hartzaile baino gutxik dituztenak dira.`,
      () =>
        '**Mugak.** Zerrendek ez dute adinik edo jaiotze-urterik jasotzen; ondorioz, aldaketak ezin zaizkio inongo kausari egotzi eta ezin da belaunaldiez hitz egin. Zerrenda bakoitza adin desberdinetako haurren argazkia da.',
      () =>
        '**Pribatutasuna.** Agregatuak bakarrik argitaratzen dira. Bost baino txikiagoak diren zifrak ez dira erakusten.',
    ],
  },
};

const texts: ArticleTexts = {
  title: 'Gero eta zailagoa da besteen izen bera izatea',
  description:
    'Parte-hartzaile gehiagorekin, Haurren Danborradako izen ezagunenak 2008an baino gutxiagotan errepikatzen dira: izen desberdin gehiago daude eta izen bera izatea arraroagoa da. Hemezortzi urtean banaketa nola aldatu den.',
  category: 'Izenak',
  readTime: '8 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

import type search from '../es/search';

export default {
  title: 'Parte-hartzaileak bilatu',
  metadata: {
    title: 'Bilatu Donostiako Haur Danborradako parte-hartzaileak',
    description:
      'Bilatu Donostiako Haur Danborradako parte-hartzaileak izenaren eta ikastetxearen arabera, eta jakin zein urtetan atera ziren. Edizioak: {startYear}-{endYear}.',
    descriptionFallback:
      'Bilatu Donostiako Haur Danborradako parte-hartzaileak izenaren eta ikastetxearen arabera, eta jakin zein urtetan atera ziren, jatorrizko iturrirako estekarekin.',
  },
  hero: {
    titleLine1: 'Bilatu parte-hartzailea',
    titleLine2: 'Haur <accent>Danborradan</accent>',
    description:
      'Idatzi izena eta bi abizenak, aukeratu ikastetxea eta jakin zein urtetan atera zen Donostiako Haur Danborradan. Urte bakoitzak bere jatorrizko iturrira darama.',
    about:
      'Bilatzaile honek Donostiako Haur Danborradako parte-hartzaileak biltzen ditu, danborrero eta kantinera txikien urteroko desfilea (ez da lehiaketa bat). Pertsona bat aukeratutako ikastetxean zein urtetan agertzen den erakusten du, eta urte bakoitzaren jatorrizko iturrira darama.',
  },
  form: {
    ariaLabel: 'Parte-hartzaileen bilatzailea',
    hint: 'Eremu guztiak derrigorrezkoak dira: idatzi gutxienez hiru hitz (izena eta bi abizenak) eta aukeratu ikastetxe bat.',
    name: {
      placeholder: 'Izena eta bi abizenak',
      ariaLabel: 'Izena eta bi abizenak',
    },
    school: {
      placeholder: 'Ikastetxea',
      ariaLabel: 'Ikastetxea',
      searchPlaceholder: 'Bilatu ikastetxea...',
      searchAriaLabel: 'Bilatu ikastetxea',
      empty: 'Ez dago bat datorren ikastetxerik',
      resultsCount:
        '{count, plural, =0 {Ez dago bat datorren ikastetxerik} one {Ikastetxe # aurkitu da} other {# ikastetxe aurkitu dira}}',
    },
    submit: 'Bilatu',
  },
  results: {
    title: 'Bilaketaren emaitzak',
    loading: 'Bilatzen…',
    announce:
      'Bilaketa osatu da: {records} erregistro bateragarri eta {participations} parte-hartze, “{participant}” izenarentzat, {school} ikastetxean.',
    summary: {
      records: '{count} erregistro bateragarri',
      participations: '{count} parte-hartze',
      query: '“{participant}” · {school}',
      clear: 'Garbitu bilaketa',
    },
    card: {
      exact: 'Bat-etortze zehatza',
      compatible: 'Bat-etortze bateragarria',
      count: '{count, plural, one {# parte-hartze · iturria} other {# parte-hartze · iturriak}}',
    },
    row: {
      viewSource: 'Ikusi iturria',
      viewSourceAriaLabel: 'Ikusi iturria ({year}, {host}), fitxa berri batean irekitzen da',
      noSource: 'Iturririk gabe',
    },
  },
  status: {
    prompt: {
      title: 'Idatzi izena, abizenak eta ikastetxea',
      description:
        'Idatzi izen osoa ezagutzen duzun bezala. Ez du erregistroarekin hitzez hitz bat etorri behar, eta azentuek ez dute axolarik. Gero, aukeratu ikastetxea.',
    },
    noResults: {
      title: 'Ez dugu bat-etortzerik aurkitu',
      description:
        'Ez dago izen horrekin bateragarria den erregistrorik ikastetxe honetan. Egiaztatu ondo idatzita dagoela edo saiatu beste ikastetxe batekin.',
    },
    error: {
      title: 'Ezin izan da bilaketa osatu',
      description: 'Errore bat gertatu da edo eskaerak gehiegi iraun du. Saiatu berriro.',
      retry: 'Saiatu berriro',
    },
  },
  overview: {
    title: 'Bilatzailean eskuragarri dauden datuak',
    summary:
      'Erregistratutako parte-hartzeak: <highlight>{editionsCount}</highlight> edizio eta <highlight>{schoolsCount}</highlight> ikastetxe desberdin. Bilatzailean aurki dezakezun guztia da.',
  },
  timeline: {
    ariaLabel: 'Edizioak: {startYear} - {endYear}',
    gapsCount: '{count} urte datu gabe',
    gapsCaption: 'Hutsuneak: {years}',
    missingYear: '{year}: datu gabe',
    missingRange: '{from}–{to}: datu gabe',
  },
  topStats: {
    name: 'Gehien errepikatutako izena',
    surname: 'Gehien errepikatutako abizena',
    school: 'Parte-hartzaile gehien dituen ikastetxea',
    count: '{count} parte-hartze',
  },
  structuredData: {
    home: 'Hasiera',
    keywords:
      'Haur Danborradako parte-hartzaileak bilatu, parte-hartzearen historia, Donostiako Haur Danborrada, danborrerok eta kantinerak, ikastetxeen araberako parte-hartzea, Diario Vasco',
    appName: 'Haur Danborradako parte-hartzaileen bilatzailea',
    appDescription:
      'Donostiako Haur Danborradako parte-hartzaileak izenaren eta ikastetxearen arabera bilatzeko eta zein urtetan atera ziren kontsultatzeko web tresna. Edizioak: {startYear}-{endYear}.',
  },
  faq: {
    kicker: 'Maiz egindako galderak',
    title: 'Maiz egindako galderak',
    items: {
      scope: {
        question: 'Zer kontsulta dezaket Haur Danborradaren bilatzailean?',
        answer:
          'Pertsona bat urteetan zehar Donostiako Haur Danborradaren zein edizioetan agertzen den egiaztatu dezakezu. Emaitza bakoitzak argitaratu zen moduko izena, ikastetxea, parte-hartze urteak eta parte-hartze hori zein iturritatik lortu zen erakusten duen esteka erakusten ditu.',
      },
      requirements: {
        question: 'Zer behar dut norbait bilatzeko?',
        answer:
          'Idatzi gutxienez hiru hitz (adibidez, izena eta bi abizenak) eta aukeratu ikastetxea. Letra larriek eta azentuek ez dute axolarik. Pertsonak bi izen baditu, bigarrena idatzi gabe utz dezakezu.',
      },
      whySchool: {
        question: 'Zergatik aukeratu behar dut ikastetxe bat?',
        answer:
          'Parte-hartzaileen artean izen eta abizen asko errepikatzen direlako, eta ikastetxeari esker pertsonak bereiz daitezkeelako. Bilaketa aukeratzen duzun ikastetxearen barruan soilik egiten da. Gainera, datuak babesteko, inork parte-hartzaileen bilaketa masiboak egin ez ditzan.',
      },
      matchTypes: {
        question: 'Zer esan nahi dute “bat-etortze zehatza” eta “bat-etortze bateragarria” esapideek?',
        answer:
          '“Zehatza” esan nahi du idatzi duzun izena erregistratutakoarekin hitzez hitz bat datorrela. “Bateragarria” esan nahi du idatzi duzuna datu gehiago edo gutxiago dituen erregistro batekin bat datorrela: adibidez, idatzi ez duzun bigarren izen batekin edo abizen bakarrarekin. Ezin dugu ziurtatu emaitza bateragarri bat pertsona bera denik, beraz, komeni da urtea eta iturria egiaztatzea.',
      },
      multipleResults: {
        question: 'Zergatik agertzen dira emaitza anitz bilaketa berarentzat?',
        answer:
          'Izen bat iturrietan agertzen den forma desberdin bakoitza emaitza bat da. Adibidez, pertsona bat urte batean bigarren izenarekin argitaratuta egon daiteke eta beste urte batean gabe, edo abizen bakarrarekin. Emaitza bakoitzaren barruan, izenaren forma hori agertzen den urte guztiak biltzen dira.',
      },
      years: {
        question: 'Zein urtetako datuak daude?',
        answer:
          '{editionsCount} edizioren datuak daude, {startYear} eta {endYear} artekoak.{hasGaps, select, yes { Ez dago daturik hauetan: {missingYears}.} other {}}',
      },
      sources: {
        question: 'Nondik datoz datuak eta ofizialak dira?',
        answer:
          'Izenak Diario Vascok Danborradako haur konpainiei eskaintzen dizkien orrietatik datoz; edizio zaharrenetarako, orri horien kopia artxibatuak irakurtzen dira Internet Archive-n. Ez da erregistro ofiziala: zerrendak bilagarri izateko prozesatzen dira eta akatsak izan ditzakete, bai iturrikoak bai tratamenduarenak. Horregatik, emaitza bakoitzak bere iturrira darama.',
      },
      notFound: {
        question: 'Zergatik ez da agertzen bilatzen ari naizen pertsona?',
        answer:
          'Arrazoi ohikoenak dira aukeratutako ikastetxea ez izatea zuzena, izena iturrian beste modu batera idatzita egotea edo datuak ez dauden edizio batean parte hartu izana. Gainera, erregistro kopuru oso txiki bat (% 1 baino gutxiago) ezin izan da izen eta abizenetan banatu eta ezin da aurkitu. Saiatu ikastetxea aldatzen, bigarren izena kentzen edo abizenaren beste aldaera bat idazten.',
      },
    },
  },
} satisfies typeof search;

import type landing from '../es/landing';

export default {
  title: 'Tamborradata',
  metadata: {
    title: 'Tamborradata',
    description:
      'Donostiako Haur Danborradaren artxibo historiko eta estatistikoa: parte-hartzeak, izenak eta ikastetxeak {startYear}tik {endYear}ra, eta parte-hartzaileen bilatzailea.',
    descriptionFallback:
      'Donostiako Haur Danborradaren artxibo historiko eta estatistikoa: edizio guztietako parte-hartzeak, izenak eta ikastetxeak, eta parte-hartzaileen bilatzailea.',
    keywords: 'Tamborradata, Haur Danborrada, Danborrada estatistikak, Danborrada datuak',
  },
  structuredData: {
    datasetName: 'Tamborradata: Haur Danborradaren datuak',
    datasetDescription:
      'Donostiako Haur Danborradaren estatistikak eta parte-hartzeak, {startYear}tik {endYear}ra: izenak, ikastetxeak eta urteko joerak.',
    datasetDescriptionFallback:
      'Donostiako Haur Danborradaren estatistikak eta parte-hartzeak: izenak, ikastetxeak eta urteko joerak.',
    distributionName: 'Haur Danborradaren estatistika globalen kontsulta',
    aboutStatistics: 'Danborradaren estatistikak',
    faqName: 'Tamborradataren inguruko ohiko galderak',
    faqDescription: 'Tamborradataren eta Haur Danborradaren datuen inguruko ohiko galderak.',
    pressName: 'Hedabideetan aipatua',
  },
  sections: {
    stats: 'Estatistikak',
    searchParticipants: 'Bilatzailea',
    press: 'Prentsa',
    openSource: 'Kode irekia',
    contact: 'Kontaktua',
    faq: 'Galderak',
  },
  common: {
    newTab: '(fitxa berri batean irekitzen da)',
  },
  hero: {
    phrases: {
      names: 'Danborrada, izenez izen.',
      data: 'Zifren bidez kontatutako tradizioa.',
      editions: 'Edizio bakoitzak bere aztarna uzten du.',
    },
    description:
      'Tamborradatak Donostiako Haur Danborradako parte-hartzaileen zerrendak biltzen ditu {startYear}tik aurrera, eta estatistika, ikastetxeen bilakaera eta edonor aurkitzeko bilatzaile bihurtzen ditu.',
    descriptionFallback:
      'Tamborradatak Donostiako Haur Danborradako edizio guztietako parte-hartzaileen zerrendak biltzen ditu, eta estatistika, ikastetxeen bilakaera eta edonor aurkitzeko bilatzaile bihurtzen ditu.',
    metrics: {
      participations: 'Parte-hartzeak',
      editions: 'Edizioak',
      schools: 'Ikastetxeak',
    },
    summary: {
      topName: 'Gehien errepikatutako izena {name}',
      topSurname: 'Abizena {surname}',
      topSchool: 'Ikastetxea {school}',
    },
  },
  stats: {
    title: '{startYear}tik gaur arte, edizioz edizio',
    titleFallback: 'Danborrada, edizioz edizio',
    description:
      'Estatistikak eskuragarri {startYear}tik {endYear}ra. Parte-hartzearen, ikastetxeen eta edizioen joerak. Edizio bakoitzean gehien errepikatutako izenak, abizenak eta ikastetxeak.',
    descriptionFallback:
      'Parte-hartzearen, ikastetxeen eta edizioen joerak. Edizio bakoitzean gehien errepikatutako izenak, abizenak eta ikastetxeak.',
    global: {
      label: 'Historikoa · {startYear}-{endYear}',
      summary: 'parte-hartze, {editions} edizio eta {schools} ikastetxetan banatuta.',
      note: 'Parte-hartze bat edizio bateko erregistro bat da: pertsona berak hainbat gehi ditzake.{hasGaps, select, yes { Oraindik ez dago honako hauen daturik: {missingYears}.} other {}}',
      cta: 'Ikusi historia osoa',
    },
    last: {
      label: 'Azken edizioa',
      summary: 'parte-hartze {schools} ikastetxetan.',
      growth: '{change} aurreko urtearekin alderatuta',
      cta: '{year}ko edizioa ikusi',
    },
    fallback: {
      global: {
        label: 'Historikoa',
        title: 'Danborrada, edizioz edizio',
        text: 'Tamborradatak biltzen dituen edizio guztietako parte-hartzeak, ikastetxeak eta gehien errepikatutako izenak.',
      },
      last: {
        label: 'Azken edizioa',
        title: 'Azken edizioa',
        text: 'Zenbat lagunek hartu zuten parte, zein ikastetxetakoak ziren eta zein izen errepikatzen diren gehien.',
      },
      cta: 'Ikusi estatistikak',
    },
  },
  searchParticipants: {
    title: 'Zein urtetan atera zen zure semea edo alaba Danborradan?',
    description:
      'Bilatu izen eta abizenen arabera {total} parte-hartzeren artean eta ezagutu zein edizioetan agertzen den, urte bakoitzaren jatorrizko iturrirako estekarekin.',
    descriptionFallback:
      'Bilatu izen eta abizenen arabera parte-hartze guztien artean eta ezagutu zein edizioetan agertzen den, urte bakoitzaren jatorrizko iturrirako estekarekin.',
    steps: {
      name: {
        title: 'Idatzi izena eta bi abizenak',
        description: 'Izen konposatua badu, nahikoa da bat.',
      },
      school: {
        title: 'Aukeratu ikastetxea',
        description: 'Izen bereko pertsonak nahastea saihesten du.',
      },
      sources: {
        title: 'Kontsultatu bere urteak eta iturriak',
        description: 'Edizio bakoitzak agertzen den albistera edo zerrendara eramaten zaitu.',
      },
    },
    cta: 'Joan bilatzailera',
    example: {
      ariaLabel: 'Emaitza baten adibide ilustratiboa',
      name: 'Izena Abizena Abizena',
      school: 'Zure ikastetxea',
      sources: 'Iturriak',
      caption: 'Adibide ilustratiboa',
    },
  },
  press: {
    title: '«Jaiaren ispilu digitala»',
    description:
      'Hala aurkeztu zuen {publication} egunkariak Tamborradata: Haur Danborradaren «artxibo historiko eta estatistiko handia», familientzako bilatzaile batekin eta hiria bere izenen bidez ulertzeko behatoki batekin.',
    openArticle: 'Ireki jatorrizko artikulua',
    clipping: {
      read: 'Irakurri artikulua',
    },
  },
  openSource: {
    title: 'Webgunea guztion begi-bistan eraikitzen da',
    description:
      'Interfazearen kodea, bere osagaiak eta bistaratzeak publikoak dira: irakurri, lokalean exekutatu eta hobekuntzak proposa ditzakezu. Datuak lortu eta prozesatzeko barne-pipeline-a ez dago biltegian.',
    stackLabel: 'Teknologiak',
    cta: 'Ikusi GitHub-en',
    terminal: {
      installed: 'Mendekotasunak instalatuta',
    },
  },
  contact: {
    title: 'Hitz egingo dugu?',
    description:
      'Datuetan errore bat aurkitu baduzu, prentsaz hitz egin nahi baduzu edo webgunea hobetzeko ideiaren bat baduzu, idatzi iezaguzu. Eskuz erantzuten dugu.',
    emailLabel: 'Posta elektronikoa',
    hint: 'Zuzenketa bat bada, adierazi urtea, izena eta ikastetxea.',
  },
  faq: {
    title: 'Maiz galdetzen digutena',
    items: {
      what: {
        question: 'Zer da Tamborradata?',
        answer:
          'Tamborradata plataforma independentea eta kode irekikoa da, Donostiako Haur Danborradaren artxibo historiko eta estatistikoa. Edizio bakoitzeko parte-hartzaileen zerrendak biltzen ditu{hasStart, select, yes { {startYear}tik aurrera} other {}} eta estatistika, sailkapen eta parte-hartzaileen bilatzaile bihurtzen ditu.',
      },
      howMany: {
        question: 'Zenbat haurrek parte hartzen dute Donostiako Haur Danborradan?',
        last: '{year}ko edizioan {participations} parte-hartze izan ziren, {schools} ikastetxetakoak.',
        growth: 'Aurreko edizioarekin alderatuta, aldakuntza {change} da.',
        total:
          'Guztira, Tamborradatak {participations} parte-hartze biltzen ditu, {editions} edizio eta {schools} ikastetxe desberdinetakoak.',
        note: 'Pertsona berak parte-hartze bat gehitzen du agertzen den urte bakoitzeko.',
        fallback:
          'Webguneko estatistiketan kontsulta dezakezu edizio bakoitzak zenbat parte-hartze izan zituen.',
      },
      topName: {
        question: 'Zein da Haur Danborradako izen ohikoena?',
        answer:
          '{name} da Haur Danborradan gehien errepikatzen den izena: {count} parte-hartzetan agertzen da. Izenen sailkapen osoa estatistiketan ikus dezakezu.',
        fallback: 'Gehien errepikatutako izenen sailkapena webguneko estatistiketan ikus dezakezu.',
      },
      topSurname: {
        question: 'Zein da parte-hartzaileen artean ohikoena den abizena?',
        answer:
          '{surname} da abizen ohikoena: {count} parte-hartzetan agertzen da. Abizenen sailkapen osoa estatistiketan ikus dezakezu.',
        fallback:
          'Gehien errepikatutako abizenen sailkapena webguneko estatistiketan ikus dezakezu.',
      },
      topSchool: {
        question: 'Zein ikastetxek ditu parte-hartzaile gehien Haur Danborradan?',
        answer:
          '{school} da parte-hartze gehien dituen ikastetxea: {count}. Ikastetxeen sailkapen osoa estatistiketan ikus dezakezu.',
        fallback:
          'Parte-hartze gehien dituzten ikastetxeen sailkapena webguneko estatistiketan ikus dezakezu.',
      },
      when: {
        question: 'Noiz ospatzen da Donostiako Haur Danborrada?',
        answer:
          'Urtero urtarrilaren 20an, San Sebastian egunean, Donostiako ikastetxeetako haurrak desfilatzen dute. Tamborradatak urtero argitaratzen diren parte-hartzaileen zerrendak biltzen ditu.',
      },
      find: {
        question: 'Nola jakin dezaket nire seme-alabak zein urtetan atera zen Danborradan?',
        answer:
          'Parte-hartzaileen bilatzailean, idatzi izena eta bi abizenak (izen konposatua badu, nahikoa da bat) eta aukeratu ikastetxea. Zein edizioetan agertzen den erakutsiko dizu, urte bakoitzaren jatorrizko iturrirako estekarekin.',
      },
      register: {
        question: 'Izena eman edo daturik eman behar da bilatzailea erabiltzeko?',
        answer:
          'Ez. Bilatzaileak izena eman gabe eta datu pribaturik eskatu gabe funtzionatzen du: izen bat idatzi eta ikastetxea aukeratu besterik ez duzu egin behar.',
      },
      years: {
        question: 'Zein urtetako datuak daude Haur Danborradaz?',
        answer:
          '{editions} edizioren datuak daude, {startYear} eta {endYear} artekoak.{hasGaps, select, yes { Ez dago honako hauen daturik: {missingYears}.} other {}}',
        fallback:
          'Donostiako Haur Danborradaren hainbat edizioren datuak daude, baina oraingoz ezin dugu urte-tarte zehatza erakutsi.',
      },
      notFound: {
        question: 'Zergatik ez da agertzen nire seme-alabaren izena bilatzailean?',
        answer:
          'Egiaztatu ikastetxea zuzena dela eta saiatu bigarren izena kentzen edo abizenaren beste aldaera bat idazten: iturrian beste modu batera idatzita egon daiteke. Datuak ez dauden edizio batekoa ere izan daiteke. Oraindik aurkitzen ez baduzu, idatzi iezaguzu.',
      },
      sources: {
        question: 'Nondik datoz datuak, eta ofizialak al dira?',
        answer:
          'Izenak Diario Vascok Danborradako haur konpainiei eskainitako orrietatik datoz; edizio zaharrenetarako, orri horien Internet Archive-ko kopia artxibatuak irakurtzen dira. Ez da erregistro ofiziala: zerrendak bilaketa egiteko prozesatzen dira eta akatsak izan ditzakete; horregatik bilaketa-emaitza bakoitzak bere iturrira esteka du.',
      },
      updates: {
        question: 'Zenbatero eguneratzen dira datuak?',
        answer:
          'Urtean behin: edizio berri baten zerrendak argitaratzen direnean, prozesatu eta estatistiketara eta bilatzailera gehitzen dira.{hasLast, select, yes { Sartutako azken edizioa {year}ko edizioa da.} other {}}',
      },
      participation: {
        question: '«Parte-hartze» zer da estatistiketan?',
        answer:
          'Parte-hartze bat pertsona baten erregistro bat da edizio batean. Pertsona berak hainbat gehi ditzake, agertzen den urte bakoitzeko bat. Horregatik, parte-hartzeen kopurua ez da pertsona desberdinen kopurua.',
      },
      correction: {
        question: 'Zuzenketa eska dezaket edo datuetako errore baten berri eman?',
        answer:
          'Bai. Idatzi iezaguzu {email} helbidera, urtea, izena eta ikastetxea adieraziz, eta aztertuko dugu.',
      },
      openSource: {
        question: 'Tamborradata kode irekikoa al da?',
        answer:
          'Bai. Interfazearen kodea, osagaiak eta bistaratzeak publikoak dira github.com/ramistodev/tamborradata helbidean: irakurri, lokalean exekutatu eta hobekuntzak proposa ditzakezu. Datuak lortu eta prozesatzeko barne-pipeline-a ez dago biltegian.',
      },
    },
  },
} satisfies typeof landing;

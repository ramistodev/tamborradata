import type { ArticleTexts } from '../../../types/article.types';
import { stepStatus } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { ambiguousShare, bothRoleShare, compoundNames, figures, tokenEvidence } from './figures';

const { martin } = tokenEvidence;

const copy: ArticleCopy = {
  intro: {
    simple:
      'Itxuraz, sinplea dirudi: izenak irakurri, zenbatu eta sailkapena egin. Edonork egingo luke kalkulu-orri batekin.',
    hands:
      'Baina Haurren Danborradako izenak urte luzez argitaratu dira, orri desberdinetan, eta zerrenda bakoitza esku desberdinek idatzi dute. Zerrendaren eta zenbakiaren artean tranpaz betetako bidea dago.',
    questionLabel: 'Galdera',
    question:
      'Nola bihurtzen dira izen ugari, modu askotan idatziak eta orri askotan sakabanatuak, fidatzeko moduko estatistika?',
    problemsCaption: 'Bidean okertu daitezkeen gauzak',
    problems: [
      'Izenen eta abizenen ordena aldatzen da',
      'Hitz bera izena eta abizena izan daiteke',
      'Ikastetxe bat hainbat izenekin agertzen da',
      'Jatorrizkoak akatsak ditu',
      'Zenbait urtetako informazioa osatu gabe dago',
      'Eguneraketa batek erdian huts egin dezake',
      'Testu automatiko batek oker egin dezake',
    ],
    promise:
      'Artikulu honek kontatzen du Tamborradatak horietako bakoitzari nola egiten dien aurre, eta oraindik zer ezin duen bermatu ere bai.',
  },
  names: {
    heading: 'Hiru hitz eta etiketarik ez',
    person:
      'Pertsona batentzat, «Aitor Goikoetxea Lasa» ez da misterioa: Aitor izena da, eta Goikoetxea eta Lasa abizenak. Asmatutako izena da, adibiderako bakarrik.',
    personCaption: 'Pertsona batek begiratu hutsarekin ikusten duena.',
    givenLabel: 'izena',
    surnameLabel: 'abizena',
    program:
      'Programa batentzat, berriz, hiru hitz solte dira. Inork ez dio esan zein den zein.',
    programCaption: 'Programa batek jasotzen duena.',
    unknownLabel: '?',
    trouble: (f) =>
      `Eta hau kasurik errazena da. Bi gauzetarako balio duten hitzak daude: Martin izena da eta abizena da. Zerrenda batzuek ordena alderantzikatzen dute («Goikoetxea Lasa, Aitor»). Badira bi izen dituztenak, edo «de la Fuente» bezalako abizen elkartua dutenak. Izenetan ${f.int(figures.distinctWords)} hitz desberdin agertzen dira, eta horietatik ${f.int(figures.bothRoleWords)} (${f.percent(bothRoleShare)}) izen gisa zein abizen gisa ikusi dira.`,
    counting: (f) =>
      `Tamborradatak ez du izenen hiztegirik erabiltzen. Zenbatuz ebazten du. Izen oso bat irakurtzen duen bakoitzean, hitz bakoitza zein tokitan zegoen jasotzen du: lehen hitza izen-seinale gisa zenbatzen da (eta ${f.int(figures.firstPositionWeight)} aldiz zenbatzen da), gainerakoak abizen-seinale gisa. Erregistro guztiak irakurri ondoren (${f.int(figures.participants)}), hitz bakoitzak bere historiala dauka, eta historial hori probabilitate bihurtzen da.`,
    nlp: 'Termino teknikoetan, hizkuntza naturalaren prozesamendua (NLP, ingelesezko siglen arabera) da: pertsonek idatzitako testua interpretatzen duten programak, hemen izenak eta abizenak. Eta sinpleenetakoa: probabilistikoa, sare neuronalik gabe. Adimen artifiziala deitu nahi bada, oso txikia da: sistemak berak gordetzen dituen datuetatik ikasten du, baina ez da ChatGPT bezalako hizkuntza-eredu bat, eta bere arauak pertsona batek finkatu zituen.',
    tableCaption:
      'Hitz bakoitzaren historiala datu-basean: izen gisa eta abizen gisa pilatutako puntuak (lehen posizioak hirukoitza balio du) eta izen oso baten lehen posizioan, erdian eta amaieran zenbat aldiz agertu den. Hitz soltuak dira, ez pertsonak.',
    wordColumn: 'Hitza',
    asGivenColumn: 'Izen gisa',
    asSurnameColumn: 'Abizen gisa',
    firstColumn: 'Lehena',
    middleColumn: 'Tartekoa',
    lastColumn: 'Azkena',
    reading: (f) =>
      `Aitor ia beti aurrean doa: izena da. Goikoetxea ez da inoiz izen gisa agertu: beti abizena da. José ia beti lehen postuan edo erdian doa, eta horregatik balio du bigarren izen gisa. Martinekin beste kontu bat da: ${f.int(martin.asName)} puntu pilatzen ditu izen gisa eta ${f.int(martin.asSurname)} abizen gisa, eta posizio guztietan agertzen da. Inorenik ez den lurraldean dago, eta sistemak badaki: tarteko hitz bat bigarren izen gisa onartzeko, bere historialak argi egiaztatu behar du (muga: ${f.percent(figures.secondNameThreshold, 0)}). Balio hori ezarri zen, % 50 beharrean, Martin bezalako kasuengatik hain zuzen: bigarren izen gisa akatsez sartzen zen.`,
    humility:
      'Sistema zuhurra da gutxi ikusi duenarekin ere. Behin bakarrik agertu den hitz bat ez da segurutzat hartzen: hasierako 50/50 horretatik abiatzen da, eta errepikatu ahala bakarrik urruntzen da hortik.',
    decision: (f) =>
      `Ordena erabakitzeko, lehen eta azken hitzak bakarrik alderatzen ditu: «izena lehen, abizena gero» alderantzizkoa baino nabarmen probableagoa bada (muga finkoa: ${f.percent(figures.orderThreshold, 0)}), onartu egiten du. Gainerakoak arau sinpleak dira: «de», «del» edo «la» hurrengo abizenari itsasten zaizkio, eta komadun forma («Goikoetxea Lasa, Aitor») hasi aurretik buelta ematen zaio.`,
    recordIntro:
      'Emaitza, parte-hartzaile bakoitzeko, datu-basean gordetzen den erregistro txiki bat da. Hau izango litzateke bi izen dituen izen bat, «Aitor José Goikoetxea Lasa», hau ere asmatua.',
    recordCaption:
      'Adibideko erregistroa. Konfiantza hitz bakoitzaren benetako historialekin kalkulatzen da.',
    fieldColumn: 'Eremua',
    valueColumn: 'Balioa',
    primaryNameField: 'Lehen izena',
    namesField: 'Izenak',
    surnamesField: 'Abizenak',
    confidenceField: 'Konfiantza',
    statusField: 'Egoera',
    statusResolved: 'Ebatzia',
    secondNames: (f) =>
      `Bereizketa horri esker, hitzak soilik mozteaz ezinezkoak liratekeen estatistikak kalkula daitezke, hala nola bigarren izenen sailkapena edo izen konposatua duten parte-hartzaileen kopurua. Datu-basean bi izen dituzten ${f.int(compoundNames.two)} parte-hartzaile daude, eta hiru dituztenak ${f.int(compoundNames.three)}.`,
    ambiguous: (f) =>
      `Izena eta abizenak bermeekin bereizteko biderik ez dagoenean, sistemak ez du asmatzen. Erregistroa anbiguotzat markatzen du eta izenen estatistiketatik kanpo uzten du. ${f.int(figures.participants)} erregistroren artean ${f.int(figures.ambiguous)} dira: ${f.percent(ambiguousShare, 2)}.`,
    limit:
      'Oso zentzu zehatzean ikasten du: bere zenbaketa sistemak berak gordetzen dituen datuekin hazten da. Baina bere arauak eta mugak ez dira bere kabuz aldatzen, eta dagoeneko interpretatutako erregistroak ez dira berriro ebaluatzen zenbaketa hobetzen denean.',
  },
  schools: {
    heading: 'Ikastetxe bat, izen asko',
    problem:
      'Haurren Danborradako zerrenda bakoitza web-orri batean dago, eta zerrenda zein ikastetxekoa den bi testutatik bakarrik jakiten da: orriaren izenburutik eta helbidetik. Testu horiek urtez urte aldatzen dira. La Salle «La Salle», «Lasalle» edo «Salle» gisa agertu daiteke. Sistemak forma bakoitza ikastetxe desberdintzat hartuko balu, La Sallen historia zatituta geratuko litzateke eta ikastetxeen araberako estatistikek ez lukete ezertarako balioko.',
    groupsCaption:
      'Ikastetxe berak izan dituen idazkerak, bere orrien izenburuan edo helbidean. Sistemak gordetzen dituen bezala erakusten dira, azentu-markarik gabe.',
    formsLabel: (f, count) => `${f.int(count)} forma`,
    how: 'Tamborradatak ordena bat jarraitzen du. Lehenik, testua garbitzen du: ikastetxe bat bestetik bereizten ez duten hitzak kentzen ditu («colegio», «ikastola», «infantil», «tamborrada») eta konpainia-zenbakiak ere bai, «compañía 2» adibidean bezala. Gero, ezagunak diren formen hiztegian bilatzen du. Aurkitzen ez badu, hitzez hitz konparatzen du, ez letraz letra: bi izen lotzen ditu soilik ia hitz guztiak partekatzen badituzte. Eta horrela ere ez bada, ikastetxe berri bat sortzen du.',
    dictionary:
      'Garrantzitsuena da hiztegia bere kabuz hazten dela. Ondo ezagutzen den orri bakoitzak bere forma guztiak ekartzen ditu, izenburukoa eta helbidekoa; beraz, hurrengo urteko orria, izen berri bat estreinatu arren, ezagutzen da, jada ezagutzen den forma bat badu. Datu-basean, «Carmelo», «Colegio Nino Jesus» eta «Scientia Karmelo» bezain desberdinak diren formak ikastetxe berberaren azpian daude.',
    limits:
      'Mugak argiak ditu. Ez ditu akatsak zuzentzen: «Arantzazuko» eta «Arantzatzuko» bi hitz desberdin dira sistemarentzat, eta hiztegian dauden akatsak hor daude orri bereko beste forma bat bat zetorrelako. Zalantzan, ikastetxe bereizi bat sortzen du, bi desberdin batu beharrean: horregatik La Salle eta San Luis La Salle, edo Jesuitas eta Jesuitinas, ikastetxe desberdinak dira. Eta ez dago giza berrikuspen-urratsik: batasun bat gaizki ateratzen bada, datuak aztertzean bakarrik antzematen da.',
    figures: (f) =>
      `Lan egiten dugun datu-basean ${f.int(figures.schools)} ikastetxe daude, eta ${f.int(figures.schoolAliases)} idazkera biltzen dituzte. Horien artean, ${f.int(figures.schoolsWithManyAliases)} ikastetxek forma bat baino gehiago dituzte; kasurik handienean, ${f.int(figures.maxAliases)}.`,
  },
  journey: {
    heading: 'Orri zahar batetik argitaratutako estatistika batera',
    intro:
      'Bi pieza horiekin, datu baten bide osoa jarrai daiteke, duela urte batzuk argitaratutako orri batetik webgunean ikusten duzun estatistikara.',
    caption: 'Izen baten bidaia, orri zaharretik webgunera.',
    steps: [
      {
        title: 'Orriak aurkitzea',
        description:
          'Zerrendak aldi berean hiru bidetatik bilatzen ditu: egunkariaren beraren zerrendatik, bilatzaile batetik eta interneteko artxibo historikotik. Bakar batek ez du nahikoa: argitaratu berri diren orriak ez daude oraindik bilatzaileetan ez artxiboan, eta horregatik egunkariaren zerrenda da lehena jakiten duena.',
      },
      {
        title: 'Irakurtzeko zerbait egon arte itxaritzea',
        description: `Prozesua gauero exekutatzen da urtarrilaren 15etik 22ra, eta ez du ezer egiten egunkariak gutxieneko zerrenda kopuru bat argitaratu arte: gutxienez ${figures.minDiscoveredPages} orri, eta urteko orrien erdia, bere zerrendatik datozenak.`,
      },
      {
        title: 'Zer aldatu den hautematea',
        description:
          'Uneko urteko orriak bakarrik aztertzen ditu berriro, eta horretarako orri bakoitzari galdetzen dio noiz aldatu zen azkenekoz. Data aldatu ez bada, dagoen bezala uzten du. Egiaztapen merkea da, orriak berak adierazten duen datan fidatzen dena.',
      },
      {
        title: 'Irakurri eta iragazi',
        description: `Pertsona ez dena baztertzen du (izenburuak, helbideak, «abanderada» edo «tambor» bezalako kargu-izenak), eskuz idatzitako zerrendekin: ${figures.roleWords} kargu-hitz inguru eta ${figures.rolePhrases} esaldi inguru, gaztelaniaz eta euskaraz. Eta egunkariak tarterik gabe itsatsi dituen izenak konpontzen ditu, argi dagoenean bakarrik.`,
      },
      {
        title: 'Ikastetxea ezagutzea',
        description:
          'Orriaren izenburua eta helbidea garbitzen ditu eta forma-hiztegian bilatzen ditu.',
      },
      {
        title: 'Izen bakoitza interpretatzea',
        description:
          'Izena eta abizenak bereizten ditu ebidentzien zenbaketaren bidez. Bermeekin egiteko biderik ez badago, erregistroa anbiguo geratzen da.',
      },
      {
        title: 'Estatistikak kalkulatzea',
        description:
          'Datuak aldatu diren urteak bakarrik birkalkulatzen ditu, ondo interpretatutako izenetatik abiatuta.',
      },
      {
        title: 'Bertsio osoa argitaratzea',
        description:
          'Bertsio berria aparte prestatzen da, eta webgunea berera pasatzen da denetan batera.',
      },
    ],
    canary: (f) =>
      `Eta astean behin lan egiten duen zaindari bat dago. Canary du izena eta, meatzeetako kanarioa bezala, ez du ezer konpontzen: abisatzen du. Astelehen bakoitzean, gordeta dauden ${f.int(figures.canarySample)} orri irakurtzen ditu berriro (${f.int(figures.canaryFixed)} beti berberak eta ${f.int(figures.canaryRandom)} ausaz aukeratuak) eta gaur ateratzen diren izenak guk gordetakoak berak direla egiaztatzen du. Egunkariaren orrien egitura aldatu bada eta irakurketak huts egiten badu, edo izenak ${f.int(figures.canaryDriftPages)} orritan edo gehiagotan desberdinak badira (edo berrikusitakoen ${f.percent(figures.canaryDriftShare, 0)} baino gehiagotan), posta elektronikoz abisu bat bidaltzen du. Inork begiratzen ez duen hilabeteetarako pentsatuta dago, urtarrilaren 20a ez dadin izan zerbait hautsi dela norbaitek jakiten duen lehen eguna.`,
  },
  statistics: {
    heading: 'Milaka errenkadatatik sailkapen batera',
    categories: (f) =>
      `Ondo interpretatutako izenekin, sistemak ${f.int(figures.categories)} estatistika-kategoria kalkulatzen ditu: izen errepikatuena, debutatzen edo desagertzen diren izenak, ikastetxe bakoitzaren bilakaera, besteak beste. Izen errepikatuena lortzeko, nahikoa da lehen izen bakoitza zenbat aldiz agertzen den zenbatzea ondo interpretatutako erregistroen artean eta ordenatzea; berdinketa badago, ordena alfabetikoan, emaitza beti berbera izan dadin.`,
    ripple:
      'Historia osoaren mende dauden estatistikak daude. Izen bat «berria» da aurreko edizioetan agertu ez bada bakarrik, eta ikastetxe bat «beteranoa» da azken edizio ia guztietan parte hartu badu. Horregatik, 2013ko datu bat zuzentzen bada, 2013tik gaur arte birkalkulatu behar da, eta urte guztien estatistika ere bai.',
    reuse:
      'Lana ez errepikatzeko, datuetan egindako aldaketa bakoitzak unitate bat gehitzen dio kaltetutako urteko kontagailuari, eta sistemak azken argitalpenekoarekin bat ez datorren kontagailua duten urteak bakarrik birkalkulatzen ditu. Gainerakoei ez zaie ukitzen: haien bertsio argitaratuak zerbitzatzen jarraitzen du. Aldatzen direnak osorik birkalkulatzen dira, hutsetik; ez dira adabakitzen.',
    blanks: (f) =>
      `Nahita utzitako hutsuneak ere badaude. Lehen edizioak ez du «izen berririk», dena berria litzatekeelako, eta bost edizioko historia behar da ikastetxe beteranoez hitz egiteko. Kategorien artean (${f.int(figures.categories)}), urte batek ${f.int(figures.yearCategoriesMin)} eta ${f.int(figures.yearCategoriesMax)} artean argitaratzen ditu, eskura dagoen historiaren arabera, eta urte guztien multzoak ${f.int(figures.globalCategories)} argitaratzen ditu. Falta den kategoriak «ezin da bermeekin kalkulatu» esan nahi du; kategoria hutsak, «kalkulatua, eta ez dago ezer zenbatzekorik».`,
  },
  publication: {
    heading: 'Inoiz erdizka ikus ez dadin',
    problem:
      'Imajinatu sistema estatistika guztiak birkalkulatzen hasten dela eta zati bat bakarrik amaitu duenean gelditzen dela. Webguneak emaitza bakoitza kalkulatu ahala erakutsiko balu, bisitari batek aldi berean zifra berriak eta zaharrak ikusiko lituzke: gaurko izenen sailkapena eta aurreko asteko ikastetxeen zerrenda.',
    unsafeCaption: 'Emaitza bakoitza kalkulatu ahala argitaratuko balitz',
    unsafeSteps: [
      {
        title: 'Izenen sailkapena birkalkulatzen da',
        status: stepStatus.success,
        statusLabel: 'Argitaratua',
      },
      {
        title: 'Ikastetxeen zerrenda birkalkulatzen da',
        status: stepStatus.success,
        statusLabel: 'Argitaratua',
      },
      {
        title: 'Urteen araberako bilakaeraren kalkuluak huts egiten du',
        status: stepStatus.danger,
        statusLabel: 'Errorea',
      },
      {
        title: 'Webguneak zifra berriak eta zaharrak batera erakusten ditu',
        description: 'Inork ez daki orriaren zein zati den gaurkoa eta zein aurreko astekoa.',
        status: stepStatus.danger,
        statusLabel: 'Erdizka',
      },
    ],
    safeCaption: 'Aparte prestatutako bertsio batekin',
    safeSteps: [
      {
        title: 'Bertsio berri bat kalkulatzen da, alde batean',
        description: 'Bitartean, aurreko bertsioa da ikusgai dagoen bakarra.',
      },
      {
        title: 'Prest dagoela egiaztatzen da',
        description:
          'Kalkulua akatsik gabe amaitu dela eta bitartean datuak aldatu ez direla.',
      },
      {
        title: 'Webgunea bertsio berrira pasatzen da, denetan batera',
        description: 'Aldaketa bakarra da. Aurreko bertsioa artxibatu egiten da; ez da ezabatzen.',
        status: stepStatus.success,
        statusLabel: 'Argitaratua',
      },
      {
        title: 'Aurretik zerbaitek huts egiten badu, ez da ezer aldatzen',
        description: 'Bisitariak aurreko bertsioa ikusten jarraitzen du, osorik eta koherenteki.',
        status: stepStatus.success,
        statusLabel: 'Eraginik gabe',
      },
    ],
    analogy:
      'Liburu baten edizio berri bat aurrekoaren ondoan inprimatzea bezala da, eta, amaituta eta berrikusita dagoenean, liburutegiak apalean jartzen duen aleaz aldatzea. Inork ez du inoiz erdi inprimatutako libururik ikusten.',
    verified:
      'Egiaztapena itxura baino apalagoa da. Sistemak kalkulua akatsik gabe amaitu dela eta datuak kalkulatzen ari zen bitartean aldatu ez direla egiaztatzen du (aldatu badira, argitalpena baztertzen du). Ez du emaitza «egon beharko lukeenaren» zerrenda batekin konparatzen, ezta zifra bitxiak bilatzen ere: osotasuna dator edozein akatsek kalkulua gelditzen duelako.',
    web: 'Eta bigarren sarraila bat dago datu-basean bertan: webguneak aldi bakoitzeko bertsio argitaratua bakarrik irakur dezake, webguneko kodeak huts egingo balu ere.',
    limits:
      'Jakitea komeni den muga bat: argitalpena aldi bakoitzeko pieza batena da, ez gune osoarena denetan batera. Datu zahar bat zuzentzen bada eta hainbat aldi birkalkulatu behar badira, denbora batez webguneak urte batzuk eguneratuta eta beste batzuk oraindik eguneratu gabe erakutsi ditzake. Eta kalkulu batek huts egiten badu, webguneak aurreko bertsioa zerbitzatzen jarraitzen du hurrengo exekuzio programatuan berriro saiatu arte.',
    figures: (f) =>
      `Lan egiten dugun datu-basean ${f.int(figures.periods)} aldi daude (${f.int(figures.yearPeriods)} edizio eta guztien multzoa), bakoitza argitaratutako bertsio batekin eta bat ere zain gabe.`,
  },
  ai: {
    heading: 'Zenbakiak ere azaldu behar direnean',
    problem:
      'Zenbaki bat kalkulatzea eta ulergarri egitea ez da gauza bera. Horregatik, Tamborradatak estatistikei hizkuntza-eredu batek idatzitako laburpen txikiak gehitzen dizkie: hemen bai, adimen artifizial sortzailea, izenen sistemaren familia desberdin batekoa. Ez du ezer kalkulatzen, idatzi egiten du bakarrik. Eta hor arazo berri bat sortzen da: zehatza ez den zerbait ziurtasun osoz idatz dezake.',
    how: (f) =>
      `Ereduak ez du kalkulu-orririk jasotzen. Estatistika bakoitza tresna baten bidez eskatzen du, bere ataleko estatistikak bakarrik, eta zenbakiak agertu behar duten bezala idatzita heltzen zaizkio, kalkulatu beharrean kopia ditzan. Joeraren norabidea (gora, behera edo berdin) programak erabakitzen du, ez ereduak: egonkortzat hartzen da aldaketa ${f.percent(figures.stableTrendThreshold, 0)} baino txikiagoa bada.`,
    placeholders:
      'Xehetasun batek arazo asko saihesten ditu: ereduak ez du inoiz ikastetxe baten izena idazten. Barne-erreferentzia bat idazten du, eta webgunea da norbaitek orria irekitzen duenean uneko izenaz ordezkatzen duena. Txantiloi-gutun baten antzekoa da («Jaun-andre agurgarri…»), non idazten duenak ez baitu inoiz helbide-liburua ikusten.',
    benefits:
      'Honek hiru abantaila praktiko ditu. Ereduak ezin du ikastetxe baten izena gaizki idatzi, ez beste batekin nahastu. Itzulpenak erreferentzia osorik mantentzen du (berberak direla eta ordena berean daudela egiaztatzen da). Eta ikastetxe baten izena aldatzen bada, testuak baliozkoa izaten jarraitzen du, izena erakusteko unean bilatzen delako. Erreferentzia bat ebatzi ezin bada, laburpen hori ez da erakusten eta orriak berak gabe funtzionatzen jarraitzen du.',
    translations:
      'Laburpenak lehenik ingelesez idazten dira. Gaztelaniazko eta euskarazko bertsioak dagoeneko balidatutako testu horretatik ateratzen dira.',
    limits:
      'Zer egiaztatzen den eta zer ez jakitea komeni da. Sistemak egiaztatzen du testuak ez duela urtea errepikatzen behar ez denean, erreferentzia bakoitzak existitzen den ikastetxe bati seinalatzen diola eta itzulpenek erreferentzia berberak mantentzen dituztela. Ez du egiaztatzen testuko zifra bakoitza datuekin bat datorrenik, ez formatua zuzena denik, ez itzulpenak izen propioak errespetatzen dituenik. Ezta argitaratu aurretik giza berrikuspen-urratsik ere.',
    glitches:
      'Kontrol faltak zer uzten duen igarotzen erakusten duten adibide errealak daude: 2026ko laburpen batek itxi gabeko enfasi bat dauka (hiru hizkuntzetan berbera), eta itzulpen batean «Inigo» «Íñigo» bihurtu zen.',
    failure:
      'Laburpen baten sorrerak huts egiten badu, ez du estatistiken argitalpena blokeatzen: orria testu hori gabe ateratzen da, eta exekuzio bakoitzaren hasieran konponketa-prozesu batek huts egin zutenak berriro saiatzen ditu.',
    figures: (f) =>
      `Lan egiten dugun datu-basean ${f.int(figures.summaries)} laburpen argitaratu daude (hizkuntza bakoitzeko ${f.int(figures.summariesPerLanguage)}), bat ere huts egin gabe edo zain gabe. Hizkuntza bakoitzean, ${f.int(figures.summariesWithSchoolRefs)} laburpenek ikastetxeei buruzko erreferentziak dituzte: ${f.int(figures.schoolRefsPerLanguage)} erreferentzia, ${f.int(figures.schoolsReferenced)} ikastetxe desberdini seinalatzen dietenak, denak ebatziak.`,
  },
  quality: {
    heading: 'Zer kalitate dute datuek?',
    intro:
      'Aurreko guztia kontrolak dira. Galdera zintzoa da zer esaten duten datuen benetako kalitateari buruz. Hau da datu-basea aurrean dugula baieztatu dezakeguna.',
    tableCaption: 'Lan egiten dugun datu-baseko zifrak.',
    indicatorColumn: 'Adierazlea',
    valueColumn: 'Zifra',
    participantsRow: 'Erregistratutako parte-hartzeak',
    editionsRow: 'Edizioak',
    schoolsRow: 'Ikastetxeak',
    pagesRow: 'Jatorrizko orriak',
    resolvedRow: 'Ebatzitako erregistroak',
    ambiguousRow: 'Erregistro anbiguoak',
    compareCaption: 'Izen bat ebaztea ez da hori egiaztatzea.',
    resolvedLabel: 'Ebatziak',
    resolvedDescription: (f) =>
      `${f.int(figures.participants)} erregistroren artean ${f.int(figures.resolved)}: sistemak izena abizenetatik bereiztea lortu zuen.`,
    checkedLabel: 'Egiaztatuak',
    checkedValue: 'Neurtu gabe',
    checkedDescription:
      'Datu-baseak ez du eskuzko berrikuspenik gordetzen, beraz ezin dugu zehaztasunik eman, ebazpen-tasa bat bakarrik.',
    confusion:
      'Komeni da ez nahastea. Erregistro bat «ebatzita» agertzeak sistemak bereizketa posible bat aurkitu duela esan nahi du, ez inork zuzena dela egiaztatu duenik. Eta sistemak gordetzen duen «konfiantzak» hitz bakoitza alde batera zenbat makurtzen den neurtzen du, ez asmatzeko probabilitatea.',
    coverage: (f) =>
      `Estaldurak hutsuneak ere baditu. 2009ko eta 2010eko daturik ez dago, eta 2021ean ez zen Danborradarik egon. 2012ko eta 2022ko zerrendek ${f.int(figures.partialEditionSchools)} ikastetxe inguru biltzen dituzte, ondoko edizioetako ${f.int(figures.regularSchoolsMin)} eta ${f.int(figures.regularSchoolsMax)} artekoen aldean: edizio osatu gabeak dira.`,
    dirty:
      'Eta datu publiko guztiak ez daude garbi. Zenbait gauza ezin dira kalkulatu jatorritik horrela datozelako, eta ez dago bere kabuz antzematen dituen algoritmorik. 2026ko zerrendetan «Lbai» edo «Lrati» bezalako hitzak daude, ziurrenik «Ibai» eta «Irati» izenen akatsak. Sistemarentzat gutxi ikusitako izenak dira, eta halaxe zenbatzen ditu.',
    duplicates: (f) =>
      `Edizio berean ${f.int(figures.repeatedNameKeys)} izen oso errepikatu daude, beti ikastetxe desberdinetan: soberako errenkaden ${f.percent(figures.repeatedExtraRowsShare, 2)}. Ez dakigu omonimoak diren, bi zerrendatan apuntatutako haurrak diren ala iturriko bikoizketak.`,
    integrity:
      'Garbi ateratzen dena: egin ditugun osotasun-egiaztapenek ez dituzte aurkitzen errenkada umezurtzik, parte-hartzailerik gabeko ikastetxerik, ez argitaratutako estatistiketan azalpenik gabeko hutsunerik.',
    closing:
      'Datuen kalitatea ez da perfekzioa agintzea. Akatsak non egon daitezkeen jakitea da, kontrolak jarri ahal diren tokian jartzea eta oraindik bermatu ezin dena argi esatea.',
  },
  conclusion: {
    heading: 'Izen-zerrenda bat ez da estatistika bat',
    summary:
      'Izen-zerrenda baten eta estatistika baten artean bide luzea dago: izenak abizenetatik bereiztea, izen ugari dituzten ikastetxeak ezagutzea, aldatu ez dena ez birkalkulatzea, erdizka ez argitaratzea eta zenbakiak asmatu gabe azaltzea. Urrats horietako bakar bat ere ez da perfektua, eta ia guztiek komeni den muga bat dute.',
    twoUses:
      'Artikulu osoa zeharkatzen duen ideia bat dago: parte-hartzaileen zerrenda zerrenda bat baino askoz gehiago da. Izenak, urteak, ikastetxeak… ditu. Eta datu horiek bi gauzatarako balio dute aldi berean. Alde batetik, sistema bera aberasten dute: zerrendatik abiatuta, Tamborradatak eredu probabilistiko bat eraikitzen du, izenak eta abizenak interpretatzeko ebidentziak pilatzen dituena. Bestetik, zerrenda horrek berak elikatzen ditu Haurren Danborradan desfilatu dutenen istorioa kontatzen duten estatistikak.',
    closing:
      'Estatistika fidagarria ez da inoiz huts egiten ez duena, non huts egin dezakeen dakiena baizik.',
  },
};

const texts: ArticleTexts = {
  title: 'Datu bakoitzaren atzean istorio bat dago. Eta konpondu beharreko arazo bat.',
  description:
    'Urteetan argitaratutako izen milaka, mila modutan idatziak, nola bihurtzen diren fidatzeko moduko estatistika. Eta oraindik zer ezin den bermatu.',
  category: 'Nola egiten den',
  readTime: '11 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

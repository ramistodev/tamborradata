import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { figures } from './figures';

const copy: ArticleCopy = {
  intro: [
    'Urtarrilaren 20a da, eta goizak badu desfilea baino lehen Donostian entzuten den soinu ezaguna. Haurren Danborradako eskoletako konpainien inguruan txaketak doitzen ari dira, danborrak bilatzen eta urrats batzuk atzean geratu denari deitzen. Irteerako zerrenda batean Ane, Unai, Jon, Maddi, Nahia eta Leire ager daitezke. Inork ez du martxa gelditu behar haiek ezagutzeko.',
    'Orrialde berean lerro bakoitza ixten duten hitzak daude. García, González, Rodríguez, Fernández, Martínez eta López behin eta berriz agertzen dira. Bizkor irakurrita, izenak eta abizenak unitate praktiko bat osatzen dute: nor dagoen egiaztatzeko, ilara ordenatzeko edo baimena emateko balio dute. Bereizita, ordea, erregistroari buruzko galdera bat irekitzen dute.',
    'Zergatik aldatzen dira zerrenda hauen buruko izenak lehen abizenak baino errazago? Galderak ez du inor hemengotarragoa den erabakitzeko edo inoren jatorria berreraikitzeko asmorik. Jai publiko berean elkarrekin bizi diren eta izen-emate orrira bide desberdinetatik iristen diren bi errepertorio behatzen ditu.',
    'Izena une zehatz batean egiten den aukera izan ohi da. Familia-lehentasun bat, literatura-erreferentzia bat, ezagunago egiten den soinu bat edo hurbil zegoen forma bat izan daiteke. Abizena ez da horrela sartzen zerrendan. Filiatzearen bidez iristen da, eta Espainiako Kode Zibilaren 109. artikuluak haren ordena arautzen du. Alde juridiko eta sozial horrek ez du kasu bakoitza azaltzen, baina bai zergatik bi rankingek erritmo bera izatea espero ez dugun.',
    'Tamborradatak alde hori desfilea utzi gabe begiratzeko aukera ematen du. Haurren Danborradako eskuragarri dauden zerrendak biltzen ditu eta parte-hartzeen zenbaketa bihurtzen ditu. Ez dago elkarrizketarik, ezta gelaxka baten barruan ezkutatutako familia-historirik ere. Erregistratutako lehen izenak eta lehen abizenak daude, edizioz ordenatuta eta arretaz alderatuta.',
    'Emaitzak forma argia du. Izenen goialdea berritu egiten da. Nora eta Maddi gora doaz, Telmo lehen postuetara iristen da eta Leirek duela urteetako lekua galtzen du. Lehen abizenetan, berriz, aldaketa txikiagoa da buruan. García, González, Fernández, Rodríguez, Martínez, Pérez, López, Gómez, Hernández eta Ruiz lehen hogei artean daude behatutako urte guztietan.',
    'Egonkortasun horrek ez du abizen bat identitate bihurtzen, ezta izen bat hizkuntza, jatorri edo familiaren froga ere. Behin eta garbi esatea komeni da: zerrenda hauek jai bateko parte-hartzeak deskribatzen dituzte, ez biografiak. Haien interesa hitzen mugimendu kolektiboan dago, ez daramanari historia pertsonal bat egokitzean.',
    'Beraz, bi erritmoen istorioa da hau. Lehenik aldea eta haren muga kokatuko ditugu. Ondoren, zenbait izen edizioz edizio jarraituko ditugu eta errepertorioak testuinguru kultural eta juridikoan kokatuko. Amaieran, Danborradako zerrenda batek esan dezakeenaren eta ezin duen guztiaren irakurketa zehatzagoa geratuko da. Zehaztasun hori eguneroko solasaldian ere garrantzitsua da. Izen bat gora doala esatea ez da joera bat ospatzea edo deitoratzea. Abizen batek irauten duela esatea ez da inor kutxa batean sartzea. Tradizio partekatu batek memoria gordetzen eta, aldi berean, forma berriei lekua nola egiten dien behatzea da.',
  ],
  data: {
    heading: 'Urte osatugabeak nahasten ez dituen alderaketa',
    coverage: (f) => `${figures.earlyPeriod} aldia, ${f.int(figures.earlyParticipations)} parte-hartzerekin, eta ${figures.recentPeriod} aldia, ${f.int(figures.recentParticipations)} parte-hartzerekin, aurrez aurre jartzen ditu alderaketa nagusiak. Biak iraupen bereko urte osoak dira. Horrela, zerrenda laburrago baten edo estaldura desberdinaren eragina aldaketa erreal balitz bezala hartzea saihesten da.`,
    records: 'Parte-hartzeak zenbatzen ditugu, ez pertsona bakarrak. Haur batek hainbat ediziotan desfilatu eta behin baino gehiagotan ager daiteke. Parte-hartze bakoitzerako erregistratutako lehen izena eta lehen abizena erabiltzen ditugu. Horrek zerrenden forma alderatzea ahalbidetzen du, ez bizitzak jarraitzea edo jaiotza-kohorteez hitz egitea. Idatzitako forma bat ere ez da kategoria finko bihurtzen: ez ditugu aldaerak biltzen, ez ditugu abizenak ustezko bertsio kanoniko batera zuzentzen, ezta izen-emate baten arrazoia asmatzen ere. Diziplina hori garrantzitsua da, zenbaketa on bat bere zutabeek eutsi ezin dituzten promesak ez egitean hasten delako.',
  },
  concentration: {
    heading: 'Izenetarako goialdea irekitzen da, abizenetarako ez',
    opening: (f) => `Seinalerik argiena lehen hamarrek hartzen duten tokia neurtzean agertzen da. 2008an, hamar izen ohikoenek parte-hartzeen ${f.percent(figures.topTenNames2008, 2)} biltzen zuten. 2026an, ${f.percent(figures.topTenNames2026, 2)}. Sei puntu baino gehiagoko jaitsiera da: buru diren izen ezagunek hor jarraitzen dute, baina aukera gehiagorekin partekatzen dute protagonismoa.`,
    namesCaption: 'Hamar izen ohikoenek pisua galtzen dute 2008tik 2026ra. Garrantzitsua banaketa da: goialdeak leku gehiago uzten die gainerako izenei.',
    surnamesCaption: 'Lehen hamar abizenek antzeko proportzioa mantentzen dute 2008tik 2026ra. Izenen aldaketaren aurrean, jarraitutasun hori da kontraste nagusia.',
    earlyLabel: '2008',
    recentLabel: '2026',
    conclusion: 'Abizenek kontrako bidea egiten dute. Lehen hamarrek parte-hartzeen % 11,12tik % 12,41era egiten dute. Aldea ez da handia, eta ez da puztu behar. Nahikoa da esateko izenen gailurra sakabanatzen den bitartean, abizenena pisuari eusten diola eta zertxobait irabazten duela. Alderaketak ez dio familia bakoitzari kausa bat ematen. Bi mekanismo desberdinekin bateragarria den aztarna deskribatzen du: izena aukeratzea eta abizena transmititzea. Egonkortasunak ez du mugiezintasuna esan nahi. Sarrerak eta irteerak badaude, eta abizen ezohikoagoek postuz aldatzen dute. Mantentzen dena goialdeko marrazki orokorra da, ez salbuespenik gabeko araua.',
  },
  turnover: {
    heading: 'Txandakatzea lehen hogei postuetan gertatzen da',
    opening: 'Bigarren probak bi aldi osoetako rankingak alderatzen ditu. 2013–2016ko hogei izen nagusietatik hamabi 2023–2026ko lehen hogeietan daude oraindik, eta zortzi ordezkatu dira. Asier, Eneko, Iñigo, Leire, María, Naroa, Oier eta Pablo irten dira. June, Maddi, Markel, Martin, Martina, Noa, Sara eta Telmo sartu dira. Taldea ez da bat-batean desagertzen, baina gogoko berrien multzo bati lekua uzten dio.',
    tableCaption: '2013–2016 eta 2023–2026ko rankingen arteko solapamendua. Taulak erakusten du aldaketa goiko postuen istorioa dela, ez errepertorio osoarena.',
    namesLabel: 'Bi aldietako izenak',
    surnamesLabel: 'Bi aldietako abizenak',
    conclusion: (f) => `Lehen abizenetan ordezkapena askoz txikiagoa da: hogeietatik ${f.int(figures.topTwentySurnamesRetained)} geratzen dira. Artola, Etxeberria eta Ramos bakarrik ordezkatzen dituzte Muñozek, Ortegak eta Vázquezek. Baina ikuspegia lehen ehunetara zabaltzean, solapamendua ia berdina da: ${f.int(figures.topHundredNamesRetained)} izen eta ${f.int(figures.topHundredSurnamesRetained)} abizen. Hori da zehaztapen erabakigarria. Ez dira bi mundu bereizi, zerrenden buruan kontzentratutako aldea baizik.`,
  },
  trajectories: {
    heading: 'Nora, Maddi, Telmo, Leire, Jon, Ane eta Unai',
    nora: (f) => `Urteko rankingek mugimendua ematen diote ondorio horri. Nora ${f.int(figures.nora2008Rank)}. postuan zegoen 2008an, ${f.int(figures.nora2008Count)} parte-hartzerekin. 2026an lehenengoa da, ${f.int(figures.nora2026Count)}rekin. Maddi ${f.int(figures.maddi2008Rank)}. postutik eta ${f.int(figures.maddi2008Count)} parte-hartzetik bosgarrenera eta ${f.int(figures.maddi2026Count)}ra igarotzen da. Telmo, 2008an 50. zena, seigarren lekura iristen da 2026an. Parte-hartzeen zerrendetako gorakadak dira, ez jaiotza-kohorteetarako etiketak.`,
    otherNames: (f) => `Jaitsierak eta iraunkortasunak ere badute garrantzia. Leire laugarrena zen 2008an eta berriro laugarrena 2013an; 2026an 30. postuan dago, 37 parte-hartzerekin. Jon izen ohikoena izan zen 2011tik 2015era, eta hirugarrena da 2023–2026 aldian. Ane lehena izan zen 2008an, 2016tik 2020ra eta 2023tik 2024ra; bigarrena da 2025ean eta 2026an. Unaik beste iraunkortasun mota bat erakusten du: hamabigarrena zen 2008an, ${f.int(figures.unai2017Count)} parte-hartzera iritsi zen 2017an eta hamaseigarrena da oraindik 2026an.`,
    continuity: 'Lerro horietako batek ere ez du moda bat berez azaltzen. Elkarrekin zerbait apalagoa eta erabilgarriagoa erakusten dute: txandakatzea oinarri sendo batekin bizi da. Lehentasun batzuk azkar mugitzen dira, beste batzuk urte askotan goitik gertu mantentzen dira. Ez dago izen bat bestearen ordez jartzen denik, desfileak edizio batetik bestera hizkuntza edo biztanleria aldatu balu bezala.',
  },
  culture: {
    heading: 'Zerrenda berean elkartzen diren errepertorioak',
    repertoire: 'Ane, Jon, Ander, Nora, Iker, Nahia, Unai, Leire eta Maddi Euskaltzaindiaren EODAn, euskal errepertorio onomastikoan, pertsona-izenen sarrera gisa agertzen dira. Erakundeak Unairi buruzko ohar lexiko eta dokumental historikoa biltzen du, eta Maddi Iparraldeko Mariaren hipokoristikotzat aurkezten du. Izen-formak irakurtzeko testuinguru kulturaleko piezak dira, ez zerrenda bateko pertsonak sailkatzeko giltza.',
    legal: 'Testuinguru horrek marko publiko bat ere badu. 1979ko Gernikako Estatutuak euskara Euskadiko berezko hizkuntza eta hizkuntza ofizialkide gisa aitortzen du, eta Euskaltzaindia erakunde aholku-emaile ofizial gisa. EODAko sarrera batek, marko horrek bezala, errepertorio baten bizitza publikoa ulertzen laguntzen du. Ez du frogatzen parte-hartzaile batek zer hizkuntza hitz egiten duen, familiak zer tradizio duen edo izen bat zergatik aukeratu zen.',
    coexistence: 'Abizenek eszenaren beste erdia erakusten dute. García, González, Rodríguez, Fernández, Martínez eta López, Pérez, Gómez, Hernández eta Ruizekin batera, Espainian oso zabalduak diren formak dira. Tamborradatan, Garcíaren urteko batez besteko postua 1,6 da. Hamartar hori baino garrantzitsuagoa jarraitutasuna da: hamar abizen horiek lehen hogei artean daude behatutako urte guztietan, eta Sánchez, Martín, Jiménez eta Álvarez hamasei urtetatik hamabostetan. Ez dira hiriaren identitateagatik lehiatzen diren blokeak. Bere zerrendetan elkarrekin dauden errepertorioak dira.',
  },
  conclusion: {
    heading: 'Zerrenda batek esaten duena eta kanpoan geratzen dena',
    summary: 'Haurren Danborradak ez du Donostia nor denaren erretraturik eskaintzen. Zerbait txikiago eta egiaztagarriagoa eskaintzen du: aukeratutako izenak goian azkarrago berritzen diren eta lehen abizenak indar handiagoz mantentzen diren zerrenden segida. Unaik eta Garcíak puntua ikusgarri egiten dute, lerro batek paperean iristeko bi bide elkartzen dituelako. Ondorioaren indarra ez dago kasualitate bat istorio oso bihurtzean. Datuak erakusten duena eta irudimenez baino ezin osa daitekeena bereiztean dago.',
    method: (f) => `Metodoa eta iturriak. Azterketak Haurren Danborradako ${f.int(figures.observedYears)} edizio erabilgarriak darabiltza. Alderaketa historiko nagusiek 2013–2016 eta 2023–2026 baino ez dituzte erabiltzen, iraupen bereko aldi osoak, ${f.int(figures.earlyParticipations)} eta ${f.int(figures.recentParticipations)} parte-hartzerekin. 2009, 2010 eta 2021eko datuak falta dira; 2012 eta 2022k estaldura partziala dute, eta 2011ko abizen-formatuak anomalia du. Horregatik ez da urte guztiak baliokidetzat hartzen dituen serierik aurkezten. Parte-hartzeak zenbatzen dira, ez pertsonak, eta lehen izena eta lehen abizena baino ez. Testuingururako iturriak Euskaltzaindiaren EODA, Gernikako Estatutua eta Kode Zibilaren 109. artikulua dira. Emaitzek ranking agregatuak deskribatzen dituzte eta ezin dute banakako parte-hartze baten hizkuntza, nazionalitatea, jatorria, arbasoak, familia edo arrazoia ondorioztatu.`,
    closing: 'Urtarrilaren 20ko goizean, zerrenda batek desfilea aurrera egiten laguntzen du. Arretaz irakurrita, haren hitzak nola aldatzen diren ere erakusten du. Haur eta familia bakoitzaren bizitza ez dago bertan idatzita.',
  },
};

const texts: ArticleTexts = {
  title: 'Unai García: gure izen-abizenek Donostiari buruz zer kontatzen duten',
  description: 'Aukeratutako izenak lehenago aldatzen dira Haurren Danborradako goialdean; transmititutako abizenek beste jarraitutasun bat dute.',
  category: 'Izenak eta abizenak',
  readTime: '10 min',
  articleContent: buildArticleContent('eu', copy),
};

export default texts;

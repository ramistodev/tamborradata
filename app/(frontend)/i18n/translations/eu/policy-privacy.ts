import type esPrivacyPolicy from '../es/policy-privacy';

const privacyPolicy = {
  metadata: {
    title: 'Pribatutasun-politika',
    description:
      'Nola lortzen, tratatzen eta babesten ditugun Tamborradataren datuak: iturriak, estatistikak, parte-hartzaileen bilatzailea, cookieak eta zure eskubideak nola baliatu.',
  },
  hero: {
    titleLine1: 'Pribatutasun-',
    titleLine2: 'politika',
    description:
      'Tamborradata posible egiten duen informazioa nola tratatzen eta babesten dugun gardentasunez azaltzen dugu.',
    published: '{date}(e)an argitaratua',
    updated: '{date}(e)an eguneratua',
  },
  structuredData: {
    home: 'Hasiera',
  },
  aside: {
    title: 'Edukia',
    open: 'Ireki edukia',
    close: 'Itxi edukia',
  },
  sections: {
    controller: {
      title: 'Arduraduna eta harremana',
      p1: 'Tamborradata Donostiako danborradako haur-konpainietako parte-hartzaileei buruzko estatistikak eskaintzen dituen webgunea da, baita parte-hartzaile bat zein edizioetan agertzen den kontsultatzeko bilatzailea ere.',
      p2: 'Politika honetan azaldutako datuen tratamenduaren arduraduna Tamborradataren titularra da. Pribatutasunarekin lotutako edozein gaitarako, izen bat kentzeko eskaera barne, idatz iezaguzu helbide honetara: <mail>{email}</mail>.',
    },
    data: {
      title: 'Zer datu tratatzen ditugun',
      intro: 'Bi datu mota tratatzen ditugu, izaera oso desberdinekoak.',
      participants:
        '<strong>Parte-hartzaileen datuak.</strong> Danborradako haur-konpainien zerrendetan argitaratuta agertzen direnak dira. Parte-hartzaile bakoitzeko hau gordetzen dugu:',
      i1: 'Izena eta abizenak, argitaratu zirenean bezala eta bertsio normalizatu batean.',
      i2: 'Dagokion ikastetxea edo konpainia.',
      i3: 'Agertzen den edizioaren urtea.',
      i4: 'Argitaratu zen orriaren helbidea, iturria lotu ahal izateko.',
      i5: 'Izenaren eta abizenen artean kalkulatutako banaketa, estatistiketan erabiltzen duguna.',
      notStored:
        'Ez ditugu gordetzen parte-hartzaileen adina, jaiotza-data, sexua, irudiak, helbidea ezta kontaktu-daturik ere.',
      visitors:
        '<strong>Webgunea bisitatzen dutenen datuak.</strong> Ez dugu izen-ematerik eskatzen, ez dago erabiltzaile-konturik eta ez dago harremanetarako inprimakirik. Cookieen eta analitikaren atalean azaltzen diren datu teknikoak eta bilatzailearen erabilerak sortzen dituenak soilik tratatzen dira.',
    },
    sources: {
      title: 'Datuak nondik datozen',
      p1: 'Parte-hartzaileen datuak ez dizkiete Tamborradatari parte-hartzaileek edo haien familiek ematen. Iturri publiko bakar batetik jasotzen ditugu: Diario Vascok danborradako haur-konpainiei eskainitako orrietatik.',
      p2: 'Lortzeko prozesua automatikoa da eta bi urratsek osatzen dute:',
      i1: '<strong>Orriak aurkitu.</strong> Diario Vascoko ataleko zerrenda, bilatzaile bat (SerpAPI APIaren bidez) eta edizio zaharrenetarako Internet Archivek gordetako kopia historikoak kontsultatzen ditugu.',
      i2: '<strong>Izenak irakurri.</strong> Programa batek orri bakoitzeko ikastetxearen izena eta parte-hartzaileen zerrenda irakurtzen ditu. Ez dago datuak eskuz sartzerik.',
      p3: 'Datuak ez dira ofizialak. Hedabideak garai hartan argitaratu zuenaren araberakoak dira, eta akatsak, hutsuneak edo edizio bakoitzeko benetako zerrendarekiko desberdintasunak izan ditzakete.',
    },
    processing: {
      title: 'Nola tratatzen ditugun',
      intro:
        'Izenak irakurri ondoren, antolatu eta aztertu egiten ditugu, estatistikak eta bilaketak eskaini ahal izateko. Urratsak hauek dira:',
      i1: '<strong>Garbiketa.</strong> Pertsona baten izena ematen ez duten lerroak baztertzen dira (zenbakiak, helbideak dituztenak edo laburregiak zein luzeegiak) eta formatua bateratzen da; adibidez, «Abizenak, Izena» «Izena Abizenak» bihurtzen da. Azentuak eta maiuskulak ere kentzen dira, izenak konparatu ahal izateko.',
      i2: '<strong>Ikastetxeak.</strong> Izen bakoitza ikastetxe batekin lotzen da. Ikastetxe bera hainbat modutan idatzita agertzen denean, antzekotasunaren arabera taldekatzen ditugu.',
      i3: '<strong>Izena eta abizenak.</strong> Argitaratutako testuak ez ditu izena eta abizenak bereizten, beraz metodo estatistiko baten bidez banatzen ditugu, datu guztien multzoan hitz bakoitza izen edo abizen gisa zenbatetan agertzen den kontuan hartuta. Ez du adimen artifizialik erabiltzen. Banaketa probabilistikoa da, eta zalantzazko kasuak estatistiketatik eta bilatzailetik kanpo geratzen dira.',
      i4: '<strong>Bikoizketak.</strong> Izen bera ikastetxe eta urte berean behin baino gehiagotan agertzen bada, behin bakarrik gordetzen da.',
      outro:
        'Ez dago pertsonen identifikatzailerik. Pertsona bera edizioen artean bere izen normalizatua bat datorrelako soilik ezagutzen da; beraz, izen, ikastetxe eta urte bera duten bi pertsona desberdin bakar gisa agertu daitezke.',
    },
    statistics: {
      title: 'Estatistikak eta laburpenak',
      p1: 'Tratatutako datuekin estatistikak kalkulatzen ditugu edizio bakoitzerako eta guztien multzorako: izen eta abizen ohikoenak, urteen zeharreko bilakaera, berritasunak eta desagerpenak, aniztasuna eta kontzentrazioa, eta ikastetxeen sailkapenak.',
      i1: 'Sailkapenek eta grafikoek <strong>datu agregatuak</strong> erakusten dituzte: izen, abizen edo bien konbinazio bat zenbat aldiz agertzen den.',
      i2: 'Izen eta abizen konbinazioen sailkapenek gutxienez bi aldiz agertzen diren bikoteak soilik hartzen dituzte barne, eta parte-hartzeak zenbatzen dituzte, ez pertsona desberdinak. Inoiz ez da pertsona baten izen osoa argitaratzen estatistika batean.',
      i3: 'Estatistikak berriro kalkulatzen dira edizio berri bat gehitzen den edo erregistro bat kentzen den bakoitzean.',
      ai: '<strong>IAz idatzitako laburpenak.</strong> Estatistiken azalpen-testu batzuk OpenAIren hizkuntza-eredu batek idazten ditu eta hainbat hizkuntzatara itzultzen dira. Ereduak datu agregatuak soilik jasotzen ditu (sailkapenak, serieak eta balioak), inoiz ez parte-hartzaileen lerroak. Esplizituki esaten zaio ez dezala pertsonen senidetasunik, jatorririk edo bestelako ezaugarririk ondorioztatu. Automatikoki sortutako edozein testu bezala, zehaztasun-gabeziak izan ditzake.',
    },
    search: {
      title: 'Parte-hartzaileen bilatzailea',
      p1: 'Bilatzaileak parte-hartzaile bat zein edizioetan agertzen den egiaztatzeko aukera ematen du. Zerrenda osoak arakatzeko erabil ez dadin, bi datu aldi berean adierazteko eskatzen du.',
      i1: '<strong>Zer eskatzen den.</strong> Izen osoa (gutxienez hiru hitz, gehienez 120 karaktere) eta ikastetxea, zerrenda batetik aukeratua.',
      i2: '<strong>Zer konparatzen den.</strong> Testua minuskulara eta azenturik gabe pasatzen da, eta ikastetxe horretako parte-hartzaileekin konparatzen da. Bat-etortze zehatzak eta bateragarriak onartzen dira (adibidez, bigarren izenik gabe edo bigarren abizenik gabe), baina inoiz ez lehen abizenik gabe.',
      i3: '<strong>Zer iragazten den.</strong> Izenaren eta abizenen banaketa fidagarritasunez ebatzi ahal izan den erregistroak soilik hartzen dira kontuan.',
      i4: '<strong>Zer erakusten den.</strong> Izena argitaratu zen bezala, ikastetxea eta agertzen den urteak, bakoitza argitaratu zen orrirako estekarekin. Bat-etortze zehatzak lehenengo erakusten dira, eta gero berrienak.',
      i5: '<strong>Zer ez den egiten.</strong> Ez da pertsona zehatzen gaineko konparaziorik edo puntuaziorik sortzen.',
      privacy:
        '<strong>Bilatzen duzunarekin zer gertatzen den.</strong> Izena zerbitzarira bidaltzen da eskaeraren gorputzean, ez orriaren helbidean, eta gure kodeak ez du gordetzen ez erregistratzen. Gehiegikeria mugatzeko, IP helbide bakoitzeko bilaketa kopurua mugatzen dugu: IParen hatz-marka zifratu bat erabiltzen dugu, zerbitzariaren memorian soilik gordetzen dena, ez IP argia. Ostatu-hornitzaileak eskaeren datu teknikoak erregistratu ditzake, hornitzaileen eta hirugarrenen atalean azaltzen den bezala.',
    },
    minors: {
      title: 'Adin txikikoak',
      p1: 'Datuak ateratzen diren konpainiak haur-konpainiak dira, beraz <strong>agertzen diren pertsona gehienak adin txikikoak dira</strong> edo argitaratu zen unean ziren. Argi esaten dugu jakin behar duzula uste dugulako.',
      p2: 'Komunikabide batek argitaratuta zuena soilik gordetzen dugu (izena, ikastetxea eta urtea), beste daturik gabe, eta ez dugu inor identifikatzen, kokatzen ez harekin harremanetan jartzen saiatzen. Tratamendu honen oinarri juridikoa tradizio publiko bati buruzko informazio estatistiko eta kulturala eskaintzeko interes legitimoa da, kaltetutako pertsonen eskubideekin orekatua.',
      p3: 'Tamborradatan agertzen bazara, edo agertzen den pertsona baten ama, aita edo tutorea bazara, eta ez agertzea nahiago baduzu, nahikoa da eskatzea. Ez da arrazoirik eman beharrik. Eskubideen atalean ikus dezakezu nola egin.',
    },
    cookies: {
      title: 'Cookieak eta analitika',
      p1: 'Tamborradatak ez ditu publizitate- edo jarraipen-cookierik erabiltzen, eta ez du hirugarrenen tresnarik profilak egiteko.',
      i1: '<strong>Hizkuntzaren cookiea.</strong> Webguneak <code>NEXT_LOCALE</code> izeneko cookie bat gorde dezake aukeratutako hizkuntzarekin (gaztelania, euskara edo ingelesa). Teknikoa da, zure lehentasuna gogoratzeko beharrezkoa, saiokoa, eta ez du datu pertsonalik.',
      i2: '<strong>Bisiten analitika.</strong> Vercel Analytics erabiltzen dugu zein orri bisitatzen diren modu agregatuan jakiteko. Hornitzailearen dokumentazioaren arabera, ez ditu cookieak erabiltzen eta ez zaitu webgune desberdinen artean jarraitzen.',
      i3: '<strong>Errendimendua.</strong> Vercel Speed Insights erabiltzen dugu orrien karga-abiadura neurtzeko (metrika teknikoak, adibidez karga-denbora, gailu mota edo nabigatzailea).',
      p2: 'Ez ditugu zure bilaketak nabigatzailean gordetzen, irekitako fitxaren memoriatik harago, fitxa ixtean ezabatzen dena.',
    },
    thirdParties: {
      title: 'Hornitzaileak eta hirugarrenak',
      intro: 'Funtzionatzeko, Tamborradata hornitzaile hauen gain dago:',
      i1: '<strong>Vercel.</strong> Webgunea ostatatzen du eta bisiten analitika eta errendimendu-metrikak eskaintzen ditu. Edozein ostatutan bezala, bere zerbitzariek eskaeren datu teknikoak erregistratu ditzakete, hala nola IP helbidea, eskatutako orria edo nabigatzailea.',
      i2: '<strong>Supabase.</strong> Parte-hartzaileak eta estatistikak gordetzen dituen datu-basea ostatatzen du.',
      i3: '<strong>OpenAI.</strong> Estatistiken laburpenak idazten eta itzultzen ditu. Datu agregatuak soilik jasotzen ditu, inoiz ez parte-hartzaileen izenak (ikus estatistiken atala).',
      i4: '<strong>SerpAPI eta Internet Archive.</strong> Jatorrizko orriak aurkitzeko prozesuan erabiltzen dira. Ez dute Tamborradataren bisitarien daturik jasotzen.',
      outro:
        'Ez ditugu datuak saltzen ezta hirugarrenei helburu komertzialekin laga ere. Hornitzaile horietako batzuek Europako Esparru Ekonomikotik kanpo trata ditzakete datuak, beren pribatutasun-politiketan eskaintzen dituzten bermeekin.',
    },
    rights: {
      title: 'Zure eskubideak eta datuen kentzea',
      intro: 'Eskubidea duzu:',
      i1: 'Zure daturik tratatzen dugun jakitea eta haietara sartzea.',
      i2: 'Datu okerra zuzentzeko eskatzea, adibidez gaizki idatzitako izen bat.',
      i3: 'Zure datuak ezabatzeko eskatzea (ezabatzeko eskubidea).',
      i4: 'Tratamenduaren aurka egitea edo mugatzeko eskatzea.',
      remove:
        '<strong>Izen bat nola kendu.</strong> Idatzi helbide honetara: <mail>{email}</mail>, izena agertzen den bezala, ikastetxea eta, gogoratzen baduzu, urtea adieraziz. Eskaera ama, aita edo tutore batek egiten badu, nahikoa da hala adieraztea. Egiaztapen minimo bat eska dezakegu eskaera zilegia dela ziurtatzeko.',
      response:
        'Gehiegizko atzerapenik gabe erantzungo dugu, eta, gehienez, hilabeteko epean. Erregistro bat kentzen denean bilatzailetik desagertzen da eta estatistikak berriro kalkulatzen dira, haren ekarpena zenbatu ez dadin.',
      limits:
        'Izen bat Tamborradatatik kentzeak ez du kentzen komunikabidearen jatorrizko orritik ezta Internet Archiveren kopietatik ere, gure esku ez daudenak. Gure erantzunarekin ados ez bazaude, kexa aurkez dezakezu Datuak Babesteko Espainiako Agentzian (aepd.es).',
    },
    retention: {
      title: 'Kontserbazioa eta segurtasuna',
      p1: 'Parte-hartzaileen datuak proiektua aktibo dagoen bitartean gordetzen ditugu, haien helburua zehazki edizioak denboran zehar konparatzea baita, edo kentzea eskatu arte.',
      p2: 'Datu-basea gure barne-eguneratze prozesuak soilik aldatzen du, eta webguneak zerbitzaritik soilik sartzen da haren barruan. Sarbide-gakoak ez daude nabigatzailean ageri.',
      p3: 'Ez dago sistema akatsik gabekorik. Datu pertsonalei eragiten dien intzidenteren bat antzemanez gero, aplikatu beharreko araudiaren arabera jardungo dugu.',
    },
    changes: {
      title: 'Politika honen aldaketak',
      p1: 'Politika hau eguneratu dezakegu datuak tratatzeko modua aldatzen denean, adibidez iturri berri bat edo tresna berri bat gehitzen badugu. Azken aldaketaren data orri honen hasieran ageri da.',
      p2: 'Tamborradata nola funtzionatzen duen edo zure datuei buruzko zalantzarik baduzu, idatz iezaguzu eta azalduko dizugu.',
    },
  },
} satisfies typeof esPrivacyPolicy;

export default privacyPolicy;

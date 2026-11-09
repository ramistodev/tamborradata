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
      'En 2008, Ane y Jon eran los nombres más repetidos entre los niños y niñas de la Tamborrada Infantil de Donostia. Les seguían Iñigo, Leire, María, Ander y Mikel. Eran los nombres que se escuchaban una y otra vez entre los niños de aquella generación.'
    ),
    text('Dieciocho años después, aquella lista parece de otra época.'),
    text(
      'En 2026, el nombre más repetido es Nora. Le siguen Ane, Jon, Sara y Maddi. De los diez nombres que encabezaban la clasificación de 2008, solo dos, Ane y Jon, continúan entre los diez primeros. Los otros ocho han salido de la cabeza de la lista.'
    ),
    text(
      'Pero cuando miramos los apellidos de esas mismas ediciones ocurre algo sorprendente.'
    ),
    text(
      'García, Fernández, González, Martínez, Rodríguez, Pérez, Sánchez, López, Gómez y Martín eran los diez apellidos más frecuentes en 2008. En 2026 siguen siendo los diez primeros. No ha entrado nadie y no ha salido ninguno: solo han cambiado de puesto entre ellos.'
    ),
    text(
      '¿Cómo puede cambiar tanto la forma en que llamamos a nuestros hijos mientras los apellidos permanecen prácticamente intactos?'
    ),
    text(
      'Para averiguarlo hemos recorrido las dieciséis ediciones publicadas en Tamborradata, de 2008 a 2026, y hemos buscado respuestas fuera de los datos: en archivos oficiales, en estudios sobre las migraciones del siglo XX y en la historia de una familia. Por el camino apareció un segundo enigma.'
    ),

    heading('Una lista que se renueva poco a poco'),
    text(
      'Lo primero que revelan las ediciones intermedias es que el relevo de los nombres no fue un golpe de efecto. De una edición a la siguiente suelen cambiar entre uno y tres de los diez primeros nombres. Son cambios pequeños que, sumados durante casi dos décadas, dejan una lista irreconocible. Con los apellidos ocurre lo contrario: en catorce de las otras quince ediciones, el Top 10 comparte nueve o diez apellidos con el de 2008.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Nora es el mejor ejemplo de esa lentitud. En 2008 era un nombre discreto, con ${f.int(trajectories.nora.count2008)} apariciones. Fue creciendo sin sobresaltos hasta llegar a ${f.int(trajectories.nora.count2026)} en 2026, unas ${f.int(perThousand.nora[perThousand.nora.length - 1])} de cada mil nombres registrados, y le bastó para encabezar la lista. A su lado, Telmo, Markel y Martin también fueron sumando apariciones, con altibajos, hasta entrar en el Top 10.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Al otro lado de la balanza, María pasó de ${f.int(trajectories.maria.count2008)} apariciones en 2008 a ${f.int(trajectories.maria.count2026)} en 2026, y Andrea, de ${f.int(trajectories.andrea.count2008)} a ${f.int(trajectories.andrea.count2026)}. Iñigo y Leire, que eran el tercero y el cuarto, han perdido más de la mitad de su peso. Ane y Jon resistieron arriba, aunque con algo menos de peso que entonces.`,
    },
    text(
      'Esta renovación no es una peculiaridad de la Tamborrada. Eustat, el instituto vasco de estadística, registra que los nombres que lideraron los nacimientos de Gipuzkoa entre 2022 y 2025 fueron Nora y June entre las niñas, y Luka, Martin y Markel entre los niños. Cuatro de ellos (Nora, June, Martin y Markel) están en el Top 10 de la Tamborrada de 2026.'
    ),

    heading('Una moda y un archivo'),
    text(
      'La explicación más sencilla está en cómo se decide cada cosa. Un nombre se elige: unos padres lo escogen en un momento concreto, con los gustos de su generación, y por eso las modas van y vienen. Un apellido no se elige: llega ya escrito, procedente de dos familias, y se transmite a la siguiente.'
    ),
    highlight('Los nombres se parecen a una moda; los apellidos, a un archivo.'),
    {
      kind: 'text',
      text: (f) =>
        `Los registros de la Tamborrada reflejan esos dos mecanismos con claridad. El Top 10 de nombres reunía en 2008 uno de cada cinco nombres registrados y hoy reúne uno de cada siete: el reparto se ha abierto y hay más variedad. En los apellidos pasa al revés: los diez primeros acumulan algo más que antes, del ${f.percent(share(concentration.y2008.topSurnames, concentration.y2008.surnameAppearances), 1)} al ${f.percent(share(concentration.y2026.topSurnames, concentration.y2026.surnameAppearances), 1)} de las apariciones. Mientras los niños se reparten entre más nombres, los apellidos se concentran un poco más en los de siempre.`,
    },
    text(
      'Y tampoco es una peculiaridad de la Tamborrada. Según el INE, a 1 de enero de 2025 los diez primeros apellidos de los residentes en Gipuzkoa son exactamente esos diez, con García a la cabeza. El INE cuenta solo el primer apellido, pero el resultado coincide.'
    ),
    highlight(
      'La lista de apellidos de la Tamborrada Infantil reproduce el mapa de apellidos de la provincia.'
    ),

    heading('Nombres vascos, apellidos castellanos'),
    text(
      'Hay un detalle en esas listas que parece no encajar. Entre los diez nombres más repetidos de 2008, ocho tienen forma vasca: Ane, Jon, Iñigo, Leire, Ander, Mikel, Asier e Iker. En 2026 todavía son cinco: Ane, Jon, Maddi, Nahia y Markel. Entre los diez apellidos más repetidos, en cambio, no hay ni uno de origen vasco, ni en 2008 ni en 2026.'
    ),
    text(
      '¿Cómo puede una ciudad llena de nombres vascos heredar apellidos castellanos? La respuesta empieza con una prohibición. El 18 de mayo de 1938, una orden del Ministerio de Justicia del Gobierno de Franco dispuso que, «tratándose de españoles, los nombres deberán consignarse en castellano». El preámbulo citaba expresamente Iñaki, Kepa y Koldobika como nombres que «denuncian indiscutible significado separatista».'
    ),
    text(
      'Los registros de la época muestran el efecto. Según el estudio de Gorrotxategi Nieto, del Servicio de Onomástica de Euskaltzaindia, casi una cuarta parte de los nacidos en 1937 en las Siete Calles de Bilbao llevaba un nombre en euskera; desde julio de aquel año, el autor no encontró ya ninguna inscripción de un nombre vasco. Entre las estrategias que recoge está la de inscribir a una niña como María Teresa para llamarla Maite en casa.'
    ),
    text(
      'Todo cambió con la Ley 17/1977, de 4 de enero, que permitió consignar los nombres «en alguna de las Lenguas españolas», y con el reglamento que la desarrolló, aprobado en diciembre de aquel año. Eustat observa el resultado en sus estadísticas de nacimientos: entre los padres nacidos entre 1979 y 1993, los nombres euskaldunes ya eran los predominantes, y ocho de los diez nombres más frecuentes de las madres nacidas entre 1982 y 1995 también lo eran. El euskera dejó de ser un nombre prohibido para convertirse en uno de los preferidos.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Pero la historia no es una línea recta. Entre los treinta nombres más repetidos de cada edición, los de forma vasca fueron ${f.int(figures.basqueTop30.y2008)} en 2008, subieron hasta ${f.int(figures.basqueTop30.peakLow)} o ${f.int(figures.basqueTop30.peakHigh)} entre 2013 y 2019 y han bajado cada año desde entonces hasta ${f.int(figures.basqueTop30.y2026)} en 2026. El descenso desde 2019 aparece con todos los criterios que hemos probado, más estrictos o más amplios. Lo que cambia con el criterio es la comparación con 2008: según cómo se cuente, 2026 queda desde unos cuatro puntos por encima hasta quince por debajo del nivel de aquel año. Los nombres vascos siguen muy presentes, pero desde 2019 pierden terreno en el Top 30.`,
    },

    heading('De dónde vienen los apellidos'),
    text(
      'Los apellidos cuentan otra historia, porque no responden al gusto de cada momento sino a quién llegó y quién se quedó. El Instituto de Historia Social Valentín de Foronda (UPV/EHU) describe las migraciones interiores hacia el País Vasco como «un fenómeno de extraordinaria importancia durante el siglo XX». En Gipuzkoa, el estudio firmado por Castells, Hernando, Izaola, Juaristi, López Romo y Zubero para la Fundación Ramón Rubial, publicado en 2018 y recogido por EFE, sitúa la población en unos 374.000 habitantes en 1950 y en 631.000 en 1970.'
    ),
    text(
      'Según ese mismo trabajo, en torno a la mitad de la población actual de Gipuzkoa tiene su origen fuera de Euskadi. Entre quienes llegaron, el censo de 1986 apuntaba sobre todo a Castilla y León (el 35 %), seguida de Extremadura (casi el 19 %), Navarra, Galicia y Andalucía.'
    ),
    text(
      'Esas personas se instalaron, formaron familias y transmitieron sus apellidos. Hay apellidos vascos, pero en la lista del INE para Gipuzkoa el primero que aparece es Larrañaga, en el puesto 13, seguido de Garmendia. Y la mezcla es habitual: un estudio del censo de 1998, citado por Montero en 2015, calculaba que en Euskadi uno de cada cuatro habitantes combinaba un apellido vasco con otro que no lo era, y algo más de la mitad no tenía ninguno vasco.'
    ),
    text(
      'Conviene no ir más allá de lo que se sabe. Los datos de la Tamborrada no dicen de dónde procede cada familia, y un apellido castellano no demuestra por sí solo una llegada reciente: pudo establecerse aquí mucho antes. Lo que sí sabemos es que el País Vasco del siglo XX recibió a muchísimas personas con esos apellidos, y que los apellidos, a diferencia de los nombres, no se renuevan con cada moda: se heredan.'
    ),

    heading('Una familia, dos caminos'),
    text(
      'Yo mismo soy un ejemplo. Me llamo Julen Ramos Arruti. Ramos me llegó por mi padre, que lo heredó de mi abuelo: mi abuelo nació en Segovia y vino a Tolosa en busca de una vida mejor, y la encontró. Mi abuela paterna siempre fue de Tolosa.'
    ),
    text(
      'Arruti viene de la familia de mi madre. Mi abuela era de Igantzi y mi aitona, de Gernika, llegó a Donostia después del bombardeo de Gernika, el 26 de abril de 1937. Hoy casi toda mi familia cercana vive en Donostia, y tengo primos y tíos segundos en Gernika, Igantzi, Tolosa y otros lugares.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `En mi nombre y mis apellidos conviven, por tanto, dos recorridos distintos: el de quien llegó a Gipuzkoa desde fuera de Euskadi y el de quien se desplazó a Donostia desde Bizkaia. Julen es un nombre de forma vasca que aparece ${f.int(figures.given.count2008)} veces en 2008 y ${f.int(figures.given.count2026)} en 2026; Ramos, ${f.int(figures.surname.count2008)} veces en 2008 y ${f.int(figures.surname.count2026)} en 2026, el mismo peso relativo en ambas ediciones. No es una prueba de nada: un solo caso no demuestra una tendencia. Pero ayuda a entenderla.`,
    },

    heading('Nombres que pasan, apellidos que se quedan'),
    text(
      'Ordenados año tras año, los nombres y los apellidos de la Tamborrada Infantil dejan ver dos ritmos distintos.'
    ),
    text(
      'Los nombres cuentan una ciudad que cambia de gustos y que recupera, tras décadas de prohibición, los nombres en euskera. Los apellidos guardan las huellas de familias que llegaron a Donostia desde muchos sitios, y de otras que ya estaban aquí.'
    ),
    text(
      'Cada niño o niña que desfila hoy recibió un nombre pensado para su tiempo y un apellido que ya venía de generaciones anteriores.'
    ),
    highlight(
      'Los nombres cambian porque cada generación elige. Los apellidos permanecen porque se heredan.'
    ),
    text(
      'Y cada edición de la Tamborrada Infantil vuelve a reunirlos en el mismo desfile.'
    ),
  ],
  data: {
    heading: 'La historia en datos',
    names: {
      lede: '**Solo Ane y Jon siguen en el Top 10 de nombres.** Los diez nombres más repetidos de la Tamborrada Infantil en 2008 y en 2026.',
      label2008: '2008',
      label2026: '2026',
    },
    overlap: {
      lede: '**Los nombres se alejan del Top 10 de 2008; los apellidos casi no se mueven.** Cuántos de los diez primeros de cada edición estaban ya entre los diez primeros de 2008 (no hay datos de 2009, 2010 ni 2021).',
      namesLabel: 'Nombres',
      surnamesLabel: 'Apellidos',
    },
    surnames: {
      lede: '**Los diez apellidos más repetidos son los mismos en la Tamborrada y en Gipuzkoa.** Puesto de cada apellido en la Tamborrada Infantil (2008 y 2026) y entre los residentes en Gipuzkoa (INE, 2025).',
      surnameColumn: 'Apellido',
      tamborrada2008Column: 'Tamborrada 2008',
      tamborrada2026Column: 'Tamborrada 2026',
      gipuzkoaColumn: 'Gipuzkoa (INE, 2025)',
    },
    perThousand: {
      lede: (f) =>
        `**Nora pasó de ${f.int(perThousand.nora[0])} a ${f.int(perThousand.nora[perThousand.nora.length - 1])} de cada mil nombres; María, de ${f.int(perThousand.maria[0])} a ${f.int(perThousand.maria[perThousand.maria.length - 1])}.** Apariciones por cada mil nombres registrados en cada edición (no hay datos de 2009, 2010 ni 2021).`,
      noraLabel: 'Nora',
      telmoLabel: 'Telmo',
      mariaLabel: 'María',
      aneLabel: 'Ane',
    },
    compare: {
      lede: '**Nombres vascos entre los favoritos, apellidos castellanos en la cabeza.**',
      leftLabel: 'Nombres de forma vasca en el Top 10',
      rightLabel: 'Apellidos de origen vasco en el Top 10',
      value: (early, recent) => `${early} de 10 en 2008 · ${recent} de 10 en 2026`,
    },
    basque: {
      lede: '**Los nombres de forma vasca bajan desde 2019.** Parte de las apariciones de los treinta nombres más repetidos de cada edición que corresponde a nombres de forma vasca, con tres criterios (no hay datos de 2009, 2010 ni 2021).',
      strictLabel: 'Criterio estricto',
      restrictiveLabel: 'Restrictivo',
      broadLabel: 'Amplio',
      chipsCaption: 'Los nombres que hemos contado como de forma vasca (criterio estricto)',
    },
  },
  used: {
    heading: 'Datos utilizados',
    blocks: [
      (f) =>
        `**Qué datos.** Estadísticas publicadas de Tamborradata sobre ${f.int(figures.editions)} ediciones de la Tamborrada Infantil: 2008, 2011 a 2020 y 2022 a 2026 (no hay datos de 2009, 2010 ni 2021). Consulta del 9 de noviembre de 2026, sobre las versiones publicadas el 18 de octubre de 2026.`,
      () =>
        '**Qué cuenta cada cifra.** Se cuentan participaciones, no personas: quien desfila varios años aparece varias veces. En los apellidos se cuentan el primero y el segundo, por eso suman más que los nombres. «De cada mil» son apariciones por cada mil nombres registrados en esa edición. Los datos no llevan tildes ni eñes (por ejemplo, «Inigo») y cada grafía de un apellido cuenta como un apellido distinto (Etxeberria y Echeverria, por ejemplo).',
      () =>
        '**Qué es un nombre de forma vasca.** Es una clasificación propia, porque la base no lo registra, sobre los treinta nombres más repetidos de cada edición. El criterio estricto cuenta los nombres cuya forma propia es vasca; el restrictivo deja fuera Nerea, Ainhoa, Iñigo, Aitor, Ander y Alain; el amplio añade Nora, June, Aitana, Alain, Laia, Luka y Telmo. El descenso desde 2019 aparece con los tres; la comparación con 2008 no.',
      () =>
        '**Límites.** Los datos no dicen de dónde procede cada familia ni por qué se elige un nombre. Las ediciones de 2011, 2012 y 2022 son más pequeñas (entre 2.800 y 3.300 participantes) y sus comparaciones, más inestables. El INE cuenta solo el primer apellido, y la cifra del censo de 1998 es de toda Euskadi y de segunda mano.',
      (f) =>
        `**Privacidad.** Solo se publican agregados; no hay ninguna cifra inferior a 5 (la menor que aparece es ${f.int(figures.smallestFigure)}).`,
    ],
    sourcesLead: '**Fuentes externas verificadas.**',
    sourceNotes: {
      castells: 'Cifras tal como las recogió EFE/Noticias de Gipuzkoa el 23-10-2018.',
      montero: 'Cita un estudio del censo de 1998 (Euskadi, de segunda mano).',
    },
  },
};

const texts: ArticleTexts = {
  title: 'Donostia cambia de nombres, pero conserva sus apellidos',
  description:
    'De los diez nombres más repetidos de la Tamborrada Infantil en 2008 solo dos siguen en el Top 10 de 2026, mientras que los diez apellidos principales son los mismos: una historia de modas, prohibiciones y migraciones.',
  category: 'Nombres y apellidos',
  readTime: '11 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

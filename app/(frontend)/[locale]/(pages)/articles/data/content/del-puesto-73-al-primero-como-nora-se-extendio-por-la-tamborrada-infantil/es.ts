import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, oneIn } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const copy: ArticleCopy = {
  story: [
    // Introduction: 2008 and 2026, without revealing the companies.
    {
      kind: 'text',
      text: (f) =>
        `En 2008, Ane era el nombre más repetido de la Tamborrada Infantil de Donostia. Entre los ${f.int(figures.y2008.participants)} participantes de aquella edición, ${f.int(figures.y2008.ane)} se llamaban así. Le seguían Jon, Iñigo, Leire y María, nombres que se escuchaban una y otra vez entre las compañías de la ciudad.`,
    },
    text('Mucho más abajo en aquella clasificación aparecía Nora.'),
    {
      kind: 'text',
      text: () =>
        `Solo catorce participantes se llamaban así. Se repartían entre ocho de las ${figures.y2008.companies} compañías registradas, y el nombre ocupaba el puesto ${figures.y2008.rank}.`,
    },
    text('Dieciocho años después, aquella lista parece pertenecer a otra generación.'),
    {
      kind: 'text',
      text: () =>
        `En 2026, Nora encabeza la clasificación. Hay ${figures.y2026.nora} participantes con ese nombre, por delante de Ane (${figures.y2026.ane}), Jon (${figures.y2026.jon}) y Sara (${figures.y2026.sara}). Ningún otro nombre la supera.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `En 2008 se llamaba Nora alrededor de uno de cada ${f.int(oneIn.y2008)} participantes. Hoy, uno de cada ${f.int(oneIn.y2026)}. En menos de veinte años, un nombre poco frecuente se ha convertido en el más repetido de la Tamborrada Infantil.`,
    },
    text(
      '¿Cómo consiguió un nombre que apenas se escuchaba en 2008 llegar a lo más alto de la clasificación? Para averiguarlo hay que seguirlo año a año y, después, mirarlo de cerca.'
    ),

    heading('Un nombre que empieza a oírse'),
    {
      kind: 'text',
      text: () =>
        'El primer obstáculo es que los datos no cubren todos los años. Tamborradata tiene dieciséis ediciones, las de 2008, 2011 a 2020 y 2022 a 2026, y no hay registros de 2009, 2010 ni 2021. Por eso el primer salto de Nora aparece de golpe: en 2008 era el puesto 73, con 14 participantes, y en 2011 ya era el 25, con 30. En tres años, más del doble.',
    },
    {
      kind: 'text',
      text: () =>
        `Después el ascenso se vuelve más gradual. En 2013 Nora era la 16.ª, con 55 participantes, y repitió puesto y cifra en 2014. En ${figures.top10Year} entró por primera vez entre los diez primeros: novena, con 65. Desde 2008 había subido ${figures.placesClimbed2015} puestos.`,
    },

    heading('Una competidora para Ane y Jon'),
    text(
      'El siguiente salto llegó en 2016. Nora fue cuarta, con 78 participantes, por detrás de Ane (108), Ander (86) y Jon (85). Entre 2016 y 2019 se movió entre la cuarta y la quinta posición, siempre con entre 75 y 82 participantes. Fue una meseta larga, pero ya en la parte alta de la clasificación.'
    ),
    {
      kind: 'text',
      text: () =>
        `En 2020 la meseta se rompió: Nora fue segunda, con 93 participantes. Solo Ane, con 113, quedaba por delante. La distancia que las separaba, de ${figures.gap2008} participantes en 2008, se había reducido a ${figures.gap2020}.`,
    },

    heading('El primer puesto, con asterisco'),
    {
      kind: 'text',
      text: (f) =>
        `Tras el hueco de 2021 llegó una edición muy distinta. La de 2022 fue excepcional, con ${figures.y2022.companies} compañías y ${f.int(figures.y2022.participants)} participantes, frente a las ${figures.y2020.companies} compañías y los ${f.int(figures.y2020.participants)} participantes de 2020. En ella Nora fue primera por primera vez, con ${figures.y2022.nora} participantes frente a los ${figures.y2022.ane} de Ane. Dos participantes de diferencia no bastan para hablar de relevo, y los datos lo confirman: en 2023 y 2024 Ane volvió a quedar por delante, con 118 frente a 106 y con 114 frente a 103.`,
    },
    text(
      'La confirmación llegó en 2025. Nora fue primera con 101 participantes y Ane, segunda, con 93. En 2026 el primer puesto se repitió con la cifra más alta de toda la serie de Nora: 110 frente a 99. Esta vez no había una edición reducida de por medio.'
    ),
    {
      kind: 'text',
      text: () =>
        `Entre 2008 y 2026 Nora ha sumado ${figures.y2026.nora - figures.y2008.nora} participantes, mientras que Ane ha pasado de ${figures.y2008.ane} a ${figures.y2026.ane}, quince menos. Su ascenso forma parte de un relevo más amplio de nombres, que contamos en «Donostia cambia de nombres, pero conserva sus apellidos».`,
    },
    highlight('Nora llegó arriba más por lo que sumó ella que por lo que perdió Ane.'),

    heading('La primera de la Tamborrada no es la primera de cada compañía'),
    text(
      'Hasta aquí hemos hablado de la Tamborrada Infantil en conjunto. Pero la Tamborrada no es un único desfile: cada compañía tiene el suyo. Si Nora es el nombre más repetido del total, parece razonable esperar que lo sea también en la mayoría de las compañías.'
    ),
    {
      kind: 'text',
      text: () =>
        `No es así. En 2026 Nora es el nombre más repetido de solo cuatro de las ${figures.y2026.companies} compañías: Amara Berri (10 participantes), Kresala Txiki (9), Sagrado Corazón Mundaiz (7) y Zurriola Ikastola (6). En las demás el favorito es otro: Martín en Ekintza, Martina en la Deutsche Schule, Ane en Santo Tomás, June en Ikasbide.`,
    },
    text(
      'Ane, la segunda del total, lidera en solitario tres compañías y comparte el primer puesto en otras dos. Nora, la primera, lidera en solitario cuatro.'
    ),
    {
      kind: 'text',
      text: () =>
        `Que la primera del conjunto sea la primera de tan pocas compañías tiene explicación: son dos carreras distintas. Para encabezar una compañía bastan entre 6 y 10 participantes: en las cuatro que lidera Nora, que tienen entre 133 y ${figures.amaraBerri2026} participantes cada una, esa es la cifra que le da el primer puesto. Para encabezar el conjunto hay que sumar en todas partes. Nora llega a ${figures.y2026.nora} con una media de algo más de tres participantes en cada una de las ${figures.y2026.companiesWithNora} compañías donde aparece, sin acumularse en ninguna: la mayor, Amara Berri, reúne diez, el ${figures.biggestCompanySharePct} % del total.`,
    },
    text(
      'En La Salle, por ejemplo, Ane reúne 10 participantes y Nora 8. Ane gana allí, pero esos 8 son también 8 de los 110 de Nora. Un primer puesto en una compañía vale mucho en esa compañía; un segundo o un tercero suman igual al total.'
    ),
    {
      kind: 'text',
      text: () =>
        `El recuento completo lo deja ver. Nora está entre los tres primeros nombres de ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} compañías: primera en ${figures.noraRankBuckets.first} y segunda o tercera en otras ${figures.noraRankBuckets.second3}. Ocupa un puesto entre el cuarto y el décimo en ${figures.noraRankBuckets.fourTo10} más, queda por debajo en ${figures.noraRankBuckets.eleven} y en ${figures.noraRankBuckets.none} no tiene ninguna participante.`,
    },
    highlight('Ser el nombre más repetido de la Tamborrada no es lo mismo que serlo en cada compañía.'),

    heading('¿Cómo llegó Nora a tantas compañías?'),
    {
      kind: 'text',
      text: () =>
        `La respuesta empieza por una comparación. En 2008 había Nora en ${figures.y2008.companiesWithNora} de las ${figures.y2008.companies} compañías. En 2026, en ${figures.y2026.companiesWithNora}. La paradoja tiene aquí su explicación: Nora se hizo presente en casi toda la Tamborrada Infantil sin llegar a ser el favorito de la mayoría de las compañías.`,
    },
    {
      kind: 'text',
      text: () =>
        `Y esa expansión llegó antes que el liderazgo. En 2011 había Noras en ${figures.companies2011} compañías. En 2013, cuando Nora era todavía la ${figures.companies2013Rank}.ª del total, ya estaba en ${figures.companies2013}. Entre 2014 y 2020 la cifra se movió entre 32 y 34, y en 2023 llegó a ${figures.companies2023} de las ${figures.registered2023} compañías de aquella edición, su máximo. En 2026 son ${figures.y2026.companiesWithNora}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Hay un detalle más. Entre 2008 y 2013 Nora pasó de 14 a 55 participantes, pero ese aumento coincide con su llegada a compañías nuevas y no con más participantes en cada una: la media apenas cambió, de ${f.decimal(figures.perCompany2008, 2)} por compañía a ${f.decimal(figures.perCompany2013, 2)}. En esos años el nombre crecía pasando de una compañía a otra. A partir de 2013 ocurrió lo contrario: ya estaba en casi todas y lo que creció fue el número de Noras dentro de cada una, hasta ${f.decimal(figures.perCompany2020, 2)} en 2020 y ${f.decimal(figures.perCompany2026, 2)} en 2026.`,
    },
    highlight('Primero se extendió; después se afianzó.'),

    heading('¿Eligen todas las compañías los mismos nombres?'),
    text(
      'La paradoja de Nora plantea otra cuestión: si cada compañía tiene sus favoritos, cabe medir cuánto se parecen entre sí.'
    ),
    text(
      'Algunas preferencias son persistentes. En la Deutsche Schule, Martina ha sido el nombre más repetido en las cuatro ediciones de 2023 a 2026. En Ekintza, Martín ha encabezado o compartido el primer puesto en las cuatro, y ha sido el único primero en 2025 y 2026. Pero son excepciones. En la mayoría de las compañías el primer puesto cambia casi cada año. En Santo Tomás fue Jon en 2023, Jon y Mikel en 2024, Maddi en 2025 y Ane en 2026. En La Salle, Lucía en 2023 y 2024, Ane y Nora a la par en 2025 y Ane en 2026.'
    ),
    text(
      'El liderazgo de Nora en sus cuatro compañías es, además, reciente. En 2023 no encabezaba ninguna de las cuatro; hoy las encabeza todas. En Amara Berri, por ejemplo, el primer puesto fue de Nahia en 2023 y 2024, estuvo compartido por Maddi y Nora en 2025 y pasó a Nora en 2026.'
    ),
    {
      kind: 'text',
      text: () =>
        `Los diez nombres favoritos de cada compañía también se parecen poco entre sí. Si se comparan las ${figures.top10Overlap.companies} compañías presentes en las cuatro ediciones de 2023 a 2026, dos compañías cualesquiera comparten, de media, menos de dos de sus diez nombres más repetidos. Si los participantes se repartieran al azar entre esas mismas compañías, compartirían algo más de cuatro. Las compañías se parecen entre sí menos de lo que cabría esperar si el reparto fuese casual.`,
    },
    {
      kind: 'text',
      text: () =>
        `Y hay nombres de primera línea que casi no pisan algunos centros. Ane, la segunda de la Tamborrada, no aparece ni una vez entre los ${figures.amaraBerri2026} participantes de Amara Berri en 2026. En cuanto a Nora, en San José Ikastetxea no ha aparecido ninguna en las ${figures.sanJoseEditions} ediciones en las que la compañía está registrada, y la Deutsche Schule, que figura en las ${figures.deutscheEditions}, ha tenido alguna en ${figures.deutscheEditionsWithNora} de ellas, pero siempre en cifras muy pequeñas.`,
    },
    text(
      'Los datos muestran estas diferencias, no su causa. No registran el nivel económico de las familias, su procedencia ni el modelo lingüístico de cada compañía, así que no atribuimos las diferencias a ninguno de esos factores.'
    ),

    heading('¿Por qué Nora?'),
    {
      kind: 'text',
      text: () =>
        `Es la pregunta que queda, y la que menos se puede responder. Una referencia externa ayuda a situar el nombre. Eustat, el instituto vasco de estadística, publica los nombres de las niñas nacidas en Euskadi, y entre 2022 y 2025 Nora está siempre arriba. En Gipuzkoa fue el nombre de niña más frecuente en 2022 y 2023, el segundo en 2024 y el tercero en 2025. En Donostia fue segundo, primero, segundo y tercero. En el conjunto de Euskadi ocupó los puestos séptimo, cuarto, tercero y cuarto, con entre 90 y 113 nacimientos al año.`,
    },
    text(
      'Nora no es un nombre exclusivo de la Tamborrada: sigue siendo uno de los más elegidos entre las niñas que nacen ahora en Gipuzkoa. Lo que no permite es reconstruir su historia anterior ni medir cuánto tarda un nombre en pasar de los nacimientos a la Tamborrada. Las tablas de Eustat que hemos podido comprobar solo cubren de 2022 a 2025, y nuestros datos no incluyen la edad de cada participante.'
    ),
    text(
      'Tampoco hemos encontrado ninguna fuente comprobada que explique por qué las familias eligen Nora. Es una pregunta abierta, y preferimos dejarla así antes que inventar una respuesta.'
    ),

    heading('Catorce Noras en ocho compañías'),
    {
      kind: 'text',
      text: () =>
        `En 2008, quien se llamaba Nora era una excepción: catorce participantes repartidas en ocho compañías, y en las otras ${figures.y2008.companies - figures.y2008.companiesWithNora} no había ninguna. Dieciocho años después, la proporción se ha dado la vuelta. Son ${figures.y2026.companiesWithNora} las compañías con alguna Nora y ${figures.y2026.companiesWithoutNora} las que no tienen ninguna.`,
    },
    text(
      'Pero no se ha convertido en el favorito de todas. En la mayoría de las compañías el nombre más repetido sigue siendo otro, y cada una conserva sus preferencias. La historia de Nora no es la de un nombre que se hizo el favorito de todas las compañías, sino la de uno que consiguió estar presente en casi todas.'
    ),
    text(
      'Cada edición de la Tamborrada Infantil es una fotografía de una generación. Quien desfiló en 2008 tuvo a Ane y a Jon por todas partes. Quien desfila ahora puede encontrar una Nora en más de cuatro de cada cinco compañías.'
    ),
  ],
  data: {
    heading: 'La historia en datos',
    rise: {
      lede: (f) =>
        `**Nora pasa de ${figures.y2008.nora} a ${figures.y2026.nora} participantes y supera a Ane en tres ediciones: 2022, 2025 y 2026.** Participantes con cada nombre en cada edición. La de 2022 fue excepcional, con ${f.int(figures.y2022.participants)} participantes (no hay datos de 2009, 2010 ni 2021).`,
      noraLabel: 'Nora',
      aneLabel: 'Ane',
    },
    milestones: {
      lede: '**Nora entra en el Top 10 en 2015 y es primera en 2022, 2025 y 2026.** Su puesto en la clasificación de cada edición, su número de participantes y las compañías en las que aparece.',
      columns: ['Edición', 'Puesto', 'Participantes', 'Compañías con Nora'],
      companiesCell: (withNora, registered) => `${withNora} de ${registered}`,
    },
    leaders: {
      lede: '**Cada compañía tiene su favorito.** El nombre más repetido de algunas compañías en 2026 y cuántos participantes lo llevan (solo compañías con seis o más). Nora, destacada.',
      barUnit: 'participantes',
    },
    position: {
      lede: () =>
        `**Nora es primera en ${figures.noraRankBuckets.first} de las ${figures.y2026.companies} compañías, está entre las tres primeras en ${figures.noraRankBuckets.first + figures.noraRankBuckets.second3} y no tiene ninguna participante en ${figures.noraRankBuckets.none}.** Puesto de Nora dentro de cada compañía en 2026 (los empates comparten puesto).`,
      first: '1.ª',
      secondThird: '2.ª o 3.ª',
      fourthToTenth: '4.ª a 10.ª',
      eleventhOrLower: '11.ª o más',
      none: 'Ninguna',
    },
    waffles: {
      lede: '**En 2008 había Noras en ocho compañías; en 2026, en 35.** Compañías con al menos una participante llamada Nora. Cada círculo es una compañía.',
      label2008: () =>
        `2008: ${figures.y2008.companiesWithNora} de ${figures.y2008.companies} compañías con alguna Nora`,
      label2026: () =>
        `2026: ${figures.y2026.companiesWithNora} de ${figures.y2026.companies} compañías con alguna Nora`,
    },
    spread: {
      lede: () =>
        `**Nora ya estaba en ${figures.companies2013} compañías en 2013, cuando era la ${figures.companies2013Rank}.ª del total.** Compañías con alguna Nora en cada edición. En 2012 y 2022 hubo menos compañías (25 y 26, frente a entre 40 y 45 en las demás ediciones). No hay datos de 2009, 2010 ni 2021.`,
      label: 'Compañías con alguna Nora',
    },
    perCompany: {
      lede: (f) =>
        `**La media de Noras por compañía pasa de ${f.decimal(figures.perCompany2013, 2)} en 2013 a ${f.decimal(figures.perCompany2026, 2)} en 2026.** Participantes llamadas Nora dividido entre las compañías en las que aparecen.`,
      label: 'Noras por compañía donde aparece',
    },
    persistence: {
      lede: '**Algunos favoritos se mantienen; la mayoría cambia casi cada año.** Nombre más repetido de algunas compañías en cada edición.',
      columns: ['Compañía', '2023', '2024', '2025', '2026'],
      and: 'y',
      tie: '(empate)',
      many: 'Varios nombres empatados',
    },
    overlap: {
      lede: '**Dos compañías comparten de media menos de dos de sus diez nombres favoritos; con un reparto al azar compartirían más de cuatro.** Nombres en común entre los diez más repetidos de dos compañías, con las 41 presentes en las cuatro ediciones de 2023 a 2026.',
      leftLabel: 'Reparto al azar entre las mismas compañías',
      rightLabel: 'Compañías reales',
      value: (shared) => `${shared} de 10 nombres en común`,
    },
    eustat: {
      lede: '**Entre las niñas nacidas de 2022 a 2025, Nora estuvo siempre entre los tres primeros nombres de Gipuzkoa y de Donostia.** Puesto de Nora entre los nombres de niña de cada año de nacimiento (Eustat).',
      columns: ['Año de nacimiento', 'Euskadi', 'Gipuzkoa', 'Donostia'],
    },
  },
  used: {
    heading: 'Datos utilizados',
    blocks: [
      (f) =>
        `**Qué datos.** Estadísticas publicadas de Tamborradata sobre ${f.int(figures.editions)} ediciones de la Tamborrada Infantil: 2008, 2011 a 2020 y 2022 a 2026 (no hay datos de 2009, 2010 ni 2021), y recuentos agregados sobre las participaciones de esas ediciones. Consulta del 9 de noviembre de 2026, sobre las versiones publicadas el 18 de octubre de 2026.`,
      (f) =>
        `**Qué cuenta cada cifra.** Se cuentan participaciones, no personas: quien desfila varios años aparece varias veces. Cada participante cuenta una vez por su nombre principal, y los nombres compuestos cuentan por el primero. Los datos no llevan tildes ni eñes (por ejemplo, «Inigo»). Las clasificaciones son las publicadas. Con el mismo número de participantes, el orden lo fija la publicación: en 2008 cuatro nombres reunían 14 participantes y el de Nora es el último de ese grupo, el puesto 73, con 69 nombres por encima; ocurre algo parecido en 2013, 2015 y 2017. Las listas publicadas suman ${f.int(4012)} nombres identificados en 2008 y ${f.int(5276)} en 2026, de ${f.int(figures.y2008.participants)} y ${f.int(figures.y2026.participants)} participantes.`,
      () =>
        '**Qué es una compañía.** Cada una de las entidades registradas en Tamborradata: colegios, ikastolas y otras agrupaciones. En 2026 son 43; el número varía por edición (45 en 2011, 2023 y 2024; 25 en 2012 y 26 en 2022). Un nombre «encabeza» una compañía cuando reúne más participantes que ningún otro; si hay empate, se dice. Ane lidera en solitario tres compañías y comparte el primer puesto en otras dos; Nora lidera en solitario cuatro. El puesto de Nora dentro de cada compañía, en el gráfico, deja que los empates compartan puesto.',
      () =>
        '**Cómo se comparan los favoritos de las compañías.** Se toman las 41 compañías presentes en las cuatro ediciones de 2023 a 2026, se suman las cuatro ediciones y se calculan los diez nombres más repetidos de cada una (los empates en el décimo puesto se resuelven por orden alfabético). Se cuentan los nombres que comparten las 820 parejas posibles de compañías. Para el reparto al azar se reasignan los participantes entre las mismas compañías, respetando el tamaño de cada una, y se repite el cálculo: tres repeticiones dieron entre 4,1 y 4,2 nombres en común.',
      () =>
        '**Límites.** Los datos no recogen la edad, el género ni el origen de los participantes, ni las razones de cada familia. Las ediciones de 2012 y 2022 son más pequeñas (2768 y 2849 participantes) y sus comparaciones, más inestables. Las tablas de Eustat que hemos podido comprobar cubren solo los nacidos de 2022 a 2025 y muestran los puestos, no los nacimientos por territorio. No hemos podido comprobar una entrada de Euskaltzaindia sobre el nombre ni una serie anterior de nacimientos, así que no medimos desfases ni explicamos causas.',
      (f) =>
        `**Privacidad.** Solo se publican agregados; no hay ninguna cifra de participantes inferior a 5 (la menor que aparece es ${f.int(figures.smallestFigure)}). Cuando un recuento por compañía y edición es menor, se muestra solo como empate o no se muestra.`,
    ],
    sourcesLead: '**Fuentes externas verificadas.**',
  },
};

const texts: ArticleTexts = {
  title: 'Del puesto 73 al primero: cómo Nora se extendió por la Tamborrada Infantil',
  description:
    'En 2008, Nora era el puesto 73 de la Tamborrada Infantil de Donostia, con 14 participantes en ocho compañías. En 2026 es el nombre más repetido, con 110 en 35 compañías, aunque solo encabeza cuatro.',
  category: 'Nombres',
  readTime: '11 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

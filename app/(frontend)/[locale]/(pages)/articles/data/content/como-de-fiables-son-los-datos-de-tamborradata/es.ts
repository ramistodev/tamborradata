import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import { figures, participations, ambiguous } from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = participations.length - 1;

const copy: ArticleCopy = {
  story: [
    {
      kind: 'text',
      text: (f) =>
        `En 2026, Tamborradata recoge ${f.int(participations[last])} participantes de la Tamborrada Infantil. De ellos, ${ambiguous[last]} no aparecen en ninguna clasificación de nombres: el programa que ordena los datos no supo decidir cuál era su nombre y cuál su apellido, y prefirió dejarlos fuera antes que adivinar.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Es una parte muy pequeña, pero resume la pregunta de este artículo. Cada vez que Tamborradata dice que Nora es el nombre más repetido o que García es el apellido más frecuente, detrás hay ${f.int(figures.total)} filas copiadas de listas publicadas a lo largo de dieciséis ediciones. Son listas escritas por personas distintas, en formatos distintos y a veces con errores que ya venían de origen. ¿Cómo de fiables son, entonces, los datos de Tamborradata?`,
    },
    text(
      'Para responder hemos hecho tres pruebas. Primero, compararlos con fuentes externas, empezando por la más exigente: las cifras de la propia organización. Segundo, comprobar que las cuentas cuadran consigo mismas. Y tercero, la menos cómoda: enseñar lo que no se ha podido limpiar.'
    ),

    heading('La prueba más dura: las cifras de la organización'),
    {
      kind: 'text',
      text: (f) =>
        `Donostia Kultura, que organiza la Tamborrada, publica cada año cuántos niños y niñas desfilan en la Tamborrada Infantil y de cuántos centros proceden. Las cifras de Tamborradata no coinciden a primera vista, y la diferencia va en dos direcciones. Hasta 2020 son algo más bajas: ${f.int(4807)} participantes en 2017 frente a ${f.int(4977)}, y ${f.int(4683)} en 2020 frente a ${f.int(4828)}. Desde 2023 son entre un 10 % y un 12 % más altas: ${f.int(5219)} frente a ${f.int(4731)} en 2023, ${f.int(5320)} frente a ${f.int(4732)} en 2024 y ${f.int(5149)} frente a ${f.int(4625)} en 2025.`,
    },
    text(
      'La explicación parece estar en cuatro compañías. Desde 2022 los datos de Tamborradata incluyen las tamborradas infantiles de tres sociedades, Amaratarra Txiki, Kresala Txiki y Gaztelubide Txiki, y la de la Unión Artesana. La organización las cita aparte en sus memorias, y la de la Unión Artesana desfiló el 19 de enero de 2023, un día antes del desfile principal.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Si se restan esas cuatro, las cifras casi se juntan: ${f.int(4672)} frente a ${f.int(4731)} en 2023, ${f.int(4710)} frente a ${f.int(4732)} en 2024 y ${f.int(4506)} frente a ${f.int(4625)} en 2025, entre un 0,5 % y un 2,6 % menos. Las compañías también casan: la organización habla de 41 centros en 2023 y en 2024 y de 38 en 2025, y sin esas cuatro Tamborradata cuenta 41, 41 y 38. En 2017 son 42 en ambos casos. Sin esas compañías, además, el total de 2023 (${f.int(4672)}) es algo menor que el de 2020 (${f.int(4683)}): buena parte del salto aparente se debe a que la base incorpora compañías nuevas, no a que desfilen más niños.`,
    },
    text(
      'Es una explicación que encaja con los números, pero no está confirmada: la organización no dice qué incluye exactamente en su recuento. Y queda un resto. Tamborradata tiene entre un 0,5 % y un 3,4 % menos participantes que la organización en todos los años comparados, y en 2020 una compañía menos (40 frente a 41). Puede deberse a listas incompletas en el origen o a otras diferencias de recuento; los datos no permiten decirlo.'
    ),
    highlight('Sin las compañías txiki, los datos de Tamborradata de 2023 son algo menores que los de 2020.'),

    heading('¿Coinciden con lo que dicen otras fuentes?'),
    text(
      'Los apellidos son la comparación más limpia. Los diez más repetidos de la Tamborrada Infantil en 2026 (García, González, Martínez, Fernández, Rodríguez, Pérez, López, Sánchez, Martín y Gómez) son exactamente los diez primeros apellidos de los residentes en Gipuzkoa según el INE a 1 de enero de 2025. Algunos cambian de puesto: Martínez es tercero en la Tamborrada y octavo en Gipuzkoa. Pero no falta ni sobra ninguno.'
    ),
    text(
      'Con los nombres la comparación es más débil, aunque apunta en la misma dirección. Eustat, el instituto vasco de estadística, publica los nombres de los recién nacidos de Gipuzkoa. Los que lideraron entre 2022 y 2025 fueron Nora y June entre las niñas, y Luka, Martin y Markel entre los niños. Cuatro de esos cinco, Nora, June, Martin y Markel, están entre los diez primeros de la Tamborrada de 2026.'
    ),
    text(
      'Estas coincidencias dicen algo concreto y callan otra cosa. Que los apellidos de la Tamborrada coincidan con los de Gipuzkoa indica que los participantes se parecen a la población que los rodea. No demuestra que cada fila esté bien copiada: una lista con errores repartidos al azar daría un resultado parecido, porque el ruido no cambia los apellidos más comunes. Y las poblaciones no son las mismas: el INE cuenta residentes de todas las edades y solo el primer apellido, y Eustat cuenta recién nacidos, no participantes.'
    ),
    highlight('Que los datos se parezcan a su entorno prueba que son representativos, no que estén bien copiados.'),

    heading('¿Cuadran las cuentas?'),
    {
      kind: 'text',
      text: (f) =>
        `Para saber si están bien copiados hay que mirar hacia dentro. Cada edición tiene dos cifras: las participaciones que hay en la base de datos y los nombres identificados que suman las clasificaciones publicadas. No coinciden. En 2026 hay ${f.int(participations[last])} participaciones y ${f.int(participations[last] - ambiguous[last])} nombres identificados; en 2008, ${f.int(participations[0])} y ${f.int(participations[0] - ambiguous[0])}.`,
    },
    text(
      'La diferencia no es un descuadre, sino una cuenta que se explica sola. Edición por edición, las participaciones que faltan en las clasificaciones son exactamente las ambiguas: 22 en 2026, 28 en 2008, 10 en 2013. Las dieciséis ediciones cuadran al caso. Un recuento propio de Nora, hecho desde cero sobre las filas, también coincide con las clasificaciones publicadas: 14 en 2008 y 110 en 2026.'
    ),

    heading('¿Qué no se ha podido limpiar?'),
    text(
      'Esta es la parte que más hay que enseñar. Tamborradata no inventa los datos: los copia de listas publicadas y los ordena con un programa. Pero hay cosas que ya venían mal de origen y que ningún programa puede arreglar sin adivinar.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `Lo más visible son las ${figures.ambiguous} participaciones ambiguas, el ${f.decimal(figures.ambiguousPct, 1)} % del total. En ${figures.ambiguousShortNames} de ellas el nombre escrito tiene una o dos palabras y en ${figures.ambiguousThreeWords}, tres: con tan pocas palabras hay poco en lo que apoyarse para separar el nombre de los apellidos. Se quedan fuera de las clasificaciones de nombres. Hay además ${figures.noPrimaryName} participaciones en las que el programa no pudo fijar un nombre principal.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Luego están los formatos del origen. En 2008, el ${f.decimal(figures.commaShare2008, 1)} % de las entradas venía escrito como «Apellidos, Nombre», y en 2017, el ${f.decimal(figures.commaShare2017, 1)} %; en el resto de ediciones casi ninguna. Hay ${figures.singleWord} entradas de una sola palabra (11 de ellas en 2012 y 5 en 2017), ${figures.parentheses} con paréntesis y ${figures.sixOrMoreWords} con seis o más palabras. La mayoría se ha resuelto, pero cada fila que se aparta de la forma habitual tiene más probabilidad de acabar mal asignada.`,
    },
    highlight('Ante la duda, Tamborradata deja la participación fuera de los nombres antes que adivinarla.'),
    {
      kind: 'text',
      text: (f) =>
        `Y hay una zona gris más grande: ${f.int(figures.lowConfidence)} participaciones, el ${f.decimal(figures.lowConfidencePct, 1)} %, se resolvieron con una confianza baja. El programa les asignó un nombre, pero con menos seguridad de la habitual. Su peso no es constante: era del ${f.decimal(figures.lowConfidence2008Pct, 1)} % en 2008, bajó hasta el ${f.decimal(figures.lowConfidenceMin, 1)} % hacia 2018 y 2020 y ha vuelto a subir hasta el ${f.decimal(figures.lowConfidence2026Pct, 1)} % en 2026. No sabemos por qué: los datos solo permiten constatar el cambio.`,
    },
    {
      kind: 'text',
      text: () =>
        `Hay más ruido de origen en lo que parece más sencillo. Las ${figures.companiesRegistered} compañías de la base de datos aparecen escritas de ${figures.companyAliases} maneras distintas, hasta ${figures.maxAliases} para una sola, y se unifican con una tabla de equivalencias. Y los datos no llevan tildes ni eñes, por lo que Iñigo figura como «Inigo», y Ane y Ana cuentan como nombres distintos.`,
    },

    heading('Tres ediciones incompletas'),
    {
      kind: 'text',
      text: (f) =>
        `La limitación más seria no está en las filas, sino en las ediciones. En 2012 y 2022 faltan compañías enteras: solo hay datos de ${figures.partial2012.companies} y de ${figures.partial2022.companies}, frente a las 40 a 45 de las demás. Las que aparecen tienen su tamaño habitual: las ${figures.partial2012.sizeVs2013.common} compañías de 2012 que también están en 2013 suman ${f.int(figures.partial2012.sizeVs2013.edition)} participantes frente a ${f.int(figures.partial2012.sizeVs2013.reference)} al año siguiente, y las ${figures.partial2022.sizeVs2020.common} de 2022 que estaban en 2020 suman ${f.int(figures.partial2022.sizeVs2020.edition)} frente a ${f.int(figures.partial2022.sizeVs2020.reference)}. El hueco es de compañías, no de participantes dentro de cada una.`,
    },
    text(
      'En 2011 ocurre lo contrario: están casi todas las compañías, 45, pero muchas con la lista a medias. De las 42 que también figuran en 2013, 15 aparecen con menos del 60 % de los participantes que registran dos años después, y 21 con menos del 80 %.'
    ),
    text(
      'No sabemos si faltan porque no desfilaron o porque el origen no las publicó. Los datos solo permiten decir que no están, y por eso las comparaciones entre ediciones deben hacerse con proporciones mejor que con cifras absolutas.'
    ),

    heading('Para qué sirven y para qué no'),
    text(
      'La respuesta honesta tiene tres partes. Dentro de una edición completa, las clasificaciones de nombres y apellidos son fiables: las cuentas cuadran y los apellidos coinciden con los de Gipuzkoa. Entre ediciones, las proporciones aguantan mejor que las cifras absolutas, sobre todo con 2011, 2012 y 2022. Y en el detalle fino, una compañía concreta en un año concreto, un solo caso mal resuelto puede mover un nombre de puesto.'
    ),
    {
      kind: 'text',
      text: () =>
        `De vuelta a aquellos ${ambiguous[last]} participantes de 2026 que quedaron fuera de los nombres: son la prueba de que el sistema duda cuando debe dudar. Una lista que nunca duda sería mucho menos de fiar.`,
    },
  ],
  data: {
    heading: 'La historia en datos',
    surnames: {
      lede: '**Los diez apellidos más repetidos de la Tamborrada son los diez primeros de Gipuzkoa.** Puesto de cada apellido en la Tamborrada Infantil de 2026 y entre los residentes en Gipuzkoa (INE, 2025).',
      columns: ['Apellido', 'Tamborrada 2026', 'Gipuzkoa (INE, 2025)'],
    },
    names: {
      lede: '**Cuatro de los cinco nombres que lideran los nacimientos en Gipuzkoa están en el Top 10 de la Tamborrada.** Nombres del Top 10 de 2026 que también lideraron los nacimientos de Gipuzkoa entre 2022 y 2025 (Eustat).',
      caption: 'Nombres en común',
    },
    official: {
      lede: '**Sin las cuatro compañías txiki, Tamborradata queda entre un 0,5 % y un 3,4 % por debajo de las cifras de la organización.** Participantes y centros según Donostia Kultura (la cifra de 2025, según Orain) y según Tamborradata, sin Unión Artesana, Amaratarra Txiki, Kresala Txiki ni Gaztelubide Txiki. No hay cifra comparable de las demás ediciones.',
      columns: [
        'Edición',
        'Participantes (organización)',
        'Participantes (Tamborradata)',
        'Diferencia',
        'Centros (organización)',
        'Compañías (Tamborradata)',
      ],
    },
    reconcile: {
      lede: '**La diferencia entre participaciones y nombres identificados coincide, edición a edición, con los casos ambiguos.** Participaciones, nombres identificados en las clasificaciones publicadas y casos ambiguos (no hay datos de 2009, 2010 ni 2021).',
      columns: ['Edición', 'Participaciones', 'Nombres identificados', 'Diferencia', 'Casos ambiguos'],
    },
    residue: {
      lede: (f) =>
        `**El ${f.decimal(figures.lowConfidencePct, 1)} % de las participaciones se resolvió con poca confianza y el ${f.decimal(figures.ambiguousPct, 1)} % es ambiguo.** Participaciones con problemas sobre un total de ${f.int(figures.total)} en dieciséis ediciones. Una misma participación puede aparecer en varias filas.`,
      columns: ['Qué', 'Participaciones', 'Parte del total'],
      rows: {
        lowConfidence: 'Resueltas con confianza baja',
        commaFormat: 'Escritas como «Apellidos, Nombre»',
        ambiguous: 'Ambiguas (fuera de las clasificaciones de nombres)',
        noPrimaryName: 'Sin nombre principal',
        sixOrMoreWords: 'Con seis o más palabras',
        singleWord: 'De una sola palabra',
        parentheses: 'Con paréntesis',
      },
    },
    confidence: {
      lede: (f) =>
        `**El peso de las resoluciones dudosas bajó del ${f.decimal(figures.lowConfidence2008Pct, 1)} % al ${f.decimal(figures.lowConfidenceMin, 1)} % y ha vuelto a subir hasta el ${f.decimal(figures.lowConfidence2026Pct, 1)} %.** Parte de las participaciones de cada edición resueltas con confianza baja (no hay datos de 2009, 2010 ni 2021).`,
      label: 'Confianza baja (%)',
    },
    coverage: {
      lede: '**Tres ediciones son incompletas, por motivos distintos.** Compañías con datos en cada una y qué falta.',
      columns: ['Edición', 'Compañías', 'Qué ocurre'],
      rows: [
        {
          edition: '2011',
          detail: () =>
            `Casi todas, pero ${figures.partial2011.under60} de ${figures.partial2011.common} con menos del 60 % de los participantes de 2013`,
        },
        {
          edition: '2012',
          detail: () => 'Faltan compañías enteras; las presentes tienen su tamaño habitual',
        },
        {
          edition: '2022',
          detail: () => 'Faltan compañías enteras; las presentes tienen su tamaño habitual',
        },
      ],
    },
  },
  used: {
    heading: 'Datos utilizados',
    blocks: [
      (f) =>
        `**Qué datos.** Estadísticas publicadas de Tamborradata sobre ${f.int(figures.editions)} ediciones de la Tamborrada Infantil: 2008, 2011 a 2020 y 2022 a 2026 (no hay datos de 2009, 2010 ni 2021), y recuentos agregados sobre las participaciones de esas ediciones. Consulta del 9 de noviembre de 2026, sobre las versiones publicadas el 18 de octubre de 2026.`,
      () =>
        '**Qué cuenta cada cifra.** Se cuentan participaciones, no personas. «Ambigua» es una participación cuyo nombre el programa no pudo separar de los apellidos con seguridad; no entra en las clasificaciones de nombres. «Confianza baja» es una resolución asignada con una confianza del programa inferior a 0,8 sobre 1; sí entra en las clasificaciones. Las categorías de la tabla de lo que no se pudo limpiar pueden solaparse.',
      () =>
        '**Cómo se comparan las fuentes externas.** El INE da el primer apellido más frecuente por provincia de residencia a 1 de enero de 2025, para residentes de todas las edades. Eustat da los nombres más frecuentes de los recién nacidos en Gipuzkoa entre 2022 y 2025. Son poblaciones distintas de la de la Tamborrada: la comparación indica parecido, no exactitud. Donostia Kultura da participantes y centros del desfile de la Tamborrada Infantil; la cifra de 2025 procede de Orain, que cita 4.625 participantes en el texto y «5000» en el titular, y la nota de prensa de 2024 recoge 4.732 y 4.731. El tipo de entidad que cuenta como «centro» varía entre notas (centros escolares, entidades, asociaciones). La edición de 2022 se organizó en cinco desfiles de barrio y no tiene cifra comparable.',
      () =>
        '**Ediciones incompletas.** Se compara el tamaño de cada compañía con el que tiene en una edición completa cercana (2013 para 2011 y 2012; 2020 para 2022). Se considera que una lista va a medias si recoge menos del 60 % de los participantes de esa referencia.',
      () =>
        '**Límites.** Los datos no llevan tildes ni eñes y cada grafía de un apellido cuenta como un apellido distinto. No sabemos por qué faltan compañías en 2012 y 2022 ni por qué ha subido la parte de resoluciones dudosas. No hemos podido comprobar cifras oficiales de 2008, 2011 a 2016, 2018, 2019 ni 2026. Que las cuatro compañías txiki expliquen la diferencia con la organización es una explicación que encaja con los números, no un hecho confirmado.',
      (f) =>
        `**Privacidad.** Solo se publican agregados; no hay ninguna cifra inferior a 5 (la menor que aparece es ${f.int(figures.smallestFigure)}).`,
    ],
    sourcesLead: '**Fuentes externas verificadas.**',
  },
};

const texts: ArticleTexts = {
  title: '¿Cómo de fiables son los datos de Tamborradata?',
  description:
    'Comparamos los datos de Tamborradata con las cifras de la organización, el INE y Eustat, comprobamos que las cuentas cuadran y enseñamos lo que no se ha podido limpiar: ambigüedades, formatos de origen y tres ediciones incompletas.',
  category: 'Datos',
  readTime: '9 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

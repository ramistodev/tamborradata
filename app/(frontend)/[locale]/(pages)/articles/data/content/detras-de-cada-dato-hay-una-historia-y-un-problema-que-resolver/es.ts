import type { ArticleTexts } from '../../../types/article.types';
import { stepStatus } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { ambiguousShare, bothRoleShare, compoundNames, figures, tokenEvidence } from './figures';

const { martin } = tokenEvidence;

const copy: ArticleCopy = {
  intro: {
    simple:
      'A primera vista parece sencillo: leer los nombres, contarlos y hacer un ranking. Cualquiera lo haría con una hoja de cálculo.',
    hands:
      'Pero los nombres de la Tamborrada Infantil se han publicado durante años, en páginas distintas, y cada lista la ha escrito una mano diferente. Entre la lista y el número hay un camino lleno de trampas.',
    questionLabel: 'La pregunta',
    question:
      '¿Cómo se convierten miles de nombres, escritos de muchas maneras y repartidos entre muchas páginas, en estadísticas en las que se pueda confiar?',
    problemsCaption: 'Cosas que pueden torcerse por el camino',
    problems: [
      'El orden de nombres y apellidos cambia',
      'Una palabra puede ser nombre y apellido',
      'Un colegio aparece con varios nombres',
      'El original contiene errores',
      'Hay años con información incompleta',
      'Una actualización puede fallar a mitad',
      'Un texto automático puede equivocarse',
    ],
    promise:
      'Este artículo cuenta cómo se enfrenta Tamborradata a cada una de ellas, y también lo que todavía no puede garantizar.',
  },
  names: {
    heading: 'Tres palabras y ninguna etiqueta',
    person:
      'Para una persona, «Aitor Goikoetxea Lasa» no tiene misterio: Aitor es el nombre, y Goikoetxea y Lasa son los apellidos. Es un nombre inventado, solo para el ejemplo.',
    personCaption: 'Lo que ve una persona de un vistazo.',
    givenLabel: 'nombre',
    surnameLabel: 'apellido',
    program:
      'Para un programa, en cambio, son tres palabras sueltas. Nadie le ha dicho cuál es cuál.',
    programCaption: 'Lo que recibe un programa.',
    unknownLabel: '¿?',
    trouble: (f) =>
      `Y este es el caso fácil. Hay palabras que sirven para las dos cosas: Martin es un nombre y es un apellido. Algunas listas invierten el orden («Goikoetxea Lasa, Aitor»). Hay quien tiene dos nombres, o un apellido compuesto como «de la Fuente». De las ${f.int(figures.distinctWords)} palabras distintas que aparecen en los nombres, ${f.int(figures.bothRoleWords)} (el ${f.percent(bothRoleShare)}) se han visto como nombre y también como apellido.`,
    counting: (f) =>
      `Tamborradata no usa un diccionario de nombres. Lo resuelve contando. Cada vez que lee un nombre completo, anota en qué lugar estaba cada palabra: la primera cuenta como señal de nombre (y cuenta ${f.int(figures.firstPositionWeight)} veces), las demás como señales de apellido. Después de leer los ${f.int(figures.participants)} registros, cada palabra tiene su historial, y ese historial se convierte en una probabilidad.`,
    nlp: 'En términos técnicos, es procesamiento del lenguaje natural (NLP, por sus siglas en inglés): programas que interpretan texto escrito por personas, aquí nombres y apellidos. Y de los más sencillos: probabilístico, sin redes neuronales. Si se quiere llamar inteligencia artificial, es una muy pequeña: aprende de los datos que va guardando el propio sistema, pero no es un modelo de lenguaje como ChatGPT, y sus reglas las fijó una persona.',
    tableCaption:
      'Historial de cada palabra en la base de datos: puntos acumulados como nombre y como apellido (la primera posición cuenta el triple) y cuántas veces ha aparecido en primera posición, en medio y al final de un nombre completo. Son palabras sueltas, no personas.',
    wordColumn: 'Palabra',
    asGivenColumn: 'Como nombre',
    asSurnameColumn: 'Como apellido',
    firstColumn: 'Primera',
    middleColumn: 'Intermedia',
    lastColumn: 'Última',
    reading: (f) =>
      `Aitor casi siempre va delante: es un nombre. Goikoetxea nunca ha aparecido como nombre: siempre es apellido. José va casi siempre en primer lugar o en medio, y por eso sirve como segundo nombre. Con Martin la historia es otra: acumula ${f.int(martin.asName)} puntos como nombre y ${f.int(martin.asSurname)} como apellido, y aparece en todas las posiciones. Está en tierra de nadie, y el sistema lo sabe: para aceptar una palabra intermedia como segundo nombre exige que su historial lo avale con claridad (un ${f.percent(figures.secondNameThreshold, 0)}). Se fijó en ese valor y no en el 50 % precisamente por casos como el de Martin, que se colaba como segundo nombre por error.`,
    humility:
      'El sistema también es prudente con lo que ha visto poco. Una palabra que ha aparecido una sola vez no se da por segura: parte de un 50/50 y solo se aleja de él a medida que se repite.',
    decision: (f) =>
      `Para decidir el orden compara solo la primera y la última palabra: si «nombre primero, apellido después» resulta claramente más probable que lo contrario (con un listón fijo del ${f.percent(figures.orderThreshold, 0)}), lo da por bueno. El resto son reglas sencillas: «de», «del» o «la» se pegan al apellido siguiente, y la forma con coma («Goikoetxea Lasa, Aitor») se le da la vuelta antes de empezar.`,
    recordIntro:
      'El resultado, para cada participante, es un pequeño registro que se guarda en la base de datos. Así quedaría un nombre con dos nombres, «Aitor José Goikoetxea Lasa», también inventado.',
    recordCaption:
      'Registro de ejemplo. La confianza se calcula con los historiales reales de cada palabra.',
    fieldColumn: 'Campo',
    valueColumn: 'Valor',
    primaryNameField: 'Primer nombre',
    namesField: 'Nombres',
    surnamesField: 'Apellidos',
    confidenceField: 'Confianza',
    statusField: 'Estado',
    statusResolved: 'Resuelto',
    secondNames: (f) =>
      `Gracias a esta separación se pueden calcular estadísticas imposibles con un simple corte de palabras, como el ranking de segundos nombres o el número de participantes con nombre compuesto. En la base de datos hay ${f.int(compoundNames.two)} participantes con dos nombres y ${f.int(compoundNames.three)} con tres.`,
    ambiguous: (f) =>
      `Cuando no hay forma de separar nombre y apellidos con garantías, el sistema no adivina. Marca el registro como ambiguo y lo deja fuera de las estadísticas de nombres. Son ${f.int(figures.ambiguous)} de ${f.int(figures.participants)} registros: el ${f.percent(ambiguousShare, 2)}.`,
    limit:
      'Aprende en un sentido muy concreto: su recuento crece con los datos que almacena el propio sistema. Pero sus reglas y sus umbrales no cambian solos, y los registros ya interpretados no se vuelven a evaluar cuando el recuento mejora.',
  },
  schools: {
    heading: 'Un colegio, muchos nombres',
    problem:
      'Cada lista de la Tamborrada Infantil vive en una página web, y el colegio al que pertenece solo se conoce por dos textos: el título de la página y su dirección. Esos textos cambian de un año a otro. La Salle puede aparecer como «La Salle», «Lasalle» o «Salle». Si el sistema tratara cada forma como un colegio distinto, la historia de La Salle quedaría troceada y las estadísticas por colegio no valdrían nada.',
    groupsCaption:
      'Formas con las que ha aparecido escrito un mismo colegio, en el título o en la dirección de sus páginas. Se muestran tal como las guarda el sistema, sin tildes.',
    formsLabel: (f, count) => `${f.int(count)} formas`,
    how: 'Tamborradata sigue un orden. Primero limpia el texto: quita las palabras que no distinguen a un colegio de otro («colegio», «ikastola», «infantil», «tamborrada») y los números de compañía, como en «compañía 2». Después lo busca en un diccionario de formas ya conocidas. Si no lo encuentra, compara por palabras, no por letras: solo une dos nombres si comparten casi todas las palabras. Y si tampoco así, da de alta un colegio nuevo.',
    dictionary:
      'Lo importante es que el diccionario crece solo. Cada página que se reconoce con éxito aporta todas sus formas, la del título y la de la dirección, así que la página del año siguiente, aunque estrene un nombre, se reconoce si conserva alguna forma ya conocida. En la base de datos, formas tan distintas como «Carmelo», «Colegio Nino Jesus» y «Scientia Karmelo» figuran bajo un mismo colegio.',
    limits:
      'Tiene límites claros. No corrige erratas: «Arantzazuko» y «Arantzatzuko» son para el sistema dos palabras distintas, y las erratas que hay en el diccionario llegaron porque la otra forma de la misma página sí coincidía. Ante la duda, crea un colegio aparte en lugar de unir dos distintos: por eso La Salle y San Luis La Salle, o Jesuitas y Jesuitinas, son colegios diferentes. Y no hay un paso de revisión humana: si una unión sale mal, solo se descubre al mirar los datos.',
    figures: (f) =>
      `En la base de datos con la que trabajamos hay ${f.int(figures.schools)} colegios que reúnen ${f.int(figures.schoolAliases)} formas escritas. ${f.int(figures.schoolsWithManyAliases)} de ellos tienen más de una forma, hasta ${f.int(figures.maxAliases)} en el caso con más.`,
  },
  journey: {
    heading: 'De una página antigua a una estadística publicada',
    intro:
      'Con esas dos piezas se puede seguir el recorrido completo de un dato, desde una página publicada hace años hasta la estadística que ves en la web.',
    caption: 'El recorrido de un nombre, de la página antigua a la web.',
    steps: [
      {
        title: 'Encontrar las páginas',
        description:
          'Busca las listas por tres vías a la vez: el listado del propio periódico, un buscador y el archivo histórico de internet. Ninguna basta sola: las páginas recién publicadas todavía no están en los buscadores ni en el archivo, y por eso el listado del periódico es el primero en enterarse.',
      },
      {
        title: 'Esperar a que haya algo que leer',
        description: `El proceso se ejecuta cada noche del 15 al 22 de enero y no hace nada hasta que el periódico ha publicado un mínimo de listas: al menos ${figures.minDiscoveredPages} páginas, y la mitad de las del año, procedentes de su propio listado.`,
      },
      {
        title: 'Detectar qué ha cambiado',
        description:
          'Solo vuelve a mirar las páginas del año en curso, y lo hace preguntándole a cada una cuándo se modificó por última vez. Si la fecha no ha cambiado, la deja como está. Es una comprobación barata que se fía de la fecha que declara la propia página.',
      },
      {
        title: 'Leer y filtrar',
        description: `Descarta lo que no es una persona (títulos, direcciones, cargos como «abanderada» o «tambor») con listas escritas a mano: unas ${figures.roleWords} palabras de cargo y unas ${figures.rolePhrases} frases, en español y en euskera. Y repara los nombres que el periódico pegó sin espacio, solo cuando está claro.`,
      },
      {
        title: 'Reconocer el colegio',
        description: 'Limpia el título y la dirección de la página y los busca en el diccionario de formas.',
      },
      {
        title: 'Interpretar cada nombre',
        description:
          'Separa nombre y apellidos con el recuento de evidencias. Si no hay forma de hacerlo con garantías, el registro queda como ambiguo.',
      },
      {
        title: 'Calcular las estadísticas',
        description:
          'Recalcula solo los años cuyos datos han cambiado, a partir de los nombres bien interpretados.',
      },
      {
        title: 'Publicar una versión completa',
        description: 'La versión nueva se prepara aparte y la web pasa a mostrarla de una sola vez.',
      },
    ],
    canary: (f) =>
      `Y hay un vigilante que trabaja una vez por semana. Se llama Canary y, como el canario de las minas, no arregla nada: avisa. Cada lunes vuelve a leer ${f.int(figures.canarySample)} páginas ya guardadas (${f.int(figures.canaryFixed)} siempre las mismas y ${f.int(figures.canaryRandom)} elegidas al azar) y comprueba que los nombres que salen hoy son los mismos que guardamos. Si la estructura de las páginas del periódico ha cambiado y la lectura falla, o si los nombres difieren en ${f.int(figures.canaryDriftPages)} páginas o más (o en más del ${f.percent(figures.canaryDriftShare, 0)} de las revisadas), envía un aviso por correo. Está pensado para los meses en que nadie mira, de modo que el 20 de enero no sea el primer día en que alguien se entera de que algo se rompió.`,
  },
  statistics: {
    heading: 'De miles de filas a un ranking',
    categories: (f) =>
      `Con los nombres bien interpretados, el sistema calcula ${f.int(figures.categories)} categorías de estadísticas: el nombre más repetido, los nombres que debutan o desaparecen, la evolución de cada colegio, entre otras. Para el nombre más repetido basta contar cuántas veces aparece cada primer nombre entre los registros bien interpretados y ordenarlos; si hay empate, por orden alfabético, para que el resultado sea siempre el mismo.`,
    ripple:
      'Hay estadísticas que dependen de la historia entera. Un nombre es «nuevo» solo si no había aparecido en ninguna edición anterior, y un colegio es «veterano» si ha participado en casi todas las ediciones recientes. Por eso, si se corrige un dato de 2013, hay que recalcular desde 2013 hasta hoy, y también la estadística de todos los años juntos.',
    reuse:
      'Para no repetir trabajo, cada cambio en los datos suma uno a un contador del año afectado, y el sistema solo recalcula los años cuyo contador no coincide con el de la última publicación. Los demás no se tocan: su versión publicada sigue sirviéndose. Los que cambian se recalculan enteros, desde cero; no se parchean.',
    blanks: (f) =>
      `También hay ausencias deliberadas. La primera edición no tiene «nombres nuevos», porque todo sería nuevo, y hacen falta cinco ediciones de historia para hablar de colegios veteranos. De las ${f.int(figures.categories)} categorías, un año publica entre ${f.int(figures.yearCategoriesMin)} y ${f.int(figures.yearCategoriesMax)} según la historia disponible, y el conjunto de todos los años publica ${f.int(figures.globalCategories)}. Una categoría que falta significa «no se puede calcular con garantías»; una categoría vacía, «calculada, y no hay nada que contar».`,
  },
  publication: {
    heading: 'Que nunca se vea a medias',
    problem:
      'Imagina que el sistema empieza a recalcular todas las estadísticas y se detiene cuando solo ha terminado una parte. Si la web fuera mostrando cada resultado según se calcula, un visitante vería a la vez cifras nuevas y cifras viejas: un ranking de nombres de hoy junto a una lista de colegios de la semana pasada.',
    unsafeCaption: 'Si cada resultado se publicara según se calcula',
    unsafeSteps: [
      {
        title: 'Se recalcula el ranking de nombres',
        status: stepStatus.success,
        statusLabel: 'Publicado',
      },
      {
        title: 'Se recalcula la lista de colegios',
        status: stepStatus.success,
        statusLabel: 'Publicado',
      },
      {
        title: 'Falla el cálculo de la evolución por años',
        status: stepStatus.danger,
        statusLabel: 'Error',
      },
      {
        title: 'La web muestra cifras nuevas junto a cifras viejas',
        description: 'Nadie sabe qué parte de la página es de hoy y cuál es de la semana pasada.',
        status: stepStatus.danger,
        statusLabel: 'A medias',
      },
    ],
    safeCaption: 'Con una versión preparada aparte',
    safeSteps: [
      {
        title: 'Se calcula una versión nueva, a un lado',
        description: 'Mientras tanto, la versión anterior sigue siendo la única visible.',
      },
      {
        title: 'Se comprueba que está lista',
        description:
          'Que el cálculo terminó sin errores y que los datos no han cambiado mientras tanto.',
      },
      {
        title: 'La web pasa a la versión nueva, de una sola vez',
        description: 'Es un único cambio. La versión anterior se archiva; no se borra.',
        status: stepStatus.success,
        statusLabel: 'Publicada',
      },
      {
        title: 'Si algo falla antes, no cambia nada',
        description: 'El visitante sigue viendo la versión anterior, completa y coherente.',
        status: stepStatus.success,
        statusLabel: 'Sin efecto',
      },
    ],
    analogy:
      'Es como imprimir una edición nueva de un libro junto a la anterior y, cuando está terminada y revisada, cambiar el ejemplar que la biblioteca pone en la estantería. Nadie ve nunca un libro a medio imprimir.',
    verified:
      'La comprobación es más modesta de lo que parece. El sistema verifica que el cálculo terminó sin errores y que los datos no cambiaron mientras se calculaba (si cambiaron, rechaza la publicación). No compara el resultado con una lista de lo que «debería» haber ni busca cifras raras: la integridad viene de que cualquier error detiene el cálculo.',
    web: 'Y hay un segundo cerrojo en la propia base de datos: la web solo puede leer la versión publicada de cada periodo, aunque el código de la web fallara.',
    limits:
      'Un límite que conviene conocer: la publicación es de una pieza por periodo, no de todo el sitio a la vez. Si se corrige un dato antiguo y hay que recalcular varios periodos, durante un rato la web puede mostrar algunos años ya actualizados y otros todavía no. Y si un cálculo falla, la web sigue sirviendo la versión anterior mientras se reintenta en la siguiente ejecución programada.',
    figures: (f) =>
      `En la base de datos con la que trabajamos hay ${f.int(figures.periods)} periodos (${f.int(figures.yearPeriods)} ediciones y el conjunto de todas), cada uno con una versión publicada y ninguna pendiente.`,
  },
  ai: {
    heading: 'Cuando también hay que explicar los números',
    problem:
      'Calcular un número no es lo mismo que hacerlo comprensible. Por eso Tamborradata acompaña las estadísticas con pequeños resúmenes escritos por un modelo de lenguaje: aquí sí, una inteligencia artificial generativa, de otra familia que el sistema de nombres. No calcula nada, solo redacta. Y ahí aparece un problema nuevo: puede escribir con aplomo algo que no es exacto.',
    how: (f) =>
      `El modelo no recibe una hoja de cálculo. Pide cada estadística a través de una herramienta, solo las de su sección, y los números le llegan ya escritos tal como deben aparecer, para que los copie en vez de calcularlos. La dirección de una tendencia (sube, baja o se mantiene) la decide el programa, no el modelo: se considera estable si el cambio es inferior al ${f.percent(figures.stableTrendThreshold, 0)}.`,
    placeholders:
      'Hay un detalle que evita muchos problemas: el modelo nunca escribe el nombre de un colegio. Escribe una referencia interna, y es la web la que la sustituye por el nombre actual cuando alguien abre la página. Es como una carta de plantilla («Estimado…») en la que quien la redacta nunca ve la libreta de direcciones.',
    benefits:
      'Eso tiene tres ventajas prácticas. El modelo no puede escribir mal el nombre de un colegio ni confundirlo con otro. La traducción conserva la referencia intacta (se comprueba que sean las mismas y en el mismo orden). Y si el nombre de un colegio cambia, el texto sigue siendo válido, porque el nombre se busca en el momento de mostrarlo. Si una referencia no se puede resolver, ese resumen no se muestra y la página sigue funcionando sin él.',
    translations:
      'Los resúmenes se escriben primero en inglés. Las versiones en español y en euskera salen de ese texto ya validado.',
    limits:
      'Conviene saber qué se comprueba y qué no. El sistema verifica que el texto no repita el año donde no toca, que cada referencia apunte a un colegio que existe y que las traducciones mantengan las mismas referencias. No verifica que cada cifra del texto coincida con los datos, ni que el formato sea correcto, ni que la traducción respete los nombres propios. Tampoco hay un paso de revisión humana antes de publicarlos.',
    glitches:
      'Hay ejemplos reales de lo que esa falta de control deja pasar: un resumen de 2026 tiene un énfasis sin cerrar (el mismo en los tres idiomas), y en una traducción «Inigo» se convirtió en «Íñigo».',
    failure:
      'Si la generación de un resumen falla, no bloquea la publicación de las estadísticas: la página sale sin ese texto, y al inicio de cada ejecución un proceso de reparación vuelve a intentar los que fallaron.',
    figures: (f) =>
      `En la base de datos con la que trabajamos hay ${f.int(figures.summaries)} resúmenes publicados (${f.int(figures.summariesPerLanguage)} por idioma), ninguno fallido ni pendiente. En cada idioma, ${f.int(figures.summariesWithSchoolRefs)} incluyen referencias a colegios: ${f.int(figures.schoolRefsPerLanguage)} referencias que apuntan a ${f.int(figures.schoolsReferenced)} colegios distintos, todas resueltas.`,
  },
  quality: {
    heading: '¿Qué calidad tienen los datos?',
    intro:
      'Todo lo anterior son controles. La pregunta honesta es qué dicen de la calidad real de los datos. Esto es lo que podemos afirmar con la base de datos delante.',
    tableCaption: 'Cifras de la base de datos con la que trabajamos.',
    indicatorColumn: 'Indicador',
    valueColumn: 'Cifra',
    participantsRow: 'Participaciones registradas',
    editionsRow: 'Ediciones',
    schoolsRow: 'Colegios',
    pagesRow: 'Páginas de origen',
    resolvedRow: 'Registros resueltos',
    ambiguousRow: 'Registros ambiguos',
    compareCaption: 'Resolver un nombre no es lo mismo que comprobarlo.',
    resolvedLabel: 'Resueltos',
    resolvedDescription: (f) =>
      `${f.int(figures.resolved)} de ${f.int(figures.participants)} registros: el sistema pudo separar el nombre de los apellidos.`,
    checkedLabel: 'Comprobados',
    checkedValue: 'No medido',
    checkedDescription:
      'La base de datos no guarda ninguna revisión manual, así que no podemos dar una precisión, solo una tasa de resolución.',
    confusion:
      'Conviene no confundirlos. Que un registro figure como «resuelto» significa que el sistema encontró una separación posible, no que alguien haya comprobado que sea la correcta. Y la «confianza» que guarda el sistema mide cuánto se inclina cada palabra hacia un lado, no la probabilidad de acierto.',
    coverage: (f) =>
      `La cobertura también tiene huecos. No hay datos de 2009 ni de 2010, y en 2021 no hubo Tamborrada. Las listas de 2012 y 2022 incluyen unos ${f.int(figures.partialEditionSchools)} colegios, frente a entre ${f.int(figures.regularSchoolsMin)} y ${f.int(figures.regularSchoolsMax)} en las ediciones vecinas: son ediciones incompletas.`,
    dirty:
      'Y no todos los datos públicos están limpios. Hay cosas que no se pueden calcular porque vienen así del origen, y no existe un algoritmo que las detecte por sí solo. En los listados de 2026 hay palabras como «Lbai» o «Lrati», que probablemente son erratas de «Ibai» e «Irati». Para el sistema son nombres poco vistos, y los cuenta como tales.',
    duplicates: (f) =>
      `Hay ${f.int(figures.repeatedNameKeys)} nombres completos repetidos dentro de una misma edición, siempre en colegios distintos: un ${f.percent(figures.repeatedExtraRowsShare, 2)} de filas de más. No sabemos si son homónimos, niños apuntados en dos listas o duplicados de la fuente.`,
    integrity:
      'Lo que sí sale limpio: las comprobaciones de integridad que hemos hecho no encuentran filas huérfanas, colegios sin participantes ni huecos sin explicación en las estadísticas publicadas.',
    closing:
      'La calidad de los datos no consiste en prometer perfección. Consiste en saber dónde pueden estar los errores, poner controles donde se puede y decir con claridad lo que todavía no se puede garantizar.',
  },
  conclusion: {
    heading: 'Una lista de nombres no es una estadística',
    summary:
      'Entre una lista de nombres y una estadística hay un camino largo: separar nombres de apellidos, reconocer colegios con muchos nombres, no recalcular lo que no ha cambiado, no publicar a medias y explicar los números sin inventarlos. Ninguno de esos pasos es perfecto, y casi todos tienen un límite que conviene conocer.',
    twoUses:
      'Hay una idea que atraviesa todo el artículo: una lista de participantes es mucho más que una lista. Contiene nombres, años, colegios… Y esos datos sirven para dos cosas a la vez. Por un lado, enriquecen al propio sistema: a partir de la lista, Tamborradata construye un modelo probabilístico que va acumulando evidencias para interpretar nombres y apellidos. Por otro, esa misma lista alimenta las estadísticas que cuentan la historia de quienes han desfilado en la Tamborrada Infantil.',
    closing:
      'Una estadística fiable no es la que nunca se equivoca, sino la que sabe dónde puede equivocarse.',
  },
};

const texts: ArticleTexts = {
  title: 'Detrás de cada dato hay una historia. Y un problema que resolver.',
  description:
    'Cómo se convierten miles de nombres publicados durante años, escritos de mil maneras, en estadísticas en las que se puede confiar. Y qué sigue sin poder garantizarse.',
  category: 'Cómo se hace',
  readTime: '11 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

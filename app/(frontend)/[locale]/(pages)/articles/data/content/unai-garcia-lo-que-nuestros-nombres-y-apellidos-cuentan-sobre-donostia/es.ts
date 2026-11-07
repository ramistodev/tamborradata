import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import { figures } from './figures';

const copy: ArticleCopy = {
  intro: [
    'Es 20 de enero y la mañana tiene ese ruido reconocible de Donostia que llega antes que el desfile. En torno a las compañías escolares de la Tamborrada Infantil se ajustan chaquetas, se buscan tambores, se llama a quien se ha quedado unos pasos atrás. En una lista de salida pueden aparecer Ane, Unai, Jon, Maddi, Nahia y Leire. Nadie necesita detener la marcha para reconocerlos.',
    'En la misma página aparecen otros nombres, los que cierran cada línea. García, González, Rodríguez, Fernández, Martínez y López vuelven una y otra vez. Leídos deprisa, nombre y apellido forman una unidad práctica: sirven para comprobar quién está, ordenar una fila, entregar una credencial. Pero cuando se separan, abren una pregunta sobre el propio registro.',
    '¿Por qué los nombres de pila que encabezan estas listas cambian con más facilidad que los primeros apellidos? La pregunta observa dos repertorios que conviven en una fiesta pública y que llegan a una hoja de inscripción por caminos distintos.',
    'Un nombre suele ser una elección hecha en un momento concreto. Puede ser una preferencia familiar, una referencia literaria, un sonido que gana presencia o una forma que ya estaba cerca. Un apellido no entra así en la lista. Llega por filiación y, en España, el artículo 109 del Código Civil regula su orden. Esa diferencia jurídica y social no explica cada caso, pero sí ayuda a entender por qué no esperamos el mismo ritmo en ambos rankings.',
    'Tamborradata permite mirar esa diferencia sin salir del desfile. Reúne las listas disponibles de la Tamborrada Infantil y las convierte en recuentos de participaciones. No es una colección de biografías individuales, sino de nombres y primeros apellidos tal como fueron registrados, ordenados por edición y comparados con cuidado.',
    'El resultado tiene una forma clara. La parte alta de los nombres se renueva. Nora y Maddi ganan terreno, Telmo entra entre los primeros puestos y Leire baja respecto a su posición de hace años. En los apellidos, en cambio, la primera línea cambia menos. García, González, Fernández, Rodríguez, Martínez, Pérez, López, Gómez, Hernández y Ruiz aparecen entre los veinte primeros en todos los años observados.',
    'Esta es, por tanto, una historia de dos ritmos. Primero veremos dónde está la diferencia. Después seguiremos algunos nombres a través de las ediciones y situaremos los repertorios en su contexto cultural y legal. Así se ve cómo una tradición compartida conserva memoria y, al mismo tiempo, admite novedades.',
  ],
  data: {
    heading: 'Una comparación que no mezcla años incompletos',
    coverage: (f) =>
      `La comparación principal enfrenta dos periodos de igual longitud y con años completos: ${figures.earlyPeriod}, con ${f.int(figures.earlyParticipations)} participaciones, y ${figures.recentPeriod}, con ${f.int(figures.recentParticipations)}. Así evitamos que un cambio aparente sea solo el efecto de una lista más corta o de una edición con cobertura desigual.`,
    records:
      'Cada participación aporta el primer nombre y el primer apellido tal como fueron registrados. El recuento conserva esas formas, sin agrupar variantes ni corregir apellidos hacia una versión canónica, para comparar el dibujo de las listas edición a edición.',
  },
  concentration: {
    heading: 'La cima se abre para los nombres, no para los apellidos',
    opening: (f) =>
      `La señal más visible aparece al medir cuánto espacio ocupan los diez primeros puestos. En 2008, los diez nombres más frecuentes reunían el ${f.percent(figures.topTenNames2008, 2)} de las participaciones. En 2026 reúnen el ${f.percent(figures.topTenNames2026, 2)}. Es una caída de más de seis puntos: los nombres que encabezan la lista siguen siendo reconocibles, pero comparten el protagonismo con más alternativas.`,
    namesCaption: 'Los diez nombres más frecuentes pierden peso entre 2008 y 2026. La importancia está en el reparto: la cima deja más espacio al resto de nombres.',
    surnamesCaption: 'Los diez primeros apellidos mantienen una proporción parecida entre 2008 y 2026. Frente al cambio de los nombres, esta continuidad marca el contraste central.',
    earlyLabel: '2008',
    recentLabel: '2026',
    conclusion:
      'Los apellidos recorren el camino contrario. Sus diez primeros pasan del 11,12 % al 12,41 % de las participaciones. No es una diferencia enorme, y por eso importa no exagerarla. Basta para decir que, mientras la cúspide de los nombres se dispersa, la de los apellidos conserva e incluso gana algo de peso. La comparación no dicta una causa para cada familia. Describe una huella compatible con dos mecanismos distintos: elección de nombre y transmisión de apellido. También recuerda que estabilidad no significa inmovilidad. Hay entradas y salidas, y hay apellidos menos frecuentes que cambian de posición. Lo que permanece es el dibujo general de la parte más alta, no una regla sin excepciones.',
  },
  turnover: {
    heading: 'El relevo ocurre en los veinte primeros puestos',
    opening:
      'La segunda prueba compara los rankings de los dos periodos completos. De los veinte nombres principales de 2013–2016, doce siguen entre los veinte de 2023–2026 y ocho son reemplazados. Salen Asier, Eneko, Iñigo, Leire, María, Naroa, Oier y Pablo. Entran June, Maddi, Markel, Martin, Martina, Noa, Sara y Telmo. El grupo no se borra de golpe, pero sí deja entrar una generación de favoritos nuevos.',
    tableCaption:
      'Solapamiento entre los rankings de 2013–2016 y 2023–2026. La tabla muestra por qué el cambio es una historia de posiciones altas, no de todo el repertorio.',
    namesLabel: 'Nombres que coinciden',
    surnamesLabel: 'Apellidos que coinciden',
    conclusion: (f) =>
      `Con los primeros apellidos la sustitución es mucho menor: permanecen ${f.int(figures.topTwentySurnamesRetained)} de veinte. Solo Artola, Etxeberria y Ramos dejan paso a Muñoz, Ortega y Vázquez. Sin embargo, al ampliar la vista a los cien primeros, el solapamiento casi se iguala: ${f.int(figures.topHundredNamesRetained)} nombres y ${f.int(figures.topHundredSurnamesRetained)} apellidos. Esa es la precisión decisiva. No estamos ante dos universos separados, sino ante una diferencia concentrada en la cabeza de las listas.`,
  },
  trajectories: {
    heading: 'Nora, Maddi, Telmo, Leire, Jon, Ane y Unai',
    nora: (f) =>
       `Los rankings anuales permiten poner movimiento a esa conclusión. Nora estaba en el puesto ${f.int(figures.nora2008Rank)} en 2008, con ${f.int(figures.nora2008Count)} participaciones. En 2026 ocupa el primero, con ${f.int(figures.nora2026Count)}. Maddi pasa del puesto ${f.int(figures.maddi2008Rank)} y ${f.int(figures.maddi2008Count)} participaciones al quinto y ${f.int(figures.maddi2026Count)}. Telmo, situado en el 50 en 2008, llega al sexto lugar en 2026. Son ascensos que se leen en las listas de participación.`,
    otherNames: (f) =>
      `También cuentan las bajadas y las persistencias. Leire fue cuarta en 2008 y volvió a ser cuarta en 2013; en 2026 queda en el puesto 30, con 37 participaciones. Jon fue el nombre más repetido entre 2011 y 2015 y ocupa el tercero en el periodo 2023–2026. Ane fue primera en 2008, de 2016 a 2020 y de 2023 a 2024; es segunda en 2025 y 2026. Unai resume otra clase de continuidad: era duodécimo en 2008, alcanzó ${f.int(figures.unai2017Count)} participaciones en 2017 y todavía es decimosexto en 2026.`,
    continuity:
      'Ninguna de estas líneas rectas explica una moda por sí sola. Juntas muestran algo más modesto y más útil: el relevo convive con una base resistente. Algunas preferencias se desplazan deprisa, otras se mantienen cerca de arriba durante muchos años. Por eso no hay un nombre que sustituya a otro como si el desfile cambiara de idioma o de población de una edición a la siguiente.',
  },
  culture: {
    heading: 'Repertorios que se encuentran en una misma lista',
    repertoire:
       'Ane, Jon, Ander, Nora, Iker, Nahia, Unai, Leire y Maddi figuran como nombres personales en EODA, el repertorio onomástico vasco de Euskaltzaindia. La propia institución recoge para Unai una nota léxica y documental histórica, y presenta Maddi como hipocorístico de Maria en Iparralde. Son piezas de contexto cultural para leer las formas del nombre.',
    legal:
       'Ese contexto tiene además un marco público. El Estatuto de Gernika de 1979 reconoce el euskera como lengua propia y cooficial de Euskadi, y reconoce a Euskaltzaindia como institución consultiva oficial. La presencia de una forma en EODA, como la existencia de ese marco, ayuda a comprender la vida pública de un repertorio.',
    coexistence:
      'Los apellidos enseñan la otra mitad de la escena. García, González, Rodríguez, Fernández, Martínez y López, junto con otros como Pérez, Gómez, Hernández o Ruiz, son formas ampliamente distribuidas en España. En los datos de Tamborradata, García tiene una posición media anual de 1,6. Más importante que el decimal es la continuidad: esos diez apellidos están entre los veinte primeros cada año observado, y Sánchez, Martín, Jiménez y Álvarez lo hacen en quince de dieciséis. No son bloques que compitan por la identidad de la ciudad. Son repertorios que coexisten en sus listas.',
  },
  conclusion: {
    heading: 'Lo que cuenta una lista y lo que queda fuera',
    summary:
       'La Tamborrada Infantil deja una sucesión de listas en las que los nombres elegidos se renuevan con más rapidez en lo alto y los primeros apellidos permanecen con más fuerza. Unai y García sirven para recordarlo porque en una misma línea hacen visible la diferencia entre dos maneras de llegar al papel. Así, una tradición compartida muestra a la vez memoria y renovación.',
    method: (f) =>
      `Nota de método y fuentes. El análisis usa las ${f.int(figures.observedYears)} ediciones disponibles de la Tamborrada Infantil. Las comparaciones históricas principales usan exclusivamente 2013–2016 y 2023–2026, años completos y de igual longitud, con ${f.int(figures.earlyParticipations)} y ${f.int(figures.recentParticipations)} participaciones. Faltan datos de 2009, 2010 y 2021; 2012 y 2022 tienen cobertura parcial, y el formato de apellidos de 2011 presenta una anomalía, por lo que no se presenta una serie que trate todos los años como equivalentes. Se cuentan participaciones, no personas, y solo primer nombre y primer apellido. Las fuentes de contexto son EODA de Euskaltzaindia, el Estatuto de Gernika y el artículo 109 del Código Civil. Los resultados describen rankings agregados y no permiten inferir lengua, nacionalidad, origen, ascendencia, familia ni causa alguna para una participación individual.`,
    closing:
      'En la mañana del 20 de enero, una lista sirve para que el desfile avance. Mirada con cuidado, también deja ver cómo cambian sus palabras.',
  },
};

const texts: ArticleTexts = {
  title: 'Unai García: lo que nuestros nombres y apellidos cuentan sobre Donostia',
  description: 'Los nombres elegidos cambian antes en la cima de la Tamborrada Infantil; los apellidos transmitidos mantienen una continuidad distinta.',
  category: 'Nombres y apellidos',
  readTime: '10 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

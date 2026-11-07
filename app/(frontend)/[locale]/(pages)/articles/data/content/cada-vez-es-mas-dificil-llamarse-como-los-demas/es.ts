import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy } from './copy.types';
import {
  arrivals,
  coreShareOfAll,
  currentTopTwentyShare,
  figures,
  nameCounts,
  namedParticipants,
  noraHistory,
  noraShare,
  oldTopTwentyShare,
  pairDropPercent,
  sampledIncrease,
  sampledIncreasePercent,
  singleEditionShareOfNames,
  topTenShare,
  topTenStaying,
} from './figures';

const [martina, noa, laia, luka, leo] = arrivals;

const copy: ArticleCopy = {
  intro: {
    lead: 'Cada año es un poco más difícil encontrar a otro participante de la Tamborrada Infantil que se llame como tú. Los nombres de siempre no han desaparecido: lo que ha cambiado es que ahora se reparten entre muchos más.',
    moreNames:
      'La razón más simple es que hay más nombres distintos. Cuando los participantes se reparten entre más opciones, es menos probable que dos de ellos coincidan, y eso ocurre aunque las listas tengan el mismo tamaño.',
    topWeighs:
      'Otra razón está en lo más alto de la lista. El nombre más repetido de cada edición reúne hoy a una parte más pequeña de los participantes que al comienzo de nuestros datos, y lo mismo le ocurre al grupo de nombres que encabeza la lista. Ser el nombre más popular sigue existiendo, pero ya no significa lo mismo: hay menos niños detrás de cada nombre.',
    classics:
      'Además, los clásicos pierden peso y nadie ocupa del todo su lugar. Algunos de los nombres más habituales de antes son hoy mucho menos frecuentes, y los que suben no llegan a reunir a tantos niños como reunían ellos.',
    newNames:
      'Y cada año entran nombres nuevos. Una parte creciente de los participantes lleva un nombre que antes no figuraba en las listas, y cada nombre nuevo se queda con una parte de los niños que antes tenían los demás.',
    stable:
      'Todo esto convive con una cima muy estable. Unos pocos nombres se mantienen arriba edición tras edición, y el cambio no es una revolución, sino un movimiento lento y constante. Por eso cuesta notarlo de un año para otro, y se ve con claridad al compararlo a lo largo del tiempo.',
    summaryLabel: 'En resumen',
    summary:
      'Llamarse como los demás sigue siendo posible, pero cada año lo es un poco menos: hay más nombres, los más populares pesan menos y los clásicos se diluyen. Lo que sigue es la prueba, con los datos de la Tamborrada Infantil.',
  },
  data: {
    heading: 'Qué datos hemos usado',
    coverage: (f) =>
      `Aquí usamos las listas de ${f.int(figures.editionCount)} ediciones, de ${figures.firstEdition} a ${figures.lastEdition}; no hay datos de 2009, 2010 ni 2021. En total son ${f.int(figures.namedParticipations)} participaciones con el nombre identificado. De cada participante contamos solo el primer nombre: Jon Ander cuenta como Jon.`,
    caveats: () =>
      'Dos matices importantes. Contamos participaciones, no personas: un niño que desfila varios años aparece en cada edición, y en las últimas ediciones alrededor de la mitad de la lista ya figuraba en la anterior. Además, cada lista es una instantánea de niños de edades distintas, así que comparar ediciones sirve para ver cómo cambia esa instantánea, no para seguir a una generación concreta.',
    partial: (f) =>
      `Las listas de 2012 y 2022 incluyen unos ${f.int(figures.partialEditionSchools)} colegios, frente a ${f.int(figures.regularEditionSchoolsMin)} o más en las demás. Las usamos en los recuentos globales, pero no aparecen en las gráficas de evolución porque no son comparables con el resto. Tampoco aparecen 2009, 2010 y 2021, de los que no hay datos.`,
  },
  concentration: {
    heading: 'Compartir nombre es cada vez menos probable',
    question: () =>
      'Una forma sencilla de medir cuánto se repiten los nombres es elegir a dos participantes al azar de la misma edición y preguntarse si se llaman igual.',
    pairValue: (f, oneIn) => `1 de cada ${f.int(oneIn)}`,
    pairDescription: 'parejas de participantes con el mismo nombre',
    pairCaption:
      'Probabilidad de que dos participantes elegidos al azar de la misma edición tengan el mismo primer nombre.',
    conclusion: (f) =>
      `Dicho de otro modo, coincidir en nombre con otro participante es hoy un ${f.percent(pairDropPercent, 0)} menos probable que en ${figures.firstEdition}. Lo que sigue explica por qué.`,
  },
  variety: {
    heading: 'Hay más nombres entre los que repartirse',
    trap: (f) =>
      `Podría bastar con contar nombres distintos: fueron ${f.int(figures.distinct2008)} en ${figures.firstEdition} y ${f.int(figures.distinct2026)} en ${figures.lastEdition}. Pero esa comparación es injusta. En ${figures.lastEdition} hubo más participantes (${f.int(namedParticipants[2026])} frente a ${f.int(namedParticipants[2008])}), y cuantos más participantes hay, más nombres distintos aparecen aunque los gustos no cambien.`,
    sample: (f) =>
      `Para compararlas en igualdad de condiciones hemos hecho un sorteo. De cada edición hemos elegido al azar ${f.int(figures.sampleSize)} participantes, que es el tamaño de la lista más pequeña; hemos repetido el sorteo ${f.int(figures.sampleDraws)} veces y nos hemos quedado con la media. Con esa vara de medir, en ${figures.firstEdition} aparecen unos ${f.int(figures.sampledDistinct2008)} nombres distintos y en ${figures.lastEdition}, unos ${f.int(figures.sampledDistinct2026)}: ${f.int(sampledIncrease)} más, un ${f.int(sampledIncreasePercent)} % de aumento.`,
    chartLabel: 'Nombres distintos esperables',
    chartCaption: (f) =>
      `Nombres distintos que cabe esperar en un sorteo de ${f.int(figures.sampleSize)} participantes de cada edición (media de ${f.int(figures.sampleDraws)} sorteos).`,
    panel: (f) =>
      `El resultado no depende de la forma de medir. Si solo se miran los ${f.int(figures.panelSchools)} colegios presentes en las ${f.int(figures.completeEditionCount)} ediciones completas, el aumento se mantiene: entre 2023 y ${figures.lastEdition}, con casi el mismo número de participantes (de ${f.int(figures.panelMinParticipants)} a ${f.int(figures.panelMaxParticipants)} cada año), los nombres distintos pasan de ${f.int(figures.panelDistinct2023)} a ${f.int(figures.panelDistinct2026)}.`,
    conclusion:
      'Es decir: hay más nombres entre los que repartirse, y esa variedad no se debe al tamaño de las listas.',
  },
  top: {
    heading: 'Los nombres más populares pesan menos',
    lead: (f) =>
      `Lo primero que cambia es la cima. Los diez nombres más repetidos de ${figures.firstEdition} reunían al ${f.percent(topTenShare[2008])} de los participantes; en ${figures.lastEdition}, al ${f.percent(topTenShare[2026])}. Detrás de cada nombre popular hay menos niños.`,
    chartLabel: 'Los diez nombres más repetidos',
    chartCaption:
      'Porcentaje de los participantes de cada edición que llevan uno de los diez nombres más repetidos de esa edición.',
    paradoxLabel: 'La paradoja',
    paradox: (f) =>
      `Ser el nombre más repetido significa cada vez menos: Nora en ${figures.lastEdition} es el **${f.percent(figures.leaderShare2026)}** de los participantes; Ane, que lideraba en ${figures.firstEdition}, era el **${f.percent(figures.leaderShare2008)}**.`,
  },
  classics: {
    heading: 'Los clásicos pierden peso',
    fading: (f) =>
      `Los veinte nombres más repetidos de ${figures.firstEdition} (entre ellos Ane, Jon, Iñigo, Leire, María, Ander, Mikel o Asier) reunían al ${f.percent(oldTopTwentyShare[2008])} de los participantes. En ${figures.lastEdition}, esos mismos veinte nombres reúnen al ${f.percent(oldTopTwentyShare[2026])}.`,
    oldLabel: 'Los veinte nombres más repetidos de 2008',
    currentLabel: 'Los veinte nombres más repetidos de 2026',
    chartCaption:
      'Porcentaje de los participantes de cada edición que llevan alguno de los veinte nombres más repetidos de 2008 y de 2026.',
    spread: (f) =>
      `Los veinte favoritos de ${figures.lastEdition} (Nora, Ane, Jon, Sara, Maddi, Telmo, June…) suman el ${f.percent(currentTopTwentyShare[2026])}: menos de lo que sumaban los de ${figures.firstEdition}.`,
    individual: (f) =>
      `Los casos concretos lo muestran. María pasó de ${f.int(nameCounts.maria[2008])} participantes en ${figures.firstEdition} (el puesto ${f.int(figures.mariaPosition2008)}) a ${f.int(nameCounts.maria[2026])} en ${figures.lastEdition} (el puesto ${f.int(figures.mariaPosition2026)}). Leire, de ${f.int(nameCounts.leire[2008])} a ${f.int(nameCounts.leire[2026])}. Iñaki, de ${f.int(nameCounts.inaki[2008])} a ${f.int(nameCounts.inaki[2026])}. Y a la vez suben otros: Martina y Laia ya superan a todos ellos.`,
    trajectoriesCaption: 'Participantes con cada nombre por cada mil participantes de la edición.',
    conclusion:
      'Los clásicos pierden niños a medida que otros nombres ganan, pero ninguno de los que suben concentra lo que concentraban ellos. Por eso el reparto es cada vez más amplio.',
  },
  arrivals: {
    heading: 'Cada año llegan más nombres nuevos',
    intro: (f) =>
      `Hay nombres que apenas aparecían hace una década. En 2013 había ${f.int(martina.in2013)} participante llamado Martina; en ${figures.lastEdition}, ${f.int(martina.in2026)}. Luka pasó de ${f.int(luka.in2013)} a ${f.int(luka.in2026)}, Laia de ${f.int(laia.in2013)} a ${f.int(laia.in2026)} y Noa de ${f.int(noa.in2013)} a ${f.int(noa.in2026)}. Leo no figuraba entre los participantes de 2013; en ${figures.lastEdition} son ${f.int(leo.in2026)}.`,
    nameColumn: 'Nombre',
    tableCaption: (f) =>
      `Participantes con cada nombre en las ediciones de 2013 y 2026, que reúnen ${f.int(namedParticipants[2013])} y ${f.int(namedParticipants[2026])} participantes con nombre identificado, respectivamente.`,
    renewal: (f) =>
      `La renovación se nota en el conjunto. De los ${f.int(namedParticipants[2026])} participantes de ${figures.lastEdition}, ${f.int(figures.unseenParticipants2026)} llevan un nombre que no aparece en ninguna de las ediciones de ${figures.firstEdition} a 2016: uno de cada diez. En 2017, el porcentaje era del ${f.percent(figures.unseenShare2017)}.`,
    waffleLabel:
      'Uno de cada diez participantes de 2026 lleva un nombre que no aparecía entre 2008 y 2016',
    waffleCaption: (f) =>
      `${f.int(figures.unseenParticipants2026)} de ${f.int(namedParticipants[2026])} participantes (${f.percent(figures.unseenShare2026, 2)}). No hay datos de 2009 y 2010, así que alguno de estos nombres podría haber aparecido en esos años.`,
    conclusion:
      'Cada nombre nuevo que entra en las listas se queda con una parte de los niños que antes tenían los demás. Por eso, aunque la cima apenas se mueva, cada nombre acaba reuniendo a menos participantes.',
  },
  repertoire: {
    heading: 'El fondo común se estrecha',
    core: (f) =>
      `De todos los nombres que han aparecido en las listas, ${f.int(figures.coreNames)} han estado presentes en las ${f.int(figures.editionCount)} ediciones: son los nombres de siempre, el fondo común de la Tamborrada. Entre todos reúnen al ${f.percent(coreShareOfAll)} de las participaciones. Pero cada año reúnen a menos: del ${f.percent(figures.coreShare2008)} de los participantes en ${figures.firstEdition} al ${f.percent(figures.coreShare2026)} en ${figures.lastEdition}.`,
    chartLabel: 'Participantes con un nombre de los de siempre',
    chartCaption: (f) =>
      `Porcentaje de los participantes de cada edición que llevan uno de los ${f.int(figures.coreNames)} nombres presentes en las ${f.int(figures.editionCount)} ediciones.`,
    tail: (f) =>
      `En el otro extremo, ${f.int(figures.singleEditionNames)} nombres, más de un tercio (${f.percent(singleEditionShareOfNames, 0)}) de todos los nombres distintos, solo han aparecido en una edición.`,
    conclusion:
      'El fondo común sigue siendo la mayoría, pero abarca a cada vez menos niños: cada vez más llevan nombres poco habituales.',
  },
  staying: {
    heading: 'La cima cambia despacio',
    top: (f) =>
      `En medio de tanto cambio, hay nombres que no han salido nunca de lo más alto. Ane y Jon han estado entre los cinco más repetidos en las ${f.int(figures.editionCount)} ediciones. Ander, entre los diez primeros en ${f.int(topTenStaying[2].editions)} de ellas.`,
    chipsCaption: (f) =>
      `Ediciones, de las ${f.int(figures.editionCount)}, en las que cada nombre ha estado entre los diez más repetidos.`,
    overlap: (f) =>
      `Esa estabilidad explica por qué la cima cambia despacio: de una edición a la siguiente, entre ${f.int(figures.topTenOverlapMin)} y ${f.int(figures.topTenOverlapMax)} de los diez nombres más repetidos siguen en el top 10.`,
  },
  nora: {
    heading: 'Nora: el relevo en lo más alto',
    opening: (f) =>
      `Nora es el mejor ejemplo de ese relevo. En ${figures.firstEdition}, de los ${f.int(namedParticipants[2008])} participantes con nombre identificado, solo ${f.int(figures.noraCount2008)} se llamaban **Nora**: era el puesto ${f.int(figures.noraPosition2008)} de la lista. En ${figures.lastEdition} es el nombre más repetido: *${f.int(figures.noraCount2026)} de ${f.int(namedParticipants[2026])}*.`,
    chartCaption: (f) =>
      `Porcentaje de los participantes de cada edición que se llaman Nora, Ane o Jon. Nora pasa del ${f.percent(noraShare[2008], 2)} al ${f.percent(noraShare[2026], 2)}.`,
    rise: (f) =>
      `Su ascenso es real, pero tiene matices. Fue el puesto ${f.int(noraHistory[2].position)} en 2013, el ${f.int(noraHistory[3].position)} en 2016 y el ${f.int(noraHistory[4].position)} en 2020. También encabezó la lista de 2022, pero esa edición está incompleta y no la tomamos como prueba.`,
    editionColumn: 'Edición',
    participantsColumn: 'Participantes',
    shareColumn: '% de la edición',
    positionColumn: 'Puesto',
    tableCaption:
      'Participantes llamados Nora, su porcentaje sobre la edición y su puesto en la lista de nombres más repetidos.',
    nuance: (f) =>
      `En las ediciones completas, Nora fue la segunda en 2020, 2023 y 2024, siempre por detrás de Ane, y la primera solo en 2025 y ${figures.lastEdition}: por ${f.int(figures.noraCount2025 - figures.aneCount2025)} participantes de diferencia en 2025 (${f.int(figures.noraCount2025)} frente a ${f.int(figures.aneCount2025)}) y por ${f.int(figures.noraCount2026 - figures.aneCount2026)} en ${figures.lastEdition} (${f.int(figures.noraCount2026)} frente a ${f.int(figures.aneCount2026)}). Desde 2020 su peso apenas se mueve: está entre el ${f.percent(figures.noraShareSince2020Min)} y el ${f.percent(figures.noraShareSince2020Max)} de los participantes. Nora ya no crece; se ha estabilizado arriba.`,
    conclusion:
      'Cambia quién lidera, pero no cuánto pesa: quien encabeza la lista reúne hoy a una parte menor de los participantes que quien la encabezaba antes.',
  },
  limits: {
    heading: 'Lo que dicen los datos y lo que no',
    shows: () =>
      `Estos datos permiten afirmar que, entre ${figures.firstEdition} y ${figures.lastEdition}, los primeros nombres de los participantes se reparten de forma más variada: a igualdad de tamaño, cada edición reúne más nombres distintos, y los más repetidos pesan menos.`,
    doesNot: () =>
      `No permiten decir por qué. Las listas no incluyen la edad ni el año de nacimiento, así que no podemos hablar de generaciones ni atribuir los cambios a ninguna causa. Tampoco distinguen variantes de un mismo nombre (Xabier y Javier, Iñaki e Ignacio o Ane y Ana cuentan como nombres distintos), y las ediciones de ${figures.firstEdition} y 2011 pueden estar algo incompletas.`,
  },
  conclusion: {
    heading: 'Elegir entre muchos',
    summary: () =>
      'Lo que muestran las listas de la Tamborrada Infantil no es la desaparición de los nombres de siempre, sino un reparto distinto. Ane y Jon siguen entre los cinco más repetidos, y de una edición a la siguiente casi todo el top 10 se mantiene. Pero a su alrededor aparecen cada vez más nombres, y los más populares reúnen a una parte menor de cada edición.',
    synthesis:
      'Esa es la explicación de fondo: más nombres, cimas que pesan menos, clásicos que se diluyen y novedades que no dejan de entrar. Cada una de esas piezas, por pequeña que sea, resta probabilidad de encontrar a otro niño con tu nombre.',
    closing: 'Los nombres de siempre siguen ahí. Lo que ha cambiado es todo lo que hay a su alrededor.',
  },
};

const texts: ArticleTexts = {
  title: 'Cada vez es más difícil llamarse como los demás',
  description:
    'La Tamborrada Infantil conserva los nombres que siempre reconocemos. Pero, edición tras edición, deja sitio a muchos más.',
  category: 'Nombres',
  readTime: '8 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

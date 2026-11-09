import type { ArticleTexts } from '../../../types/article.types';
import { buildArticleContent } from './build';
import type { ArticleCopy, StoryItem } from './copy.types';
import {
  derived,
  expectedDistinctNames,
  figures,
  pairOneIn,
  participants,
  sampleSize,
  topNames2008,
  topNames2026,
  topTenShare,
  topTenTotal,
  totalParticipations,
} from './figures';

const heading = (content: string): StoryItem => ({ kind: 'heading', text: () => content });
const text = (content: string): StoryItem => ({ kind: 'text', text: () => content });
const highlight = (content: string): StoryItem => ({ kind: 'highlight', text: () => content });

const last = <T>(values: readonly T[]) => values[values.length - 1];
const noData = '(sin 2009, 2010, 2012, 2021 ni 2022)';

const copy: ArticleCopy = {
  story: [
    text('Imagina dos patios de colegio separados por dieciocho años.'),
    {
      kind: 'text',
      text: (f) =>
        `En el primero, en 2008, hay unos 4.000 participantes de la Tamborrada Infantil. El nombre más frecuente es ${topNames2008[0].name}, que se repite ${f.int(topNames2008[0].count)} veces. El segundo es ${topNames2008[1].name}, con ${f.int(topNames2008[1].count)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Ahora viajamos a 2026. Hay casi un tercio más de niños: más de 5.200. Sin embargo, el nombre más repetido, ${topNames2026[0].name}, aparece ${f.int(topNames2026[0].count)} veces, y el segundo, ${topNames2026[1].name}, ${f.int(topNames2026[1].count)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Y no ocurre solo con los dos primeros. Si seguimos bajando por la clasificación, del primer puesto al décimo, descubrimos que cada uno de los diez nombres más populares reúne menos participantes que su equivalente de 2008. El cuarto de aquella edición tenía ${f.int(topNames2008[3].count)}; el de 2026, ${f.int(topNames2026[3].count)}.`,
    },
    text('¿Cómo es posible que haya más participantes, pero los nombres más populares se repitan menos?'),
    text(
      'La respuesta está en un cambio que ha ido produciéndose durante casi dos décadas y que resulta difícil apreciar de un año para otro. Para encontrarla hemos recorrido las listas de las dieciséis ediciones publicadas en Tamborradata, de 2008 a 2026.'
    ),

    heading('Los diez primeros, puesto por puesto'),
    {
      kind: 'text',
      text: (f) =>
        `Los diez nombres más repetidos de 2008 sumaban ${f.int(topTenTotal.y2008)} participantes. Los diez de 2026 suman ${f.int(topTenTotal.y2026)}, aunque la edición tiene más de 1.200 participantes más. Puesto por puesto, el resultado es el mismo: todos reúnen menos que su equivalente de hace dieciocho años, por poco en la cabeza y por bastante más a mitad de la clasificación.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Dicho en proporciones, hace dieciocho años uno de cada cinco participantes llevaba uno de esos diez nombres: el ${f.percent(topTenShare[0])}. Hoy es uno de cada siete: el ${f.percent(last(topTenShare))}.`,
    },
    highlight('Ser el nombre más popular sigue existiendo, pero ya no significa lo mismo.'),

    heading('¿Dónde han ido a parar los demás?'),
    {
      kind: 'text',
      text: (f) =>
        `Los participantes no han desaparecido: sus nombres se reparten entre muchas más opciones. En 2008 se registraron ${f.int(figures.distinct2008)} nombres distintos; en 2026, ${f.int(figures.distinct2026)}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Pero esa comparación sería injusta, porque cuantos más participantes hay, más nombres distintos aparecen aunque los gustos no cambien. Para compararlas en igualdad de condiciones, hemos medido cuántos nombres distintos cabe esperar al elegir al azar a ${f.int(sampleSize)} participantes de cada edición, que es el tamaño de la lista más pequeña. En 2008 serían unos ${f.int(expectedDistinctNames[0])}; en 2026, unos ${f.int(last(expectedDistinctNames))}: un ${f.int(derived.expectedIncreasePercent)} % más.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Tampoco parece deberse solo a qué colegios participan. En los ${f.int(figures.panelSchools)} colegios que han estado en todas las ediciones completas había ${f.int(figures.panel2023.participants)} participantes en 2023 y ${f.int(figures.panel2026.participants)} en 2026: casi el mismo número de niños. Sus nombres distintos pasaron de ${f.int(figures.panel2023.distinctNames)} a ${f.int(figures.panel2026.distinctNames)}.`,
    },
    text(
      'Con tantos nombres entre los que repartirse, coincidir es más difícil. Basta imaginar que se elige a dos participantes al azar de una misma edición y se pregunta cuál es la probabilidad de que se llamen igual.'
    ),
    {
      kind: 'highlight',
      text: (f) =>
        `En 2008, una de cada ${f.int(pairOneIn[0])} parejas de participantes compartía primer nombre; en 2026, solo una de cada ${f.int(last(pairOneIn))}.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `La diferencia se nota sobre todo en la cola de la lista. Hoy casi uno de cada cuatro participantes (el ${f.percent(figures.uncommon2026.share, 0)}) lleva un nombre poco habitual, de los que no llegan a cinco participantes en la edición; en 2008 era uno de cada cinco (el ${f.percent(figures.uncommon2008.share, 0)}). Y los nombres que lleva un único participante han pasado de ${f.int(figures.uncommon2008.singleBearerNames)} a ${f.int(figures.uncommon2026.singleBearerNames)}.`,
    },

    heading('¿Qué ha pasado con los favoritos de antes?'),
    {
      kind: 'text',
      text: (f) =>
        `Los clásicos pierden participantes. María pasó de ${f.int(figures.counts.maria.y2008)} en 2008 a ${f.int(figures.counts.maria.y2026)} en 2026, y Leire, de ${f.int(figures.counts.leire.y2008)} a ${f.int(figures.counts.leire.y2026)}. Siguen presentes, pero ya no están en la cima.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `A la vez suben otros que en 2008 casi no se oían. Martina, Noa y Laia tenían menos de cinco participantes cada una en 2008; en 2026 son ${f.int(figures.counts.martina.y2026)}, ${f.int(figures.counts.noa.y2026)} y ${f.int(figures.counts.laia.y2026)}. Pero ninguna llega a los ${f.int(figures.counts.maria.y2008)} y los ${f.int(figures.counts.leire.y2008)} con los que María y Leire estaban entre los cinco primeros. La popularidad ya no se concentra en unos pocos nombres: pasa de unos a otros y se reparte entre más.`,
    },
    {
      kind: 'text',
      text: (f) =>
        `Cada año llegan, además, nombres que no se habían visto antes. En 2026, uno de cada diez participantes lleva un nombre que no figuraba en ninguna de las ediciones publicadas entre 2008 y 2016. En 2017, eran poco más del ${f.percent(figures.unseen2017.share, 0)}.`,
    },

    heading('¿Ha ocurrido de repente?'),
    // Q10: the Top 10 keeps between 7 and 9 names from one published edition to the next.
    text(
      'No. Si se comparan las ediciones una a una, lo que se ve son pasos pequeños. De una edición a la siguiente suelen mantenerse entre siete y nueve de los diez nombres más repetidos, y Ane y Jon han estado entre los cinco primeros en las dieciséis ediciones.'
    ),
    {
      kind: 'text',
      text: (f) =>
        `El reparto se ha ido ampliando durante años, con altibajos. La probabilidad de coincidir en nombre con otro participante pasó de una entre ${f.int(pairOneIn[0])} en 2008 a una entre ${f.int(pairOneIn[2])} en 2013, una entre ${f.int(pairOneIn[8])} en 2019 y una entre ${f.int(last(pairOneIn))} en 2026. Hubo ediciones en las que retrocedió, como 2020. Y lo mismo ocurre con la cima: el peso de los diez primeros nombres ha bajado de forma irregular, con repuntes como los de 2018 y 2020. Son cambios pequeños que, sumados, transforman el conjunto.`,
    },

    heading('Volver a los dos patios'),
    {
      kind: 'text',
      text: (f) =>
        `Volvamos a los dos patios. En el de 2008, uno de cada ${f.int(derived.leaderOneIn2008)} participantes se llamaba ${topNames2008[0].name}, el nombre más repetido. En el de 2026, el nombre más repetido, ${topNames2026[0].name}, lo lleva uno de cada ${f.int(derived.leaderOneIn2026)}.`,
    },
    text('Ane y Jon siguen ahí, entre los tres primeros. Los nombres conocidos no han desaparecido.'),
    highlight('Lo que ha cambiado es todo lo que hay a su alrededor: cientos de nombres más, cada uno con unos pocos niños.'),
    text(
      'La Tamborrada Infantil sigue reuniendo a miles de participantes. Lo que ya no es tan probable es encontrarse, entre todos ellos, con alguien que se llame como tú.'
    ),
  ],
  data: {
    heading: 'La historia en datos',
    ranking: {
      lede: (f) =>
        `**Los diez nombres más repetidos reúnen hoy menos participantes que en 2008, con una edición mayor.** Participantes en cada puesto de la clasificación, en una edición de ${f.int(participants.y2008)} participantes con nombre identificado (2008) y otra de ${f.int(participants.y2026)} (2026).`,
      seriesLabel2008: '2008',
      seriesLabel2026: '2026',
      columns: ['Puesto', 'Nombre 2008', 'Participantes 2008', 'Nombre 2026', 'Participantes 2026', 'Diferencia'],
      totalLabel: 'Total',
    },
    topTen: {
      lede: (f) =>
        `**Los diez nombres más repetidos reúnen hoy a una parte menor que en 2008: del ${f.percent(topTenShare[0])} al ${f.percent(last(topTenShare))}.** Porcentaje de los participantes de cada edición que llevan uno de los diez nombres más repetidos de esa edición ${noData}.`,
      seriesLabel: 'Porcentaje de participantes',
    },
    pairs: {
      lede: (f) =>
        `**Con tantos nombres, coincidir es más difícil: de 1 entre ${f.int(pairOneIn[0])} a 1 entre ${f.int(last(pairOneIn))}.** Si se eligen dos participantes al azar de la misma edición, una de cada tantas parejas tiene el mismo primer nombre ${noData}.`,
      seriesLabel: 'Una de cada…',
    },
    distinct: {
      lede: (f) =>
        `**Con el mismo número de participantes, hoy hay más nombres distintos.** Nombres distintos que cabe esperar al elegir al azar a ${f.int(sampleSize)} participantes de cada edición ${noData}.`,
      seriesLabel: 'Nombres distintos esperables',
      compareCaption: (f) =>
        `En los mismos ${f.int(figures.panelSchools)} colegios y con casi el mismo número de niños, hay ${f.int(derived.panelExtraNames)} nombres más.`,
      left: {
        value: (f) => `${f.int(figures.panel2023.distinctNames)} nombres distintos`,
        description: (f) =>
          `${f.int(figures.panel2023.participants)} participantes de ${f.int(figures.panelSchools)} colegios`,
      },
      right: {
        value: (f) => `${f.int(figures.panel2026.distinctNames)} nombres distintos`,
        description: (f) =>
          `${f.int(figures.panel2026.participants)} participantes de los mismos ${f.int(figures.panelSchools)} colegios`,
      },
    },
    uncommon: {
      lede: () => '**Hoy más participantes que en 2008 llevan un nombre poco habitual.**',
      left: {
        value: (f) => f.percent(figures.uncommon2008.share, 0),
        description: (f) =>
          `de los participantes llevan un nombre que no llega a cinco participantes (${f.int(figures.uncommon2008.participants)} de ${f.int(participants.y2008)}). ${f.int(figures.uncommon2008.singleBearerNames)} nombres los lleva un único participante.`,
      },
      right: {
        value: (f) => f.percent(figures.uncommon2026.share, 0),
        description: (f) =>
          `(${f.int(figures.uncommon2026.participants)} de ${f.int(participants.y2026)}). ${f.int(figures.uncommon2026.singleBearerNames)} nombres los lleva un único participante.`,
      },
    },
    classics: {
      lede: () =>
        '**María y Leire pierden participantes; Martina, Noa y Laia los ganan.** Participantes con cada nombre.',
      columns: ['Nombre', '2008', '2026'],
      lessThanFive: 'menos de 5',
    },
    unseen: {
      lede: (f) =>
        `**Uno de cada diez participantes de 2026 lleva un nombre que no figuraba entre 2008 y 2016.** En 2017 eran el ${f.percent(figures.unseen2017.share)}. No hay datos de 2009 ni 2010: algún nombre podría haber aparecido en esos años.`,
      waffleLabel: (f) =>
        `${f.int(figures.unseen2026.participants)} de ${f.int(participants.y2026)} participantes (${f.percent(figures.unseen2026.share)})`,
    },
  },
  used: {
    heading: 'Datos utilizados',
    blocks: [
      (f) =>
        `**Qué datos.** Estadísticas publicadas de Tamborradata sobre ${f.int(figures.editions)} ediciones de la Tamborrada Infantil: 2008, 2011 a 2020 y 2022 a 2026 (no hay datos de 2009, 2010 ni 2021). Consulta del 9 de noviembre de 2026, sobre las versiones publicadas el 18 de octubre de 2026. Los gráficos de evolución usan 14 ediciones: no incluyen 2012 ni 2022, porque tienen unos 25 colegios, frente a 40 o más en las demás. Las de 2008 y 2011 pueden estar algo incompletas.`,
      (f) =>
        `**Qué cuenta cada cifra.** «Participantes» son participaciones con el primer nombre identificado sin ambigüedad: ${f.int(participants.y2008)} en 2008 y ${f.int(participants.y2026)} en 2026, de ${f.int(totalParticipations.y2008)} y ${f.int(totalParticipations.y2026)} participaciones totales (el resto son nombres ambiguos que no se cuentan). Contamos participaciones, no personas: quien desfila varios años aparece en cada edición. Solo se cuenta el primer nombre (Jon Ander cuenta como Jon), sin tildes ni eñes en el dato original, y las variantes (Xabier y Javier, Ane y Ana) cuentan como nombres distintos.`,
      (f) =>
        `**Cómo se calculan las medidas.** La probabilidad de coincidir es la proporción de parejas de participantes de una edición con el mismo primer nombre. Los nombres distintos «esperables» son el valor medio que resulta de elegir al azar ${f.int(sampleSize)} participantes de cada edición (el tamaño de la lista más pequeña), calculado de forma exacta. El panel reúne los ${f.int(figures.panelSchools)} colegios con participantes en las 12 ediciones completas (2013 a 2020 y 2023 a 2026). Los nombres «poco habituales» son los que llevan menos de cinco participantes en esa edición.`,
      () =>
        '**Límites.** Las listas no incluyen la edad ni el año de nacimiento, así que no se pueden atribuir los cambios a ninguna causa ni hablar de generaciones. Cada lista es una instantánea de niños de edades distintas.',
      () =>
        '**Privacidad.** Solo se publican agregados. Las cifras menores de cinco no se muestran.',
    ],
  },
};

const texts: ArticleTexts = {
  title: 'Cada vez es más difícil llamarse como los demás',
  description:
    'Con más participantes, los nombres más populares de la Tamborrada Infantil se repiten menos que en 2008: hay más nombres distintos y coincidir es más raro. Así ha cambiado el reparto en dieciocho años.',
  category: 'Nombres',
  readTime: '8 min',
  articleContent: buildArticleContent('es', copy),
};

export default texts;

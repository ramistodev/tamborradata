import type { useFormatter } from 'next-intl';
import type { getFormatter } from 'next-intl/server';
import type { OverviewResponse } from '../../../../../types/api/overview.types';
import { contactEmail } from '../../../config/constants';
import type { FAQItem } from '../../../components/ui';

type Formatter = ReturnType<typeof useFormatter> | Awaited<ReturnType<typeof getFormatter>>;

/**
 * The landing FAQs, written as the questions people actually type into a search engine. Every
 * figure comes from the overview, so the answers stay true with each new edition; when the overview
 * did not load, each answer falls back to a text that states no figures.
 */
export function buildLandingFaqs(format: Formatter, overview: OverviewResponse | null): FAQItem[] {
  const global = overview?.globalPeriod;
  const last = overview?.lastPeriod;

  // 'always': Spanish skips the thousands separator on 4-digit numbers (5149) by default
  const count = (value: number) => format.number(value, { useGrouping: 'always' });

  return [
    {
      question: '¿Qué es Tamborradata?',
      answer: `Tamborradata es una plataforma independiente y de código abierto que funciona como archivo histórico y estadístico de la Tamborrada Infantil de Donostia. Reúne las listas de participantes de cada edición${global ? ` desde ${global.startYear}` : ''} y las convierte en estadísticas, rankings y un buscador de participantes.`,
    },
    {
      question: '¿Cuántos niños y niñas participan en la Tamborrada Infantil de Donostia?',
      answer: buildHowManyAnswer(format, count, overview),
    },
    {
      question: '¿Cuál es el nombre más común en la Tamborrada Infantil?',
      answer: global
        ? `${global.topName.label} es el nombre más repetido de la Tamborrada Infantil: aparece en ${count(global.topName.count)} participaciones. Puedes ver el ranking completo de nombres en las estadísticas.`
        : 'Puedes ver el ranking de los nombres más repetidos en las estadísticas de la web.',
    },
    {
      question: '¿Cuál es el apellido más frecuente entre los participantes?',
      answer: global
        ? `${global.topSurname.label} es el apellido más frecuente: aparece en ${count(global.topSurname.count)} participaciones. Puedes ver el ranking completo de apellidos en las estadísticas.`
        : 'Puedes ver el ranking de los apellidos más frecuentes en las estadísticas de la web.',
    },
    {
      question: '¿Qué colegio tiene más participantes en la Tamborrada Infantil?',
      answer: global
        ? `${global.topSchool.label} es el colegio con más participaciones: ${count(global.topSchool.count)}. Puedes ver el ranking completo de colegios en las estadísticas.`
        : 'Puedes ver el ranking de los colegios con más participaciones en las estadísticas de la web.',
    },
    {
      question: '¿Cuándo se celebra la Tamborrada Infantil de Donostia?',
      answer:
        'Cada 20 de enero, el Día de San Sebastián, desfilan los niños y niñas de los colegios de Donostia. Tamborradata recoge las listas de participantes que se publican cada año.',
    },
    {
      question: '¿Cómo puedo saber en qué años salió mi hijo o hija en la Tamborrada?',
      answer:
        'En el buscador de participantes, escribe el nombre y los dos apellidos (si tiene nombre compuesto, vale con uno solo) y elige el colegio. Te mostrará en qué ediciones aparece, con el enlace a la fuente original de cada año.',
    },
    {
      question: '¿Hace falta registrarse o dar datos para usar el buscador?',
      answer:
        'No. El buscador funciona sin registro y sin pedir datos privados: solo escribes un nombre y eliges el colegio.',
    },
    {
      question: '¿De qué años hay datos de la Tamborrada Infantil?',
      answer: buildYearsAnswer(format, overview),
    },
    {
      question: '¿Por qué no aparece el nombre de mi hijo o hija en el buscador?',
      answer:
        'Comprueba que el colegio sea el correcto y prueba a quitar el segundo nombre o a escribir otra variante del apellido: en la fuente puede estar escrito de otra forma. También puede ser de una edición de la que no hay datos. Si sigues sin encontrarlo, escríbenos.',
    },
    {
      question: '¿De dónde salen los datos y son oficiales?',
      answer:
        'Los nombres proceden de las páginas que Diario Vasco dedica a las compañías infantiles de la Tamborrada; para las ediciones más antiguas se leen copias archivadas de esas páginas en Internet Archive. No es un registro oficial: los listados se procesan para poder buscarlos y pueden contener erratas, por eso cada resultado del buscador enlaza a su fuente.',
    },
    {
      question: '¿Cada cuánto se actualizan los datos?',
      answer: `Una vez al año: cuando se publican los listados de una nueva edición, se procesan y se añaden a las estadísticas y al buscador.${last ? ` La última edición incluida es la de ${last.year}.` : ''}`,
    },
    {
      question: '¿Qué significa "participación" en las estadísticas?',
      answer:
        'Una participación es un registro de una persona en una edición. Una misma persona puede sumar varias, una por cada año en el que aparece. Por eso el número de participaciones no es el de personas distintas.',
    },
    {
      question: '¿Puedo pedir una corrección o avisar de un error en los datos?',
      answer: `Sí. Escríbenos a ${contactEmail} indicando el año, el nombre y el colegio, y lo revisamos.`,
    },
    {
      question: '¿Tamborradata es de código abierto?',
      answer:
        'Sí. El código de la interfaz, sus componentes y sus visualizaciones es público en github.com/ramistodev/tamborradata: puedes leerlo, ejecutarlo en local y proponer mejoras. El pipeline interno de obtención y procesamiento de datos no forma parte del repositorio.',
    },
  ];
}

/** Last edition and whole history, each only when its period is available. */
function buildHowManyAnswer(
  format: Formatter,
  count: (value: number) => string,
  overview: OverviewResponse | null
): string {
  const global = overview?.globalPeriod;
  const last = overview?.lastPeriod;
  const parts: string[] = [];

  if (last) {
    parts.push(
      `En la edición de ${last.year} hubo ${count(last.totalParticipations)} participaciones de ${count(last.totalSchools)} colegios.`
    );

    if (last.growthRate !== null) {
      // The backend sends percentages as 2.89, not 0.0289
      const change = format.number(last.growthRate / 100, {
        style: 'percent',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: 'exceptZero',
      });
      parts.push(`Respecto a la edición anterior, la variación es de ${change}.`);
    }
  }

  if (global) {
    parts.push(
      `En total, Tamborradata reúne ${count(global.totalParticipations)} participaciones de ${global.editionsCount} ediciones y ${count(global.totalSchools)} colegios distintos.`
    );
  }

  if (parts.length === 0) {
    return 'Puedes consultar cuántas participaciones tuvo cada edición en las estadísticas de la web.';
  }

  // A participation is a record in an edition, not a different person
  parts.push('Una misma persona suma una participación por cada año en el que aparece.');
  return parts.join(' ');
}

/** The years answer needs the published period; without it, a text that states no figures takes its place. */
function buildYearsAnswer(format: Formatter, overview: OverviewResponse | null): string {
  const global = overview?.globalPeriod;

  if (!global) {
    return 'Hay datos de varias ediciones de la Tamborrada Infantil de Donostia, pero ahora mismo no podemos mostrar el rango exacto de años.';
  }

  const { editionsCount, startYear, endYear, missingYears } = global;
  const editions = `${editionsCount} ${editionsCount === 1 ? 'edición' : 'ediciones'}`;
  const gaps =
    missingYears.length > 0
      ? ` No hay datos de ${format.list(missingYears.map(String), { type: 'conjunction' })}.`
      : '';

  return `Hay datos de ${editions}, entre ${startYear} y ${endYear}.${gaps}`;
}

import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';

export function useFAQs() {
  const [openItems, setOpenItems] = useState({
    item1: false,
    item2: false,
    item3: false,
    item4: false,
    item5: false,
    item6: false,
    item7: false,
    item8: false,
    item9: false,
    item10: false,
  });

  const headerRef = useRef(null);

  // Detectar si están en vista los elementos para animaciones
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const faqs: { id: keyof typeof openItems; question: string; answer: string }[] = [
    {
      id: 'item1',
      question: '¿Qué es Tamborradata?',
      answer:
        'Tamborradata es una plataforma que analiza los datos históricos de la Tamborrada Infantil de San Sebastián. Mediante un algoritmo propio, recopila y procesa la información publicada cada año por el Diario Vasco, transformándola en estadísticas y visualizaciones que reflejan la evolución de esta tradición donostiarra.',
    },
    {
      id: 'item2',
      question: '¿De dónde salen los datos?',
      answer:
        'Los datos provienen de los artículos que publica anualmente El Diario Vasco sobre la Tamborrada Infantil. Tamborradata recopila esta información de forma automatizada para construir una base de datos histórica.',
    },
    {
      id: 'item3',
      question: '¿Cómo se analizan los datos?',
      answer:
        'Los datos se procesan mediante un algoritmo desarrollado específicamente para Tamborradata. Este algoritmo limpia, estructura y analiza la información para generar estadísticas comparables entre años.',
    },
    {
      id: 'item4',
      question: '¿Cada cuánto se actualizan las estadísticas?',
      answer:
        'El sistema se actualiza una vez al año, cada mes de enero, cuando El Diario Vasco publica los nuevos listados de participantes. En ese momento se recopilan los datos y se actualizan las gráficas y resúmenes.',
    },
    {
      id: 'item5',
      question: '¿Qué tipo de información se muestra?',
      answer:
        'Tamborradata genera estadísticas sobre nombres más comunes, colegios con mayor participación, diversidad de apellidos y otros datos relevantes relacionados con la Tamborrada Infantil.',
    },
    {
      id: 'item6',
      question: '¿Los datos personales son públicos?',
      answer:
        'No. Aunque la base de datos contiene nombres y apellidos de menores, esos datos no son públicos. Solo se muestran estadísticas generales y resúmenes agregados para proteger la privacidad de los participantes.',
    },
    {
      id: 'item7',
      question: '¿Qué tipo de análisis hace Tamborradata?',
      answer:
        'Tamborradata realiza análisis de participación, nombres más comunes, evolución de colegios y tendencias culturales basadas en los datos recopilados.',
    },
    {
      id: 'item8',
      question: '¿Cómo puedo contactar con Tamborradata?',
      answer:
        'Puedes contactar con Tamborradata a través del correo electronico contact@tamborradata.com ese es el correo oficial para cualquier consulta o sugerencia.',
    },
    {
      id: 'item9',
      question: '¿Puedo usar los datos para mis propios análisis?',
      answer:
        'Sí. Tamborradata publica los datos bajo licencia Creative Commons BY-SA 4.0, lo que permite su uso libre siempre que se cite la fuente.',
    },
    {
      id: 'item10',
      question: '¿Quién está detrás de Tamborradata?',
      answer:
        'Tamborradata es un proyecto independiente sin animo de lucro desarrollado por Ramistodev, con el objetivo de conservar y analizar la historia reciente de la Tamborrada Infantil de San Sebastián a través de los datos.',
    },
  ];

  const toggleItem = (item: keyof typeof openItems) => {
    setOpenItems((prev) => ({
      ...prev,
      [item]: !prev[item],
    }));
  };

  return { headerRef, isHeaderInView, faqs, toggleItem, openItems };
}

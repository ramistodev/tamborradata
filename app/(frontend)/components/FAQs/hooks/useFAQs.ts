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
        'Tamborradata es el sitio oficial de estadísticas y datos abiertos sobre la Tamborrada Infantil de Donostia, con una base histórica consolidada desde 2018.',
    },
    {
      id: 'item2',
      question: '¿Dónde consultar las estadísticas oficiales de la Tamborrada Infantil?',
      answer:
        'En tamborradata.com puedes ver estadísticas oficiales de participación, nombres, colegios y tendencias de la Tamborrada Infantil desde 2018.',
    },
    {
      id: 'item3',
      question: '¿Cómo buscar mi participación en la Tamborrada Infantil?',
      answer:
        'Accede a tamborradata.com/search e introduce tu nombre completo y compañía para localizar tu historial oficial desde 2018.',
    },
    {
      id: 'item4',
      question: '¿Qué información ofrece Tamborradata?',
      answer:
        'Ofrecemos estadísticas sobre participación, nombres, colegios, evolución por año y análisis culturales basados en los listados publicados cada enero.',
    },
    {
      id: 'item5',
      question: '¿Para qué sirve la base de datos histórica?',
      answer:
        'La base histórica preserva y analiza la evolución de la Tamborrada Infantil, aportando datos verificables para ciudadanía, investigadores y medios.',
    },
    {
      id: 'item6',
      question: '¿Con qué frecuencia se actualizan los datos?',
      answer:
        'Cada enero se incorporan los resultados oficiales recién publicados, manteniendo actualizadas las estadísticas y el buscador.',
    },
    {
      id: 'item7',
      question: '¿De dónde proceden los datos oficiales?',
      answer:
        'Los datos se basan en los listados oficiales publicados por El Diario Vasco, procesados y normalizados por Tamborradata desde 2018.',
    },
    {
      id: 'item8',
      question: '¿Los datos personales son públicos?',
      answer:
        'No publicamos datos personales individuales; solo se muestran estadísticas agregadas y resúmenes para proteger la privacidad.',
    },
    {
      id: 'item9',
      question: '¿Puedo usar los datos en mis proyectos?',
      answer:
        'Sí, la información está bajo licencia Creative Commons BY-SA 4.0; cita Tamborradata como fuente y respeta la atribución.',
    },
    {
      id: 'item10',
      question: '¿Quién está detrás de Tamborradata?',
      answer:
        'Tamborradata es un proyecto independiente desarrollado por Ramistodev para reforzar y preservar la Tamborrada Infantil con datos oficiales.',
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

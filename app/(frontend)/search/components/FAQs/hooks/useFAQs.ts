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
      question: '¿Qué información necesito para realizar una búsqueda?',
      answer:
        'Introduce tu nombre completo (nombre y dos apellidos) y, si lo conoces, la compañía en la que participaste para afinar el historial de participación.',
    },
    {
      id: 'item2',
      question: '¿Qué información muestran los resultados?',
      answer:
        'Verás tu historial de participación oficial: años, compañía y apariciones en la Tamborrada Infantil según los resultados publicados por El Diario Vasco.',
    },
    {
      id: 'item3',
      question: '¿Desde qué año puedo buscar participantes?',
      answer:
        'La base de datos histórica arranca en 2018 y se amplía cada enero con el nuevo listado oficial.',
    },
    {
      id: 'item4',
      question: '¿Por qué no aparece mi nombre?',
      answer:
        'Puede ser por variaciones en la escritura del nombre, selección incorrecta de compañía o porque no existan registros publicados desde 2018 para esa persona.',
    },
    {
      id: 'item5',
      question: '¿Con qué frecuencia se actualizan los datos del buscador?',
      answer:
        'Cada enero se actualiza automáticamente tras la publicación oficial para mantener el historial de participación al día.',
    },
    {
      id: 'item6',
      question: '¿Cómo saber si salí en la Tamborrada Infantil?',
      answer:
        'Introduce tu nombre completo y la compañía en el buscador; si existen registros desde 2018 verás en qué años apareces en la Tamborrada Infantil.',
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

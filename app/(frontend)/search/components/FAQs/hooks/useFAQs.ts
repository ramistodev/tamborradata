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
        'Para obtener resultados precisos debes introducir tu nombre completo (nombre y dos apellidos) y seleccionar la compañía en la que participaste.',
    },
    {
      id: 'item2',
      question: '¿Qué información muestran los resultados?',
      answer:
        'Los resultados indican el nombre completo, la compañía y los años en los que esa persona ha participado en la Tamborrada Infantil.',
    },
    {
      id: 'item3',
      question: '¿Desde qué año puedo buscar participantes?',
      answer:
        'El buscador ofrece registros históricos desde 2018 hasta la actualidad, con nuevas incorporaciones cada enero.',
    },
    {
      id: 'item4',
      question: '¿Por qué no aparece mi nombre?',
      answer:
        'Puede deberse a diferencias en la forma de escribir el nombre, a una compañía incorrecta o a que no haya registros disponibles para esa persona desde 2018.',
    },
    {
      id: 'item5',
      question: '¿Puedo buscar a cualquier participante?',
      answer:
        'Sí. Mientras conozcas su nombre completo y la compañía en la que estuvo, puedes consultar su historial dentro de los años disponibles.',
    },
    {
      id: 'item6',
      question: '¿Con qué frecuencia se actualizan los datos del buscador?',
      answer:
        'El buscador se actualiza automáticamente cada enero con el nuevo listado oficial de participantes publicado ese año.',
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

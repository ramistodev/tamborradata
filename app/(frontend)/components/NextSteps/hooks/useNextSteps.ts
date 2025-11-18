import { useInView } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

export function useNextSteps() {
  const [indexTurn, setIndexTurn] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Refs para los elementos a observar
  const headerRef = useRef(null);
  const cardRef = useRef(null);

  // Detectar si están en vista los elementos para animaciones
  const isHeaderInView = useInView(headerRef, {
    once: true,
    amount: 1.0,
  });

  const isCardInView = useInView(cardRef, {
    once: true,
    amount: 0.8,
  });

  const cards = [
    {
      title: 'Predicción de estadísticas',
      description:
        'Tamborradata permitirá predecir participación, nombres más repetidos y tendencias antes del 20 de enero, usando modelos matemáticos y datos históricos reales.',
      feasible: true,
    },
    {
      title: 'IA para predecir la Tamborrada',
      description:
        'Se aplicarán modelos de inteligencia artificial para generar predicciones completas de cada próxima edición, y comparándola después con los datos oficiales.',
      feasible: false,
    },
    {
      title: 'Más análisis y visualizaciones',
      description:
        'Se añadirán nuevos gráficos, comparativas avanzadas y herramientas para explorar la historia completa de la Tamborrada Infantil.',
      feasible: true,
    },
    {
      title: 'Consultar tu nombre',
      description:
        'Los participantes podrán buscar su nombre para ver si aparecen en la base de datos, y ver cuantas veces han participado a lo largo de los años.',
      feasible: true,
    },
    {
      title: 'Estadísticas por participante',
      description:
        'Cada participante al consultar su nombre podrá ver estadísticas personalizadas sobre su participación y comparativas con otros nombres similares.',
      feasible: false,
    },
  ];

  const startInterval = useCallback(() => {
    // Limpiar interval existente
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Crear nuevo interval
    intervalRef.current = setInterval(() => {
      setIndexTurn((prevIndex) => (prevIndex + 1) % cards.length);
    }, 7000);
  }, [cards.length]);

  useEffect(() => {
    startInterval();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startInterval]);

  const handleSetIndexTurn = useCallback(
    (index: number) => {
      setIndexTurn(index);
      startInterval(); // Reiniciar el interval
    },
    [startInterval]
  );

  return {
    headerRef,
    cardRef,
    isHeaderInView,
    isCardInView,
    cards,
    indexTurn,
    setIndexTurn: handleSetIndexTurn,
    setDisabled,
    disabled,
  };
}

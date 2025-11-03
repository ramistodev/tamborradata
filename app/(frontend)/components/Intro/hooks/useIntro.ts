import { useEffect, useState } from 'react';

export function useIntro() {
  const text = [
    'Tamborradata recopila y analiza cada año los datos de la Tamborrada Infantil de San Sebastián, para entender cómo evoluciona esta tradición donostiarra.',
    'Tamborradata transforma la información publicada cada año en estadísticas claras y fáciles de interpretar.',
    'Cada enero, Tamborradata actualiza sus datos para mostrar cómo cambian los colegios, los nombres y la participación en la Tamborrada Infantil.',
    'Tamborradata convierte la tradición de la Tamborrada en datos y visualizaciones que cuentan su historia desde una nueva perspectiva.',
    'Un proyecto nacido en Donostia que une tecnología, cultura y curiosidad para preservar la memoria de la Tamborrada Infantil.',
    'Tamborradata analiza año a año los nombres, colegios y tendencias que forman parte de la historia reciente de la Tamborrada Infantil.',
    'Desde 2018, Tamborradata recopila y procesa datos reales de la Tamborrada Infantil para ofrecer una visión más completa de su evolución.',
    'Una base de datos viva que crece cada año con nueva información sobre la Tamborrada Infantil de San Sebastián.',
    'Tamborradata utiliza análisis automatizado para mostrar cómo evoluciona la Tamborrada Infantil y quiénes la hacen posible.',
    'Un proyecto local y abierto que combina inteligencia de datos, tecnología y pasión por la Tamborrada de San Sebastián.',
  ];

  const [randomPhrase, setRandomPhrase] = useState(text[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * text.length);
    setRandomPhrase(text[randomIndex]);
  }, []);

  return { randomPhrase };
}

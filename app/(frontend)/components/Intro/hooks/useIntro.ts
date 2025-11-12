import { useEffect, useState } from 'react';

export function useIntro() {
  const text = [
    'Tamborradata rastrea, limpia y organiza información dispersa en Internet para convertirla en datos fiables sobre la Tamborrada Infantil',
    'La única plataforma dedicada exclusivamente a estudiar y documentar la Tamborrada Infantil de San Sebastián',
    'Un ejemplo real de ingeniería de datos, software y producto aplicado a una tradición cultural de más de un siglo',
    'Un proyecto nacido en Donostia que demuestra cómo la tecnología puede reforzar y preservar la identidad cultural',
    'Tamborradata reúne más de 30.000 nombres registrados a lo largo de los años y los transforma en conocimiento accesible',
    'Un sistema que utiliza inteligencia artificial para interpretar y explicar cada estadística de forma clara y humana',
    'Cada enero, Tamborradata conecta cultura y datos para mostrar cómo cambia la Tamborrada Infantil con el paso del tiempo',
    'Los algoritmos de Tamborradata procesan miles de datos para revelar patrones invisibles en colegios, nombres y participación',
    'Una plataforma creada para que cualquiera pueda entender la evolución histórica de la Tamborrada Infantil',
    'Tamborradata automatiza la recopilación de datos para ofrecer una visión precisa y actualizada de cada edición',
    'Un proyecto pensado para quienes quieren explorar la Tamborrada más allá de la fiesta y descubrir su impacto real',
    'Tamborradata da forma a estadísticas que ayudan a entender cómo crece, cambia y se diversifica la Tamborrada Infantil',
    'Una herramienta que convierte datos brutos en gráficos, tendencias y conclusiones fáciles de interpretar',
    'Tamborradata ofrece una mirada técnica y cultural a uno de los eventos más importantes de Donostia',
    'Más que una base de datos: un archivo vivo que se actualiza automáticamente cada año',
    'Cada año, Tamborradata reconstruye la Tamborrada Infantil pieza a pieza para ofrecer la fotografía más completa posible',
    'Un proyecto que combina scraping, análisis, automatización e IA para estudiar una tradición única',
    'Tamborradata traduce información compleja en estadísticas claras para todo tipo de usuarios',
    'Una plataforma desarrollada para preservar, medir y comprender la historia reciente de la Tamborrada Infantil',
    'Detrás de cada dato hay un proceso de limpieza, verificación y análisis diseñado específicamente para este proyecto',
    'Tamborradata es la referencia digital para explorar nombres, colegios y evolución de la Tamborrada Infantil',
    'Un proyecto artesanal en código, pero industrial en datos: cada registro pasa por un proceso propio de validación',
    'Diseñado desde cero para que cada visitante entienda cómo han cambiado generaciones de tamborreros y cantineras',
    'Tamborradata demuestra cómo la ingeniería de datos puede aplicarse a tradiciones locales de una forma útil y moderna',
    'Una plataforma que revela la evolución social de Donostia a través de la Tamborrada Infantil',
    'Tamborradata analiza miles de nombres para descubrir modas, tendencias y cambios culturales año tras año',
    'La tecnología detrás de Tamborradata procesa automáticamente los contenidos publicados cada año sobre la Tamborrada',
    'Un proyecto que une curiosidad, ingeniería y tradición para crear la base de datos más completa de la Tamborrada Infantil',
    'Tamborradata convierte datos dispersos en Internet en un repositorio ordenado, fiable y accesible para todos',
    'Una mirada moderna a una tradición histórica: así es el objetivo de Tamborradata',
  ];

  const [randomPhrase, setRandomPhrase] = useState(text[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * text.length);
    setRandomPhrase(text[randomIndex]);
  }, []);

  return { randomPhrase };
}

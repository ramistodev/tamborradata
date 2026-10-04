import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Información del Proyecto Tamborradata: origen de datos, privacidad y metodología',
  description:
    'Detalles sobre el origen de los datos de Tamborradata, cómo se procesan los listados públicos del Diario Vasco, qué medidas de privacidad se aplican y cómo funciona el sistema automatizado que genera las estadísticas de la Tamborrada Infantil.',
  openGraph: {
    title: 'Información del Proyecto Tamborradata: origen de datos, privacidad y metodología',
    description:
      'Detalles sobre el origen de los datos de Tamborradata, cómo se procesan los listados públicos del Diario Vasco, qué medidas de privacidad se aplican y cómo funciona el sistema automatizado que genera las estadísticas de la Tamborrada Infantil.',
    url: 'https://tamborradata.com/statistics/info',
    images: [
      {
        url: 'https://tamborradata.com/og-image.webp',
        alt: 'Información del Proyecto Tamborradata',
      },
    ],
    locale: 'es_ES',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Información del Proyecto Tamborradata: origen de datos, privacidad y metodología',
    description:
      'Detalles sobre el origen de los datos de Tamborradata, cómo se procesan los listados públicos del Diario Vasco, qué medidas de privacidad se aplican y cómo funciona el sistema automatizado que genera las estadísticas de la Tamborrada Infantil.',
    images: ['https://tamborradata.com/og-image.webp'],
    site: '@tamborradata',
    creator: '@tamborradata',
  },
  alternates: {
    canonical: 'https://tamborradata.com/statistics/info',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'standard',
      'max-snippet': 150,
      'max-video-preview': -1,
    },
  },
};

export default function InfoPage() {
  return (
    <>
      <h1 className="text-4xl font-bold">
        <span className="hidden md:block">
          Información del Proyecto Tamborradata: origen de datos, privacidad y metodologías
        </span>
        <span className="block md:hidden">Información del Proyecto Tamborradata</span>
      </h1>

      <p className="text-lg">
        Tamborradata ofrece estadísticas aproximadas, pero muy cercanas a la realidad, obtenidas
        exclusivamente a partir de los artículos públicos que publica <em>El Diario Vasco</em> cada
        año sobre la Tamborrada Infantil de San Sebastián. Los datos mostrados son el resultado de
        un proceso automatizado de análisis, y aunque pueden existir ligeras variaciones frente a la
        fuente original, las cifras reflejan con gran fidelidad la participación real.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Origen de los Datos</h2>
      <p className="text-base md:text-lg">
        Toda la información proviene exclusivamente de los listados de participantes publicados de
        forma pública por <em>El Diario Vasco</em>. Estos listados incluyen nombres y apellidos de
        los niños y niñas participantes, organizados por colegios. Tamborradata no utiliza fuentes
        privadas ni accede a ningún sistema interno del periódico.
      </p>

      <p className="text-base md:text-lg">
        El sistema procesa automáticamente estos artículos para generar un conjunto estructurado de
        estadísticas: nombres más comunes, apellidos, participación total por colegio, aparición de
        nuevos nombres, evolución histórica, etc. Las cifras presentadas se derivan de ese análisis
        automatizado.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">
        Privacidad y Tratamiento de Menores
      </h2>
      <p className="text-base md:text-lg">
        Aunque las fuentes originales muestran nombres y apellidos completos, Tamborradata{' '}
        <strong>no expone datos individuales identificables</strong>. Los listados completos no se
        publican aquí y no existe ninguna función de búsqueda individual por nombre o apellido.
      </p>

      <p className="text-base md:text-lg">
        Toda la información detallada permanece en una <strong>base de datos privada</strong> y solo
        se usa para generar estadísticas agregadas. El objetivo es puramente informativo, educativo
        y cultural, sin explotación comercial ni identificación de menores.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Funcionamiento del Sistema</h2>
      <p className="text-base md:text-lg">
        Cada mes de enero se ejecuta un <strong>script automatizado privado</strong> que:
      </p>

      <ul className="list-disc pl-6 text-base md:text-lg">
        <li>localiza los nuevos artículos publicados por El Diario Vasco,</li>
        <li>extrae los listados de participantes,</li>
        <li>procesa y normaliza los datos,</li>
        <li>actualiza la base de datos interna,</li>
        <li>regenera todas las estadísticas del año,</li>
        <li>y produce resúmenes interpretativos mediante IA.</li>
      </ul>

      <p className="text-base md:text-lg mt-4">
        Este script no es público debido a que contiene procesos de extracción y análisis masivo de
        datos de menores. Se mantiene cerrado para proteger la privacidad y evitar cualquier uso
        indebido del sistema.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Objetivo del Proyecto</h2>
      <p className="text-base md:text-lg">
        Tamborradata es una plataforma con fines{' '}
        <strong>culturales, históricos y educativos</strong>. Su propósito es preservar, analizar y
        mostrar la evolución de la Tamborrada Infantil a través de datos estructurados.
      </p>

      <p className="text-base md:text-lg">El proyecto busca:</p>

      <ul className="list-disc pl-6 text-base md:text-lg">
        <li>conservar la información histórica de la Tamborrada Infantil,</li>
        <li>mostrar cómo evoluciona la participación, los colegios y los nombres,</li>
        <li>ofrecer contexto y valor añadido a cada edición,</li>
        <li>proveer estadísticas útiles para ciudadanía, estudiantes e investigadores,</li>
        <li>y servir como fuente fiable para periodistas y medios de comunicación.</li>
      </ul>

      <p className="text-base md:text-lg mt-4">
        En definitiva, Tamborradata pretende ampliar el conocimiento disponible en internet sobre
        uno de los eventos más representativos de Donostia, ofreciendo una visión moderna basada en
        información real y transparente.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Responsabilidad y Ética</h2>
      <p className="text-base md:text-lg">
        El proyecto sigue un enfoque responsable y ético en el manejo de datos, priorizando siempre
        la protección del menor. No se muestran datos completos ni información que pueda identificar
        a una persona concreta.
      </p>

      <p className="text-base md:text-lg">
        Para contactar, solicitar aclaraciones o pedir la retirada de cualquier información, puedes
        utilizar los medios de comunicación disponibles en esta web.
      </p>
    </>
  );
}

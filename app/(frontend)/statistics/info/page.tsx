export default function InfoPage() {
  return (
    <>
      <h1 className="text-4xl font-bold">Información y Transparencia de Datos</h1>

      <p className="text-lg">
        Esta página tiene como objetivo ofrecer información detallada sobre el origen de los datos,
        el funcionamiento del sistema automatizado de recopilación y análisis, así como las medidas
        de seguridad y privacidad aplicadas para proteger toda la información tratada.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Origen de los Datos</h2>
      <p className="text-base md:text-lg">
        Todos los datos y estadísticas mostrados en <strong>Tamborradata</strong> proceden de
        artículos públicos publicados por el periódico <em>El Diario Vasco</em>, en sus coberturas
        anuales sobre la <strong>Tamborrada Infantil de San Sebastián</strong>. Cada año, el medio
        publica listados de participantes organizados por colegios, lo que permite obtener de forma
        legítima y pública los nombres y apellidos de los niños y niñas que participan en el
        desfile.
      </p>

      <p className="text-base md:text-lg">
        La recopilación de esta información no implica en ningún momento la publicación de datos
        adicionales, ni el uso con fines comerciales o identificativos. El propósito de este
        proyecto es puramente <strong>estadístico, cultural y educativo</strong>, orientado a
        analizar la evolución y diversidad de la Tamborrada Infantil a lo largo de los años.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Funcionamiento del Sistema</h2>
      <p className="text-base md:text-lg">
        El sistema cuenta con un software automatizado que se ejecuta cada mes de enero,
        coincidiendo con la celebración de la Tamborrada. Este software realiza un proceso de
        <strong> recopilación automática de información pública</strong> de las nuevas ediciones del
        evento, analiza los artículos y extrae los nombres, colegios y demás datos relevantes.
      </p>

      <p className="text-base md:text-lg">
        Una vez obtenidos los datos, se almacenan en una <strong>base de datos privada</strong> y se
        procesan mediante un conjunto de algoritmos que generan estadísticas como los nombres más
        repetidos, la evolución de los colegios participantes o la diversidad de apellidos, entre
        otros.
      </p>

      <p className="text-base md:text-lg">
        Además, para facilitar la comprensión de los resultados, el sistema utiliza un modelo de
        <strong> inteligencia artificial</strong> que genera <em>resúmenes interpretativos</em> a
        partir de los datos brutos. Estos resúmenes son los textos explicativos que pueden verse
        debajo de cada tabla o gráfico dentro de la página.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">
        Privacidad y Seguridad de los Datos
      </h2>
      <p className="text-base md:text-lg">
        La base de datos donde se almacenan los registros es <strong>totalmente privada</strong> y
        no está expuesta públicamente. Únicamente el sistema interno tiene acceso a ella para
        generar las estadísticas que se muestran de forma agregada y anónima en la web.
      </p>

      <p className="text-base md:text-lg">
        Se aplican <strong>medidas de seguridad técnicas y organizativas</strong> para proteger los
        datos de accesos no autorizados, pérdidas o filtraciones. Entre ellas se incluyen la
        restricción de accesos mediante claves seguras y políticas de control de uso en el servidor.
      </p>

      <p className="text-base md:text-lg">
        En ningún momento se muestran datos personales de menores de edad de forma individual ni se
        permite su búsqueda directa. Los nombres y apellidos se emplean exclusivamente con fines
        estadísticos y se presentan siempre de manera agregada o en listados derivados del propio
        contenido público original.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Finalidad del Proyecto</h2>
      <p className="text-base md:text-lg">
        <strong>Tamborradata</strong> es un proyecto de carácter{' '}
        <em>cultural, histórico y educativo</em> que busca preservar y visualizar la evolución de
        una de las tradiciones más emblemáticas de Donostia / San Sebastián. A través del análisis
        de datos, se pretende ofrecer una nueva forma de entender la magnitud y diversidad de la
        Tamborrada Infantil, sin comprometer la privacidad de las personas o participantes.
      </p>

      <p className="text-base md:text-lg">
        El proyecto no tiene fines comerciales ni publicitarios, y su objetivo principal es fomentar
        la transparencia, el acceso al conocimiento y la valoración de la historia local mediante el
        uso responsable de la tecnología y los datos.
      </p>

      <h2 className="text-2xl md:text-3xl font-semibold mt-5">Responsabilidad y Ética</h2>
      <p className="text-base md:text-lg">
        El desarrollo de este proyecto sigue un enfoque ético en el tratamiento de los datos,
        priorizando la <strong>protección de la identidad</strong> y el respeto hacia los
        participantes. Cualquier uso indebido o reproducción no autorizada de la información aquí
        mostrada queda estrictamente prohibido.
      </p>

      <p className="text-base md:text-lg">
        En caso de que algún interesado desee solicitar la eliminación de información, corrección o
        aclaración, puede ponerse en contacto con el desarrollador del proyecto mediante los canales
        de comunicación indicados en esta página web.
      </p>

      <p className="mt-10 text-sm italic text-gray-500 dark:text-gray-400">
        Última actualización: Octubre de 2025 · Proyecto desarrollado y mantenido por Ramistodev.
      </p>
    </>
  );
}

const privacyPolicy = {
  metadata: {
    title: 'Política de privacidad',
    description:
      'Cómo obtenemos, tratamos y protegemos los datos de Tamborradata: fuentes, estadísticas, buscador de participantes, cookies y cómo ejercer tus derechos.',
  },
  hero: {
    titleLine1: 'Política de',
    titleLine2: 'privacidad',
    description:
      'Transparencia sobre cómo tratamos y protegemos la información que hace posible Tamborradata.',
    published: 'Publicado el {date}',
    updated: 'Actualizado el {date}',
  },
  structuredData: {
    home: 'Inicio',
  },
  aside: {
    title: 'Contenido',
    open: 'Abrir el contenido',
    close: 'Cerrar el contenido',
  },
  sections: {
    controller: {
      title: 'Responsable y contacto',
      p1: 'Tamborradata es una web que ofrece estadísticas sobre los participantes de las compañías infantiles de la Tamborrada de Donostia / San Sebastián, y un buscador para consultar en qué ediciones aparece un participante.',
      p2: 'El responsable del tratamiento de los datos descritos en esta política es el titular de Tamborradata. Para cualquier cuestión relacionada con la privacidad, incluida la solicitud de retirada de un nombre, puedes escribir a <mail>{email}</mail>.',
    },
    data: {
      title: 'Qué datos tratamos',
      intro: 'Tratamos dos tipos de datos, con una naturaleza muy distinta.',
      participants:
        '<strong>Datos de los participantes.</strong> Son los que aparecen publicados en las listas de las compañías infantiles de la Tamborrada. Por cada participante guardamos:',
      i1: 'Su nombre y apellidos, tal y como se publicaron y en una versión normalizada.',
      i2: 'El colegio o compañía a la que pertenece.',
      i3: 'El año de la edición en la que aparece.',
      i4: 'La dirección de la página donde se publicó, para poder enlazar la fuente.',
      i5: 'Una separación calculada entre nombre y apellidos, que usamos para las estadísticas.',
      notStored:
        'No guardamos edad, fecha de nacimiento, sexo, imagen, dirección ni ningún dato de contacto de los participantes.',
      visitors:
        '<strong>Datos de quienes visitan la web.</strong> No pedimos registro, no hay cuentas de usuario y no hay formularios de contacto. Solo se tratan los datos técnicos que se describen en la sección de cookies y analítica, y los que genera el uso del buscador.',
    },
    sources: {
      title: 'De dónde salen los datos',
      p1: 'Los datos de los participantes no los facilitan ellos ni sus familias a Tamborradata. Los recogemos de una única fuente pública: las páginas que Diario Vasco dedica a las compañías infantiles de la Tamborrada.',
      p2: 'El proceso de obtención es automático y consta de dos pasos:',
      i1: '<strong>Localizar las páginas.</strong> Consultamos el listado de la sección en Diario Vasco, un buscador (a través de la API de SerpAPI) y las copias históricas guardadas por Internet Archive para las ediciones más antiguas.',
      i2: '<strong>Leer los nombres.</strong> Un programa lee de cada página el nombre del colegio y la lista de participantes. No hay introducción manual de datos.',
      p3: 'Los datos no son oficiales. Dependen de lo que el medio publicó en su momento y pueden contener errores, omisiones o diferencias respecto a la lista real de cada edición.',
    },
    processing: {
      title: 'Cómo los tratamos',
      intro:
        'Una vez leídos los nombres, los ordenamos y los estudiamos para poder ofrecer estadísticas y búsquedas. Estos son los pasos:',
      i1: '<strong>Limpieza.</strong> Se descartan las líneas que no parecen el nombre de una persona (con números, direcciones o demasiado cortas o largas) y se unifica el formato, por ejemplo «Apellidos, Nombre» pasa a «Nombre Apellidos». También se eliminan tildes y mayúsculas para poder comparar nombres.',
      i2: '<strong>Colegios.</strong> Cada nombre se asocia a un colegio. Cuando el mismo colegio aparece escrito de varias formas, las agrupamos por similitud.',
      i3: '<strong>Nombre y apellidos.</strong> El texto publicado no distingue entre nombre y apellidos, así que lo separamos con un método estadístico basado en la frecuencia con la que cada palabra aparece como nombre o como apellido en el conjunto de los datos. No usa inteligencia artificial. La separación es probabilística, y los casos dudosos quedan fuera de las estadísticas y del buscador.',
      i4: '<strong>Duplicados.</strong> Si el mismo nombre aparece varias veces en el mismo colegio y año, se guarda una sola vez.',
      outro:
        'No existe un identificador de persona. Una misma persona se reconoce entre ediciones solo porque su nombre normalizado coincide, de modo que dos personas distintas con el mismo nombre, colegio y año pueden aparecer como una sola.',
    },
    statistics: {
      title: 'Estadísticas y resúmenes',
      p1: 'Con los datos ya tratados calculamos estadísticas por edición y para el conjunto de todas ellas: nombres y apellidos más comunes, evolución a lo largo de los años, novedades y desapariciones, diversidad y concentración, y rankings de colegios.',
      i1: 'Los rankings y gráficos muestran <strong>datos agregados</strong>: cuántas veces aparece un nombre, un apellido o una combinación de ambos.',
      i2: 'Los rankings de combinaciones de nombre y apellido solo incluyen pares que aparecen al menos dos veces y cuentan participaciones, no personas distintas. En ningún caso se publica el nombre completo de una persona en una estadística.',
      i3: 'Las estadísticas se recalculan cada vez que se incorpora una nueva edición o se retira un registro.',
      ai: '<strong>Resúmenes redactados con IA.</strong> Algunos textos explicativos de las estadísticas se redactan con un modelo de lenguaje de OpenAI y se traducen a varios idiomas. El modelo recibe únicamente datos agregados (rankings, series y valores) y nunca las filas de los participantes. Se le indica expresamente que no infiera parentescos, orígenes ni otras características de las personas. Como cualquier texto generado automáticamente, puede contener imprecisiones.',
    },
    search: {
      title: 'El buscador de participantes',
      p1: 'El buscador permite comprobar en qué ediciones aparece un participante. Para evitar que se use para recorrer listas enteras, exige indicar dos datos a la vez.',
      i1: '<strong>Qué se pide.</strong> El nombre completo (mínimo tres palabras, máximo 120 caracteres) y el colegio, que se elige de una lista.',
      i2: '<strong>Qué se compara.</strong> El texto se pasa a minúsculas y sin tildes, y se compara con los participantes de ese colegio. Se admiten coincidencias exactas y compatibles (por ejemplo, sin el segundo nombre o sin el segundo apellido), pero nunca sin el primer apellido.',
      i3: '<strong>Qué se filtra.</strong> Solo se tienen en cuenta los registros cuya separación de nombre y apellidos ha podido resolverse con fiabilidad.',
      i4: '<strong>Qué se muestra.</strong> El nombre tal como se publicó, el colegio y los años en los que aparece, cada uno con enlace a la página donde se publicó. Las coincidencias exactas se muestran primero y después las más recientes.',
      i5: '<strong>Qué no se hace.</strong> No se generan comparaciones ni puntuaciones sobre personas concretas.',
      privacy:
        '<strong>Qué pasa con lo que buscas.</strong> El nombre se envía al servidor en el cuerpo de la petición, no en la dirección de la página, y nuestro código no lo guarda ni lo registra. Para limitar el abuso, restringimos el número de búsquedas por dirección IP: usamos una huella cifrada de la IP que se conserva solo en la memoria del servidor, no la IP en claro. El proveedor de alojamiento puede registrar datos técnicos de las peticiones, como se explica en la sección de proveedores y terceros.',
    },
    minors: {
      title: 'Menores de edad',
      p1: 'Las compañías de las que se extraen los datos son compañías infantiles, por lo que <strong>la mayoría de las personas que aparecen son menores de edad</strong> o lo eran en el momento de la publicación. Lo decimos con claridad porque creemos que debes saberlo.',
      p2: 'Solo guardamos lo que ya había publicado un medio de comunicación (nombre, colegio y año), sin ningún dato adicional, y no tratamos de identificar, localizar ni contactar a nadie. La base jurídica de este tratamiento es el interés legítimo en ofrecer información estadística y cultural sobre una tradición pública, ponderado con los derechos de las personas afectadas.',
      p3: 'Si eres una persona que aparece en Tamborradata, o su madre, padre o tutor, y prefieres que no aparezca, basta con que lo pidas. No hace falta justificar el motivo. Consulta cómo hacerlo en la sección de derechos.',
    },
    cookies: {
      title: 'Cookies y analítica',
      p1: 'Tamborradata no usa cookies de publicidad ni de seguimiento, y no incluye herramientas de terceros para elaborar perfiles.',
      i1: '<strong>Cookie de idioma.</strong> La web puede guardar una cookie llamada <code>NEXT_LOCALE</code> con el idioma elegido (español, euskera o inglés). Es técnica, necesaria para recordar tu preferencia, de sesión y no contiene datos personales.',
      i2: '<strong>Analítica de visitas.</strong> Usamos Vercel Analytics para conocer de forma agregada qué páginas se visitan. Según la documentación del proveedor, no emplea cookies ni te sigue entre sitios web distintos.',
      i3: '<strong>Rendimiento.</strong> Usamos Vercel Speed Insights para medir la velocidad de carga de las páginas (métricas técnicas como el tiempo de carga, el tipo de dispositivo o el navegador).',
      p2: 'No guardamos tus búsquedas en el navegador más allá de la memoria de la pestaña abierta, que se borra al cerrarla.',
    },
    thirdParties: {
      title: 'Proveedores y terceros',
      intro: 'Para funcionar, Tamborradata se apoya en estos proveedores:',
      i1: '<strong>Vercel.</strong> Aloja la web y ofrece la analítica de visitas y las métricas de rendimiento. Como en cualquier alojamiento, sus servidores pueden registrar datos técnicos de las peticiones, como la dirección IP, la página solicitada o el navegador.',
      i2: '<strong>Supabase.</strong> Aloja la base de datos donde se almacenan los participantes y las estadísticas.',
      i3: '<strong>OpenAI.</strong> Redacta y traduce los resúmenes de las estadísticas. Solo recibe datos agregados, nunca nombres de participantes (ver la sección de estadísticas).',
      i4: '<strong>SerpAPI e Internet Archive.</strong> Se usan en el proceso de localizar las páginas de origen. No reciben datos de los visitantes de Tamborradata.',
      i5: '<strong>Buy Me a Coffee.</strong> Es el servicio externo al que enlazamos si quieres apoyar el proyecto con una donación. Al hacer clic sales de Tamborradata: el pago y los datos que facilites allí (como tu nombre, un mensaje o tu correo) los trata Buy Me a Coffee y su proveedor de pagos, según sus propias políticas. Tamborradata no incluye sus scripts, no les envía datos de quienes visitan la web y no recibe ni guarda datos de pago.',
      outro:
        'No vendemos ni cedemos datos a terceros con fines comerciales. Algunos de estos proveedores pueden tratar datos fuera del Espacio Económico Europeo, con las garantías que ofrecen en sus propias políticas de privacidad.',
    },
    rights: {
      title: 'Tus derechos y retirada de datos',
      intro: 'Tienes derecho a:',
      i1: 'Saber si tratamos datos tuyos y acceder a ellos.',
      i2: 'Pedir que corrijamos un dato inexacto, por ejemplo un nombre mal escrito.',
      i3: 'Pedir que eliminemos tus datos (derecho de supresión).',
      i4: 'Oponerte al tratamiento o pedir que se limite.',
      remove:
        '<strong>Cómo retirar un nombre.</strong> Escribe a <mail>{email}</mail> indicando el nombre tal y como aparece, el colegio y, si lo recuerdas, el año. Si la solicitud la hace una madre, un padre o un tutor, basta con que lo indique. Podemos pedir una comprobación mínima para asegurarnos de que la petición es legítima.',
      response:
        'Responderemos sin demora indebida y, como máximo, en el plazo de un mes. Al retirar un registro desaparece del buscador y se recalculan las estadísticas para que su contribución deje de contar.',
      limits:
        'Retirar un nombre de Tamborradata no lo elimina de la página original del medio ni de las copias de Internet Archive, que son ajenas a nosotros. Si no estás conforme con nuestra respuesta, puedes presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).',
    },
    retention: {
      title: 'Conservación y seguridad',
      p1: 'Conservamos los datos de los participantes mientras el proyecto siga activo, ya que su finalidad es precisamente comparar ediciones a lo largo del tiempo, o hasta que se solicite su retirada.',
      p2: 'La base de datos solo se modifica desde nuestro proceso interno de actualización, y la web accede a ella únicamente desde el servidor. Las claves de acceso no se exponen en el navegador.',
      p3: 'Ningún sistema es infalible. Si detectamos un incidente que afecte a datos personales, actuaremos conforme a la normativa aplicable.',
    },
    changes: {
      title: 'Cambios en esta política',
      p1: 'Podemos actualizar esta política cuando cambie la forma en que tratamos los datos, por ejemplo si incorporamos una nueva fuente o una nueva herramienta. La fecha de la última modificación aparece al principio de esta página.',
      p2: 'Si tienes cualquier duda sobre cómo funciona Tamborradata o sobre tus datos, escríbenos y te lo explicamos.',
    },
  },
};

export default privacyPolicy;

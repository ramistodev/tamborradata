// Limpieza y normalización de nombres de escuelas
export function cleanSchoolName(input: string): string {
  if (!input) return '';

  let school = input.trim();

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Eliminaciones y normalizaciones iniciales (insensible a mayúsculas)
  school = school.replace(/\btamborrada\s*(infantil)?\s*(de)?\b/gi, '');
  school = school.replace(/\binfantil\s*tamborrada\b/gi, '');
  school = school.replace(/\b\d{4}\b/g, '');
  school = school.replace(/\s{2,}/g, ' ').trim();
  school = school.replace(/^\d+\s*/, '');
  school = school.replace(/,\s+/g, ' ');
  school = school.replace(/^\s*Santo Tomas Lizeoa Ikastola\s*$/i, 'Santo Tomas Lizeoa');
  school = school.replace(/\\s+/g, ' ');
  school = school.replace(/-/g, ' ');

  // Normalizar acentos y quitar diacríticos
  school = school.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Quitar cualquier caracter no ASCII residual
  school = school.replace(/[^\x00-\x7F]/g, '');

  // Correcciones puntuales de texto (insensibles a mayúsculas)
  const fixes: Array<[RegExp, string]> = [
    [/\bScentia\b/gi, 'Scientia'],
    [/\bDonostias\b/gi, 'Donostia'],
    [/\bArantzatzu\b/gi, 'Arantzazu'],
    [/\bHarri Berri\b/gi, 'Harri Beri'],
  ];
  for (const [rx, replacement] of fixes) {
    school = school.replace(rx, replacement);
  }

  // Lista de palabras a eliminar (blacklist) - coincidencia insensible y con word boundary cuando aplica
  const blackList = [
    'Ikastola',
    'Eskola',
    'Ikastetxea',
    'Atotxa Egia',
    'Atotxako Danborrada',
    'Colegio',
    "Ikastetxea Saint Patrick'S School",
    'Compania',
    'San Sebastian',
    'De San Sebastian',
    'San Alberto Magno',
    'Infantil',
    'Haur',
    'Danborrada',
    'Tamborrada',
  ];

  // Aplicar blacklist para quitar palabras no deseadas
  for (const item of blackList) {
    const rx = new RegExp(`\\b${escapeRegExp(item)}\\b`, 'gi');
    school = school.replace(rx, '').trim();
  }

  // Excepciones específicas (busca la clave en lowercase dentro del nombre y reemplaza entero)
  const exceptions: Record<string, string> = {
    Ikasbide: 'Ikasbide Ikastola',
    Ibai: 'Ibai Ikastola',
    Ekintza: 'Ekintza Ikastola',
    Amassorrain: 'Amassorrain Ikastola',
    Zurriola: 'Zurriola Ikastola',
    Herrera: 'Herrera Ikastetxea',
    Jakintza: 'Jakintza Ikastola',
    Mendiola: 'Mendiola Ikastetxea',
    Aitor: 'Aitor Ikastola',
    'San Patricio': 'San Patricio',
    Arantzazuko: 'Arantzazuko ama Ikastola',
    'Herri Berri': 'Herri Beri Oleta',
    'Infantil 2025': 'Altza S.J.C Herri Ikastetxea',
    Salesianos: 'Salesianos Donostia',
    Intxaurrondo: 'Intxaurrondo Ikastola',
    Mundaiz: 'Sagrado Corazon Mundaiz',
    Eskibel: 'Erain-Eskibel Ikastetxea',
    Zuhaizti: 'Biteri Zuhaizti Publikoa',
    Jesuitas: 'Jesuitas San Ignacio',
    Aldapeta: 'Aldapeta María Ikastetxea',
    Jesuitinas: 'ElaiEnea Ikastetxea',
    'Intxaurrondo Katekes': 'Intxaurrondo KateKesia',
    Claret: 'Claret Ikastola',
    'San Ignacio De Loyola': 'Jesuitas San Ignacio',
    Altza: 'Altza Herri Ikastetxea',
    'Manuel De Larramendi': 'Larramendi',
  };

  // Agrupar otras compañías bajo "Otras Compañias"
  const otherCompanies = [
    'Mas De 4.000 Ninos Y Ninas Dan Lustre A La',
    'Inmejorable Preludio Para La',
    'La En Imagenes',
    'Imagenes',
    'Nos Gusta Mucho El Ambiente Y Que Nos Vengan A Ver',
    'Tamborradas Infantiles: Todas Las Companias Con Los Nombres De Los Participantes',
    'Lanceros De La Real Sociedad Hipica De',
    'Lanceros De La Real Sociedad Hipica',
    'Escuadron Txiki Real Sociedad Hipica',
    'Escuadron Lanceros Real Sociedad Hipica',
    'Caballitos De La Real Sociedad Hipica De',
    'Escuadra Txiki Real Sociedad Hipica',
    'Nuevas Companias De Adultos',
    'La En Imagenes',
    'Imagenes',
    'Listado Con Todos Los Nombres De Los Participantes Por Colegios',
    'De Los Participantes Por Colegios',
    'Listado Con Todos Los Nombres',
    ':',
    'Imagenes De La En Donostia',
    'De Principio A Fin La Del Dia De',
    'Una Para El Recuerdo',
    'Recuerdo',
    'Katalina De Erauso Txiki',
    'Katalina',
    'Kresala Txiki Cierra El Preludio',
    'Las Mejores Imagenes De La',
    'Revive De Principio A Fin La Del Dia De',
    'Los Peques De Gaztelubide Se Unen A La Fiesta',
  ];

  // Aplicar excepciones
  const lower = school.toLowerCase();
  for (const [k, v] of Object.entries(exceptions)) {
    if (lower.includes(k.toLowerCase())) {
      school = v;
      break;
    }
  }

  // Agrupar otras compañías bajo "Otras Compañias"
  for (const company of otherCompanies) {
    if (lower.includes(company.toLowerCase())) {
      school = 'Otras Compañias';
      break;
    }
  }

  // Casos especiales para "La Salle"
  if (/La Salle/i.test(school) && /San Luis/i.test(school)) {
    school = 'La Salle San Luis';
  } else if (/La Salle/i.test(school)) {
    school = 'La Salle Ikastetxea';
  }

  // Limpiar espacios duplicados finales
  school = school.replace(/\s{2,}/g, ' ').trim();

  // Title case simple
  const titleCase = (s: string) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return titleCase(school).trim();
}

// ✅ Validar si es un nombre válido de participante
export function isValidName(text: string): boolean {
  if (!text) return false;

  // Eliminar comas, puntos y caracteres raros antes de validar (pero mantener guiones)
  const cleaned = text.trim().replace(/[.,]/g, '');

  // Patrón más flexible:
  // - Permite letras acentuadas, ñ, guiones y apóstrofos
  // - Permite partículas "de la", "del", "de los", etc.
  // - Soporta nombres internacionales
  // - Hasta 6 palabras
  const pattern =
    /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ\-']*(?:\s(?:[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ\-']*|de|del|la|los|las|y|De|Del|De la|De los)){0,6}$/u;

  // Palabras que invalidan automáticamente el nombre (protección contra ruido del artículo)
  const blacklist = [
    'Tamborrada',
    'Newsletters',
    'Compania',
    'Compañia',
    'Compañía',
    'Abanderado',
    'Abanderada',
    'Cantinera',
    'Gastador',
    'Txaranga',
    'Cabo',
    'Director',
    'Mando',
    'Descuentos',
    'Ofertas',
    'Promociones',
    'Comprar',
    'Oferta',
    'Soldado',
    'Barriles',
    'Tambores',
    'Cabo Tambores',
    'Gastadores',
    'Tambor',
    'Cantineras',
    'Abanderada',
    'Abanderado',
    'Escolta',
    'Banda',
    'Grupo',
    'Fundacion',
    'Año',
    'Ano',
    'Norma',
    'Centro',
    'Niños',
    'Ninos',
    'Niñas',
    'Ninas',
    'Nuevo',
    'Colegio',
    'Colegi',
    'Schule',
    'Liceo',
    'Ikastola',
    'Ikasi',
    'Eskola',
    'Asociación',
    'Empresa',
    'Euskadi',
    'España',
    'Spain',
    'Basque',
    'Country',
    'Basket',
    'Futbol',
    'Football',
    'Soccer',
    'Donostia',
    'San Sebastian',
    'Sansebastian',
    'Gipuzkoa',
    'Guipuzcoana',
    'Tolosa Goierri',
    'Urola Costa',
    'Costa Urola',
    'Semana Grande',
    'Barril Mayor',
    'Language',
    'Languages',
    'Calle de la',
    'Aula de Cultura',
    'Cultura',
    'Aula',
    'Alto',
    'Deba',
    ' A ',
    'Arrasate',
    'Urola',
    'Kirolean',
    'Danbor',
    'Ayuntamiento',
  ];

  // No debe contener números
  if (/\d/.test(cleaned)) return false;

  // No debe tener más de 6 palabras (normalmente nombres tienen 2–5)
  if (cleaned.split(/\s+/).length > 6) return false;

  // No debe contener palabras de la blacklist
  const lowerText = cleaned.toLowerCase();
  if (blacklist.some((b) => lowerText.includes(b.toLowerCase()))) return false;

  // Debe coincidir con el patrón de nombre
  if (!pattern.test(cleaned)) return false;

  // Debe contener al menos un espacio (nombre y apellido)
  if (!cleaned.includes(' ')) return false;

  return true;
}

// Limpieza y normalización del nombre antes de guardarlo en BD
export const cleanNames = (name: string): string => {
  if (!name) return '';

  // Normalizar acentos, conservar guiones, quitar espacios duplicados
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/\s+/g, ' ') // colapsar espacios
    .trim();
};

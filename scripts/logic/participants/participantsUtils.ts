// Limpieza y normalización de nombres de escuelas
export function cleanSchoolName(input: string): string {
  if (!input) return '';

  let name = input.trim();

  const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Eliminaciones y normalizaciones iniciales (insensible a mayúsculas)
  name = name.replace(/\btamborrada\s*(infantil)?\s*(de)?\b/gi, '');
  name = name.replace(/\binfantil\s*tamborrada\b/gi, '');
  name = name.replace(/\b\d{4}\b/g, '');
  name = name.replace(/\s{2,}/g, ' ').trim();
  name = name.replace(/^\d+\s*/, '');
  name = name.replace(/,\s+/g, ' ');
  name = name.replace(/^\s*Santo Tomas Lizeoa Ikastola\s*$/i, 'Santo Tomas Lizeoa');
  name = name.replace(/\\s+/g, ' ');
  name = name.replace(/-/g, ' ');

  // Normalizar acentos y quitar diacríticos
  name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Quitar cualquier caracter no ASCII residual
  name = name.replace(/[^\x00-\x7F]/g, '');

  // Correcciones puntuales de texto (insensibles a mayúsculas)
  const fixes: Array<[RegExp, string]> = [
    [/\bScentia\b/gi, 'Scientia'],
    [/\bDonostias\b/gi, 'Donostia'],
    [/\bArantzatzu\b/gi, 'Arantzazu'],
    [/\bHarri Berri\b/gi, 'Harri Beri'],
  ];
  for (const [rx, replacement] of fixes) {
    name = name.replace(rx, replacement);
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
    name = name.replace(rx, '').trim();
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
    Jesuitas: 'San Ignacio de Loyola Jesuitas',
    Aldapeta: 'Aldapeta María Ikastetxea',
    Jesuitinas: 'ElaiEnea Ikastetxea',
    'Intxaurrondo Katekes': 'Intxaurrondo KateKesia',
    Claret: 'Claret Ikastola',
    'San Ignacio De Loyola': 'San Ignacio De Loyola Jesuitas',
    Altza: 'Altza Herri Ikastetxea',
    'Manuel De Larramendi': 'Larramendi',
  };

  // Agrupar otras compañías bajo "Otras Compañias"
  const otherCompanies = [
    'Mas De 4.000 Ninos Y Ninas Dan Lustre A La',
    'Inmejorable Preludio Para La',
    'La En Imagenes',
    'Nos Gusta Mucho El Ambiente Y Que Nos Vengan A Ver',
    'Tamborradas Infantiles: Todas Las Companias Con Los Nombres De Los Participantes',
    'Lanceros De La Real Sociedad Hipica De',
    'Lanceros De La Real Sociedad Hipica',
    'Escuadron Txiki Real Sociedad Hipica',
    'Escuadron Lanceros Real Sociedad Hipica',
    'Caballitos De La Real Sociedad Hipica De',
    'Nuevas Companias De Adultos',
  ];

  // Aplicar excepciones
  const lower = name.toLowerCase();
  for (const [k, v] of Object.entries(exceptions)) {
    if (lower.includes(k.toLowerCase())) {
      name = v;
      break;
    }
  }

  // Agrupar otras compañías bajo "Otras Compañias"
  for (const company of otherCompanies) {
    if (lower.includes(company.toLowerCase())) {
      name = 'Otras Compañias';
      break;
    }
  }

  // Casos especiales para "La Salle"
  if (/La Salle/i.test(name) && /San Luis/i.test(name)) {
    name = 'La Salle San Luis';
  } else if (/La Salle/i.test(name)) {
    name = 'La Salle Ikastetxea';
  }

  // Limpiar espacios duplicados finales
  name = name.replace(/\s{2,}/g, ' ').trim();

  // Title case simple
  const titleCase = (s: string) =>
    s
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  return titleCase(name).trim();
}

// Validar si es un nombre válido de participante
export function isValidName(text: string): boolean {
  if (!text) return false;

  // Eliminar comas, puntos y caracteres raros antes de validar
  const cleaned = text.trim().replace(/,/g, '').replace(/\./g, '');

  // Patrón de nombres (admite nombres con mayúscula inicial, artículos, preposiciones, iniciales)
  const pattern =
    /^[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+(?:\s(?:[A-ZÁÉÍÓÚÜÑ][a-záéíóúüñ]+|de|del|la|los|las|y|M\.|D\.|De|Del|De La|De Los)){0,4}$/u;

  // Palabras que invalidan automáticamente el nombre
  const blacklist = [
    'Tamborrada',
    'Newsletters',
    'Compañía',
    'Abanderado',
    'Abanderada',
    'Cantinera',
    'Gastador',
    'Txaranga',
    'Cabo',
    'Director',
    'Mando',
    'Soldado',
    'Barriles',
    'Tambores',
    'Tambor',
    'Escolta',
    'Banda',
    'Grupo',
    'Fundación',
    'Año',
    'Centro',
    'Niños',
    'Niñas',
    'Dan',
    'Colegio',
    'Colegi',
    'Schule',
    'Liceo',
    'Ikastola',
    'Ikas',
    'Eskola',
    'Asociación',
    'Mas',
    'Lustre',
    'Alberto',
    'Libros',
    'Inmejorable',
    'Preludio',
    'Remo',
    'Ciclismo',
    'Bidasoa',
    'Jazzaldia',
    'Tolosa Goierri',
    'Gipuzkoa',
    'Guipuzcoana',
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
    'Nuevos',
    'Descuentos',
    'Ofertas',
    'Idiomas',
    'Languages',
    'Calle de la Memoria',
    'Semana Grande',
    'Language',
    'Donostia',
    'Kirolean Errespetuz',
    'San Sebastian',
    'Sansebastian',
    'Empresa Guipuzcoana',
    'Barril Mayor',
    'Diego Mansoa Tolosa',
    'Alto',
    'Bajo Deba',
    'Salida',
    'Kirolean',
    'Errespetuz',
    'Herri Ametsa',
    'Berkshagai',
    'nPlaza',
    'Costa Urola',
    'Urola Costa',
  ];

  // No debe contener números
  if (/\d/.test(cleaned)) {
    return false;
  }

  // No debe tener más de 5 palabras (normalmente nombres tienen 2-4)
  if (cleaned.split(/\s+/).length > 5) {
    return false;
  }

  // No debe contener palabras de la blacklist (insensible a mayúsculas)
  const lowerText = cleaned.toLowerCase();
  if (blacklist.some((b) => lowerText.includes(b.toLowerCase()))) {
    return false;
  }

  // Debe coincidir con el patrón de nombre
  if (!pattern.test(cleaned)) {
    return false;
  }

  // Debe contener al menos un espacio (nombre y apellido)
  if (!cleaned.includes(' ')) {
    return false;
  }

  return true;
}

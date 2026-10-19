[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

👉 **La web está desplegada en:** [https://tamborradata.com](https://tamborradata.com)

# 🥁 Tamborradata

Una plataforma web que visualiza y analiza la evolución histórica de la Tamborrada Infantil de San Sebastián a través de datos.

Dirigida a ciudadanía, medios, investigadores y curiosos que quieran explorar tendencias, colegios, nombres y participación a lo largo de todas las ediciones registradas.

_Primera fuente pública y estructurada dedicada exclusivamente a preservar y mostrar la historia digital de este evento cultural._

_Proyecto de ingeniería desarrollado por **RamistoDev**._

---

## 📋 Índice

- [🧩 Introducción](#-introducción)
- [🎯 Objetivo del Proyecto](#-objetivo-del-proyecto)
- [🔷 Arquitectura General](#-arquitectura-general)
- [📁 Estructura del Repositorio](#-estructura-del-repositorio)
- [🔌 Endpoints de la API](#-endpoints-de-la-api)
- [🔧 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [🌍 Internacionalización](#-internacionalización)
- [🚀 Puesta en Marcha](#-puesta-en-marcha)
- [📚 Documentación Extendida](#-documentación-extendida)
- [📄 Licencia](#-licencia)
- [👨‍💻 Autor](#-autor)

---

## 🧩 Introducción

Este repositorio contiene la **aplicación web completa (Frontend + Backend)** de Tamborradata, una plataforma orientada a producción para visualizar y explorar estadísticas históricas de la Tamborrada Infantil de San Sebastián.

**Funcionalidades principales:**

- Consulta de estadísticas por año
- Visualizaciones interactivas
- Búsqueda de participantes
- Actualización automática anual

> [!NOTE]
> Este repositorio solo contiene la parte web del proyecto.
> La generación y actualización anual de los datos se realiza desde un **repositorio privado** que ejecuta un pipeline automatizado cada mes de enero.
> Dicho repositorio permanece privado porque procesa **información sensible de menores**.

---

## 🎯 Objetivo del Proyecto

Ofrecer una **plataforma web educativa y cultural** que preserve, analice y muestre la evolución histórica de la Tamborrada Infantil de San Sebastián a través de los datos.

**Objetivos clave:**

- 📚 Conservar información histórica accesible
- 📊 Entender la Tamborrada basada en datos
- 🔍 Aportar valor para ciudadanía, investigadores y medios
- 📰 Proveer datos originales para periodismo

---

## 🔷 Arquitectura General

**Stack:** Next.js 16 (App Router) + React 19 + Supabase (PostgreSQL)

**Patrón del backend:** Route → DTO (validación) → Service → Repository → Base de datos

El frontend (Server Components + SSR) y el backend (Route Handlers) conviven en el mismo proyecto Next.js, separados por _route groups_: `app/(frontend)` y `app/(backend)`. Los tipos compartidos entre ambos viven en `app/types`.

📘 **Detalles completos:** [docs/design-decisions.md](docs/design-decisions.md)

---

## 📁 Estructura del Repositorio

```
tamborradata/
├── app/
│   ├── (frontend)/
│   │   ├── [locale]/
│   │   │   ├── (landing)/   # Landing: hero y secciones
│   │   │   ├── (pages)/     # Estadísticas, búsqueda de participantes y política de privacidad
│   │   │   ├── components/  # Header, Footer, iconos y componentes de UI compartidos
│   │   │   ├── config/      # Constantes, fechas de contenido, fuentes y datos estructurados
│   │   │   ├── hooks/       # Hooks de cliente (React Query)
│   │   │   ├── lib/         # Utilidades, formato, claves de consulta y manejo de errores
│   │   │   ├── providers/   # Proveedor de React Query
│   │   │   └── services/    # Obtención de datos en servidor y en cliente
│   │   └── i18n/            # Routing, SEO y traducciones (es, en, eu)
│   ├── (backend)/
│   │   ├── api/             # Route Handlers (route, dtos, services, repo, types)
│   │   ├── core/            # Configuración de entorno, cliente Supabase y logger
│   │   └── lib/             # Errores, respuestas, caché y límite de peticiones
│   └── types/               # Tipos compartidos entre frontend y backend
├── docs/                    # Documentación extendida
├── public/                  # Recursos estáticos
└── proxy.ts                 # i18n en páginas y protección de /api
```

### **Páginas**

| Ruta                   | Contenido                           |
| ---------------------- | ----------------------------------- |
| `/`                    | Landing                             |
| `/statistics`          | Redirige al periodo global          |
| `/statistics/[period]` | Estadísticas de un año o del global |
| `/search-participants` | Búsqueda de participantes           |
| `/privacy-policy`      | Política de privacidad              |

### **Secciones de la landing**

Hero y, en este orden: estadísticas, búsqueda de participantes, menciones en prensa, código abierto, apoyo al proyecto (botón de Buy Me a Coffee), contacto y preguntas frecuentes.

---

## 🔌 Endpoints de la API

La aplicación expone endpoints REST internos bajo `/api`. Resumen:

| Endpoint                                             | Descripción                                      |
| ---------------------------------------------------- | ------------------------------------------------ |
| `GET /api/overview?scope=global\|last\|both`         | Cifras clave del periodo global y del último año |
| `GET /api/period`                                    | Periodos listos para consultar                   |
| `GET /api/statistics?publicSlug=...&locale=...`      | Estadísticas de un periodo (vista previa)        |
| `GET /api/statistics/[period]/summaries?locale=...`  | Resúmenes editoriales de un periodo              |
| `GET /api/statistics/[period]/categories/[category]` | Detalle paginado de una categoría                |
| `GET /api/schools?query=...`                         | Listado de colegios                              |
| `POST /api/participants`                             | Búsqueda de un participante (cuerpo JSON)        |
| `GET /api/ping`                                      | Comprobación de que la API responde              |

📘 **Parámetros, respuestas, caché y errores:** [docs/api.md](docs/api.md)

---

## 🔧 Tecnologías Utilizadas

| Área       | Tecnología                                                             |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router), React 19, TypeScript 6                        |
| Estilos    | Tailwind CSS 4                                                         |
| Datos      | TanStack React Query 5, Supabase (`@supabase/supabase-js`, PostgreSQL) |
| i18n       | next-intl 4                                                            |
| Animación  | GSAP                                                                   |
| Contenido  | react-markdown + rehype-sanitize                                       |
| Analítica  | Vercel Analytics y Speed Insights                                      |
| Calidad    | ESLint 9, Prettier 3                                                   |
| Gestor     | pnpm                                                                   |
| Despliegue | Vercel                                                                 |

---

## 🌍 Internacionalización

La web está disponible en **español (`es`, idioma por defecto), inglés (`en`) y euskera (`eu`)**, con `next-intl`.

- El prefijo del idioma es opcional para el idioma por defecto (`localePrefix: 'as-needed'`): `/statistics` es español y `/en/statistics` es inglés.
- No hay detección automática del idioma del navegador.
- Las traducciones están en `app/(frontend)/i18n/translations/{es,en,eu}`.
- La API recibe el idioma mediante el parámetro `locale` cuando devuelve contenido editorial.

📘 **Detalles:** [docs/i18n.md](docs/i18n.md)

---

## 🚀 Puesta en Marcha

### **Requisitos previos**

- Node.js 20.9 o superior (requisito de Next.js 16)
- pnpm
- Un proyecto de Supabase con el esquema y los datos publicados de Tamborradata

### **Instalación**

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar las variables de entorno
# Copia .env.example a .env.local y completa los valores

# 3. Iniciar el servidor de desarrollo
pnpm dev
# La app estará en http://localhost:3000
```

### **Variables de entorno**

Las lee `app/(backend)/core/config/env.ts`:

| Variable               | Uso                                                                |
| ---------------------- | ------------------------------------------------------------------ |
| `SUPABASE_URL`         | URL del proyecto de Supabase                                       |
| `SUPABASE_ANON_KEY`    | Clave anónima de Supabase                                          |
| `NEXT_PUBLIC_BASE_URL` | URL pública del sitio                                              |
| `SIGNATURE_SECRET`     | Clave con la que se cifran los cursores de paginación              |
| `HASH_SECRET`          | Clave del hash con el que el limitador de peticiones enmascara IPs |

### **Comandos disponibles**

```bash
pnpm dev        # Desarrollo
pnpm build      # Build de producción
pnpm start      # Servidor de producción
pnpm types      # Comprobación de tipos (tsc --noEmit)
pnpm lint       # Linter (ESLint)
```

---

## 📚 Documentación Extendida

Para información detallada sobre arquitectura, decisiones técnicas y funcionamiento interno:

- 🔌 **[API](docs/api.md)** → Referencia de endpoints, parámetros, respuestas y errores
- 📘 **[Obtención de datos](docs/data-fetching.md)** → Caché, SSR y gestión de estado en el cliente
- 🌍 **[Internacionalización](docs/i18n.md)** → Idiomas, rutas y traducciones
- 📗 **[SEO Técnico](docs/seo.md)** → Metadatos, datos estructurados, sitemap y robots
- 📙 **[Publicación de datos](docs/publishing.md)** → Cómo llegan los datos nuevos cada año
- 📕 **[Decisiones de Diseño](docs/design-decisions.md)** → Arquitectura y patrones

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)**.

Consulta el archivo [NOTICE](NOTICE) para más detalles sobre términos y atribuciones.

---

## 👨‍💻 Autor

**RamistoDev**

- GitHub → [https://github.com/ramistodev](https://github.com/ramistodev)
- Producción → [https://tamborradata.com](https://tamborradata.com)

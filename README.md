[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

👉 **La web está desplegada en:** [https://tamborradata.com](https://tamborradata.com)

# 🥁 Tamborradata

Una plataforma web que visualiza y analiza la evolución histórica de la Tamborrada Infantil de San Sebastián a través de datos.

Dirigida a ciudadanía, medios, investigadores y curiosos que quieran explorar tendencias, colegios, nombres y participación desde 2018.

_Primera fuente pública y estructurada dedicada exclusivamente a preservar y mostrar la historia digital de este evento cultural._

_Proyecto de ingeniería full-stack desarrollado por **RamistoDev**._

---

## 📋 Índice

- [🧩 Introducción](#-introducción)
- [🎯 Objetivo del Proyecto](#-objetivo-del-proyecto)
- [🔷 Arquitectura General](#-arquitectura-general)
- [📁 Estructura del Repositorio](#-estructura-del-repositorio)
- [🔌 Endpoints de la API](#-endpoints-de-la-api)
- [🔧 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📦 Mock Data](#-mock-data)
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

**Stack:** Next.js 16 (App Router) + React Query + Supabase PostgreSQL

**Patrón:** Route → Service → Repository → Database

Arquitectura en capas con separación de responsabilidades entre Frontend (Server Components + SSR), Backend (API Routes) y Base de Datos (PostgreSQL con RLS).

📘 **Detalles completos:** [docs/design-decisions.md](docs/design-decisions.md)

---

## 📁 Estructura del Repositorio

```
tamborradata/
├── app/(frontend)/          # Next.js + React Query
├── app/(backend)/           # API Routes + Services
├── mocked_data/             # Datos sintéticos
└── docs/                    # Documentación extendida
```

---

## 🔌 Endpoints de la API

La aplicación expone 5 endpoints REST internos:

| Endpoint                                     | Descripción                       |
| -------------------------------------------- | --------------------------------- |
| `GET /api/years`                             | Lista de años disponibles         |
| `GET /api/statistics?year=YYYY`              | Estadísticas completas de un año  |
| `GET /api/category?year=YYYY&category=...`   | Datos ampliados de una categoría  |
| `GET /api/companies`                         | Colegios participantes históricos |
| `GET /api/participants?name=...&company=...` | Búsqueda de participantes         |

---

## 🔧 Tecnologías Utilizadas

- **Frontend:** Next.js 16, React 19, TypeScript, TailwindCSS 4
- **Estado:** React Query 5
- **Backend:** Supabase (PostgreSQL + RLS), API Routes
- **Visualización:** Nivo, Framer Motion 12
- **Deploy:** Vercel

---

## 📦 Mock Data

El repositorio incluye **datos sintéticos** en `mocked_data/` para desarrollo local:

- `tamborradata_schema.sql` → Esquema de base de datos
- `statistics.csv` → Estadísticas de ejemplo
- `participants.csv` → 100 participantes ficticios

> [!IMPORTANT]
> Todos los nombres son **ficticios y generados aleatoriamente**.

📄 **Documentación detallada:** [docs/mock-data.md](docs/mock-data.md)

---

## 🚀 Puesta en Marcha

### **Requisitos previos**

- Node.js 18+
- pnpm
- Credenciales de Supabase

### **Instalación**

```bash
# 1. Instalar dependencias
pnpm install

# 2. Configurar variables de entorno
# Crea .env.local con:
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key

# 3. Importar datos mock a Supabase
# - Ejecuta tamborradata_schema.sql en Supabase
# - Importa statistics.csv y participants.csv desde Table Editor

# 4. Iniciar el servidor de desarrollo
pnpm dev
# La app estará en http://localhost:3000
```

### **Comandos disponibles**

```bash
pnpm dev        # Desarrollo
pnpm build      # Build de producción
pnpm start      # Servidor de producción
pnpm test       # Ejecutar tests
```

---

## 📚 Documentación Extendida

Para información detallada sobre arquitectura, decisiones técnicas y funcionamiento interno:

- 📘 **[React Query](docs/react-query.md)** → Caching, SSR, polling y gestión de estado
- 📗 **[SEO Técnico](docs/seo.md)** → Optimización para buscadores y AI Overviews
- 📙 **[Sistema isUpdating](docs/isUpdating.md)** → Actualización anual automática
- 📕 **[Decisiones de Diseño](docs/design-decisions.md)** → Arquitectura y patrones
- 📓 **[Mock Data](docs/mock-data.md)** → Estructura de datos sintéticos

---

## 📄 Licencia

Este proyecto está disponible bajo la licencia **[Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)](https://creativecommons.org/licenses/by-sa/4.0/)**.

Consulta el archivo [NOTICE](NOTICE) para más detalles sobre términos y atribuciones.

---

## 👨‍💻 Autor

**RamistoDev**

- GitHub → [https://github.com/ramistodev](https://github.com/ramistodev)
- Producción → [https://tamborradata.com](https://tamborradata.com)

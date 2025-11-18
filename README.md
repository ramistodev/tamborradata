[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC%20BY--SA%204.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)

👉 La web está desplegada en:
[https://tamborradata.com](https://tamborradata.com)

# 🥁 Tamborradata

Una plataforma web que visualiza y analiza la evolución histórica de la Tamborrada Infantil de San Sebastián a través de datos.

Dirigida a ciudadanía, medios, investigadores y curiosos que quieran explorar tendencias, colegios, nombres y participación desde 2018.

Primera fuente pública y estructurada dedicada exclusivamente a preservar y mostrar la historia digital de este evento cultural.

_Proyecto de ingeniería full-stack desarrollado por **RamistoDev**._

---

## 📋 Índice

- [📖 Introducción](#-introducción)
- [🎯 Objetivo del Proyecto](#-objetivo-del-proyecto)
- [🏗️ Arquitectura General](#-arquitectura-general)
- [📁 Estructura del Repositorio](#-estructura-del-repositorio)
- [🔌 Endpoints de la API](#-endpoints-de-la-api)
- [🔧 Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [📦 Mock Data y Scripts SQL](#-mock-data-y-scripts-sql)
- [🚀 Puesta en Marcha del Proyecto](#-puesta-en-marcha-del-proyecto)
- [🧪 Testing y Calidad del Código](#-testing-y-calidad-del-código)
- [👨‍💻 Autor](#-autor)

---

## 🧩 Introducción

Este repositorio pertenece al codigo web de la **Tamborradata**, que es una plataforma web completamente funcional y orientada a producción, diseñada para **visualizar y explorar estadísticas históricas de la Tamborrada Infantil de San Sebastián** a lo largo de los años.

Este repositorio contiene **la aplicación web completa (Frontend + Backend)** encargada de:

- Ofrecer una interfaz clara y accesible para consultar la información de cada año.
- Presentar estadísticas y visualizaciones sobre la evolución de la Tamborrada Infantil.
- Comparar tendencias, colegios, nombres y participación histórica.
- Mostrar información global y desglosada por años concretos.
- Mantener la plataforma actualizada cada año con los nuevos datos disponibles.

> [!NOTA]
> Este repositorio solo contiene la parte web del proyecto.
> La generación y actualización anual de los datos se realiza desde un **repositorio separado y privado**, que ejecuta un pipeline automatizado cada mes de enero.
> Dicho repositorio permanece privado porque su código se encarga de **extraer, procesar y estudiar información sensible de menores**. Por motivos de seguridad, privacidad y cumplimiento legal, ese pipeline no puede hacerse público.

---

## 🎯 Objetivo del Proyecto

El propósito principal de Tamborradata es ofrecer una **plataforma web educativa y cultural** que preserve, analice y muestre la evolución histórica de la **Tamborrada Infantil de San Sebastián** a través de los datos.

Este proyecto busca:

- **Conservar información histórica** que crece año tras año, creando un archivo digital accesible y perdurable.
- **Ofrecer una nueva forma de entender la Tamborrada**, mostrando su magnitud, sus cambios y sus tendencias desde una perspectiva basada en datos.
- **Aportar contexto y valor** a cada edición, permitiendo explorar cómo participan los colegios, cómo evolucionan los nombres, la demografía y otros patrones relevantes.
- **Servir como fuente fiable y rica en información** para cualquier persona interesada en profundizar en la Tamborrada Infantil: ciudadanía, curiosos, investigadores, estudiantes, etc.
- **Proveer datos originales y actualizados cada año**, útiles también para **periodistas y medios de comunicación** que cubren este evento y necesitan contexto, comparativas y cifras inéditas.

En definitiva, Tamborradata nace para **ampliar el conocimiento disponible en internet** sobre un día muy especial en Donostia.

---

## 🏗️ Arquitectura General

```
📦 Tamborradata Web
├── Frontend (Next.js 14)
│   ├── App Router
│   ├── Client Components
│   ├── Context Providers (Global / Year)
│   ├── Rendering optimizado por página
│   └── UI responsiva + Dark/Light Theme
│
├── Backend (Next.js API Route Handlers)
│   ├── /api/available-years
│   ├── /api/statistics
│   ├── /api/category
│   └── /api/sys-status
│
└── Supabase (PostgreSQL)
    ├── Tablas normalizadas
    ├── Acceso read-only con anon-key
    └── Seeds SQL incluidos en este repo
```

---

## 📁 Estructura del Repositorio

```
📦 Tamborradata Web
│
├── 🎨 Frontend (Next.js 14 App Router)
│   ├── / → Página principal
│   │   ├── components/
│   │   │   ├── Intro → Presentación del proyecto
│   │   │   ├── ExploreStatistics → Selector de años disponibles
│   │   │   └── FAQs → Preguntas frecuentes
│   │   ├── icons/ → Iconos SVG personalizados
│   │   └── loaders/ → Skeletons de carga
│   │
│   └── /statistics → Módulo de estadísticas
│       ├── /global → Estadísticas globales (todos los años)
│       │   ├── components/
│       │   │   ├── TopNames → Nombres más comunes históricos
│       │   │   ├── TopSurnames → Apellidos más comunes históricos
│       │   │   ├── TopSchools → Colegios con más participación
│       │   │   ├── SchoolsEvolution → Evolución de colegios por año
│       │   │   ├── TotalParticipants → Total de participantes históricos
│       │   │   ├── LongestNames → Nombres más largos
│       │   │   ├── CommonNameBySchool → Nombre más común por colegio
│       │   │   ├── MostConstantsSchools → Colegios más constantes
│       │   │   └── NameSurnameDiversity → Diversidad de nombres/apellidos
│       │   ├── context/ → GlobalProvider para estado compartido
│       │   └── hooks/ → Lógica de negocio y fetching
│       │
│       ├── /[year] → Estadísticas por año específico (ej: /2024)
│       │   ├── components/
│       │   │   ├── TopNames → Nombres más comunes del año
│       │   │   ├── TopSurnames → Apellidos más comunes del año
│       │   │   ├── TopSchools → Colegios más participativos del año
│       │   │   ├── TotalParticipants → Total de participantes del año
│       │   │   ├── NewNames → Nombres que aparecen por primera vez
│       │   │   ├── NewSchools → Colegios que debutan ese año
│       │   │   ├── CommonNamesBySchool → Nombres comunes por colegio
│       │   │   └── NameSurnameDiversity → Diversidad del año
│       │   ├── context/ → YearProvider para estado del año
│       │   └── hooks/ → Lógica específica del año
│       │
│       ├── /info → Página de información sobre el proyecto
│       │
│       ├── components/
│       │   ├── Header/ → Navegación y selector de años
│       │   └── UpdatingPage/ → Pantalla de actualización
│       │
│       └── logic/ → Funciones compartidas de fetching
│
└── 🔧 Backend (Next.js API Routes)
    ├── api/
    │   ├── /available-years → GET años disponibles
    │   ├── /statistics?year=YYYY → GET estadísticas completas del año
    │   ├── /category?year=YYYY&category=... → GET datos extendidos
    │   ├── /sys-status → GET estado del sistema
    │   └── /ping → Health check
    │
    ├── db/
    │   └── supabasePublic.ts → Cliente de Supabase (solo lectura)
    │
    ├── logic/
    │   ├── statistics/ → Lógica de agregación de datos
    │   ├── sysStatus/ → Estado de sincronización
    │   ├── years/ → Gestión de años disponibles
    │   └── helpers/ → Utilidades (groupBy, logging)
    │
    └── utils/
        └── constants.ts → Constantes del sistema

```

---

## 🔌 Endpoints de la API

La aplicación incluye varios endpoints internos que actúan como capa de acceso entre el frontend y la base de datos. Todos aplican validaciones estrictas, manejo coherente de errores y respuestas JSON limpias.

### **`GET /api/available-years`**

Devuelve la lista de años que tienen estadísticas generadas y disponibles para su visualización.
El frontend lo utiliza para construir menús, navegación dinámica y control de rutas.

---

### **`GET /api/statistics?year=YYYY`**

Proporciona las estadísticas completas asociadas a un año concreto.
Es el endpoint principal para cargar la información que aparece en `/statistics/[year]`.

---

### **`GET /api/category?year=YYYY&category=...`**

Ofrece datos ampliados de una categoría específica dentro de un año (por ejemplo: nombres, colegios, distribución, rankings, etc.).
Se usa para cargar tablas y gráficos más pesados sin tener que solicitar el dataset global.

---

### **`GET /api/sys-status`**

Indica el estado actual del sistema y si el pipeline anual está realizando una actualización.
Permite al frontend mostrar pantallas de sincronización y evitar lecturas inconsistentes mientras se procesan nuevos datos.

---

## 🔧 Tecnologías Utilizadas

Este proyecto está construido con tecnologías modernas que garantizan rendimiento, escalabilidad y una experiencia de desarrollo óptima.

### **Stack Principal**

- **[Next.js 14](https://nextjs.org/)** (App Router) → Framework full-stack con Server Components y renderizado híbrido
- **[React 18](https://react.dev/)** → Librería UI con Suspense y streaming SSR
- **[TypeScript](https://www.typescriptlang.org/)** → Tipado estático para mayor robustez
- **[TailwindCSS](https://tailwindcss.com/)** → Framework CSS utility-first para diseño responsive

### **Backend & Base de Datos**

- **[Supabase](https://supabase.com/)** (PostgreSQL + RLS) → Base de datos con políticas de seguridad a nivel de fila
- **API Routes** (Next.js) → Endpoints REST internos con validación y manejo de errores

### **Visualización & UX**

- **[Nivo](https://nivo.rocks/)** → Librería de gráficos interactivos basada en D3.js
- **[Framer Motion](https://www.framer.com/motion/)** → Animaciones fluidas y transiciones

### **Testing & Calidad**

- **[Playwright](https://playwright.dev/)** → Tests end-to-end con soporte multi-navegador
- **[Vitest](https://vitest.dev/)** → Testing unitario e integración ultrarrápido

### **Deployment**

- **[Vercel](https://vercel.com/)** → Plataforma de deploy con CI/CD integrado y edge functions

---

## 📦 Mock Data y Scripts SQL

Este repositorio incluye **datos sintéticos generados específicamente** para facilitar la reproducción y el testing del proyecto sin necesidad de acceder al pipeline privado de datos reales.

### **Contenido de `mocked_data/`**

En la raíz del proyecto encontrarás la carpeta `mocked_data/`, que contiene dos archivos esenciales:

```
mocked_data/
 ├── tamborradata_schema.sql   # Script de creación de tablas y datos iniciales
 └── statistics.csv             # Dataset sintético de estadísticas
```

---

### **📄 `tamborradata_schema.sql`**

Este archivo SQL contiene:

- **Definición completa de las tablas** (`statistics`, `available_years`, `sys_status`)
- **Configuraciones de seguridad** (Row Level Security - RLS) para cada tabla
- **Políticas de acceso** que permiten lectura pública mediante la clave `anon`
- **Datos iniciales** precargados en las tablas `available_years` (años 2024, 2025 y global) y `sys_status` (sistema listo)

**Uso:**

Ejecuta este script en tu instancia de Supabase para crear la estructura completa de la base de datos:

```bash
psql <SUPABASE_DB_URL> -f mocked_data/tamborradata_schema.sql
```

O desde el **SQL Editor** de Supabase: copia y pega el contenido del archivo y ejecútalo.

---

### **📊 `statistics.csv`**

Contiene un dataset sintético con **estadísticas de ejemplo** de los años 2024 y 2025, incluyendo:

- Top nombres, apellidos y colegios por año
- Nombres y colegios nuevos
- Diversidad de nombres
- Evolución de colegios
- Estadísticas globales
- Y mucho más...

Este CSV simula el comportamiento real de la aplicación con datos coherentes y variados.

**Uso:**

1. Accede a tu proyecto de Supabase
2. Ve a **Table Editor** → Tabla `statistics`
3. Haz clic en **Import data via spreadsheet**
4. Selecciona el archivo `statistics.csv`
5. Confirma la importación

Una vez importado, la aplicación web podrá consultar y renderizar las estadísticas como si fueran datos reales.

---

### **¿Para qué sirve esto?**

Estos archivos permiten:

- ✅ Probar la aplicación en local sin acceso a datos sensibles
- ✅ Validar el funcionamiento de todos los endpoints de la API
- ✅ Ejecutar tests E2E con datos coherentes
- ✅ Reproducir el proyecto de forma independiente y autónoma
- ✅ Configurar entornos de desarrollo sin depender del pipeline privado

---

## 🚀 Puesta en Marcha del Proyecto

Sigue estos pasos para levantar el entorno de desarrollo local.

### **1. Instalar dependencias**

```bash
pnpm install
```

---

### **2. Crear el archivo `.env.local`**

El proyecto requiere conexión a una instancia de Supabase para funcionar.

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=your_anon_key
```

---

### **3. Iniciar el servidor**

#### **Modo Development**

Para levantar el servidor en modo desarrollo con hot-reload y debugging habilitado:

```bash
pnpm dev
```

La aplicación estará disponible en:
[http://localhost:3000](http://localhost:3000)

---

#### **Simular Modo Production**

Para simular el comportamiento de la aplicación en producción (optimizaciones, builds, etc.):

```bash
pnpm build
pnpm start
```

Esto te permite verificar cómo se comporta la web en modo producción, incluyendo optimizaciones de Next.js, renderizado de Server Components y configuraciones específicas de producción.

> [!TIP]
> La web cambia su comportamiento según el modo (development/production). Es recomendable probar ambos modos para detectar diferencias en el funcionamiento.

---

### **4. Ejecutar tests**

El proyecto incluye tests unitarios e integración/E2E con Playwright.

Antes de ejecutar los tests E2E, instala los navegadores:

> [!NOTE]
> Este paso es opcional; solo es necesario si deseas ejecutar los tests E2E.

```bash
pnpm exec playwright install
```

Comandos de testing:

```bash
pnpm test      # Tests unitarios / integración
pnpm test:e2e  # Tests E2E con Playwright
```

---

## 🧪 Testing y Calidad del Código

La plataforma mantiene un sistema de testing completo que cubre todas las capas críticas del proyecto, garantizando estabilidad, regresiones controladas y calidad en producción.

### **Tipos de tests incluidos**

- **Pruebas unitarias (Vitest)**
  Validan la lógica interna, control de errores, validación de parámetros y funciones puras.

- **Pruebas de integración**
  Ejecutan handlers y servicios simulando respuestas de Supabase, asegurando el correcto funcionamiento de los flujos principales.

- **Pruebas de frontend**
  Comprueban el renderizado de componentes, interacciones, estados de carga, navegación interna y comportamiento de cachés locales.

- **Pruebas end-to-end (Playwright)**
  Simulan la experiencia real de un usuario recorriendo toda la aplicación
  (p. ej.: _Home → Global → Año → Info → Home_), incluyendo pruebas responsive en móvil y escritorio.

---

### **Cobertura de código**

```
Statements:  ~77%
Branches:    ~80%
Functions:   ~70%
Lines:       ~77%
```

Este nivel es más que suficiente para una plataforma de visualización de datos con rutas dinámicas, sincronización externa y renderizado híbrido.

---

## 👨‍💻 Autor

**RamistoDev**

GitHub → [https://github.com/ramistodev](https://github.com/ramistodev)
Producción → [https://tamborradata.com](https://tamborradata.com)

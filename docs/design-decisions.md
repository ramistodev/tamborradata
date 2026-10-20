# Decisiones de Diseño - Arquitectura y Patrones

Esta documentación explica las **decisiones arquitectónicas y de diseño** tomadas durante el desarrollo de Tamborradata, incluyendo la justificación de cada elección.

---

## 📋 Índice

- [Arquitectura General](#arquitectura-general)
- [Separación Pipeline / Web](#separación-pipeline--web)
- [Backend: Patrón Repository](#backend-patrón-repository)
- [Errores de Dominio](#errores-de-dominio)
- [Tipos Compartidos](#tipos-compartidos)
- [Frontend: Server Components](#frontend-server-components)
- [Base de Datos: Row Level Security](#base-de-datos-row-level-security)
- [Modularización por Features](#modularización-por-features)
- [DTOs y Validación](#dtos-y-validación)
- [Gestión de Estado](#gestión-de-estado)
- [Cache](#cache)
- [Decisiones de Stack](#decisiones-de-stack)
- [Principios de Diseño](#principios-de-diseño)
- [Referencias](#referencias)

---

## Arquitectura General

Tamborradata sigue una **arquitectura en capas** con separación de responsabilidades. El backend vive en `app/(backend)` y el frontend en `app/(frontend)`, dentro del mismo proyecto Next.js.

### **Diagrama de Capas**

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│        (Frontend - app/(frontend)/[locale])             │
│                                                         │
│  • (landing)/ y (pages)/ → páginas y componentes        │
│  • services/ → lectura de datos en servidor (cacheada)  │
│    y fetch HTTP desde el cliente                        │
│  • hooks/query/ → React Query (paginación y búsqueda)   │
│  • providers/ → ReactQueryProvider                      │
└─────────────────────────────────────────────────────────┘
          ↓ llamada directa (servidor)     ↓ HTTP (cliente)
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│            (app/(backend)/api/*/route.ts)               │
│                                                         │
│  • route.ts → handler HTTP (GET/POST)                   │
│  • dtos/ → validación de parámetros                     │
│  • lib/response.ts → res.* y handleError()              │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LAYER                         │
│                                                         │
│  • api/*/service(s)/ → lógica de negocio                │
│  • api/*/lib/ → utilidades de la feature                │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│                                                         │
│  • api/*/repo/ → queries a Supabase                     │
│  • core/db/supabaseClient.ts → cliente (server-only)    │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                         │
│                (Supabase PostgreSQL)                    │
└─────────────────────────────────────────────────────────┘
```

**Detalle clave:** las páginas de servidor **no hacen fetch HTTP a la propia API**. Importan el servicio del backend directamente (por ejemplo `getOverview` importa `overviewService`) y lo envuelven con cache. Solo los componentes de cliente usan HTTP. Ver [Data fetching](./data-fetching.md).

### **Ventajas de esta Arquitectura**

1. **Separación de responsabilidades** → Cada capa tiene un propósito claro
2. **Testabilidad** → Cada capa se puede testear independientemente (ver [Tests](./testing.md))
3. **Mantenibilidad** → Cambios en una capa no afectan a otras
4. **Reutilización** → El mismo servicio sirve a la ruta HTTP y a las páginas de servidor

---

## Separación Pipeline / Web

Una de las decisiones más importantes fue **separar el pipeline de generación de datos de la aplicación web**.

### **Por qué 2 repositorios separados**

| Aspecto         | Pipeline (Privado)              | Web (Público)               |
| --------------- | ------------------------------- | --------------------------- |
| **Datos**       | Información sensible de menores | Solo agregados estadísticos |
| **Permisos BD** | Read + Write                    | Read-only                   |
| **Seguridad**   | Credenciales sensibles          | Solo `SUPABASE_ANON_KEY`    |
| **Código**      | Scraping y procesamiento        | TypeScript, React           |

### **Flujo de Datos**

```
┌─────────────────────────────────────────────────────────┐
│         PIPELINE (Repositorio Privado)                  │
│                                                         │
│  Obtiene, procesa y publica los datos en Supabase       │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              SUPABASE POSTGRESQL                        │
│                                                         │
│  • participants, schools (búsqueda)                     │
│  • stats_periods, statistics, statistic_* (estadísticas)│
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         TAMBORRADATA WEB (Repositorio Público)          │
│                                                         │
│  1. Lee periodos publicados (solo lectura)              │
│  2. Visualización y análisis                            │
│  3. Búsqueda de participantes (con validación)          │
└─────────────────────────────────────────────────────────┘
```

Las tablas que lee la web están listadas en `app/types/dbSchema.ts` (constante `tables`). Cómo se publican los datos se explica en [publishing](./publishing.md).

### **Ventajas**

1. **Seguridad** → Datos sensibles no expuestos en código público
2. **Responsabilidad única** → Pipeline solo genera, web solo visualiza
3. **Escalabilidad** → Cada repo puede evolucionar independientemente

---

## Backend: Patrón Repository

El backend utiliza el **patrón Repository** para abstraer el acceso a datos. Cada endpoint es una carpeta en `app/(backend)/api/`.

### **Estructura**

```
app/(backend)/api/overview/
├── route.ts                    # Handler HTTP
├── dtos/
│   └── overview.schema.ts      # Validación de parámetros
├── service/
│   └── overview.service.ts     # Lógica de negocio
├── repo/
│   └── overview.repo.ts        # Queries a Supabase
└── types/
    └── index.ts                # Tipos internos (filas de BD)
```

> Los nombres de carpeta no son uniformes: `service/` en `overview` y `period`, `services/` en `participants`, `schools` y `statistics`. En `statistics` además hay `lib/` y subrutas dinámicas (`[period]/summaries`, `[period]/categories/[category]`).

Los endpoints existentes son `overview`, `period`, `statistics`, `participants`, `schools` y `ping`. Ver [API](./api.md).

### **Ejemplo: Overview**

#### **1. Route Handler (HTTP Layer)**

```typescript
// app/(backend)/api/overview/route.ts
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    let scope = searchParams.get('scope') as OverviewScope | null;

    scope = checkParams(scope);

    const response = await overviewService(scope);

    return res.ok(response);
  } catch (error) {
    return handleError('GET /api/overview', error);
  }
}
```

El handler no formatea errores: cualquier excepción pasa por `handleError`, que la traduce a un status HTTP (ver [Errores de Dominio](#errores-de-dominio)).

#### **2. Service (Business Layer)**

```typescript
// app/(backend)/api/overview/service/overview.service.ts
export async function overviewService(scope: OverviewScope): Promise<OverviewResponse> {
  const periods = await getPublishedPeriods(); // Get all published periods

  const yearPeriods = periods
    .filter((period) => period.kind === periodKind.year)
    .sort((a, b) => (b.start_year ?? 0) - (a.start_year ?? 0));

  const [globalPeriod, lastPeriod] = await Promise.all([
    scope === overviewScope.last
      ? undefined
      : buildGlobalPeriod(
          periods.find((period) => period.kind === periodKind.global),
          yearPeriods
        ),
    scope === overviewScope.global ? undefined : buildLastPeriod(yearPeriods[0]),
  ]);

  return { globalPeriod, lastPeriod };
}
```

#### **3. Repository (Data Layer)**

```typescript
// app/(backend)/api/overview/repo/overview.repo.ts
export async function getPublishedPeriods(): Promise<OverviewPeriodRow[]> {
  const { data: periods, error: periodsError } = await supabaseClient
    .from(tables.statsPeriods)
    .select('published_run_id, kind, public_slug, start_year, end_year, last_published_at')
    .not('published_run_id', 'is', null)
    .returns<OverviewPeriodRow[]>();

  if (periodsError) {
    throw new ServerError(`Failed to fetch the published periods: ${periodsError.message}`);
  }

  return periods ?? [];
}
```

El repository **lanza errores de dominio** (`ServerError`) en vez de devolver `{ data, error }`. El service tampoco captura excepciones: las deja subir hasta `handleError`.

### **Ventajas del Patrón Repository**

1. **Abstracción de BD** → Las queries viven en un solo sitio por feature
2. **Testing** → Los repositories se pueden mockear: los tests unitarios sustituyen el cliente de Supabase por un mock encadenable
3. **Reutilización** → Un repository usado por múltiples services
4. **Claridad** → Separación entre lógica de negocio y acceso a datos

---

## Errores de Dominio

Las capas internas no conocen HTTP. Lanzan clases de error definidas en `app/(backend)/lib/errors.ts`, y `handleError` (en `lib/response.ts`) las traduce una sola vez:

| Error                | Status | Respuesta (`res.*`)       |
| -------------------- | ------ | ------------------------- |
| `ValidationError`    | 400    | `res.validationError`     |
| `UnauthorizedError`  | 401    | `res.unauthorized`        |
| `ForbiddenError`     | 403    | `res.forbidden`           |
| `NotFoundError`      | 404    | `res.notFound`            |
| `PeriodMovedError`   | 404    | `res.notFound`            |
| `ConflictError`      | 409    | `res.conflict`            |
| `RateLimitError`     | 429    | `res.tooManyRequests` (cabecera `Retry-After`) |
| `ServerError`        | 500    | `res.serverError`         |
| Cualquier otro error | 500    | `res.serverError` (se registra en el log) |

```typescript
// app/(backend)/lib/response.ts (extracto)
export function handleError(tag: string, error: unknown): Response {
  if (error instanceof ValidationError) return res.validationError(error.message);
  if (error instanceof NotFoundError) return res.notFound(error.message);
  if (error instanceof RateLimitError)
    return res.tooManyRequests(error.message, error.retryAfterSeconds);
  // ...
  const message = error instanceof Error ? error.message : String(error);

  log(`[${tag}] Unhandled error: ${message}`, 'error');
  return res.serverError();
}
```

**Detalle de seguridad:** el cuerpo de error es `{ error: string }`, pero en producción el mensaje es genérico (`'Invalid request'`, `'Not found'`...). El mensaje real solo se expone en desarrollo (`errorMessage` según `isDev`).

En el frontend, `handleServiceError` (`app/(frontend)/[locale]/lib/handleServiceError.ts`) convierte `NotFoundError` y `ValidationError` en `notFound()` de Next; cualquier otro error sube al error boundary. `PeriodMovedError` se resuelve antes con un `permanentRedirect` al slug nuevo.

---

## Tipos Compartidos

Los contratos entre backend y frontend viven en **`app/types/`**, fuera de ambos módulos:

```
app/types/
├── api/
│   ├── overview.types.ts
│   ├── participants.types.ts
│   ├── period.types.ts
│   ├── schools.types.ts
│   └── statistics.types.ts
├── statistics/          # categorías, formas de datos, métricas
├── dbSchema.ts          # nombres de tablas y enums de BD
├── locale.ts
└── period.types.ts
```

Por qué:

1. **Una sola fuente de verdad** → backend y frontend importan los mismos tipos de request/response.
2. **Sin duplicación de strings** → las constantes (`tables`, `periodKind`, `overviewScope`, `statisticCategories`) se declaran con `as const` y se derivan los tipos de ellas.
3. **Tipos internos separados** → los tipos de filas de BD quedan en `api/*/types/`, dentro del backend, y no se filtran al frontend.

---

## Frontend: Server Components

Tamborradata utiliza **Next.js 16 Server Components** como estrategia por defecto. Solo se marca `'use client'` donde hace falta interactividad.

### **Por qué Server Components**

| Feature           | Client Component          | Server Component                 |
| ----------------- | ------------------------- | -------------------------------- |
| **SEO**           | ❌ Depende de hidratación | ✅ HTML completo desde servidor |
| **Performance**   | ⚠️ Bundle JS grande       | ✅ 0 KB JS en cliente           |
| **Data fetching** | ⚠️ Network waterfall      | ✅ Paralelo en servidor         |
| **Seguridad**     | ❌ Expone código          | ✅ Lógica oculta                |

### **Estrategia de uso**

```
app/(frontend)/[locale]/
├── layout.tsx                       # Providers (ReactQueryProvider, next-intl)
├── (landing)/page.tsx               # Landing
└── (pages)/
    ├── statistics/
    │   ├── page.tsx
    │   └── [period]/
    │       ├── page.tsx             # Server Component: lee getStatistics + getPeriods
    │       ├── PageContent.tsx      # Composición de la página
    │       ├── components/
    │       └── hooks/               # useRank (client): paginación de categorías
    ├── search-participants/
    └── privacy-policy/
```

**Regla:** solo usar `'use client'` cuando sea **estrictamente necesario**:

- Componentes con interactividad (onClick, onChange)
- Hooks de React (useState, useEffect)
- React Query hooks (`useQuery`, `useInfiniteQuery`)
- Animaciones

### **Ejemplo real: página de periodo**

```typescript
// app/(frontend)/[locale]/(pages)/statistics/[period]/page.tsx
export default async function PeriodPage({ params }: { params: Promise<{ period: string }> }) {
  const { period } = await params;
  const stats = await getStatistics(period, await getLocale());
  const periods = await getPeriods();

  return (
    <>
      <PeriodStructuredData stats={stats} periods={periods} />
      <PageContent periods={periods} stats={stats} />
    </>
  );
}
```

La página es un Server Component que obtiene los datos en el servidor y los pasa ya resueltos. Solo las partes interactivas (selects, paginación de rankings, buscador) son Client Components.

---

## Base de Datos: Row Level Security

El proyecto usa Supabase (PostgreSQL) con **Row Level Security** como capa de protección a nivel de fila, según el [README](../README.md) y la política de [SECURITY](../SECURITY.md).

**Lo que se puede verificar desde este repositorio:**

- El cliente (`app/(backend)/core/db/supabaseClient.ts`) se crea con `SUPABASE_URL` y **`SUPABASE_ANON_KEY`**, nunca con una clave de servicio.
- El archivo es `server-only`: la clave no llega al navegador.
- Todos los repositories solo hacen `select`; no hay escrituras en la web.

**Lo que no se puede verificar desde aquí:** las políticas SQL concretas. Viven en Supabase, no en este repositorio, por lo que este documento ya no las reproduce.

### **Por qué RLS en vez de solo middleware API**

| Aspecto            | Middleware API       | RLS                           |
| ------------------ | -------------------- | ----------------------------- |
| **Seguridad**      | ⚠️ Puede bypassearse | ✅ Enforced por PostgreSQL   |
| **Mantenibilidad** | ❌ Duplicar lógica   | ✅ Una sola fuente de verdad |

**Seguridad en profundidad:** incluso si la capa de API tuviera un fallo, la clave `anon` solo debería poder leer lo que las políticas permitan.

### **Protecciones adicionales en la API**

- `proxy.ts` responde `403` a peticiones a `/api/*` cuyo `Accept` incluye `text/html` (en producción), para que la API no se pueda abrir como página.
- `POST /api/participants` tiene rate limit por IP (`app/(backend)/lib/ratelimit`), con la IP enmascarada mediante HMAC. Ver [API](./api.md).

---

## Modularización por Features

Tamborradata organiza el código por **features** en vez de por tipo de archivo.

### **Backend**

Cada endpoint agrupa su route, DTOs, service, repo y tipos en una carpeta (ver [Backend: Patrón Repository](#backend-patrón-repository)). Lo transversal está en `lib/` (errores, respuestas, cache, rate limit) y `core/` (cliente de BD, entorno, logger).

### **Frontend**

Cada página agrupa sus componentes y hooks; lo compartido sube un nivel:

```
app/(frontend)/[locale]/
├── (pages)/search-participants/
│   ├── page.tsx
│   ├── PageContent.tsx
│   ├── components/
│   │   ├── SearchForm.tsx
│   │   ├── results/
│   │   └── status/
│   ├── hooks/
│   │   ├── useSearchForm.ts
│   │   └── useCountdown.ts
│   └── utils/
├── hooks/query/             # Hooks de React Query compartidos
│   ├── useCategoryQuery.ts
│   └── useParticipantsQuery.ts
├── services/                # getStatistics, getPeriods, getOverview, getSchools, fetchCategory, fetchParticipants
├── lib/                     # cacheAcrossRequests, handleServiceError, queryKeys...
└── components/ui/           # Componentes reutilizables
```

**Ventajas:**

- Todo el código de una feature está junto
- Fácil encontrar archivos relacionados
- Fácil eliminar/refactorizar features
- Reduce acoplamiento

---

## DTOs y Validación

Cada endpoint tiene un archivo en `dtos/` que valida y normaliza los parámetros **antes** de llegar al service. Si algo no es válido, lanza `ValidationError` (→ `400`).

### **Ejemplo: parámetro `scope`**

```typescript
// app/(backend)/api/overview/dtos/overview.schema.ts
export function checkParams(scope: OverviewScope | null): OverviewScope {
  if (!scope) {
    return overviewScope.both;
  }

  if (!Object.values(overviewScope).includes(scope)) {
    throw new ValidationError(`Invalid scope parameter: ${scope}`);
  }

  return scope;
}
```

### **Ejemplo: slug de periodo**

```typescript
// app/(backend)/lib/period.ts
const PUBLIC_SLUG_REGEX = /^[\w-]{1,64}$/;

export function parsePublicSlug(publicSlug: string | null, paramName = 'publicSlug'): string {
  if (!publicSlug) {
    throw new ValidationError(`The '${paramName}' parameter is required`);
  }

  const cleanPublicSlug = publicSlug.trim();

  if (!PUBLIC_SLUG_REGEX.test(cleanPublicSlug)) {
    throw new ValidationError(`The '${paramName}' parameter is not a valid public slug`);
  }

  return cleanPublicSlug;
}
```

Solo valida la **forma** del slug; si existe lo decide la consulta a BD (`404`).

### **Caso especial: body JSON**

`POST /api/participants` recibe un body que no es de fiar. `checkParams` recibe `unknown`, comprueba tipos, longitud máxima (`MAX_PARTICIPANT_LENGTH`), mínimo de palabras (`MIN_PARTICIPANT_WORDS`) y normaliza el nombre (sin acentos, minúsculas) con las mismas reglas que `participants.name_key`.

### **Ventajas**

1. **Seguridad** → Entradas validadas y normalizadas antes de tocar la BD
2. **Consistencia** → Un solo sitio por endpoint
3. **Mantenibilidad** → Cambiar una validación es cambiar un archivo
4. **Documentación** → Los DTOs describen qué acepta cada endpoint

---

## Gestión de Estado

El estado del servidor llega **principalmente desde Server Components**. **React Query** se usa solo en el cliente, para lo que no se puede resolver en el servidor.

### **Por qué NO usar Redux/Zustand**

| Feature            | Redux/Zustand | React Query    |
| ------------------ | ------------- | -------------- |
| **Server state**   | ❌ Manual     | ✅ Automático |
| **Caching**        | ❌ Manual     | ✅ Built-in   |
| **Loading states** | ❌ Manual     | ✅ Built-in   |
| **Error handling** | ❌ Manual     | ✅ Built-in   |

### **Estado en Tamborradata**

```
┌─────────────────────────────────────────────────────┐
│     SERVER COMPONENTS (datos de página)             │
│                                                     │
│  • Estadísticas, periodos, overview, colegios       │
│  • Cacheados con unstable_cache (1 hora)            │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│       REACT QUERY (solo cliente)                    │
│                                                     │
│  • useCategoryQuery → páginas siguientes de rankings│
│  • useParticipantsQuery → búsqueda de participantes │
└─────────────────────────────────────────────────────┘
┌─────────────────────────────────────────────────────┐
│       useState/useReducer (Client State)            │
│                                                     │
│  • Formularios, selects, animaciones                │
└─────────────────────────────────────────────────────┘
```

**Principio:** datos de página en el servidor, paginación y búsqueda con React Query, estado local con hooks nativos. Detalle en [Data fetching](./data-fetching.md).

---

## Cache

Las lecturas de las páginas de servidor se cachean con `unstable_cache` a través del wrapper `cacheAcrossRequests` (`app/(frontend)/[locale]/lib/cacheAcrossRequests.ts`):

```typescript
export const cacheAcrossRequests: typeof unstable_cache = (callback, keyParts, options) =>
  isDev ? callback : unstable_cache(callback, keyParts, options);
```

| Decisión                                | Motivo                                                                                   |
| --------------------------------------- | ---------------------------------------------------------------------------------------- |
| `revalidate: 3600` en cada servicio     | Los datos cambian como mucho una vez al año; una hora de cache es segura                 |
| Desactivada en desarrollo               | Una entrada vieja en disco (p. ej. tras cambiar la forma de una respuesta) no oculta el backend actual |
| `cache()` de React por encima           | Deduplica llamadas dentro de una misma request (`generateMetadata` y la página)          |
| `Cache-Control` en las rutas API        | `s-maxage=3600, stale-while-revalidate=60` en `statistics`, `summaries` y categorías sin paginar |

---

## Decisiones de Stack

### **Next.js 16 vs Alternativas**

| Framework        | Pros                          | Contras            | ¿Por qué NO?                   |
| ---------------- | ----------------------------- | ------------------ | ------------------------------ |
| **Next.js**      | ✅ SSR, ✅ RSC, ✅ API Routes | Bundle grande      | **ELEGIDO**                   |
| **Remix**        | ✅ SSR, ✅ Web Standards      | Ecosistema pequeño | Menos maduro                  |
| **Astro**        | ✅ Ligero                     | No dinámico        | No sirve para app interactiva |
| **Vite + React** | ✅ Rápido                     | No SSR nativo      | SEO problemático              |

### **TypeScript vs JavaScript**

**Decisión:** TypeScript al 100%

**Razones:**

1. Type-safety → Previene bugs
2. IntelliSense → Mejor DX
3. Refactoring → Seguro y rápido
4. Documentación → Types como docs

### **TailwindCSS vs Alternativas**

| Opción                | Pros                              | Contras          | ¿Por qué NO?      |
| --------------------- | --------------------------------- | ---------------- | ----------------- |
| **TailwindCSS**       | ✅ Utility-first, ✅ Tree-shaking | Verbose          | **ELEGIDO**      |
| **CSS Modules**       | ✅ Scoped                         | Manual           | No utility-first |
| **Styled Components** | ✅ CSS-in-JS                      | Runtime overhead | Performance      |
| **Vanilla CSS**       | ✅ Simple                         | No scoping       | Difícil mantener |

### **next-intl para i18n**

La web es multilenguaje (`es`, `eu`, `en`) con rutas `[locale]`. `proxy.ts` aplica el middleware de `next-intl` a las páginas. Detalle en [i18n](./i18n.md).

### **Supabase vs Alternativas**

| Opción              | Pros                                | Contras        | ¿Por qué NO?         |
| ------------------- | ----------------------------------- | -------------- | -------------------- |
| **Supabase**        | ✅ PostgreSQL, ✅ RLS, ✅ Free tier | Vendor lock-in | **ELEGIDO**         |
| **PlanetScale**     | ✅ MySQL                            | No RLS         | Menos features       |
| **Vercel Postgres** | ✅ Integración                      | Caro           | Pricing              |
| **Firebase**        | ✅ Real-time                        | NoSQL          | Estructura compleja  |

---

## Principios de Diseño

### **1. KISS (Keep It Simple, Stupid)**

> "La simplicidad es la máxima sofisticación."

Tamborradata evita over-engineering:

- ❌ No microservicios (monolito modular)
- ❌ No GraphQL (REST simple)
- ❌ No ORM (queries directas con `supabase-js`)

### **2. YAGNI (You Aren't Gonna Need It)**

> "No implementar features hasta que sean necesarias."

Tamborradata NO tiene:

- Sistema de autenticación (no necesario)
- Comentarios (no necesario)
- Dashboard de admin (pipeline automatizado)

### **3. DRY (Don't Repeat Yourself)**

Reutilización de código:

- Tipos compartidos en `app/types`
- Un solo `handleError` y un solo conjunto de errores de dominio
- Un mismo service para la ruta HTTP y las páginas de servidor

### **4. Separation of Concerns**

Cada capa tiene una responsabilidad:

- UI → Solo presentación
- API Routes → Solo HTTP handling
- DTOs → Solo validación
- Services → Solo lógica de negocio
- Repositories → Solo acceso a datos

---

## Referencias

- [API](./api.md)
- [Data fetching](./data-fetching.md)
- [i18n](./i18n.md)
- [SEO](./seo.md)
- [Tests](./testing.md)
- [Actualización anual de datos](./publishing.md)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Next.js Patterns](https://nextjs.org/docs/app/building-your-application)
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query)

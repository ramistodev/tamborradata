# Decisiones de Diseño - Arquitectura y Patrones

Esta documentación explica las **decisiones arquitectónicas y de diseño** tomadas durante el desarrollo de Tamborradata, incluyendo la justificación de cada elección.

---

## 📋 Índice

- [Arquitectura General](#arquitectura-general)
- [Separación Pipeline / Web](#separación-pipeline--web)
- [Backend: Patrón Repository](#backend-patrón-repository)
- [Frontend: Server Components](#frontend-server-components)
- [Base de Datos: Row Level Security](#base-de-datos-row-level-security)
- [Modularización por Features](#modularización-por-features)
- [DTOs y Validación](#dtos-y-validación)
- [Gestión de Estado](#gestión-de-estado)
- [Decisiones de Stack](#decisiones-de-stack)

---

## Arquitectura General

Tamborradata sigue una **arquitectura en capas limpia** con separación estricta de responsabilidades.

### **Diagrama de Capas**

```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                     │
│  (Frontend - Next.js Server Components + React Query)   │
│                                                         │
│  • components/ → UI components                          │
│  • hooks/query/ → React Query hooks                     │
│  • services/ → HTTP calls                               │
│  • providers/ → Context providers                       │
└─────────────────────────────────────────────────────────┘
                         ↓ HTTP
┌─────────────────────────────────────────────────────────┐
│                    API LAYER                            │
│         (Backend - Next.js API Routes)                  │
│                                                         │
│  • api/*/route.ts → HTTP handlers                       │
│  • api/*/dtos/ → Request/Response schemas               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  BUSINESS LAYER                         │
│              (Services - Lógica de negocio)             │
│                                                         │
│  • api/*/services/ → Lógica de negocio                  │
│  • shared/utils/ → Utilidades compartidas               │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                   DATA LAYER                            │
│           (Repositories - Acceso a datos)               │
│                                                         │
│  • api/*/repositories/ → Queries SQL                    │
│  • core/db/ → Cliente Supabase                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│                  DATABASE LAYER                         │
│         (Supabase PostgreSQL + RLS)                     │
└─────────────────────────────────────────────────────────┘
```

### **Ventajas de esta Arquitectura**

1. **Separación de responsabilidades** → Cada capa tiene un propósito claro
2. **Testabilidad** → Cada capa se puede testear independientemente
3. **Mantenibilidad** → Cambios en una capa no afectan a otras
4. **Escalabilidad** → Fácil añadir nuevas features
5. **Reutilización** → Servicios y repositories compartidos

---

## Separación Pipeline / Web

Una de las decisiones más importantes fue **separar el pipeline de generación de datos de la aplicación web**.

### **Por qué 2 repositorios separados**

| Aspecto         | Pipeline (Privado)              | Web (Público)               |
| --------------- | ------------------------------- | --------------------------- |
| **Datos**       | Información sensible de menores | Solo agregados estadísticos |
| **Permisos BD** | Read + Write                    | Read-only                   |
| **Seguridad**   | Credenciales sensibles          | Solo ANON_KEY               |
| **Código**      | Python, scraping                | TypeScript, React           |
| **Deployment**  | GitHub Actions                  | Vercel                      |

### **Flujo de Datos**

```
┌─────────────────────────────────────────────────────────┐
│         PIPELINE (Repositorio Privado)                  │
│                                                         │
│  1. Scraping de listas oficiales                        │
│  2. Limpieza y anonimización de datos                   │
│  3. Generación de estadísticas agregadas                │
│  4. INSERT en Supabase (con permisos WRITE)             │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│              SUPABASE POSTGRESQL                        │
│                                                         │
│  • participants (nombres + colegios)                    │
│  • statistics (agregados)                               │
│  • RLS: Solo lectura desde web                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│         TAMBORRADATA WEB (Repositorio Público)          │
│                                                         │
│  1. Consulta datos agregados (READ-ONLY)                │
│  2. Visualización y análisis                            │
│  3. Búsqueda de participantes (con validación)          │
└─────────────────────────────────────────────────────────┘
```

### **Ventajas**

1. **Seguridad** → Datos sensibles no expuestos en código público
2. **Responsabilidad única** → Pipeline solo genera, web solo visualiza
3. **Escalabilidad** → Cada repo puede evolucionar independientemente
4. **Compliance GDPR** → Datos de menores protegidos

---

## Backend: Patrón Repository

El backend utiliza el **patrón Repository** para abstraer el acceso a datos.

### **Estructura**

```
app/(backend)/api/statistics/
├── route.ts                    # HTTP handler
├── services/
│   └── statistics.service.ts   # Lógica de negocio
├── repositories/
│   └── statistics.repository.ts # Queries SQL
├── dtos/
│   └── statistics.schema.ts    # Validación
└── types/
    └── statistics.types.ts     # TypeScript types
```

### **Ejemplo: Obtener estadísticas**

#### **1. Route Handler (HTTP Layer)**

```typescript
// route.ts
export async function GET(req: Request) {
  const year = new URL(req.url).searchParams.get('year');

  const { statistics, error } = await getStatistics(year);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ statistics });
}
```

#### **2. Service (Business Layer)**

```typescript
// services/statistics.service.ts
export async function getStatistics(year: string) {
  try {
    const statistics = await statisticsRepository.getByYear(year);

    // Lógica de negocio: formatear, agregar, etc.
    const formatted = formatStatistics(statistics);

    return { statistics: formatted, error: null };
  } catch (error) {
    return { statistics: null, error: error.message };
  }
}
```

#### **3. Repository (Data Layer)**

```typescript
// repositories/statistics.repository.ts
export const statisticsRepository = {
  async getByYear(year: string) {
    const { data, error } = await supabaseClient.from('statistics').select('*').eq('year', year);

    if (error) throw error;
    return data;
  },
};
```

### **Ventajas del Patrón Repository**

1. **Abstracción de BD** → Cambiar Supabase por otra BD es fácil
2. **Testing** → Mock repositories en tests
3. **Reutilización** → Un repository usado por múltiples services
4. **Claridad** → Separación entre lógica de negocio y acceso a datos

---

## Frontend: Server Components

Tamborradata utiliza **Next.js 16 Server Components** como estrategia por defecto.

### **Por qué Server Components**

| Feature           | Client Component          | Server Component                 |
| ----------------- | ------------------------- | -------------------------------- |
| **SEO**           | ❌ Depende de hidratación | ✅ HTML completo desde servidor |
| **Performance**   | ⚠️ Bundle JS grande       | ✅ 0 KB JS en cliente           |
| **Data fetching** | ⚠️ Network waterfall      | ✅ Paralelo en servidor         |
| **Seguridad**     | ❌ Expone código          | ✅ Lógica oculta                |

### **Estrategia de uso**

```
app/(frontend)/
├── page.tsx                    # Server Component (default)
├── layout.tsx                  # Server Component
├── statistics/
│   ├── page.tsx                # Server Component
│   └── [year]/
│       ├── page.tsx            # Server Component
│       └── components/
│           ├── StatsTable.tsx  # Server Component
│           └── Chart.tsx       # Client Component ('use client')
```

**Regla:** Solo usar `'use client'` cuando sea **estrictamente necesario**:

- Componentes con interactividad (onClick, onChange)
- Hooks de React (useState, useEffect)
- React Query hooks (useQuery)
- Animaciones (Framer Motion)

### **Ejemplo: Mezcla Server + Client**

```typescript
// page.tsx (Server Component)
export default async function StatisticsPage({ params }) {
  // Data fetching en servidor
  const statistics = await fetchStatistics(params.year);

  return (
    <div>
      <h1>Estadísticas {params.year}</h1>

      {/* Server Component: solo HTML */}
      <StatsSummary data={statistics.summary} />

      {/* Client Component: interactivo */}
      <InteractiveChart data={statistics.chartData} />
    </div>
  );
}

// InteractiveChart.tsx (Client Component)
'use client';
import { useState } from 'react';

export function InteractiveChart({ data }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div>
      <select onChange={(e) => setSelectedCategory(e.target.value)}>
        {/* ... */}
      </select>
      <Chart data={data} category={selectedCategory} />
    </div>
  );
}
```

---

## Base de Datos: Row Level Security

Supabase RLS (Row Level Security) protege la base de datos a nivel de fila.

### **Políticas Implementadas**

```sql
-- Solo lectura para usuarios anónimos
CREATE POLICY "Anon read access on statistics"
ON statistics
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon read access on participants"
ON participants
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon read access on available_years"
ON available_years
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon read access on sys_status"
ON sys_status
FOR SELECT
TO anon
USING (true);
```

### **Por qué RLS en vez de API middleware**

| Aspecto            | Middleware API       | RLS                           |
| ------------------ | -------------------- | ----------------------------- |
| **Seguridad**      | ⚠️ Puede bypassearse | ✅ Enforced por PostgreSQL   |
| **Performance**    | ❌ Lógica en API     | ✅ Nativo en BD              |
| **Mantenibilidad** | ❌ Duplicar lógica   | ✅ Una sola fuente de verdad |
| **Escalabilidad**  | ❌ Carga en API      | ✅ BD optimizada             |

### **Ventajas de RLS**

1. **Seguridad en profundidad** → Incluso si API es comprometida, BD está protegida
2. **Performance** → PostgreSQL optimiza queries con RLS
3. **Auditoría** → Logs de acceso a nivel de BD
4. **Simplicidad** → Una política para toda la aplicación

---

## Modularización por Features

Tamborradata organiza el código por **features** en vez de por tipo de archivo.

### **Comparación de Estructuras**

#### **❌ Organización por tipo (malo)**

```
app/
├── components/
│   ├── StatisticsTable.tsx
│   ├── ParticipantSearch.tsx
│   └── YearSelector.tsx
├── hooks/
│   ├── useStatistics.ts
│   ├── useParticipants.ts
│   └── useYears.ts
├── services/
│   ├── statisticsService.ts
│   └── participantsService.ts
```

**Problemas:**

- Difícil encontrar código relacionado
- Archivos no relacionados juntos
- Difícil eliminar una feature

#### **✅ Organización por feature (bueno)**

```
app/(frontend)/
├── statistics/
│   ├── page.tsx
│   ├── [year]/
│   │   └── page.tsx
│   ├── components/
│   │   ├── StatsTable.tsx
│   │   └── Chart.tsx
│   ├── hooks/
│   │   └── useStatisticsQuery.ts
│   └── services/
│       └── fetchStatistics.ts
├── search/
│   ├── page.tsx
│   ├── components/
│   │   └── SearchForm.tsx
│   ├── hooks/
│   │   └── useParticipantsQuery.ts
│   └── services/
│       └── fetchParticipants.ts
```

**Ventajas:**

- Todo el código de una feature está junto
- Fácil encontrar archivos relacionados
- Fácil eliminar/refactorizar features
- Reduce acoplamiento

---

## DTOs y Validación

Tamborradata usa **DTOs (Data Transfer Objects)** para validar requests y responses.

### **Ejemplo: Validación de parámetros**

```typescript
// dtos/statistics.schema.ts
export async function checkParams(year: string | null) {
  if (!year) {
    return {
      valid: false,
      error: 'Parámetro year requerido',
    };
  }

  const cleanYear = year.trim();

  if (cleanYear !== 'global' && !isValidYear(cleanYear)) {
    return {
      valid: false,
      error: 'Año inválido',
    };
  }

  return {
    valid: true,
    cleanYear,
    error: null,
  };
}

function isValidYear(year: string): boolean {
  const yearNum = parseInt(year, 10);
  return yearNum >= 2018 && yearNum <= new Date().getFullYear();
}
```

### **Ventajas**

1. **Seguridad** → Previene inyecciones SQL
2. **Consistencia** → Datos validados en un solo lugar
3. **Mantenibilidad** → Cambiar validación es fácil
4. **Documentación** → DTOs documentan estructura de datos

---

## Gestión de Estado

Tamborradata utiliza **React Query** como única fuente de estado del servidor.

### **Por qué NO usar Redux/Zustand**

| Feature            | Redux/Zustand | React Query    |
| ------------------ | ------------- | -------------- |
| **Server state**   | ❌ Manual     | ✅ Automático |
| **Caching**        | ❌ Manual     | ✅ Built-in   |
| **Loading states** | ❌ Manual     | ✅ Built-in   |
| **Error handling** | ❌ Manual     | ✅ Built-in   |
| **SSR**            | ⚠️ Complejo   | ✅ Nativo     |

### **Estado en Tamborradata**

```
┌─────────────────────────────────────────────────────┐
│           REACT QUERY (Server State)                │
│                                                     │
│  • Estadísticas                                     │
│  • Participantes                                    │
│  • Años disponibles                                 │
│  • Estado del sistema                               │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│       useState/useReducer (Client State)            │
│                                                     │
│  • Filtros UI                                       │
│  • Estado de modales                                │
│  • Animaciones                                      │
└─────────────────────────────────────────────────────┘
```

**Principio:** Estado del servidor con React Query, estado local con hooks nativos.

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
- ❌ No ORM (queries SQL directas)

### **2. YAGNI (You Aren't Gonna Need It)**

> "No implementar features hasta que sean necesarias."

Tamborradata NO tiene:

- Sistema de autenticación (no necesario)
- Comentarios (no necesario)
- Dashboard de admin (pipeline automatizado)

### **3. DRY (Don't Repeat Yourself)**

Reutilización de código:

- Hooks personalizados
- Repositories compartidos
- Componentes genéricos

### **4. Separation of Concerns**

Cada capa tiene una responsabilidad:

- UI → Solo presentación
- API Routes → Solo HTTP handling
- Services → Solo lógica de negocio
- Repositories → Solo acceso a datos

---

## Referencias

- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Repository Pattern](https://martinfowler.com/eaaCatalog/repository.html)
- [Next.js Patterns](https://nextjs.org/docs/app/building-your-application)
- [React Query Patterns](https://tkdodo.eu/blog/practical-react-query)

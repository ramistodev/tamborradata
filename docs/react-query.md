# React Query - Gestión de Estado del Servidor

Esta documentación explica en detalle cómo Tamborradata utiliza **React Query 5** (@tanstack/query) para gestionar el estado del servidor, optimizar el rendimiento y sincronizar datos.

---

## 📋 Índice

- [¿Por qué React Query?](#por-qué-react-query)
- [Configuración Global](#configuración-global)
- [Estrategia de Caching](#estrategia-de-caching)
- [Hooks Personalizados](#hooks-personalizados)
- [SSR y Prefetching](#ssr-y-prefetching)
- [Sistema de Polling](#sistema-de-polling)
- [Optimización de Rendimiento](#optimización-de-rendimiento)

---

## ¿Por qué React Query?

React Query es la solución elegida para gestionar el estado del servidor en Tamborradata por las siguientes razones:

### **Ventajas principales**

1. **Caching automático** → Evita peticiones innecesarias
2. **Sincronización en background** → Mantiene datos actualizados
3. **SSR nativo** → Excelente para SEO y performance
4. **Optimistic updates** → Mejora UX percibida
5. **Gestión de estados** → Loading, error y success automáticos
6. **Deduplicación de requests** → Evita llamadas duplicadas
7. **Invalidación selectiva** → Control granular de cache

### **Alternativas consideradas**

- **SWR** → Menos control sobre cache y revalidación
- **Redux Toolkit Query** → Demasiado verbose para este caso
- **Zustand + fetch** → Requiere gestión manual de cache

---

## Configuración Global

La configuración global de React Query se define en `ReactQueryProvider.tsx`:

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos
      retry: 1, // 1 reintento por defecto
      refetchOnWindowFocus: false, // No refetch al volver a la pestaña
      refetchOnReconnect: false, // No refetch al reconectar
    },
    mutations: {
      retry: 0,
    },
  },
});
```

### **Parámetros explicados**

| Parámetro              | Valor      | Razón                                                |
| ---------------------- | ---------- | ---------------------------------------------------- |
| `staleTime`            | 5 minutos  | Los datos históricos no cambian con frecuencia       |
| `gcTime`               | 30 minutos | Mantener datos en cache para navegación rápida       |
| `retry`                | 1          | Dar una segunda oportunidad en caso de error de red  |
| `refetchOnWindowFocus` | `false`    | Evitar peticiones innecesarias al cambiar de pestaña |
| `refetchOnReconnect`   | `false`    | Los datos no cambian lo suficientemente rápido       |

---

## Estrategia de Caching

Tamborradata implementa **tres niveles de caching** según el tipo de dato:

### **1. Cache Infinito (Datos estáticos)**

Para datos que **nunca cambian** (estadísticas históricas):

```typescript
// useStatisticsQuery.ts
export function useStatisticsQuery(year: string) {
  return useQuery({
    queryKey: queryKeys.statistics(year),
    queryFn: () => fetchStatistics(year),
    staleTime: Infinity, // Nunca se marca como stale
    gcTime: Infinity, // Nunca se elimina de cache
  });
}
```

**Usado en:**

- Estadísticas anuales (`/statistics/2024`)
- Datos de categorías expandidas
- Listado de años disponibles

### **2. Cache con Polling (Datos dinámicos)**

Para datos que **cambian durante actualizaciones**:

```typescript
// useStatisticsQuery.ts con isUpdating
refetchInterval: (query) =>
  query.state.data?.isUpdating ? 3000 : false,

refetchOnWindowFocus: (query) =>
  query.state.data?.isUpdating === true,
```

**Comportamiento:**

- Si `isUpdating = true` → polling cada 3 segundos
- Si `isUpdating = false` → no hace polling
- Reactiva polling al volver a la pestaña si está actualizando

📘 **Detalles completos:** [docs/isUpdating.md](./isUpdating.md)

### **3. Cache con TTL corto (Búsquedas)**

Para **búsquedas de usuarios** (participantes):

```typescript
// useParticipantsQuery.ts
staleTime: 2 * 60 * 1000,  // 2 minutos
gcTime: 10 * 60 * 1000,    // 10 minutos
```

**Razón:** Los datos de búsqueda pueden cambiar, pero no necesitan revalidación constante.

---

## Hooks Personalizados

Tamborradata encapsula todas las llamadas a React Query en **hooks personalizados** para:

1. **Centralizar configuración**
2. **Facilitar testing**
3. **Mejorar type-safety**
4. **Reutilizar lógica**

### **useStatisticsQuery**

Hook principal para obtener estadísticas de un año:

```typescript
export function useStatisticsQuery<T extends StatsResponse>(year: string) {
  return useQuery({
    queryKey: queryKeys.statistics(year),
    queryFn: ({ signal }) => fetchStatistics<T>(year, signal),
    enabled: Boolean(year),
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 0,
    refetchOnWindowFocus: (query) => query.state.data?.isUpdating === true,
    refetchInterval: (query) => (query.state.data?.isUpdating ? 3000 : false),
  });
}
```

**Características:**

- ✅ Soporte para AbortController (cancelación de requests)
- ✅ Polling condicional basado en `isUpdating`
- ✅ Tipo genérico para diferentes respuestas
- ✅ Cache infinito para datos históricos

### **useCategoryQuery**

Para expandir datos de categorías específicas:

```typescript
export function useCategoryQuery(year: string, category: string) {
  return useQuery({
    queryKey: queryKeys.category(year, category),
    queryFn: () => fetchCategory(year, category),
    enabled: Boolean(year && category),
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
```

### **useYearsQuery**

Lista de años disponibles (usado en selectores):

```typescript
export function useYearsQuery() {
  return useQuery({
    queryKey: queryKeys.years(),
    queryFn: fetchYears,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
```

### **useParticipantsQuery**

Búsqueda de participantes:

```typescript
export function useParticipantsQuery(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.participants(params),
    queryFn: () => fetchParticipants(params),
    enabled: Boolean(params.name && params.company),
    staleTime: 2 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
```

---

## SSR y Prefetching

Tamborradata utiliza **Server Components** de Next.js 16 + React Query para optimizar el SSR.

### **Estrategia de Prefetching**

```typescript
// page.tsx (Server Component)
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/lib/getQueryClient';

export default async function StatisticsPage({ params }: Props) {
  const queryClient = getQueryClient();

  // Prefetch en servidor
  await queryClient.prefetchQuery({
    queryKey: queryKeys.statistics(params.year),
    queryFn: () => fetchStatistics(params.year),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StatisticsContent year={params.year} />
    </HydrationBoundary>
  );
}
```

### **Ventajas del SSR con React Query**

1. **SEO optimizado** → Contenido renderizado en servidor
2. **First Paint rápido** → Usuarios ven contenido inmediatamente
3. **Hidratación automática** → React Query sincroniza estado
4. **Cache reutilizable** → Datos prefetched se usan en cliente

### **Flujo de datos**

```
1. Servidor: prefetchQuery → Obtiene datos
2. Servidor: dehydrate → Serializa cache
3. HTML: Envía página con datos
4. Cliente: HydrationBoundary → Rehidrata cache
5. Cliente: useQuery → Lee desde cache (sin request)
```

---

## Sistema de Polling

El polling condicional es la feature más importante de React Query en Tamborradata.

### **¿Por qué polling?**

Durante el mes de enero, el sistema se actualiza automáticamente:

1. Pipeline privado genera nuevos datos
2. Frontend detecta `isUpdating = true`
3. Activa polling cada 3 segundos
4. Cuando termina, `isUpdating = false` → detiene polling

### **Implementación**

```typescript
refetchInterval: (query) => {
  const isUpdating = query.state.data?.isUpdating;
  return isUpdating ? 3000 : false;
};
```

**Comportamiento:**

| Estado               | Acción                          |
| -------------------- | ------------------------------- |
| `isUpdating = true`  | Polling cada 3 segundos         |
| `isUpdating = false` | Sin polling                     |
| Error de red         | Detiene polling automáticamente |

### **Optimización de Polling**

```typescript
refetchOnWindowFocus: (query) => {
  // Solo refetch si está actualizando
  return query.state.data?.isUpdating === true;
};
```

**Razón:** Si el usuario cambia de pestaña durante una actualización, al volver se sincroniza automáticamente.

---

## Optimización de Rendimiento

### **1. Query Keys organizadas**

```typescript
// lib/queryKeys.ts
export const queryKeys = {
  all: ['tamborradata'] as const,
  statistics: (year: string) => [...queryKeys.all, 'statistics', year] as const,
  category: (year: string, cat: string) => [...queryKeys.statistics(year), cat] as const,
  years: () => [...queryKeys.all, 'years'] as const,
  companies: () => [...queryKeys.all, 'companies'] as const,
  participants: (params: SearchParams) => [...queryKeys.all, 'participants', params] as const,
};
```

**Ventajas:**

- Invalidación selectiva
- Type-safe
- Fácil debugging
- Consistencia

### **2. Deduplicación automática**

React Query deduplica requests idénticos:

```typescript
// Múltiples componentes hacen useStatisticsQuery('2024')
// Solo se ejecuta 1 petición HTTP
<ComponentA />  ─┐
<ComponentB />  ─┤→ 1 única petición a /api/statistics?year=2024
<ComponentC />  ─┘
```

### **3. Cancelación de requests**

```typescript
queryFn: ({ signal }) => fetchStatistics(year, signal);

// En fetchStatistics
export async function fetchStatistics(year: string, signal?: AbortSignal) {
  const response = await fetch(`/api/statistics?year=${year}`, { signal });
  // ...
}
```

**Beneficio:** Si el usuario cambia de página rápido, se cancelan requests innecesarios.

### **4. Lazy hydration**

```typescript
<HydrationBoundary state={dehydrate(queryClient)}>
  {/* Solo rehidrata cuando el componente se monta */}
  <StatisticsContent />
</HydrationBoundary>
```

---

## Comparativa con otras soluciones

| Feature             | React Query | SWR         | Redux RTK Query |
| ------------------- | ----------- | ----------- | --------------- |
| Cache infinito      | ✅          | ⚠️ Manual   | ✅              |
| Polling condicional | ✅          | ✅          | ✅              |
| SSR Next.js 16      | ✅          | ⚠️ Limitado | ✅              |
| Type-safety         | ✅          | ✅          | ✅              |
| Bundle size         | 13kb        | 4kb         | 45kb            |
| Cancelación         | ✅          | ❌          | ✅              |
| DevTools            | ✅          | ❌          | ✅              |

**Veredicto:** React Query ofrece el mejor equilibrio entre features y simplicidad para Tamborradata.

---

## Referencias

- [React Query Docs](https://tanstack.com/query/latest)
- [SSR con Next.js](https://tanstack.com/query/latest/docs/framework/react/guides/ssr)
- [Advanced Patterns](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

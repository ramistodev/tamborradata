# Data fetching - Server Components, caché y React Query

Cómo obtiene datos el frontend de Tamborradata: **casi todo se resuelve en el servidor** (Server Components + caché de Next.js) y **React Query solo se usa para dos interacciones del cliente** (paginar rankings y buscar participantes).

---

## 📋 Índice

- [Resumen rápido](#resumen-rápido)
- [Capa de servicios del servidor](#capa-de-servicios-del-servidor)
- [Datos por página](#datos-por-página)
- [Estrategia de caché](#estrategia-de-caché)
- [Manejo de errores](#manejo-de-errores)
- [React Query en el cliente](#react-query-en-el-cliente)
- [Qué no hace este proyecto](#qué-no-hace-este-proyecto)
- [Cómo añadir un nuevo dato](#cómo-añadir-un-nuevo-dato)

---

## Resumen rápido

| Necesidad                                  | Mecanismo                                    | Dónde vive                                   |
| ------------------------------------------ | -------------------------------------------- | -------------------------------------------- |
| Datos de una página (landing, estadísticas, buscador) | Server Component + servicio con caché | `app/(frontend)/[locale]/services/`          |
| Metadatos SEO y JSON-LD                    | Los mismos servicios (sin doble fetch)       | `generateMetadata` de cada `page.tsx`        |
| "Cargar más" en un ranking                 | `useInfiniteQuery` contra la API             | `hooks/query/useCategoryQuery.ts`            |
| Búsqueda de participantes                  | `useQuery` contra la API (`POST`)            | `hooks/query/useParticipantsQuery.ts`        |

Los Server Components **no hacen `fetch` a `/api/*`**: importan directamente el servicio del backend (`app/(backend)/api/*/service`). Los endpoints HTTP existen para los dos casos de cliente anteriores y para consumidores externos. Ver [api.md](./api.md).

---

## Capa de servicios del servidor

Cada archivo de `app/(frontend)/[locale]/services/` (`getOverview`, `getPeriods`, `getSchools`, `getStatistics`) sigue el mismo patrón de dos capas:

```typescript
// services/getPeriods.ts
const getCachedPeriods = cacheAcrossRequests(periodService, ['periods'], {
  revalidate: 3600,
  tags: ['periods'],
});

// cache() dedupes calls within one request; cacheAcrossRequests persists across requests (not in dev).
export const getPeriods = cache(async (): Promise<PeriodResponse[]> => {
  try {
    return (await getCachedPeriods()).sort((a, b) => b.periodKey.localeCompare(a.periodKey));
  } catch (error) {
    return handleServiceError(error);
  }
});
```

| Capa                  | Herramienta                     | Alcance                                            |
| --------------------- | ------------------------------- | -------------------------------------------------- |
| Entre peticiones      | `unstable_cache` (vía `cacheAcrossRequests`) | Persiste y se revalida cada 3600 s       |
| Dentro de una petición | `cache` de React               | `generateMetadata`, layout y página comparten la llamada |

Gracias a `cache()`, `generateMetadata`, el layout y la página pueden pedir lo mismo sin repetir trabajo (los `page.tsx` lo indican con el comentario "The same cached calls the page makes").

### `cacheAcrossRequests`

Envoltorio de `unstable_cache` que **se desactiva en desarrollo** (`isDev`), para que una entrada antigua en disco nunca oculte lo que devuelve el backend tras un cambio de forma de la respuesta. Ver `lib/cacheAcrossRequests.ts`.

---

## Datos por página

| Ruta                        | Datos (servidor)                                                        | Fallo                                           |
| --------------------------- | ----------------------------------------------------------------------- | ----------------------------------------------- |
| Layout `[locale]`           | `getOverview('global', true)` para JSON-LD y metadatos base             | `null`: el layout sigue renderizando            |
| `/` (landing)               | `getOverview('both', true)`                                             | `null`: textos de respaldo (`descriptionFallback`) |
| `/statistics`               | `getPeriods()`; redirige al periodo `kind === 'global'`                 | Sin periodo global: `notFound()`                |
| `/statistics/[period]`      | `getStatistics(period, locale)` + `getPeriods()`                        | 404 o redirección permanente (ver abajo)        |
| `/search-participants`      | `getSchools('', true)` + `getOverview('global', true)` en paralelo      | `null`: se muestra `SchoolsUnavailable`         |

Detalles verificados:

- El parámetro `nullable` (`getOverview`, `getSchools`) convierte el error en `null` en lugar de lanzar. `null` significa "no se pudo cargar"; una lista vacía significa "no hay colegios".
- `/statistics/[period]` pasa `stats` y `periods` como props a `PageContent`; no hay estado de servidor en el cliente para esta página.
- `/statistics` usa `redirect` de `i18n/navigation`, por lo que respeta el prefijo de idioma.
- La landing recibe `overview` como prop y `useOverviewMetric` solo anima los contadores en el cliente (no hace fetch).

---

## Estrategia de caché

### Servidor (páginas)

- `revalidate: 3600` (1 hora) en los cuatro servicios, con las etiquetas `overview`, `periods`, `schools` y `statistics`.
- No hay `revalidateTag` ni `revalidatePath` en el código: la renovación es **solo por tiempo**.
- `generateStaticParams` solo está definido en `[locale]/layout.tsx` (uno por idioma).

### API HTTP (`app/(backend)/lib/cache.ts`)

Las rutas de estadísticas fijan su `Cache-Control`:

| Endpoint                                   | Cabecera                                                                |
| ------------------------------------------ | ----------------------------------------------------------------------- |
| `statistics` (preview) y `summaries`       | `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`           |
| `categories/[category]` sin `cursor` ni `limit` | igual que la anterior                                              |
| `categories/[category]` con `cursor` o `limit`  | `no-store`                                                         |

El resto de respuestas JSON usan `no-store` por defecto (`lib/response.ts`).

---

## Manejo de errores

`lib/handleServiceError.ts` traduce errores de dominio del backend:

```typescript
export function handleServiceError(error: unknown): never {
  if (error instanceof NotFoundError || error instanceof ValidationError) notFound();
  throw error;
}
```

- `NotFoundError` y `ValidationError` se convierten en el 404 del sitio (`app/not-found.tsx`).
- Cualquier otro error sube al error boundary (`(pages)/error.tsx`).
- En `getStatistics`, un `PeriodMovedError` produce `permanentRedirect` a `/statistics/{slug}` en el idioma actual.

---

## React Query en el cliente

**Sigue en uso** (`@tanstack/react-query` y `-devtools` 5.104.1 en `package.json`), pero acotado a dos hooks en `app/(frontend)/[locale]/hooks/query/`.

### Proveedor

`providers/ReactQueryProvider.tsx` envuelve `LayoutContent` dentro de `NextIntlClientProvider` (ver `layout.tsx`) e incluye `ReactQueryDevtools`.

```typescript
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
    mutations: { retry: 0 },
  },
});
```

Los dos hooks sobrescriben `staleTime`, `gcTime` y `retry`, así que estos valores solo actúan como red de seguridad para futuras queries.

### `useCategoryQuery` (rankings paginados)

La primera página de cada ranking llega **renderizada desde el servidor** dentro de `getStatistics`, con un `pageInfo.nextCursor`. El cliente solo pide las páginas siguientes:

```typescript
return useInfiniteQuery({
  queryKey: queryKeys.category(category, period, limit),
  queryFn: ({ pageParam, signal }) =>
    fetchCategory({ period, category, cursor: pageParam, limit, signal }),
  initialPageParam: initialCursor,
  getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor ?? undefined,
  enabled: enabled && Boolean(category) && Boolean(period),
  staleTime: Infinity,
  gcTime: Infinity,
  retry: 0,
  refetchOnWindowFocus: false,
});
```

`useRank` lo usa con `enabled: false` (no pide nada hasta pulsar "ver más"), `limit: RANK_PAGE_SIZE` (10) y un máximo de `MAX_EXTRA_ROWS` (40) filas extra. Las filas del servidor y las pedidas se concatenan; contraer no refetch-ea porque las páginas siguen en caché.

`fetchCategory` (`GET /api/statistics/[period]/categories/[category]`) aborta a los 10 s (`CATEGORY_REQUEST_TIMEOUT_MS`) combinando la señal de React Query con `AbortSignal.timeout`.

### `useParticipantsQuery` (búsqueda)

```typescript
useQuery({
  queryKey: queryKeys.participants(participant, schoolKey),
  queryFn: ({ signal }) => fetchParticipants({ participant, schoolKey, signal }),
  enabled: Boolean(participant) && Boolean(schoolKey),
  staleTime: Infinity,
  gcTime: Infinity,
  retry: 0,
  refetchOnWindowFocus: false,
});
```

- Se mantiene inactiva (cadenas vacías) hasta que `useSearchForm` guarda la búsqueda enviada.
- `fetchParticipants` hace `POST /api/participants`. Un `429` lanza `RateLimitedError(retryAfterSeconds)` a partir de la cabecera `Retry-After` (60 s si falta o no es válida); `useSearchForm` expone ese valor para la cuenta atrás.
- `refetch` se usa para reintentar tras un error.

### Query keys

`lib/queryKeys.ts` define solo las dos claves en uso:

```typescript
export const queryKeys = {
  participants: (participant: string, schoolKey: string) =>
    ['participants', participant, schoolKey] as const,
  category: (category: StatisticCategories, period: string, limit?: number) =>
    ['category', category, period, limit] as const,
};
```

---

## Qué no hace este proyecto

Para evitar confusiones con la documentación anterior:

- **No hay prefetch ni hidratación con React Query**: no se usa `HydrationBoundary`, `dehydrate` ni `prefetchQuery`. El SSR lo resuelven los Server Components y pasan los datos por props.
- **No hay polling de `isUpdating`**: no existe `isUpdating` ni `refetchInterval` en `app/`. Los hooks `useStatisticsQuery` y `useYearsQuery` de la documentación anterior ya no existen. Para el concepto de actualización anual, ver [publishing.md](./publishing.md).
- **No hay `useStatisticsQuery`, `useYearsQuery`** ni claves `statistics`/`years`/`companies`.

---

## Cómo añadir un nuevo dato

1. **¿Lo necesita una página al renderizar?** Crea `services/getX.ts` replicando el patrón `cacheAcrossRequests` + `cache` + `handleServiceError`, e invócalo desde el Server Component y desde `generateMetadata`.
2. **¿Lo dispara el usuario tras la carga?** Añade un `fetchX` en `services/`, una entrada en `queryKeys` y un hook en `hooks/query/` con `signal` para cancelación.
3. Si la respuesta puede fallar, decide entre `nullable` (degradar la UI) o dejar que `handleServiceError` lance 404/error.

Véase también: [api.md](./api.md), [seo.md](./seo.md), [design-decisions.md](./design-decisions.md), [i18n.md](./i18n.md).

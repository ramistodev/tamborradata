# Actualización Anual de Datos (antes: sistema isUpdating)

Esta documentación explica **cómo llegan los datos nuevos a Tamborradata cada enero** y qué hace la web mientras tanto.

> **Cambio en la v2:** el sistema `isUpdating` (tabla `sys_status`, `getSysStatus()` y polling en el frontend) **ya no existe en el código**. Se eliminó con el nuevo backend. Este documento describe el mecanismo actual y sustituye al antiguo `isUpdating.md`.

---

## 📋 Índice

- [Resumen](#resumen)
- [Qué cambió respecto a isUpdating](#qué-cambió-respecto-a-isupdating)
- [Publicación de datos](#publicación-de-datos)
- [Qué lee la web](#qué-lee-la-web)
- [Cache durante la actualización](#cache-durante-la-actualización)
- [Rate limit estacional](#rate-limit-estacional)
- [Casos edge](#casos-edge)
- [Qué no está documentado aquí](#qué-no-está-documentado-aquí)

---

## Resumen

| Aspecto                  | Comportamiento actual                                                       |
| ------------------------ | --------------------------------------------------------------------------- |
| Quién genera los datos   | Un **pipeline privado** (repositorio aparte, ver [CONTRIBUTING](../CONTRIBUTING.md)) |
| Cómo se "activa" un año  | Un periodo solo es visible cuando tiene un run publicado (`published_run_id`) |
| Aviso de "actualizando"  | **No existe**: la web no muestra banner ni hace polling                     |
| Cuándo se ven los datos  | Al caducar la cache (hasta 1 hora) tras la publicación                      |
| Límite de peticiones     | Más permisivo entre el 17 y el 24 de enero (ver [Rate limit](#rate-limit-estacional)) |

---

## Qué cambió respecto a isUpdating

| Antes (v1)                                                   | Ahora (v2)                                                              |
| ------------------------------------------------------------ | ----------------------------------------------------------------------- |
| Tabla `sys_status` con `is_updating`                         | No se consulta ninguna tabla de estado                                  |
| `getSysStatus()` en `app/(backend)/shared/utils`             | Eliminado (`app/(backend)/shared` ya no existe)                         |
| La API devolvía `{ isUpdating: true }` durante la carga      | La API solo devuelve periodos publicados, o `404` si no existen         |
| Polling cada 3 s con React Query                             | Sin polling: React Query solo se usa para paginación y búsqueda ([data-fetching](./data-fetching.md)) |

Puedes comprobarlo: `rg "sys_status|isUpdating|getSysStatus" app` no devuelve resultados.

---

## Publicación de datos

El backend **solo lee** datos ya publicados. La forma en que se ven en la web se decide con dos columnas de la tabla `stats_periods`:

| Columna            | Quién la usa                                                                 |
| ------------------ | ---------------------------------------------------------------------------- |
| `published_run_id` | `GET /api/overview` y `GET /api/statistics`: solo periodos con valor no nulo |
| `is_ready`         | `GET /api/period`: solo periodos con `is_ready = true`                       |

Ejemplo real, el filtro de un periodo publicado:

```typescript
// app/(backend)/api/statistics/repo/period.repo.ts
const { data: period, error: periodError } = await supabaseClient
  .from(tables.statsPeriods)
  .select('id, published_run_id, kind, public_slug, last_published_at, updated_at')
  .eq('public_slug', publicSlug)
  .not('published_run_id', 'is', null)
  .single();
```

Si el slug no existe o no tiene run publicado, el repository lanza `NotFoundError` y la ruta responde `404` (ver [API](./api.md)).

### Slugs movidos

Si un periodo cambia de slug, la tabla `stats_period_slug_aliases` guarda el slug antiguo. Al pedirlo, el repository lanza `PeriodMovedError` y el frontend responde con un **redirect permanente** al slug nuevo (`getStatistics` en `app/(frontend)/[locale]/services/getStatistics.ts`).

---

## Qué lee la web

Las páginas de servidor leen los datos con servicios cacheados, sin pasar por HTTP:

| Servicio frontend | Servicio backend      | Cache (`revalidate`) | Tag          |
| ----------------- | --------------------- | -------------------- | ------------ |
| `getStatistics`   | `statisticsService`   | 3600 s               | `statistics` |
| `getPeriods`      | `periodService`       | 3600 s               | `periods`    |
| `getOverview`     | `overviewService`     | 3600 s               | `overview`   |
| `getSchools`      | `schoolsService`      | 3600 s               | `schools`    |

Ubicación: `app/(frontend)/[locale]/services/`.

---

## Cache durante la actualización

Hay dos capas, ambas de **1 hora**:

1. **`unstable_cache`** (`cacheAcrossRequests`, con `revalidate: 3600`): cache del servidor para las páginas. En desarrollo se desactiva.
2. **`Cache-Control`** de las rutas API (`app/(backend)/lib/cache.ts`): `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`. Las peticiones de categoría con `cursor` o `limit` usan `no-store`.

**Consecuencia:** tras publicar un periodo nuevo, los datos pueden tardar **hasta una hora** en verse, porque el código no invalida los tags (no hay llamadas a `revalidateTag` ni `revalidatePath`). Mientras tanto se siguen sirviendo los datos anteriores.

---

## Rate limit estacional

La búsqueda de participantes (`POST /api/participants`) tiene un límite por IP que cambia alrededor de la Tamborrada (20 de enero). Config en `app/(backend)/lib/ratelimit/config.ts`:

| Periodo                          | Máximo | Ventana    |
| -------------------------------- | ------ | ---------- |
| Por defecto                      | 30     | 40 minutos |
| Del 17 al 24 de enero (Madrid)   | 30     | 60 segundos |

Las fechas se evalúan en la zona horaria `Europe/Madrid` y se repiten cada año. En desarrollo el límite está desactivado. Más detalle en [API](./api.md).

---

## Casos edge

| Situación                                            | Resultado                                                                                   |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Aún no hay periodo publicado para un año             | `404` en la API; en las páginas, `notFound()` (`handleServiceError`)                        |
| Falta una estadística obligatoria en un periodo      | `ServerError` (500) con el detalle en logs (p. ej. en `overviewService`)                    |
| Un run publicado conserva una categoría ya eliminada | `statisticsService` la ignora en vez de romper la página                                    |
| Slug antiguo de un periodo                           | Redirect permanente al slug vigente                                                         |

---

## Qué no está documentado aquí

El código de este repositorio **no contiene** el pipeline ni el esquema SQL completo, así que no se puede verificar desde aquí:

- Cómo y cuándo se ejecuta el pipeline (frecuencia, trigger, tecnologías).
- Cómo se establece `published_run_id` / `is_ready` en cada publicación.
- Las políticas RLS de las tablas.

Para el contexto del pipeline privado, ver [CONTRIBUTING](../CONTRIBUTING.md#-sobre-el-pipeline-privado) y [SECURITY](../SECURITY.md).

---

## Referencias

- [API](./api.md)
- [Data fetching](./data-fetching.md)
- [Decisiones de diseño](./design-decisions.md)
- [Next.js: caching](https://nextjs.org/docs/app/building-your-application/caching)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

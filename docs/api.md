# Referencia de la API

Esta documentación describe los **endpoints REST internos** de Tamborradata, definidos en `app/(backend)/api`. Los consume el propio frontend; no son una API pública con garantías de estabilidad.

Todas las respuestas son JSON. Los tipos de respuesta viven en `app/types/api/`.

---

## 📋 Índice

- [Resumen](#-resumen)
- [Convenciones comunes](#-convenciones-comunes)
- [GET /api/overview](#get-apioverview)
- [GET /api/period](#get-apiperiod)
- [GET /api/statistics](#get-apistatistics)
- [GET /api/statistics/[period]/summaries](#get-apistatisticsperiodsummaries)
- [GET /api/statistics/[period]/categories/[category]](#get-apistatisticsperiodcategoriescategory)
- [GET /api/schools](#get-apischools)
- [POST /api/participants](#post-apiparticipants)
- [GET /api/ping](#get-apiping)
- [Errores](#-errores)

---

## 🗺️ Resumen

| Endpoint                                              | Descripción                                          | Caché de CDN            |
| ----------------------------------------------------- | ---------------------------------------------------- | ----------------------- |
| `GET /api/overview`                                   | Cifras clave del periodo global y del último año     | No                      |
| `GET /api/period`                                     | Periodos listos para consultar                       | No                      |
| `GET /api/statistics`                                 | Estadísticas de un periodo (vista previa)            | 1 h                     |
| `GET /api/statistics/[period]/summaries`              | Resúmenes editoriales de un periodo                  | 1 h                     |
| `GET /api/statistics/[period]/categories/[category]`  | Detalle paginado de una categoría                    | 1 h (sin paginar)       |
| `GET /api/schools`                                    | Colegios, con filtro opcional por nombre             | No                      |
| `POST /api/participants`                              | Búsqueda de un participante                          | No                      |
| `GET /api/ping`                                       | Comprobación de que la API responde                  | No                      |

---

## 🔧 Convenciones comunes

| Tema            | Comportamiento                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Formato         | `Content-Type: application/json` en todas las respuestas.                                                                                       |
| `locale`        | Uno de `es`, `en`, `eu` (`app/types/locale.ts`).                                                                                                |
| `publicSlug`    | Identificador público de un periodo. Debe cumplir `^[\w-]{1,64}$`. El tipo de periodo (`kind`) es `year` o `global` (`app/types/period.types.ts`). |
| Caché           | Las respuestas con caché usan `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`. Las respuestas de error llevan `Cache-Control: no-store`. |
| Acceso en producción | `proxy.ts` responde `403 Forbidden` a cualquier petición a `/api` cuya cabecera `Accept` contenga `text/html` (es decir, a la navegación directa desde el navegador). En desarrollo no se aplica. |

---

## GET /api/overview

Devuelve las cifras clave que usan la landing y la búsqueda: el periodo global y/o el último año publicado.

**Query params**

| Param   | Obligatorio | Valores                    | Por defecto |
| ------- | ----------- | -------------------------- | ----------- |
| `scope` | No          | `both`, `global`, `last`   | `both`      |

**Respuesta `200`** (`OverviewResponse`). Cada clave está presente solo si el `scope` la incluye.

```ts
{
  globalPeriod?: {
    publicSlug: string;
    startYear: number;
    endYear: number;
    totalParticipations: number;
    totalSchools: number;
    editionsCount: number;
    missingYears: number[];      // años del rango sin periodo publicado
    lastPublishedAt: string;
    topName: { label: string; count: number };
    topSurname: { label: string; count: number };
    topSchool: { label: string; count: number };
  };
  lastPeriod?: {
    publicSlug: string;
    year: number;
    totalParticipations: number;
    totalSchools: number;
    growthRate: number | null;   // null si no hay edición anterior con la que comparar
    lastPublishedAt: string;
    topName: { label: string; count: number };
    topSurname: { label: string; count: number };
    topSchool: { label: string; count: number };
  };
}
```

**Errores**: `400` si `scope` no es válido; `404` si no hay periodo global o ningún periodo anual publicado (según el `scope`); `500` si faltan datos esperados en un periodo.

**Caché**: la respuesta no define `Cache-Control`.

---

## GET /api/period

Lista los periodos marcados como listos (`is_ready`) y con un run publicado (`published_run_id` no nulo), ordenados por `public_slug` descendente. No recibe parámetros.

**Respuesta `200`** (`PeriodResponse[]`)

```ts
{
  periodKey: string;
  publicSlug: string;
  kind: 'year' | 'global';
  lastPublishedAt: string | null;
}[]
```

**Errores**: `500` si falla la consulta. **Caché**: la respuesta no define `Cache-Control`.

---

## GET /api/statistics

Devuelve las estadísticas de un periodo en formato de **vista previa**: la base de datos conserva todo el histórico, pero esta respuesta limita rankings y series (10 posiciones, entidades, periodos, colegios y grupos; ver `statistics/lib/preview.ts`). El resto se pide con el endpoint de detalle de categoría.

**Query params**

| Param        | Obligatorio | Descripción                          |
| ------------ | ----------- | ------------------------------------ |
| `publicSlug` | Sí          | Slug público del periodo.            |
| `locale`     | Sí          | `es`, `en` o `eu`.                   |

**Respuesta `200`** (`StatisticsResponse`)

```ts
{
  metaData: { period: string; periodKind: 'year' | 'global'; publishedAt: string; updatedAt: string };
  overview: OverviewStatistic[];   // métricas destacadas del periodo
  intro: { section; summary: string };
  families: {
    family: CategoryFamilies;
    template: { section; summary: string };   // summary vacío si aún no hay resumen publicado
    categories: StatisticCategory[];
  }[];
  outro: { section; summary: string };
}
```

Cada `StatisticCategory` incluye `category`, `rendererKey`, `dataShape` y `data`. La forma de `data` depende de `dataShape`:

| `dataShape` | `data`                   | Extra                       |
| ----------- | ------------------------ | --------------------------- |
| `values`    | `StatisticValue[]`       | n/a                         |
| `ranks`     | `StatisticRank[]`        | `pageInfo: { nextCursor }`  |
| `series`    | `StatisticSeriesPoint[]` | n/a                         |

Los resúmenes (`intro`, `outro`, `template`) pueden llegar vacíos mientras no estén publicados. Las categorías desconocidas que aún conserve un periodo publicado se omiten.

**Errores**: `400` si falta o es inválido `publicSlug` o `locale`; `404` si el periodo no existe o no está publicado (ver [`PeriodMovedError`](#-errores)); `500` ante errores internos.

**Caché**: `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`.

---

## GET /api/statistics/[period]/summaries

Devuelve solo los resúmenes editoriales de un periodo en un idioma.

**Path params**: `period` (slug público).
**Query params**: `locale` (obligatorio: `es`, `eu` o `en`).

**Respuesta `200`** (`SummariesResponse`)

```ts
{
  metaData: PeriodData;
  locale: 'es' | 'en' | 'eu';
  summaries: { section: EditorialSections; summary: string }[];
}
```

**Errores**: `400` (slug o `locale` inválido), `404` (periodo no publicado), `500`.
**Caché**: `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`.

---

## GET /api/statistics/[period]/categories/[category]

Devuelve el detalle de **una categoría** de un periodo. Para rankings y series, los datos se paginan con cursor.

**Path params**

| Param      | Descripción                                                              |
| ---------- | ------------------------------------------------------------------------ |
| `period`   | Slug público del periodo.                                                |
| `category` | Una categoría conocida (valores de `statisticCategories` en `app/types/statistics/category.types.ts`, por ejemplo `topNames`, `topSurnames`, `topSchools`, `totalParticipants`). |

**Query params**

| Param    | Obligatorio | Descripción                                                                                  |
| -------- | ----------- | -------------------------------------------------------------------------------------------- |
| `limit`  | No          | Entero >= 1. Por defecto `25`; el máximo es `100` (valores mayores se recortan a `100`).      |
| `cursor` | No          | Token opaco (`pageInfo.nextCursor`) de una página anterior. Solo vale para esa categoría.     |

**Respuesta `200`** (`CategoryDetailResponse`)

```ts
{
  category: StatisticCategories;
  rendererKey: CategoryRendererKey;
  dataShape: 'values' | 'ranks' | 'series';
  data: StatisticValue[] | StatisticRank[] | StatisticSeriesPoint[];
  pageInfo: { nextCursor: string | null };   // null: ya se entregó la última página
}
```

Las categorías de forma `values` se devuelven completas y con `nextCursor: null`.

**Errores**: `400` si `category` es desconocida, `limit` no es un entero >= 1, o `cursor` no es válido o no corresponde a esa categoría; `404` si el periodo o la categoría no están publicados; `500`.

**Caché**: sin `limit` ni `cursor`, `public, max-age=0, s-maxage=3600, stale-while-revalidate=60`; si la petición incluye cualquiera de los dos, `no-store`.

---

## GET /api/schools

Lista los colegios ordenados por nombre canónico. Sin paginación.

**Query params**

| Param   | Obligatorio | Descripción                                                                                  |
| ------- | ----------- | -------------------------------------------------------------------------------------------- |
| `query` | No          | Filtra por nombre (`ilike %query%`). Se recorta (`trim`); si queda vacío no filtra. Máximo 100 caracteres. |

**Respuesta `200`** (`SchoolListResult[]`)

```ts
{ school: string; schoolKey: string }[]
```

**Errores**: `400` si `query` supera los 100 caracteres; `500` si falla la consulta. **Caché**: la respuesta no define `Cache-Control`.

---

## POST /api/participants

Busca un participante por nombre completo dentro de un colegio. Usa `POST` para que el nombre no viaje en la URL. La coincidencia ignora tildes y mayúsculas.

**Body (JSON)**

| Campo         | Tipo     | Reglas                                                                                          |
| ------------- | -------- | ----------------------------------------------------------------------------------------------- |
| `participant` | `string` | Obligatorio. Máximo 120 caracteres (`MAX_PARTICIPANT_LENGTH`). Mínimo 3 palabras (`MIN_PARTICIPANT_WORDS`). |
| `schoolKey`   | `string` | Obligatorio. Clave del colegio (`schoolKey` de `/api/schools`). No puede quedar vacío tras `trim`. |

**Respuesta `200`** (`ParticipantsResponse[]`)

```ts
{
  matchType: 'exact' | 'compatible';   // las coincidencias 'incompatible' se descartan
  name: string;
  nameKey: string;
  school: { canonicalName: string; schoolKey: string };
  participations: { url: string | null; year: number }[];
}[]
```

Sin coincidencias, la respuesta es `200` con `[]` (no es un error).

**Límite de peticiones** (por IP, usando `x-forwarded-for`, guardada solo como hash HMAC):

| Periodo                              | Máximo        | Ventana    |
| ------------------------------------ | ------------- | ---------- |
| Resto del año                        | 30 peticiones | 40 minutos |
| Del 17 al 24 de enero (Europe/Madrid) | 30 peticiones | 60 segundos |

Al superarlo responde `429` con la cabecera `Retry-After` (segundos). El límite no se aplica en desarrollo, y tampoco si la petición llega sin `x-forwarded-for` (se registra un error). El contador vive en la memoria de cada instancia del servidor.

**Errores**: `400` (cuerpo no es JSON o no es un objeto, campos que no son `string`, vacíos, demasiado largos o con menos de 3 palabras); `429`; `500`.

**Caché**: no.

---

## GET /api/ping

Comprobación de salud. No recibe parámetros ni accede a la base de datos.

**Respuesta `200`**

```json
{ "ok": true, "message": "Tamborradata API funcionando 🎉" }
```

---

## ⚠️ Errores

Los handlers capturan las excepciones con `handleError` (`app/(backend)/lib/response.ts`) y las traducen según la jerarquía de `app/(backend)/lib/errors.ts`.

**Forma de la respuesta de error**

```json
{ "error": "<mensaje>" }
```

En desarrollo, `error` contiene el mensaje real. En producción, un texto genérico (ver tabla).

| Clase                | Status | Mensaje en producción     | Uso                                                            |
| -------------------- | ------ | ------------------------- | -------------------------------------------------------------- |
| `ValidationError`    | `400`  | `Invalid request`         | Parámetros o cuerpo inválidos.                                 |
| `UnauthorizedError`  | `401`  | `Unauthorized`            | Definido en la jerarquía.                                      |
| `ForbiddenError`     | `403`  | `Forbidden`               | Definido en la jerarquía.                                      |
| `NotFoundError`      | `404`  | `Not found`               | Periodo, categoría o datos no publicados.                      |
| `PeriodMovedError`   | `404`  | `Not found`               | El slug solicitado es un alias de otro periodo (lleva `slug`). |
| `ConflictError`      | `409`  | `Conflict`                | Definido en la jerarquía.                                      |
| `RateLimitError`     | `429`  | `Too many requests`       | Incluye la cabecera `Retry-After`.                             |
| `ServerError`        | `500`  | `Internal server error`   | Fallos esperados del servidor (datos incoherentes, consulta).  |
| Cualquier otro error | `500`  | `Internal server error`   | Se registra con el logger y se oculta el detalle.              |

> [!NOTE]
> `PeriodMovedError` se resuelve como `404` en la API; el slug nuevo está en el mensaje solo en desarrollo. Las clases `UnauthorizedError`, `ForbiddenError` y `ConflictError` existen y tienen mapeo, pero ningún endpoint actual las lanza.

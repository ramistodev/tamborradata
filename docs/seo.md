# SEO Técnico - Optimización para Buscadores

Esta documentación describe cómo Tamborradata genera su metadata, sus datos estructurados, el sitemap y el `robots.txt`. Todo lo que aparece aquí corresponde al código actual; las rutas de archivo se indican en cada sección.

---

## 📋 Índice

- [Resumen rápido](#resumen-rápido)
- [Metadata](#metadata)
- [Fechas de contenido](#fechas-de-contenido)
- [Idiomas, canonical y alternates](#idiomas-canonical-y-alternates)
- [Structured Data (Schema.org)](#structured-data-schemaorg)
- [Sitemap y Robots.txt](#sitemap-y-robotstxt)
- [Open Graph y Twitter Cards](#open-graph-y-twitter-cards)
- [Iconos y manifest](#iconos-y-manifest)
- [Política de privacidad](#política-de-privacidad)
- [Referencias](#referencias)

---

## Resumen rápido

| Aspecto            | Cómo se resuelve                                                                              |
| ------------------ | --------------------------------------------------------------------------------------------- |
| Metadata           | Next.js Metadata API (`generateMetadata`), heredada del layout raíz y sobrescrita por página   |
| Datos estructurados | JSON-LD (`@graph`) renderizado en el servidor                                                |
| Años y cifras      | Salen de los datos publicados (periodos y _overview_), nunca de textos fijos                  |
| Fechas             | Una sola fuente (`contentDates.ts` y fechas del periodo) para JSON-LD y sitemap               |
| Idiomas            | `es` (sin prefijo), `en` y `eu` (con prefijo), con `hreflang` y `x-default`                   |
| Dominio            | `siteUrl` en `config/constants.ts`: cambiarlo ahí cambia todas las URLs absolutas             |

---

## Metadata

### **Metadata heredada del layout raíz**

`app/(frontend)/[locale]/layout.tsx` define en `generateMetadata` lo que toda página hereda:

- `metadataBase` (a partir de `siteUrl`), para poder usar URLs relativas
- `title` y `description` por defecto (traducciones `Site`). La descripción incluye el año de inicio del periodo global; sin datos usa un texto que no menciona años
- `applicationName`, `manifest` e `icons` (ver [Iconos y manifest](#iconos-y-manifest))
- `robots` por defecto (`index: true`, `follow: true`)
- `openGraph` y `twitter` por defecto, incluida la imagen compartida
- `viewport.themeColor` según el esquema de color claro u oscuro

Cada página sobrescribe solo lo que declara. Las páginas no repiten `metadataBase`.

### **Metadata por página**

| Página                       | Archivo                                                   | Title y description                                                                                      |
| ---------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Landing `/`                  | `(landing)/page.tsx`                                      | Dinámicos: `buildLandingTexts` inserta el rango de años publicado (con texto de respaldo si no hay datos) |
| Buscador `/search-participants` | `(pages)/search-participants/page.tsx`                 | Dinámicos: `buildSearchTexts` con el rango del periodo global                                             |
| Periodo `/statistics/[period]` | `(pages)/statistics/[period]/page.tsx`                  | Dinámicos: `buildPeriodTexts` incluye cifras reales (participantes, nombres más comunes) cuando hay datos |
| Privacidad `/privacy-policy` | `(pages)/privacy-policy/page.tsx`                         | Traducción `PrivacyPolicy.metadata` + ` \| Tamborradata`                                                  |

Notas:

- `/statistics` no tiene contenido propio: redirige al periodo global (`getPeriods`), cuyo slug cambia cada año.
- La landing añade `keywords` (traducción `Landing.metadata.keywords`), `category` y directivas `googleBot` ampliadas (`max-image-preview: large`, `max-snippet: -1`, `max-video-preview: -1`). Lo mismo hacen el buscador y la política de privacidad.
- Las páginas de periodo heredan el `robots` del layout raíz.
- Los textos de la landing, el buscador y los periodos se comparten entre la metadata y el JSON-LD (`buildLandingTexts`, `buildSearchTexts`, `buildPeriodTexts`), de modo que lo que lee Google es lo mismo en ambos sitios.
- Las llamadas a datos de `generateMetadata` y de la página usan las mismas funciones cacheadas (`getOverview`, `getPeriods`, `getStatistics`), por lo que no se repiten peticiones.

---

## Fechas de contenido

`app/(frontend)/[locale]/config/contentDates.ts` concentra las fechas que el sitio comunica a los buscadores:

| Constante / helper | Significado                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| `SITE_PUBLISHED`   | Primera versión pública del sitio                                                                 |
| `PAGES_UPDATED`    | Último cambio de diseño o contenido de la landing y el buscador. Se actualiza a mano al cambiarlos |
| `latestDate(...)`  | Devuelve la fecha más reciente de una lista, ignorando las vacías                                 |

Cómo se usan:

- **Landing:** `dateModified` = la más reciente entre `PAGES_UPDATED` y `lastPublishedAt` del periodo global.
- **Buscador:** `dateModified` = `lastPublishedAt` del periodo global; `datePublished` es una constante fija de la propia página.
- **Periodos:** `datePublished` y `dateModified` salen de `metaData.publishedAt` y `metaData.updatedAt`, y se reutilizan en `openGraph.publishedTime` y `modifiedTime`.
- **Política de privacidad:** `PRIVACY_POLICY_PUBLISHED` y `PRIVACY_POLICY_UPDATED` (`privacy-policy/data/constants.ts`), los mismos que muestra la línea visible de "actualizado el".
- **Sitemap:** usa las mismas fuentes como `lastModified`.

Si una fecha no se conoce, se omite: una fecha inventada es peor que ninguna.

---

## Idiomas, canonical y alternates

El routing (`app/(frontend)/i18n/routing.ts`) define `es` (idioma por defecto), `en` y `eu`, con `localePrefix: 'as-needed'`: el español no lleva prefijo y los demás sí. `alternateLinks` está desactivado en next-intl porque los `alternates` los genera el propio proyecto.

`getAlternates(locale, href)` (`i18n/seo.ts`) devuelve para cada página:

- `canonical`: la URL absoluta de la página en el idioma actual
- `languages`: una URL por idioma (`es`, `eu`, `en`) más `x-default`, que apunta al idioma por defecto

Otras utilidades del mismo archivo:

- `getLanguageTag(locale)` → `es-ES`, `eu-ES`, `en-US` (para `inLanguage` en JSON-LD)
- `getOpenGraphLocales(locale)` → `og:locale` y `og:locale:alternate`

---

## Structured Data (Schema.org)

### **Cómo se renderiza**

`config/structured-data/JsonLd.tsx` emite un `<script type="application/ld+json">` normal, **renderizado en el servidor**. No se usa `next/script`, porque lo inyecta el cliente tras la carga y no estaría en el HTML que descarga un rastreador. Además se escapa `<` (`<`) para que ningún texto de los datos pueda cerrar la etiqueta.

Las propiedades que dependen del periodo publicado quedan `undefined` si no hay datos y `JSON.stringify` las omite, así que ninguna propiedad afirma un año inventado.

### **Entidades globales (layout raíz)**

`StructuredData.tsx` se incluye en el `<head>` del layout raíz y declara una sola vez:

- `Organization` (`@id`: `https://tamborradata.com#organization`) con `logo`, `image` y `sameAs` (X y GitHub)
- `WebSite` (`@id`: `https://tamborradata.com#website`) con `inLanguage`, `publisher` y descripción con el año de inicio cuando existe

El `WebSite` **no** incluye `SearchAction`. Las páginas referencian ambas entidades por `@id` en lugar de repetirlas.

### **Grafo por página**

Cada página emite un único `@graph` con nodos enlazados por `@id`:

| Página                  | Nodos del grafo                                                                              |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| Landing                 | `WebPage` + `CollectionPage`, `Dataset`, `BreadcrumbList`, `FAQPage` y `ItemList` de menciones de prensa |
| Buscador                | `WebPage`, `WebApplication`, `EventSeries`, `BreadcrumbList` y `FAQPage` (sin `Dataset`: los participantes solo se pueden buscar, no descargar) |
| Periodo anual           | `WebPage`, `BreadcrumbList`, `Dataset` y el `Event` de esa edición                           |
| Periodo global          | Igual que el anual, pero con un `EventSeries` en lugar de un `Event`                         |
| Política de privacidad  | `WebPage` y `BreadcrumbList`                                                                 |

Detalles verificados en el código:

- El `Dataset` de los periodos declara `license` (CC BY-SA 4.0), `temporalCoverage` y `variableMeasured`; solo se listan las variables que tienen valor.
- La `FAQPage` sale de las mismas funciones que la FAQ visible (`buildLandingFaqs`, `buildFaqs`).
- El `BreadcrumbList` de un periodo tiene tres niveles: inicio, estadísticas y el periodo.
- El `inLanguage` de cada nodo sigue el idioma de la página.

Para el detalle de cada grafo, consulta los componentes de `config/structured-data/` (`LandingStructuredData`, `SearchParticipantsStructuredData`, `PeriodStructuredData` y `period/`).

---

## Sitemap y Robots.txt

### **Sitemap dinámico**

`app/sitemap.ts` se construye a partir de los datos publicados, no de un rango de años fijo:

- Las páginas de estadísticas salen de `getPeriods()`: una edición nueva (o una antigua que aparezca después) entra sola en el sitemap.
- Cada URL se emite una vez por idioma, con `alternates.languages` (incluido `x-default`).
- `lastModified` es real:
  - Periodos → `lastPublishedAt` del periodo.
  - Landing y buscador → la más reciente entre `PAGES_UPDATED` y la última publicación del periodo global.
  - Política de privacidad → `PRIVACY_POLICY_UPDATED`.
  - Si la fecha no se conoce, se omite.

| Página                       | `changeFrequency` | `priority`                                      |
| ---------------------------- | ----------------- | ----------------------------------------------- |
| `/`                          | `monthly`         | 1.0                                             |
| `/search-participants`       | `monthly`         | 0.9                                             |
| `/statistics/[period]`       | `yearly`          | 0.9 (periodo global y año actual), 0.7 el resto |
| `/privacy-policy`            | `yearly`          | 0.4                                             |

Si la llamada a `getPeriods()` falla, el sitemap se genera sin páginas de periodo en lugar de romperse.

### **robots.txt**

Es un archivo estático en `public/robots.txt`:

```txt
User-agent: *
Allow: /

Disallow: /api/
Disallow: /_vercel/

# Bloqueados: AhrefsBot, MJ12bot, DotBot, SemrushBot, BLEXBot
User-agent: AhrefsBot
Disallow: /
# ... (un bloque por cada bot)

Sitemap: https://tamborradata.com/sitemap.xml
```

Criterios:

- Todos los bots pueden rastrear el sitio, salvo `/api/` (devuelve JSON para la propia web) y `/_vercel/` (analítica de Vercel).
- Los bots con bloque propio ignorarían el bloque `*`, por eso las reglas generales viven en `*` y los bloques con nombre existen solo para los bots rechazados (los que rastrean para herramientas SEO).
- No hay reglas específicas para crawlers de IA: se rigen por el bloque `*`.

---

## Open Graph y Twitter Cards

- El layout raíz declara `openGraph` y `twitter` por defecto; cada página define los suyos con su propio título y descripción.
- Todas las páginas comparten la misma imagen: `https://tamborradata.com/og-image.webp` (`ogImageUrl` en `config/constants.ts`), con `alt` igual al título de la página.
- Tipo de `og:type`: `website` para la landing y el buscador; `article` para los periodos y la política de privacidad (con `publishedTime` y `modifiedTime`).
- `og:locale` y `og:locale:alternate` salen de `getOpenGraphLocales` (`es_ES`, `eu_ES`, `en_US`).
- Twitter: `card: 'summary_large_image'`, `site` y `creator` = `@tamborradata`.

---

## Iconos y manifest

Se declaran una sola vez en el layout raíz y se sirven desde `public/`:

| Elemento                 | Archivos                                                             |
| ------------------------ | -------------------------------------------------------------------- |
| Favicon                  | `favicon.ico`, `favicon.svg`, `favicon-96x96.png`                    |
| Icono Apple              | `apple-touch-icon.png` (180x180)                                     |
| Web app manifest         | `site.webmanifest` (iconos de 192 y 512 px, `any` y `maskable`)      |
| Imagen para compartir    | `og-image.webp`                                                      |
| Logo (JSON-LD)           | `logo-512x512.png`                                                   |

`themeColor` se define en `viewport` y sigue el fondo de cada tema (claro `#f6f8fc`, oscuro `#060912`).

---

## Política de privacidad

La página `/privacy-policy` está indexable y sigue el mismo patrón que el resto: metadata propia, `alternates` por idioma, Open Graph de tipo `article` y un grafo JSON-LD (`PolicyPrivacyStructuredData`) con `WebPage` y `BreadcrumbList`. Está incluida en el sitemap y enlazada desde el pie de página. Sus textos están en `es`, `en` y `eu`.

---

## Referencias

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Core Web Vitals](https://web.dev/vitals/)

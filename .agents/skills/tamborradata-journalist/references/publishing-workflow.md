# Entrega y publicación

Cómo entregar el trabajo según el modo, y cómo llevarlo a la web **solo cuando lo pidan**.

## Redactar, investigar e implementar son tareas distintas

| Modo | Escribe en el repositorio | Toca el frontend |
| --- | --- | --- |
| Explorar | No | No |
| Redactar | Solo si el usuario pide un archivo | No |
| Revisar | No | No |
| Evidencias | Solo si el usuario pide un archivo | No |
| Implementar | Sí, en los archivos de artículo | Sí, solo lo imprescindible |

Por defecto entrega el artículo y las evidencias **en la conversación**. Si piden un archivo, propón una ubicación (p. ej. `drafts/<slug>/article.md` y `drafts/<slug>/evidence.json`) y confírmala antes de crear nada.

No modifiques nunca: artículos existentes, pipeline, esquema de Supabase, datos de producción. No hagas commits ni stages: deja el árbol de trabajo para que lo gestione el usuario. No arranques `next dev` ni cierres procesos `node` del proyecto.

## Qué entregar en cada modo

- **Redactar:** contrato de salida de `SKILL.md` (Capa 1, Capa 2, informe editorial).
- **Evidencias:** fichas de visualización + datos exactos + registro de consultas.
- **Revisar:** lista de bloqueos, afirmaciones no respaldadas, versión editada y puntuación.
- **Explorar:** 3–5 propuestas (ver [investigation-process](investigation-process.md)).

## Implementar en Next.js (solo si lo piden)

Condiciones previas: artículo aprobado, sin bloqueos, evidencias conciliadas. Antes de escribir código, lee la guía de Next.js que corresponda en `node_modules/next/dist/docs/` (el proyecto usa una versión con cambios respecto a lo habitual).

### Convenciones reales del repositorio (comprobadas)

Los artículos viven en `app/(frontend)/[locale]/(pages)/articles/`:

| Pieza | Ruta | Contenido |
| --- | --- | --- |
| Registro | `data/articles.ts` | `{ id, publishedAt, modifiedAt, hilighted }` |
| Slugs por idioma | `data/slugs.ts` | `articleSlugs[id] = { es, en, eu }` (el `id` es el slug en español) |
| Contenido | `data/content/<id>/` | `index.ts`, `es.ts`, `en.ts`, `eu.ts`, `build.ts`, `copy.types.ts`, `figures.ts`, `format.ts` |
| Tipos de bloque | `types/article.types.ts` | `heading`, `text`, `hilightedText`, `horizontalBarChart`, `seriesChart`, `waffleChart`, `distributionChart`, `dataTable`, `chipList`, `compare`, `tokenBreakdown`, `variantGroups`, `steps`, `sources` |
| Renderizado | `components/RendererArticle.tsx`, `components/blocks/*` | Un componente por bloque |
| Textos de cada idioma | `ArticleTexts` | `title`, `description`, `category`, `readTime`, `articleContent` |

Patrón de los artículos existentes (léelos como modelo, **no los edites**): `figures.ts` guarda las cifras ya verificadas; `copy.types.ts` define el tipo `ArticleCopy` con funciones que reciben un formateador; `es.ts`/`en.ts`/`eu.ts` implementan el texto; `build.ts` convierte el texto en bloques; `index.ts` reúne los idiomas. Las cifras en estas fuentes estáticas no se actualizan solas: exige evidencia reciente antes de reutilizarlas.

### Pasos

1. Crea `data/content/<id>/` copiando la **estructura** de un artículo existente.
2. Vuelca en `figures.ts` solo cifras ya verificadas, con un comentario del identificador Qn del registro de evidencias.
3. Escribe el texto en `es.ts` (español de España). Si el proyecto exige `en` y `eu`, prepáralos con paridad completa de estructura; verifica los términos de dominio y avisa al usuario de que las traducciones requieren revisión nativa.
4. Mapea la **Capa 1** a bloques `heading`/`text` (las frases destacadas van como `hilightedText`, dos o tres por artículo; las preguntas-encabezado, como `heading`). El bloque `heading` no tiene niveles: no redactes H3. Y la **Capa 2** a un `heading` «La historia en datos» seguido de los bloques visuales (fichas de visualización → bloques, ver [data-visualization](data-visualization.md)) y, al final, un `heading` «Datos utilizados» con su texto breve. **Solo si el artículo se apoya en fuentes externas verificadas**, cierra con un bloque `sources` como último bloque del todo (`items`: `title` obligatorio; `publisher`, `year`, `url` y `note` opcionales; una `note` breve por fuente si aclara qué se tomó de ella). Sin fuentes externas, el último bloque es el texto de «Datos utilizados» y no se añade `sources`. A diferencia de los artículos existentes, que intercalan gráficos, aquí la Capa 1 va entera antes.
5. Registra el artículo en `articles.ts` y `slugs.ts`. Calcula `readTime` a partir de la longitud real.
6. Si añades un bloque nuevo, justifícalo: reutiliza los existentes siempre que puedas.
7. Valida con `pnpm types`, `pnpm lint` y `pnpm test:unit`. Si algo falla por un motivo ajeno a tus cambios, dilo y no lo «arregles» tú.
8. Si una nueva dependencia es imprescindible, instálala exacta y de desarrollo cuando proceda (`pnpm add -DE`).
9. Comprueba que el sitemap, la imagen Open Graph y el SEO funcionan para el nuevo `id` (los tests de `test/unit/sitemap.test.ts` y `test/e2e/seo` cubren artículos).

Delega la implementación en un subagente si toca varios archivos, y haz una revisión con contexto limpio antes de dar por cerrado el trabajo.

## Entregable final de cualquier modo

Termina con: qué has hecho, qué has verificado (y cómo), qué queda pendiente y qué decisiones necesitas del usuario. Si la sesión ha producido hallazgos no obvios (una laguna de datos, un fallo de conciliación, una convención nueva), guárdalos en la memoria del proyecto si hay una disponible.

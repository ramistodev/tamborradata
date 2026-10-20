# Tests

Tamborradata tiene tres capas de comprobación: **tipos**, **tests unitarios** (Vitest) y **tests end-to-end** (Playwright). Esta guía explica cómo ejecutarlos, cómo está organizada la carpeta `test/` y cómo escribir un test nuevo.

---

## 📋 Índice

- [Camino rápido](#camino-rápido)
- [Qué cubre cada capa](#qué-cubre-cada-capa)
- [Estructura de `test/`](#estructura-de-test)
- [Tests unitarios](#tests-unitarios)
- [Cobertura](#cobertura)
- [Tests end-to-end](#tests-end-to-end)
- [Cómo escribir un test nuevo](#cómo-escribir-un-test-nuevo)
- [Reglas del proyecto](#reglas-del-proyecto)
- [Trampas conocidas](#trampas-conocidas)

---

## Camino rápido

```bash
pnpm test:unit        # unitarios (node + jsdom), sin red ni base de datos
pnpm test:coverage    # unitarios + cobertura con umbrales
pnpm types:test       # tipos de app/ y de test/

pnpm exec playwright install chromium   # una sola vez por máquina
pnpm test:e2e         # build + servidor de producción en :3100 + navegador
```

| Comando               | Qué hace                                                              |
| --------------------- | --------------------------------------------------------------------- |
| `pnpm test`           | Vitest una vez (todos los proyectos)                                  |
| `pnpm test:watch`     | Vitest en modo observador                                             |
| `pnpm test:unit`      | Proyectos `node` y `dom`                                              |
| `pnpm test:coverage`  | Unitarios con cobertura v8 y umbrales; informe en `coverage/`         |
| `pnpm test:e2e`       | Playwright (escritorio y móvil)                                       |
| `pnpm test:e2e:ui`    | Playwright con su interfaz                                            |
| `pnpm types`          | Tipos de la aplicación (los tests no entran, ver más abajo)           |
| `pnpm types:test`     | Tipos de la aplicación **y** de los tests                             |

---

## Qué cubre cada capa

| Capa        | Herramienta                       | Qué prueba                                                                 | Necesita                 |
| ----------- | --------------------------------- | -------------------------------------------------------------------------- | ------------------------ |
| Unitarios   | Vitest 5 + Testing Library        | Lógica pura, servicios, repositorios (Supabase simulado), rutas API, hooks y componentes | Nada externo             |
| End-to-end  | Playwright (Chrome y Pixel 7)     | La web real en producción: API, páginas, navegación, i18n, SEO, límite de peticiones | `.env` y datos publicados |

Los **Server Components asíncronos** (páginas, `layout.tsx`, `Header`, datos estructurados) no se pueden renderizar con Vitest. Se prueban con e2e y quedan fuera de los umbrales de cobertura unitaria por diseño; sí se testean sus funciones auxiliares y `generateMetadata`.

---

## Estructura de `test/`

```
test/
├── unit/          # Refleja app/: un test por archivo fuente
├── e2e/           # Specs de Playwright
│   ├── api/  search/  statistics/  landing/  navigation/
│   ├── i18n/  seo/  privacy/  security/
│   └── support/   # Utilidades compartidas (API, servidor, IP, consola)
├── helpers/       # Mocks y utilidades de los tests unitarios
├── fixtures/      # Fábricas de datos (periodos, overview, estadísticas, filas de BD)
├── setup/         # common.ts (todos) y dom.ts (solo jsdom)
└── mocks/         # Sustituto de server-only
```

Archivos de configuración en la raíz: `vitest.config.ts`, `playwright.config.ts` y `tsconfig.test.json`. `tsconfig.json` **excluye** `test/` y las dos configuraciones, así que `next build` no comprueba tipos de los tests; eso lo hace `pnpm types:test`.

### Dónde va cada test

La ruta del test es la del archivo fuente sin `app/`, con `.test.ts` o `.test.tsx`:

| Fuente                                                         | Test                                                                  |
| -------------------------------------------------------------- | --------------------------------------------------------------------- |
| `app/(backend)/lib/errors.ts`                                  | `test/unit/(backend)/lib/errors.test.ts`                              |
| `app/(frontend)/[locale]/components/ui/Button.tsx`             | `test/unit/(frontend)/[locale]/components/ui/Button.test.tsx`         |
| `proxy.ts`                                                     | `test/unit/proxy.test.ts`                                             |

Se usa `.test.tsx` solo si el test renderiza, usa `renderHook` o toca `window`/`document`: ese archivo corre en jsdom (proyecto `dom`); el resto, en Node (proyecto `node`).

---

## Tests unitarios

### Dos proyectos de Vitest

| Proyecto | Entorno | Archivos            | Preparación                           |
| -------- | ------- | ------------------- | ------------------------------------- |
| `node`   | Node    | `test/unit/**/*.test.ts`  | `setup/common.ts`               |
| `dom`    | jsdom   | `test/unit/**/*.test.tsx` | `setup/common.ts` y `setup/dom.ts` |

La configuración fija la zona horaria a `Europe/Madrid`, usa variables de entorno falsas (`SUPABASE_URL`, `SIGNATURE_SECRET`...) y sustituye `server-only` por un módulo vacío. Los mocks se resetean solos entre tests (`mockReset`, `restoreMocks`, `unstubEnvs`, `unstubGlobals`).

`setup/dom.ts` instala lo que jsdom no trae: `IntersectionObserver`, `ResizeObserver`, `matchMedia`, `scrollIntoView` y un mock parcial de `next/navigation` controlado con `navigationState`.

### Helpers disponibles

| Helper (`@/test/helpers/...`)      | Para qué sirve                                                                 |
| ---------------------------------- | ------------------------------------------------------------------------------ |
| `supabaseClientMock`, `supabaseMock` | Cliente Supabase encadenable con colas de resultados; falla si una consulta no tiene resultado preparado |
| `loggerMock`                       | Sustituye el logger y deja inspeccionar las llamadas                           |
| `nextIntlServerMock`               | `next-intl/server` con las **traducciones reales**; lanza error si falta una clave |
| `renderWithIntl`                   | Renderiza componentes y hooks dentro de `NextIntlClientProvider` (y React Query) |
| `queryClient`                      | `QueryClient` de test sin reintentos                                           |
| `nextNavigation`                   | Estado del mock de `next/navigation` (ruta, parámetros, router)                |
| `route`                            | `NextRequest` y contexto de ruta para probar handlers de `/api`                |
| `freshImport`                      | Reimporta módulos con estado de importación                                    |
| `observers`, `matchMedia`, `dialog` | Simulaciones de APIs del navegador                                            |
| `messages`                         | Traducciones reales y utilidades para el test de paridad de idiomas            |

Las fábricas de `test/fixtures` (`makePeriod`, `makeStatisticsResponse`, `makeParticipantRow`...) devuelven un objeto nuevo en cada llamada, sin fechas ni valores aleatorios.

---

## Cobertura

`pnpm test:coverage` mide `app/**` y `proxy.ts` con v8 y falla si baja de los umbrales de `vitest.config.ts`:

| Ámbito                                          | Medido (octubre 2026)             | Umbral            |
| ----------------------------------------------- | --------------------------------- | ----------------- |
| Total (líneas / sentencias / funciones / ramas) | 95,8 % / 95,8 % / 96,3 % / 95,3 % | 95 / 95 / 96 / 95 |
| Backend `lib` (líneas)                          | 100 %                             | 100               |
| Backend `repo` (líneas)                         | 100 %                             | 100               |
| Backend `service` (líneas)                      | al menos 99 %                     | 99                |
| Backend `services` (líneas)                     | 98,9 %                            | 98                |
| Backend `route.ts` (líneas)                     | 100 %                             | 100               |

Lo que queda sin cubrir son los Server Components asíncronos (los cubre e2e). Los umbrales están redondeados hacia abajo respecto a lo medido: si añades código, añade también su test; si subes la cobertura, sube el umbral. El informe HTML queda en `coverage/` (ignorado por git).

---

## Tests end-to-end

Los specs de `test/e2e` ejecutan la web **de producción** contra una base de datos real, así que dependen de los datos publicados.

### Qué hace `pnpm test:e2e`

1. Ejecuta `pnpm build && pnpm start -p 3100` (con `NODE_ENV=production` forzado).
2. Espera a que `/robots.txt` responda.
3. Lanza dos proyectos: `desktop` (Chrome) y `mobile` (Pixel 7, solo los `*.mobile.spec.ts`).

Necesita `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SIGNATURE_SECRET` y `HASH_SECRET` en `.env` o en el entorno.

| Variable        | Efecto                                                                    |
| --------------- | ------------------------------------------------------------------------- |
| `E2E_SKIP_BUILD=1` | Reutiliza el build existente (`pnpm start` sin `pnpm build`)           |
| `E2E_BASE_URL`  | Apunta a un servidor ya levantado y no arranca ninguno                    |

> [!WARNING]
> `pnpm build` escribe en `.next/`, la misma carpeta que usa `pnpm dev`. Detén el servidor de desarrollo antes de lanzar los e2e, o usa `E2E_SKIP_BUILD=1` con un build ya hecho.

Los informes quedan en `playwright-report/` y `test-results/` (ignorados por git).

### Tiempos y latencia

Los e2e llaman a la base de datos real, así que su duración depende de la red y del estado de la base. En una máquina normal toda la suite tarda unos 30-40 segundos y los primeros tests de API unos 9 s cada uno; con latencia triplicada la suite puede pasar de 2 minutos. Por eso `playwright.config.ts` fija `timeout: 60_000` por test y `expect.timeout: 10_000`, y las esperas de una página de ranking usan `PAGE_LOAD_TIMEOUT_MS`. Si aun así un test agota el tiempo, mira primero la duración de las llamadas a `/api/statistics` en el informe: es casi siempre la base, no el test.

### Qué se salta y por qué

Solo hay saltos condicionales con motivo, del tipo `test.skip(!year, 'no published year period in the live data')`: se activan si faltan datos en la base (un año publicado, un ranking con segunda página...). Los specs que necesitan un servidor de producción se saltan si se apuntan a uno de desarrollo.

---

## Cómo escribir un test nuevo

1. **Lee el archivo fuente entero** antes de escribir nada.
2. Crea el test en la ruta que le corresponde (ver [Dónde va cada test](#dónde-va-cada-test)).
3. Ordena los imports: `vitest`, paquetes, el sujeto (`@/app/...`), `@/test/helpers/...`, `@/test/fixtures/...`; después los `vi.mock(...)`.
4. Estructura: un `describe` por símbolo o archivo, `it('<verbo en inglés>')`, separa preparar / actuar / comprobar con líneas en blanco y usa `it.each` para tablas de casos.
5. Importa siempre con alias (`@/app/...`, `@/test/...`), nunca con rutas relativas hacia `app/`.
6. Ejecuta el test, `pnpm exec eslint "<archivo>"` y `pnpm types:test`.

Mocks habituales (copia tal cual):

```ts
vi.mock('@/app/(backend)/core/logger', async () => (await import('@/test/helpers/loggerMock')).loggerModule());
vi.mock('@/app/(backend)/core/db/supabaseClient', async () => (await import('@/test/helpers/supabaseClientMock')).supabaseClientModule());
vi.mock('next-intl/server', async () => (await import('@/test/helpers/nextIntlServerMock')).nextIntlServerModule());
```

En el proyecto `node`, `notFound()` y `redirect()` son los reales de Next: se comprueba el `digest` del error, no se mockean.

---

## Reglas del proyecto

- Cada test comprueba el **comportamiento correcto**. Si falla porque hay un bug, se arregla el bug: no se debilita la aserción.
- Prohibido `it.skip`, `it.fails`, `it.todo`, `.only` y los snapshots. La única excepción son los `test.skip(condición, 'motivo')` de e2e descritos arriba.
- Sin red, sin reloj real (`vi.useFakeTimers`) y sin aleatoriedad.
- Los textos esperados salen de las traducciones reales, no se copian a mano.
- Código, nombres de test y comentarios en inglés.

---

## Trampas conocidas

| Situación                                                   | Qué hacer                                                                            |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `beforeEach(() => vi.mocked(fn).mockReset())` falla con un error ajeno | La flecha devuelve el mock y Vitest lo ejecuta como limpieza. Usa un bloque `{ }`  |
| `user-event` se cuelga con `vi.useFakeTimers()`             | Usa `fireEvent` y `act(() => vi.advanceTimersByTime(...))`                           |
| `getByText` no encuentra un porcentaje en español           | El formato `es` lleva un espacio de no separación (NBSP): compara `textContent`      |
| `router.replace(href, { locale })` de next-intl añade `/es`  | Lo hace también para el idioma por defecto y el redirect posterior pierde el `#hash`; ver [i18n](./i18n.md#cambio-de-idioma) |
| Un mock de `fetchParticipants` o `participantsService` devuelve un objeto | Ambos devuelven un **array**: envuelve la fábrica en `[ ]`                |
| Un elemento con `aria-disabled` no se puede pulsar en Playwright | Usa `click({ force: true })` si el test es sobre ese comportamiento              |
| El e2e falla antes de interactuar con un botón              | Espera a la hidratación de React antes de pulsar; un clic previo se pierde           |
| Contar filas de un ranking mientras carga la página siguiente | Los esqueletos son `<li>` del mismo `<ol>` y el conteo sube antes de que llegue ningún dato real: espera una señal real (el botón "Mostrar menos") con `PAGE_LOAD_TIMEOUT_MS` y cuenta después |

---

Véase también: [Decisiones de diseño](./design-decisions.md), [API](./api.md), [i18n](./i18n.md).

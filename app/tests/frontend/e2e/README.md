# Tests E2E con Playwright

Este directorio contiene los tests end-to-end (E2E) de Tamborradata usando Playwright.

## Descripción

Los tests E2E simulan el comportamiento real de un usuario navegando por la aplicación web. Se ejecutan en un navegador Chromium real y verifican que toda la aplicación funciona correctamente de principio a fin.

## Tests Implementados

### 1. Navegación Completa por la Aplicación

**Propósito**: Simular un flujo completo de navegación de usuario real

**Escenario**:

1. Visita la página principal (home)
2. Verifica el componente ExploreStatistics
3. Navega a estadísticas globales usando el botón "Global"
4. Verifica títulos de secciones ("Participantes totales", "Nombres más comunes")
5. Alterna entre vista de gráfico y tabla
6. Navega a un año específico usando el selector del header
7. Verifica el contenido de la página del año
8. Alterna gráficos/tablas en la página del año
9. Navega a otro año diferente
10. Vuelve a estadísticas globales usando el header
11. Navega a la página de información (/statistics/info)
12. Verifica los títulos de la página info ("Información y Transparencia de Datos", "Origen de los Datos", "Funcionamiento del Sistema")
13. Vuelve a home haciendo click en "Tamborradata"

**Screenshots generados**:

- 01-home.png
- 02-global-grafico.png
- 03-global-tabla.png
- 04-year-grafico.png
- 05-year-tabla.png
- 06-year-segundo.png
- 07-info-page.png
- 08-home-final.png

### 2. Comportamiento Responsive - Móvil

**Propósito**: Verificar que en móvil los gráficos están ocultos

**Escenario**:

1. Configura viewport móvil (375x667)
2. Navega a estadísticas globales
3. Verifica que los botones "Ver gráfico"/"Ver tabla" NO son visibles
4. Verifica que las tablas SÍ están visibles

**Screenshots generados**:

- 09-mobile-global.png

**Nota**: Los gráficos tienen la clase `hidden md:block` de Tailwind, por lo que solo se muestran en desktop.

### 3. Navegación entre Años Disponibles

**Propósito**: Verificar que se puede navegar entre todos los años desde el header

**Escenario**:

1. Navega a estadísticas globales
2. Obtiene todos los enlaces de años del header
3. Itera por los primeros 3 años (limitado para no hacer el test muy largo)
4. Para cada año verifica:
   - URL correcta (/statistics/[año])
   - Título de la página visible ("Tamborrada Infantil [año]")

**Screenshots generados**:

- 10-navegacion-year-1.png
- 10-navegacion-year-2.png
- 10-navegacion-year-3.png

## Cobertura

- **Cobertura de navegación completa**: Simula la experiencia real de un usuario navegando por toda la aplicación
  - Página principal → Estadísticas globales → Alternar gráficos/tablas → Años específicos → Página de información → Vuelta a home
  - Verificación de títulos: "Participantes totales", "Nombres más comunes"
  - Verificación de página de información: "Información y Transparencia de Datos", "Origen de los Datos", "Funcionamiento del Sistema"

- **Cobertura de responsive**: Verifica comportamiento en móvil vs desktop
  - Desktop (1920x1080): Gráficos y tablas disponibles con toggle
  - Móvil (375x667): Solo tablas visibles, gráficos ocultos

- **Cobertura de navegación dinámica**: Navega por años disponibles usando el header
  - Verifica selector de años en el header
  - Navega entre diferentes años
  - Verifica contenido de cada año

## Comandos

```bash
# Ejecutar tests E2E
pnpm test:e2e

# Ejecutar tests E2E con UI interactiva
pnpm test:e2e:ui

# Ejecutar tests E2E con navegador visible (headed mode)
pnpm test:e2e:headed

# Ver el último reporte HTML
pnpm exec playwright show-report
```

## Configuración

La configuración de Playwright se encuentra en `playwright.config.ts` en la raíz del proyecto.

**Características**:

- Navegador: Chromium
- WebServer: Auto-inicia en localhost:3000 (desarrollo)
- Timeout: 5 segundos por operación
- Screenshots: En caso de fallo y al finalizar tests
- Trace: Activado en caso de fallo (útil para debugging)

## Screenshots

Los screenshots se guardan en `app/tests/frontend/e2e/screenshots/` y están incluidos en `.gitignore` para no subirlos al repositorio.

## Notas Técnicas

### Viewports

- **Desktop**: 1920x1080 - Para tests que requieren ver gráficos
- **Móvil**: 375x667 - Para tests de responsive behavior

### Selectores

Se usan selectores semánticos basados en roles de accesibilidad:

- `getByRole('heading')` para títulos
- `getByRole('button')` para botones
- `locator('header a[href*="/statistics/"]')` para navegación del header
- `.first()` para seleccionar el primer elemento cuando hay múltiples coincidencias

### Timeouts

Se usan `waitForLoadState('networkidle')` para asegurar que la página ha cargado completamente antes de hacer verificaciones.

## Resumen de Tests

**Total de tests**: 108

- Tests backend (API): 68
- Tests frontend (componentes): 37
- Tests E2E (Playwright): 3

**Estado actual**: ✅ Todos los tests pasando

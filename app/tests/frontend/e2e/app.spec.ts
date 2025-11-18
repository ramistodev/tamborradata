import { test, expect } from '@playwright/test';

test.describe('Tamborrada Data E2E - Navegación Completa', () => {
  test('debería navegar por toda la aplicación como un usuario real', async ({ page }) => {
    // Configurar viewport para desktop (las gráficas solo se ven en desktop)
    await page.setViewportSize({ width: 1920, height: 1080 });

    // 1. Visitar página principal
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/01-home.png' });

    // Verificar que estamos en home y el componente ExploreStatistics está presente
    await expect(page.getByRole('heading', { name: /Explora las Estadísticas/i })).toBeVisible();

    // 2. Navegar a estadísticas globales usando el link del ExploreStatistics
    const globalLink = page.locator('a[href="/statistics/global"]').first();
    await expect(globalLink).toBeVisible();
    await globalLink.click();
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en la página de estadísticas globales
    await expect(page).toHaveURL(/\/statistics\/global/);
    await expect(
      page.getByRole('heading', { name: /Tamborrada Infantil — Estadísticas Globales/i })
    ).toBeVisible();

    // 3. Verificar que hay secciones de estadísticas visibles
    await expect(page.getByRole('heading', { name: /Participantes totales/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Nombres más comunes/i })).toBeVisible();

    // 4. Alternar entre vista de gráfico y tabla en la primera sección con chart toggle
    // Buscar el primer botón "Ver gráfico" o "Ver tabla"
    const toggleButton = page
      .locator('button:has-text("Ver gráfico"), button:has-text("Ver tabla")')
      .first();

    // Esperar a que el botón sea visible
    await toggleButton.waitFor({ state: 'visible', timeout: 5000 });

    // Obtener el texto del botón
    const toggleText = await toggleButton.textContent();

    if (toggleText?.includes('Ver gráfico')) {
      await toggleButton.click();
      await page.waitForTimeout(500); // Esperar animación
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/02-global-grafico.png' });

      // Verificar que el gráfico SVG está visible
      await expect(page.locator('svg').first()).toBeVisible();

      // Volver a tabla
      await page.locator('button:has-text("Ver tabla")').first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/03-global-tabla.png' });
    } else {
      // Ya está en modo gráfico, capturar y cambiar a tabla
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/02-global-grafico.png' });
      await toggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/03-global-tabla.png' });
    }

    // 5. Navegar a un año específico usando el Header
    // Encontrar el selector de años en el header y hacer click en el primer año disponible
    const yearLinks = page
      .locator('header a[href*="/statistics/"]')
      .filter({ hasNotText: /Global/i });
    await yearLinks.first().click();
    await page.waitForLoadState('networkidle');

    // Verificar que estamos en una página de año
    await expect(page).toHaveURL(/\/statistics\/\d{4}/);
    const yearHeading = page
      .getByRole('heading')
      .filter({ hasText: /Tamborrada Infantil \d{4}/i })
      .first();
    await expect(yearHeading).toBeVisible();

    // 6. Verificar contenido de la página del año y alternar gráfico/tabla
    await expect(page.getByRole('heading', { name: /Participantes totales/i })).toBeVisible();

    // Alternar entre gráfico y tabla en el año
    const yearToggleButton = page
      .locator('button:has-text("Ver gráfico"), button:has-text("Ver tabla")')
      .first();
    await yearToggleButton.waitFor({ state: 'visible', timeout: 5000 });

    const yearToggleText = await yearToggleButton.textContent();
    if (yearToggleText?.includes('Ver gráfico')) {
      await yearToggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/04-year-grafico.png' });

      await expect(page.locator('svg').first()).toBeVisible();

      await page.locator('button:has-text("Ver tabla")').first().click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/05-year-tabla.png' });
    } else {
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/04-year-grafico.png' });
      await yearToggleButton.click();
      await page.waitForTimeout(500);
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/05-year-tabla.png' });
    }

    // 7. Navegar a otro año diferente desde el header
    const secondYearLink = yearLinks.nth(1);
    if ((await secondYearLink.count()) > 0) {
      await secondYearLink.click();
      await page.waitForLoadState('networkidle');
      await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/06-year-segundo.png' });
      await expect(page).toHaveURL(/\/statistics\/\d{4}/);
    }

    // 8. Volver a Global usando el header
    const globalHeaderLink = page
      .locator('header nav a')
      .filter({ hasText: /Global/i })
      .first();
    await globalHeaderLink.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL(/\/statistics\/global/);
    await expect(
      page.getByRole('heading', { name: /Tamborrada Infantil — Estadísticas Globales/i })
    ).toBeVisible();

    // 9. Navegar a la página de información
    await page.goto('http://localhost:3000/statistics/info');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/07-info-page.png' });

    // Verificar contenido de la página de información
    await expect(
      page.getByRole('heading', { name: /Información del Proyecto Tamborradata/i })
    ).toBeVisible();
    await expect(page.getByRole('heading', { name: /Origen de los Datos/i })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Funcionamiento del Sistema/i })).toBeVisible();

    // 10. Volver a home haciendo click en "Tamborradata" del header
    const homeLink = page.locator('header a[href="/"]').first();
    await homeLink.click();
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/08-home-final.png' });

    // Verificar que volvimos a home
    await expect(page).toHaveURL('http://localhost:3000/');
    await expect(page.getByRole('heading', { name: /Explora las Estadísticas/i })).toBeVisible();
  });

  test('debería verificar comportamiento responsive - móvil sin gráficos', async ({ page }) => {
    // Configurar viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });

    // Navegar a estadísticas globales
    await page.goto('http://localhost:3000/statistics/global');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'app/tests/frontend/e2e/screenshots/09-mobile-global.png' });

    // En móvil, los botones de "Ver gráfico" NO deben estar visibles
    // porque las gráficas están ocultas con la clase "hidden md:block"
    const toggleButton = page
      .locator('button:has-text("Ver gráfico"), button:has-text("Ver tabla")')
      .first();
    const isVisible = await toggleButton.isVisible();

    // El botón de toggle NO debe ser visible en móvil
    expect(isVisible).toBe(false);

    // Verificar que las tablas SÍ están visibles
    await expect(page.getByRole('heading', { name: /Participantes totales/i })).toBeVisible();
  });

  test('debería navegar correctamente entre todos los años disponibles', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });

    // Navegar a estadísticas globales
    await page.goto('http://localhost:3000/statistics/global');
    await page.waitForLoadState('networkidle');

    // Obtener el número de años disponibles
    const yearLinks = page
      .locator('header a[href*="/statistics/"]')
      .filter({ hasNotText: /Global/i });
    const yearCount = await yearLinks.count();

    // Navegar por cada año (re-buscando los elementos en cada iteración)
    for (let i = 0; i < Math.min(yearCount, 3); i++) {
      // Limitamos a 3 para no hacer el test muy largo

      // Re-localizar los elementos en cada iteración para evitar elementos stale
      const currentYearLinks = page
        .locator('header a[href*="/statistics/"]')
        .filter({ hasNotText: /Global/i });

      await currentYearLinks.nth(i).click();
      await page.waitForLoadState('networkidle');

      // Verificar que estamos en la página del año
      await expect(page).toHaveURL(/\/statistics\/\d{4}/);
      const yearHeading = page
        .getByRole('heading')
        .filter({ hasText: /Tamborrada Infantil \d{4}/i })
        .first();
      await expect(yearHeading).toBeVisible();

      // Capturar screenshot
      await page.screenshot({
        path: `app/tests/frontend/e2e/screenshots/10-navegacion-year-${i + 1}.png`,
      });

      // Volver a la página global para continuar con el siguiente año
      await page.goto('http://localhost:3000/statistics/global');
      await page.waitForLoadState('networkidle');
    }
  });
});

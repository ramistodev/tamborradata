# Guía de Contribución

Gracias por tu interés en contribuir a **Tamborradata**.

Este documento establece las normas, el flujo de trabajo y las mejores prácticas para colaborar en este proyecto. Si tienes dudas sobre la configuración del entorno, consulta el `README.md`.

---

## 🧭 Tipos de contribuciones aceptadas

Se aceptan contribuciones en las siguientes áreas:

- **Mejoras de componentes y lógica interna**: Optimización, refactorización o nuevas funcionalidades
- **Corrección de bugs**: Reportes detallados o soluciones directas
- **Mejoras de accesibilidad y rendimiento**: Optimizaciones de UX/UI y performance
- **Nuevas visualizaciones**: Gráficos o estadísticas basadas en los datos públicos disponibles
- **Documentación**: Mejoras en README, comentarios en código o guías adicionales

### ⚠️ Restricciones

- **No se aceptan contribuciones sobre el pipeline privado** de scraping y procesamiento de datos
- **No se aceptan cambios en datos reales** de participantes (por privacidad y seguridad)

---

## 📌 Normas generales

Antes de contribuir, asegúrate de seguir estas directrices:

- ✅ Mantén un tono **respetuoso y profesional** (consulta `CODE_OF_CONDUCT.md`)
- ✅ Escribe código **claro, limpio y bien documentado**
- ✅ Usa **TypeScript** correctamente (todo debe estar tipado)
- ✅ Respeta las **convenciones de nomenclatura** del proyecto
- ✅ Evita introducir **dependencias innecesarias** sin justificación
- ✅ No modifiques **estilos globales** ni configuraciones sin motivo claro
- ✅ Cada Pull Request debe abordar **un solo problema o mejora**

---

## 🔄 Flujo de trabajo recomendado

### 1. Revisa los issues abiertos

Antes de empezar, consulta la lista de [issues abiertos](https://github.com/ramistodev/tamborradata/issues) para evitar duplicar esfuerzos.

### 2. Abre una discusión para cambios importantes

Si planeas hacer modificaciones grandes (nueva funcionalidad, refactorización significativa, cambios arquitectónicos), **abre primero un issue de discusión** para recibir feedback antes de comenzar.

### 3. Para bugs pequeños, puedes enviar un PR directamente

Si es una corrección menor, puedes enviar el Pull Request sin necesidad de discusión previa.

---

## 🔧 Cómo enviar un Pull Request

### 1. Prepara el entorno

El proyecto usa **pnpm** (versión fijada en `packageManager` de `package.json`). La configuración completa está en el `README.md`.

```bash
pnpm install
pnpm dev
```

### 2. Crea una rama descriptiva

Parte de `main` actualizada y usa un prefijo que indique el tipo de cambio, seguido de un nombre corto en minúsculas y con guiones:

```bash
feature/nueva-visualizacion-colegios
fix/error-calculo-estadisticas
refactor/simplificar-year-context
docs/mejorar-guia-contribucion
chore/actualizar-dependencias
```

### 3. Haz commits claros y atómicos

Sigue el formato de **Conventional Commits**: `tipo(ámbito opcional): descripción`, en minúsculas, en modo imperativo y sin punto final. Los tipos que usa el repositorio son `feat`, `fix`, `refactor`, `style`, `chore` y `docs`:

```bash
feat(statistics): add the ranking by school
fix(api): skip unknown categories in the statistics
refactor(search): move the search page to its own route
style(contact): truncate the email on small screens
chore(deps): update dependencies
docs: update the contributing guide
```

Cada commit debe tener sentido por sí solo y dejar el proyecto en un estado que compile.

### 4. Verifica tu código antes de abrir el PR

```bash
pnpm types        # Comprobación de tipos de la aplicación (tsc --noEmit)
pnpm types:test   # Tipos de la aplicación y de los tests
pnpm lint         # ESLint
pnpm test:unit    # Tests unitarios
pnpm build        # Build de producción
```

Si cambias lógica, añade o actualiza su test: el test de un archivo vive en `test/unit/` con la misma ruta que el archivo (sin `app/`). Los tests deben comprobar el comportamiento correcto; no se aceptan `it.skip`, `it.fails` ni snapshots. Los e2e (`pnpm test:e2e`) son opcionales en un PR, pero conviene lanzarlos si tocas navegación, i18n o la API. Guía completa: [docs/testing.md](docs/testing.md).

Comprueba además que:

- ✅ No rompe funcionalidades existentes
- ✅ Mantiene la coherencia con el estilo del proyecto
- ✅ Está correctamente tipado con TypeScript
- ✅ Es legible y está bien documentado

### 5. Actualiza tu rama y abre el Pull Request

Antes de abrir el PR, pon tu rama al día con `main` haciendo **rebase** (evita commits de merge y facilita el squash):

```bash
git fetch origin
git rebase origin/main
```

Los PRs se integran con **squash merge**: el título del PR se convierte en el mensaje final, así que escríbelo también en formato Conventional Commits (por ejemplo, `feat(statistics): add the ranking by school`).

Incluye en la descripción:

- **¿Qué problema resuelve?** → Contexto del cambio
- **¿Qué cambio introduces?** → Explicación técnica
- **¿Hay efectos secundarios?** → Posibles impactos en otras partes del código
- **¿Cómo probarlo?** → Pasos para verificar que funciona correctamente
- **Capturas** → Si el cambio es visual, antes y después

---

## 🐛 Reporte de bugs

Si encuentras un error, abre un [issue](https://github.com/ramistodev/tamborradata/issues/new) con la siguiente información:

- **Descripción del problema**: ¿Qué ocurre exactamente?
- **Pasos para reproducirlo**: Secuencia de acciones que genera el error
- **Comportamiento esperado**: ¿Qué debería ocurrir?
- **Entorno**: Navegador, versión, sistema operativo (si aplica)
- **Capturas o logs**: Adjunta evidencias visuales o mensajes de error

---

## 🛡️ Seguridad y vulnerabilidades

Si encuentras una **vulnerabilidad de seguridad**, **no abras un issue público**.

Consulta la política de `SECURITY.md` para reportarla de forma privada y responsable.

---

## 🔒 Sobre el pipeline privado

El pipeline automatizado que extrae, procesa y anonimiza los datos reales cada enero:

- **Permanece privado** por motivos de seguridad, privacidad y cumplimiento legal
- **No se aceptan contribuciones externas** en esa parte del proyecto
- Si tienes **interés genuino en colaborar** en el pipeline, contacta directamente a través de [GitHub Issues](https://github.com/ramistodev/tamborradata/issues)

> Solo se concede acceso a colaboradores de **confianza y con compromiso demostrado** en el proyecto.

---

## ❤️ Agradecimientos

Gracias por dedicar tu tiempo a mejorar **Tamborradata**.

Cada contribución —grande o pequeña— ayuda a que el proyecto siga creciendo y mejorando la forma en que preservamos y compartimos la historia de la Tamborrada Infantil.

---

**¿Tienes dudas?**  
Abre un [issue de discusión](https://github.com/ramistodev/tamborradata/issues) o consulta el `README.md` para más información sobre el proyecto.

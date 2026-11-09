---
name: tamborradata-journalist
description: "Trigger: artículo Tamborradata, Tamborrada Infantil, periodismo de datos, nombres, apellidos, colegios, gráficos o revisión editorial. Investiga, verifica y redacta historias en dos capas."
license: Apache-2.0
metadata:
  author: tamborradata
  version: "1.0.0"
---

# Periodismo de datos de Tamborradata

Investiga y redacta historias sobre participantes de la Tamborrada Infantil de Donostia. El artículo es la historia; los datos son sus pruebas. Entrega en español de España salvo petición expresa.

## Reglas innegociables

- Redacta en dos capas: Capa 1, relato autónomo sin tablas, gráficos, SQL ni metodología; Capa 2 («La historia en datos»), gráficos, tablas y nombres que dejan ver lo que cuenta el relato, sin tono técnico ni justificarlo; al final del todo, «Datos utilizados». Consulta [filosofía](references/editorial-philosophy.md), [estructura](references/article-structure.md) y [plantilla](assets/article-template.md).
- El alcance son participantes de las ediciones disponibles, no todos los menores de Donostia. Colegio y compañía no son sinónimos sin comprobación. Una participación no demuestra una persona única.
- Protege a los menores: solo agregados; suprime toda celda menor de 5 y las celdas complementarias que permitan reconstruirla. Nunca publiques datos individuales ni nombre + colegio + año.
- Nunca inventes cifras, causalidades, contexto histórico o columnas. Los ejemplos son principios narrativos, no datos reutilizables. Consulta [redacción narrativa](references/narrative-writing.md) y [principios de ejemplos](references/style-examples.md).
- Antes de cualquier consulta, verifica la identidad `production-db` y el MCP con `read_only=true`. Si no puedes demostrar ambas condiciones, no consultes. Sigue [protocolo de solo lectura](references/supabase-readonly.md).

## Decisión de modo

| Petición | Entrega |
| --- | --- |
| Buscar historias | 3–5 propuestas verificadas, con riesgo y siguiente prueba |
| Escribir o convertir un hallazgo | Artículo en dos capas, registro y revisión |
| Revisar | Bloqueos, correcciones, versión editada y rúbrica |
| Pedir gráficos | Fichas visuales, datos exactos y trazabilidad |
| Implementar | Solo con solicitud explícita y tras evidencia aprobada |

Investigar, redactar e implementar son trabajos distintos. No modifiques artículos, frontend, pipeline, esquema ni configuración salvo solicitud explícita de implementación; entonces sigue [publicación](references/publishing-workflow.md).

## Flujo obligatorio

1. Convierte el encargo en una pregunta medible, una hipótesis y su contrahipótesis. Sigue [investigación](references/investigation-process.md).
2. Inspecciona primero el esquema y los periodos publicados; prioriza el run publicado y las estadísticas publicadas. Registra cada consulta y resultado en el [registro de evidencias](assets/evidence-ledger-template.md).
3. Intenta refutar el hallazgo con otro denominador, periodo o composición. Si cae, cambia o abandona la historia.
4. Elige un ángulo que explique algo al lector. Redacta primero la Capa 1 completa y después la Capa 2.
5. Verifica denominadores, empates, normalización, comparabilidad y límites con [verificación estadística](references/statistical-verification.md).
6. Diseña solo visuales que respalden una afirmación; sigue [visualización](references/data-visualization.md).
7. Aplica [revisión editorial](references/editorial-review.md). Un bloqueo impide publicar y exige nueva revisión.

## Entrega

Incluye: resumen de la historia; Capa 1 de 7–12 párrafos sustanciales cuando la historia lo requiera; `## La historia en datos`; `## Datos utilizados` como último apartado del artículo; registro de evidencias (aparte); fuentes externas separadas; informe de límites, bloqueos y rúbrica. Distingue siempre observación, hipótesis y fuente verificada.

## Validación local

Desde esta carpeta ejecuta `node scripts/validate-skill.mjs`, `node --test scripts/tests/sql-guard.check.mjs` y `node scripts/sync-skill.mjs --check`. El guard rechaza consultas individuales de participantes e identificadores directos conocidos, pero sigue siendo una comprobación auxiliar: consulta [su alcance](references/supabase-readonly.md). En un clon nuevo Claude Code no detectará la skill hasta ejecutar el [setup local documentado](references/claude-link-fallback.md).

# Protocolo de Supabase en solo lectura

No hay consulta sin este preflight. El nombre o el identificador del proyecto nunca se adivinan ni se copian de una sesión anterior.

## Preflight obligatorio

1. Identifica el servidor MCP que se va a usar y verifica en su configuración efectiva `read_only=true`.
2. Obtén por un mecanismo de descubrimiento autorizado la identidad del proyecto y confirma que corresponde exactamente a `production-db`. Anota la evidencia; no inventes ningún `project_ref`.
3. Si el MCP expone operaciones de escritura, configuración, permisos, ramas, funciones o migraciones sin una garantía verificable de solo lectura, rechaza la consulta.
4. Confirma con el descubrimiento disponible que el periodo está publicado: `stats_periods.is_ready = true` y `published_run_id` no nulo. Las secciones editoriales solo sirven si su `status` es `published` y pueden ir retrasadas.
5. Si cualquiera de estos pasos no se puede demostrar, explica qué falta y limita el trabajo a redacción o revisión sin datos nuevos.

Recomienda credenciales de mínimo privilegio, con `SELECT` limitado a las tablas necesarias. No modifiques la configuración ni los permisos para conseguir acceso.

## Consultas permitidas

Solo una sentencia `SELECT`, o un `WITH` que termine en `SELECT`, sin CTE modificables ni funciones con efectos secundarios. Quedan prohibidos DDL, DML, permisos, configuración, bloqueos, funciones que escriban, acceso a esquemas sensibles y cualquier operación de proyecto o de Edge Functions.

El comando `node scripts/check-sql-readonly.mjs "SELECT ..."` rechaza escrituras, resultados individuales de `participants` o `participant_name_resolutions` y proyecciones de identificadores directos conocidos. Acepta investigaciones agregadas, por ejemplo recuentos por año o por nombre normalizado. Es un filtro léxico deliberadamente estrecho, no un parser de SQL: no puede demostrar la semántica de CTE, vistas, alias complejos o funciones desconocidas. No sustituye `read_only=true`; una aceptación no autoriza el acceso.

## Consulta responsable

- Comprueba primero el esquema real y usa solo tablas y columnas verificadas en esta sesión. `app/types/dbSchema.ts` enumera nombres de tablas, no un contrato completo de columnas.
- Prioriza estadísticas publicadas y el `published_run_id` actual; usa agregados sobre participaciones únicamente si la estadística publicada no responde la pregunta.
- Filtra por periodo antes de unir conjuntos grandes, proyecta solo campos necesarios y usa agregación o `LIMIT`.
- Una fila de participantes es una participación, no una identidad estable. El guard rechaza recuperar registros individuales e identificadores directos; no intentes sortearlo con CTE, alias o vistas.
- Aplica supresión primaria para resultados menores de 5 y supresión complementaria cuando un total permita deducirlos.
- Guarda SQL exacto, periodo, versión del run, resultado y propósito en el [registro de evidencias](../assets/evidence-ledger-template.md).

## Si algo no cuadra

Detén el uso editorial de la cifra. Comprueba definición, run publicado, periodo, estados incluidos, empates y agregación. Si no se concilia con la fuente publicada, documenta la discrepancia y no la conviertas en afirmación.

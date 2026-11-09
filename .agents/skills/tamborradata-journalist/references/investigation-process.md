# Proceso de investigación (fases 1 a 3)

Del encargo a la historia elegida. Las consultas se rigen por [supabase-readonly](supabase-readonly.md) y las comprobaciones por [statistical-verification](statistical-verification.md).

## Fase 1: investigación inicial

1. **Reformula** la petición como una pregunta que los datos puedan responder. «Nombres» no es una pregunta; «¿se concentran los nombres en unos pocos colegios?» sí.
2. **Lista lo que necesitas**: periodos, entidad (nombre, apellido, colegio), medida (recuento, cuota, posición), comparación.
3. **Escribe hipótesis y su refutación**: para cada una, qué resultado la sostendría y cuál la tumbaría. Incluye siempre la hipótesis nula («es el efecto del tamaño de la edición»).
4. **Reconoce el terreno**: ejecuta el preflight de seguridad, lista periodos publicados y categorías disponibles. No asumas tablas ni columnas; comprueba el esquema.
5. **Plan de consultas** en orden de coste: primero estadísticas ya publicadas, después agregados sobre `participants`. Anota el identificador de cada consulta (Q1, Q2…).

Si el usuario pide **ideas**, ve a «Modo explorar» más abajo.

## Fase 2: análisis de datos

- Compara periodos, colegios, nombres, apellidos y otras variables pertinentes.
- Busca **patrones, anomalías, distribuciones y contrastes**.
- Aplica el **doble camino**: confirma cada cifra clave por dos vías (p. ej. estadística publicada y agregado propio) antes de darla por buena.
- **Intenta refutar** primero. Pregunta en cada hallazgo: ¿lo explica el tamaño del grupo?, ¿cambia con otro periodo o denominador?, ¿hay empates?, ¿hay una laguna de datos?
- Cuando un resultado te sorprenda, desconfía antes de celebrarlo.
- Registra cada consulta y resultado en el [registro de evidencias](../assets/evidence-ledger-template.md) en el momento, no al final.

### Ángulos útiles en Tamborradata

| Eje | Preguntas típicas |
| --- | --- |
| Nombres en el tiempo | ¿Quién sube, baja, regresa o desaparece? ¿Cuánto se renueva el top? |
| Concentración | ¿Cuánto pesan los diez primeros? ¿Hay más variedad con el mismo tamaño de edición? |
| Colegios | ¿Qué nombre domina cada colegio? ¿Hay nombres «de colegio»? ¿Qué colegios entran, salen o crecen? |
| Apellidos | ¿Qué apellidos persisten? ¿Hay apellidos que aparecen solo en un colegio? |
| Contrastes | Nombres frente a apellidos; colegios grandes frente a pequeños; periodo global frente a última edición |
| Composición | ¿Cambia el fenómeno o cambia el tamaño/composición de la edición? |
| Singularidad | Longitud de nombres, nombres compuestos, iniciales, rarezas (siempre en agregado) |

Las categorías publicadas (p. ej. `topNames`, `nameTrends`, `newNames`, `commonNameBySchool`, `schoolsEvolution`) están agrupadas en familias; consulta `statistics.family` y `category` en producción para ver cuáles existen en el periodo.

## Fase 3: descubrimiento editorial

Responde por escrito, con datos:

| Pregunta | Respuesta |
| --- | --- |
| ¿Qué ha ocurrido? | |
| ¿Por qué merece contarse? | |
| ¿Qué tiene de sorprendente? | |
| ¿Qué explicación permiten los datos? | |
| ¿Qué información falta? | |
| ¿Qué interpretación sería excesiva? | |

Después aplica el filtro de [editorial-philosophy](editorial-philosophy.md). Si los datos contradicen tu enfoque, **cambia el enfoque**. Decide titular provisional, ángulo y los 3–5 hallazgos que sostendrán la narración.

Resultado negativo ≠ fracaso: «el patrón que esperábamos no existe» puede ser la historia, si explicas por qué parecía existir.

## Modo explorar (ideas)

Cuando piden historias, no inventes ideas: **búscalas**. Entrega 3 a 5 propuestas con:

| Campo | Contenido |
| --- | --- |
| Pregunta | La que responde la historia |
| Hallazgo preliminar | Una cifra o contraste ya observado en datos |
| Consulta que lo respalda | Identificador y fuente |
| Por qué importa | Sorpresa o utilidad para el lector |
| Riesgo | Confusores, lagunas, posibles lecturas excesivas |
| Esfuerzo | Consultas y verificaciones que faltan |

Ordena por (interés periodístico × solidez). Recomienda una. Pregunta cuál desarrollar y **espera**.

## Cuándo parar

- Ya sabes responder la pregunta y has intentado refutarla.
- O los datos no permiten responderla: documenta qué falta y propón otra pregunta.
- Evita explorar sin fin: fija un presupuesto de consultas (orientación: 15–25 para un artículo) y justifica pasarlo.

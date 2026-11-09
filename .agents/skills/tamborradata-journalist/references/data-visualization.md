# Gráficos, tablas y visualizaciones

Para la Capa 2 («La historia en datos»). Cada visualización responde **una pregunta** y deja ver **una afirmación** de la Capa 1. Sin gráficos decorativos ni datos inventados.

**Tono en el artículo:** lo que ve el lector es el gráfico, la tabla o la lista de nombres, con un título que afirma lo que se ve y, como mucho, una frase llana. Nada de justificar el relato, de notas metodológicas ni de identificadores de consulta. La ficha de abajo es material de trabajo que se entrega aparte (informe y registro de evidencias); las definiciones, límites y fuentes se resumen al final del artículo en «Datos utilizados». Prefiere nombres, apellidos y colegios en rankings, comparaciones y evolución antes que tablas densas.

## Ficha obligatoria de cada visualización

| Campo | Contenido |
| --- | --- |
| `id` | `V1`, `V2`… |
| Pregunta | La que responde |
| Respalda | Frase de la Capa 1 (y fila del registro de evidencias) |
| Tipo | Ver tabla de selección |
| Título | Afirma lo que se ve («El peso del top 10 baja de X % a Y %», con X e Y de la consulta) |
| Datos exactos | Tabla `x/y` con todos los valores |
| Periodo y población | Ediciones incluidas y excluidas |
| Ejes y unidades | Qué mide cada eje; unidad; si empieza en cero |
| Fuente | Tamborradata, estadística o consulta (Qn), `run_id`/versión |
| Notas metodológicas | Definiciones, lagunas, base de comparación |
| Interpretación breve | Una o dos frases que no excedan lo que muestran los datos |
| Accesibilidad | Texto alternativo y tabla equivalente |

Hay un formato JSON de apoyo en la [plantilla de evidencias](../assets/evidence-ledger-template.md).

## Qué gráfico elegir

| Pregunta | Gráfico | Bloque web equivalente |
| --- | --- | --- |
| ¿Cómo evoluciona X en el tiempo? | Línea (una o pocas series) | `seriesChart` |
| ¿Cómo se ordenan las categorías? | Barras horizontales ordenadas | `horizontalBarChart` |
| ¿Qué parte del total es X? | Waffle o barra al 100 % | `waffleChart` |
| ¿Cómo se reparte entre grupos? | Histograma o distribución | `distributionChart` |
| ¿Cómo se comparan dos momentos o dos grupos? | Pareja destacada | `compare` |
| ¿Qué valores exactos hay? | Tabla | `dataTable` |
| ¿Qué entidades cumplen una condición? | Lista de etiquetas con valor | `chipList` |
| ¿Cómo se descompone un nombre o apellido? | Desglose de componentes | `tokenBreakdown`, `variantGroups` |
| ¿Cuáles son los pasos de un proceso? | Pasos | `steps` |

## Reglas de diseño

- Las barras empiezan en cero. Las líneas pueden no hacerlo, pero indícalo.
- Un eje, una unidad. Nada de doble eje.
- Máximo 4–5 series; destaca la protagonista y atenúa el resto.
- Etiqueta directamente (nombre al final de la línea) si es posible; evita leyendas lejanas.
- Ordena las barras por valor, no alfabéticamente, salvo que la pregunta sea de búsqueda.
- Años sin datos: deja el hueco, no interpoles ni unas el punto anterior con el siguiente sin avisar.
- No mezcles en un gráfico ediciones parciales y completas sin marcarlas.
- Para tamaños distintos usa cuotas (por mil, %) y di la base; muestra el recuento absoluto en tabla.
- Tablas: ordenadas, con unidades, máximo unas 15 filas visibles; el resto, en la versión descargable.
- Color por significado (destacado vs. contexto), nunca solo por estética; comprueba contraste y que el gráfico se entienda sin color.

Si dispones de la skill `dataviz`, consúltala antes de producir el código de un gráfico y respeta el sistema de color del proyecto (variables de `globals.css`).

## Salida por modo

| Modo | Entrega |
| --- | --- |
| Redactar / Evidencias | Fichas de visualización + datos exactos en tabla/JSON. No modifiques el frontend |
| Vista previa | Si el usuario quiere verlo, genera una página/artefacto independiente a partir de los mismos datos |
| Implementar | Convierte cada ficha en bloques `ArticleContent` del artículo (ver [publishing-workflow](publishing-workflow.md)) reutilizando los componentes existentes |

## Reglas de coherencia

- Cada cifra del gráfico debe aparecer en el registro de evidencias.
- Los valores del texto y del gráfico coinciden al redondear igual.
- El título del gráfico no afirma más que la Capa 1.
- Si un gráfico no respalda ninguna afirmación, no entra.

## Calidad de un buen gráfico en este contexto

| Pregunta de control | Debe ser «sí» |
| --- | --- |
| ¿Se entiende en cinco segundos? | |
| ¿La Capa 1 sería menos sólida sin él? | |
| ¿Los datos son exactos y reproducibles? | |
| ¿Las limitaciones están a la vista? | |
| ¿Es accesible (texto alternativo, tabla)? | |

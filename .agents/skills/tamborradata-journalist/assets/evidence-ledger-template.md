# Registro de evidencias

Una fila por consulta y una por afirmación con cifra. Se rellena **mientras se investiga**, no al final.

## 1. Preflight de solo lectura

| Comprobación | Resultado |
| --- | --- |
| Servidor MCP usado | |
| `read_only=true` verificado en | |
| Identidad del proyecto verificada (`production-db`) | |
| Garantía de que no hay escritura disponible | |
| Fecha | |

## 2. Consultas

| ID | Propósito | SQL exacto | Periodo / run (`public_slug`, `version_number`) | Filas | Lint | Resumen del resultado |
| --- | --- | --- | --- | --- | --- | --- |
| Q1 | | | | | ok | |

## 3. Afirmaciones

| ID | Afirmación (como en el texto) | Cifra | Consulta | Denominador | Tipo | Estado | Notas |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E-01 | | | Q1 | | dato / hipótesis / externa | verificada | |

Estados: `verificada`, `reformulada`, `eliminada`, `hipótesis`, `externa-verificada`.

## 4. Conciliaciones

| Agregado propio | Estadística publicada | Coincide | Si no, motivo |
| --- | --- | --- | --- |

## 5. Hipótesis refutadas o no confirmadas

| Hipótesis | Prueba | Resultado |
| --- | --- | --- |

## 6. Formato JSON de una visualización

```json
{
  "id": "V1",
  "question": "¿Cómo ha cambiado el peso de los diez primeros?",
  "supports": "E-03",
  "type": "line",
  "title": "<título que afirma lo que se ve>",
  "period": "<ediciones incluidas>",
  "excluded": ["<edición> (motivo)"],
  "population": "<definición de la población>",
  "axes": { "x": "Edición", "y": "% de los participantes", "yStartsAtZero": false },
  "series": [
    { "id": "s1", "label": "<serie>", "points": [{ "x": 0, "y": 0 }] }
  ],
  "source": { "queries": ["Q3"], "run": "<public_slug · version_number>" },
  "notes": "<lagunas, supresión y base de comparación>",
  "interpretation": "<una o dos frases>",
  "altText": "<descripción para lectores de pantalla>"
}
```

Sustituye los valores marcados con `<…>` y los ceros del ejemplo por datos reales de una consulta registrada.

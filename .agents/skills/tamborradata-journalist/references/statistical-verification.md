# Verificación estadística y fact-checking

Para las fases 2 y 7. Una afirmación falsa o no verificada sobre un hecho fundamental **bloquea la publicación**.

## Antes de calcular: define las cosas

| Concepto | Define y resume en «Datos utilizados» |
| --- | --- |
| Unidad | Participación (una fila por niño y edición), no persona. No hay identificador estable de niño |
| Nombre | Primer nombre, nombre principal, nombre compuesto (¿Jon Ander cuenta como Jon?) |
| Apellido | Uno o dos por participante, partículas, normalización |
| Colegio | `schools` (identidad por `id`), no «compañía» |
| Periodo | Edición, rango o global; qué años tienen datos |
| Población | Todos los participantes de la edición o solo los resueltos |

## Reglas de datos

1. **Nunca inventes una cifra.** Todo número del texto procede de una consulta registrada.
2. **No completes años sin datos.** Un hueco es un hueco; dilo («no hay datos de 2009, 2010 ni 2021» en el precedente del proyecto; reverifícalo).
3. **Participantes únicos ≠ registros de participación.** Si cuentas niños, explica cómo; si no puedes, habla de participaciones.
4. **Colegios ≠ compañías.** Usa el término que respalde el esquema.
5. **No mezcles periodos.** Compara siempre mismo tipo de periodo y misma definición; no pongas el ranking de un año junto a otro de otra base.
6. **Denominadores.** Para cada porcentaje anota el denominador y que sea el mismo en toda la comparación.
7. **Absoluto y relativo.** Di cuál es. Distingue puntos porcentuales de porcentaje de cambio.
8. **Normalización.** Tildes, mayúsculas, variantes (Xabier/Javier, Iñaki/Ignacio, Ane/Ana) y compuestos pueden contarse aparte; declara el criterio.
9. **Empates.** Antes de decir «el primero», «el único», «ningún otro», comprueba si hay empate; ordena con un criterio determinista y menciónalo.
10. **Calidad del run.** Usa el run publicado del periodo y anota `version_number`/`data_version`. Si un run está `stale`, no lo uses sin avisar.
11. **Datos parciales.** Las ediciones incompletas no son comparables: sácalas de las series o márcalas.
12. **Datos personales.** Agregados, sin nombres completos; suprime resultados menores de 5 y las celdas complementarias que permitan deducirlos.

## Cuatro defensas contra la ilusión estadística

### Línea base por azar (tamaño de los grupos)
Un «primer puesto» en un grupo pequeño se decide por pocos casos y se parece menos al conjunto. Antes de decir que algo se concentra o se dispersa, calcula qué cabría esperar **por azar** dado el tamaño de cada grupo (cuota esperada = cuota global; simulación o remuestreo si hace falta) y compara.

### Composición
Si la edición cambia de tamaño, cambia el número de nombres distintos aunque los gustos no cambien. Compara a **igualdad de tamaño** (muestreo del tamaño de la lista menor) o con cuotas, no con cifras brutas.

### Robustez
Repite el resultado con otra ventana de años, otro corte (top 10 → top 20), otro subconjunto de colegios o sin la edición dudosa. Si cambia, di que depende.

### Refutación activa
Escribe el contraejemplo más plausible y búscalo. Registra el resultado, aunque no confirme tu hipótesis.

## Significación descriptiva

No hagas inferencia formal sobre una población mayor; describe. Aun así:

- No interpretes diferencias de 1–2 casos como tendencia.
- Con menos de unas 10 observaciones por grupo, habla de recuentos, no de porcentajes.
- No sobreinterpretes cambios de posición en rankings con valores casi iguales: compara los valores.
- Señala cuándo una diferencia cabe en el ruido esperable.

## Correlación y causalidad

Prohibido atribuir causa a una asociación. Fórmulas admitidas: «coincide con», «va de la mano de», «los datos no permiten decir por qué». Una causa propuesta sin evidencia directa debe etiquetarse como hipótesis o suprimirse. No generalices a «todos los niños de Donostia» desde participantes de la Tamborrada.

## Conciliación

Antes de usar un agregado propio, compáralo con la estadística publicada equivalente (p. ej. total de participaciones de un año). Si no coinciden, averigua por qué (estados de resolución incluidos, ediciones parciales, versión del run) y documenta la diferencia. Sin conciliación no hay cifra.

## Registro de evidencias

Mantén una fila por afirmación con cifra:

| ID | Afirmación (palabras del texto) | Cifra | Consulta | Periodo / run | Verificada por | Estado |
| --- | --- | --- | --- | --- | --- | --- |

Plantilla en [assets/evidence-ledger-template.md](../assets/evidence-ledger-template.md). Estados: `verificada`, `reformulada`, `eliminada`, `hipótesis`, `externa-verificada`.

## Fact-checking del artículo (fase 7)

Recorre la Capa 1 frase a frase y marca cada elemento comprobable:

| Elemento | Comprobación |
| --- | --- |
| Nombres y apellidos | Escritura exacta, tildes, normalización declarada |
| Colegios | Nombre canónico actual; no «compañía» |
| Fechas y periodos | Edición correcta; años sin datos señalados |
| Rankings y posiciones | Mismo periodo, empates revisados, orden determinista |
| Porcentajes y «x de cada y» | Denominador y redondeo |
| Comparaciones | Misma base y definición en ambos lados |
| Afirmaciones históricas o culturales | Fuente externa citada y fecha; si no hay, se elimina |
| Interpretaciones | ¿Los datos las respaldan o son hipótesis? |
| Cuantificadores («ninguno», «siempre», «la mayoría») | Se cumplen en todos los casos con datos |

Clasifica cada afirmación:

- **Dato de Tamborradata** → con consulta.
- **Fuente externa** → con cita; si no se puede verificar, fuera.
- **Hipótesis** → marcada en el texto como tal («una posible explicación…») o suprimida.

Si una afirmación no está respaldada: **elimínala o reformúlala**. Repite el recorrido tras cada edición.

## Bloqueos (ver también [editorial-review](editorial-review.md))

- Cifra sin consulta o que no concilia.
- Entidad confundida (colegio por compañía, participaciones por personas).
- Comparación de periodos con bases distintas.
- Causalidad sin evidencia.
- Dato personal identificable de un menor.

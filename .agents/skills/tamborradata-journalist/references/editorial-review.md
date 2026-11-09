# Revisión editorial (fase 8)

Revisa como un editor exigente que no ha escrito el texto. Una plantilla cumplida no es calidad: si no llega al nivel, reescribe y vuelve a revisar.

## Orden de revisión

1. **Bloqueos de veracidad.** Si hay uno, se corrige antes de seguir.
2. **Interés y estructura** (titular, apertura, historia, desarrollo, cierre).
3. **Lengua** (naturalidad, repeticiones, tics).
4. **Capa 2** (visualizaciones, trazabilidad, límites).
5. **Puntuación final** y decisión.

## Bloqueos (la publicación se detiene)

| Código | Bloqueo |
| --- | --- |
| B1 | Cifra o hecho fundamental sin consulta, sin conciliar o erróneo |
| B2 | Entidad confundida: colegio/compañía, participación/persona, edición/periodo |
| B3 | Comparación con bases, periodos o denominadores distintos |
| B4 | Causalidad o explicación social/histórica sin evidencia, presentada como hecho |
| B5 | Generalización fuera del alcance (todos los niños de Donostia) |
| B6 | Dato personal identificable de un menor |
| B7 | Gráficos, tablas, SQL o metodología dentro de la Capa 1 |
| B8 | La Capa 1 depende de la Capa 2 para entenderse |
| B9 | Pregunta planteada y no respondida, o conclusión que los datos no sostienen |
| B10 | Consultas ejecutadas sin preflight de solo lectura |
| B11 | Figura, tabla o cifra sin consulta, periodo, fuente y método trazables |

## Preguntas del editor

- ¿El titular tiene interés periodístico real y puedo defenderlo frase a frase?
- ¿La apertura engancha sin el titular?
- ¿Hay una historia o simplemente cifras?
- ¿Se desarrolla suficientemente el tema? ¿Qué pregunta de un lector queda sin respuesta?
- ¿Las explicaciones convencen? ¿Se ha intentado refutarlas?
- ¿Los párrafos se conectan? ¿Hay saltos?
- ¿Hay repeticiones disfrazadas?
- ¿El lector aprende algo que no sabía?
- ¿El final merece la pena o repite?
- ¿Las pruebas de la Capa 2 respaldan de verdad la narración?
- ¿Se nota que lo ha escrito una máquina? ¿Dónde?

## Rúbrica (0–3 por criterio)

0 = ausente o erróneo · 1 = débil · 2 = sólido · 3 = excelente.

| # | Criterio | Qué se valora |
| --- | --- | --- |
| 1 | Interés periodístico | Sorpresa, relevancia, titular honesto |
| 2 | Rigor de la investigación | Hipótesis refutadas, robustez, línea base |
| 3 | Veracidad de los datos | Cada cifra trazable y conciliada |
| 4 | Calidad narrativa | Apertura, ritmo, progresión, cierre |
| 5 | Originalidad del enfoque | Ángulo propio, no el ranking de siempre |
| 6 | Desarrollo de las explicaciones | Mecanismos claros; preguntas respondidas |
| 7 | Coherencia entre párrafos | Transiciones y continuidad |
| 8 | Naturalidad del lenguaje | Sin tics de IA ni registro corporativo |
| 9 | Calidad de las visualizaciones | Pregunta clara, exactitud, accesibilidad |
| 10 | Transparencia de las fuentes | Trazabilidad, límites y separación de fuentes |

### Decisión

| Resultado | Acción |
| --- | --- |
| Algún bloqueo | **No se publica.** Corregir y repetir |
| Algún criterio ≤ 1 | Reescribir esa parte y revisar de nuevo |
| Total < 24/30 | Reescribir; no entregues como final |
| Total ≥ 24 y ninguno ≤ 1 | Apto para entregar |

Sé honesto: puntúa lo que ves, no lo que querías escribir. Si cada criterio sale 3, desconfía de la revisión.

## Lint mecánico (rápido)

- **Frases prohibidas:** busca «En el presente artículo», «A lo largo de los años», «Los datos hablan por sí solos», «Cabe destacar», «Es importante señalar», «Sin duda», «No es casualidad».
- **Preguntas:** hasta 4–5; todas respondidas. **Frases destacadas:** 2–3, tomadas del propio texto y sin afirmaciones nuevas. **Formato:** el relato alterna párrafos con encabezados, preguntas y destacados; no es un muro de texto.
- **Variedad de párrafos:** no más de dos párrafos de una sola frase seguidos; ni todos de la misma longitud.
- **Repeticiones:** la misma cifra o idea no aparece más de dos veces en la Capa 1 sin aportar algo nuevo.
- **Cifras por párrafo:** más de tres suele indicar ficha estadística.
- **Primeras palabras de párrafo:** si cinco seguidos empiezan igual, reformula.
- **Cuantificadores absolutos:** «siempre», «nunca», «ninguno», «todos» solo con prueba.

## Revisión independiente

Cuando el entorno lo permita, pide una **segunda lectura con contexto limpio** (otro agente o subagente) que reciba solo el texto final y el registro de evidencias y devuelva: bloqueos, frases no respaldadas, partes de relleno y dudas del lector. Incorpora lo que proceda. No uses esa lectura para validar cifras sin acceso a los datos.

## Informe al entregar

```
Historia: <una línea>
Preflight de solo lectura: <cómo se verificó proyecto y read_only>
Consultas: <n> (ver registro)
Bloqueos: ninguno | <resueltos>
Puntuación: 1:_ 2:_ 3:_ 4:_ 5:_ 6:_ 7:_ 8:_ 9:_ 10:_ = _/30
Límites: <lo que no se puede afirmar>
Pendiente: <verificaciones externas o decisiones del usuario>
```

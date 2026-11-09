# Estructura del artículo en dos capas

Contrato de formato. Plantilla lista para copiar en [assets/article-template.md](../assets/article-template.md).

## Regla

El artículo es la historia (Capa 1). Los datos se ven en la Capa 2, que **muestra** lo que cuenta la Capa 1 sin justificarla, sustituirla ni repetirla en formato estadístico. Al final del todo, «Datos utilizados».

## Capa 1: artículo periodístico completo

Contiene **solamente**:

- Titular.
- Subtítulo o entradilla, si aporta valor.
- Párrafos narrativos con las cifras importantes integradas.
- Encabezados (`heading`, un solo nivel, sin H3) cuando faciliten la comprensión. Pueden ser afirmaciones o preguntas que el texto siguiente responde.
- Preguntas al lector dentro del texto y como encabezados, todas respondidas.
- Dos o tres frases destacadas (`hilightedText`): una idea o dato fuerte, sacada literalmente del propio texto, que se pueda leer sola. Nunca introducen una afirmación nueva.
- Desarrollo, explicaciones, contexto verificado y conclusión.

No contiene: gráficos, tablas, rankings visuales, listas, SQL, nombres de tablas, metodología ni jerga estadística (p. ej. «denominador», «permutación»).

Prueba del lector: alguien que lea **solo** la Capa 1 debe entender el descubrimiento, la explicación y sus límites.

### Titular

- Contiene un hecho o una tensión verificable, no una etiqueta («Estadísticas de nombres»).
- Máximo unos 90 caracteres; evita mayúsculas y signos de exclamación.
- No promete lo que el texto no entrega. Si es pregunta, el texto la responde.
- Respeta el alcance: «entre los participantes de la Tamborrada Infantil», no «en Donostia» salvo que el sujeto sea la propia Tamborrada.
- Prepara 3 alternativas y elige la más precisa, no la más ruidosa.

### Entradilla

Opcional. Una o dos frases que añadan algo que el titular no dice. Si repite el titular, quítala.

### Cuerpo

- Orientación: **7 a 12 párrafos sustanciales**, o más si la investigación lo necesita. No se trata de cumplir un número: ningún párrafo existe para alargar.
- Varía el formato: no es un muro de párrafos. Alterna párrafos, encabezados, preguntas que abren una sección y frases destacadas, sin que ninguno se vuelva tic.
- Cada encabezado introduce una fase de la comprensión (hecho → contraste → explicación → matiz → alcance).
- Las cifras esenciales viven aquí, dentro de las frases.

## Capa 2: La historia en datos

Empieza solo cuando la Capa 1 está completa. Encabezado: `## La historia en datos`. Es la parte que el lector **ve**: gráficos, tablas y nombres que muestran lo que cuenta el relato. Suma valor; no justifica.

- Cada pieza (gráfico, tabla o lista de nombres) lleva un título que afirma lo que se ve y, como mucho, una frase de contexto en lenguaje llano.
- Sin tono de defensa («como demuestra…», «esto respalda…»), sin metodología, sin identificadores de consulta ni notas técnicas. Todo eso va al final, en «Datos utilizados».
- Prefiere lo visible: nombres, apellidos o colegios en listas, rankings, comparaciones y evolución temporal. Una tabla solo si enseña algo que el gráfico no.
- Agregados; sin datos personales ni celdas menores de 5.
- Si una pieza no deja ver algo que dice el relato o no añade algo nuevo y curioso, no entra. Especificación en [data-visualization](data-visualization.md).

## Datos utilizados (siempre al final)

Último apartado del artículo, tras la Capa 2. Encabezado: `## Datos utilizados`. Breve y en lenguaje claro:

- Qué datos de Tamborradata se usaron: estadísticas, ediciones, población (participaciones, no personas) y fecha de consulta.
- Cómo se cuenta lo esencial (una participación, un nombre) y qué límites tienen los datos.
- Privacidad: resultados menores de 5 suprimidos.
- Fuentes externas, si las hay, separadas de las de Tamborradata y marcadas como verificadas. Se publican en un bloque `sources` que va **el último del artículo**, justo después del texto de este apartado; si no hay fuentes externas verificadas, se omite el bloque. Solo entran fuentes realmente consultadas y comprobadas, nunca decorativas.

La trazabilidad completa (afirmación → resultado → consulta) vive en el [registro de evidencias](../assets/evidence-ledger-template.md), que se entrega aparte y no forma parte del texto publicado.

## Reglas de coherencia entre capas

| Capa 1 dice | El artículo debe tener |
| --- | --- |
| Una cifra | Fila en el registro de evidencias y, si procede, en una tabla de la Capa 2 |
| Un cambio o patrón | Un gráfico o tabla que lo muestre en la Capa 2 |
| Un límite («no permiten decir por qué») | Su explicación en «Datos utilizados» |
| Una comparación | Misma base y mismo periodo en ambos lados |

Nada que sea necesario para entender la historia puede estar **solo** en la Capa 2 o en «Datos utilizados».

## Longitud

La extensión depende de la complejidad. Un artículo largo puede ser malo si repite ideas; uno corto, excelente si resuelve una pregunta concreta. Si el texto crece porque aparecen nuevas ideas, bien; si crece repitiendo, corta.

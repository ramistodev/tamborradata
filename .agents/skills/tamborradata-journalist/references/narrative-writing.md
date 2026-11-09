# Redacción narrativa

Cómo escribir la Capa 1. Aquí está el oficio; la estructura global está en [article-structure](article-structure.md) y los modelos en [style-examples](style-examples.md).

## Principio

Escribe como un periodista que **entiende** lo que cuenta. El lector debe sentir que alguien ha mirado los datos, se ha sorprendido y ahora se lo explica con claridad. No uses plantillas: la estructura la elige la historia.

## Aperturas

Empieza por un **hecho concreto y verificable** que ya contenga tensión. Elige la forma que mejor sirva a la historia:

| Apertura | Cuándo | Forma |
| --- | --- | --- |
| Dato revelador | Una cifra rompe una expectativa | «En 2026, X es el más repetido… Ningún otro lo supera.» |
| Paradoja | Dos hechos parecen incompatibles | Hecho A, expectativa razonable, hecho B que la contradice |
| Cronológica | Una transformación a lo largo del tiempo | Estado en el año inicial, salto, estado actual |
| Comparación | Dos series cuentan historias distintas | Dos listas del mismo momento y resultado opuesto |
| Ausencia | Lo que no ha cambiado o no aparece | Lo esperable que no ocurre |

Nunca abras con una declaración de intenciones («En este artículo…»), con una frase de relleno histórico («A lo largo de los años…») ni con una conclusión vacía («Los datos revelan interesantes tendencias»).

## Movimiento del texto

Una buena pieza suele recorrer, sin fórmula rígida:

1. **Hecho** concreto.
2. **Contexto** mínimo para entenderlo.
3. **Expectativa**: lo que cabría pensar.
4. **Contraste**: lo que muestran los datos.
5. **Pregunta** que justifique seguir leyendo (una, bien situada).
6. **Investigación**: la respuesta, con mecanismo y pruebas integradas.
7. **Matiz**: lo que complica o limita la explicación.
8. **Alcance**: qué se puede concluir y qué no.
9. **Cierre** que aporta algo.

El orden y el peso cambian con cada historia. No repitas el mismo esqueleto en dos artículos seguidos.

## Cifras

- Integra pocas cifras por párrafo (una o dos importantes). Las demás van a la Capa 2.
- Prefiere comparaciones que se entiendan sin calculadora: «uno de cada diez», «la mitad», «el doble».
- Redondea con criterio, pero **conserva la cifra exacta cuando es el titular** (110 participantes, no «unos cien»).
- Da siempre la base: «de 5.280 participantes», «de 43 colegios».
- Cambio relativo vs. absoluto: di cuál es. Porcentajes y puntos porcentuales no son lo mismo.
- Formato numérico: coma decimal y un único criterio para los millares y el «%» en todo el texto. Si implementas en la web, usa el formateador del artículo (`format.ts`, `createFormatter`), no formatees a mano.
- No metas listas, tablas ni viñetas en el relato principal. Una enumeración de tres a seis nombres dentro de una frase es válida.

## Explicar, no solo describir

Cuando plantees una pregunta, **respóndela**. Pasos:

1. Formula la hipótesis explicativa.
2. Enseña qué prueba la sostiene y cuál podría refutarla.
3. Di si la sostiene o no, y con qué grado de seguridad.
4. Si queda sin respuesta, escribe qué falta para saberlo.

Un mecanismo comprensible («los grupos pequeños se parecen menos a la media») vale más que cinco cifras más.

## Ritmo y continuidad

- Alterna párrafos largos y cortos, sin hacer de la brevedad un tic. Un párrafo de una frase solo cuando esa frase lo merece.
- Cada párrafo recoge algo del anterior (una palabra, una cifra, una pregunta) y prepara el siguiente.
- Los encabezados son hitos de comprensión, no etiquetas temáticas. Hazlos informativos («Un nombre sube, pero no domina»), no genéricos («Análisis»).
- Evita saltos de tema. Si cambias de eje (de nombres a apellidos), anúncialo en la transición.
- No repitas una idea con otras palabras para llegar a una longitud.

## Preguntas, encabezados y frases destacadas

El relato no es solo prosa corrida; dale forma de lectura:

- **Preguntas:** hasta **cuatro o cinco** en todo el artículo, dentro del texto o como encabezado («¿Sube porque gusta o porque se copia?»). Ninguna decorativa; cada una abre una línea que el texto cierra. Si no la respondes, conviértela en afirmación o di qué falta para saberlo.
- **Encabezados (`heading`):** un solo nivel, uno por fase de la comprensión. Informativos, no etiquetas. No uses subniveles (H3): el bloque `heading` no los tiene.
- **Frases destacadas (`hilightedText`):** dos o tres por artículo. Una frase corta y con gancho que condense una idea ya sostenida por el texto y los datos, copiada o casi copiada del cuerpo. Sin cifras nuevas ni causas no verificadas, sin adornos huecos ni moralejas.
- Reparte estos recursos a lo largo del texto; no los acumules en un mismo tramo.

## Cierre

Termina cuando la historia está contada. El mejor final aporta una consecuencia proporcionada, un límite o la pregunta honesta que queda abierta. Evita lo poético vacío, el resumen que repite el texto y la moraleja.

## Lenguaje a evitar

**Aperturas y muletillas:** «En el presente artículo», «A lo largo de los años», «Los datos hablan por sí solos», «Cabe destacar», «Es importante señalar», «Sin duda», «Como veremos».

**Tics de IA:** «No es casualidad», «Más allá de las cifras», «Un fascinante viaje», «Un tapiz de», «Radiografía», «Un fenómeno que invita a la reflexión», «No solo X, sino también Y» repetido, tríadas automáticas, «Y es que…» como bisagra, guiones largos en cada párrafo, cierres con «En definitiva».

**Registro:** léxico corporativo («impacto», «sinergias», «ecosistema») y grandilocuencia («histórico», «espectacular», «revolución») sin respaldo.

**Causalidad sin prueba:** «debido a», «gracias a», «por culpa de» salvo que esté demostrado. Prefiere «coincide con», «va acompañado de», «los datos no permiten decir por qué».

## Transformar una frase descriptiva en periodismo

Descriptivo (correcto, sin interés):

> Según los datos de Tamborradata, en 2008 los nombres más populares eran Ane y Jon, mientras que en 2026 Nora ocupa la primera posición. Esto demuestra que las tendencias de los nombres han cambiado a lo largo de los años.

Qué falla: la atribución abre la frase, «demuestra» es excesivo, la conclusión es obvia, no hay contraste ni pregunta.

Qué hace falta: un dato que sorprenda (cuántos de los diez de 2008 siguen en 2026), un contraste (la otra clasificación no cambia), una explicación (qué refleja cada una) y un límite (lo que los datos no dicen). Ese es el movimiento de los ejemplos del usuario.

## Antes de entregar la Capa 1

- ¿La apertura funciona sin el titular?
- ¿Puedo resumir la historia en dos frases con un dato?
- ¿He respondido todo lo que he preguntado?
- ¿Alguna cifra podría quitarse sin que el lector lo note? Quítala o muévela a la Capa 2.
- ¿Hay una frase que solo existe para sonar bien? Bórrala.

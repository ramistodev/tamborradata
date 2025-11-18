# Política de Seguridad

Esta política describe cómo deben reportarse las vulnerabilidades encontradas en
la plataforma web Tamborradata y qué se considera dentro o fuera del alcance de
seguridad del proyecto.

Agradezco enormemente que cualquier persona que detecte un fallo lo notifique de
forma responsable y privada.

---

## Versiones con soporte

Este repositorio recibe correcciones de seguridad únicamente sobre la versión
más reciente del código publicada en GitHub.

Si utilizas una versión anterior o un fork, asegúrate de actualizarlo antes de
reportar un problema.

---

## Cómo reportar una vulnerabilidad

Si encuentras una vulnerabilidad **no abras un issue público**.

En su lugar, por favor informa del problema mediante alguno de los siguientes
métodos:

### 🔐 Opción recomendada:

**→ GitHub Security Advisories**  
https://github.com/ramistodev/tamborradata/security/advisories/new

### ✉️ Alternativa:

Contacta por mensaje privado a través de mi perfil de GitHub:  
https://github.com/ramistodev

Por motivos de seguridad, **no se deben publicar detalles de vulnerabilidades en
lugares públicos** hasta que se haya revisado y corregido adecuadamente.

---

## Qué incluir en el reporte

Para poder evaluar correctamente el fallo, incluye:

1. Descripción clara de la vulnerabilidad
2. Pasos para reproducirla
3. Comportamiento esperado vs. comportamiento real
4. Impacto potencial (filtración de datos, corrupción, bypass de seguridad, etc.)
5. Entorno usado (navegador, SO, versión de Node, etc.)
6. Prueba de concepto o captura de pantalla si es posible

Me comprometo a:

- Responder en un plazo aproximado de **48–72 horas**
- Realizar una primera evaluación tan pronto como sea posible
- Coordinar la corrección del problema y su divulgación responsable

---

## Áreas que se consideran dentro del alcance de seguridad

Se consideran problemas de seguridad válidos:

- Errores en los endpoints de la API (Next.js)
- Problemas en las políticas RLS de Supabase
- Exposición inesperada de datos de las tablas
- Fallos de validación de entradas
- Comportamientos inseguros en caching, fetch o lógica del frontend
- Fugas de información sensible
- Configuración incorrecta de cabeceras o CORS
- Cualquier problema que permita alterar datos o romper la integridad del sistema

---

## Fuera del alcance

No se consideran vulnerabilidades:

- Bugs visuales o de estilo (CSS, UI)
- Falta de funciones o mejoras de UX
- Errores derivados de configurar mal Supabase en local
- Problemas en forks o versiones modificadas
- Vulnerabilidades en dependencias externas sin posibilidad de explotación dentro del proyecto
- Comportamientos esperados en entornos de desarrollo

---

## Divulgación responsable

Si la vulnerabilidad es confirmada:

- Se corregirá lo antes posible
- Se publicará un aviso de seguridad oficial en GitHub
- Se reconocerá a la persona que la reportó (si así lo desea)

---

Gracias por contribuir a la seguridad de Tamborradata.  
Tu colaboración ayuda a que la plataforma sea más fiable y segura para toda la comunidad.

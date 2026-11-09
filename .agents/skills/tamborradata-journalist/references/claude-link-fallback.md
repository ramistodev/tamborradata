# Fallback del enlace de Claude en Windows

La ruta canónica es `.agents/skills/tamborradata-journalist/`. La ruta de Claude debe ser un enlace simbólico relativo con destino `../../.agents/skills/tamborradata-journalist`.

En Windows sin privilegios de enlace simbólico, el fallback determinista es una unión NTFS (junction) en `.claude/skills/tamborradata-journalist` que apunte a la ruta canónica. No se copia ningún archivo: ambas rutas acceden al mismo directorio.

Ejecuta `node scripts/sync-skill.mjs`. El script intenta primero el enlace simbólico relativo y solo crea la unión NTFS si el sistema lo rechaza. El validador acepta ambos casos y comprueba que el destino resuelto es el directorio canónico. En un entorno con permisos de symlink, elimina la unión y vuelve a ejecutar el script para recuperar el enlace relativo exigido.

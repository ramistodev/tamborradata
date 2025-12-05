# Mock Data - Datos Sintéticos para Desarrollo

Esta documentación explica la **estructura y contenido de los datos sintéticos** incluidos en `mocked_data/` para facilitar el desarrollo local de Tamborradata.

---

## 📋 Índice

- [Visión General](#visión-general)
- [Archivos Incluidos](#archivos-incluidos)
- [Schema SQL](#schema-sql)
- [Datos de Estadísticas](#datos-de-estadísticas)
- [Datos de Participantes](#datos-de-participantes)
- [Cómo Importar](#cómo-importar)
- [Limitaciones](#limitaciones)

---

## Visión General

El directorio `mocked_data/` contiene **datos sintéticos** que permiten levantar Tamborradata localmente sin necesidad de acceso a la base de datos de producción.

### **¿Por qué datos mock?**

1. **Desarrollo local** → Trabajar sin conexión a producción
2. **Testing** → Datos consistentes para pruebas
3. **Onboarding** → Nuevos colaboradores pueden empezar rápido
4. **Demostración** → Mostrar funcionalidad sin exponer datos reales

### **Características**

- ✅ **Nombres ficticios** → Generados aleatoriamente
- ✅ **Estructura idéntica** → Mismo schema que producción
- ✅ **Datos completos** → Estadísticas + participantes + años
- ✅ **RLS configurado** → Seguridad activa
- ✅ **Fácil importación** → SQL + CSV listos para usar

> [!IMPORTANT]
> Todos los nombres y datos son **ficticios**. Cualquier similitud con personas reales es **puramente coincidental**.

---

## Archivos Incluidos

```
mocked_data/
├── tamborradata_schema.sql   # Schema completo de BD
├── statistics.csv             # Datos de estadísticas (3 años)
└── participants.csv           # 100 participantes ficticios
```

---

## Schema SQL

### **Archivo: `tamborradata_schema.sql`**

Este archivo contiene la **definición completa** de la base de datos:

#### **1. Tabla `statistics`**

Almacena estadísticas agregadas por año y categoría.

```sql
CREATE TABLE statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,          -- Ej: 'participation', 'top_names'
  scope text NOT NULL,              -- Ej: 'general', 'boys', 'girls'
  year text NOT NULL,               -- Ej: '2024', '2025', 'global'
  public_data jsonb,                -- Datos públicos (limitados)
  full_data jsonb,                  -- Datos completos (ampliados)
  summary text,                     -- Descripción textual
  created_at timestamp DEFAULT now() NOT NULL,
  UNIQUE (category, scope, year)
);
```

**Columnas clave:**

| Columna       | Tipo    | Descripción                                          |
| ------------- | ------- | ---------------------------------------------------- |
| `category`    | `text`  | Tipo de estadística (participation, top_names, etc.) |
| `scope`       | `text`  | Alcance (general, boys, girls, comparison)           |
| `year`        | `text`  | Año o 'global'                                       |
| `public_data` | `jsonb` | Datos resumidos para UI                              |
| `full_data`   | `jsonb` | Datos completos para expandir                        |

#### **2. Tabla `available_years`**

Lista de años con datos disponibles.

```sql
CREATE TABLE available_years (
  year text UNIQUE PRIMARY KEY,
  is_ready boolean DEFAULT FALSE NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);
```

**Ejemplo de datos:**

| year   | is_ready |
| ------ | -------- |
| 2024   | true     |
| 2025   | true     |
| global | true     |

#### **3. Tabla `participants`**

Participantes individuales de la Tamborrada.

```sql
CREATE TABLE participants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,               -- Nombre completo
  school text NOT NULL,             -- Colegio/compañía
  article_date text NOT NULL,       -- Fecha de publicación
  year integer NOT NULL,            -- Año de participación
  url_id uuid NOT NULL,             -- ID único de URL
  created_at timestamp DEFAULT now() NOT NULL,
  UNIQUE (name, school, article_date)
);
```

**Restricción UNIQUE:** Previene duplicados de (nombre + colegio + fecha).

#### **4. Tabla `sys_status`**

Estado del sistema (actualización).

```sql
CREATE TABLE sys_status (
  id integer PRIMARY KEY DEFAULT 1,
  is_updating boolean DEFAULT FALSE NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  notes text
);
```

**Singleton:** Solo existe 1 fila con `id = 1`.

#### **5. Vista `available_companies_view`**

Vista para obtener colegios disponibles.

```sql
CREATE OR REPLACE VIEW public.available_companies_view
WITH (security_invoker = on) AS
SELECT DISTINCT school AS company_names
FROM participants
ORDER BY company_names;
```

**Uso:** Autocompletado en búsqueda de participantes.

#### **6. Row Level Security (RLS)**

```sql
-- Activar RLS en todas las tablas
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE sys_status ENABLE ROW LEVEL SECURITY;

-- Políticas de solo lectura
CREATE POLICY "Anon read access on statistics"
ON statistics FOR SELECT TO anon USING (true);

CREATE POLICY "Anon read access on available_years"
ON available_years FOR SELECT TO anon USING (true);

CREATE POLICY "Anon read access on participants"
ON participants FOR SELECT TO anon USING (true);

CREATE POLICY "Anon read access on sys_status"
ON sys_status FOR SELECT TO anon USING (true);
```

**Resultado:** Usuarios anónimos pueden **solo leer**, no escribir/actualizar/eliminar.

---

## Datos de Estadísticas

### **Archivo: `statistics.csv`**

Contiene estadísticas de ejemplo para:

- **2024** → Año completo
- **2025** → Año completo
- **global** → Agregado histórico

### **Estructura de public_data**

```json
{
  "value": 3245,
  "label": "Participantes totales",
  "icon": "users",
  "trend": {
    "direction": "up",
    "percentage": 5.2,
    "compared_to": "2023"
  }
}
```

### **Categorías de Estadísticas**

| Categoría       | Scope     | Descripción                    |
| --------------- | --------- | ------------------------------ |
| `participation` | `general` | Total de participantes         |
| `participation` | `boys`    | Participación masculina        |
| `participation` | `girls`   | Participación femenina         |
| `top_names`     | `general` | Nombres más populares          |
| `top_names`     | `boys`    | Nombres masculinos populares   |
| `top_names`     | `girls`   | Nombres femeninos populares    |
| `top_schools`   | `general` | Colegios con más participantes |
| `comparison`    | `general` | Comparativa entre años         |

---

## Datos de Participantes

### **Archivo: `participants.csv`**

Contiene **100 participantes ficticios** distribuidos en 5 colegios:

1. **Compañia de prueba** → 20 participantes
2. **Colegio San Ignacio** → 20 participantes
3. **Instituto Santa Teresa** → 20 participantes
4. **Escuela Arcoiris** → 20 participantes
5. **Colegio Nueva Era** → 20 participantes

### **Estructura del CSV**

```csv
id,name,school,article_date,year,url_id,created_at
10000000-0000-0000-0000-000000000001,Pepito Garcia Lopez,Compañia de prueba,2023/01/20,2023,10000000-0000-0000-0000-000000000001,2025-11-25 17:29:04.542594
```

### **Columnas**

| Columna        | Ejemplo               | Descripción              |
| -------------- | --------------------- | ------------------------ |
| `id`           | `10000000-...`        | UUID único               |
| `name`         | `Pepito Garcia Lopez` | Nombre completo ficticio |
| `school`       | `Compañia de prueba`  | Colegio/compañía         |
| `article_date` | `2023/01/20`          | Fecha de publicación     |
| `year`         | `2023`                | Año de participación     |
| `url_id`       | `10000000-...`        | UUID para URL            |
| `created_at`   | `2025-11-25...`       | Timestamp de creación    |

### **Distribución por Año**

| Año  | Participantes |
| ---- | ------------- |
| 2018 | 10            |
| 2019 | 10            |
| 2020 | 10            |
| 2021 | 10            |
| 2022 | 10            |
| 2023 | 10            |
| 2024 | 10            |
| 2025 | 30            |

### **Ejemplo de Participantes**

```
Pepito Garcia Lopez      - Compañia de prueba
Mikel Etxeberria Agirre  - Colegio San Ignacio
Sofia Hernandez Ramirez  - Instituto Santa Teresa
Claudia Ferrer Nunez     - Escuela Arcoiris
Irene Mendez Arias       - Colegio Nueva Era
```

> [!WARNING]
> **Nombres ficticios:** Todos los nombres fueron generados con generadores aleatorios. NO corresponden a personas reales.

---

## Cómo Importar

### **Paso 1: Crear cuenta de Supabase**

1. Ir a [supabase.com](https://supabase.com)
2. Crear proyecto nuevo
3. Copiar URL y ANON_KEY

### **Paso 2: Ejecutar schema SQL**

1. Ir al **SQL Editor** en Supabase
2. Pegar contenido de `tamborradata_schema.sql`
3. Ejecutar

### **Paso 3: Importar CSVs**

#### **Opción A: Table Editor (recomendado)**

1. Ir a **Table Editor** → tabla `participants`
2. Clic en **Import data from CSV**
3. Seleccionar `participants.csv`
4. Mapear columnas automáticamente
5. Importar

Repetir para `statistics.csv`.

#### **Opción B: SQL (avanzado)**

```sql
-- Copiar datos desde archivo local
COPY participants(id, name, school, article_date, year, url_id, created_at)
FROM '/path/to/participants.csv'
DELIMITER ','
CSV HEADER;
```

### **Paso 4: Configurar variables de entorno**

Crear `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_ANON_KEY=tu_anon_key_aqui
```

### **Paso 5: Verificar**

```bash
pnpm dev
```

Navegar a [http://localhost:3000](http://localhost:3000).

Si ves estadísticas y participantes, ¡funciona!

---

## Limitaciones

### **1. Datos Simplificados**

Los datos mock son más simples que producción:

- Menos participantes (100 vs ~5000 reales)
- Solo 5 colegios (vs ~50 reales)
- Nombres genéricos (no variedad cultural real)

### **2. Estadísticas Incompletas**

Algunas categorías tienen datos mínimos:

- Top nombres: Solo 10 nombres por categoría
- Top colegios: Solo 5 colegios
- Comparativas: Solo 3 años

### **3. Sin Datos de 2021**

El archivo mock **no incluye datos de 2021** (al igual que producción, donde no hay datos).

### **4. IDs Predecibles**

Los UUIDs siguen un patrón:

```
10000000-0000-0000-0000-000000000001  # Compañia de prueba
20000000-0000-0000-0000-000000000001  # Colegio San Ignacio
30000000-0000-0000-0000-000000000001  # Instituto Santa Teresa
```

**Razón:** Facilita debugging y testing.

---

## Diferencias con Producción

| Aspecto             | Mock Data | Producción            |
| ------------------- | --------- | --------------------- |
| **Participantes**   | 100       | ~5,000                |
| **Colegios**        | 5         | ~50                   |
| **Años**            | 2018-2025 | 2018-2025             |
| **Nombres**         | Ficticios | Reales (anonimizados) |
| **Estadísticas**    | Básicas   | Complejas             |
| **Datos sensibles** | No        | Sí (protegidos)       |

---

## Uso en Testing

Los datos mock son ideales para tests:

```typescript
// tests/backend/api.participants.test.ts
describe('GET /api/participants', () => {
  it('should find participant by name', async () => {
    const response = await fetch(
      '/api/participants?name=Pepito Garcia Lopez&company=Compañia de prueba'
    );

    const data = await response.json();

    expect(data.participants).toHaveLength(1);
    expect(data.participants[0].name).toBe('Pepito Garcia Lopez');
  });
});
```

---

## Generar Más Datos Mock

Si necesitas más datos sintéticos, puedes usar:

### **Python Script**

```python
import csv
import uuid
from datetime import datetime

fake_names = [
    "Juan Perez Rodriguez",
    "Maria Garcia Martinez",
    # ... más nombres
]

schools = [
    "Colegio Test A",
    "Colegio Test B",
]

with open('participants.csv', 'w', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(['id', 'name', 'school', 'article_date', 'year', 'url_id', 'created_at'])

    for i, name in enumerate(fake_names):
        writer.writerow([
            str(uuid.uuid4()),
            name,
            schools[i % len(schools)],
            "2024/01/20",
            2024,
            str(uuid.uuid4()),
            datetime.now().isoformat()
        ])
```

---

## Referencias

- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL COPY](https://www.postgresql.org/docs/current/sql-copy.html)
- [Fake Name Generator](https://www.fakenamegenerator.com/)

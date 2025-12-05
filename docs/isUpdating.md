# Sistema isUpdating - Actualización Anual Automática

Esta documentación explica el **sistema de actualización anual** de Tamborradata, cómo funciona el pipeline privado, cómo se detecta el estado `isUpdating` y cómo el frontend reacciona en tiempo real.

---

## 📋 Índice

- [Visión General](#visión-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Pipeline Privado](#pipeline-privado)
- [Tabla sys_status](#tabla-sys_status)
- [Detección en Backend](#detección-en-backend)
- [Polling en Frontend](#polling-en-frontend)
- [Flujo Completo](#flujo-completo)
- [Casos Edge](#casos-edge)

---

## Visión General

El sistema `isUpdating` es una **feature crítica** que permite actualizar los datos de Tamborradata cada mes de enero **sin downtime** y sin intervención manual.

### **¿Por qué existe?**

La Tamborrada Infantil ocurre el **20 de enero** cada año. Durante ese mes:

1. Se publican nuevas listas de participantes
2. Un **pipeline privado** recopila, limpia y procesa los datos
3. La **base de datos se actualiza** con el nuevo año
4. El **frontend detecta automáticamente** el cambio

### **Objetivo**

Mostrar un estado de "Sistema actualizándose" a los usuarios mientras el pipeline trabaja en background, sin necesidad de:

- ❌ Poner la web en mantenimiento
- ❌ Intervención manual del desarrollador
- ❌ Redeployar la aplicación

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    PIPELINE PRIVADO                         │
│  (Repositorio separado - información sensible de menores)  │
│                                                             │
│  1. Scraping de listas oficiales                           │
│  2. Limpieza y validación de datos                         │
│  3. Generación de estadísticas                             │
│  4. UPDATE sys_status SET is_updating = true               │
│  5. INSERT nuevos datos en PostgreSQL                      │
│  6. UPDATE sys_status SET is_updating = false              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   SUPABASE POSTGRESQL                       │
│                                                             │
│  sys_status table:                                          │
│  ┌────┬──────────────┬───────────────┐                    │
│  │ id │ is_updating  │ updated_at    │                    │
│  ├────┼──────────────┼───────────────┤                    │
│  │ 1  │ true/false   │ 2025-01-15... │                    │
│  └────┴──────────────┴───────────────┘                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   TAMBORRADATA WEB                          │
│                                                             │
│  Backend (API Routes):                                      │
│  GET /api/statistics?year=2025                             │
│  → Consulta sys_status.is_updating                         │
│  → Si true: devuelve { isUpdating: true }                 │
│  → Si false: devuelve estadísticas completas               │
│                                                             │
│  Frontend (React Query):                                    │
│  useStatisticsQuery('2025')                                │
│  → Si isUpdating = true → polling cada 3 segundos          │
│  → Si isUpdating = false → muestra datos normalmente       │
└─────────────────────────────────────────────────────────────┘
```

---

## Pipeline Privado

El **pipeline privado** es un repositorio separado que NO está en GitHub público porque:

- Procesa **información sensible de menores** (nombres completos, colegios)
- Ejecuta scraping de fuentes oficiales
- Contiene credenciales de base de datos con permisos de escritura

### **Tecnologías del Pipeline**

- **Python** → Scraping, limpieza de datos
- **Pandas** → Procesamiento de datasets
- **GitHub Actions** → Ejecución automatizada
- **Supabase Client** → Inserción de datos

### **Flujo del Pipeline**

```python
# Pseudocódigo simplificado
def update_tamborrada_data():
    # 1. Activar modo actualización
    supabase.table('sys_status').update({
        'is_updating': True,
        'updated_at': datetime.now()
    }).eq('id', 1).execute()

    # 2. Scraping de datos
    participants = scrape_official_lists()

    # 3. Limpieza y validación
    clean_data = validate_and_clean(participants)

    # 4. Generación de estadísticas
    statistics = generate_statistics(clean_data)

    # 5. Insertar en base de datos
    supabase.table('participants').insert(clean_data).execute()
    supabase.table('statistics').insert(statistics).execute()
    supabase.table('available_years').insert({
        'year': '2025',
        'is_ready': True
    }).execute()

    # 6. Desactivar modo actualización
    supabase.table('sys_status').update({
        'is_updating': False,
        'updated_at': datetime.now()
    }).eq('id', 1).execute()
```

### **Cuándo se ejecuta**

El pipeline se activa **automáticamente**:

- **Trigger:** GitHub Action cron job
- **Fecha:** Del 1 al 31 de enero
- **Frecuencia:** Cada 24 horas
- **Condición:** Solo si hay nuevos datos disponibles

---

## Tabla sys_status

La tabla `sys_status` es la **fuente de verdad** para el estado del sistema.

### **Schema**

```sql
CREATE TABLE sys_status (
  id integer PRIMARY KEY DEFAULT 1,
  is_updating boolean DEFAULT FALSE NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  notes text
);

-- Insertar estado inicial
INSERT INTO sys_status (id, is_updating, notes)
VALUES (1, false, 'Sistema iniciado')
ON CONFLICT (id) DO NOTHING;
```

### **Valores Posibles**

| Campo         | Tipo          | Descripción                                       |
| ------------- | ------------- | ------------------------------------------------- |
| `id`          | `integer`     | Siempre `1` (singleton)                           |
| `is_updating` | `boolean`     | `true` durante actualización, `false` normalmente |
| `updated_at`  | `timestamptz` | Última vez que cambió el estado                   |
| `notes`       | `text`        | Información adicional (opcional)                  |

### **Row Level Security (RLS)**

```sql
-- Solo lectura desde el frontend (anon)
CREATE POLICY "Anon read access on sys_status"
ON sys_status
FOR SELECT
TO anon
USING (true);
```

**Razón:** El frontend solo puede **leer** el estado, no modificarlo.

---

## Detección en Backend

El backend consulta `sys_status` antes de devolver estadísticas.

### **Función getSysStatus()**

```typescript
// app/(backend)/shared/utils/getSysStatus.ts
export async function getSysStatus(): Promise<boolean | null> {
  try {
    const isDev = process.env.NODE_ENV === 'development';
    const now = new Date();
    const month = now.getMonth(); // 0 = enero, 1 = febrero
    const day = now.getDate();

    // Solo consultar durante enero o febrero ≤ 20
    if (isDev || month === 0 || (month === 1 && day <= 20)) {
      const { data, error } = await supabaseClient
        .from('sys_status')
        .select('is_updating')
        .eq('id', 1)
        .single();

      if (error || !data) return false;
      return data.is_updating as boolean;
    }

    // Fuera de enero/febrero → siempre false
    return false;
  } catch (error) {
    console.error('Error obteniendo estado del sistema:', error);
    return false;
  }
}
```

### **Optimización de Fechas**

| Fecha         | Acción                           |
| ------------- | -------------------------------- |
| 1-31 enero    | Consulta BD cada request         |
| 1-20 febrero  | Consulta BD cada request         |
| Resto del año | Retorna `false` sin consultar BD |

**Razón:** La actualización solo ocurre en enero. No tiene sentido consultar BD el resto del año.

### **Uso en API Route**

```typescript
// app/(backend)/api/statistics/route.ts
export async function GET(req: Request) {
  const year = new URL(req.url).searchParams.get('year');

  // Consultar estado del sistema
  const isUpdating = await getSysStatus();

  // Si está actualizando, devolver solo el estado
  if (isUpdating) {
    return NextResponse.json({ isUpdating: true }, { status: 200 });
  }

  // Caso normal: devolver estadísticas completas
  const statistics = await getStatistics(year);
  return NextResponse.json({
    isUpdating: false,
    year,
    statistics,
  });
}
```

---

## Polling en Frontend

El frontend usa **React Query polling condicional** para detectar cambios.

### **Configuración de useStatisticsQuery**

```typescript
// app/(frontend)/hooks/query/useStatisticsQuery.ts
export function useStatisticsQuery<T extends StatsResponse>(year: string) {
  return useQuery({
    queryKey: queryKeys.statistics(year),
    queryFn: ({ signal }) => fetchStatistics<T>(year, signal),

    // Cache infinito (datos históricos no cambian)
    staleTime: Infinity,
    gcTime: Infinity,

    // Polling condicional
    refetchInterval: (query) => {
      const isUpdating = query.state.data?.isUpdating;
      return isUpdating ? 3000 : false; // 3 segundos si actualizando
    },

    // Refetch al volver a la pestaña si está actualizando
    refetchOnWindowFocus: (query) => {
      return query.state.data?.isUpdating === true;
    },
  });
}
```

### **Comportamiento del Polling**

| Estado                       | Acción                                     |
| ---------------------------- | ------------------------------------------ |
| `isUpdating = false`         | No hace polling (cache infinito)           |
| `isUpdating = true`          | Polling cada 3 segundos                    |
| Usuario cambia de pestaña    | Si `isUpdating = true` → refetch al volver |
| Usuario navega a otra página | Detiene polling automáticamente            |

### **Componente UI**

```typescript
// Ejemplo simplificado
export function StatisticsContent({ year }) {
  const { data, isLoading } = useStatisticsQuery(year);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (data?.isUpdating) {
    return (
      <UpdateBanner>
        Sistema actualizándose. Los nuevos datos estarán disponibles pronto.
      </UpdateBanner>
    );
  }

  return <StatisticsTable data={data.statistics} />;
}
```

---

## Flujo Completo

### **Caso 1: Usuario visita la web durante actualización**

```
1. Usuario: Visita /statistics/2025
2. Backend: Consulta sys_status → is_updating = true
3. Backend: Devuelve { isUpdating: true }
4. Frontend: Recibe isUpdating = true
5. Frontend: Muestra banner "Sistema actualizándose"
6. Frontend: Activa polling cada 3 segundos
7. (3 segundos después)
8. Frontend: Vuelve a consultar /api/statistics?year=2025
9. Backend: Consulta sys_status → is_updating = false
10. Backend: Devuelve estadísticas completas
11. Frontend: Actualiza UI con datos nuevos
12. Frontend: Desactiva polling
```

### **Caso 2: Usuario está navegando cuando empieza actualización**

```
1. Usuario: Está en /statistics/2024 (cache infinito)
2. Pipeline: Activa is_updating = true
3. Frontend: No detecta cambio (no hay polling en 2024)
4. Usuario: Navega a /statistics/2025
5. Backend: Consulta sys_status → is_updating = true
6. Backend: Devuelve { isUpdating: true }
7. Frontend: Activa polling cada 3 segundos
8. ... (continúa como Caso 1)
```

### **Caso 3: Actualización finaliza mientras usuario está activo**

```
1. Usuario: Ve banner "Sistema actualizándose"
2. Frontend: Polling cada 3 segundos
3. Pipeline: Finaliza inserción de datos
4. Pipeline: Actualiza sys_status → is_updating = false
5. Frontend: Próxima petición (3s después)
6. Backend: Devuelve estadísticas completas
7. Frontend: Actualiza UI automáticamente
8. Frontend: Desactiva polling
```

---

## Casos Edge

### **¿Qué pasa si el pipeline falla?**

```python
try:
    # Actualización de datos
    update_statistics()
except Exception as e:
    # Rollback: desactivar is_updating
    supabase.table('sys_status').update({
        'is_updating': False,
        'notes': f'Error: {str(e)}'
    }).eq('id', 1).execute()
    raise
```

**Resultado:** `isUpdating` vuelve a `false`, el frontend muestra datos del año anterior.

### **¿Qué pasa si el usuario cierra la pestaña?**

- React Query **detiene el polling automáticamente**
- Al volver a abrir la página, se consulta el estado actual

### **¿Qué pasa si hay múltiples tabs abiertos?**

- Cada tab tiene su **propia instancia de React Query**
- Todas hacen polling independientemente
- React Query **deduplica requests** → solo 1 petición HTTP real

### **¿Qué pasa fuera del mes de enero?**

- `getSysStatus()` retorna `false` sin consultar BD
- No hay overhead de performance

---

## Optimización de Costes

### **Supabase Reads**

| Escenario             | Reads/mes                        |
| --------------------- | -------------------------------- |
| Enero (actualización) | ~10,000 reads                    |
| Resto del año         | 0 reads (optimización de fechas) |

### **Alternativas Consideradas**

1. **WebSockets** → Demasiado complejo para este caso
2. **Server-Sent Events (SSE)** → No soportado en Vercel Edge
3. **Polling constante** → Desperdicio de recursos
4. **Manual refresh** → Mala UX

**Solución elegida:** Polling condicional con React Query.

---

## Referencias

- [React Query Polling](https://tanstack.com/query/latest/docs/framework/react/guides/window-focus-refetching)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

-- Crear tablas 'statistics', 'available_years' y 'sys_status'
CREATE TABLE statistics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  scope text NOT NULL,
  year text NOT NULL,
  public_data jsonb,
  full_data jsonb,
  summary text,
  created_at timestamp DEFAULT now() NOT NULL,
  UNIQUE (category, scope, year)
);

CREATE TABLE available_years (
  year text UNIQUE PRIMARY key,
  is_ready boolean DEFAULT FALSE NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);


CREATE TABLE sys_status (
  id integer PRIMARY key DEFAULT 1,
  is_updating boolean DEFAULT FALSE NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  notes text
);


-- Activar seguridad RLS a las tablas para no poder ELIMINAR, ACTUALIZAR ni CREAR nuevos datos
ALTER TABLE statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE available_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE sys_status ENABLE ROW LEVEL SECURITY;

-- Tablas de solo lectura desde el frontend
CREATE POLICY "Anon read access on statistics"
ON statistics
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon read access on available_years"
ON available_years
FOR SELECT
TO anon
USING (true);

CREATE POLICY "Anon read access on sys_status"
ON sys_status
FOR SELECT
TO anon
USING (true);

-- Meter datos a las tablas
INSERT INTO available_years (year, is_ready, created_at, updated_at) VALUES ('2024', 'true', '2025-11-07 18:14:24.891472', '2025-11-07 18:14:24.891472+00'), ('2025', 'true', '2025-11-10 16:32:38.603954', '2025-11-10 16:32:38.603954+00'), ('global', 'true', '2025-11-07 18:14:25.103588', '2025-11-07 18:14:25.103588+00');

INSERT INTO sys_status (id, is_updating, notes)
VALUES (1, false, 'Sistema iniciado')
ON CONFLICT (id) DO NOTHING;
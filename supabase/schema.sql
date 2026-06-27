-- =====================================================================
-- Buscador de Personas en Centros de Salud — Esquema de base de datos
-- Ejecutar en el SQL Editor de Supabase.
-- =====================================================================

-- Tabla principal de pacientes ----------------------------------------
create table if not exists pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre_completo text not null,
  edad_aprox int,
  sexo text check (sexo in ('M','F','desconocido')),
  estado_clinico text not null
    check (estado_clinico in ('estable','critico','sin_identificar','fallecido')),
  descripcion_fisica text,
  centro_salud text not null,
  estado_geografico text,
  municipio text,
  foto_path text,
  registrado_por text not null,
  verificado boolean default false,
  caso_cerrado boolean default false,
  origen text default 'manual' check (origen in ('manual','csv','foto_ocr')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Índices para búsqueda y filtros -------------------------------------
create index if not exists idx_pacientes_nombre
  on pacientes using gin (to_tsvector('spanish', nombre_completo));
create index if not exists idx_pacientes_centro on pacientes (centro_salud);
create index if not exists idx_pacientes_estado on pacientes (estado_geografico);
create index if not exists idx_pacientes_municipio on pacientes (municipio);

-- Mantener updated_at al día ------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_pacientes_updated_at on pacientes;
create trigger trg_pacientes_updated_at
  before update on pacientes
  for each row execute function set_updated_at();

-- =====================================================================
-- Seguridad a nivel de fila (RLS) — OBLIGATORIA
-- El público solo LEE casos abiertos. Solo usuarios autenticados escriben.
-- =====================================================================
alter table pacientes enable row level security;

-- Lectura pública: solo casos abiertos
drop policy if exists "lectura_publica" on pacientes;
create policy "lectura_publica" on pacientes
  for select
  using (caso_cerrado = false);

-- Inserción: solo autenticados
drop policy if exists "insert_autenticado" on pacientes;
create policy "insert_autenticado" on pacientes
  for insert
  with check (auth.role() = 'authenticated');

-- Actualización: solo autenticados
drop policy if exists "update_autenticado" on pacientes;
create policy "update_autenticado" on pacientes
  for update
  using (auth.role() = 'authenticated');

-- (Opcional) lectura completa para autenticados, incluida la de casos cerrados,
-- para la gestión en /admin:
drop policy if exists "lectura_autenticado" on pacientes;
create policy "lectura_autenticado" on pacientes
  for select
  using (auth.role() = 'authenticated');

-- =====================================================================
-- Solicitudes de baja — un familiar pide retirar un registro.
-- El público puede INSERT (anon); el personal autenticado puede SELECT
-- y marcarlas como atendidas. NO permite UPDATE ni DELETE anónimos.
-- =====================================================================
create table if not exists solicitudes_baja (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid not null references pacientes(id) on delete cascade,
  contacto text,
  nota text,
  atendida boolean default false,
  created_at timestamptz default now()
);

create index if not exists idx_solicitudes_paciente on solicitudes_baja (paciente_id);
create index if not exists idx_solicitudes_pendientes on solicitudes_baja (atendida) where atendida = false;

alter table solicitudes_baja enable row level security;

drop policy if exists "insert_publico_solicitudes" on solicitudes_baja;
create policy "insert_publico_solicitudes" on solicitudes_baja
  for insert
  with check (true);

drop policy if exists "select_autenticado_solicitudes" on solicitudes_baja;
create policy "select_autenticado_solicitudes" on solicitudes_baja
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "update_autenticado_solicitudes" on solicitudes_baja;
create policy "update_autenticado_solicitudes" on solicitudes_baja
  for update
  using (auth.role() = 'authenticated');

-- =====================================================================
-- Verificación rápida tras crear las políticas:
-- 1. Con la anon key, un SELECT no debe devolver filas con caso_cerrado = true.
-- 2. Con la anon key, INSERT y UPDATE deben fallar.
-- 3. Con un usuario autenticado, INSERT/UPDATE deben funcionar.
-- =====================================================================

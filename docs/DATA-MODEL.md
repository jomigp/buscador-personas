# Modelo de datos

> Schema de BD, RLS, índices y ejemplos de queries. Para humanos que quieren entender los datos y para IAs que necesitan operar la BD sin romper seguridad.

## 📊 Diagrama entidad-relación

```
┌─────────────────────────────┐
│      centros_salud          │
├─────────────────────────────┤
│ id           uuid PK        │
│ nombre       text NOT NULL  │
│ estado       text NOT NULL  │
│ municipio    text           │
│ red          text NOT NULL  │  ← MPPS/IVSS/BARRIO ADENTRO/MILITAR/PRIVADO
│ tipo         text           │  ← Hospital/CDI/Ambulatorio/etc
│ fuente       text           │
│ created_at   timestamptz    │
└─────────────────────────────┘
            ▲
            │ (referencia lógica, no FK)
            │
┌─────────────────────────────┐
│       pacientes             │
├─────────────────────────────┤
│ id              uuid PK     │
│ nombre          text NOT NULL│
│ apellido        text NOT NULL│
│ edad            int         │
│ sexo            text        │  ← M/F/otro/desconocido
│ estado_clinico  text NOT NULL│  ← estable/delicado/crítico/sin_identificar/recuperado/fallecido
│ estado_caso     text NOT NULL│  ← abierto/cerrado
│ centro_salud    text        │
│ estado_geografico text      │
│ municipio       text        │
│ foto_path       text        │  ← path en Storage bucket
│ notas           text        │
│ registrado_por  text        │  ← email del usuario
│ created_at      timestamptz │
│ updated_at      timestamptz │
└─────────────────────────────┘
            ▲
            │ (referencia lógica)
            │
┌─────────────────────────────┐
│     solicitudes_baja        │
├─────────────────────────────┤
│ id              uuid PK     │
│ paciente_id     uuid FK?    │  ← soft FK (no enforced para flexibilidad)
│ nombre_solicitante text     │
│ contacto        text        │
│ parentesco      text        │
│ descripcion     text        │
│ estado          text        │  ← pendiente/aprobada/rechazada
│ created_at      timestamptz │
│ updated_at      timestamptz │
└─────────────────────────────┘
```

## 📋 Tablas en detalle

### `pacientes`

Casos de personas ingresadas en centros de salud.

```sql
create table pacientes (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  apellido text not null,
  edad int check (edad >= 0 and edad <= 130),
  sexo text check (sexo in ('M', 'F', 'otro', 'desconocido')),
  estado_clinico text not null default 'sin_identificar'
    check (estado_clinico in (
      'estable', 'delicado', 'crítico', 'sin_identificar', 'recuperado', 'fallecido'
    )),
  estado_caso text not null default 'abierto'
    check (estado_caso in ('abierto', 'cerrado')),
  centro_salud text,
  estado_geografico text,
  municipio text,
  foto_path text,           -- path en bucket Storage 'fotos-pacientes'
  notas text,
  registrado_por text,      -- email del usuario que lo cargó
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Índices para búsquedas rápidas
create index idx_pacientes_nombre on pacientes using gin (to_tsvector('spanish', nombre || ' ' || apellido));
create index idx_pacientes_estado_caso on pacientes (estado_caso);
create index idx_pacientes_estado_clinico on pacientes (estado_clinico);
create index idx_pacientes_centro on pacientes (centro_salud);
create index idx_pacientes_estado_geo on pacientes (estado_geografico);
create index idx_pacientes_municipio on pacientes (municipio);
create index idx_pacientes_registrado_por on pacientes (registrado_por);
```

**Por qué `gin` en lugar de `btree`**: la búsqueda por nombre es parcial (`ilike '%juan%'`). Un índice `gin` con `to_tsvector` permite búsqueda full-text en español, lo cual es más rápido y preciso para nombres con tildes y variantes.

### `solicitudes_baja`

Cuando un familiar cree reconocer a alguien, no edita el caso. Crea una solicitud que el personal revisa.

```sql
create table solicitudes_baja (
  id uuid primary key default gen_random_uuid(),
  paciente_id uuid,            -- soft FK a pacientes
  nombre_solicitante text,
  contacto text,               -- email o teléfono de quien pide
  parentesco text,             -- "madre", "hermano", etc.
  descripcion text not null,
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobada', 'rechazada')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_solicitudes_estado on solicitudes_baja (estado);
create index idx_solicitudes_paciente on solicitudes_baja (paciente_id);
```

**Por qué soft FK**: si el caso se borra, la solicitud queda como histórico. Si fuera FK estricto, perderíamos auditoría.

### `centros_salud`

Catálogo de 241 hospitales/clínicas/CDI de Venezuela.

```sql
create table centros_salud (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  estado text not null,
  municipio text,
  red text not null
    check (red in ('MPPS', 'IVSS', 'BARRIO ADENTRO', 'MILITAR', 'PRIVADO')),
  tipo text,
  fuente text default 'Lista oficial 2026',
  created_at timestamptz not null default now()
);

create unique index idx_centros_nombre_estado
  on centros_salud (lower(nombre), lower(estado));
create index idx_centros_estado on centros_salud (estado);
create index idx_centros_municipio on centros_salud (municipio);
```

**Por qué `unique` sobre `lower()`**: hospitales con tildes o mayúsculas distintas deben considerarse el mismo (ej. "Dr. PÉREZ" == "Dr. Perez").

## 🔐 Row Level Security (RLS)

### Política `pacientes`

```sql
alter table pacientes enable row level security;

-- Lectura pública: solo casos abiertos
create policy "lectura_publica_pacientes" on pacientes
  for select using (estado_caso = 'abierto');

-- Política adicional: usuarios autenticados ven TODOS sus casos
create policy "lectura_autenticado" on pacientes
  for select using (auth.role() = 'authenticated');

-- Inserción solo autenticados
create policy "insert_autenticado" on pacientes
  for insert with check (auth.role() = 'authenticated');

-- Update solo autenticados
create policy "update_autenticado" on pacientes
  for update using (auth.role() = 'authenticated');

-- Delete solo autenticados (con cuidado, soft-delete preferible)
create policy "delete_autenticado" on pacientes
  for delete using (auth.role() = 'authenticated');
```

**Por qué dos políticas de SELECT**: el público solo ve casos abiertos (filtro natural). Los autenticados ven TODO (incluso cerrados) para hacer seguimiento.

### Política `solicitudes_baja`

```sql
alter table solicitudes_baja enable row level security;

-- Público puede CREAR solicitudes (anon insert)
create policy "insert_publico_solicitudes" on solicitudes_baja
  for insert with check (true);

-- Público puede LEER solo las propias (sin auth.email = '')
create policy "lectura_publica_solicitudes" on solicitudes_baja
  for select using (true);  -- simplificado: público ve sus solicitudes

-- Autenticados pueden update
create policy "update_autenticado_solicitudes" on solicitudes_baja
  for update using (auth.role() = 'authenticated');
```

### Política `centros_salud`

```sql
alter table centros_salud enable row level security;

-- Lectura pública (para autocomplete)
create policy "lectura_publica_centros" on centros_salud
  for select using (true);

-- Escritura solo autenticados
create policy "admin_write_centros" on centros_salud
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
```

## 🔍 Queries típicas

### Búsqueda pública (home)

```typescript
const { data } = await supabase
  .from('pacientes')
  .select('id, nombre, apellido, edad, sexo, estado_clinico, centro_salud, estado_geografico, municipio, foto_path')
  .eq('estado_caso', 'abierto')
  .ilike('nombre', `%${q}%`)  // q del input del usuario
  .order('updated_at', { ascending: false })
  .range(offset, offset + 19);  // paginación
```

**Por qué `ilike` en lugar de `eq`**: tolera typos parciales y OCR mal escrito. La familia puede escribir "jose" y matchear "José", "Jose", "JOSÉ".

### Catálogo de centros (autocomplete)

```typescript
const { data } = await supabase
  .from('centros_salud')
  .select('nombre, estado, municipio')
  .order('nombre');

// En el cliente:
<input list="centros" />
<datalist id="centros">
  {data.map(c => <option value={c.nombre}>{c.estado}</option>)}
</datalist>
```

Ver [src/lib/centros.ts](../src/lib/centros.ts) para la lógica completa.

### Dashboard admin (mis casos)

```typescript
const { data } = await supabase
  .from('pacientes')
  .select('*')
  .eq('registrado_por', user.email)
  .order('created_at', { ascending: false });
```

**Fase 2**: agregar filtro por centro (si el usuario representa un hospital específico).

### Solicitudes pendientes

```typescript
const { data: solicitudes } = await supabase
  .from('solicitudes_baja')
  .select('*, pacientes(*)')  // join
  .eq('estado', 'pendiente')
  .order('created_at', { ascending: false });
```

## 📦 Storage (fotos)

```
fotos-pacientes/  ← bucket público
├── 2026/
│   └── 06/
│       └── 27/
│           ├── abc123-uuid.jpg
│           └── def456-uuid.jpg
└── ...
```

**Convención de paths**: `YYYY/MM/DD/<uuid>.<ext>` para no colisionar y facilitar listado por fecha.

**URL pública**: `https://<project>.supabase.co/storage/v1/object/public/fotos-pacientes/<path>`

**Helper en código**: `src/lib/storage.ts::publicFotoUrl(path)` lo construye.

## 🔄 Migraciones

**Cómo agregar una migración nueva**:

1. Editar `supabase/schema.sql` con `ALTER TABLE ... ADD COLUMN IF NOT EXISTS ...`.
2. Incrementar comentario `-- v2: agrega columna X`.
3. Commit + push.
4. El admin corre el SQL en producción manualmente (no auto-migrate todavía).

**Por qué no auto-migrate**: en emergencia, no podemos permitir que una migración falle a mitad y rompa la BD. Cada cambio se aplica manualmente con verificación.

## 🧹 Limpieza de datos

**Datos de prueba**: identificar con `registrado_por LIKE '%test%'` o `created_at > now() - interval '1 day'`.

**Soft delete**: cambiar `estado_caso` a 'cerrado' en lugar de `DELETE`. Mantiene auditoría.

**Hard delete**: solo después de 30 días post-emergencia, con backup previo.

## 📈 Estadísticas útiles

```sql
-- Casos por estado clínico
select estado_clinico, count(*) from pacientes group by 1;

-- Casos por centro (top 20)
select centro_salud, count(*) from pacientes group by 1 order by 2 desc limit 20;

-- Casos por día
select date_trunc('day', created_at)::date as dia, count(*)
from pacientes
where created_at > now() - interval '30 days'
group by 1
order by 1;

-- Personal más activo
select registrado_por, count(*) from pacientes group by 1 order by 2 desc;

-- Solicitudes pendientes
select count(*) from solicitudes_baja where estado = 'pendiente';
```

---

**Próximo documento**: [API.md](./API.md) — rutas, endpoints, server actions.
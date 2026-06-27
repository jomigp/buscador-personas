# Verificación de personal de salud vía SACS

> Cómo el buscador verifica que cada cuenta que carga pacientes
> corresponde a un profesional de la salud registrado oficialmente.

**Última verificación del endpoint:** 27 de junio de 2026, José (Valencia).
Endpoint operativo, sin captcha, sin login, público.

---

## 1. ¿Por qué matrícula MPPS y no cédula?

SACS (Servicio Autónomo de Control de Salud / Sistema de Información
de Salud del MPPS) mantiene dos bases oficiales:

- **Cédula de identidad** (V-/E-) — la usa todo el mundo, no es
  exclusiva del personal de salud.
- **Matrícula MPPS** (formato `MPPS-XXXXXX`) — es la matrícula
  profesional. La otorga el Ministerio del Poder Popular para la Salud
  y **solo la tienen médicos, enfermeros, bioanalistas y demás
  profesionales regulados**.

Para nuestro caso la matrícula es la prueba correcta: si alguien tiene
una `MPPS-XXXXXX`, es personal de salud registrado ante el Estado. Por
eso usamos la matrícula como llave de verificación y no la cédula.

**Pruebas realizadas:**

| Consulta | Endpoint | Resultado |
|---|---|---|
| `MPPS-115531` (existe) | `getPrfsnalMatricula` | JSON con 2 profesionales, datos completos |
| `MPPS-99999999` (no existe) | `getPrfsnalMatricula` | SweetAlert: "LA MATRÍCULA INGRESADA NO EXISTE" |
| `V-21425640` | `getPrfsnalByCed` | `[]` (el endpoint por cédula no devolvió datos en nuestras pruebas) |

Conclusión: usamos `getPrfsnalMatricula` y guardamos la respuesta por
30 días en cache. Si en algún momento el endpoint por cédula responde,
lo agregamos como alternativa.

---

## 2. Cómo descubrimos el endpoint

La página de consulta es pública:
<https://sistemas.sacs.gob.ve/consultas/prfsnal_salud>

Inspeccionando su JavaScript vimos que usa el framework **XAJAX** (PHP,
muy común en portales gubernamentales venezolanos antiguos). XAJAX
expone funciones backend llamables por POST. Las funciones relevantes:

```js
xajax.getPrfsnalByCed(...)       // (no responde en pruebas)
xajax.getPrfsnalMatricula(...)   // ✅ funciona
```

Ambas reciben POST en la misma URL con tres campos:

| Campo | Valor |
|---|---|
| `xajax` | nombre de la función (`getPrfsnalMatricula`) |
| `xajaxr` | ID/timestamp cualquiera (string) |
| `xajaxargs[]` | argumentos posicionales (uno por elemento del array) |

### Ejemplo reproducible

```bash
curl -X POST "https://sistemas.sacs.gob.ve/consultas/prfsnal_salud" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "xajax=getPrfsnalMatricula" \
  --data-urlencode "xajaxr=1234567890" \
  --data-urlencode "xajaxargs[]=MPPS-115531"
```

Devuelve XHTML con un `<xjx>` que envuelve comandos JS:

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<xjx>
  <cmd n="js"><![CDATA[xajax_createTable('[{"fecha_registro":"2015-11-17","cedula":"23673927","codprofesion":"8","profesion":"T.S.U. EN ENFERMERÍA","nombre1":"GERBANYS","apellido1":"DELLI COMPAGNI","tomo_registro":"431","folio_registro":"32","matricula":"MPPS-115531"}, ... ]')]]></cmd>
</xjx>
```

Hay que **extraer el JSON que viene dentro del `xajax_createTable('...')`**.
Si la respuesta contiene un `SweetAlert('info','LA MATRÍCULA INGRESADA NO EXISTE...')`, no hay resultados.

---

## 3. Datos que devuelve SACS por cada profesional

```json
{
  "fecha_registro": "2015-11-17",
  "cedula": "23673927",
  "codprofesion": "8",
  "profesion": "T.S.U. EN ENFERMERÍA",
  "nombre1": "GERBANYS",
  "apellido1": "DELLI COMPAGNI",
  "tomo_registro": "431",
  "folio_registro": "32",
  "matricula": "MPPS-115531"
}
```

**Campos útiles para nosotros:**

- `cedula` — para mostrar al admin al aprobar.
- `nombre1` + `apellido1` — para que el admin compare con el nombre
  que el usuario escribió al registrarse.
- `profesion` — para mostrar en el sello público.
- `fecha_registro` — para sordenar / auditar.

**Campos que NO devuelve SACS:**

- Centro de salud de adscripción.
- Correo electrónico.
- Estado activo/inactivo de la matrícula.

Por eso **la verificación SACS prueba que la persona es profesional de
la salud, pero NO prueba que trabaja en el hospital X**. La asociación
persona↔centro la hace el admin del proyecto (vos).

---

## 4. Diseño del flujo de confianza

### Dónde estamos hoy (sin SACS)

```
admin crea cuenta → usuario logueado → puede subir pacientes
```

Punto débil: el admin confía en que el email pertenece a alguien del
hospital. Es cierto solo si el admin lo verificó externamente.

### Con SACS (propuesta)

```
admin o usuario se pre-registra con matrícula MPPS
   ↓
Server Action consulta SACS server-side (con caché 30 días)
   ↓
¿SACS respondió OK?
├── Sí → guardamos datos oficiales + verificado_por_sacs=true
└── No  → verificado_por_sacs=false (admin puede aprobar igual)
   ↓
queda verificado_por_admin=false → todavía no puede subir
   ↓
admin ve la lista en /admin/verificaciones → aprueba/rechaza
   ↓
verificado_por_admin=true → puede subir pacientes
```

Resultado: dos candados.

1. **SACS prueba profesión real** (la matrícula es oficial).
2. **Tu aprobación prueba que pertenece al centro correcto** (vos lo
   confirmás con una llamada al hospital).

### Por qué server-side

El endpoint de SACS es público, pero:

- Si lo llamamos desde el navegador, **cualquier visitante podría
  martillarlo** y tumbar el servicio. En plena emergencia eso sería un
  daño colateral serio.
- Cachear evita el problema: una matrícula se consulta una vez cada 30
  días, no miles de veces.

Por eso **toda llamada a SACS vive en Server Actions / Route Handlers**.
El cliente nunca ve la URL.

---

## 5. Cambios al esquema (a aplicar tras despliegue)

### Nueva tabla `verificaciones_sacs`

Cache de las respuestas de SACS. Clave única por matrícula.

```sql
create table if not exists verificaciones_sacs (
  matricula text primary key,           -- 'MPPS-115531'
  hits jsonb not null,                  -- array JSON devuelto por SACS
  found boolean not null,               -- ¿SACS encontró la matrícula?
  cached_at timestamptz default now()   -- expira a los 30 días
);

create index if not exists idx_verif_sacs_cached
  on verificaciones_sacs (cached_at);
```

### Tabla `profiles` nueva

Una fila por cada usuario de Supabase Auth que se registre. Hasta que
no esté aprobada, no puede subir pacientes.

```sql
create table if not exists profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  matricula_mpps text,
  nombre_oficial text,           -- lo que dijo SACS
  cedula_oficial text,            -- lo que dijo SACS
  profesion_oficial text,         -- lo que dijo SACS
  verificado_por_sacs boolean default false,
  verificado_por_admin boolean default false,
  aprobado_por uuid references auth.users(id),
  aprobado_at timestamptz,
  nota_admin text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- Cada usuario lee su propio profile
drop policy if exists "self_read_profile" on profiles;
create policy "self_read_profile" on profiles
  for select using (auth.uid() = user_id);

-- Cualquier autenticado lee profiles (necesario para tu panel)
drop policy if exists "auth_read_profile" on profiles;
create policy "auth_read_profile" on profiles
  for select using (auth.role() = 'authenticated');

-- Solo admins pueden cambiar verificado_por_admin.
-- Como no tenemos rol "admin", por ahora usamos el email.
-- Definí una lista de emails admin en una tabla settings, o hardcodeá
-- la condición aquí. Para v1: el admin es jomigp (vos).
drop policy if exists "admin_update_profile" on profiles;
create policy "admin_update_profile" on profiles
  for update
  using (
    auth.jwt() ->> 'email' = current_setting('app.admin_emails', true)
    or auth.uid() in (select user_id from profiles where verificado_por_admin = true and es_admin = true)
  );
```

Para mantener simple la v1, te recomiendo una tabla `settings` con
`admin_emails` que vos mantenés a mano:

```sql
create table if not exists settings (
  key text primary key,
  value jsonb not null
);

insert into settings (key, value)
values ('admin_emails', '["tu-correo@ejemplo.com"]'::jsonb)
on conflict (key) do nothing;
```

### Endurecer RLS de `pacientes`

Ahora solo verificados suben:

```sql
drop policy if exists "insert_autenticado" on pacientes;
create policy "insert_autenticado" on pacientes
  for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
        and profiles.verificado_por_admin = true
    )
  );

drop policy if exists "update_autenticado" on pacientes;
create policy "update_autenticado" on pacientes
  for update
  using (
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
        and profiles.verificado_por_admin = true
    )
  );
```

`delete_autenticado` puede seguir abierto o quitarse; por ahora nadie
borra registros en emergencias, solo se cierran.

---

## 6. UI nueva

### `/admin/signup` (nuevo)

Formulario para que un nuevo personal se pre-registre:

- Nombre (lo que dice él).
- Email.
- Contraseña.
- Matrícula MPPS (campo con formato `MPPS-XXXXXX`).

Al enviar:

1. Server Action crea el usuario en Supabase Auth.
2. Server Action consulta SACS server-side.
3. Guarda `profile` con los datos de SACS + `verificado_por_admin=false`.
4. Muestra: "Registro iniciado. Espera la confirmación del administrador."

### `/admin/verificaciones` (nuevo, solo admin)

Lista de profiles pendientes:

```
┌─────────────────────────────────────────────────────────────┐
│ Pendientes de aprobación                                    │
├─────────────────────────────────────────────────────────────┤
│ JOSÉ GONZÁLEZ                                               │
│ Email: jose@hospitalx.com                                   │
│ Matrícula MPPS-115531                                       │
│ SACS: ✓ verificado · Cédula V-21425640                      │
│       "MÉDICO(A) CIRUJANO(A)" — registro 2015-12-11         │
│ [Aprobar]  [Rechazar]                                       │
└─────────────────────────────────────────────────────────────┘
```

Aprobar → `verificado_por_admin=true`, ya puede subir.
Rechazar → marcar `rechazado=true` (campo nuevo) o borrar el profile.

### Sello público

En la tarjeta de cada paciente, donde hoy dice "Verificado por
[centro]", agregar (si el uploader tiene profile verificado):

```
Cargado por JOSÉ GONZÁLEZ — MÉDICO(A) CIRUJANO(A)
Verificado por SACS (MPPS-115531)
✓ Verificado por Hospital Central
```

Triple sello: nombre real + profesión oficial + centro. Si falta
algún check, se muestra solo lo que se tiene.

---

## 7. Edge cases

| Caso | Qué pasa |
|---|---|
| SACS caído al registrarse | `verificado_por_sacs=false`. El admin puede aprobar manualmente si tiene otra forma de confirmar (llamada al hospital). |
| Matrícula no existe en SACS | Igual que arriba: `found=false`. El admin decide. |
| Una matrícula corresponde a varias personas | SACS devuelve un array (vimos 2 personas con MPPS-115531). El admin decide cuál es la correcta comparando nombre+cédula. |
| El usuario miente en su nombre | SACS devuelve el nombre real. El admin compara y rechaza si no coincide. |
| El admin es el único que aprueba | OK por ahora. Si más adelante hay varios medios aliados, se agrega un rol `admin`. |

---

## 8. Lo que falta implementar (resumen)

1. Schema: tablas `verificaciones_sacs`, `profiles`, `settings`, ajustar RLS de `pacientes`.
2. Cliente HTTP para SACS en `src/lib/sacs.ts` (con caché).
3. Server Action `signUpConSacsAction` que crea user + profile.
4. Página `/admin/signup` con el formulario.
5. Página `/admin/verificaciones` (panel de aprobación).
6. Modificar `crearPacienteAction` para incluir el nombre y profesión del uploader en cada registro (opcional, ya está en `registrado_por` el email; agregar `cargado_por_nombre` y `cargado_por_profesion`).
7. Actualizar la tarjeta pública para mostrar el triple sello.
8. Documentar este flujo en `PRIVACY.md` y `README.md`.

Tiempo estimado: 1-1.5 horas de implementación + 30 min de pruebas
contra SACS con matrículas reales.

---

## 9. Riesgos conocidos

- **SACS cae o cambia el endpoint**: el sistema degrada a "solo
  aprobación manual del admin", que es el modo C de los que hablamos.
- **SACS no expone centro de adscripción**: lo agregamos a mano en
  `profiles.nota_admin` cuando aprobás.
- **Abuso del endpoint**: como todo va server-side y con caché, el
  peor caso es ~una llamada por matrícula nueva cada 30 días. Si
  tenemos 50 centros y 200 cuentas, son 200 llamadas en el primer mes
  y casi cero después.
- **Privacidad**: el nombre y cédula del profesional quedan en
  `profiles` y **no se exponen al público directamente**. Lo que se
  muestra es el nombre_oficial y profesión, no la cédula. La cédula
  la ve solo el admin.

---

## 10. Por qué este enfoque es defendible

En una emergencia, **cualquier verificación que agregue fricción
innecesaria mata la app**. La verificación SACS es:

- **Oficial** (matrícula del Ministerio).
- **Automática** (no requiere que el hospital haga nada).
- **Resiliente** (si SACS cae, degradamos sin romper).
- **Auditable** (queda registro de cada verificación con timestamp).
- **Reversible** (vos podés revocar una aprobación).

Si alguien objeta "¿y si el admin aprueba mal?", la respuesta es:
"el admin es el medio editorial, que responde institucionalmente; y
todos los registros quedan firmados con matrícula SACS + cédula".
Eso es tan bueno como se puede hacer en 72 horas.
# Buscador de Personas en Centros de Salud

Web app de emergencia para reunificación familiar tras el **doblete sísmico del 24 de junio de 2026** en Venezuela (magnitudes 7.2 y 7.5 Mw). Permite que las familias encuentren a sus seres queridos ingresados en hospitales, clínicas y centros de triaje, y que el personal de salud cargue y actualice los registros.

Proyecto **open source** impulsado por un medio de comunicación venezolano. Las contribuciones son bienvenidas (ver [CONTRIBUTING.md](./CONTRIBUTING.md)).

> ⚠️ Esta app maneja datos personales de personas vulnerables en una emergencia. Léase [PRIVACY.md](./PRIVACY.md) antes de contribuir o desplegar.

---

## Qué hace

- **Buscador público** (sin login): cualquier familiar busca por nombre, centro de salud o ubicación.
- **Carga restringida**: solo personal de salud autenticado registra y actualiza pacientes.
- **Lectura de listas por foto** (fase 2): sube la foto de un listado y un modelo de visión extrae los datos para revisión y carga rápida.
- **Sello de verificación**: distingue la información validada por centros del ruido de redes.

## Stack

- **Next.js 16** (App Router, TypeScript) + **React 19** — requiere **Node.js 20+**
- **Tailwind CSS**
- **Supabase** (Postgres + Auth + Storage)
- **Vercel** (deploy)

## Puesta en marcha (local)

1. **Clonar e instalar**
   ```bash
   git clone <url-del-repo>
   cd buscador-personas
   npm install
   ```

2. **Crear proyecto en Supabase** (https://supabase.com) y, en el SQL Editor, ejecutar **en este orden**:
   - [`supabase/schema.sql`](./supabase/schema.sql) — crea las tablas `pacientes`, `solicitudes_baja`, `centros_salud`, índices, RLS y triggers.
   - [`supabase/seed-centros.sql`](./supabase/seed-centros.sql) — carga 241 centros de salud oficiales (24 estados) como catálogo para el autocomplete.
   - Al terminar, refrescá el caché de PostgREST (esencial, sino PostgREST no ve las tablas nuevas):
     ```sql
     NOTIFY pgrst, 'reload schema';
     ```

3. **Crear el bucket de Storage** llamado `fotos-pacientes` (público).

3. **Crear el bucket de Storage** llamado `fotos-pacientes` (público, para que las fotos se puedan mostrar a visitantes anónimos).

4. **Crear al menos un usuario** en Supabase Auth (Authentication → Users → Add user). Una cuenta por centro de salud. Esa cuenta será la que use el personal del centro para cargar y editar pacientes.

5. **Variables de entorno**: copiar `.env.example` a `.env.local` y rellenar:
   ```bash
   cp .env.example .env.local
   ```
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`: del panel de Supabase (Settings → API).
   - `VISION_API_KEY`: solo necesaria para la lectura de listas por foto (fase 2).

5. **Levantar**
   ```bash
   npm run dev
   ```
   Abrir http://localhost:3000. La página principal es el buscador público; `/admin` lleva al login del personal de salud.

## Estructura del proyecto

- `src/app/page.tsx` — buscador público (Server Component).
- `src/app/admin/(autenticado)/` — rutas protegidas: dashboard, alta y edición.
- `src/app/admin/login/` — login del personal.
- `src/app/acciones.ts` — Server Actions del flujo público.
- `src/app/admin/(autenticado)/acciones.ts` — Server Actions del admin.
- `src/lib/supabase/` — clientes Supabase (browser / server) y tipos.
- `src/lib/clinical.ts` — etiquetas y colores para el estado clínico.
- `supabase/schema.sql` — tabla `pacientes`, RLS y `solicitudes_baja`.

## Leer lista desde foto (Gemini)

1. Inicia sesión en `/admin/login`.
2. Click en **Leer de foto** (esquina superior derecha).
3. **Elegí el centro de salud** abajo. Si la foto no tiene el hospital escrito, lo elegís acá y se aplica a **todas** las filas extraídas. Lo mismo con estado y municipio (opcionales).
4. **Subí una o varias fotos** de la lista (JPG/PNG/WebP, máx 8 MB cada una).
5. Click en **Procesar fotos** — Gemini analiza cada imagen y devuelve los pacientes.
6. **Revisá fila por fila**: podés editar cualquier campo, marcar/desmarcar para incluir, y ver la confianza estimada. Las filas con baja confianza quedan resaltadas en rojo.
7. Click en **Importar N filas** — solo se guardan las que vos marcaste.

### Variables de entorno

- `GEMINI_API_KEY` — clave de [Google AI Studio](https://aistudio.google.com/apikey).
  Tier gratuito: 15 RPM, 1500 RPD. Más que suficiente para la emergencia.

Los registros importados por foto quedan con `origen = 'foto_ocr'` y
`verificado = false`. El personal del centro los revisa y marca como
verificados después desde el dashboard.

## Importar pacientes desde CSV

1. Inicia sesión en `/admin/login`.
2. Click en **Importar CSV** (esquina superior derecha o desde el dashboard).
3. Arrastra o selecciona un archivo CSV exportado de Google Sheets / Excel.
4. Revisa la vista previa: filas válidas en verde, errores en rojo (se
   pueden ignorar o corregir en el archivo y volver a subir).
5. Click en **Importar N filas válidas**.

### Columnas aceptadas (case-insensitive)

| Columna | Obligatoria | Valores |
|---|---|---|
| `nombre_completo` | sí | texto, máx 120 chars |
| `centro_salud` | sí | texto, máx 120 chars |
| `estado_clinico` | sí | `estable`, `critico`, `sin_identificar`, `fallecido` |
| `edad_aprox` | no | número 0–130 |
| `sexo` | no | `M`, `F`, `desconocido` |
| `estado_geografico` | no | texto |
| `municipio` | no | texto |
| `descripcion_fisica` | no | texto |
| `foto_path` | no | ruta en el bucket `fotos-pacientes` |
| `verificado` | no | `true` / `false` |

Se acepta separador `,` o `;` (típico de Excel en español). La primera
fila debe tener los encabezados. Las fotos **no** se suben por CSV;
eso se hace desde el formulario individual.

### Ejemplo

```csv
nombre_completo,edad_aprox,sexo,estado_clinico,centro_salud,municipio,verificado
"María Rodríguez",45,F,estable,"Hospital Central de Valencia",Valencia,true
"Juan Pérez",,M,sin_identificar,"Hospital Central de Valencia",Valencia,false
```

## Decisiones de implementación documentadas

- **"Marcar como encontrado"** crea una fila en `solicitudes_baja` (el anónimo puede INSERT por RLS, pero NO puede actualizar `caso_cerrado` en `pacientes`). El personal del centro ve las solicitudes pendientes en `/admin` y cierra los casos desde ahí.
- **Filtro del dashboard** muestra solo los registros cargados con la cuenta logueada (`registrado_por = user.email`). El personal autenticado puede ver todos los casos (abiertos y cerrados) vía la política `lectura_autenticado`.
- **Fase 2** (`/admin/importar-foto`, OCR con visión) **no está incluida en esta versión** — sigue documentada en `docs/vision-extractor-prompt.md` para cuando llegue el momento.

## Importar datos existentes (CSV)

1. Exportar la hoja de Google Drive a CSV con columnas que coincidan con el esquema (ver `supabase/schema.sql`).
2. En Supabase: Table editor → tabla `pacientes` → Import data from CSV.
3. Subir las fotos al bucket `fotos-pacientes` y rellenar la columna `foto_path`.
4. Marcar `verificado = true` en los registros que provienen de centros confirmados.

## Despliegue (Vercel + subdominio)

1. Subir el repo a GitHub.
2. Importar en Vercel y configurar las variables de entorno.
3. Añadir el dominio `personas.tuportal.com` en Vercel.
4. Crear un registro **CNAME** en el DNS del portal apuntando al destino que indique Vercel.
5. Verificar propagación y certificado SSL.

## Documentación

- [`SPEC.md`](./SPEC.md) — especificación completa de construcción (lo que sigue la IA / el equipo).
- [`AGENTS.md`](./AGENTS.md) — instrucciones para agentes de IA que trabajen en el repo.
- [`PRIVACY.md`](./PRIVACY.md) — manejo de datos personales y aviso de privacidad.
- [`CONTRIBUTING.md`](./CONTRIBUTING.md) — cómo contribuir.
- [`docs/vision-extractor-prompt.md`](./docs/vision-extractor-prompt.md) — prompt del extractor de listas por foto.

## Licencia

MIT — ver [LICENSE](./LICENSE).

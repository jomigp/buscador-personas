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

2. **Crear proyecto en Supabase** (https://supabase.com) y, en el SQL Editor, ejecutar el contenido de [`supabase/schema.sql`](./supabase/schema.sql). Crea la tabla `pacientes`, los índices, el RLS, los triggers y la tabla `solicitudes_baja` para el botón "Marcar como encontrado" del público.

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

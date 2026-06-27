# AGENTS.md — Instrucciones para Agentes IA

> **Lee este archivo primero si sos una IA** (Claude, GPT, Gemini, Cursor, Copilot, etc.) trabajando en este repo. Te da el contexto mínimo para operar el proyecto sin romper nada.

## ¿Qué es esto?

App de emergencia para reunificación familiar tras el terremoto del 24-Jun-2026 en Venezuela. Familias buscan pacientes ingresados; personal de salud registra casos.

**No es un SaaS. Es un MVP de emergencia.** Velocidad > elegancia.

## TL;DR para IAs

```bash
# Setup
npm install
cp .env.example .env.local  # completar con Supabase + Gemini keys

# Desarrollo
npm run dev                  # localhost:3000
npm run build                # build de producción (debe pasar)
npm run lint                 # ESLint (debe pasar limpio)

# Despliegue
git push origin main         # Vercel redeploya solo
```

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Supabase + Vercel.
**Idioma**: TypeScript strict, español en UI, español/inglés en código.
**Tests**: pendientes (Fase 2).

## Reglas de oro

### 1. Seguridad es lo primero
- **NUNCA** hardcodear keys en código. Usar `process.env.X` o `import.meta.env.X`.
- **NUNCA** loggear el `service_role` key. Va solo en server-side, nunca en cliente.
- **NUNCA** deshabilitar RLS en producción. Está así por algo: el público solo lee casos abiertos.
- **NUNCA** hacer SQL dinámico con `string interpolation` — usar siempre `.eq()`, `.ilike()`, `.in()` del SDK o queries parametrizadas.

### 2. RLS es la fuente de verdad
Las políticas de Row Level Security en `supabase/schema.sql` definen QUÉ puede ver/hacer cada actor. Si una query falla con "permission denied", NO cambiar la política sin entender quién llama y por qué.

Resumen:
- `pacientes`: SELECT público (casos abiertos), INSERT/UPDATE/DELETE solo autenticados.
- `solicitudes_baja`: INSERT público, SELECT/UPDATE solo autenticados.
- `centros_salud`: SELECT público, todo solo autenticados.

### 3. UX móvil es prioridad
- **Mobile-first**. Toda feature se diseña primero para 375px de ancho.
- Botones con `class="touch-target"` (44x44px mínimo).
- Inputs con autocomplete via `<datalist>` cuando aplique.
- Auto-refresh con debounce 350ms en buscadores.
- Contraste mínimo 4.5:1 (texto pequeño), 3:1 (texto grande).
- Estados vacíos SIEMPRE con copy útil + acción siguiente ("Cargar CSV", "Crear caso", etc.).
- Errores con dos líneas: qué pasó + qué hacer.

### 4. Convenciones de código
- **No `<a>` para rutas internas** — usar `<Link>` de `next/link`.
- **Server Components por defecto**. Agregar `"use client"` solo si necesitás hooks/eventos.
- **Server Actions** para mutaciones (`src/app/acciones.ts`). **Route Handlers** solo para JSON público (`/api/*`).
- **Funciones helper en `src/lib/`**, no inline en componentes.
- **No abstraer antes de necesitar**. YAGNI.

### 5. Mensajes de commit
```
<tipo>: <descripción en imperativo>

<cuerpo opcional>

<footer opcional>
```

Tipos: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`. Mensaje en español o inglés (consistente con el repo). Cuerpo explica **qué y por qué**, no cómo.

### 6. Naming
- **Archivos**: kebab-case (`paciente-card.tsx`, `centros.ts`).
- **Componentes**: PascalCase (`PacienteCard`).
- **Funciones/vars**: camelCase.
- **SQL tables/cols**: snake_case.
- **Env vars**: SCREAMING_SNAKE_CASE.

## Estructura mental del proyecto

```
Usuario familiar (público)
   ↓ busca en /
Home → API route /api/pacientes → Supabase
   ↓ clickea caso
Detalle → server action → ...

Personal de salud (autenticado)
   ↓ login en /admin/login
Dashboard /admin → CRUD pacientes
   ↓ carga masiva
/admin/importar-csv → parser CSV → pacientes
/admin/importar-foto → Gemini → revisión → pacientes
```

Datos críticos: `pacientes` (casos), `solicitudes_baja` (público pide baja), `centros_salud` (catálogo de 241 hospitales). Ver [docs/DATA-MODEL.md](./docs/DATA-MODEL.md) para detalle.

## Tareas comunes — cómo hacerlas

### Agregar un campo nuevo a un paciente

1. **Migración**: agregar columna en `supabase/schema.sql` con `ALTER TABLE pacientes ADD COLUMN IF NOT EXISTS ...`.
2. **Tipos TS**: actualizar `src/lib/types.ts` o donde estén los tipos de pacientes.
3. **Formulario**: agregar input en `src/components/formulario-paciente.tsx` con label + hint.
4. **Server action**: agregar a `INSERT/UPDATE` en `src/app/admin/(autenticado)/acciones.ts`.
5. **Card**: mostrar en `src/components/paciente-card.tsx` si es público.
6. **Test**: manual en `/admin/nuevo`.
7. **Build + lint + commit + push**.

### Agregar un centro de salud nuevo al catálogo

Opción A — desde Supabase Dashboard:
```sql
INSERT INTO centros_salud (nombre, estado, municipio, red, tipo)
VALUES ('Hospital Nuevo', 'CARABOBO', 'Valencia', 'MPPS', 'Hospital');
```

Opción B — desde CSV: editar `scripts/hospitales-venezuela-completo.csv`, regenerar `supabase/seed-centros.sql` (re-correr el script Python si existe en `scripts/parse-hospitales.py`), commit, push. El autocomplete se actualiza solo.

### Cambiar un endpoint /api/*

1. La ruta está en `src/app/api/<nombre>/route.ts`.
2. Usar `createClient()` de `@/lib/supabase/server` para queries con RLS.
3. Usar `createAdminClient()` (con `service_role`) SOLO si necesitás bypass de RLS (ej. migraciones).
4. Devolver JSON con status codes correctos (400, 401, 403, 404, 500).
5. Validar input con `zod` o tipos manuales.

### Cambiar la home / buscador

- `src/app/page.tsx` es la home.
- `src/components/buscador.tsx` tiene la lógica de filtros.
- Debounce 350ms en cambios de input.
- Auto-refresh con `router.push(...)` (no full reload).

### Mejorar accesibilidad

- Agregar `aria-label` a iconos sin texto.
- `aria-live="polite"` para status async (buscando, guardando, etc.).
- `role="alert"` para errores, `role="status"` para OK.
- Focus visible con doble anillo (`focus-visible:ring-2` + color de marca).
- Modales: trap focus, Escape cierra, click-outside cierra, body scroll lock.
- Probar con teclado (Tab/Shift+Tab/Enter) y lector de pantalla (VoiceOver/NVDA).

## Cosas que NO hacer

- ❌ No agregar wizard de onboarding (fricción en emergencia).
- ❌ No agregar captcha al buscador (fricción para familias angustiadas).
- ❌ No hacer SSR de páginas autenticadas que pueden ser CSR (más rápido).
- ❌ No agregar analytics invasivos en MVP.
- ❌ No cambiar la estructura de carpetas sin discutir.
- ❌ No actualizar dependencias majeures sin issue previo.
- ❌ No crear `package-lock.json` con `npm install --force` salvo emergencia.
- ❌ No commitear `.env.local`, `.env`, `node_modules`, `.next`.

## Si una IA propone un cambio grande

Antes de implementar, responder:
1. ¿Mejora la velocidad de operación en emergencia?
2. ¿Es mobile-first?
3. ¿Cumple el modelo de seguridad?
4. ¿Se puede hacer en menos de 50 líneas?

Si la respuesta a cualquiera es NO, replantear.

## Cómo pedir ayuda

- Issues de seguridad: [SECURITY.md](./SECURITY.md).
- Issues de UX/diseño: tag `ux`.
- Issues de datos: tag `data`.
- Todo lo demás: GitHub Issues.

## Contacto del maintainer

José Miguel G潘 (jomigp). GitHub: [@jomigp](https://github.com/jomigp).

---

**Última actualización**: junio 2026. Este archivo evoluciona con el proyecto. Si vas a hacer cambios estructurales, actualizá este archivo también.
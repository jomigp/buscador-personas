# Arquitectura

> **Resumen para humanos + IAs**: cómo está montado el proyecto, por qué se eligieron estas tecnologías, y dónde están los trade-offs.

## 🎯 Principios de diseño

1. **Velocidad > elegancia** — es un MVP de emergencia, no un SaaS.
2. **Mobile-first** — el 80% del tráfico va a ser de familias angustiadas con el celular.
3. **Datos sensibles por diseño** — RLS en TODAS las tablas, no como afterthought.
4. **Server-side first** — menos JS al cliente = más rápido.
5. **Sin wizard** — cada click cuenta. Flujos lineales, auto-refresh, defaults razonables.
6. **Open source por contrato social** — cualquier medio puede clonar la app.

## 🏗️ Diagrama general

```
┌─────────────────────────────────────────────────────────────────┐
│                       VERCEL (CDN + Edge)                       │
│  Next.js 16 App Router  •  Static assets  •  Edge middleware   │
└─────────────────────────────────────────────────────────────────┘
           │                                  │
           │ /api/pacientes                   │ Server Actions
           │ (Route Handler)                  │ (Server Components)
           ▼                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                  SUPABASE (Postgres + Auth + Storage)          │
│                                                                  │
│  ┌─────────────────┐  ┌──────────────────┐  ┌────────────────┐  │
│  │   pacientes     │  │ solicitudes_baja │  │ centros_salud  │  │
│  │ (casos)         │  │ (bajas)          │  │ (catálogo)     │  │
│  └─────────────────┘  └──────────────────┘  └────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Storage: fotos-pacientes/ (público, RLS via Storage)   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                                ▲
                                                │ Llamadas API
                                                │
                                ┌──────────────────────────┐
                                │ Google Gemini 2.5 Flash  │
                                │  (OCR de listados foto)  │
                                └──────────────────────────┘
```

## 🧱 Capas

### 1. Capa de presentación (Next.js App Router)

- **Server Components por defecto**: la mayoría de las páginas son RSC (renderizadas en el servidor). Esto reduce el bundle de JS al cliente.
- **Client Components** solo donde hay interactividad: formularios, modales, filtros, datalists.
- **Layout raíz** en `src/app/layout.tsx`: provee `<html>`, `<body>`, fuentes, metadatos y carga el CSS de Tailwind.

**Decisiones**:
- `app/layout.tsx` envuelve con `flex flex-col min-h-screen pt-20 pb-24 md:pb-32` — el padding-bottom reserva espacio para la BottomNav móvil. **NO agregar `min-h-screen` ni `pb-*` en páginas individuales** (regresión conocida).
- Usar `next/link` para navegación interna (prefetch automático).
- Usar `next/image` solo donde la imagen es crítica (foto de paciente). Logos/íconos van como SVG inline.

### 2. Capa de routing

Tres tipos:

| Tipo | Ubicación | Uso |
|------|-----------|-----|
| **Páginas públicas** | `src/app/page.tsx`, `src/app/admin/login/page.tsx` | Búsqueda, login |
| **Páginas autenticadas** | `src/app/admin/(autenticado)/*.tsx` | CRUD pacientes |
| **Route Handlers** | `src/app/api/*.ts` | JSON público (`/api/pacientes`, `/api/leer-lista`) |

**Decisiones**:
- **Server Actions** para mutaciones autenticadas (`src/app/admin/(autenticado)/acciones.ts`). Más seguro que Route Handlers porque el código nunca viaja al cliente.
- **Route Handlers** solo cuando necesitamos devolver JSON a terceros o cuando el cliente hace fetch directo.
- **No usar middleware** para auth — los Route Groups `(autenticado)/layout.tsx` ya actúan como guard.

### 3. Capa de datos

Dos clientes Supabase:

- `src/lib/supabase/client.ts` — `createBrowserClient` (anon key, RLS aplica).
- `src/lib/supabase/server.ts` — `createServerClient` (anon key en RSC, service_role en server actions cuando se necesita bypass).

**Reglas**:
- Componentes de servidor y Route Handlers públicos usan el cliente con anon key → RLS aplica → es seguro.
- Server Actions autenticadas usan el cliente con la sesión del usuario → RLS sigue aplicando → seguro.
- Solo migraciones / admin scripts usan `service_role` → bypass total → máximo cuidado.

### 4. Capa de IA (Fase 2)

- `src/lib/vision.ts` — wrapper de `@google/generative-ai`.
- Endpoint público: `POST /api/leer-lista` con multipart/form-data (imagen).
- Modelo: **Gemini 2.5 Flash** (gratis hasta 15 RPM, soporta visión).
- Schema JSON estructurado: el modelo devuelve `{ pacientes: [{ nombre, edad, ... }] }` con `responseSchema` para forzar formato.

**Decisiones**:
- El OCR **nunca** escribe directo a la BD. Devuelve al cliente y el admin revisa/confirma.
- `GEMINI_API_KEY` solo se usa server-side (Route Handler).
- Si Gemini falla, fallback manual (el admin tipea).

## 🔐 Seguridad

### Modelo de amenaza

**Actores**:
1. **Público anónimo** (familiar angustiado): busca, no escribe (excepto solicitudes_baja).
2. **Personal autenticado** (médico/enfermera): escribe pacientes.
3. **Admin del medio**: gestiona usuarios + centros.
4. **Atacante externo**: intenta SQL injection, scraping masivo, robo de datos.

**Defensas**:
- RLS en TODAS las tablas (Postgres nativo, no es opcional).
- Anon key en cliente (no expone service_role).
- Validación de inputs en server actions (tipos TS + zod si está).
- HTTPS obligatorio (Vercel lo provee).
- CSP headers en `next.config.ts` (Fase 2).

### Datos sensibles

| Dato | Nivel | Manejo |
|------|-------|--------|
| Nombre completo | PII | Visible si caso abierto |
| Edad | PII | Visible si caso abierto |
| Sexo | PII | Visible si caso abierto |
| Foto | PII | Storage con RLS, URL pública firmada |
| Estado clínico | Confidencial | Visible (la familia necesita saber) |
| Centro de salud | Público | Visible |
| Notas internas | Confidencial | Solo personal autenticado |

Ver [PRIVACY.md](../PRIVACY.md) para detalle legal.

## 📊 Performance

### Bundle size

- Tailwind v4 con purge automático (clases no usadas se eliminan en build).
- `next/font` para fuentes (auto-hospedaje, sin FOUT).
- Imágenes con `next/image` (lazy load + WebP automático).
- Code splitting automático de Next.js.

### Caching

- **Vercel CDN** cachea páginas estáticas (ej. `/` si no hay query).
- **Supabase** tiene su propio caché de queries.
- **No usar** `cache: 'no-store'` salvo en datos en tiempo real (ej. lista de pacientes).
- **`revalidate`** en fetch de Next.js si hay datos semi-estáticos (ej. catálogo de centros).

### Debouncing

- Buscador: 350ms (típico UX).
- Auto-save en formularios: NO hacer (los médicos están cansados, no quieren perder data).

## 🔌 Dependencias externas

| Dependencia | Versión | Por qué |
|-------------|---------|---------|
| `next` | 16.x | App Router, RSC, Server Actions |
| `react` | 19.x | Concurrent rendering, Server Components |
| `@supabase/ssr` | última | Cookies para auth en RSC |
| `@supabase/supabase-js` | última | Cliente JS de Supabase |
| `@google/generative-ai` | última | OCR de listados |
| `tailwindcss` | v4 | Utility-first CSS |
| `typescript` | 5.x | Type safety |

**NO usar** (decisiones explícitas):
- ❌ NextAuth — Supabase Auth es más simple.
- ❌ Prisma — Supabase JS es directo, ahorra una capa.
- ❌ Redux/Zustand — Server Actions + URL state alcanzan.
- ❌ Stripe/pagos — no aplica en emergencia.
- ❌ Sentry (todavía) — Fase 2, ver ROADMAP.

## 🌐 Internacionalización

- **UI en español** (es-VE). El proyecto es para Venezuela.
- **Código en inglés** (variables, funciones). Convenciones internacionales.
- **SQL en snake_case + español** (nombres de columnas: `centro_salud`, `estado_clinico`).

Para agregar otro idioma:
1. Crear `messages/en.json` y mover `messages/es.json` (si los hubiera).
2. Usar `next-intl` o similar.
3. NO en MVP (fase 3).

## 🚧 Trade-offs conocidos

| Decisión | Alternativa | Por qué elegimos esto |
|----------|-------------|------------------------|
| **Supabase** | Firebase, Convex | RLS nativo, Postgres = datos relacionales fáciles de exportar |
| **Gemini 2.5 Flash** | GPT-4 Vision, Claude Vision | Gratis hasta 15 RPM, soporta JSON schema |
| **Vercel** | Netlify, Cloudflare Pages | Edge + Server Actions = combo |
| **No wizard** | Multi-step form | Fricción mata adopción en emergencia |
| **Server Actions** | REST API | Menos código, type-safe end-to-end |
| **Static seed centros** | API externa | Funciona offline, no depende de servicios |
| **No tests automatizados** | Jest/Vitest | MVP, validar manualmente; tests en Fase 2 |
| **CSV parser propio** | Papa Parse | Más control sobre fuzzy match |

## 🔮 Decisiones diferidas (Fase 2/3)

- [ ] Migrar a Next.js 17 cuando salga (aprovechar Server Actions estables).
- [ ] Agregar tests con Vitest + Playwright.
- [ ] Internacionalización con `next-intl`.
- [ ] Sello "Verificado por centro" con SACS (ver [SACS-VERIFICACION.md](./SACS-VERIFICACION.md)).
- [ ] Búsqueda full-text con `pg_trgm` o Meilisearch.
- [ ] Notificaciones por email al personal cuando hay solicitud de baja.

---

**Próximo documento**: [DATA-MODEL.md](./DATA-MODEL.md) — schema de BD, RLS, índices.
# GitHub Copilot Instructions — Buscador de Personas

## Contexto

App de emergencia para reunificación familiar tras terremoto en Venezuela. Stack: Next.js 16 + React 19 + TypeScript + Tailwind v4 + Supabase + Vercel. Idioma: código inglés, UI español.

## Reglas de oro

1. **Seguridad primero**: nunca hardcodear keys, nunca deshabilitar RLS, nunca SQL dinámico.
2. **Mobile-first**: diseñar primero para 375px, botones 44x44px mínimo.
3. **Server Components por defecto**: solo usar `"use client"` si hay interactividad.
4. **Sin wizard**: flujos lineales, auto-refresh, mínima fricción.
5. **Convenciones**: archivos kebab-case, componentes PascalCase, snake_case en SQL.

## Patrones preferidos

- ✅ `<Link href="...">` para navegación interna (no `<a>`)
- ✅ `createClient()` de `@/lib/supabase/server` para RSC
- ✅ Server Actions para mutaciones (`'use server'`)
- ✅ `<datalist>` para autocompletes
- ✅ `ilike '%term%'` para búsqueda tolerante a typos
- ✅ Tailwind utility classes (no CSS modules)
- ✅ `next/image` para imágenes críticas (fotos de pacientes)

## Patrones a evitar

- ❌ `<a href="/...">` para rutas internas
- ❌ `dangerouslySetInnerHTML`
- ❌ `eval()`, `new Function()`, SQL dinámico
- ❌ Captcha, wizards multi-step
- ❌ Redux/Zustand (usar URL state + Server Actions)
- ❌ CSS-in-JS (usar Tailwind)
- ❌ Imports desde `node_modules` no listados en package.json

## Rutas

- **Públicas**: `/` (home/buscador), `/admin/login`
- **Autenticadas**: `/admin`, `/admin/nuevo`, `/admin/[id]`, `/admin/importar-csv`, `/admin/importar-foto`
- **API**: `/api/pacientes` (GET JSON), `/api/leer-lista` (POST OCR)

## Datos críticos

- `pacientes`: casos (RLS: público solo lee casos abiertos)
- `solicitudes_baja`: público pide baja → personal aprueba
- `centros_salud`: catálogo de 241 hospitales (carga desde `supabase/seed-centros.sql`)

## Tests

No hay tests automatizados todavía. Validar manualmente:
- Mobile (375px, 414px)
- Desktop (1280px)
- Teclado (Tab, Enter, Escape)
- Lector de pantalla (VoiceOver/NVDA)

## Build

```bash
npm run build && npm run lint
```

Ambos deben pasar antes de PR.

## Más contexto

Ver:
- `AGENTS.md` (instrucciones detalladas para IAs)
- `docs/ARCHITECTURE.md` (arquitectura)
- `docs/DATA-MODEL.md` (schema + RLS)
- `docs/API.md` (rutas y endpoints)
- `CONTRIBUTING.md` (cómo contribuir)
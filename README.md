# Buscador de Personas en Centros de Salud

Web app de emergencia para **reunificación familiar** tras el **doblete sísmico del 24 de junio de 2026 en Venezuela** (magnitudes 7.2 y 7.5 Mw). Permite que las familias encuentren a sus seres queridos ingresados en hospitales, clínicas y centros de triaje, y que el personal de salud registre y actualice los casos.

Proyecto **open source** impulsado por un medio de comunicación venezolano.

> ⚠️ Esta app maneja datos personales de personas vulnerables en una emergencia. Léase [PRIVACY.md](./PRIVACY.md) y [SECURITY.md](./SECURITY.md) antes de contribuir o desplegar.

---

## 🆘 TL;DR — Si tenés 30 segundos

**¿Qué hace?** Familias buscan pacientes ingresados → Personal de salud registra casos.

**¿Cómo está construida?** Next.js 16 + Supabase + Vercel. Lee [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) para el detalle.

**¿Querés levantarla local?** Ver [Puesta en marcha](#-puesta-en-marcha-local).

**¿Querés entender el modelo de datos?** [docs/DATA-MODEL.md](./docs/DATA-MODEL.md).

**¿Sos una IA?** Saltá a [AGENTS.md](./AGENTS.md) — son instrucciones precisas para que tu clase opere el proyecto.

---

## 📚 Tabla de contenidos

### Para humanos
- [Qué hace](#-qué-hace)
- [Stack](#-stack)
- [Puesta en marcha (local)](#-puesta-en-marcha-local)
- [Puesta en marcha (producción)](#-puesta-en-marcha-producción)
- [Estructura del repo](#-estructura-del-repo)
- [Cómo contribuir](./CONTRIBUTING.md)

### Documentación técnica
- [**docs/ARCHITECTURE.md**](./docs/ARCHITECTURE.md) — arquitectura, decisiones de diseño, trade-offs
- [**docs/DATA-MODEL.md**](./docs/DATA-MODEL.md) — schema de BD, RLS, índices
- [**docs/API.md**](./docs/API.md) — rutas, endpoints, server actions
- [**docs/OPERATIONS.md**](./docs/OPERATIONS.md) — manual de operación en emergencia
- [**docs/DEPLOYMENT.md**](./docs/DEPLOYMENT.md) — deploy, env vars, troubleshooting
- [**docs/ROADMAP.md**](./docs/ROADMAP.md) — fase 2 (OCR) y fase 3 (verificación MPPS)
- [**docs/SACS-VERIFICACION.md**](./docs/SACS-VERIFICACION.md) — diseño del sello "verificado MPPS"

### Para IAs y herramientas IA
- [**AGENTS.md**](./AGENTS.md) — instrucciones para cualquier agente IA (Claude Code, Cursor, Copilot, etc.)
- [**CLAUDE.md**](./CLAUDE.md) — alias de AGENTS.md para Claude Code
- [**llms.txt**](./llms.txt) — resumen estructurado para crawlers IA
- [**`.cursorrules`**](./.cursorrules) — reglas para Cursor IDE
- [**`.github/copilot-instructions.md`**](./.github/copilot-instructions.md) — instrucciones para GitHub Copilot

### Compliance y comunidad
- [**PRIVACY.md**](./PRIVACY.md) — privacidad y manejo de datos sensibles
- [**SECURITY.md**](./SECURITY.md) — cómo reportar vulnerabilidades
- [**CODE_OF_CONDUCT.md**](./CODE_OF_CONDUCT.md) — código de conducta
- [**LICENSE**](./LICENSE) — MIT

---

## 🎯 Qué hace

### Buscador público (sin login)
Cualquier familiar entra a la home, escribe el nombre o filtra por **estado / municipio / centro de salud** y ve coincidencias de pacientes. El filtro es **case-insensitive y tolerante a typos parciales** (`ilike '%term%'`). Los resultados incluyen:
- Nombre y apellido
- Estado clínico (estable / delicado / crítico / sin identificar)
- Edad y sexo
- Centro de salud donde se encuentra
- Municipio y estado geográfico
- Foto (si el personal la subió)
- Fecha de ingreso

Las páginas de detalle (futuro) y los datos personales sensibles están protegidos — solo el **sello "Verificado por centro"** indica confianza.

### Carga restringida (login de personal de salud)
Personal de salud autenticado registra pacientes con:
- Datos básicos: nombre, apellido, edad, sexo
- Ubicación: centro de salud (autocomplete), estado, municipio
- Estado clínico: estable / delicado / crítico / sin_identificar / recuperado / fallecido
- Foto opcional (Storage bucket `fotos-pacientes`)
- Notas internas (visibles solo al personal)

### Carga masiva por foto (Fase 2)
Subís la foto de un listado de mano y un modelo de visión (Gemini 2.5 Flash) extrae los datos. El admin revisa la confianza por campo y acepta/rechaza antes de guardar. Endpoint: [`/admin/importar-foto`](./docs/API.md#adminimportar-foto).

### "Marcar como encontrado" (público)
Si un familiar cree reconocer a alguien, no edita datos — crea una **solicitud de baja** que el personal revisa y decide. Principio: **solo autenticados escriben en `pacientes`**.

---

## 🧱 Stack

| Capa | Tecnología |
|------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Lenguaje** | TypeScript (strict) |
| **UI** | React 19, Tailwind CSS v4 |
| **Backend** | Next.js Server Actions + Route Handlers |
| **Base de datos** | Supabase (Postgres 15) |
| **Auth** | Supabase Auth (email + password) |
| **Storage** | Supabase Storage (bucket `fotos-pacientes`) |
| **IA** | Google Gemini 2.5 Flash (OCR de listados) |
| **Deploy** | Vercel |
| **Tests** | Pendiente (Fase 2) |
| **Lint/format** | ESLint + Prettier (Tailwind config) |

**Requisitos**: Node.js 20+, npm 10+, cuenta Supabase (free tier alcanza), cuenta Vercel (free tier alcanza), API key de Google AI Studio (Gemini free tier).

---

## 🏃 Puesta en marcha (local)

### 1. Clonar e instalar

```bash
git clone https://github.com/jomigp/buscador-personas.git
cd buscador-personas
npm install
```

### 2. Configurar Supabase

1. Crear proyecto en [https://supabase.com](https://supabase.com).
2. Ir a **SQL Editor** y correr **en este orden**:
   - [`supabase/schema.sql`](./supabase/schema.sql) — crea tablas, RLS, índices y triggers.
   - [`supabase/seed-centros.sql`](./supabase/seed-centros.sql) — carga 241 centros de salud oficiales como catálogo.
   - `NOTIFY pgrst, 'reload schema';` — refresca caché PostgREST (CRÍTICO, sino no ve las tablas nuevas).
3. Crear bucket Storage **`fotos-pacientes`** (público).
4. Crear usuario admin en **Authentication → Users → Add user** con email + password.
5. Copiar las keys de **Settings → API** (URL + anon key + service_role key).

### 3. Variables de entorno

```bash
cp .env.example .env.local
```

Completar `.env.local` con:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://<tu-proyecto>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...           # pública, va al cliente
SUPABASE_SERVICE_ROLE_KEY=eyJ...                # PRIVADA, solo server-side
GEMINI_API_KEY=AIzaSy...                        # https://aistudio.google.com/app/apikey
```

### 4. Correr dev server

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000). El admin está en `/admin/login`.

### 5. Verificar

```bash
npm run build   # build de producción
npm run lint    # ESLint
```

---

## 🚀 Puesta en marcha (producción)

Ver [**docs/DEPLOYMENT.md**](./docs/DEPLOYMENT.md) para el detalle paso a paso (Vercel + custom domain + env vars + monitoring).

Resumen rápido:
1. Conectar repo en Vercel.
2. Configurar env vars (las mismas que local).
3. Deploy.
4. Verificar `https://<tu-dominio>/api/pacientes` (debe devolver JSON).

---

## 📁 Estructura del repo

```
buscador-personas/
├── README.md                            ← este archivo
├── AGENTS.md                            ← instrucciones para IAs
├── CLAUDE.md                            ← alias para Claude Code
├── llms.txt                             ← resumen para crawlers IA
├── .cursorrules                         ← reglas para Cursor IDE
├── .github/
│   └── copilot-instructions.md          ← instrucciones para GitHub Copilot
├── CONTRIBUTING.md
├── SECURITY.md
├── PRIVACY.md
├── CODE_OF_CONDUCT.md
├── LICENSE
│
├── docs/                                ← documentación técnica
│   ├── ARCHITECTURE.md
│   ├── DATA-MODEL.md
│   ├── API.md
│   ├── OPERATIONS.md
│   ├── DEPLOYMENT.md
│   ├── ROADMAP.md
│   └── SACS-VERIFICACION.md
│
├── supabase/                            ← SQL ejecutado en Supabase
│   ├── schema.sql                       ← estructura + RLS + triggers
│   └── seed-centros.sql                 ← 241 centros de salud
│
├── scripts/                             ← utilidades de mantenimiento
│   └── hospitales-venezuela-completo.csv
│
├── public/
│   ├── icon.svg
│   └── manifest.json
│
└── src/
    ├── app/                             ← Next.js App Router
    │   ├── layout.tsx
    │   ├── page.tsx                     ← buscador público
    │   ├── globals.css
    │   ├── acciones.ts                  ← server actions del público
    │   ├── admin/
    │   │   ├── login/page.tsx
    │   │   ├── page.tsx
    │   │   ├── nuevo/page.tsx
    │   │   ├── importar-csv/page.tsx
    │   │   ├── importar-foto/page.tsx
    │   │   ├── [id]/page.tsx
    │   │   └── (autenticado)/
    │   │       ├── layout.tsx           ← guard de autenticación
    │   │       └── acciones.ts
    │   └── api/
    │       ├── pacientes/route.ts
    │       └── leer-lista/route.ts
    │
    ├── components/
    │   ├── paciente-card.tsx
    │   ├── buscador.tsx
    │   ├── formulario-paciente.tsx
    │   └── ...
    │
    └── lib/
        ├── supabase/
        │   ├── client.ts                ← @supabase/ssr para cliente
        │   └── server.ts                ← @supabase/ssr para server
        ├── centros.ts                   ← getDistinctValues()
        ├── hospitales-seed.ts           ← fallback estático de 241 centros
        ├── csv.ts                       ← parser CSV con normalización fuzzy
        ├── vision.ts                    ← Gemini 2.5 Flash para OCR
        └── clinical.ts                  ← etiquetas canónicas de estados clínicos
```

---

## 🤝 Cómo contribuir

Ver [**CONTRIBUTING.md**](./CONTRIBUTING.md). Resumen:
- Fork → branch → PR.
- Mensajes de commit en español o inglés, formato `feat:`, `fix:`, `docs:`, etc.
- Antes de PR: `npm run build && npm run lint` verde.
- Para features grandes, abrí issue primero.

---

## 🆘 Operación en emergencia

Si estás operando la app durante el desastre, leé [**docs/OPERATIONS.md**](./docs/OPERATIONS.md) — incluye:
- Cómo agregar un centro nuevo al catálogo
- Cómo crear un usuario de personal de salud
- Cómo restaurar la BD si se borra
- Cómo escalar si hay picos de tráfico
- Qué hacer si Vercel/Supabase caen

---

## 📜 Licencia

[MIT](./LICENSE). Código abierto para que cualquier medio o gobierno pueda clonar la app y adaptarla a su contexto.

---

## 🙏 Reconocimientos

- **Google Gemini** por la API gratuita de visión
- **Supabase** por el backend generoso en free tier
- **Vercel** por el hosting rápido
- **Convite AC** por el Monitor de Hospitales (fuente original de la lista de centros)
- **MPPS** por los datos oficiales

---

**Contacto del maintainer**: ver [SECURITY.md](./SECURITY.md) para issues de seguridad; el resto por issues de GitHub.
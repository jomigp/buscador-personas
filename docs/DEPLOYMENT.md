# Deployment Guide

> Cómo llevar la app a producción en Vercel, paso a paso. Para humanos haciendo el deploy por primera vez y para IAs que necesiten replicar el setup.

## 📋 Pre-requisitos

- Cuenta [GitHub](https://github.com) con el repo `buscador-personas` (público o privado).
- Cuenta [Vercel](https://vercel.com) (free tier alcanza para MVP).
- Cuenta [Supabase](https://supabase.com) con proyecto creado y schema ejecutado.
- Cuenta [Google AI Studio](https://aistudio.google.com) con API key de Gemini.
- Dominio custom (opcional, US$10-15/año).

## 🚀 Deploy en Vercel

### 1. Importar repo

1. Ir a [vercel.com/new](https://vercel.com/new).
2. **Import Git Repository** → seleccionar `jomigp/buscador-personas`.
3. **Framework Preset**: Next.js (auto-detectado).
4. **Root Directory**: `./` (dejar default).
5. **Build Command**: `npm run build` (default).
6. **Output Directory**: dejar default (Next.js).

### 2. Variables de entorno

En **Environment Variables**, agregar:

| Variable | Valor | Notas |
|----------|-------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` | Pública, va al cliente |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | Pública, va al cliente |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | **PRIVADA**, solo server-side |
| `GEMINI_API_KEY` | `AIzaSy...` | **PRIVADA**, solo server-side |
| `NEXT_PUBLIC_SITE_URL` | `https://<tu-dominio>.vercel.app` | Para metadata OG |

**Para cada variable**: marcar **Production**, **Preview** y **Development** (las tres).

### 3. Deploy

Click **Deploy**. Espera 2-3 minutos. Si todo va bien:
- Build pasa ✅
- URL provisoria: `https://buscador-personas-<hash>.vercel.app`

### 4. Verificar

```bash
# Health check
curl https://<url>.vercel.app/api/pacientes?limit=1

# Debe devolver JSON (incluso si data es [])
```

Si devuelve error 500, revisar:
- Vercel Logs (Runtime).
- Variables de entorno están bien copiadas.
- Supabase está accesible públicamente.

---

## 🌐 Dominio custom

### Configurar en Vercel

1. **Project Settings** → **Domains** → **Add**.
2. Escribir `buscador.example.com`.
3. Vercel da registros DNS para agregar en tu proveedor (GoDaddy, Namecheap, Cloudflare, etc.).

### Tipos de registros

Para `buscador.example.com` (subdominio):
```
CNAME buscador cname.vercel-dns.com
```

Para `example.com` (apex):
```
A @ 76.76.21.21
```

### SSL

Vercel genera certificado Let's Encrypt automáticamente. Tarda ~5 minutos después del DNS.

### Forzar HTTPS

Vercel lo hace por default. No requiere config.

---

## 🔒 Seguridad pre-prod

### Checklist

- [ ] Variables de entorno configuradas en Vercel (no en `.env.local` que queda en repo).
- [ ] `SUPABASE_SERVICE_ROLE_KEY` **NO está en código** (solo en env vars).
- [ ] RLS está habilitado en TODAS las tablas (verificar en Supabase Dashboard).
- [ ] `service_role` key está **solo en server-side** (Route Handlers + Server Actions).
- [ ] Bucket Storage `fotos-pacientes` es público (para URLs públicas) pero con RLS de Storage.
- [ ] HTTPS forzado (Vercel default).
- [ ] Dominio custom configurado.
- [ ] DNS propagation completa (usar https://dnschecker.org).

### Pre-deploy checks automáticos

```bash
npm run build && npm run lint
```

Si pasan, hacer push y Vercel redeploya solo.

---

## 🔄 Workflow de deploy continuo

```
git push origin main
  ↓
Vercel detecta push
  ↓
Ejecuta: npm install && npm run build
  ↓
Si pasa: deploy a producción (URL custom)
Si falla: rollback automático + email al maintainer
```

### Preview deployments

Cada PR abre un **preview deployment** con URL única. Ideal para:
- Probar features antes de mergear.
- Compartir con stakeholders.
- Testing QA.

### Rollback

Si un deploy rompe producción:
1. **Vercel Dashboard** → **Deployments** → click en deploy anterior funcional → **Promote to Production**.

O:
```bash
vercel rollback
```

---

## 📊 Monitoring

### Vercel Analytics

1. **Project Settings** → **Analytics** → **Enable**.
2. Gratis en Pro tier. Métricas: TTFB, errores, geolocalización.

### Logs en tiempo real

```bash
vercel logs --follow
```

O desde Dashboard: **Deployments** → click → **Logs**.

### Alertas

**Vercel**:
- Settings → **Notifications** → agregar email/Slack.
- Se notifica deploy fallido, build fallido, error 5xx masivo.

**Supabase**:
- Settings → **Notifications** → habilitar "Database alerts".
- Se notifica: CPU > 80%, conexiones > 80%, storage > 80%.

---

## 🌍 Multi-región

Vercel tiene edge functions en múltiples regiones. Por default:
- Producción: `iad1` (US East).
- Functions se ejecutan cerca del usuario.

Si el tráfico es principalmente de Venezuela:
- No hay edge location en VE.
- Pero Miami/Fortaleza está cerca. TTFB aceptable (~80ms desde Caracas).

---

## 💰 Costos estimados

| Servicio | Free tier | Necesario | Costo/mes |
|----------|-----------|-----------|-----------|
| **Vercel** | Hobby: 100GB bandwidth, 100 builds/día | MVP | $0 |
| **Vercel** | Pro: 1TB bandwidth, builds ilimitados | Producción | $20 |
| **Supabase** | Free: 500MB BD, 1GB storage, 50k MAU | MVP | $0 |
| **Supabase** | Pro: 8GB BD, 100GB storage, 100k MAU | Producción | $25 |
| **Google AI** | Free: 15 RPM, 1500 req/día | MVP | $0 |
| **Dominio** | - | Producción | $1-2 |
| **Total MVP** | | | **$0** |
| **Total Producción** | | | **~$45/mes** |

---

## 🆘 Troubleshooting común

### Build falla: "Cannot find module '@supabase/ssr'"
```bash
# Asegurarse que package.json tiene la dependencia
npm install @supabase/ssr
git add package.json package-lock.json
git commit -m "fix: agregar @supabase/ssr"
git push
```

### Build falla: "Module not found: Can't resolve '@/lib/...'`
```bash
# Verificar tsconfig.json tiene paths:
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Deploy OK pero 500 en runtime
1. Vercel Logs → buscar el error.
2. Si es "permission denied for table pacientes", RLS está bloqueando — verificar políticas.
3. Si es "Invalid API key", las env vars están mal.

### "Could not find table 'centros_salud' in schema cache"
PostgREST no refrescó caché después de crear la tabla.
```sql
NOTIFY pgrst, 'reload schema';
```
O en Dashboard: **Settings** → **API** → **Restart API**.

### Fotos no se ven
1. Verificar bucket `fotos-pacientes` es público.
2. Verificar política RLS de Storage:
```sql
create policy "lectura_publica_fotos" on storage.objects
  for select using (bucket_id = 'fotos-pacientes');
```

### Vercel cobra de más
1. **Usage** → ver breakdown.
2. Común: imágenes muy pesadas (optimizar con `next/image`).
3. Común: funciones que no se cachean (agregar `export const revalidate = 3600`).

---

## 📋 Post-deploy checklist

- [ ] URL funciona (curl devuelve 200).
- [ ] `/admin/login` carga.
- [ ] Crear un paciente de prueba y verificar que aparece en `/`.
- [ ] Subir una foto y verificar que se ve.
- [ ] Probar `/admin/importar-foto` con una foto de prueba.
- [ ] Configurar dominio custom.
- [ ] Habilitar Vercel Analytics.
- [ ] Habilitar Supabase Alerts.
- [ ] Compartir URL con el equipo editorial.

---

**Próximo documento**: [ROADMAP.md](./ROADMAP.md) — qué viene después.
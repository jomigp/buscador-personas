# Manual de Operaciones en Emergencia

> Cómo operar la app **durante el desastre**. Este documento está escrito para el maintainer y para IAs que necesiten responder preguntas operativas en momentos críticos.

## 🆘 Si hay un problema AHORA

### La app no carga
1. Verificar [Vercel dashboard](https://vercel.com/dashboard) → status del deploy.
2. Si el deploy falló, revisar logs → causa común: error de TS.
3. Si deploy OK pero runtime falla, revisar [Supabase status](https://status.supabase.com).
4. Si Supabase está caído, el sitio degrada a "BD no disponible" — el buscador no funciona pero el admin sí puede intentar login.

### El buscador no devuelve resultados
1. Verificar que `pacientes` tiene datos: `SELECT count(*) FROM pacientes;` en SQL Editor.
2. Si count > 0 pero no aparece, probable: cache de PostgREST no refrescado.
   ```sql
   NOTIFY pgrst, 'reload schema';
   ```
3. Si persiste, ir a **Supabase Dashboard → Settings → API → Restart API**.

### No puedo subir fotos
1. Verificar bucket `fotos-pacientes` existe y es público.
2. Verificar que el usuario autenticado tiene permisos (RLS Storage aplica).
3. Si urgente, alternativa: pegar URL externa en `foto_path` (la app soporta).

### Gemini no responde (OCR)
1. Verificar quota en [Google AI Studio](https://aistudio.google.com).
2. Si quota agotada, fallback manual (el admin tipea).
3. Free tier: 15 RPM. En picos, esperar entre cargas.

---

## 👥 Gestión de personal

### Crear usuario nuevo (personal de salud)

1. **Supabase Dashboard** → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Email + password (que el médico los cambie después).
3. Confirmar email automáticamente: **Auto Confirm User** = ON.
4. Listo. Ya puede hacer login en `/admin/login`.

### Cambiar contraseña de un usuario

1. **Authentication** → **Users** → click en el usuario.
2. **Send recovery email** o **Reset password** manual.

### Eliminar acceso de un usuario (sospecha de compromiso)

1. **Authentication** → **Users** → **Delete user**.
2. NO borrar sus pacientes (cambiar `registrado_por` a `'<ex-personal>'` para mantener auditoría).
   ```sql
   update pacientes set registrado_por = '<ex-personal>' where registrado_por = '<email>';
   ```

### Listar personal activo

```sql
select distinct registrado_por, count(*)
from pacientes
where created_at > now() - interval '7 days'
group by 1
order by 2 desc;
```

---

## 🏥 Gestión de centros de salud

### Agregar un centro nuevo

**Opción rápida (Supabase)**:
```sql
insert into centros_salud (nombre, estado, municipio, red, tipo)
values ('Hospital Ejemplo', 'CARABOBO', 'Valencia', 'MPPS', 'Hospital');
```

**Opción bulk (CSV)**: ver `scripts/hospitales-venezuela-completo.csv` y regenerar `supabase/seed-centros.sql`. Commit + push + correr en prod.

### Verificar que un centro está cargado

```sql
select * from centros_salud
where nombre ilike '%arveledo%' or nombre ilike '%arvelo%';
```

### Marcar un centro como "no disponible"

No hay columna `activo`. Solución alternativa:
```sql
update centros_salud set fuente = fuente || ' [CERRADO 2026-06-27]'
where id = '<uuid>';
```

(Fase 2: agregar columna `activo boolean default true`).

---

## 💾 Respaldos

### Backup manual completo

1. **Supabase Dashboard** → **Database** → **Backups** → **Create backup**.
2. O via CLI:
   ```bash
   npx supabase db dump --project-ref <ref> > backup-2026-06-27.sql
   ```

### Backup diario automático

Supabase Free tier: 7 días de backups automáticos.
Supabase Pro: 30 días.

**Recomendado para producción**: Pro tier (US$25/mes) por los backups.

### Restaurar desde backup

1. **Supabase Dashboard** → **Database** → **Backups** → elegir fecha → **Restore**.
2. ⚠️ Esto SOBREESCRIBE la BD actual. Hacer primero un backup de la BD actual.

---

## 📊 Monitoreo durante emergencia

### Queries clave para status

```sql
-- Total casos abiertos
select count(*) from pacientes where estado_caso = 'abierto';

-- Casos por estado clínico
select estado_clinico, count(*)
from pacientes
where estado_caso = 'abierto'
group by 1
order by 2 desc;

-- Casos por estado geográfico (top 10)
select estado_geografico, count(*)
from pacientes
where estado_caso = 'abierto'
group by 1
order by 2 desc
limit 10;

-- Solicitudes pendientes
select count(*) from solicitudes_baja where estado = 'pendiente';

-- Personal activo últimas 24h
select distinct registrado_por
from pacientes
where created_at > now() - interval '24 hours';

-- Casos creados por hora (últimas 24h)
select date_trunc('hour', created_at) as hora, count(*)
from pacientes
where created_at > now() - interval '24 hours'
group by 1
order by 1;
```

### Alertas simples

Si **solicitudes pendientes > 50**: personal no está revisando. Notificar.
Si **casos por hora < 1**: posiblemente el sistema está caído o el personal dejó de cargar.
Si **errores 5xx > 5%**: Vercel/Supabase tienen problema.

---

## 🚨 Si Supabase cae

1. El sitio NO se cae (Vercel sigue sirviendo).
2. El buscador público muestra "No se pudo conectar a la base de datos. Reintentá en unos minutos."
3. El admin no puede hacer login (depende de Supabase Auth).
4. Plan B: restaurar backup en otra instancia Supabase (cuenta secundaria).

### Tener cuenta Supabase secundaria lista

1. Crear segunda cuenta Supabase (proyecto paralelo).
2. Tener `schema.sql` y `seed-centros.sql` listos para correr.
3. Si la primaria cae, correr backups en la secundaria.
4. Actualizar `NEXT_PUBLIC_SUPABASE_URL` en Vercel.

---

## 🚨 Si Vercel cae

1. Plan B: deploy manual con `npm run build && npm start` en un servidor (DigitalOcean, Railway, etc.).
2. Plan C: Cloudflare Pages (soporta Next.js con adapter).
3. El DNS tarda en propagar (5-30 min).

---

## 📈 Escalar para picos

### Síntomas de que hay pico
- TTFB > 2 segundos
- Errores 429 de Gemini (rate limit)
- Errores 5xx en Vercel logs
- Familias reportando lentitud

### Optimizaciones rápidas

1. **Activar Vercel Edge Functions** para `/api/pacientes` (Fase 2).
2. **Cachear catálogo de centros** con `revalidate: 3600` (es estático).
3. **Limitar resultados por query** a 50 (no devolver 1000).
4. **Comprimir respuestas** con `Accept-Encoding: gzip` (Vercel lo hace por default).

### Si Vercel Free tier no alcanza

- Vercel Pro: US$20/mes, 1TB bandwidth, mejor performance.
- Supabase Pro: US$25/mes, 8GB BD, backups 30 días.

**Recomendado para producción**: ambos Pro tiers. Total ~US$45/mes.

---

## 📞 Procedimiento de cierre de emergencia

Una vez que la emergencia termina:

1. **Marcar todos los casos abiertos como cerrados** (excepto los activos):
   ```sql
   update pacientes set estado_caso = 'cerrado' where created_at < now() - interval '30 days';
   ```

2. **Revisar solicitudes pendientes**: aprobar o rechazar todas.

3. **Eliminar fotos temporales** (fase 2: implementar lifecycle policy).

4. **Backup final**: descargar dump completo.

5. **Documentar lecciones aprendidas** en `docs/POST-MORTEM.md`.

6. **Desactivar cuenta Gemini** si no se va a usar más.

7. **Mantener la app en read-only** durante 90 días para que familias consulten.

---

## 🆘 Contactos clave

| Servicio | Soporte |
|----------|---------|
| Vercel | https://vercel.com/support |
| Supabase | https://supabase.com/support |
| Google AI Studio | https://ai.google.dev |
| GitHub | https://support.github.com |

**Maintainer**: José Miguel G潘 ([@jomigp](https://github.com/jomigp)).

---

**Próximo documento**: [DEPLOYMENT.md](./DEPLOYMENT.md) — deploy paso a paso.
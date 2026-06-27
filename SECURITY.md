# Seguridad

> Cómo reportar vulnerabilidades de forma responsable y qué medidas de seguridad implementamos.

## 🐛 Reportar una vulnerabilidad

**NO abras un issue público** para reportar vulnerabilidades de seguridad.

En su lugar:

📧 **Email**: jomigp@gmail.com (mantainer: José Miguel G潘)

Asunto: `[SECURITY] Buscador de Personas - <descripción corta>`

Incluí:
1. **Descripción** de la vulnerabilidad.
2. **Pasos para reproducir**.
3. **Impacto potencial** (qué podría hacer un atacante).
4. **Versión / commit** afectado.
5. **Sugerencia de fix** (si la tenés).

Recibirás respuesta en **48 horas**. Si la vulnerabilidad es crítica, parchearemos en **24-72 horas**.

---

## 🔒 Política de divulgación responsable

- **No divulgar públicamente** hasta que el fix esté disponible (90 días máximo).
- Coordinamos el disclosure conjunto.
- Reconocimiento público si lo deseás.

---

## 🛡️ Medidas implementadas

### Autenticación y autorización
- ✅ **RLS** (Row Level Security) en TODAS las tablas (Postgres nativo).
- ✅ **Supabase Auth** con sesiones httpOnly + Secure cookies.
- ✅ **`service_role` key solo server-side** (nunca llega al cliente).
- ✅ **Anon key pública** pero limitada por RLS.

### Datos en tránsito
- ✅ **HTTPS forzado** (Vercel default + HSTS).
- ✅ **CORS** restrictivo (solo dominios autorizados).
- ✅ **CSP** pendiente (Fase 2).

### Datos en reposo
- ✅ **Storage encriptado** (Supabase default).
- ✅ **BD encriptada at rest** (Supabase default).
- ✅ **Backups encriptados**.

### Input validation
- ✅ **Tipos TS estrictos** en server actions.
- ✅ **Validación en cliente** (UX).
- ✅ **Validación en servidor** (seguridad).
- ❌ Zod (pendiente Fase 2).

### Rate limiting
- ❌ Rate limiting en `/api/*` (pendiente Fase 2 — usar Upstash).
- ✅ Gemini tiene rate limit propio (15 RPM free tier).

### Logs y auditoría
- ✅ Vercel logs (errores 5xx).
- ✅ Supabase logs (queries lentas).
- ❌ Audit log de cambios en `pacientes` (pendiente Fase 2).

---

## 🚨 Modelo de amenaza

### Actores

| Actor | Permisos | Riesgo |
|-------|----------|--------|
| **Público anónimo** | SELECT pacientes (casos abiertos), INSERT solicitudes_baja | Bajo |
| **Personal autenticado** | CRUD pacientes, centros_salud, solicitudes_baja | Medio |
| **Admin** | Todo + gestión de usuarios | Alto (target de phishing) |
| **Atacante externo** | Ninguno | Alto |

### Amenazas

1. **SQL injection**: mitigado por RLS + queries parametrizadas. Nunca usar `string interpolation` en SQL.
2. **XSS**: mitigado por React (escape automático). Nunca usar `dangerouslySetInnerHTML`.
3. **CSRF**: mitigado por Server Actions (token automático). Cookies SameSite=Lax.
4. **Data scraping**: RLS limita lo que el público puede ver. Rate limiting (pendiente).
5. **Account takeover**: mitigado por password + email verification. 2FA pendiente.
6. **DDoS**: mitigado por Vercel (auto-scaling + CDN).
7. **Insider threat**: audit log pendiente.

---

## 🔐 Cómo mantener la seguridad

### Para el maintainer

1. **Rotar keys** cada 90 días (Supabase + Gemini).
2. **Revisar logs** semanalmente (errores 5xx, logins fallidos).
3. **Actualizar deps** mensualmente (`npm audit`).
4. **Backup antes de cambios grandes**.
5. **2FA en GitHub, Vercel, Supabase**.

### Para contribuidores

1. **NUNCA** loggear API keys, passwords, o service_role.
2. **NUNCA** commitear `.env.local`.
3. **SIEMPRE** validar input en server-side.
4. **SIEMPRE** pensar "¿qué pasa si el usuario es malicioso?".
5. **SIEMPRE** usar HTTPS en dev (Vercel lo fuerza).

---

## 📜 Compliance

### GDPR (no aplica directamente, pero...)
- ✅ Datos personales minimizados (solo lo necesario).
- ✅ Derecho al olvido (solicitud de baja).
- ✅ Transparencia (privacidad en footer).
- ❌ DPO designado (no aplica, somos un medio).

### Leyes venezolanas
- ✅ Ley de Protección de Datos (2022): cumplimiento básico.
- ❌ Consultoría legal formal (recomendado para producción).

---

## 🆘 En caso de incidente

### Pasos inmediatos

1. **Contener**: si hay brecha activa, rotar keys inmediatamente.
2. **Evaluar**: ¿qué datos se vieron afectados?
3. **Notificar**: usuarios afectados + autoridades si aplica (en Venezuela, Ministerio de Justicia).
4. **Documentar**: post-mortem en `docs/INCIDENTS.md`.
5. **Mitigar**: fix + deploy.
6. **Comunicar**: transparencia pública (release notes).

### Contactos de emergencia

- **Maintainer**: jomigp@gmail.com
- **Supabase support**: support@supabase.io
- **Vercel support**: support@vercel.com
- **GitHub security**: security@github.com

---

## 📚 Referencias

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/auth/row-level-security)
- [Next.js Security Headers](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Vercel Security](https://vercel.com/security)

---

**Última revisión**: junio 2026.
**Próxima revisión**: septiembre 2026 (Fase 2).
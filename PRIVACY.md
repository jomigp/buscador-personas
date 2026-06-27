# Privacidad

> Cómo manejamos los datos personales de personas vulnerables en una emergencia. Léase antes de usar la app o contribuir.

## 🎯 Compromiso

Esta app maneja **datos personales de personas en situación de vulnerabilidad** (desaparecidas, heridas, hospitalizadas) durante una emergencia nacional. Tomamos la privacidad en serio:

- **Solo lo necesario**: pedimos los datos mínimos para reunir familias.
- **Transparencia**: esta página explica exactamente qué hacemos con cada dato.
- **Control del usuario**: cualquiera puede pedir la baja de un caso.
- **No comercial**: no vendemos datos, no mostramos ads, no compartimos con terceros.

---

## 📊 Qué datos recogemos

### Del público (familiar que busca)

| Dato | Por qué | Cuándo se borra |
|------|---------|-----------------|
| **Email o teléfono** (opcional) | Para contactarte si hay coincidencia | Al cerrar el caso o pedir baja |
| **Nombre** (opcional) | Para que el personal sepa quién pide la baja | Al cerrar el caso o pedir baja |
| **Parentesco** (opcional) | Para validar la solicitud | Al cerrar el caso o pedir baja |
| **Descripción** | Para que el personal entienda la solicitud | Al cerrar el caso o pedir baja |

**No pedimos**: dirección, identificación, datos bancarios, ni nada más.

### Del personal de salud

| Dato | Por qué |
|------|---------|
| **Email + password** | Para autenticarse y registrar casos |
| **Nombre (opcional)** | Aparece como `registrado_por` en los casos que carga |

### De los pacientes (los datos que se publican)

| Dato | Visibilidad |
|------|-------------|
| **Nombre + apellido** | Público (mientras el caso esté abierto) |
| **Edad** | Público |
| **Sexo** | Público |
| **Estado clínico** | Público (la familia necesita saber) |
| **Centro de salud** | Público |
| **Estado + municipio** | Público |
| **Foto** | Público (URL pública en Storage) |
| **Notas internas** | Solo personal autenticado |

---

## 🔒 Cómo protegemos los datos

### Técnicas
- **HTTPS** obligatorio (encripta en tránsito).
- **RLS en Supabase** (cada usuario solo ve lo que le corresponde).
- **Anon key** pública pero con permisos limitados por RLS.
- **`service_role` key** solo server-side, nunca expuesta.
- **Storage público** para fotos (necesario para mostrar), pero con RLS de lectura controlada.
- **Backups encriptados** (Supabase default).

### Operativas
- **Acceso limitado**: solo el maintainer tiene acceso a la BD de producción.
- **Logs auditados**: errores 5xx se loggean en Vercel.
- **Sin terceros**: no usamos Google Analytics, Facebook Pixel, ni nada invasivo.
- **Sin emails marketing**: solo emails transaccionales (reset password, etc.).

---

## 🗑️ Derecho al olvido

### Pacientes: cómo pedir la baja de un caso

1. En la página del caso, click en **"Marcar como encontrado"**.
2. Llenar el formulario con nombre + contacto (opcional) + descripción.
3. El personal revisa y:
   - Si aprueba: el caso se cierra (deja de aparecer en búsquedas).
   - Si rechaza: te contactamos (si diste contacto) para explicar.

**Alternativa**: si no podés usar la app, escribir a **jomigp@gmail.com** con:
- Nombre del paciente.
- Tu parentesco.
- Una forma de验证 tu identidad (fotos, documentos, etc.).

Respondemos en **48 horas**.

### Datos del solicitante (no pacientes)

Si pediste una solicitud de baja y querés que se borren TUS datos:
- Email a jomigp@gmail.com.
- Borramos en 7 días.

---

## 🍪 Cookies

La app usa **solo cookies técnicas** necesarias para la autenticación:

| Cookie | Propósito | Duración |
|--------|-----------|----------|
| `sb-<ref>-auth-token` | Sesión de Supabase Auth | Sesión (httpOnly, Secure) |
| `sb-<ref>-auth-token-code-verifier` | PKCE flow | 1 hora (httpOnly) |

**No usamos cookies de tracking, analytics, ni advertising.**

---

## 📜 Base legal (cumplimiento Venezuela)

### Ley de Protección de Datos Personales (2022)

Esta app cumple con los principios de:

- **Licitud**: los datos se recogen con consentimiento (implícito al usar el servicio).
- **Finalidad**: reunir familias, no otro uso.
- **Minimización**: solo los datos necesarios.
- **Exactitud**: el personal puede editar/corregir.
- **Conservación**: los casos se cierran después de la emergencia.
- **Integridad y confidencialidad**: RLS + HTTPS.
- **Responsabilidad proactiva**: esta política.

### En caso de incumplimiento

Si creés que violamos tu privacidad:
1. Email a jomigp@gmail.com.
2. Si no respondemos en 30 días: Superintendencia de Protección de Datos Personales.

---

## 👶 Menores de edad

Si el paciente es un menor:
- Los datos se tratan con **estándar más estricto**.
- Las solicitudes de baja se verifican con mayor cuidado.
- Si sos el padre/madre/tutor y querés que se borre, escribinos.

**La app no está pensada para uso directo por menores** (la usan familias para buscar, no los pacientes mismos).

---

## 🌍 Transferencias internacionales

Los datos se almacenan en **Supabase** (puede estar en US, EU o Asia según configuración). Por defecto, el proyecto nuevo está en US (Virginia).

**Implicaciones**:
- Si estás en Venezuela, tus datos pueden pasar por cables submarinos a US.
- Cumplimos con GDPR para usuarios europeos (por las dudas).
- No transferimos a terceros sin consentimiento.

---

## 🔄 Cambios a esta política

Si cambiamos algo material:
1. Actualizamos este archivo con fecha.
2. Banner en la app por 7 días.
3. Email a usuarios registrados (si los hay).

**Histórico de cambios**:
- 2026-06-27: versión inicial.

---

## 📞 Contacto

**Maintainer**: José Miguel G潘
**Email**: jomigp@gmail.com
**GitHub**: [@jomigp](https://github.com/jomigp)

---

## 🙏 Transparencia

Esta política es **código abierto**. Si tenés sugerencias, abrí un PR o issue en [GitHub](https://github.com/jomigp/buscador-personas).

**Última actualización**: junio 2026.
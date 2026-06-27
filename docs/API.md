# API Reference

> Rutas, endpoints y Server Actions. Para humanos que quieren extender la app y para IAs que necesitan saber qué llamar y dónde.

## 📐 Convenciones

- **URL base local**: `http://localhost:3000`
- **URL base prod**: `https://<tu-dominio>.vercel.app`
- **Formato**: JSON en body, query params con `?`, paths kebab-case.
- **Auth**: Supabase session cookie (httpOnly, Secure en prod).
- **Errores**: `{ error: string, code?: string }` con status code HTTP apropiado.

## 🌍 Rutas públicas (sin auth)

### `GET /`
**Descripción**: Home con buscador de pacientes.

**Server Component** (RSC). No acepta query params en URL — los filtros se manejan client-side con `router.push`.

**Renders**:
- Hero con copy + búsqueda
- Resultados filtrados (client-side debounce 350ms)
- Footer con aviso de privacidad

---

### `POST /api/pacientes` (búsqueda)

**Descripción**: Endpoint JSON para buscar pacientes. Lo llama el cliente de la home para refresh.

**Query params**:
| Param | Tipo | Descripción |
|-------|------|-------------|
| `q` | string | Término de búsqueda (nombre/apellido) |
| `estado` | string | Estado clínico (estable/delicado/...) |
| `sexo` | string | M/F/otro/desconocido |
| `estado_geo` | string | Estado geográfico |
| `municipio` | string | Municipio |
| `centro` | string | Centro de salud |
| `offset` | int | Para paginación (default 0) |
| `limit` | int | Tamaño de página (default 20, max 100) |

**Respuesta 200**:
```json
{
  "data": [
    {
      "id": "uuid",
      "nombre": "María",
      "apellido": "González",
      "edad": 45,
      "sexo": "F",
      "estado_clinico": "estable",
      "centro_salud": "Hospital Central de Maracay",
      "estado_geografico": "ARAGUA",
      "municipio": "Girardot",
      "foto_path": "2026/06/27/abc.jpg"
    }
  ],
  "count": 1234,
  "offset": 0,
  "limit": 20
}
```

**Ejemplo curl**:
```bash
curl 'https://<dominio>/api/pacientes?q=jose&estado_geo=CARABOBO&offset=0&limit=20'
```

**Errores**:
- `400`: param inválido
- `500`: error de BD (raro, RLS o conexión)

---

### `POST /api/leer-lista` (OCR)

**Descripción**: Sube una foto de un listado y devuelve los datos extraídos por Gemini. **NO escribe a la BD**.

**Body**: `multipart/form-data` con campo `imagen` (image/jpeg, image/png, max 10MB).

**Respuesta 200**:
```json
{
  "centro_salud": "Hospital Central de Maracay",
  "estado_geografico": "ARAGUA",
  "municipio": "Girardot",
  "pacientes": [
    {
      "nombre": "Juan",
      "apellido": "Pérez",
      "edad": 35,
      "sexo": "M",
      "estado_clinico": "estable",
      "confianza": {
        "nombre": 0.95,
        "apellido": 0.92,
        "edad": 0.88,
        "sexo": 0.97,
        "estado_clinico": 0.85
      }
    }
  ],
  "advertencias": ["Edad no encontrada en 3 filas"]
}
```

**Errores**:
- `400`: imagen vacía o formato no soportado
- `413`: imagen > 10MB
- `422`: Gemini no pudo extraer datos (foto ilegible)
- `429`: rate limit Gemini (15 RPM free tier)
- `500`: error de Gemini API

**Costo**: gratis hasta 15 RPM. En picos, considerar batch manual.

---

## 🔐 Rutas autenticadas (admin)

### `GET /admin/login`
Form de login. Email + password de Supabase Auth.

### `POST /admin/login` (Server Action)
**Input**: `{ email, password }`
**Efecto**: crea sesión, redirige a `/admin`.

### `GET /admin/logout` (Server Action)
Cierra sesión, redirige a `/`.

---

### `GET /admin`
Dashboard. Lista casos del usuario autenticado.

### `POST /admin/crear-paciente` (Server Action)
**Input**:
```typescript
{
  nombre: string,
  apellido: string,
  edad?: number,
  sexo?: 'M' | 'F' | 'otro' | 'desconocido',
  estado_clinico: 'estable' | 'delicado' | 'crítico' | 'sin_identificar' | 'recuperado' | 'fallecido',
  centro_salud?: string,
  estado_geografico?: string,
  municipio?: string,
  foto_path?: string,
  notas?: string
}
```

**Efecto**: inserta en `pacientes` con `registrado_por = user.email`, `estado_caso = 'abierto'`.

**Respuesta**: `{ ok: true, id: 'uuid' }` o `{ error: string }`.

**Validación**: nombre y apellido requeridos. Edad 0-130. Estado clínico default `sin_identificar`.

---

### `POST /admin/editar-paciente` (Server Action)
**Input**: `{ id, ...mismos campos que crear-paciente }`
**Efecto**: update. Solo autenticados (cualquiera puede editar — Fase 2: restricción por centro).

---

### `POST /admin/cerrar-caso` (Server Action)
**Input**: `{ id, motivo?: string }`
**Efecto**: cambia `estado_caso` a 'cerrado'. El caso deja de ser visible al público.

---

### `POST /admin/cargar-foto` (Server Action)
**Input**: `FormData` con `file: File`, `paciente_id: string`
**Efecto**: sube a Storage bucket `fotos-pacientes/YYYY/MM/DD/<uuid>.<ext>`, guarda `foto_path`.

**Restricciones**:
- Tipo: image/jpeg, image/png, image/webp
- Tamaño: max 5MB
- Path inmutable (no se sobreescribe)

---

### `POST /admin/importar-csv` (Server Action)
**Input**: `FormData` con `file: File` (CSV)
**Efecto**: parsea con `src/lib/csv.ts`, inserta cada fila con `estado_clinico` detectado o `sin_identificar` si falta. Devuelve warnings + IDs insertados.

**Ver**: `src/lib/csv.ts` para formato esperado.

---

### `POST /admin/importar-foto` (procesar OCR)
**Input**: `{ pacientes: [...] }` (revisión confirmada por el admin)
**Efecto**: igual a crear-paciente en loop. Devuelve IDs y warnings.

---

### `POST /admin/aprobar-solicitud-baja` (Server Action)
**Input**: `{ solicitud_id: string }`
**Efecto**: cambia estado de solicitud a 'aprobada', marca paciente como `estado_caso = 'cerrado'`.

### `POST /admin/rechazar-solicitud-baja` (Server Action)
**Input**: `{ solicitud_id: string, motivo?: string }`
**Efecto**: cambia estado a 'rechazada'.

---

## 🌐 Server Actions del público

### `POST /solicitar-baja` (en `src/app/acciones.ts`)
**Input**:
```typescript
{
  paciente_id?: string,
  nombre_solicitante?: string,
  contacto?: string,
  parentesco?: string,
  descripcion: string
}
```

**Efecto**: inserta en `solicitudes_baja` con `estado = 'pendiente'`. **No requiere auth** (anon).

---

## 🛠️ Helpers internos

### `src/lib/supabase/server.ts`
```typescript
import { createClient } from '@/lib/supabase/server';

const supabase = await createClient();  // RLS aplica, sesión del usuario
const { data, error } = await supabase.from('pacientes').select('*');
```

### `src/lib/supabase/client.ts` (browser)
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
```

### `src/lib/centros.ts`
```typescript
import { getDistinctValues } from '@/lib/centros';

const { centros, estados, municipios } = await getDistinctValues();
// centros: ['Hospital Central...', 'Hospital Militar...', ...]
// Merge con seed estático si la BD está vacía
```

### `src/lib/vision.ts`
```typescript
import { leerLista } from '@/lib/vision';

const resultado = await leerLista(buffer, mimeType);
// resultado: { pacientes: [...], advertencias: [...] }
```

---

## 🧪 Testing endpoints

```bash
# Health check
curl https://<dominio>/api/pacientes?limit=1

# Búsqueda
curl 'https://<dominio>/api/pacientes?q=jose&estado=ARAGUA'

# OCR (con imagen local)
curl -X POST -F "imagen=@listado.jpg" https://<dominio>/api/leer-lista
```

---

## 📊 Status codes

| Code | Significado | Cuándo |
|------|-------------|--------|
| 200 | OK | GET/POST exitoso |
| 400 | Bad Request | Input inválido |
| 401 | Unauthorized | No autenticado cuando se requiere |
| 403 | Forbidden | RLS bloqueó la operación |
| 404 | Not Found | Recurso no existe |
| 413 | Payload Too Large | Archivo > límite |
| 422 | Unprocessable Entity | Datos válidos pero ilógicos |
| 429 | Too Many Requests | Rate limit Gemini |
| 500 | Internal Server Error | Bug en server |

---

## 🔒 Headers de seguridad

Vercel provee automáticamente:
- `Strict-Transport-Security: max-age=31536000`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`

**Pendiente (Fase 2)**:
- CSP estricta
- Permissions-Policy
- COOP/COEP

---

**Próximo documento**: [OPERATIONS.md](./OPERATIONS.md) — manual de operación en emergencia.
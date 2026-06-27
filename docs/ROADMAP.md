# Roadmap

> Qué hay ahora (Fase 1), qué viene (Fase 2), y qué se可以考虑 (Fase 3+).

## ✅ Fase 1: MVP (en producción, junio 2026)

- [x] Buscador público con filtros (estado, sexo, ubicación).
- [x] Carga de pacientes por personal autenticado.
- [x] Importación CSV con normalización fuzzy.
- [x] Catálogo de 241 centros de salud oficiales.
- [x] Subida de fotos a Storage.
- [x] "Marcar como encontrado" → solicitud de baja → revisión por personal.
- [x] OCR de listados (Gemini 2.5 Flash).
- [x] PWA básico (manifest, icon).
- [x] Mobile-first responsive.
- [x] Accesibilidad (focus visible, touch targets, contraste).
- [x] Deploy en Vercel + Supabase.
- [x] Documentación completa (humans + IAs).

## 🚧 Fase 2: Mejoras post-emergencia (julio-agosto 2026)

### Tests automatizados
- [ ] Unit tests con Vitest (helpers: csv.ts, clinical.ts, vision.ts).
- [ ] Integration tests con Playwright (flujos críticos: crear paciente, buscar, solicitar baja).
- [ ] Coverage mínimo 70% en `src/lib/`.

### Sello "Verificado por centro"
- [ ] Integración con SACS del MPPS para verificar matrícula del médico.
- [ ] UI con badge "Verificado por Hospital X" en la card del paciente.
- [ ] Ver [SACS-VERIFICACION.md](./SACS-VERIFICACION.md) para el diseño.

### Performance
- [ ] Edge functions en Vercel para `/api/pacientes`.
- [ ] Cache del catálogo de centros (revalidate 1h).
- [ ] Búsqueda full-text con `pg_trgm` o Meilisearch.
- [ ] Imágenes con `next/image` en la home (cards de pacientes).

### UX/UI
- [ ] Modo oscuro (`prefers-color-scheme`).
- [ ] Página de detalle del paciente (`/paciente/[id]`) para familias.
- [ ] Mapa visual (Leaflet) con casos por ubicación.
- [ ] Notificación push (Service Worker) cuando se actualiza un caso cercano.
- [ ] Compartir por WhatsApp (deep link con URL del caso).

### Admin
- [ ] Dashboard con métricas (casos por día, solicitudes pendientes, etc.).
- [ ] Búsqueda y filtro en `/admin` (ahora solo lista).
- [ ] Acciones masivas (cerrar múltiples casos, asignar a médico).
- [ ] Historial de cambios (audit log).

### Seguridad
- [ ] CSP estricta.
- [ ] Rate limiting en `/api/*` (Upstash o similar).
- [ ] 2FA para admins.
- [ ] Logs de auditoría en Supabase.

### Internacionalización
- [ ] Migrar a `next-intl`.
- [ ] Soporte para inglés (ONGs internacionales).
- [ ] Wayuunaiki, warao, pemón (idiomas indígenas de zonas afectadas).

## 🔮 Fase 3: Producción sostenida (septiembre-octubre 2026)

### Multi-tenancy
- [ ] Una instancia por medio / hospital (no una sola global).
- [ ] Subdominios: `<medio>.buscador.example.com`.
- [ ] Aislamiento de datos por tenant.

### Integraciones
- [ ] Webhooks para ONGs (reciben notificaciones de nuevos casos).
- [ ] API pública con auth (para Cruz Roja, UNICEF).
- [ ] Integración con MPPS para sync de hospitales.

### Datos
- [ ] Estadísticas públicas (cuántos casos, recuperaciones, distribución).
- [ ] Export a CSV para periodistas.
- [ ] Integración con Google Sheets (operadores menos técnicos).

### Avanzado
- [ ] ML para matching de fotos (suben foto del familiar → busca por similitud).
- [ ] Chat en vivo entre familia y centro (intermediado).
- [ ] Geolocalización GPS para triaje (caso se asigna al centro más cercano).

## 💡 Ideas bajo検討 (Fase 4+)

- App nativa (React Native) con offline-first.
- Blockchain para integridad de datos.
- Reconocimiento facial con privacidad diferencial.
- Integración con sistemas de salud (HIS) de hospitales.

---

## 📊 Métricas de éxito (KPIs)

### Durante emergencia (Fase 1)
- **Casos cargados**: meta 1000 en primera semana.
- **Búsquedas exitosas**: meta 50% de búsquedas devuelven al menos 1 resultado.
- **Tiempo de carga**: meta < 2 segundos en 3G.
- **Uptime**: meta 99.5%.

### Post-emergencia (Fase 2-3)
- **Familias reencuentradas**: meta 80% de casos cerrados con solicitud aprobada.
- **Tiempo de respuesta**: meta personal revisa solicitudes en < 24h.
- **Adopción**: meta 5 medios venezolanos usando la app.

---

## 🤝 Contribuciones bienvenidas

Ver [CONTRIBUTING.md](../CONTRIBUTING.md). Para features grandes, abrir issue primero.

**Áreas donde más ayuda necesitamos**:
1. **i18n** (traducción a wayuunaiki, warao, inglés).
2. **Tests** (Vitest, Playwright).
3. **Diseño** (logo, paleta de colores, iconografía).
4. **Documentación** (mejorar este roadmap con feedback).
5. **Datos** (verificar precisión de la lista de 241 centros).

---

## 📅 Timeline

| Mes | Hito |
|-----|------|
| **Jun 2026** | ✅ MVP en producción |
| **Jul 2026** | 🚧 Tests + Sello verificado |
| **Ago 2026** | 🚧 Edge functions + multi-idioma |
| **Sep 2026** | 🔮 Multi-tenancy |
| **Oct 2026** | 🔮 Webhooks + API pública |
| **Nov 2026** | 💡 ML matching de fotos |

**Nota**: este roadmap es orientativo. La emergencia puede acelerar o frenar items.
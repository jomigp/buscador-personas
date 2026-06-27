# Cómo contribuir

¡Gracias por querer ayudar! Este proyecto es open source y toda contribución es bienvenida.

## 🎯 Maneras de contribuir

### 🐛 Reportar bugs
1. Verificar que no esté ya reportado en [Issues](https://github.com/jomigp/buscador-personas/issues).
2. Abrir issue con:
   - Pasos para reproducir.
   - Comportamiento esperado vs actual.
   - Screenshots (si aplica).
   - Navegador + versión.
   - Dispositivo (mobile/desktop, OS).

### 💡 Proponer features
1. Abrir issue con tag `enhancement`.
2. Describir el problema que resuelve (no la solución).
3. Esperar feedback del maintainer antes de implementar.

### 📝 Mejorar documentación
- Typo, falta de claridad, sección faltante → PR directo.
- Gran restructuración → abrir issue primero.

### 💻 Contribuir código
- Fork → branch → PR. Ver abajo.

### 🌍 Traducir
- Idiomas prioritarios: wayuunaiki, warao, pemón, inglés.
- Abrir issue con tag `i18n`.

### 🎨 Diseño
- Logo, paleta, iconografía, ilustraciones.
- Abrir issue con tag `design`.

### 📊 Datos
- Verificar precisión de la lista de centros de salud.
- Agregar centros faltantes (PR a `supabase/seed-centros.sql`).

---

## 🔧 Workflow para código

### Setup local
```bash
git clone https://github.com/jomigp/buscador-personas.git
cd buscador-personas
npm install
cp .env.example .env.local  # completar con tus keys
npm run dev
```

### Crear branch
```bash
git checkout -b feat/nombre-corto
# o
git checkout -b fix/nombre-corto
```

Convenciones de branch:
- `feat/*` — nueva feature.
- `fix/*` — bug fix.
- `docs/*` — solo docs.
- `refactor/*` — refactor sin cambio funcional.
- `chore/*` — tareas menores.

### Hacer cambios

1. **Escribir el código**.
2. **Testear manualmente** (no hay tests automatizados todavía).
3. **Verificar lint + build**:
   ```bash
   npm run build && npm run lint
   ```
   Ambos deben pasar.
4. **Commitear** (ver convenciones abajo).
5. **Push + abrir PR**.

### Mensajes de commit

Formato:
```
<tipo>: <descripción en imperativo, máx 50 chars>

<cuerpo opcional,_wrap a 72 chars>

<footer opcional (refs, breaking changes)>
```

Tipos:
- `feat` — nueva feature.
- `fix` — bug fix.
- `docs` — solo docs.
- `style` — formato (no lógica).
- `refactor` — refactor.
- `test` — agregar tests.
- `chore` — tareas menores.

Ejemplos:
```
feat: agregar búsqueda por rango de edad

Permite filtrar pacientes entre dos edades. Útil para buscar
familiares jóvenes o ancianos.

Closes #42
```

```
fix: layout overflow en mobile

El padding-bottom del main se duplicaba con el del layout raíz,
causando overlap con BottomNav en iPhone SE.

Fixes #18
```

### Pull Request

1. Push a tu fork: `git push origin feat/nombre`.
2. Abrir PR en GitHub.
3. Llenar el template:
   - **Qué cambia**.
   - **Por qué**.
   - **Cómo testear**.
   - **Screenshots** (si UI).
4. Esperar review del maintainer.
5. Iterar si hay feedback.

---

## ✅ Checklist antes de PR

- [ ] `npm run build` pasa.
- [ ] `npm run lint` pasa (cero warnings).
- [ ] Probado en mobile (375px) y desktop.
- [ ] Probado con teclado (Tab, Enter, Escape).
- [ ] Si toca BD: actualicé `supabase/schema.sql`.
- [ ] Si toca tipos TS: actualicé tipos en `src/lib/`.
- [ ] Si toca UI: actualicé screenshots en el PR.
- [ ] Mensaje de commit sigue convención.
- [ ] Sin `console.log` olvidados.
- [ ] Sin código comentado.
- [ ] Sin `.env.local` commiteado.

---

## 🚫 Lo que NO se acepta

- ❌ Features que empeoran la velocidad de operación en emergencia.
- ❌ Wizard de onboarding (fricción).
- ❌ Captcha en buscador (fricción para familias).
- ❌ Cambios que deshabilitan RLS.
- ❌ Hardcodear API keys o secrets.
- ❌ Dependencias mayores sin discusión previa.
- ❌ Cambios que rompen mobile-first.

---

## 💬 Comunicación

- **Issues de seguridad**: ver [SECURITY.md](./SECURITY.md).
- **Dudas generales**: GitHub Discussions.
- **Bugs/features**: GitHub Issues.
- **Urgencias durante emergencia**: contactar al maintainer por issue con tag `urgent`.

---

## 🏆 Reconocimientos

Los contribuidores se listan en [README.md](./README.md) y en la sección "About" de GitHub.

---

## 📜 Licencia

Al contribuir, aceptás que tu código se publique bajo [MIT](./LICENSE).

---

**Gracias por ayudar a reunir familias en una emergencia.** 💪
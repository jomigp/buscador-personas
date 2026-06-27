# Cómo contribuir

¡Gracias por querer ayudar! Este proyecto nació de una emergencia y mejora con la comunidad. Antes de contribuir, lee [`SPEC.md`](./SPEC.md), [`AGENTS.md`](./AGENTS.md) y [`PRIVACY.md`](./PRIVACY.md).

## Flujo
1. Haz un fork del repositorio.
2. Crea una rama descriptiva: `git checkout -b fix/buscador-filtros` o `feat/importar-foto`.
3. Haz cambios pequeños y enfocados. Commits claros en español o inglés.
4. Asegúrate de que `npm run build` pasa sin errores.
5. Abre un Pull Request describiendo el cambio y por qué.

## Reglas que ningún PR puede romper
- **No debilitar el RLS.** El público nunca debe poder escribir ni leer casos cerrados.
- **No saltarse la revisión humana del OCR.** La lectura de listas por foto siempre pasa por confirmación de una persona antes de insertar.
- **No exponer secretos.** Nada de claves en el código; usa variables de entorno y actualiza `.env.example` si agregas alguna.
- **No exponer más datos personales de los necesarios.** Respeta los principios de `PRIVACY.md`.

## Estilo
- Next.js 16 + React 19 + TypeScript. App Router.
- Tailwind para estilos. Mobile-first. UI en español.
- Pocas dependencias nuevas; justifícalas en el PR.

## Reportar problemas
- Usa las plantillas de issue en `.github/ISSUE_TEMPLATE`.
- Para vulnerabilidades de seguridad o datos, NO abras un issue público: contacta de forma privada a [CANAL DE SEGURIDAD].

## Tono y comunidad
Sé respetuoso y constructivo. Ver [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

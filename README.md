# Estrategia de notificaciones · TEC360

Presentación web (10 slides) para el *kickoff* de la Estrategia de notificaciones de TEC360.
Vite + React 18 + TypeScript + Tailwind CSS + Framer Motion + lucide-react.

## Correr localmente

```bash
npm install
npm run dev        # http://localhost:5173
```

## Compilar

```bash
npm run build      # tsc --noEmit + vite build → dist/
npm run preview    # sirve dist/ en http://localhost:4173
```

## Estructura

- `src/content/slides.ts` — todo el texto (tipado). `*texto*` = cursiva, `**texto**` = palabra clave en cian.
- `src/slides/` — un componente por tipo de slide.
- `src/Deck.tsx` — navegación (teclado, swipe, botones, URL `#n`), progreso, aria-live.
- `src/useFullscreen.ts` — pantalla completa (con prefijo webkit).
- `public/assets/` — foto de portada, logotipo, video y poster.

## Controles

→ ↓ PageDown Espacio: siguiente · ← ↑ PageUp: anterior · Home / End: primera / última · F: pantalla completa.
En mobile: swipe horizontal. La slide actual queda en la URL (`#3`).

## Publicar

El build es un sitio estático (`dist/`) con rutas relativas, así que funciona en cualquier hosting.

- **Vercel:** importa el repositorio en vercel.com → framework “Vite” (build `npm run build`, output `dist`). O desde la terminal: `npx vercel` y luego `npx vercel --prod`.
- **Netlify:** importa el repositorio (build `npm run build`, publish `dist`), o arrastra la carpeta `dist/` a app.netlify.com/drop. Desde la terminal: `npx netlify deploy --dir=dist --prod`.
- **GitHub Pages / cualquier servidor:** sube el contenido de `dist/`.

@AGENTS.md
# CLIC FIT — Sitio web

Sitio oficial de CLIC FIT, cadena argentina de 3 centros de entrenamiento en zona norte de Buenos Aires. Stack: Next.js 15 + Tailwind 4 + TypeScript, deploy en Vercel.

## Stack

- Next.js 15 (App Router, RSC, Turbopack)
- TypeScript estricto
- Tailwind CSS 4 (`@theme` en CSS, no config file)
- Dependencias runtime: `lucide-react`, `clsx`
- Fuentes: `next/font/google` (Anton, Fraunces, Geist)

No agregar nuevas dependencias sin consultar primero.

## Identidad visual

Paleta (definida como CSS vars en `src/app/globals.css` vía `@theme`):

- `bg-ink` / `text-ink` → `#0a0a0a` (negro dominante)
- `bg-cream` / `text-cream` → `#f5f1e8` (crema para respiración)
- `bg-yellow` / `text-yellow` → `#FBFA3F` (amarillo neón, CTAs y acentos grandes)
- `bg-yellow-deep` / `text-yellow-deep` → `#E8D628` (amarillo dorado, detalles sutiles)

Jerarquía de amarillos:
- Amarillo neón para botones CTA, marquees, palabra destacada en hero, hover de tarjetas
- Amarillo dorado para eyebrows de sección, stat numbers, símbolos pequeños

Tipografía:
- `font-display` → Anton (condensada, para titulares grandes, SIEMPRE uppercase)
- `font-serif` → Fraunces itálica (para una o dos palabras por titular, color amarillo, contraste)
- `font-sans` → Geist (cuerpo, nav, botones)

Utilities custom (en `globals.css`):
- `.display` → aplica Anton + letter-spacing + uppercase
- `.italic-serif` → aplica Fraunces italic
- `.container-clic` → max-width 1440px con paddings responsive

## Estética

Editorial-deportiva. Titulares gigantes con clamp (ej. `clamp(56px, 14vw, 200px)`). Asimetría. Acentos amarillos en puntos críticos, nunca dominantes. Fondo negro predominante con secciones ocasionales en crema para romper.

Patrones que se repiten en el sitio:
- Hero con titular display, una palabra en `italic-serif text-yellow`
- Secciones con eyebrow (tipografía chica, uppercase, tracking ancho, color `yellow-deep`)
- Marquees horizontales con texto gigante deslizándose (disciplinas)
- Tarjetas con hover a amarillo neón
- Botones CTA con flecha que se mueve 4px al hover

## Arquitectura de contenido

La fuente de verdad del contenido está en `src/lib/content/`:

- `site.ts` — datos globales (teléfono, email, urls, logo)
- `sedes.ts` — las 3 sedes con tipo `Sede`, helpers `getSedeBySlug()`, `getHourBlocks()`
- `disciplinas.ts` — las 5 modalidades con tipo `Disciplina`, helper `getDisciplinaBySlug()`

No hardcodear datos en componentes — siempre importar desde `lib/content`.

## Links de WhatsApp

Nunca construir URLs de wa.me a mano. Usar helpers de `src/lib/whatsapp.ts`:

- `waLink(message, phone?)` — link genérico
- `waLinkSede(sedeName, phone?)` — por sede con mensaje precargado
- `waLinkClaseGratis()` — CTA principal del home
- `waLinkFranquicia()` — CTA de franquicias

## Convenciones de código

- `src/` es el root del código. Alias `@/` apunta a `src/`.
- Server Components por default. Solo `"use client"` cuando necesitás `useState`, `useEffect`, o handlers de eventos del browser.
- Componentes de layout (que envuelven páginas): `src/components/layout/`
- Primitivas reusables: `src/components/ui/`
- Secciones grandes de una página: `src/components/sections/` (crear si no existe)
- Tipos explícitos en props. Evitar `any`.
- Clases condicionales con `cn()` de `src/lib/utils.ts`.
- Imágenes siempre con `next/image`. Para imágenes externas (como el logo en `clicfit.ar`), usar `unoptimized` o configurar `remotePatterns` en `next.config.ts`.
- Accesibilidad: `aria-label` en botones de icono, `alt` descriptivo en todas las imágenes, foco visible.

## Estructura actual del proyecto

```
src/
├── app/
│   ├── layout.tsx          Root layout: fuentes, metadata, Nav, Footer, WA float
│   ├── page.tsx            Home (hoy placeholder)
│   └── globals.css         Design tokens + Tailwind + utilities custom
├── components/
│   ├── layout/
│   │   ├── Nav.tsx         Nav sticky con burger mobile
│   │   ├── Footer.tsx
│   │   └── WhatsAppFloat.tsx   Botón flotante verde bottom-right
│   └── ui/
│       ├── Button.tsx      Variantes: primary, outline, dark
│       └── WhatsAppIcon.tsx
└── lib/
    ├── content/
    │   ├── site.ts
    │   ├── sedes.ts
    │   └── disciplinas.ts
    ├── whatsapp.ts
    └── utils.ts
```

## Rutas planeadas (aún no construidas)

- `/` — home (día 2)
- `/sedes` — hub de sedes (día 3)
- `/sedes/[slug]` — landing de sede dinámica (día 3)
- `/disciplinas/[slug]` — landing de disciplina (día 5-6)
- `/franquicias` — landing con formulario (día 7)
- `/nutricion` — ya sumada al home pero puede expandirse (día 7 opcional)

## Fotos

Las fotos viven en `public/img/`:

- `public/img/sedes/tortugas/hero.jpg, 1.jpg, 2.jpg, ...`
- `public/img/sedes/pilar/hero.jpg, 1.jpg, ...`
- `public/img/sedes/office-park/hero.jpg, 1.jpg, ...`
- `public/img/disciplinas/crossfit.jpg, funcional.jpg, ...`

Los paths ya están en `sedes.ts` y `disciplinas.ts`. Si alguna foto falta en disco, el componente debe tener un fallback gracioso (fondo negro + título, o skeleton).

## SEO (futuro)

- Schemas JSON-LD: `ExerciseGym` y `LocalBusiness` por sede, `FAQPage`, `BreadcrumbList`
- Metadata por página con title/description específicos
- Sitemap y robots.txt generados automáticamente por Next

## Deploy

- Vercel conectado al repo de GitHub
- `main` → producción
- Cualquier otra branch → preview deploy automático

## Qué NO hacer

- No agregar CMS (la decisión fue contenido desde código).
- No agregar blog por ahora.
- No usar un state manager global (no lo necesitamos).
- No agregar animation libraries si se puede resolver con CSS.
- No cambiar la paleta ni las fuentes sin pedirlo explícito.

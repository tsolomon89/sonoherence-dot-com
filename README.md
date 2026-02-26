# Somaherence Launch Site

Conversion-first launch site built with React, TypeScript, Vite, React Three Fiber, and Supabase.

## Quick start

```bash
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` and set values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GTM_ID`
- `VITE_APP_URL`
- `VITE_KICKSTARTER_NOTIFY_URL`

## 3D assets

Place production assets in `public`:

- `public/models/somaherence-bed.glb`
- `public/models/somaherence-materials.json`
- `public/models/textures/**` (PBR map sets referenced by the manifest)
- `public/media/somaherence-fallback.mp4`
- `public/media/somaherence-fallback.jpg`

If model media is missing, the app falls back to procedural rendering or video/static chapters.
If texture maps are missing, the GLB still renders using tuned default materials.

## Backend

Supabase migration and edge functions live under [`supabase/`](./supabase).

Core functions:

- `waitlist-register`
- `create-reservation-checkout`
- `stripe-webhook`
- `support-submit`

See [`supabase/README.md`](./supabase/README.md) for deploy and secrets setup.

## Build

```bash
npm run build
```

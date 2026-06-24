# World Music Map

> Click a place, hear its music.

**Live: https://world-music-map.javierramos.dev**

A discovery-first interactive world map of music. Click a curated locale and a
drawer opens over the map with a short blurb, genre and era tags, and a playable
recording, with honest source and license attribution. Depth over breadth: a
small, well-curated set of places beats a thin global veneer.

## Stack

- **Next.js 16** (App Router, React Server Components) + **TypeScript**
- **Prisma 7** (driver-adapter) on **PostgreSQL**
- **MapLibre GL** for the map; **MapTiler** dark tiles (keyless demo style as fallback)
- **YouTube** embeds for playback, with **archive.org** enrichment planned
- Hosted on **Vercel** (app) + **Railway** (Postgres)

## Status

v1 in progress, built in public. Live today: an interactive MapTiler dark map, a
side drawer with playable embeds and honest per-item attribution, genre/era facet
filters that emphasize matching locales, and a graceful fallback so an unavailable
video never shows a broken iframe, all reading from its own database. Currently a
handful of marquee locales, growing toward ~20. On the roadmap: archive.org
recordings, and the full curated catalog. See
[`docs/build-plan.md`](docs/build-plan.md) for the slice-by-slice plan and
[`docs/prd/world-music-map.md`](docs/prd/world-music-map.md) for the v1 spec.

## Local development

Prerequisites: Node 22, pnpm 11, and a PostgreSQL you can reach.

```bash
pnpm install

# point at a local Postgres that has a `world_music_map` database
cp .env.example .env        # then edit DATABASE_URL

pnpm db:migrate             # apply migrations
pnpm db:seed                # seed the marquee locales
pnpm dev                    # http://localhost:3002
```

`MAPTILER_KEY` is optional: unset, the map uses the keyless MapLibre demo style;
set (and domain-restricted), it uses the MapTiler dark basemap. See
[`.env.example`](.env.example).

## Curation

Locales and media are curated by an agent through Prisma scripts (no admin UI in
v1). Each item records its source, title, attribution, and license, and is
verified playable before it ships.

## Honesty

YouTube and archive.org recordings are embedded, never re-hosted, and never
framed as "licensed music." YouTube embeds keep the license with the uploader
(shown); archive.org items show their CC or public-domain attribution.

---

Built in public by [Javier Ramos](https://javierramos.dev) with the
[agentic-dev-kit](https://github.com/jiramos87/agentic-dev-kit), the same
PRD to implement to verify loop documented on the portfolio. Slated to become a
javierramos.dev exhibit.

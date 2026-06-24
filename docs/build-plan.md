# World Music Map - build plan

Progress log + slice backlog. The v1 requirements live in
[`docs/prd/world-music-map.md`](prd/world-music-map.md) (Status: DEFINED).
Per-slice feature PRDs land in `docs/prd/` as each slice starts.

## Loop

Each slice runs the kit loop: `/prd` -> `/prd-grill-me` -> `/implement` ->
`/verify` -> `/reconcile`. Skeleton was the foundation (Explore + scaffold).

## S0 - Skeleton (DONE, commit 58c8824, local)

End-to-end walking skeleton, verified locally (desktop + mobile, all 3 embeds
playable, verify gate green).

- Next 16 App Router + Prisma 7 (driver-adapter) + MapLibre GL.
- Own `world_music_map` database on the shared Postgres server (local: docker
  `:5433`). `Location` + `MediaItem` schema + `init` migration. `force-dynamic`
  page reads fresh per request.
- 3 marquee locales (Bamako / Havana / Lisbon), each: blurb, genre/era chips,
  one official-channel YouTube embed, always-visible attribution.
- Mobile-first drawer over the map (map stays visible).
- Keyless MapLibre demo style (placeholder for the MapTiler swap).

Not yet done: deploy to prod, MapTiler tiles, filters, dead-embed fallback,
archive.org, the ~20-locale catalog, states/a11y/perf polish.

## Slice backlog (remainder of v1)

Ordered for least-risk-first. Each row becomes a `docs/prd/<slice>.md` when it
starts. "PRD ref" points at the v1 acceptance bullet it satisfies.

| # | Slice | Goal | Key acceptance (PRD ref) | Notable dependency / unknown |
|---|---|---|---|---|
| S1 | **Deploy / infra** | Close end-to-end to the live subdomain | Live `world-music-map.javierramos.dev` renders the skeleton over HTTPS (§9) | Railway `world_music_map` DB (prod), new Vercel project on the private repo, `DATABASE_URL` env, subdomain DNS+SSL. Needs `VERCEL_TOKEN` + Railway access. |
| S2 | **Map: MapTiler swap** | Real basemap, on-brand dark style | Tiles render on the live domain; key never client-exposed beyond domain lock (§5 Map tiles) | MapTiler free-tier key (domain-restricted, server env). Protomaps/PMTiles self-host as the quota fallback. |
| S3 | **Filters: genre + era** | Facet filters over the markers | Selecting facets emphasizes/hides non-matching locales (§3 filters) | Decide: filter state in URL vs local. Curated, small facet value set. |
| S4 | **Dead-embed fallback** | Never a raw broken iframe | Unavailable -> "temporarily unavailable" card -> archive.org alternate -> `needsReview` flag (§3 dead-embed, §4 no-dead-embeds) | Hardest slice: reliable YouTube embed-failure detection. Grill must lock the detection mechanism. |
| S5 | **archive.org enrichment** | Native CC/PD player on marquee locales | Recording plays via HTML5 player with CC/PD attribution (§3 archive.org) | Opportunistic, additive; sourcing + attribution at curation. |
| S6 | **Curation + catalog-coverage** | Reach the v1 success measure | 20 locales, each >=1 verified-playable item + genre/era + attribution; fallback exercised once in QA (§10) | Agent-driven Prisma curation scripts (MCP/SSH). `needsReview` list/clear workflow. |
| S7 | **States + a11y + perf** | Production polish | Loading/empty/error states designed; keyboard-operable drawer + labels (AA); lazy embeds; Lighthouse 90+ (§4) | Empty/loading states partially stubbed in S0. |

## Recommended next

**S1 (Deploy)** - proves the prod DB + Vercel + subdomain pipeline against the
known-good skeleton, so every later slice auto-deploys on push. It is the
literal "end to end." It needs account-level infra (see S1 checklist below),
so it is a shared step, not a pure agent task.

### S1 checklist (the steps that need Javier)

1. Create the `world_music_map` database on the Railway Postgres service
   (sibling to the portfolio DB; `CREATE DATABASE`, same server).
2. New Vercel project (team `jiramos87s-projects`) linked to the **private**
   `jiramos87/world-music-map` repo, framework Next.js, root dir = repo root.
3. Set `DATABASE_URL` (server-only, not `NEXT_PUBLIC_`) to the Railway
   `world_music_map` connection string.
4. Add domain `world-music-map.javierramos.dev` (Vercel-managed DNS + auto SSL).
5. Run `prisma migrate deploy` + seed against the prod DB (in-container, not
   from localhost).
6. Push `main` to trigger the first deploy.

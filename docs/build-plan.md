# World Music Map - build plan

Progress log + slice backlog. The v1 requirements live in
[`docs/prd/world-music-map.md`](prd/world-music-map.md) (Status: DEFINED).
Per-slice feature PRDs land in `docs/prd/` as each slice starts.

## Loop

Each slice runs the kit loop: `/prd` -> `/prd-grill-me` -> `/implement` ->
`/verify` -> `/reconcile`. Skeleton was the foundation (Explore + scaffold).

## S0 - Skeleton (DONE, pushed; `main` @ b842d28)

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
| S1 | **Deploy / infra** ✅ DONE | Close end-to-end to the live subdomain | LIVE: `world-music-map.javierramos.dev` serves the skeleton over HTTPS, seeded from the prod DB (§9) | Done 2026-06-24. See "S1 - Deploy (DONE)" below. |
| S2 | **Map: MapTiler swap** | Real basemap, on-brand dark style | Tiles render on the live domain; key never client-exposed beyond domain lock (§5 Map tiles) | MapTiler free-tier key (domain-restricted, server env). Protomaps/PMTiles self-host as the quota fallback. |
| S3 | **Filters: genre + era** | Facet filters over the markers | Selecting facets emphasizes/hides non-matching locales (§3 filters) | Decide: filter state in URL vs local. Curated, small facet value set. |
| S4 | **Dead-embed fallback** | Never a raw broken iframe | Unavailable -> "temporarily unavailable" card -> archive.org alternate -> `needsReview` flag (§3 dead-embed, §4 no-dead-embeds) | Hardest slice: reliable YouTube embed-failure detection. Grill must lock the detection mechanism. |
| S5 | **archive.org enrichment** | Native CC/PD player on marquee locales | Recording plays via HTML5 player with CC/PD attribution (§3 archive.org) | Opportunistic, additive; sourcing + attribution at curation. |
| S6 | **Curation + catalog-coverage** | Reach the v1 success measure | 20 locales, each >=1 verified-playable item + genre/era + attribution; fallback exercised once in QA (§10) | Agent-driven Prisma curation scripts (MCP/SSH). `needsReview` list/clear workflow. |
| S7 | **States + a11y + perf** | Production polish | Loading/empty/error states designed; keyboard-operable drawer + labels (AA); lazy embeds; Lighthouse 90+ (§4) | Empty/loading states partially stubbed in S0. |

## S1 - Deploy (DONE, LIVE 2026-06-24)

Live at **https://world-music-map.javierramos.dev** (HTTP 200 + valid SSL,
seeded locales served from the prod DB). How it was actually wired (reused the
portfolio's local deploy creds + REST patterns; no dashboard clicks except the
one secret):

- `world_music_map` database created on the Railway Postgres service via a `pg`
  one-liner inside the portfolio container (`railway ssh`), sibling to the prod
  `railway` DB.
- Vercel project `world-music-map` (`prj_xAzfplqyxIpkrTbfpihvclCU6Ipi`, team
  jiramos87s-projects) created via REST + linked to the private repo; build
  command set to `pnpm exec prisma migrate deploy && pnpm exec tsx
  prisma/seed.ts && next build`, so schema + seed run **inside the Vercel build**
  against the prod DB.
- `world-music-map.javierramos.dev` attached via REST (Vercel-managed DNS,
  auto-verified + SSL).
- `DATABASE_URL` (Railway public proxy URL, db `world_music_map`) set directly
  in the Vercel project env by Javier - the prod-DB secret never transited
  localhost (the auto-mode classifier blocks that read by design).
- `main` pushed -> git-connected production deploy -> READY -> verified live.
- Full deploy capability recorded in personal memory `deploy-automation-local`.

Note: seed runs on every deploy. It is idempotent and only touches the 3 seed
slugs' media, so later-curated locales survive. Decouple seed-from-build at S6.

## Recommended next

**S2 (MapTiler swap)** - replace the keyless demo style with real on-brand dark
tiles (domain-restricted MapTiler key in server env). Or jump to **S3 (filters)**
for a visible feature. Each slice now auto-deploys on push to `main`.

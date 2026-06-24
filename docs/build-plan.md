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
| S3 | **Filters: genre + era** ✅ DONE | Facet filters over the markers | DONE: facet chips emphasize matching locales + dim the rest (§3 filters). See "S3 - Filters" below. | Filter state kept local (URL-sync deferred); facets derived from the loaded locales. |
| S4 | **Dead-embed fallback** ✅ DONE | Never a raw broken iframe | DONE: runtime `onError` -> "temporarily unavailable" card + Watch-on-YouTube; server oEmbed sweep flags `needsReview` (§3 dead-embed, §4 no-dead-embeds). See "S4 - Dead-embed" below + [`prd/s4-dead-embed.md`](prd/s4-dead-embed.md). | Detection locked: runtime IFrame Player API + server sweep (grilled). |
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
  jiramos87s-projects) created via REST + linked to the repo. Build command is
  pinned in committed `vercel.json`: `pnpm exec prisma generate && pnpm exec
  prisma migrate deploy && next build`. `prisma generate` is explicit because
  Vercel restores the install cache and skips `postinstall` (a build that omits
  it fails with a missing `lib/generated/prisma/client`). Schema migrates on
  every deploy; the DB was seeded once (data persists), seed runs on demand.
- `world-music-map.javierramos.dev` attached via REST (Vercel-managed DNS,
  auto-verified + SSL).
- `DATABASE_URL` (Railway public proxy URL, db `world_music_map`) set directly
  in the Vercel project env by Javier - the prod-DB secret never transited
  localhost (the auto-mode classifier blocks that read by design).
- `main` pushed -> git-connected production deploy -> READY -> verified live.
- Full deploy capability recorded in personal memory `deploy-automation-local`.

## S2 - MapTiler basemap (DONE, live)

The map reads `MAPTILER_KEY` server-side and passes it to the client map (the key
must reach the browser to fetch tiles, so it is protected by a MapTiler domain
restriction, not by hiding it); unset, it falls back to the keyless demo style.
Style: `dataviz-dark`. Live and verified on the prod domain: the dark basemap
renders and the cyan markers + drawer sit on top. Key is domain-restricted to
the prod domain + `localhost:3102`.

## S3 - Filters: genre + era (DONE)

A compact facet bar sits under the title (top-left, click-through map around it).
Genre and era values are derived from the loaded locales (no hardcoded list, so
the bar grows with the catalog). Toggling chips filters the markers: matching
locales stay bright while the rest dim in place (emphasis over hiding, which
reads better on a sparse map); a "Showing N of M places" line and a Clear button
appear while any facet is active. Logic is AND across the two groups, OR within a
group. Filter state is local React state in `MapExperience` (URL-sync deferred -
not required by the §3 acceptance). Markers are re-styled imperatively via a
`wmm-marker--dimmed` class in a dedicated effect, so toggling a facet never
rebuilds the map. Selection stays independent of filtering (a dimmed marker still
opens its drawer). Verified: facet logic, mobile wrap, drawer regression, verify
gate green, zero console errors.

## S4 - Dead-embed fallback (DONE)

Never a raw broken iframe (PRD §4). Two complementary layers, locked by a grill
(see [`prd/s4-dead-embed.md`](prd/s4-dead-embed.md)):

- **Runtime (viewer-facing):** the drawer renders YouTube through the IFrame
  Player API (`lib/youtube-api.ts` + `components/youtube-embed.tsx`), not a plain
  iframe (a plain embed gives no failure signal). `onError` (deleted / private /
  embedding-disabled / region-blocked, as the viewer sees it) swaps the player
  for a "temporarily unavailable" card with a working "Watch on YouTube" link.
  The player mounts into a manually-created child node so YouTube replacing it
  with an iframe never clashes with React; `youtube-nocookie` host is preserved.
- **Curation (server-side):** `pnpm media:health-check` (`scripts/health-check.ts`)
  asks YouTube oEmbed whether each video is still available and flips
  `needsReview`. The write stays server-side (no public writes). Complements the
  runtime layer (oEmbed can't see embedding-disabled / region cases).

Verified end-to-end: working video plays (regression); a broken id -> fallback
card (no broken iframe) + sweep reports DEAD and flags `needsReview`; restoring
clears it; verify gate green; zero console errors. archive.org alternates as the
actual fallback media are S5; nightly sweep + needsReview clear-workflow are S6.

## Aurora redesign track (inserted before S5)

A design pass retro-PRD'd from the "World Music Map Concepts" bundle, concept 01
"Aurora" (chosen). Full spec + locked decisions + design tokens:
[`prd/aurora-redesign.md`](prd/aurora-redesign.md). Sequenced before S5 for the
visual + influence work; the mini-player (A6) is gated on S5's audio.

| # | Slice | Goal | Gate |
|---|---|---|---|
| A1 | Aurora shell + type | Fonts + atmosphere + logo + filter-panel skin; real count. No data. | None. Next up. [`prd/a1-aurora-shell.md`](prd/a1-aurora-shell.md) |
| A2 | Genre families: colors + markers + legend | Family color map; glowing colored markers + pulse; legend card. | A1 + curated color map |
| A3 | Detail panel upgrade | Eyebrow + coords + cover-art + favorite/share + Play CTA + connected-sounds slot | A1 |
| A4 | InfluenceLink model + curation | `InfluenceLink` schema + migration + curated links (pulls the v2 model into v1) | Prisma migration |
| A5 | Influence arcs + Connected sounds | Animated arcs on a MapLibre-synced overlay + panel list | A4 + A2 + A3 |
| A6 | Persistent mini-player | Global now-playing + queue + scrubber + decorative EQ | **Gated on S5** |

Decisions locked: keep MapTiler + Aurora overlay (not the dotted-SVG map); pull
full InfluenceLink into v1; mini-player gates on S5 archive.org audio; ship as
ordered slices.

## Recommended next

**A1 (Aurora shell + type)** - the first design slice, no data changes, ships on
its own. Then A2-A5, then **S5 (archive.org enrichment)** (native CC/PD player +
the controllable audio the A6 mini-player needs), then A6, then S6 (~20-locale
catalog) + S7 polish. Each slice auto-deploys on push to `main`.

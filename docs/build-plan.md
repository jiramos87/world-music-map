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
| S6 | **Curation + catalog-coverage** ✅ DONE | Reach the v1 success measure | DONE: 17 locales, each a genre/era + attribution + 1 oEmbed-verified-playable official/label embed; health-check all ok. See [`prd/s6-catalog.md`](prd/s6-catalog.md). | 3 more held for official sources (Tehran/Istanbul/Port of Spain). |
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
| A1 | Aurora shell + type ✅ DONE | Fonts + atmosphere + logo + filter-panel skin; real count. No data. | DONE (local, verified). [`prd/a1-aurora-shell.md`](prd/a1-aurora-shell.md) |
| A2 | Genre families: colors + markers + legend ✅ DONE | Family color map; glowing colored markers + pulse; legend card. | DONE (local, verified). [`prd/a2-genre-families.md`](prd/a2-genre-families.md) |
| A3 | Detail panel upgrade ✅ DONE | Eyebrow + coords + framed media + favorite/share + colored chips + connected-sounds slot | DONE (local, verified). [`prd/a3-detail-panel.md`](prd/a3-detail-panel.md) |
| A4 | InfluenceLink model + curation ✅ DONE | `InfluenceLink` schema + migration + 9 curated links (pulls the v2 model into v1) | DONE (local, verified). [`prd/a4-influence-model.md`](prd/a4-influence-model.md) |
| A5 | Influence arcs + Connected sounds ✅ DONE | Animated arcs on a MapLibre-synced overlay + panel list | DONE (local, verified). [`prd/a5-influence-arcs.md`](prd/a5-influence-arcs.md) |
| A6 | Persistent mini-player | Global now-playing + queue + scrubber + decorative EQ | **Gated on S5** |

Decisions locked: keep MapTiler + Aurora overlay (not the dotted-SVG map); pull
full InfluenceLink into v1; mini-player gates on S5 archive.org audio; ship as
ordered slices.

Gotcha (A2): the Turbopack dev server can serve a stale `globals.css` that keeps
edits to existing selectors but silently drops NEWLY ADDED ones (new classes,
`::before`, `@keyframes`). `pnpm build` is always correct; the fix is
`rm -rf .next` + restart the dev server (a plain restart is not enough).

## A5 - Influence arcs + Connected sounds (DONE)

The 9 A4 links now render as animated arcs on a MapLibre-synced SVG overlay (each
link = a faint base line + a CSS "comet" dash traveling along it, colored by the
source family) plus a "Connected sounds" list in the detail panel. Arc geometry is
re-projected on every map `render` event so the curves stay pinned through pan/zoom;
selecting a locale spotlights its arcs and mutes the rest, mirroring the panel list;
clicking a Connected-sounds entry opens that locale. `prefers-reduced-motion` drops
the travel animation to a steady glowing line. Spec:
[`prd/a5-influence-arcs.md`](prd/a5-influence-arcs.md). Verified in the browser: 9
arcs with real geometry + 0 console errors, arcs re-project on zoom, Havana shows
its 4 links with correct direction, navigation + spotlight work; verify gate green.

## Catalog: Cueca brava + zamacueca (2026-06-25)

Added **Santiago, Chile** (cueca brava) and **Lima, Peru** (zamacueca) with two
influence arcs: **Seville -> Santiago** ("the Andalusian fandango and its Moorish
canto a la rueda") and **Lima -> Santiago** ("the Peruvian zamacueca, carried
south in the 1820s as la chilena"). Catalog is now **19 locales / 11 links**; a new
`cueca` genre family (`#ef4444`) covers cueca / cueca brava / zamacueca / marinera.

Both embeds are oEmbed-verified official **Topic** channels (label catalogs):
Los Chileneros - "La Quintrala" (`3wDtCSGUFu4`) and Eva Ayllón - "Una Larga Noche
(Zamacueca)" (`SzRD1czrZmE`, title literally tagged Zamacueca). Health-check: 19 ok.

Research verdict (vs. the "spanish / arabic / african / mapuche" hypothesis): the
Spanish base and the **Arabic-Andalusian** canto a la rueda (Samuel Claro, the most
cited theory for the core structure, and the defining trait of cueca *brava*) are
solid; the **African** element is real but secondary, arriving via the Afro-Peruvian
**zamacueca**; the **Mapuche** claim is a genuine but minority/contested theory
(Kilapán 1995). The missing piece in the hypothesis was **Peru/Lima** as the
documented conduit (~1824), which is why Lima was added rather than drawing a direct
African arc. Sources: es.wikipedia "Origen de la cueca", en.wikipedia "Zamacueca",
Memoria Chilena (cueca brava), MusicaPopular.cl (Los Chileneros). Mapuche is
described in the Santiago blurb (no external arc: indigenous-internal to Chile).

## Catalog: Cumbia + chicha (2026-06-25)

Added **Barranquilla, Colombia** (cumbia) and **Pucallpa, Peru** (cumbia chicha /
Amazonian) plus the requested **Seville -> Lima** arc. Catalog is now **21 locales /
15 links**; a new `cumbia` genre family (`#8b5cf6`) covers cumbia / chicha / gaita /
cumbia amazónica. Four new arcs:

- **Seville -> Lima** - "Andalusian song at the root of the zamacueca" (the deeper
  Spanish thread the cueca research surfaced).
- **Seville -> Barranquilla** - "Spanish coplas and the fandango's courtship".
- **Lagos -> Barranquilla** - "West African drums at the heart of the cumbia"
  (Lagos is the map's West African Atlantic-diaspora node; the African drum element
  is direct and definitional in cumbia, so it gets an arc, unlike the cueca where
  the African input arrived via the Afro-Peruvian zamacueca conduit).
- **Barranquilla -> Pucallpa** - "Colombian cumbia electrified into Amazonian
  chicha".

Cumbia = Afro (drums) + Indigenous (Kogui gaita flute) + Spanish (coplas/fandango),
cradled on the Magdalena/Caribbean coast; the Indigenous gaita is internal to
Colombia (blurb, no external arc). Chicha = Colombian cumbia + Andean huayno +
Amazonian + psychedelic surf rock, born in the Amazon oil towns (Juaneco y su
Combo, Pucallpa), later Lima's migrant music (blurb). Embeds are oEmbed-verified
official Topic channels: Totó la Momposina - "Yo Me Llamo Cumbia" (`_sOav6GrLr8`)
and Juaneco y su Combo - "El Agua del Higuerón" (`nOcrqx3-_wY`). Health-check 21 ok.
Sources: en.wikipedia "Cumbia (Colombia)" + "Peruvian cumbia", TeachRock (cumbia
roots), Bandcamp Daily (chicha). **S7 note:** legend now lists 20 families and the
genre filter ~30 genres - the filter-by-family / collapsible control is now due.

## Recommended next

**S5 (archive.org enrichment)** - native CC/PD HTML5 audio on marquee locales, with
attribution. This unlocks A6 (the persistent mini-player is gated on S5's audio, to
avoid the hidden-YouTube ToS gray area). S6 (17-locale catalog) + A1-A5 (Aurora +
influence web) are done. Remaining order: **S5 (archive.org) -> A6 (mini-player) ->
S7 (polish)**. Each slice auto-deploys on push to `main` (build runs migrate + seed).

Notes / S7 candidates surfaced by S6 scale: the genre filter now lists ~24 genres
(consider filter-by-family or a collapsible/scrollable control); the legend lists
16 families (fits desktop, fine). Prod-seed: the seed is now **re-coupled into the
Vercel build** (`vercel.json`: generate -> migrate -> `tsx prisma/seed.ts` ->
build). It is idempotent (upsert + media replace) and runs in the build env with
the prod `DATABASE_URL` (never pulled to localhost), so a content push now seeds
prod automatically. Tradeoff: a deploy fails if the prod DB is unreachable at build
time (acceptable, fail-safe). WMM has no Railway container of its own (Vercel app,
Railway only hosts its sibling DB), so the build is the right reseed surface, not
`railway ssh`.

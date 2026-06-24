# World Music Map - PRD

> **Status: DEFINED.** Grilled from the 2026-06-24 draft via `/prd-grill-me` on
> 2026-06-24. Behavior only; the implementer owns architecture. One product, v1 scope.

## 1. Why

World music is easy to hear but hard to place. Most listeners never see how a
sound maps to a geography, or how styles traveled between places. World Music Map
is a discovery-first interactive world map where a visitor clicks a place and
immediately hears and sees its music, with honest attribution. It is depth over
breadth: a small, well-curated set of locales beats a thin global veneer.

Primary audience (v1): **curious listeners**, casual discovery-first visitors who
want to explore and listen by place. Students / educators and ethnomusicology
deep-dives are explicitly later audiences.

## 2. User experience (the loop)

A visitor lands on a world map (MapLibre GL) showing ~15-25 curated locale markers
across the globe, and can pan and zoom. They can filter by genre and era, which
limits or emphasizes the visible locales. Clicking a locale opens a side drawer
over the map (the map stays visible) with: a short blurb, 1-3 curated media items
(YouTube embeds, plus the occasional archive.org native player on marquee
locales), and per-item source + license attribution always visible. They play
media in the drawer, close it, and keep exploring. On phones the same flow works
mobile-first. No login; everything is public read.

## 3. Acceptance (Given / When / Then)

- Given the page is ready, When the map loads, Then ~15-25 locale markers render on
  a MapLibre GL map and the visitor can pan/zoom smoothly on desktop and mobile.
- Given a visitor clicks a locale marker, When the drawer opens, Then it shows the
  locale blurb, its 1-3 media items, and each item's source + license/attribution,
  without navigating away from the map.
- Given a media item is a YouTube embed, When the visitor plays it, Then audio +
  video play inline in the drawer for any anonymous visitor (no login).
- Given a YouTube embed is removed, geo-blocked, or has embedding disabled, When
  the drawer tries to render it, Then the visitor sees a "temporarily unavailable"
  card, an archive.org alternate plays instead if the locale has one, and the item
  is flagged in the DB for curator review (never a raw broken iframe error).
- Given genre/era filters, When the visitor selects one or more facets, Then only
  matching locales remain emphasized/visible and non-matching ones are
  de-emphasized or hidden.
- Given a marquee locale with an archive.org item, When the drawer opens, Then the
  recording plays via a native HTML5 player with CC / public-domain attribution
  shown.
- Given a visitor on a phone, When they open a locale, Then the drawer and players
  are usable and legible without horizontal scrolling.
- Given a locale has no playable media (all items unavailable), When the drawer
  opens, Then it shows an honest empty/unavailable state, not a blank panel.
- Given data is in flight, When the map or drawer is loading, Then a loading state
  (skeleton/spinner) is shown, not a blank or janky layout.

## 4. Quality bar

- Mobile-first responsive: map, drawer, and embeds work on phones from first launch.
- No dead embeds at launch: every locale has at least one verified-playable item
  the day v1 ships; the fallback path is real, not theoretical.
- Attribution is never misleading: media is never framed as "licensed music."
  YouTube embeds keep the license with the creator (shown); archive.org items show
  CC / public-domain attribution. Load-bearing.
- Performance: smooth pan/zoom; lazy-load embeds (do not mount every iframe at
  once); aim for the house Lighthouse bar (90+).
- Accessibility: AA contrast, keyboard-operable drawer, labels on controls.
- Empty / loading / error states are all designed (map load, drawer load, no-media,
  dead-embed fallback).

## 5. Dependencies (resolution for each)

| Dependency | Decision | Fallback | Cost / license | Runtime vs curation |
|---|---|---|---|---|
| Map render | MapLibre GL (open source) | n/a | free, open | runtime |
| Map tiles | MapTiler free tier, domain-restricted key in server env | self-host Protomaps / PMTiles if quota is hit | free tier; key server-restricted, never client-exposed beyond domain lock | runtime |
| Playback (primary) | YouTube IFrame Player API embeds; IDs curated + stored in DB | "temporarily unavailable" card, then archive.org alternate if present, then `needsReview` flag | free, unlimited at runtime; quota-limited Data API only at curation time | embed at runtime; ID sourcing/vetting at curation |
| Playback (enrich) | archive.org CC / PD recordings via native HTML5 player, marquee locales, opportunistic | additive (no fallback needed) | free; must attribute CC / PD | runtime player; curation sources + attributes |
| Database | reuse Railway Postgres SERVER as a separate `world_music_map` database, own Prisma schema + migrations | n/a | no extra managed-DB cost; isolated from the portfolio DB | runtime reads (RSC); migrations + seeds at curation |
| API / app | single Next.js (App Router) app, Prisma reads in RSC; no separate Nest service in v1 | add Nest later only if a public write path appears | reuse house-stack tooling | runtime |
| Hosting | own Vercel project, subdomain `world-music-map.javierramos.dev` | n/a | a second Vercel project is free; Vercel-managed DNS + auto SSL | deploy |
| Influence-link data | deferred to v2 (no v1 sourcing) | n/a | n/a | n/a in v1 |
| Metrics | none in v1; success = catalog-coverage milestone | n/a | none | n/a |

## 6. Data model

Postgres + Prisma, in its own `world_music_map` database.

```
Location      country / region / city; lat/lng (or GeoJSON); parent (for scale);
              blurb; genre[]; era[]        // genre/era drive the v1 filters
   has many MediaItem
MediaItem     type: video | audio
              provider: youtube | archive | file
              providerId | url
              title, attribution, license
              needsReview Boolean          // set when an embed is detected unplayable
              sortOrder
InfluenceLink fromLocation -> toLocation    // model may exist; NO v1 UI (v2)
```

Genre and era are required, curated facets on `Location`. The value set is curated
and kept small and consistent so the filters stay meaningful across ~20 locales.

## 7. Curation flow (v1)

Curation is agent-driven. Javier plus an agent (Claude Code / MCP / SSH / tooling)
add locales and media via Prisma seed scripts against the `world_music_map`
database. There is no admin UI in v1. Sourcing: pick a locale, find a fitting
YouTube video (and an archive.org CC/PD recording where one exists), record the
ID/url + title + attribution + license + genre/era, and verify it plays. The
`needsReview` flag (set at runtime when an embed is detected unplayable) is a DB
column an agent lists and clears during periodic re-curation passes.

## 8. Out of scope (v1)

- Influence-flow links UI (the "X influenced Y" edges). This is the headline v2 feature.
- Hosting / distributing copyrighted music files; any "licensed streaming."
- A full streaming catalog, recommendations, or playlists / learning paths.
- Admin CRUD UI (curation is agent + scripts in v1).
- Auth / accounts (public read only; no visitor login).
- Engagement analytics / metric instrumentation.
- Search beyond the genre/era facet filters (e.g. full-text); a large global catalog.

## 9. Done looks like

A mobile-first interactive world map on its own subdomain with ~20 well-curated
locales, each opening a drawer of 1-3 honestly-attributed, verified-playable media
items, filterable by genre/era, with a real dead-embed fallback, reading from its
own database on the shared Postgres server.

## 10. Success measure (v1)

Catalog-coverage milestone: 20 locales live, each with at least one
verified-playable media item, genre + era tags, and visible attribution; the
dead-embed fallback exercised at least once in QA. No engagement instrumentation
in v1.

## Scope changes (living log)

- 2026-06-24: Grilled the draft to DEFINED via `/prd-grill-me`. Decisions below.
- 2026-06-24: Audience narrowed to curious listeners; students/educators + deep-dives moved later - scoped.
- 2026-06-24: Centerpiece = media-per-locale; influence-flow deferred to v2 - deferred (ship the strong core first, avoid thin/unsourced edges).
- 2026-06-24: Launch scope = ~15-25 curated locales, depth over breadth - scoped.
- 2026-06-24: Map = MapLibre GL + MapTiler free tier (server-restricted key); Protomaps self-host as fallback - decided.
- 2026-06-24: Media UX = side drawer; 1-3 items per locale - decided.
- 2026-06-24: Filters = genre + era in v1; raises the metadata bar (genre/era required on Location) - added vs draft.
- 2026-06-24: Dead-embed handling = fallback card, then archive.org alternate, then needsReview flag - decided (was an open question).
- 2026-06-24: archive.org = opportunistic enrichment on marquee locales, not required per locale - scoped.
- 2026-06-24: Stack = single Next.js + Prisma, no Nest in v1; revised from the draft "Next + Nest" because curation is agent-driven with no public writes - simplified.
- 2026-06-24: Database = reuse the Railway Postgres SERVER as a separate `world_music_map` database (own schema + migrations), not shared tables, to protect the live portfolio - decided.
- 2026-06-24: Hosting = own Vercel project + subdomain `world-music-map.javierramos.dev` (Vercel-managed DNS + auto SSL); standalone repo retained - decided.
- 2026-06-24: Curation = agent + MCP/SSH + Prisma scripts, no admin UI - decided.
- 2026-06-24: Mobile-first responsive; per-item attribution always visible - decided.
- 2026-06-24: Success = catalog-coverage milestone, no engagement instrumentation in v1 - decided.

## v2 / later

- Influence-flow links: source the "X influenced Y" relationships, then render edges
  on the map. The headline differentiator.
- Search (name + richer facets), a larger / global catalog, learning paths / playlists.
- Minimal admin CRUD if agent-only curation stops scaling.
- Engagement analytics + real metrics.
- Becomes a javierramos.dev exhibit (shipped product + agentic build story) with a
  curated build narrative.

## Portfolio note

Standalone project and repo, not part of the portfolio repo. It reuses the
portfolio's Postgres server (its own database) and the house tooling / kit, and
will later become an exhibit on javierramos.dev.

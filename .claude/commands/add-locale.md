---
description: Add a locale to the World Music Map (entry + media + influence arcs), research-first with oEmbed-verified embeds, then seed and verify
---

Add one or more entries to the World Music Map. Curation lives in `prisma/seed.ts`
(no admin UI); the runtime tables are `Location` (the entry) + `MediaItem` (one
playable item) + `InfluenceLink` (a directed arc, `from -> to`, with a free-text
`relationship` note). Direction is the relationship: `from` influences `to`; `to` is
influenced by `from`. Honesty is load-bearing: never fabricate a video ID, never
frame an embed as licensed music, and only draw an arc as a broadly-accepted
connection.

1. Research. Web-search the place/genre and its influences; compare to the user's
   hypothesis honestly (what holds, what's nuanced, what's missing). Decide the
   locale(s), coords, `genre[]` / `era[]`, and which influences become ARCS vs. blurb.
   Rule: an arc needs a real place at BOTH ends; indigenous/internal roots and any
   influence with no map node go in the blurb; route through a conduit node when one
   exists rather than overstating a direct line. If a material call is open (which
   city, add an intermediary node, draw a contested arc), poll the user.

2. Source media - oEMBED-VERIFIED. Find an official recording: `curl` the YouTube
   search results page, `grep` for `"videoId"`, then oEmbed each candidate
   (`curl -s "https://www.youtube.com/oembed?format=json&url=https://youtu.be/<id>"`)
   and keep only Topic / VEVO / label / artist-official channels whose `author_name`
   and `title` match the intended track. NEVER guess an id. (Python urllib fails TLS
   in this sandbox - use `curl` to fetch, Python only to parse the JSON.)

3. Write the curation spec to `docs/curation/{slug}.md` from
   `.claude/templates/curation-template.md` - the structured record (entry, verified
   media, arcs, sources, honesty checklist). One file per entry; this is the formal
   data structure, authored before the seed edit.

4. Apply to the seed. If a genre is new, add the family + `GENRE_TO_FAMILY` mapping in
   `lib/genre-families.ts` (pick a color that stays distinct in the legend). Add the
   `Location`(s) + media to the `locations` array and the arc(s) to `influenceLinks`
   in `prisma/seed.ts`, matching the `SeedLocation` shape (append; `sortOrder` = index).

5. Verify. `pnpm db:seed` (idempotent) -> `pnpm media:health-check` (every embed ok)
   -> `pnpm verify` (types + lint + build). Then browser-check via the preview: the
   drawer opens, the embed plays (no dead-embed fallback), the Connected-sounds list
   shows the right `->` / `<-` directions, the arcs spotlight on select, and the
   marker is the family color.

6. Record + ship. Update `docs/build-plan.md` (new locale/link counts + a one-line
   curation note) and personal memory. Commit. Push only when asked - the Vercel
   build reseeds prod, so a push takes the entry live; then confirm the live count
   and a relationship note in the prod HTML.

Mark the curation spec SEEDED after step 5, LIVE after step 6. One entry per spec; if
the request bundles several, repeat the loop per entry (research can be shared).

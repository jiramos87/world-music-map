# Curation: {City, Country} ({slug})

Status: RESEARCHED -> VERIFIED -> SEEDED -> LIVE. The structured record behind the
`prisma/seed.ts` entry. Honesty bar (load-bearing): never fabricate a video ID;
never frame an embed as licensed music; an influence arc is a broadly-accepted
connection framed as a connection, not a hard causal claim.

## Entry (-> `Location` row)
- slug: {kebab-city-country}
- name: "{City, Country}"
- country / region: {Country} / {macro-region, e.g. South America}
- coords: {lat}, {lng}
- genre[]: [{primary}, {secondary}]   # genre[0] drives the marker color (family)
- era[]: [{e.g. 20th century | Traditional | 19th century}]
- genre family: {familyKey} ({#hex})   # existing family, OR new + a legend-distinct color
- blurb: "{1-2 sentences. Name the influences honestly. Internal/indigenous roots,
  and any influence with no map node to draw from, go HERE - not as an arc.}"

## Media (-> `MediaItem` rows) - oEMBED-VERIFIED
Keep only official channels: Topic / VEVO / label / artist-official. Paste the
oEmbed `author_name :: title` you verified for each id.

| title | providerId | channel (author_name) | license |
|---|---|---|---|
| {Artist - "Track"} | {11-char id} | {e.g. Artist - Topic} | YouTube Standard License |

oEmbed check: `curl -s "https://www.youtube.com/oembed?format=json&url=https://youtu.be/<id>"`

## Influence arcs (-> `InfluenceLink` rows)
Directed `from -> to`: `from` **influences** `to`; `to` is **influenced by** `from`
(this direction is the only relationship signal - there is no typed kind). Draw an
arc only when both ends are real places (already on the map or added in this spec).
Route through a conduit node when one exists rather than overstating a direct line.

| from (slug) | to (slug) | relationship (short curated note) |
|---|---|---|
| {slug} | {slug} | "{evocative, honest, lowercase}" |

## Research + sources
- {claim} - {source url}
- Verdict vs. the hypothesis (if any): {what holds / what's nuanced / what was missing}.

## Honesty checklist
- [ ] Every providerId oEmbed-verified on an official/Topic/VEVO/label channel.
- [ ] No fabricated IDs; no embed framed as licensed music.
- [ ] Each arc is a broadly-accepted connection; internal/indigenous roots are in the blurb.
- [ ] A new genre-family color is visually distinct in the legend.
- [ ] `media:health-check` is ok for every new embed.

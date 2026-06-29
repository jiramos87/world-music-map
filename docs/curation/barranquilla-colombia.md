# Curation: Barranquilla, Colombia (barranquilla-colombia)

Status: LIVE (2026-06-25). The structured record behind the `prisma/seed.ts` entry.
Honesty bar (load-bearing): never fabricate a video ID; never frame an embed as
licensed music; an influence arc is a broadly-accepted connection framed as a
connection, not a hard causal claim.

## Entry (-> `Location` row)
- slug: barranquilla-colombia
- name: "Barranquilla, Colombia"
- country / region: Colombia / South America
- coords: 10.9685, -74.7813
- genre[]: [Cumbia, Gaita]   # genre[0] = Cumbia -> cumbia family color
- era[]: [Traditional]
- genre family: cumbia (#8b5cf6)   # NEW family, added for this lineage; legend-distinct violet
- blurb: "On Colombia's Caribbean coast by the Magdalena River that cradled the
  cumbia: African drums, the Indigenous Kogui gaita flute, and Spanish coplas braided
  into one courtship rhythm, carried to the world from the Barranquilla Carnival."
  (Indigenous Kogui gaita is named in the blurb, not an arc - it is internal to
  Colombia with no external place to draw from.)

## Media (-> `MediaItem` rows) - oEMBED-VERIFIED

| title | providerId | channel (author_name) | license |
|---|---|---|---|
| Totó la Momposina - "Yo Me Llamo Cumbia" | `_sOav6GrLr8` | Totó La Momposina - Topic | YouTube Standard License |

oEmbed: `author_name = "Totó La Momposina - Topic" :: title = "Yo Me Llamo Cumbia"`
(official label catalog Topic channel). `media:health-check` -> ok.

## Influence arcs (-> `InfluenceLink` rows)
Directed `from -> to`: `from` influences `to`; `to` is influenced by `from`.

| from (slug) | to (slug) | relationship |
|---|---|---|
| seville-spain | barranquilla-colombia | "Spanish coplas and the fandango's courtship" |
| lagos-nigeria | barranquilla-colombia | "West African drums at the heart of the cumbia" |
| barranquilla-colombia | pucallpa-peru | "Colombian cumbia electrified into Amazonian chicha" |

Note: cumbia's African drum element is DIRECT and definitional (no intermediary), so
it gets an arc - unlike the cueca, where the African input arrived via the
Afro-Peruvian zamacueca conduit (routed Lima -> Santiago instead). Lagos is the
map's standing West-African Atlantic-diaspora node (cf. Lagos -> Salvador).

## Research + sources
- Cumbia = Afro (drums) + Indigenous (Kogui gaita/kuisi flute, caña de millo,
  maracas) + Spanish (coplas, the fandango's courtship), cradled on the Magdalena
  River / Caribbean coast. - https://en.wikipedia.org/wiki/Cumbia_(Colombia) ,
  https://teachrock.org/lesson/colombian-cumbia-african-indigenous-and-spanish-roots-of-rhythm/
- Chicha (the `-> pucallpa-peru` target) = Colombian cumbia + Andean huayno +
  Amazonian + psychedelic surf rock, born in the Amazon oil towns (Juaneco y su
  Combo, Pucallpa). - https://en.wikipedia.org/wiki/Peruvian_cumbia
- Verdict: the three-fold Afro/Indigenous/Spanish fusion is the textbook consensus;
  the only curation judgement was the African source node (Lagos, as the map's West
  African Atlantic node) vs. blurb-only - chosen as an arc because it is direct.

## Honesty checklist
- [x] providerId oEmbed-verified on an official Topic channel.
- [x] No fabricated IDs; embed not framed as licensed music.
- [x] Each arc is a broadly-accepted connection; Indigenous gaita is in the blurb.
- [x] New cumbia family color (#8b5cf6) is distinct in the legend.
- [x] `media:health-check` ok.

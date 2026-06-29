# Curation: Rio de Janeiro, Brazil (rio-de-janeiro-brazil)

Status: SEEDED (2026-06-25). EXPANSION of an existing node: Rio was already on the
map as the samba node (Cartola); this adds the bossa nova dimension (2nd media item +
blurb + arcs). No new Location, no new genre family (bossa nova maps to the samba
family, so the marker stays samba-colored). Honesty bar: never fabricate a video ID;
an influence arc is a broadly-accepted connection, not a hard causal claim.

## Entry (-> `Location` row, updated)
- slug: rio-de-janeiro-brazil
- name: "Rio de Janeiro, Brazil"
- country / region: Brazil / South America
- coords: -22.9068, -43.1729
- genre[]: [Samba, Bossa nova]   # genre[0] = Samba -> samba family (#f472b6); unchanged
- era[]: [20th century]
- genre family: samba (#f472b6) for the marker; "Bossa nova" chip also maps to samba family
- blurb: "Samba was born on the hillside morros and in Mangueira... A generation later
  in Ipanema, João Gilberto and Tom Jobim cooled that samba with jazz harmony into
  bossa nova, the quiet new wave that went on to conquer the world."

## Media (-> `MediaItem` rows) - oEMBED-VERIFIED

| title | providerId | channel (author_name) | license |
|---|---|---|---|
| Cartola - "As Rosas Não Falam" | `pBWg7LGETL0` | Cartola (Vevo) | YouTube Standard License |
| João Gilberto - "Chega de Saudade" | `B1VI8SQiw3E` | João Gilberto - Topic | YouTube Standard License |

Chega de Saudade (1958) is the founding bossa nova recording. oEmbed:
`author_name = "João Gilberto - Topic" :: title = "Chega de Saudade"`. health-check ok.

## Influence arcs (-> `InfluenceLink` rows)
Directed `from -> to`: `from` influences `to`.

| from (slug) | to (slug) | relationship |
|---|---|---|
| new-orleans-usa | rio-de-janeiro-brazil | "American cool jazz, woven into samba as bossa nova" |
| salvador-brazil | rio-de-janeiro-brazil | "Bahian samba-de-roda, carried up to Rio's morros" |

Together these tell the fusion: samba (Salvador -> Rio, the Afro-Bahian root) + jazz
(New Orleans -> Rio, the map's jazz node) = bossa nova in Rio.

## Research + sources
- Bossa nova = samba (Rio's samba-canção) + American **cool** jazz (not bebop;
  Chet Baker shaped João Gilberto) + Debussy/Ravel impressionist harmony (via Jobim,
  Villa-Lobos), Ipanema/Copacabana, ~1958 ("Chega de Saudade"). Flowed back into jazz
  (Getz/Gilberto, "Girl from Ipanema"). - https://en.wikipedia.org/wiki/Bossa_nova ,
  https://www.smithsonianmag.com/smart-news/remembering-bossa-nova-pioneer-joao-gilberto-180972578/
- Verdict vs. the "bebop + samba(Salvador) + maybe Cuba" hypothesis: jazz is **cool**,
  not bebop; the samba is **Rio's own** (Salvador is samba's deeper root, not bossa's
  direct parent); **Cuba is a sibling** branch of Latin jazz, not a parent - no
  Havana -> Rio arc.

## Honesty checklist
- [x] New providerId (B1VI8SQiw3E) oEmbed-verified on the João Gilberto - Topic channel.
- [x] No fabricated IDs; no embed framed as licensed music.
- [x] Both arcs are broadly-accepted connections; Cuba (a sibling, not a parent) omitted.
- [x] No new family color needed (bossa nova folds into the samba family).
- [x] `media:health-check` ok (22 checked; Rio's two embeds both ok).

# S6 - Curation + catalog coverage

Status: DEFINED (2026-06-24). Reordered ahead of A4/A5 (influence is sparse until
the catalog is full). Reaches the v1 success measure: ~20 locales, each with >=1
**verified-playable** media item + genre/era + attribution.

## The honesty constraint (load-bearing)

The metadata (place, country, region, lat/lng, genre, era, blurb, family) is real
and curatable from knowledge. **YouTube video IDs are NOT** - they are opaque
11-char strings that cannot be recalled reliably, and a wrong/guessed ID ships a
mislabeled or dead embed, which violates the project's honesty bar. So:

- No video ID ships unverified. Verification = YouTube **oEmbed** returns the
  real `title` + `author_name`, which must match the intended recording. The S4
  `media:health-check` already does the existence half; S6 extends the check to
  print title/author for human confirmation.
- A locale whose media can't be confirmed ships with the media flagged
  `needsReview` (the S4 fallback shows the "unavailable" card), never a fabricated
  embed.

## Proposed catalog (~20, for region + family coverage)

Existing: Bamako (Blues), Havana (Son), Lisbon (Fado). Proposed additions:

| Place | Country | Region | Primary genre -> family | Marquee artist |
|---|---|---|---|---|
| New Orleans | USA | N. America | Jazz -> Jazz | Louis Armstrong |
| Kingston | Jamaica | Caribbean | Reggae -> Reggae | Bob Marley |
| Rio de Janeiro | Brazil | S. America | Samba -> Samba | Cartola |
| Buenos Aires | Argentina | S. America | Tango -> Tango | Astor Piazzolla |
| Lagos | Nigeria | W. Africa | Afrobeat -> Highlife | Fela Kuti |
| Dakar | Senegal | W. Africa | Mbalax -> Mande | Youssou N'Dour |
| Seville | Spain | Iberia | Flamenco -> Flamenco* | Paco de Lucia |
| Cairo | Egypt | N. Africa | Tarab -> Arabic* | Umm Kulthum |
| Lahore | Pakistan | S. Asia | Qawwali -> Qawwali* | Nusrat Fateh Ali Khan |
| Addis Ababa | Ethiopia | E. Africa | Ethio-jazz -> Jazz | Mulatu Astatke |
| Mindelo | Cape Verde | Atlantic | Morna -> Morna* | Cesaria Evora |
| Port of Spain | Trinidad | Caribbean | Calypso -> Calypso* | Mighty Sparrow |
| Tehran | Iran | W. Asia | Persian classical -> Persian* | (curate) |
| Istanbul | Turkey | W. Asia | Turkish -> Anatolian* | (curate) |
| Chennai | India | S. Asia | Carnatic -> Carnatic* | (curate) |
| Ubud (Bali) | Indonesia | SE Asia | Gamelan -> Gamelan* | (curate) |
| Salvador | Brazil | S. America | Afro-Brazilian -> Samba | Gilberto Gil |

(* = new genre family; extend `lib/genre-families.ts` with a color for each. Keep
the legend readable - group or cap if needed.)

## Work

1. Lock the locale list (this table) + the media-sourcing approach (open decision).
2. Source + verify media (per the constraint above): real video IDs confirmed via
   oEmbed title/author; unconfirmed -> `needsReview`.
3. Extend `lib/genre-families.ts` with the new families + colors.
4. Expand `prisma/seed.ts` to the full catalog; re-seed local, then prod.
5. QA: markers + legend + filters + drawers render for all; exercise the
   dead-embed fallback once (§10); spot-check a sample of embeds play.

## Acceptance

- ~20 locales, each with genre/era + attribution and >=1 verified-playable item
  (or an honest `needsReview` placeholder where unverifiable).
- Legend, filters, and markers scale cleanly to the full catalog (colors readable).
- Verify gate green; fallback exercised once in QA.

## Open decision (poll)

How to source the ~17 new recordings' real video IDs - see the chat poll.

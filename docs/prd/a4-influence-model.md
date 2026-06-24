# A4 - InfluenceLink model + curation

Status: DEFINED (2026-06-24). Parent: [`aurora-redesign.md`](aurora-redesign.md).
Pulls the v2-deferred `InfluenceLink` into v1 (now that S6 gave us 17 locales).
Data + migration only; A5 renders the arcs + the panel's "Connected sounds" list.

## Model

A directed musical-influence connection between two locales:

```prisma
model InfluenceLink {
  id           String   @id @default(cuid())
  fromId       String
  toId         String
  from         Location @relation("from", fields: [fromId], references: [id], onDelete: Cascade)
  to           Location @relation("to", fields: [toId], references: [id], onDelete: Cascade)
  relationship String   // short curated note
  sortOrder    Int      @default(0)
  createdAt    DateTime @default(now())
  @@unique([fromId, toId])
}
```

Location gains `fromLinks` / `toLinks` back-relations. Arc color is derived at
render time from the `from` locale's primary family (A2), not stored.

## Curated links (honest, broadly-accepted musical connections)

Directed `from -> to`, with a short relationship note. These are well-documented
lineages/dialogues, framed as connections (not hard causal claims):

1. Bamako -> Havana - "West African rhythm carried across the Atlantic"
2. Bamako -> New Orleans - "Mande string music in the deep roots of the blues"
3. Havana -> New Orleans - "the Cuban habanera, the Spanish tinge in early jazz"
4. Seville -> Havana - "cantes de ida y vuelta, flamenco's round trip"
5. Lagos -> Salvador - "Yoruba rhythm and faith across the Atlantic"
6. Lisbon -> Mindelo - "two songs of saudade, fado and morna"
7. Kingston -> Lagos - "reggae and Afrobeat in pan-African dialogue"
8. Havana -> Kingston - "Cuban son in the roots of mento and ska"
9. Addis Ababa -> New Orleans - "Ethio-jazz answering American jazz"

## Work

- `prisma/schema.prisma`: add `InfluenceLink` + Location back-relations; migration.
- `prisma/seed.ts`: resolve slugs -> ids, `deleteMany` then create the 9 links
  (idempotent). Server/agent curation only (no public writes).
- `lib/influence.ts`: `getInfluenceLinks()` returning each link's `relationship`
  plus both endpoints' `{ slug, name, lat, lng, genre }` (genre -> color in A5).

## Acceptance

- Migration applies clean (local + prod via the build's `migrate deploy`).
- Seed creates the 9 links idempotently; a query returns them with both endpoints.
- Verify gate green. No UI change yet (A5 renders).

## Out of scope

- Rendering arcs + the Connected-sounds panel list (A5).

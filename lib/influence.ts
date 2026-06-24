import { prisma } from "@/lib/db";

/** A curated influence connection with both endpoints' map data (PRD a4). The
 *  arc color (A5) is derived from the `from` locale's primary genre. */
export type InfluenceLinkData = Awaited<
  ReturnType<typeof getInfluenceLinks>
>[number];

export async function getInfluenceLinks() {
  return prisma.influenceLink.findMany({
    orderBy: { sortOrder: "asc" },
    select: {
      id: true,
      relationship: true,
      from: { select: { slug: true, name: true, lat: true, lng: true, genre: true } },
      to: { select: { slug: true, name: true, lat: true, lng: true, genre: true } },
    },
  });
}

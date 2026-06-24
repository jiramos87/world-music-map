import { prisma } from "@/lib/db";

/** A locale plus its ordered media items, as rendered on the map + drawer. */
export type LocaleWithMedia = Awaited<
  ReturnType<typeof getLocations>
>[number];

export async function getLocations() {
  return prisma.location.findMany({
    orderBy: { sortOrder: "asc" },
    include: { media: { orderBy: { sortOrder: "asc" } } },
  });
}

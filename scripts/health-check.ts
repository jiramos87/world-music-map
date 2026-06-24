import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

/**
 * Curation sweep: ask YouTube's oEmbed endpoint whether each embedded video is
 * still available, and flip `needsReview` accordingly. This complements the
 * runtime `onError` fallback (components/youtube-embed.tsx): the sweep catches
 * deleted / private videos from the server's vantage point and surfaces them for
 * curation, while the runtime layer protects the actual viewer for cases oEmbed
 * can't see (embedding-disabled, region blocks). Agent-run, like the seed, so
 * the `needsReview` write stays server-side (WMM has no public writes).
 *
 * Run: `pnpm media:health-check`
 */

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

async function isAvailable(videoId: string): Promise<boolean> {
  const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  try {
    // 200 = embeddable; 401 (private) / 404 (deleted) = unavailable.
    const res = await fetch(url);
    return res.ok;
  } catch {
    // Network hiccup: don't flag on a transient failure.
    return true;
  }
}

async function main() {
  const items = await prisma.mediaItem.findMany({
    where: { provider: "YOUTUBE", providerId: { not: null } },
    include: { location: { select: { name: true } } },
  });

  let flagged = 0;
  let cleared = 0;

  for (const item of items) {
    const ok = await isAvailable(item.providerId as string);
    const needsReview = !ok;
    if (item.needsReview !== needsReview) {
      await prisma.mediaItem.update({
        where: { id: item.id },
        data: { needsReview },
      });
      if (needsReview) flagged++;
      else cleared++;
    }
    console.log(
      `  ${ok ? "ok  " : "DEAD"}  ${item.location.name} - ${item.title}`,
    );
  }

  console.log(
    `Health check done. ${items.length} checked, ${flagged} newly flagged, ${cleared} cleared.`,
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

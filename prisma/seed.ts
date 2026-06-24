import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../lib/generated/prisma/client";

/**
 * Skeleton seed: 3 marquee locales, each with one official-channel YouTube
 * embed. Honesty bar (PRD §4): embeds keep the license with the uploader; we
 * never frame them as "licensed music." Curation slices grow this to ~20.
 */

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

type SeedMedia = {
  title: string;
  providerId: string;
  attribution: string;
  license: string;
};

type SeedLocation = {
  slug: string;
  name: string;
  country: string;
  region: string | null;
  lat: number;
  lng: number;
  blurb: string;
  genre: string[];
  era: string[];
  media: SeedMedia[];
};

const locations: SeedLocation[] = [
  {
    slug: "bamako-mali",
    name: "Bamako, Mali",
    country: "Mali",
    region: "West Africa",
    lat: 12.6392,
    lng: -8.0029,
    blurb:
      "On the Niger River, where Songhai and Mande traditions meet the hypnotic guitar lines often called desert blues.",
    genre: ["Desert blues", "Mande"],
    era: ["Contemporary"],
    media: [
      {
        title: 'Ali Farka Touré & Toumani Diabaté — "Debe"',
        providerId: "ugVw8cSGNoE",
        attribution: "World Circuit (official YouTube)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "havana-cuba",
    name: "Havana, Cuba",
    country: "Cuba",
    region: "Caribbean",
    lat: 23.1136,
    lng: -82.3666,
    blurb:
      "Son cubano and bolero from the old city, carried back to the world by the Buena Vista Social Club sessions of the 1990s.",
    genre: ["Son cubano", "Afro-Cuban"],
    era: ["20th century"],
    media: [
      {
        title: 'Buena Vista Social Club — "Chan Chan"',
        providerId: "tGbRZ73NvlY",
        attribution: "World Circuit (official YouTube)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "lisbon-portugal",
    name: "Lisbon, Portugal",
    country: "Portugal",
    region: "Iberia",
    lat: 38.7223,
    lng: -9.1393,
    blurb:
      "Fado: the melancholic song of the Alfama and Mouraria quarters, carrying the weight of saudade.",
    genre: ["Fado"],
    era: ["Contemporary"],
    media: [
      {
        title: 'Mariza — "Quem Me Dera"',
        providerId: "-sze5rpbklM",
        attribution: "Mariza (official YouTube)",
        license: "YouTube Standard License",
      },
    ],
  },
];

async function main() {
  for (let i = 0; i < locations.length; i++) {
    const { media, ...data } = locations[i];
    const location = await prisma.location.upsert({
      where: { slug: data.slug },
      update: { ...data, sortOrder: i },
      create: { ...data, sortOrder: i },
    });

    // Replace media so re-seeding stays idempotent.
    await prisma.mediaItem.deleteMany({ where: { locationId: location.id } });
    await prisma.mediaItem.createMany({
      data: media.map((m, j) => ({
        locationId: location.id,
        type: "VIDEO" as const,
        provider: "YOUTUBE" as const,
        providerId: m.providerId,
        title: m.title,
        attribution: m.attribution,
        license: m.license,
        sortOrder: j,
      })),
    });
    console.log(`  ✓ ${data.name} (${media.length} item)`);
  }
}

main()
  .then(async () => {
    console.log("Seed complete.");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

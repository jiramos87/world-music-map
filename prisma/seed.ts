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
        title: 'Ali Farka Touré & Toumani Diabaté - "Debe"',
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
        title: 'Buena Vista Social Club - "Chan Chan"',
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
        title: 'Mariza - "Quem Me Dera"',
        providerId: "-sze5rpbklM",
        attribution: "Mariza (official YouTube)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "new-orleans-usa",
    name: "New Orleans, USA",
    country: "United States",
    region: "North America",
    lat: 29.9511,
    lng: -90.0715,
    blurb:
      "Birthplace of jazz, where brass bands, blues, and Creole tradition collided in Storyville and the second-line marching clubs.",
    genre: ["Jazz", "Dixieland"],
    era: ["Early 20th century"],
    media: [
      {
        title: 'Louis Armstrong - "When the Saints Go Marching In"',
        providerId: "USpYJB6rdRs",
        attribution: "Louis Armstrong (official artist channel)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "kingston-jamaica",
    name: "Kingston, Jamaica",
    country: "Jamaica",
    region: "Caribbean",
    lat: 18.0179,
    lng: -76.8099,
    blurb:
      "From Trench Town ska and rocksteady grew reggae, carrying Rastafari and resistance from the dancehall to the world.",
    genre: ["Reggae", "Ska"],
    era: ["20th century"],
    media: [
      {
        title: 'Bob Marley & The Wailers - "Redemption Song"',
        providerId: "yv5xonFSC4c",
        attribution: "Bob Marley (Vevo)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "rio-de-janeiro-brazil",
    name: "Rio de Janeiro, Brazil",
    country: "Brazil",
    region: "South America",
    lat: -22.9068,
    lng: -43.1729,
    blurb:
      "Samba was born on the hillside morros and in Mangueira, the pulse of Carnival and the malandro's lament.",
    genre: ["Samba", "Bossa nova"],
    era: ["20th century"],
    media: [
      {
        title: 'Cartola - "As Rosas Não Falam"',
        providerId: "pBWg7LGETL0",
        attribution: "Cartola (Vevo)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "buenos-aires-argentina",
    name: "Buenos Aires, Argentina",
    country: "Argentina",
    region: "South America",
    lat: -34.6037,
    lng: -58.3816,
    blurb:
      "Tango rose from the port barrios of the Rio de la Plata, the bandoneon breathing melancholy and swagger.",
    genre: ["Tango"],
    era: ["20th century"],
    media: [
      {
        title: 'Astor Piazzolla - "Libertango"',
        providerId: "yvtpT1ARF1o",
        attribution: "Carosello Records (official)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "lagos-nigeria",
    name: "Lagos, Nigeria",
    country: "Nigeria",
    region: "West Africa",
    lat: 6.5244,
    lng: 3.3792,
    blurb:
      "Fela Kuti forged Afrobeat here, fusing highlife, jazz, and funk into long, defiant grooves at the Shrine.",
    genre: ["Afrobeat", "Highlife"],
    era: ["20th century"],
    media: [
      {
        title: 'Fela Kuti - "Water No Get Enemy"',
        providerId: "3Jx2qcKd1-0",
        attribution: "Fela Kuti (official artist channel)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "dakar-senegal",
    name: "Dakar, Senegal",
    country: "Senegal",
    region: "West Africa",
    lat: 14.7167,
    lng: -17.4677,
    blurb:
      "Mbalax drives Senegalese dancefloors, the talking sabar drums under Wolof song, carried worldwide by Youssou N'Dour.",
    genre: ["Mbalax"],
    era: ["Contemporary"],
    media: [
      {
        title: "Youssou N'Dour & Neneh Cherry - \"7 Seconds\"",
        providerId: "wqCpjFMvz-k",
        attribution: "Youssou N'Dour / Neneh Cherry (Vevo)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "seville-spain",
    name: "Seville, Spain",
    country: "Spain",
    region: "Iberia",
    lat: 37.3886,
    lng: -5.9823,
    blurb:
      "Flamenco lives in the patios and penas of Triana, cante jondo and guitar wound tight with duende.",
    genre: ["Flamenco"],
    era: ["Contemporary"],
    media: [
      {
        title: 'Paco de Lucía - "Entre Dos Aguas"',
        providerId: "0vq3qZwaXrw",
        attribution: "Paco de Lucía (official artist channel)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "lahore-pakistan",
    name: "Lahore, Pakistan",
    country: "Pakistan",
    region: "South Asia",
    lat: 31.5204,
    lng: 74.3587,
    blurb:
      "Qawwali, the ecstatic Sufi devotional song of the shrines, raised to a global art by Nusrat Fateh Ali Khan.",
    genre: ["Qawwali", "Sufi"],
    era: ["20th century"],
    media: [
      {
        title: 'Nusrat Fateh Ali Khan - "Allah Hoo"',
        providerId: "AiA6YSq8sVQ",
        attribution: "Oriental Star Agencies (official)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "addis-ababa-ethiopia",
    name: "Addis Ababa, Ethiopia",
    country: "Ethiopia",
    region: "East Africa",
    lat: 9.025,
    lng: 38.7469,
    blurb:
      "Mulatu Astatke's Ethio-jazz wove Amharic pentatonic scales into Latin and jazz, the sound of the Swinging Addis years.",
    genre: ["Ethio-jazz"],
    era: ["20th century"],
    media: [
      {
        title: 'Mulatu Astatke - "Yègellé Tezeta"',
        providerId: "jXdVpT_aSJU",
        attribution: "Mulatu Astatke (official artist channel)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "mindelo-cape-verde",
    name: "Mindelo, Cape Verde",
    country: "Cape Verde",
    region: "Atlantic",
    lat: 16.8901,
    lng: -24.9804,
    blurb:
      "On Sao Vicente, morna distills Cape Verdean saudade, the longing that Cesária Évora carried barefoot to the world.",
    genre: ["Morna"],
    era: ["Contemporary"],
    media: [
      {
        title: 'Cesária Évora - "Sodade"',
        providerId: "ku_WZoTtT8Q",
        attribution: "Cesária Évora (Vevo)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "salvador-brazil",
    name: "Salvador, Brazil",
    country: "Brazil",
    region: "South America",
    lat: -12.9777,
    lng: -38.5016,
    blurb:
      "Capital of Afro-Brazilian culture, where samba, candomble rhythm, and Tropicalia met in Gilberto Gil's Bahia.",
    genre: ["MPB", "Tropicália"],
    era: ["20th century"],
    media: [
      {
        title: 'Gilberto Gil - "Aquele Abraço"',
        providerId: "HB8vbB5ILUU",
        attribution: "Gilberto Gil (YouTube)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "chennai-india",
    name: "Chennai, India",
    country: "India",
    region: "South Asia",
    lat: 13.0827,
    lng: 80.2707,
    blurb:
      "Heart of Carnatic music, the December kacheri season filling the sabhas with kriti and raga, voiced by M.S. Subbulakshmi.",
    genre: ["Carnatic"],
    era: ["20th century"],
    media: [
      {
        title: 'M.S. Subbulakshmi - "Kurai Onrum Illai"',
        providerId: "WbrLWbnRBlw",
        attribution: "Saregama Carnatic Classical (official)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "ubud-bali-indonesia",
    name: "Ubud, Bali",
    country: "Indonesia",
    region: "Southeast Asia",
    lat: -8.5069,
    lng: 115.2625,
    blurb:
      "Balinese gamelan gong kebyar shimmers with interlocking metallophones, bright and sudden, made for temple and dance.",
    genre: ["Gamelan"],
    era: ["Traditional"],
    media: [
      {
        title: 'Gamelan Gong Kebyar - "Oleg Tumulilingan"',
        providerId: "fjJx2v3Hcf0",
        attribution: "Nonesuch Explorer Series (official)",
        license: "YouTube Standard License",
      },
    ],
  },
  {
    slug: "cairo-egypt",
    name: "Cairo, Egypt",
    country: "Egypt",
    region: "North Africa",
    lat: 30.0444,
    lng: 31.2357,
    blurb:
      "The tarab capital, where Umm Kulthum's Thursday-night broadcasts could empty the streets across the Arab world.",
    genre: ["Tarab"],
    era: ["20th century"],
    media: [
      {
        title: 'Umm Kulthum - "Alf Leila wa Leila"',
        providerId: "TzeF7lTgb0Q",
        attribution: "Radio Martiko / Souma Records",
        license: "YouTube Standard License",
      },
    ],
  },
];

// Curated musical-influence connections (directed from -> to). Server/agent
// curation only; broadly-accepted lineages framed as connections (PRD a4).
const influenceLinks: { from: string; to: string; relationship: string }[] = [
  {
    from: "bamako-mali",
    to: "havana-cuba",
    relationship: "West African rhythm carried across the Atlantic",
  },
  {
    from: "bamako-mali",
    to: "new-orleans-usa",
    relationship: "Mande string music in the deep roots of the blues",
  },
  {
    from: "havana-cuba",
    to: "new-orleans-usa",
    relationship: "the Cuban habanera, the Spanish tinge in early jazz",
  },
  {
    from: "seville-spain",
    to: "havana-cuba",
    relationship: "cantes de ida y vuelta, flamenco's round trip",
  },
  {
    from: "lagos-nigeria",
    to: "salvador-brazil",
    relationship: "Yoruba rhythm and faith across the Atlantic",
  },
  {
    from: "lisbon-portugal",
    to: "mindelo-cape-verde",
    relationship: "two songs of saudade, fado and morna",
  },
  {
    from: "kingston-jamaica",
    to: "lagos-nigeria",
    relationship: "reggae and Afrobeat in pan-African dialogue",
  },
  {
    from: "havana-cuba",
    to: "kingston-jamaica",
    relationship: "Cuban son in the roots of mento and ska",
  },
  {
    from: "addis-ababa-ethiopia",
    to: "new-orleans-usa",
    relationship: "Ethio-jazz answering American jazz",
  },
];

async function main() {
  const idBySlug: Record<string, string> = {};
  for (let i = 0; i < locations.length; i++) {
    const { media, ...data } = locations[i];
    const location = await prisma.location.upsert({
      where: { slug: data.slug },
      update: { ...data, sortOrder: i },
      create: { ...data, sortOrder: i },
    });
    idBySlug[data.slug] = location.id;

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

  // Influence links (replace for idempotency).
  await prisma.influenceLink.deleteMany({});
  for (let i = 0; i < influenceLinks.length; i++) {
    const link = influenceLinks[i];
    const fromId = idBySlug[link.from];
    const toId = idBySlug[link.to];
    if (!fromId || !toId) {
      console.warn(`  ! skip link ${link.from} -> ${link.to} (missing locale)`);
      continue;
    }
    await prisma.influenceLink.create({
      data: { fromId, toId, relationship: link.relationship, sortOrder: i },
    });
  }
  console.log(`  ✓ ${influenceLinks.length} influence links`);
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

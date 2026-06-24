import type { LocaleWithMedia } from "@/lib/locations";

/**
 * Curated genre -> family -> color (PRD a2-genre-families). Families + colors are
 * from the Aurora design. A locale's marker is colored by its PRIMARY family (its
 * first genre); the legend lists the primary families present in the catalog.
 */

export type GenreFamily = {
  key: string;
  label: string;
  color: string;
};

const FAMILIES = {
  blues: { key: "blues", label: "Blues", color: "#38bdf8" },
  mande: { key: "mande", label: "Mande", color: "#34d399" },
  fado: { key: "fado", label: "Fado", color: "#a78bfa" },
  son: { key: "son", label: "Son", color: "#fb7185" },
  afroCuban: { key: "afroCuban", label: "Afro-Cuban", color: "#f59e0b" },
  jazz: { key: "jazz", label: "Jazz", color: "#22d3ee" },
  samba: { key: "samba", label: "Samba", color: "#f472b6" },
  tango: { key: "tango", label: "Tango", color: "#fbbf24" },
  afrobeat: { key: "afrobeat", label: "Afrobeat", color: "#fb923c" },
  reggae: { key: "reggae", label: "Reggae", color: "#84cc16" },
  mbalax: { key: "mbalax", label: "Mbalax", color: "#4ade80" },
  flamenco: { key: "flamenco", label: "Flamenco", color: "#f43f5e" },
  qawwali: { key: "qawwali", label: "Qawwali", color: "#c084fc" },
  morna: { key: "morna", label: "Morna", color: "#2dd4bf" },
  mpb: { key: "mpb", label: "MPB", color: "#facc15" },
  carnatic: { key: "carnatic", label: "Carnatic", color: "#e879f9" },
  gamelan: { key: "gamelan", label: "Gamelan", color: "#818cf8" },
  tarab: { key: "tarab", label: "Tarab", color: "#fcd34d" },
} satisfies Record<string, GenreFamily>;

const FALLBACK: GenreFamily = {
  key: "other",
  label: "Other",
  color: "#94a3b8",
};

// Genre string (case-insensitive) -> family key. Extend at curation time.
const GENRE_TO_FAMILY: Record<string, keyof typeof FAMILIES> = {
  "desert blues": "blues",
  blues: "blues",
  mande: "mande",
  fado: "fado",
  "son cubano": "son",
  son: "son",
  "afro-cuban": "afroCuban",
  jazz: "jazz",
  dixieland: "jazz",
  "ethio-jazz": "jazz",
  samba: "samba",
  "bossa nova": "samba",
  tango: "tango",
  afrobeat: "afrobeat",
  highlife: "afrobeat",
  reggae: "reggae",
  ska: "reggae",
  mbalax: "mbalax",
  flamenco: "flamenco",
  qawwali: "qawwali",
  sufi: "qawwali",
  morna: "morna",
  mpb: "mpb",
  "tropicália": "mpb",
  tropicalia: "mpb",
  carnatic: "carnatic",
  gamelan: "gamelan",
  tarab: "tarab",
};

export function familyForGenre(genre: string): GenreFamily {
  const key = GENRE_TO_FAMILY[genre.trim().toLowerCase()];
  return key ? FAMILIES[key] : FALLBACK;
}

/** Primary family for a locale = the family of its first genre. */
export function primaryFamily(genres: string[]): GenreFamily {
  return genres.length > 0 ? familyForGenre(genres[0]) : FALLBACK;
}

/** Distinct primary families present in the loaded catalog, in first-seen order. */
export function legendFamilies(locations: LocaleWithMedia[]): GenreFamily[] {
  const seen = new Map<string, GenreFamily>();
  for (const locale of locations) {
    const family = primaryFamily(locale.genre);
    if (!seen.has(family.key)) seen.set(family.key, family);
  }
  return [...seen.values()];
}

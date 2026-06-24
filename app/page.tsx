import { getLocations } from "@/lib/locations";
import { MapExperience } from "@/components/map-experience";

// Read fresh from the DB per request so agent-curated locales appear without a
// rebuild. The map is light and low-traffic; static prerender would bake in a
// snapshot of the catalog at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const locations = await getLocations();
  // Read the tile key server-side (regular env, not NEXT_PUBLIC_) and hand it to
  // the client map. It still reaches the browser to fetch tiles; MapTiler's
  // domain restriction is what protects it. Falls back to the keyless demo
  // style when unset. See PRD §5 (Map tiles).
  const mapTilerKey = process.env.MAPTILER_KEY ?? null;
  return <MapExperience locations={locations} mapTilerKey={mapTilerKey} />;
}

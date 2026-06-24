import { getLocations } from "@/lib/locations";
import { MapExperience } from "@/components/map-experience";

// Read fresh from the DB per request so agent-curated locales appear without a
// rebuild. The map is light and low-traffic; static prerender would bake in a
// snapshot of the catalog at build time.
export const dynamic = "force-dynamic";

export default async function Home() {
  const locations = await getLocations();
  return <MapExperience locations={locations} />;
}

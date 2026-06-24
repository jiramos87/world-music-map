"use client";

import { useState } from "react";
import type { LocaleWithMedia } from "@/lib/locations";
import { WorldMap } from "@/components/world-map";
import { LocaleDrawer } from "@/components/locale-drawer";

/** Holds the selected-locale state and stitches the map + drawer together. */
export function MapExperience({
  locations,
  mapTilerKey,
}: {
  locations: LocaleWithMedia[];
  mapTilerKey: string | null;
}) {
  const [selected, setSelected] = useState<LocaleWithMedia | null>(null);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <WorldMap
        locations={locations}
        onSelect={setSelected}
        mapTilerKey={mapTilerKey}
      />

      <header className="pointer-events-none absolute left-0 top-0 z-10 p-4 sm:p-6">
        <h1 className="text-lg font-semibold tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          World Music Map
        </h1>
        <p className="mt-1 max-w-xs text-xs text-white/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Click a marker to hear the place.
        </p>
      </header>

      <LocaleDrawer locale={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

"use client";

import { useCallback, useMemo, useState } from "react";
import type { LocaleWithMedia } from "@/lib/locations";
import { WorldMap } from "@/components/world-map";
import { LocaleDrawer } from "@/components/locale-drawer";
import { FilterBar } from "@/components/filter-bar";

/** Holds the selected-locale state and stitches the map + drawer together. */
export function MapExperience({
  locations,
  mapTilerKey,
}: {
  locations: LocaleWithMedia[];
  mapTilerKey: string | null;
}) {
  const [selected, setSelected] = useState<LocaleWithMedia | null>(null);
  const [activeGenres, setActiveGenres] = useState<Set<string>>(new Set());
  const [activeEras, setActiveEras] = useState<Set<string>>(new Set());

  // Facet values come straight from the loaded locales, so the bar tracks the
  // curated catalog without a hardcoded list.
  const { genres, eras } = useMemo(() => collectFacets(locations), [locations]);

  // A locale matches when it satisfies every active group (AND across groups,
  // OR within a group). No active facets -> everything matches.
  const matches = useCallback(
    (locale: LocaleWithMedia) => {
      const genreOk =
        activeGenres.size === 0 ||
        locale.genre.some((g) => activeGenres.has(g));
      const eraOk =
        activeEras.size === 0 || locale.era.some((e) => activeEras.has(e));
      return genreOk && eraOk;
    },
    [activeGenres, activeEras],
  );

  const hasActive = activeGenres.size > 0 || activeEras.size > 0;

  // Ids of locales the map should dim (the non-matching ones). Empty when no
  // filter is active, so every marker stays bright.
  const dimmedIds = useMemo(() => {
    if (!hasActive) return new Set<string>();
    return new Set(
      locations.filter((l) => !matches(l)).map((l) => l.id),
    );
  }, [locations, matches, hasActive]);

  const shownCount = locations.length - dimmedIds.size;

  return (
    <main className="fixed inset-0 overflow-hidden">
      <WorldMap
        locations={locations}
        onSelect={setSelected}
        mapTilerKey={mapTilerKey}
        dimmedIds={dimmedIds}
      />

      <header className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col p-4 sm:p-6">
        <h1 className="text-lg font-semibold tracking-tight drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          World Music Map
        </h1>
        <p className="mt-1 max-w-xs text-xs text-white/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          Click a marker to hear the place.
        </p>

        <FilterBar
          genres={genres}
          eras={eras}
          activeGenres={activeGenres}
          activeEras={activeEras}
          onToggleGenre={(g) => setActiveGenres((s) => toggle(s, g))}
          onToggleEra={(e) => setActiveEras((s) => toggle(s, e))}
          onClear={() => {
            setActiveGenres(new Set());
            setActiveEras(new Set());
          }}
          shownCount={shownCount}
          totalCount={locations.length}
        />
      </header>

      <LocaleDrawer locale={selected} onClose={() => setSelected(null)} />
    </main>
  );
}

/** Unique, sorted genre + era values across the loaded locales. */
function collectFacets(locations: LocaleWithMedia[]) {
  const genres = new Set<string>();
  const eras = new Set<string>();
  for (const locale of locations) {
    locale.genre.forEach((g) => genres.add(g));
    locale.era.forEach((e) => eras.add(e));
  }
  return { genres: [...genres].sort(), eras: [...eras].sort() };
}

/** Toggle a value in a set, returning a new set (immutable for React state). */
function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

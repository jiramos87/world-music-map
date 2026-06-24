"use client";

import { useCallback, useMemo, useState } from "react";
import type { LocaleWithMedia } from "@/lib/locations";
import { WorldMap } from "@/components/world-map";
import { LocaleDrawer } from "@/components/locale-drawer";
import { FilterBar } from "@/components/filter-bar";
import { GenreLegend } from "@/components/genre-legend";
import { legendFamilies } from "@/lib/genre-families";

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

  // Primary genre families present in the catalog, for the legend.
  const families = useMemo(() => legendFamilies(locations), [locations]);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <WorldMap
        locations={locations}
        onSelect={setSelected}
        mapTilerKey={mapTilerKey}
        dimmedIds={dimmedIds}
        selectedId={selected?.id ?? null}
      />

      {/* Aurora atmosphere over the (still visible) MapTiler basemap: a subtle
          tint, a bottom glow, and an edge vignette. Non-interactive. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(140% 120% at 60% 8%, rgba(16,24,43,0.5) 0%, rgba(10,14,26,0.3) 42%, rgba(6,7,13,0.55) 100%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 120%, rgba(103,232,249,0.10), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ boxShadow: "inset 0 0 240px 60px rgba(3,4,8,0.9)" }}
      />

      <header className="pointer-events-none absolute left-0 top-0 z-10 flex flex-col p-4 sm:p-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-[9px] shadow-[0_0_22px_rgba(103,232,249,0.5)]"
            style={{ background: "linear-gradient(135deg,#67e8f9,#7c8cf8)" }}
          >
            <span className="text-[17px] leading-none text-[#06121a]">♪</span>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold tracking-tight text-[#f3f6fc] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              World Music Map
            </h1>
            <p className="mt-1 max-w-xs text-xs text-white/70 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              Click a marker to hear the place
              {locations.length > 0
                ? ` · ${locations.length} sound${
                    locations.length === 1 ? "" : "s"
                  } mapped`
                : ""}
            </p>
          </div>
        </div>

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

      <GenreLegend families={families} />

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

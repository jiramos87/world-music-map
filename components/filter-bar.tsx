"use client";

/**
 * Compact facet bar over the map (PRD §3 filters). Genre + era chips toggle the
 * active facets; matching locales stay bright while the rest dim on the map.
 * Facet values are derived from the loaded locales, so the bar grows with the
 * catalog instead of hardcoding a list.
 */
export function FilterBar({
  genres,
  eras,
  activeGenres,
  activeEras,
  onToggleGenre,
  onToggleEra,
  onClear,
  shownCount,
  totalCount,
}: {
  genres: string[];
  eras: string[];
  activeGenres: Set<string>;
  activeEras: Set<string>;
  onToggleGenre: (value: string) => void;
  onToggleEra: (value: string) => void;
  onClear: () => void;
  shownCount: number;
  totalCount: number;
}) {
  const hasActive = activeGenres.size > 0 || activeEras.size > 0;

  if (genres.length === 0 && eras.length === 0) return null;

  return (
    <div className="pointer-events-auto mt-3 w-fit max-w-[min(90vw,40rem)] rounded-xl border border-white/10 bg-neutral-950/80 px-3 py-2.5 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {genres.length > 0 ? (
          <FacetGroup
            label="Genre"
            values={genres}
            active={activeGenres}
            onToggle={onToggleGenre}
          />
        ) : null}

        {genres.length > 0 && eras.length > 0 ? (
          <span aria-hidden className="h-4 w-px bg-white/10" />
        ) : null}

        {eras.length > 0 ? (
          <FacetGroup
            label="Era"
            values={eras}
            active={activeEras}
            onToggle={onToggleEra}
          />
        ) : null}

        {hasActive ? (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto rounded-full px-2 py-1 text-xs text-white/55 transition hover:text-white"
          >
            Clear
          </button>
        ) : null}
      </div>

      {hasActive ? (
        <p className="mt-2 text-[11px] text-white/50">
          Showing {shownCount} of {totalCount} places
        </p>
      ) : null}
    </div>
  );
}

function FacetGroup({
  label,
  values,
  active,
  onToggle,
}: {
  label: string;
  values: string[];
  active: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-white/40">
        {label}
      </span>
      {values.map((value) => {
        const isActive = active.has(value);
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onToggle(value)}
            className={`rounded-full border px-2.5 py-1 text-xs transition ${
              isActive
                ? "border-cyan-300 bg-cyan-300 font-medium text-neutral-950"
                : "border-white/15 bg-white/5 text-white/70 hover:border-white/30 hover:text-white"
            }`}
          >
            {value}
          </button>
        );
      })}
    </div>
  );
}

"use client";

/**
 * Compact facet bar over the map (PRD §3 filters), styled as the Aurora glass
 * panel (PRD a1-aurora-shell). Genre + era chips toggle the active facets;
 * matching locales stay bright while the rest dim on the map. Facet values are
 * derived from the loaded locales, so the bar grows with the catalog.
 */

const GENRE_ACCENT = "#67e8f9";
const ERA_ACCENT = "#7c8cf8";

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
    <div className="pointer-events-auto mt-4 w-fit max-w-[min(90vw,40rem)] rounded-[14px] border border-white/[0.09] bg-[rgba(13,17,28,0.66)] px-3.5 py-3 shadow-[0_18px_50px_rgba(0,0,0,0.5)] backdrop-blur-[18px]">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {genres.length > 0 ? (
          <FacetGroup
            label="Genre"
            accent={GENRE_ACCENT}
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
            accent={ERA_ACCENT}
            values={eras}
            active={activeEras}
            onToggle={onToggleEra}
          />
        ) : null}

        {hasActive ? (
          <button
            type="button"
            onClick={onClear}
            className="ml-auto rounded-full px-2 py-1 font-mono text-[11px] uppercase tracking-wide text-white/55 transition hover:text-white"
          >
            Reset
          </button>
        ) : null}
      </div>

      {hasActive ? (
        <p className="mt-2 font-mono text-[11px] text-white/50">
          Showing {shownCount} of {totalCount} places
        </p>
      ) : null}
    </div>
  );
}

function FacetGroup({
  label,
  accent,
  values,
  active,
  onToggle,
}: {
  label: string;
  accent: string;
  values: string[];
  active: Set<string>;
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span
        className="font-mono text-[10px] uppercase tracking-[0.14em]"
        style={{ color: accent }}
      >
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
            className="rounded-full border px-2.5 py-1 text-xs transition"
            style={
              isActive
                ? {
                    color: "#06121a",
                    background: accent,
                    borderColor: accent,
                    fontWeight: 500,
                    boxShadow: `0 0 16px ${accent}73`,
                  }
                : {
                    color: "rgba(255,255,255,0.7)",
                    background: "rgba(255,255,255,0.05)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }
            }
          >
            {value}
            {isActive ? " ✓" : ""}
          </button>
        );
      })}
    </div>
  );
}

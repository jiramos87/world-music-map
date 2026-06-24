import type { GenreFamily } from "@/lib/genre-families";

/**
 * Decodes the marker colors (PRD a2-genre-families). Lists the genre families
 * present in the catalog. Desktop affordance: hidden on mobile to keep the small
 * screen clean (markers stay colored regardless).
 */
export function GenreLegend({ families }: { families: GenreFamily[] }) {
  if (families.length === 0) return null;

  return (
    <aside className="pointer-events-none absolute bottom-6 left-4 z-10 hidden sm:left-6 sm:block">
      <div className="rounded-[14px] border border-white/[0.08] bg-[rgba(13,17,28,0.6)] px-3.5 py-3 backdrop-blur-[18px]">
        <div className="mb-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/50">
          Genre families
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {families.map((family) => (
            <div key={family.key} className="flex items-center gap-2">
              <span
                className="h-2 w-2 flex-none rounded-full"
                style={{
                  background: family.color,
                  boxShadow: `0 0 8px ${family.color}`,
                }}
              />
              <span className="text-[11.5px] text-white/80">
                {family.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

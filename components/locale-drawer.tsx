"use client";

import { useState, type ReactNode } from "react";
import type { LocaleWithMedia } from "@/lib/locations";
import { YouTubeEmbed } from "@/components/youtube-embed";
import { familyForGenre, primaryFamily } from "@/lib/genre-families";
import { formatCoord } from "@/lib/locale-format";
import { useFavorite } from "@/lib/use-favorite";

/** A musical-influence connection from the selected locale to another, as shown
 *  in the drawer's "Connected sounds" list (PRD a5). */
export type Connection = {
  slug: string;
  name: string;
  relationship: string;
  outgoing: boolean; // true = this place influenced the other
  color: string; // the connected locale's family color
};

/** The Aurora detail panel (PRD a3-detail-panel + a5 connected sounds). Slides
 *  in over the map; keeps the S4 dead-embed fallback. Favorite is
 *  localStorage-only; share copies a ?place=<slug> deep link. */
export function LocaleDrawer({
  locale,
  connections,
  onSelectSlug,
  onClose,
}: {
  locale: LocaleWithMedia | null;
  connections: Connection[];
  onSelectSlug: (slug: string) => void;
  onClose: () => void;
}) {
  const open = locale !== null;
  const [favorite, toggleFavorite] = useFavorite(locale?.slug ?? "");
  const [copied, setCopied] = useState(false);

  function share(slug: string) {
    const url = `${window.location.origin}/?place=${slug}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        // Clipboard blocked; nothing to persist.
      });
  }

  const accent = locale ? primaryFamily(locale.genre).color : "#67e8f9";
  const cityName = locale ? locale.name.split(",")[0].trim() : "";

  return (
    <>
      {open ? (
        <div
          className="absolute inset-0 z-20 bg-black/40 sm:hidden"
          onClick={onClose}
          aria-hidden
        />
      ) : null}

      <aside
        aria-hidden={!open}
        className={`absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto border-l border-white/[0.09] p-7 shadow-[-30px_0_80px_rgba(0,0,0,0.5)] backdrop-blur-[22px] transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          background:
            "linear-gradient(180deg, rgba(11,14,23,0.86), rgba(8,10,17,0.95))",
        }}
      >
        {locale ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div
                  className="font-mono text-[10px] uppercase tracking-[0.16em]"
                  style={{ color: accent }}
                >
                  Now exploring
                </div>
                <h2 className="font-display mt-1.5 text-3xl font-semibold leading-none tracking-tight text-[#f4f7fd]">
                  {cityName}
                </h2>
                <p className="mt-1.5 font-mono text-xs text-white/55">
                  {locale.country} · {formatCoord(locale.lat, locale.lng)}
                </p>
              </div>
              <div className="flex flex-none gap-2">
                <button
                  type="button"
                  onClick={toggleFavorite}
                  aria-label={favorite ? "Remove favorite" : "Add favorite"}
                  aria-pressed={favorite}
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.06] text-lg leading-none transition hover:bg-white/10"
                  style={{ color: favorite ? "#fb7185" : "rgba(255,255,255,0.55)" }}
                >
                  <span aria-hidden>{favorite ? "♥" : "♡"}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-white/10 bg-white/[0.06] text-white/60 transition hover:bg-white/10 hover:text-white"
                >
                  <span aria-hidden className="text-lg leading-none">
                    ✕
                  </span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {locale.media.length === 0 ? (
                <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/55">
                  No playable media yet for this locale.
                </p>
              ) : (
                locale.media.map((item) => (
                  <figure key={item.id} className="flex flex-col gap-2">
                    {item.provider === "YOUTUBE" && item.providerId ? (
                      <YouTubeEmbed
                        videoId={item.providerId}
                        title={item.title}
                      />
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/55">
                        Unsupported media
                      </div>
                    )}
                    <figcaption className="text-xs leading-relaxed text-white/60">
                      <span className="mr-1.5 font-mono text-[9px] uppercase tracking-wide text-white/40">
                        {item.type}
                      </span>
                      <span className="text-white/85">{item.title}</span>
                      {" · "}
                      {item.attribution}
                      {item.license ? ` · ${item.license}` : ""}
                    </figcaption>
                  </figure>
                ))
              )}
            </div>

            <p className="text-[15px] leading-relaxed text-[#c5cdda]">
              {highlightGenre(locale.blurb, locale.genre[0], accent)}
            </p>

            {locale.genre.length > 0 || locale.era.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {locale.genre.map((genre) => {
                  const color = familyForGenre(genre).color;
                  return (
                    <span
                      key={genre}
                      className="rounded-full px-2.5 py-1 text-xs"
                      style={{
                        color,
                        background: `${color}1f`,
                        border: `1px solid ${color}4d`,
                      }}
                    >
                      {genre}
                    </span>
                  );
                })}
                {locale.era.map((era) => (
                  <span
                    key={era}
                    className="rounded-full border border-white/[0.12] bg-white/[0.06] px-2.5 py-1 text-xs text-white/70"
                  >
                    {era}
                  </span>
                ))}
              </div>
            ) : null}

            {connections.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">
                  Connected sounds
                </div>
                <div className="flex flex-col gap-1.5">
                  {connections.map((c) => (
                    <button
                      key={`${c.outgoing ? "o" : "i"}-${c.slug}`}
                      type="button"
                      onClick={() => onSelectSlug(c.slug)}
                      className="flex w-full items-start gap-2.5 rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-left transition hover:bg-white/[0.07]"
                    >
                      <span
                        aria-hidden
                        className="mt-1 h-2 w-2 flex-none rounded-full"
                        style={{
                          background: c.color,
                          boxShadow: `0 0 8px ${c.color}`,
                        }}
                      />
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 text-sm text-white/90">
                          <span
                            aria-hidden
                            className="font-mono text-[11px] text-white/40"
                          >
                            {c.outgoing ? "→" : "←"}
                          </span>
                          {c.name.split(",")[0].trim()}
                        </span>
                        <span className="mt-0.5 block text-xs leading-snug text-white/55">
                          {c.relationship}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-auto flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => share(locale.slug)}
                className="flex h-11 flex-1 items-center justify-center gap-2 rounded-[11px] border border-white/[0.12] bg-white/[0.06] text-sm text-white/85 transition hover:bg-white/10"
              >
                <span aria-hidden>⤴</span>
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}

/** Highlight the first occurrence of the locale's primary genre in its blurb. */
function highlightGenre(
  blurb: string,
  term: string | undefined,
  color: string,
): ReactNode {
  if (!term) return blurb;
  const idx = blurb.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return blurb;
  return (
    <>
      {blurb.slice(0, idx)}
      <span style={{ color }}>{blurb.slice(idx, idx + term.length)}</span>
      {blurb.slice(idx + term.length)}
    </>
  );
}

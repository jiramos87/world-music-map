"use client";

import type { LocaleWithMedia } from "@/lib/locations";

/** Slides in over the map (map stays visible). Skeleton: blurb + facets +
 *  YouTube embeds with always-visible attribution. */
export function LocaleDrawer({
  locale,
  onClose,
}: {
  locale: LocaleWithMedia | null;
  onClose: () => void;
}) {
  const open = locale !== null;

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
        className={`absolute right-0 top-0 z-30 flex h-full w-full max-w-md flex-col gap-4 overflow-y-auto border-l border-white/10 bg-neutral-950/95 p-5 backdrop-blur transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {locale ? (
          <>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">
                  {locale.name}
                </h2>
                <p className="mt-0.5 text-sm text-white/55">{locale.country}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="rounded-md p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <span aria-hidden className="text-lg leading-none">
                  ✕
                </span>
              </button>
            </div>

            <p className="text-sm leading-relaxed text-white/80">
              {locale.blurb}
            </p>

            {locale.genre.length > 0 || locale.era.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {[...locale.genre, ...locale.era].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 text-xs text-white/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="flex flex-col gap-5">
              {locale.media.length === 0 ? (
                <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/55">
                  No playable media yet for this locale.
                </p>
              ) : (
                locale.media.map((item) => (
                  <figure key={item.id} className="flex flex-col gap-2">
                    {item.provider === "YOUTUBE" && item.providerId ? (
                      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                        <iframe
                          className="h-full w-full"
                          src={`https://www.youtube-nocookie.com/embed/${item.providerId}`}
                          title={item.title}
                          loading="lazy"
                          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <div className="flex aspect-video w-full items-center justify-center rounded-lg border border-white/10 bg-white/5 text-sm text-white/55">
                        Unsupported media
                      </div>
                    )}
                    <figcaption className="text-xs leading-relaxed text-white/60">
                      <span className="text-white/85">{item.title}</span>
                      {" · "}
                      {item.attribution}
                      {item.license ? ` · ${item.license}` : ""}
                    </figcaption>
                  </figure>
                ))
              )}
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}

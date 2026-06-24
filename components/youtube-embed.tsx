"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi } from "@/lib/youtube-api";

/**
 * A YouTube embed that degrades instead of showing a broken iframe. It renders
 * through the IFrame Player API so we can catch `onError` (deleted, private, or
 * embedding-disabled / region-blocked, exactly as the viewer sees it) and swap
 * in a fallback card. See PRD §3 (dead-embed) / §4 (no dead embeds).
 *
 * The player is mounted into a manually-created child node, never a React-owned
 * element, so YouTube replacing it with an iframe can't clash with React.
 */
export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    setFailed(false);
    const target = document.createElement("div");
    target.className = "h-full w-full";
    host.appendChild(target);

    let player: { destroy: () => void } | null = null;
    let cancelled = false;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled) return;
        player = new YT.Player(target, {
          videoId,
          host: "https://www.youtube-nocookie.com",
          playerVars: { rel: 0, modestbranding: 1 },
          // Any error code (2/5 bad request, 100 gone, 101/150 embed disabled)
          // means this embed won't play here. Fall back rather than show it.
          events: { onError: () => setFailed(true) },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      try {
        player?.destroy();
      } catch {
        // player may already be detached; nothing to clean up.
      }
      host.replaceChildren();
    };
  }, [videoId]);

  return (
    <>
      <div
        className={`aspect-video w-full overflow-hidden rounded-lg bg-black ${
          failed ? "hidden" : ""
        }`}
      >
        <div ref={hostRef} className="h-full w-full" />
      </div>
      {failed ? <FallbackCard videoId={videoId} title={title} /> : null}
    </>
  );
}

function FallbackCard({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 p-4 text-center">
      <p className="text-sm text-white/70">
        This recording is temporarily unavailable.
      </p>
      <a
        href={`https://www.youtube.com/watch?v=${videoId}`}
        target="_blank"
        rel="noreferrer"
        className="text-xs text-cyan-300 underline-offset-2 hover:underline"
        title={`Watch "${title}" on YouTube`}
      >
        Watch on YouTube
      </a>
    </div>
  );
}

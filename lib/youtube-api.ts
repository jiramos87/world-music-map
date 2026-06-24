/**
 * Loads the YouTube IFrame Player API once and hands back the `YT` namespace.
 * We need the Player API (not a plain iframe) because a plain embed gives no
 * failure signal: YouTube's "unavailable" page loads fine and is cross-origin,
 * so the only reliable in-browser signal is the player's `onError`. See PRD §3
 * (dead-embed) / §4 (no dead embeds).
 */

type YTPlayer = { destroy: () => void };
type YTPlayerEvent = { data: number; target: YTPlayer };

type YTPlayerOptions = {
  videoId: string;
  host?: string;
  playerVars?: Record<string, string | number>;
  events?: {
    onReady?: (event: YTPlayerEvent) => void;
    onError?: (event: YTPlayerEvent) => void;
  };
};

export type YTNamespace = {
  Player: new (element: HTMLElement, options: YTPlayerOptions) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let apiPromise: Promise<YTNamespace> | null = null;

export function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("YouTube API unavailable on the server"));
  }
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<YTNamespace>((resolve) => {
    // The API calls this single global hook once the script is ready. Chain any
    // existing handler so we never stomp another loader.
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(window.YT as YTNamespace);
    };
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });

  return apiPromise;
}

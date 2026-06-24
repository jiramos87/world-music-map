# S4 - Dead-embed fallback

Status: BUILT (2026-06-24). Satisfies v1 PRD §3 (dead-embed handling) and §4
(no dead embeds ever). Slice row in [`../build-plan.md`](../build-plan.md).

## Problem

A curated YouTube video can go away after it ships: deleted, made private,
region-blocked, or embedding disabled by the owner. A plain `<iframe>` gives no
failure signal (YouTube's "unavailable" page loads fine and is cross-origin), so
without handling, the viewer just sees a broken embed. The honesty bar (§4) is
"never a raw broken iframe."

## Locked decisions (grilled)

- **Detection = runtime + server sweep** (chosen over sweep-only / runtime-only).
  - **Runtime (viewer-facing):** render through the YouTube IFrame Player API and
    listen for `onError`. Any error code (2/5 bad request, 100 gone, 101/150
    embedding disabled) swaps the player for a fallback card. This is the only
    layer that reflects what the *actual viewer* can play (catches region blocks
    and embedding-disabled, which a server can't see).
  - **Curation (server-side):** an oEmbed health-check script flags `needsReview`
    on videos that are gone from the server's vantage point. Complements runtime;
    surfaces dead items for curation without filtering the live view.
- **`needsReview` is written server-side only.** WMM has no public writes, so a
  viewer's playback error never writes to the DB. The flag is set by the sweep
  (agent-run, like the seed), never a client POST.
- **Fallback chain:** unplayable -> "temporarily unavailable" card -> archive.org
  alternate *if present* -> `needsReview`. Archive alternates are sourced in S5,
  so today the card offers a "Watch on YouTube" link (many embedding-disabled
  videos still play on youtube.com), which is the honest interim of the chain.
- **Privacy preserved:** the Player API runs with `host: youtube-nocookie.com`.
- **No render filter on `needsReview` in v1:** the page still renders flagged
  items; the runtime layer cards them for the viewer. Keeps `getLocations`
  unchanged; revisit in S6 curation if needed.

## Shape

- `lib/youtube-api.ts` - load the IFrame Player API once (memoized promise),
  chaining the single `onYouTubeIframeAPIReady` global so loaders don't stomp.
- `components/youtube-embed.tsx` - client embed: mounts the player into a
  manually-created child (never a React-owned node, so YouTube replacing it with
  an iframe can't clash with React), `onError` -> fallback card, destroys the
  player on unmount.
- `components/locale-drawer.tsx` - render `YouTubeEmbed` instead of the raw
  iframe.
- `scripts/health-check.ts` (`pnpm media:health-check`) - oEmbed sweep -> set
  `needsReview`.

## Acceptance

- A working video still plays in the drawer. (regression)
- A video that errors shows the fallback card with a working "Watch on YouTube"
  link, never a broken iframe.
- `pnpm media:health-check` runs clean against the catalog and flips
  `needsReview` only when oEmbed reports a video gone.
- Verify gate green; no console errors.

## Deferred

- archive.org alternates as the actual fallback media (S5).
- Scheduling the sweep (nightly) and a `needsReview` curation list/clear
  workflow (S6).

# Aurora redesign - overview / index

Status: DEFINED (2026-06-24). Source: the "World Music Map Concepts" design
bundle, concept 01 "Aurora" (chosen; closest to the current look). Retro-PRD'd
from the design, sliced for mechanical implementation.

This is the parent doc. Each slice below becomes its own `docs/prd/aN-*.md` when
it starts (A1 is written). Sequencing relative to the existing backlog:

```
A1 -> A2 -> A3 -> A4 -> A5  (do before S5)  ->  S5 archive.org  ->  A6 mini-player  ->  S6 catalog -> S7 polish
```

A1-A5 are the visual + influence redesign and need no audio. A6 (the persistent
mini-player) is gated on S5 because it needs a controllable, clean audio source
(archive.org CC/PD), not a hidden YouTube player.

## Locked decisions (grilled)

- **Basemap = keep MapTiler + Aurora overlay.** We do NOT replace the tiles with
  the design's stylized SVG dotted-world. We layer Aurora's atmosphere (gradient,
  glow, vignette), genre-colored glowing markers, and the arcs overlay on top of
  the real MapTiler dark basemap. Preserves S2, real geography, pan/zoom, mobile.
- **Influence links = pull the full `InfluenceLink` model into v1** (was deferred
  to v2). Drives both the map arcs and the panel's "Connected sounds" list.
- **Mini-player = gate on S5 archive.org audio.** Build the custom transport
  against clean HTML5 CC/PD audio; YouTube stays the in-panel video. No ToS gray
  area.
- **Packaging = ordered slices** (this set), each independently verifiable.

## Honesty / feasibility notes (carry into every slice)

- The design's subtitle "20 sounds mapped" must render the **real** catalog count,
  not a hardcoded 20. We have 3 locales today; Aurora is drawn for the ~20-locale
  catalog (S6), so arcs/legend/queue only fill in at catalog scale.
- The player waveform in the design is a **decorative animated EQ**, not real
  audio analysis. Build it as a CSS flourish, not a real visualizer. Do not imply
  it reflects the audio.
- Favorites (heart) and any per-user state are **localStorage-only** (WMM has no
  auth and no public writes). Default: ship favorites as local-only, or defer.
- The design is a fixed 1920x1080 desktop frame with no mobile layout. We are
  mobile-first; responsive behavior is ours to derive per slice.
- Accent: the design uses cyan `#67e8f9` + violet `#7c8cf8`. Our current WMM
  marker accent is `#22d3ee`. Default: adopt Aurora's `#67e8f9`/`#7c8cf8` for WMM
  chrome (WMM is its own product); `#22d3ee` survives as the "Jazz" family color.

## Design tokens (extracted from the bundle)

- **Type:** Space Grotesk (display / headings), IBM Plex Mono (eyebrows, labels,
  coordinates, timecodes), IBM Plex Sans (body). Via `next/font/google`. Replaces
  Geist for WMM.
- **Atmosphere (over the map):**
  - backdrop `radial-gradient(140% 120% at 60% 8%, #10182b 0%, #0a0e1a 42%, #06070d 100%)`
  - bottom glow `radial-gradient(120% 80% at 50% 120%, rgba(103,232,249,.10), transparent 60%)`
  - vignette `box-shadow: inset 0 0 240px 60px rgba(3,4,8,.9)`
- **Glass card:** `background:rgba(13,17,28,.66); backdrop-filter:blur(18px); border:1px solid rgba(255,255,255,.09); border-radius:14px; box-shadow:0 18px 50px rgba(0,0,0,.5)`
- **Genre-family colors:** Blues `#38bdf8`, Mande `#34d399`, Fado `#a78bfa`, Son
  `#fb7185`, Afro-Cuban `#f59e0b`, Jazz `#22d3ee`, Samba `#f472b6`, Tango
  `#fbbf24`, Highlife `#34d399`, Reggae `#84cc16`. (Curated map - see A2.)
- **Selected genre chip:** filled family/accent color, text `#06121a`, `box-shadow:0 0 16px rgba(103,232,249,.45)`, trailing "checkmark".
- **Mono labels:** IBM Plex Mono 10px, letter-spacing .14em; GENRE `#67e8f9`, ERA `#7c8cf8`.
- **Glow marker:** family-colored halo (low opacity) + inner dot with white stroke
  + `drop-shadow(0 0 6px <color>)`; animated pulse ring; selected enlarges + shows
  a Space Grotesk name label.
- **Influence arc:** quadratic curve between two lng/lat (control point lifted ~20%
  of span + 36px), colored by source family, dashed + `arcdash` animation, optional
  traveling pulse dot.
- **Keyframes:** `pulsering` (marker), `arcdash` (arc dash), `eqbar` (waveform),
  `spin`, `floaty`, `shimmer`.

## Slices

| # | Slice | Goal | Key acceptance | Depends on / gate |
|---|---|---|---|---|
| A1 | **Aurora shell + type** | The frame reads as Aurora | Fonts (Space Grotesk / IBM Plex Mono+Sans) applied; atmosphere gradient + glow + vignette over MapTiler; logo mark; filter panel restyled to the Aurora glass card (mono GENRE/ERA labels, check + glow on selected, Reset); subtitle shows the real count. No data changes. | None. Ship first. See [`a1-aurora-shell.md`](a1-aurora-shell.md). |
| A2 | **Genre families: colors + markers + legend** | Markers carry meaning | Curated genre->family->color map; markers colored by family with glow + pulse + selected label; genre-family legend card (bottom-left). Filter dimming (S3) still works. | A1 (tokens). Data: the color map (curation). |
| A3 | **Detail panel upgrade** | The drawer matches Aurora | NOW EXPLORING eyebrow + coordinates + larger name; cover-art treatment wrapping `YouTubeEmbed` (keeps the S4 dead-embed fallback) with duration label; inline blurb highlight; favorite (localStorage) + share (copy link); "Play place" CTA; a Connected-sounds slot (filled by A5). | A1. Slot for A5. |
| A4 | **InfluenceLink model + curation** | Influence data exists | `InfluenceLink` (from/to Location, relationship note, derived family color) + migration + curated links on marquee places + seed. Server/agent curation only. | Prisma schema + migration. Reopens the v2 model. |
| A5 | **Influence arcs + Connected sounds** | Aurora's signature | Animated curved arcs drawn on a map overlay synced to MapLibre pan/zoom (project lng/lat via `map.project` on move/zoom); panel Connected-sounds list rendered from A4 data. | A4 (data) + A2 (colors) + A3 (panel slot). Hardest render. |
| A6 | **Persistent mini-player** | Global now-playing | Bottom glass player: cover, title + place/genre, transport (prev/play/next), scrubber with timecodes + draggable thumb, decorative EQ waveform; global now-playing state + prev/next queue across the catalog. | **Gated on S5** (archive.org CC/PD audio as the controllable source). |

## Out of scope / deferred

- The other four concepts (Spectrum, Atlas, Vinyl, Flux) - reference only.
- "Surprise me" / random (a Spectrum feature), search-by-genre sidebar (Spectrum).
- Real audio waveform analysis (the design's is decorative).

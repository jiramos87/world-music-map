# A5 - Influence arcs + Connected sounds

Status: SHIPPED (2026-06-25, local). Parent: [`aurora-redesign.md`](aurora-redesign.md).
Renders the A4 `InfluenceLink` data: animated arcs on a MapLibre-synced overlay,
plus a "Connected sounds" list in the detail panel. Depends on A4 (links) + A2
(family colors) + A3 (panel).

## Behavior

- **Arcs.** Each of the curated links draws as a curved arc between its two
  locales, colored by the `from` locale's primary genre family (A2). A faint base
  line shows the full connection; a short bright "comet" dash travels along it to
  signal direction + give the map life. Arcs stay pinned to their endpoints as the
  map pans/zooms.
- **Selection spotlight.** With a locale open, the arcs that touch it brighten and
  the rest recede, so the map echoes the panel's Connected-sounds list. No
  selection -> every arc sits at its resting opacity.
- **Connected sounds (panel).** When the open locale has links, the drawer lists
  them under a "Connected sounds" heading: a family-colored dot, a direction cue
  (-> outgoing = this place influenced the other; <- incoming), the connected
  city, and the curated relationship note. Clicking an entry opens that locale
  (and re-spotlights its arcs). No links -> the section is omitted.

## Implementation

- `lib/influence.ts`: add `id` to both endpoints' select (so the map matches arcs
  against the selected locale id).
- `app/page.tsx`: fetch `getInfluenceLinks()` alongside locations; pass down.
- `components/world-map.tsx`: an absolutely-positioned `<svg>` overlay above the
  basemap. Arc DOM is built imperatively (like the markers) and re-projected on
  every map `render` event via `map.project(lng,lat)` -> a quadratic-bezier path,
  bowed toward the top. Two paths per link (base line + comet). Comet travel is a
  pure-CSS `stroke-dashoffset` animation over a `pathLength="100"`-normalized path,
  so it works regardless of the arc's on-screen length. A `selectedId` effect
  toggles `wmm-arc--active` / `wmm-arc--muted`.
- `components/map-experience.tsx`: derive the selected locale's `Connection[]`
  (slug, name, relationship, outgoing, family color) + a `selectBySlug` handler.
- `components/locale-drawer.tsx`: the Connected-sounds list in the A3 slot.
- `app/globals.css`: arc base/comet styles, travel keyframe, active/muted states,
  and a `prefers-reduced-motion` fallback (steady glowing line, no travel).

## Acceptance

- 9 arcs render with projected geometry + a traveling comet; 0 console errors.
- Arcs re-project on pan/zoom (stay attached to their endpoints).
- Open a locale -> its links list under "Connected sounds" with correct direction;
  its arcs spotlight, the rest mute. Clicking a connection opens that locale.
- `prefers-reduced-motion`: no travel animation; arcs read as steady lines.
- Verify gate green (check-types + lint + build).

## Out of scope

- Persistent mini-player (A6, gated on S5 audio).
- Filtering arcs by the genre/era facets (arcs stay visible regardless of filter).

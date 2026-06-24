# A1 - Aurora shell + type

Status: DEFINED (2026-06-24). Parent: [`aurora-redesign.md`](aurora-redesign.md).
First Aurora slice. No data or schema changes; pure presentation. Ships on its own.

## Goal

The frame reads as Aurora at a glance: the Aurora type system, the atmospheric
backdrop over the existing MapTiler map, the logo mark, and the filter bar
restyled into the Aurora glass panel. Everything functional from S2/S3/S4 keeps
working (map, markers, filter dimming, drawer, dead-embed fallback).

## Behavior

1. **Type system.** Load via `next/font/google` and wire to Tailwind v4 theme:
   - Space Grotesk -> display / headings (`--font-display`).
   - IBM Plex Sans -> body default (`--font-sans`).
   - IBM Plex Mono -> labels, eyebrows, coordinates, timecodes (`--font-mono`).
   Replaces Geist for WMM. Apply on `<body>` and via utility classes.
2. **Atmosphere over the map.** Add non-interactive layers above the MapTiler
   canvas, below the UI (`pointer-events:none`):
   - backdrop tint `radial-gradient(140% 120% at 60% 8%, #10182b 0%, #0a0e1a 42%, #06070d 100%)` at low opacity so the basemap still reads,
   - bottom glow `radial-gradient(120% 80% at 50% 120%, rgba(103,232,249,.10), transparent 60%)`,
   - vignette `box-shadow: inset 0 0 240px 60px rgba(3,4,8,.9)`.
   Keep them subtle: the real map must remain visible (do not flatten it into the
   illustration - that was the rejected option).
3. **Logo mark + title.** Replace the plain title with: a 32px gradient rounded
   tile (`linear-gradient(135deg,#67e8f9,#7c8cf8)`, glow) holding a music glyph,
   beside "World Music Map" (Space Grotesk 23px) and a subtitle
   "Click a marker to hear the place SEP {count} sounds mapped" where `{count}` is
   the **real** number of locales (`locations.length`), not 20. (Use a middot, no
   em-dash.)
4. **Filter panel restyle (S3 FilterBar -> Aurora glass).** Same behavior as S3
   (toggle chips, dim non-matching markers, count, clear), restyled:
   - wrap in the glass card token,
   - GENRE label in IBM Plex Mono `#67e8f9`, ERA label in IBM Plex Mono `#7c8cf8`,
   - selected chip: filled accent, text `#06121a`, glow, trailing checkmark,
   - rename "Clear" -> "Reset" (cosmetic).
   Keep `aria-pressed`, keyboard operability, and the dim logic untouched.

## Files (expected)

- `app/layout.tsx` / `app/globals.css` - fonts + Tailwind theme vars + keyframes
  (`pulsering`, `arcdash`, `eqbar` can land here now for later slices, or defer).
- `components/map-experience.tsx` - atmosphere layers + logo/title + real count.
- `components/filter-bar.tsx` - Aurora glass restyle.
- `components/world-map.tsx` - unchanged (markers recolored in A2).

## Acceptance

- App renders with Space Grotesk headings + IBM Plex body/mono; no Geist.
- The MapTiler basemap is still clearly visible under a subtle Aurora wash (not
  flattened).
- Title shows the logo mark and a subtitle with the real locale count.
- Filter chips look like the Aurora panel; toggling still dims non-matching
  markers, the count + Reset still work, `aria-pressed` intact.
- Mobile: title + filter panel stack and stay legible (derive; design is desktop).
- Verify gate green; zero console errors.

## Notes

- No new dependencies beyond `next/font/google` entries.
- Marker recolor, legend, arcs, panel upgrade, and player are later slices - A1
  only changes chrome + type + the filter panel skin.

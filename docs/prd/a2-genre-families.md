# A2 - Genre families: colors + markers + legend

Status: DEFINED (2026-06-24). Parent: [`aurora-redesign.md`](aurora-redesign.md).
Depends on A1. One curated input (the genre -> family -> color map); no schema
change.

## Goal

Markers carry meaning: each locale's marker is colored by its primary genre
family, with the Aurora glow + pulse ring; the selected marker enlarges and shows
its name label; a genre-family legend card (bottom-left) decodes the colors. The
S3 filter dimming keeps working.

## Curated mapping (locked)

Genre -> family -> color (families + colors from the Aurora bundle):

| family | color | genres mapped |
|---|---|---|
| Blues | `#38bdf8` | Desert blues, Blues |
| Mande | `#34d399` | Mande |
| Fado | `#a78bfa` | Fado |
| Son | `#fb7185` | Son cubano, Son |
| Afro-Cuban | `#f59e0b` | Afro-Cuban |
| Jazz | `#22d3ee` | Jazz |
| Samba | `#f472b6` | Samba |
| Tango | `#fbbf24` | Tango |
| Highlife | `#34d399` | Highlife |
| Reggae | `#84cc16` | Reggae |

- A locale's **primary family = its first genre** (`genre[0]`). That single color
  paints the marker (the design assigns one family per place).
- Unmapped genres fall back to a neutral `#94a3b8` "Other" so nothing breaks as
  the catalog grows; new genres get added to the map at curation time.
- The legend lists only the **primary families present in the loaded catalog**
  (derived), so every legend color maps to at least one visible marker. Grows with
  the catalog. (Today: Blues / Son / Fado for Bamako / Havana / Lisbon.)

## Behavior

- **Markers** (`components/world-map.tsx`): set a per-marker `--marker-color` to the
  primary family color; the dot uses it for fill + glow. A pulse ring (`pulsering`
  keyframe) animates behind each. The selected marker (new `selectedId` prop)
  enlarges and reveals a Space Grotesk name label beside it.
- **Legend** (`components/genre-legend.tsx`): a glass card, bottom-left, "GENRE
  FAMILIES" mono label + a 2-col grid of color dot + family name. Shown on sm+
  (hidden on mobile to keep the small screen clean; markers stay colored).
- **Filter dimming (S3) unchanged**: dimmed markers keep their family color, just
  faded/shrunk; selected wins over dimmed.

## Files (expected)

- `lib/genre-families.ts` - the map + `primaryFamily()`, `familyForGenre()`,
  `legendFamilies()`.
- `app/globals.css` - marker restyle (`var(--marker-color)`, glow, `::before`
  pulse ring, label, `--selected`), `pulsering` keyframe.
- `components/world-map.tsx` - color + label markers; `selectedId` prop + effect.
- `components/genre-legend.tsx` - the legend card (new).
- `components/map-experience.tsx` - pass `selectedId` + legend families; render the
  legend.

## Acceptance

- Each marker is colored by its primary family (Bamako blue, Havana pink/red,
  Lisbon violet today); all have the glow + pulse ring.
- Selecting a marker enlarges it and shows its name label; deselect reverts.
- The legend lists exactly the families present, color dots matching the markers.
- S3 filter dimming still works (dimmed markers keep their color, faded).
- Mobile: markers colored, legend hidden, no clutter; verify gate green; zero
  console errors.

## Out of scope

- Influence arcs + the "influence arc" legend row (A5).
- Recoloring the drawer's genre chips by family (A3).

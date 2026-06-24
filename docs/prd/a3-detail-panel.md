# A3 - Detail panel upgrade

Status: DEFINED (2026-06-24). Parent: [`aurora-redesign.md`](aurora-redesign.md).
Depends on A1 + A2. Restyles the drawer (`components/locale-drawer.tsx`) to the
Aurora detail panel. Keeps the S4 dead-embed fallback intact.

## Behavior

- **Panel:** Aurora glass (gradient `rgba(11,14,23,.86) -> rgba(8,10,17,.95)`,
  blur(22px), left border, deep shadow).
- **Header:** "NOW EXPLORING" mono cyan eyebrow; place name in Space Grotesk
  (larger); a `Country · 12.6°N, 8.0°W` line (coordinates derived from lat/lng).
  Top-right: a favorite (heart) toggle + the close (x) button.
- **Media:** the existing `YouTubeEmbed` (so the S4 fallback survives) framed in the
  Aurora media block (rounded, bordered). Caption gains a small mono media-type tag
  (VIDEO / AUDIO from `MediaItem.type`).
- **Blurb:** inline highlight of the locale's primary genre term where it appears,
  in that genre family's color.
- **Chips:** genre chips tinted by their family color; era chips stay neutral.
- **Favorite:** a heart toggle persisted in **localStorage** (`wmm:favorites`, a
  set of slugs). No auth, no DB write, no SSR access (hydrate in an effect).
- **Share:** copies a deep link `?place=<slug>` to the clipboard with brief
  "Copied" feedback. `MapExperience` reads `?place=<slug>` on mount and opens that
  locale, so the shared link actually works.
- **Connected sounds:** a code slot is left where A5 will render the influence
  list. A3 renders nothing there (no influence data exists until A4/A5) - no empty
  header.

## Honesty calls (locked)

- **No fabricated duration.** The design shows "video · 3:42"; we have no duration
  field, so we show only the real media type (VIDEO/AUDIO), never a made-up time.
- **"Play place" CTA deferred to A6.** Its real target is the persistent
  mini-player, which is gated on S5. Rather than ship a button with no job, A3
  omits it; the in-panel embed is the play affordance for now. The footer carries
  Share.
- **Favorites are local-only** and **URL state is read on mount only** (no
  continuous URL<->state sync; that stays deferred as in S3).

## Files (expected)

- `components/locale-drawer.tsx` - the restyle (bulk of A3).
- `lib/use-favorite.ts` - localStorage favorite hook (client).
- `lib/locale-format.ts` - `formatCoord(lat,lng)` (+ any small helpers).
- `components/map-experience.tsx` - read `?place=<slug>` on mount to open a locale.

## Acceptance

- Drawer matches Aurora: eyebrow, big name, country + coordinates, framed media,
  colored genre chips, glass panel.
- Favorite toggles and persists across reload (localStorage); heart reflects state.
- Share copies a `?place=<slug>` link; loading that link opens the locale.
- The S4 dead-embed fallback still triggers (broken id -> card, no broken iframe).
- Verify gate green; zero console errors; mobile drawer still full-width + usable.

## Out of scope

- Connected-sounds content + influence arcs (A4/A5).
- The persistent mini-player + "Play place" (A6).

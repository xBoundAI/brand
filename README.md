# xBound Brand

The xB mark and identity assets.

## The mark

xB is the hub. Six nodes on a hexagon, spokes routing inward, a soft orb behind, and the xB monogram at the convergence — the mark says what the product does: everything routes through one hub. Spokes use a carved-gap treatment so they route toward the center without ever crossing the letters.

## Logos (`/logos`)

| File | Use |
|------|-----|
| `xb_primary_dark.svg` | Primary mark. Ring + nodes + carved spokes + orb + white xB. Transparent. Use on dark surfaces, 24px and up. |
| `xb_clean_dark.svg` | Minimal version. Ring + nodes + orb + white xB, no inner spokes. Transparent. Calm contexts and the base for small sizes. |
| `xb_on_light.svg` | Light-mode sibling. White tile, dark-green network, white xB with a subtle dark edge so it holds on white. |
| `xb_on_surface_light.svg` | Light sibling with no tile, for sitting directly on a tinted or off-white surface. Dark-green network, solid `#0B3B35` xB. What the app header uses. |

SVG is the master format — scalable, use it wherever possible.

The tile is the difference between the two light files, and it decides the letters. `xb_on_light.svg` keeps white letters with a dark edge because they sit on its own white tile. Drop the tile onto a surface that already has a tint and that edge is under a pixel at header sizes, so `xb_on_surface_light.svg` promotes `#0B3B35` from edge to fill instead.

## Palette

| Token | Hex |
|-------|-----|
| Teal (network / orb) | `#2DD4BF` |
| Dark-mode letters | `#EAF4F2` |
| Light-mode network | `#0E5346` |
| Light-mode letter edge | `#0B3B35` |

Typeface: Space Grotesk 700 (matches the wordmark).

## Notes

- The 16px favicon should be a solid-tile version, not a glow — blooms disappear at tab scale.
- The gold "one thing that needs you" accent is a *state*, expressed in-app as animation, and is deliberately not part of the static mark. The identity stays calm.

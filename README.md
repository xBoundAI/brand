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

## Repo notes

**History on `main` was rewritten once, on 2026-07-31.** The standing rule in the app and site repos is to never rewrite pushed history, and it was overridden here deliberately rather than casually, so a future session seeing a forced update in the log does not read that rule as soft.

What happened: this repo was cloned fresh onto a machine with no global git identity, so git fell back to `username@hostname` and published a commit authored by a work email onto a public repo. An author field cannot be fixed forward, which is the one thing the rule has no answer for. The rewrite was safe here for reasons that are not true of the other repos: one branch, no tags, the commit was twenty minutes old, and there was exactly one working copy in existence.

Two things came out of it worth keeping:

- **The global git identity is now set**, which is where the bug actually lived. Every repo here had a per-repo identity, so only a brand new clone could hit it.
- **A force push unlinks a commit, it does not delete it.** The old SHA stayed fetchable from GitHub afterward. On a public repo, purging it takes a support request. Assume anything pushed is public permanently and fix the cause instead.

## Rasterizing

SVG is the master. If you export PNGs, install Space Grotesk first or the wordmark and the `xB` monogram both silently become Arial and the file looks almost right. The install recipe and the way to verify it (render the same string as Space Grotesk and as Arial, hash both, identical means the font is being ignored) is in the header of `banners/generate.cjs`. It is per machine, so a second machine or a cloud session needs it too.

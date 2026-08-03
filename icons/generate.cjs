/**
 * Canonical icon generator for every xBound surface.
 *
 * Moved here from xbound-site on 2026-08-03. It lived in the site repo and the
 * app carried hand copies, which is a coupling nothing checks: the two tabs
 * simply stop matching and no build fails. One generator, one output directory,
 * and both consumers pull from it.
 *
 * Outputs into ./icons alongside this file. Consumers copy from there with their
 * own `npm run icons`, the same sibling-directory pattern the couplings audit
 * already uses to read ../xbound.
 *
 * ---------------------------------------------------------------------------
 * WHY IT LOOKS LIKE THIS. Four attempts, three of them wrong, all verified by
 * rendering candidates over the real tab greys (#35363A dark, #DEE1E6 light) and
 * looking at them rather than reasoning about contrast:
 *
 *   v1  One 1080x1080 transparent PNG doing every job. The browser crushed
 *       1080px of detail into 16.
 *   v2  Right sizes, opaque BLACK tile. Pure black is not invisible against a
 *       #35363A tab strip, it is a hole, and it read as a UI chip in a box.
 *   v3  Transparent, adaptive on prefers-color-scheme. Both branches were muddy:
 *       near-white letters on dark read as "all teal", dark green on white read
 *       as bad. Making a low contrast mark adapt gives two mediocre results
 *       instead of one good one.
 *   v4  Solid TEAL tile, monogram knocked out. Strong on both.
 *
 *     transparent white   good on dark      INVISIBLE on light
 *     transparent teal    ok on dark        weak on light
 *     TEAL TILE           strong on dark    strong on light
 *
 * Teal is mid-value and high chroma, so it stands off a dark strip and a light
 * one equally and reads as an object rather than as absence. It needs no
 * prefers-color-scheme variant, so there is one artwork and one appearance
 * everywhere. At tab size the brand COLOUR is the recogniser, not the geometry.
 *
 * No nodes and no orb at favicon sizes. The README says the favicon wants a
 * solid tile and not a glow, and teal nodes on a teal tile would vanish anyway.
 * The whole mark lives on the touch icon at 180px, where there is room.
 * ---------------------------------------------------------------------------
 *
 * Type: the monogram is Space Grotesk 700. If it is not installed, sharp
 * silently substitutes Arial and the output looks almost right. Install recipe
 * and the way to verify it are in ../banners/generate.cjs.
 *
 * Run:  node icons/generate.cjs
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const FONT = 'Space Grotesk, Arial, sans-serif';
const TEAL = '#2DD4BF'; // brand accent, the recogniser
const INK = '#0B3B35'; // brand light-mode letter colour, knocked out of the tile
const DEEP = '#0E5346'; // brand light-mode network colour

/** Monogram knocked out of a solid tile. Every tab size uses this. */
function chip(px) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <rect x="0" y="0" width="100" height="100" fill="${TEAL}"/>
  <text x="50" y="52" font-family="${FONT}" font-weight="700" font-size="62"
        fill="${INK}" text-anchor="middle" dominant-baseline="central" letter-spacing="-3.5">xB</text>
</svg>
`;
}

/**
 * Touch icon. Full mark on the same teal ground, dark-green network so it does
 * not vanish into the tile. Opaque because it sits on a home screen at 180px,
 * where the whole mark resolves and iOS would composite a transparent one
 * unpredictably.
 */
function touchIcon(px) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="6 6 88 88">
  <rect x="6" y="6" width="88" height="88" fill="${TEAL}"/>
  <g fill="${DEEP}">
    <circle cx="50" cy="12" r="4.5"/><circle cx="83" cy="31" r="4.5"/><circle cx="83" cy="69" r="4.5"/>
    <circle cx="50" cy="88" r="4.5"/><circle cx="17" cy="69" r="4.5"/><circle cx="17" cy="31" r="4.5"/>
  </g>
  <path d="M50,12 L83,31 L83,69 L50,88 L17,69 L17,31 Z" fill="none" stroke="${DEEP}" stroke-width="1.6" stroke-opacity="0.55"/>
  <text x="50" y="51" font-family="${FONT}" font-weight="700" font-size="27"
        fill="${INK}" text-anchor="middle" dominant-baseline="central" letter-spacing="-1.5">xB</text>
</svg>
`;
}

const out = __dirname;
const tmp = path.join(out, '.tmp');
fs.mkdirSync(tmp, { recursive: true });

function render(name, svg, px) {
  const svgPath = path.join(tmp, `${name}.svg`);
  const pngPath = path.join(out, `${name}.png`);
  fs.writeFileSync(svgPath, svg, 'utf8');
  execFileSync('npx', ['--yes', 'sharp-cli', '-i', svgPath.replace(/\\/g, '/'), '-o', pngPath.replace(/\\/g, '/'), '-f', 'png'],
    { stdio: 'ignore', shell: true });
  console.log(`  icons/${name}.png  ${px}x${px}  ${fs.statSync(pngPath).size.toLocaleString()} bytes`);
}

console.log('xBound icon set:');
render('favicon-16', chip(16), 16);
render('favicon-32', chip(32), 32);
render('favicon-48', chip(48), 48);
render('apple-touch-icon', touchIcon(180), 180);
fs.writeFileSync(path.join(out, 'favicon.svg'), chip(100), 'utf8');
console.log('  icons/favicon.svg');
fs.rmSync(tmp, { recursive: true, force: true });

console.log('\nConsumers pull these with `npm run icons`:');
console.log('  C:\\dev\\xbound-site   ->  public/');
console.log('  C:\\dev\\xbound        ->  public/');

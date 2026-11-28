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

/**
 * v5, 2026-11-26: THE BRAND IS VIOLET AND THIS FILE WAS STILL TEAL.
 *
 * Everything above is about which SHAPE and which GROUND, and all of it still
 * holds. This note is only about the hue, which moved underneath it.
 *
 * What had happened: the rebrand recoloured the two consumers' public/ files
 * with xbound-site/scripts/recolor-brand-assets.mjs, a hue rotation over the
 * synced rasters. Nobody came back here. So the canonical generator still
 * emitted teal, and `node icons/generate.cjs && npm run icons` — the command
 * this file's own footer tells you to run — would have reverted both tabs and
 * both home screens to the old brand. Nothing would have failed. Verified by
 * md5: icons/apple-touch-icon.png here does not match either public/ copy.
 *
 * That is the same class of bug the file was moved here to kill. One generator
 * stops the two consumers drifting from each other; it does nothing about the
 * generator drifting from both, and a recolour pass downstream of a sync is
 * exactly that. The fix is for violet to be the SOURCE, so the recolour script
 * is not in the icon path at all any more.
 *
 * The teal values are kept below, commented, because the v1-v4 reasoning above
 * refers to them by name and is unreadable without them.
 *
 *   TEAL  #2DD4BF   INK #0B3B35   DARK #071a1e   LIGHT #EAF4F2
 *
 * Violet values are the app's own, not new ones: #ab9ff2 and #0B0914 are in
 * src/domains.ts as papertape's accent and ground, and #6d4bc4 is the light
 * mode --violet token in the site's index.css.
 */
const ACCENT = '#ab9ff2'; // brand accent, the recogniser
const INK = '#0B0914'; // knocked out of the accent tile
const DARK = '#0B0914'; // --bg, the board's background token
const LIGHT = '#EFEDF6'; // the monogram colour the header uses on dark

/** Monogram knocked out of a solid tile. Every tab size uses this. */
function chip(px) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 100 100">
  <rect x="0" y="0" width="100" height="100" fill="${ACCENT}"/>
  <text x="50" y="52" font-family="${FONT}" font-weight="700" font-size="62"
        fill="${INK}" text-anchor="middle" dominant-baseline="central" letter-spacing="-3.5">xB</text>
</svg>
`;
}

/**
 * Touch icon. DARK ground, teal network, light monogram: the same mark the app
 * itself draws in its header, not the tab chip scaled up.
 *
 * WHY THIS DIVERGED FROM THE TAB ICON, 2026-08-09. The v4 note above is sound
 * and it is about ONE surface: a 16px favicon on a browser tab strip, where a
 * solid teal tile beats every transparent option on both light and dark. That
 * test was never run against an iOS home screen, which is a different problem
 * entirely: 180px instead of 16, the user's wallpaper instead of a grey strip,
 * and neighbours like ClickUp, Notion and Slack that are mostly white grounds. A
 * flat mint square among them reads as an unfinished placeholder rather than as
 * a brand, which is what CPU-0 reacted to.
 *
 * So the two surfaces now answer their own questions. The tab keeps the teal
 * tile. The home screen gets the real mark, and it matches what somebody sees
 * the moment they open the app, which is the only continuity that actually
 * matters at this size.
 *
 * Colours are the app's own dark-mode values, not new ones: #071a1e is the board
 * background token, #2DD4BF the network, #EAF4F2 the monogram. Geometry is
 * copied from the header mark so the two cannot drift into being cousins.
 *
 * Still opaque. iOS composites a transparent touch icon unpredictably and will
 * happily put it on white.
 */
function touchIcon(px) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="6 6 88 88">
  <rect x="6" y="6" width="88" height="88" fill="${DARK}"/>
  <g fill="${ACCENT}">
    <circle cx="50" cy="12" r="4.5"/><circle cx="83" cy="31" r="4.5"/><circle cx="83" cy="69" r="4.5"/>
    <circle cx="50" cy="88" r="4.5"/><circle cx="17" cy="69" r="4.5"/><circle cx="17" cy="31" r="4.5"/>
  </g>
  <path d="M50,12 L83,31 L83,69 L50,88 L17,69 L17,31 Z" fill="none" stroke="${ACCENT}" stroke-width="1.4" stroke-opacity="0.4"/>
  <g fill="none" stroke="${ACCENT}" stroke-width="2" stroke-opacity="0.7">
    <line x1="50" y1="12" x2="50" y2="34"/><line x1="83" y1="31" x2="64" y2="42"/>
    <line x1="83" y1="69" x2="64" y2="58"/><line x1="50" y1="88" x2="50" y2="66"/>
    <line x1="17" y1="69" x2="36" y2="58"/><line x1="17" y1="31" x2="36" y2="42"/>
  </g>
  <text x="50" y="51" font-family="${FONT}" font-weight="700" font-size="27"
        fill="${LIGHT}" text-anchor="middle" dominant-baseline="central" letter-spacing="-1.5">xB</text>
</svg>
`;
}

/* ===========================================================================
 * PRODUCT MARKS, 2026-11-26. CPU-0: "each logo has same color maybe just
 * different logo."
 *
 * runsheet, papertape and orrery are three routes of one app, and on a
 * home screen they were three identical xB tiles in three different folders,
 * renamed by hand. One colourway, one chassis, and the glyph is the only thing
 * that differs: stack, punch, orbit.
 *
 * RENAMED 2026-11-27. The third surface was `watchfloor` when these marks were
 * cut. CPU-0 chose `orrery`, reversing his own 11-22 call. THE ARTWORK DID NOT
 * CHANGE: he picked the ring glyph on looks alone on 11-26, and a ring with a
 * body on it is an orbit, so the mark reads better under the new name than the
 * old one. Only the name and the glyph key moved (`watch` -> `orbit`). The full
 * reasoning, including the two candidates he turned down, is in
 * xbound/docs/strategy/cornerstone/cpu4-naming.md under DECIDED 2026-11-27.
 * THE COLOUR IS UNCHANGED and is not ours to move: his 11-21 decision that each
 * surface lights in its own colour stands until he says otherwise.
 *
 * CHASSIS. Six nodes in a ring, no hexagon frame and no spokes. The frame and
 * spokes are four layers where every neighbouring app icon has one, and they
 * turn to mush below about 48px. CPU-0 picked this over the framed and solid
 * versions by looking at all three in his own folders at 56px; the rejected
 * chassis are kept in alternates/ rather than deleted.
 *
 * FOUR LOCKUPS, because one artwork cannot do every surface. This is the same
 * lesson as the v1 note above, arrived at again from the other end:
 *
 *   primary   accent ring on DARK. 48px and up. Home screen, app, docs.
 *   inverse   same artwork, accent ground. Dark backgrounds, and the swap for
 *             a folder of black tiles where a near-black icon disappears.
 *   knockout  accent ground, NO ring, standard glyph. The colour chip: a
 *             sticker, an avatar, a light page, anywhere the tile has to be
 *             the thing you recognise before you read anything.
 *   micro     the same knockout geometry with the glyph REDRAWN heavy, for
 *             32px and down. Not a separate idea, the small-size form of it.
 *
 * knockout needs no maskable variant. Dropping the ring puts every glyph
 * inside 110px of centre, and Android's safe zone is a circle of radius
 * 204.8px, so nothing can clip. Only primary has to be pulled in.
 *
 * micro is a redraw and not a scale-down, and the reason is measured: rendered
 * at 16px and blown up nearest-neighbour, the ring version loses all three
 * glyphs and the six nodes become ambiguous single pixels, so the three
 * products become the same picture. At the same 16px micro still reads as
 * three bars, a holed band and a ring with a dot. Opacity gradation is dropped
 * (a 26% bar is gone by 20px), strokes thicken, and papertape goes from four
 * holes to three.
 *
 * This is the same finding as "no nodes and no orb at favicon sizes" above.
 * That line was already in this file and in xbound-site/index.html, and it was
 * rediscovered the slow way rather than read. Recording it twice on purpose:
 * the rule is about the node ring at small sizes, not about teal.
 * ======================================================================== */
const P = { C: 256, NODE_R: 192, R: 23 };
const nodeAt = (k, r) => {
  const a = ((-90 + 60 * k) * Math.PI) / 180;
  const f = (n) => Math.round((P.C + r * Math[n === 'x' ? 'cos' : 'sin'](a)) * 100) / 100;
  return [f('x'), f('y')];
};
const nodeRing = (ink, op) =>
  [0, 1, 2, 3, 4, 5]
    .map((k) => {
      const [x, y] = nodeAt(k, P.NODE_R);
      return `  <circle cx="${x}" cy="${y}" r="${P.R}" fill="${ink}" opacity="${op}"/>`;
    })
    .join('\n');

/** Full-size glyphs. ink draws, v is the ground showing through a hole. */
const GLYPH = {
  // Left-aligned so it reads as a list. The block is nudged right because with
  // bars this unequal the optical centre sits well left of the bounding box.
  stack: (ink) =>
    [[196, '1'], [147, '.5'], [98, '.26']]
      .map(([w, o], i) =>
        `  <rect x="168" y="${176 + i * 61}" width="${w}" height="38" rx="19" fill="${ink}" opacity="${o}"/>`)
      .join('\n'),
  // A thin band reads as tape. A tall one reads as a masked password field.
  punch: (ink, v) =>
    `  <rect x="140" y="214" width="232" height="84" rx="12" fill="${ink}"/>\n` +
    [183, 229, 275, 321].map((x) => `  <circle cx="${x}" cy="256" r="18" fill="${v}"/>`).join('\n'),
  // A body on a ring, which is what an orrery is. Marker off the vertical axis
  // because at 12 o'clock it stacked under the top node and the three circles
  // merged into one blob.
  orbit: (ink) =>
    `  <circle cx="256" cy="256" r="78" fill="none" stroke="${ink}" stroke-width="30" opacity=".42"/>\n` +
    `  <circle cx="306" cy="196" r="30" fill="${ink}"/>`,
};

/** Micro glyphs. Heavier, fewer parts, no opacity gradation. */
const MICRO = {
  stack: (ink) =>
    [280, 210, 140]
      .map((w, i) => `  <rect x="116" y="${150 + i * 72}" width="${w}" height="56" rx="28" fill="${ink}"/>`)
      .join('\n'),
  punch: (ink, v) =>
    `  <rect x="86" y="196" width="340" height="120" rx="16" fill="${ink}"/>\n` +
    [166, 256, 346].map((x) => `  <circle cx="${x}" cy="256" r="32" fill="${v}"/>`).join('\n'),
  orbit: (ink) =>
    `  <circle cx="240" cy="272" r="116" fill="none" stroke="${ink}" stroke-width="58"/>\n` +
    `  <circle cx="352" cy="150" r="62" fill="${ink}"/>`,
};

/**
 * scale 0.9 is the maskable variant: Android's safe zone is a centre circle of
 * radius 40% of the width (204.8px here) and at full size the nodes reach
 * 215px, so a circular mask would clip them.
 */
function productMark(glyph, lockup, px, scale = 1) {
  let bg, art;
  if (lockup === 'inverse') {
    bg = ACCENT;
    art = `${nodeRing(INK, '.8')}\n${GLYPH[glyph](INK, ACCENT)}`;
  } else if (lockup === 'knockout') {
    bg = ACCENT;
    art = `  <g transform="translate(256 256) scale(1.02) translate(-256 -256)">\n${GLYPH[glyph](INK, ACCENT)}\n  </g>`;
  } else if (lockup === 'micro') {
    bg = ACCENT;
    art = MICRO[glyph](INK, ACCENT);
  } else {
    bg = DARK;
    art = `${nodeRing(ACCENT, '.92')}\n${GLYPH[glyph](ACCENT, DARK)}`;
  }
  const body = scale === 1
    ? art
    : `  <g transform="translate(256 256) scale(${scale}) translate(-256 -256)">\n${art}\n  </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
${body}
</svg>
`;
}

/**
 * The chassis CPU-0 did not pick, kept as SVG only so a later decision has
 * something to look at instead of being re-derived. framed is the mark as it
 * was before this pass; solid is framed on an accent ground; knockout is the
 * glyph alone, which is what micro grew out of.
 */
function altMark(glyph, chassis) {
  const hex = (ink, op) => [0, 1, 2, 3, 4, 5]
    .map((k) => {
      const [x1, y1] = nodeAt(k, 150), [x2, y2] = nodeAt((k + 1) % 6, 150);
      return `  <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="12" stroke-linecap="round" opacity="${op}"/>`;
    }).join('\n');
  const smallNodes = (ink, op) => [0, 1, 2, 3, 4, 5]
    .map((k) => { const [x, y] = nodeAt(k, 150); return `  <circle cx="${x}" cy="${y}" r="26" fill="${ink}" opacity="${op}"/>`; })
    .join('\n');
  const inv = chassis !== 'framed';
  const bg = inv ? ACCENT : DARK;
  const ink = inv ? INK : ACCENT;
  const g = `  <g transform="translate(256 256) scale(.74) translate(-256 -256)">\n${GLYPH[glyph](ink, bg)}\n  </g>`;
  const frame = chassis === 'knockout' ? '' : `${hex(ink, inv ? '.3' : '.42')}\n${smallNodes(ink, inv ? '.72' : '1')}\n`;
  const body = chassis === 'knockout'
    ? `  <g transform="translate(256 256) scale(1.02) translate(-256 -256)">\n${GLYPH[glyph](ink, bg)}\n  </g>`
    : `${frame}${g}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${bg}"/>
${body}
</svg>
`;
}

const PRODUCTS = [
  { name: 'runsheet', glyph: 'stack' },
  { name: 'papertape', glyph: 'punch' },
  { name: 'orrery', glyph: 'orbit' },
];

const out = __dirname;
const tmp = path.join(out, '.tmp');
fs.mkdirSync(tmp, { recursive: true });

function render(name, svg, px) {
  const svgPath = path.join(tmp, `${name}.svg`);
  const pngPath = path.join(out, `${name}.png`);
  fs.mkdirSync(path.dirname(svgPath), { recursive: true });
  fs.mkdirSync(path.dirname(pngPath), { recursive: true });
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

/* THE PRIMARY MARK AT USABLE SIZES, added 2026-11-27. Until CPU-0 asked for
 * "the actual xbound logo" there was no vector master and nothing larger than
 * the 180px touch icon, so anyone wanting the logo for a deck, a banner or a
 * print had to upscale a home-screen asset. That was a real gap and this is
 * the fix: same touchIcon() geometry, no new artwork, three more outputs.
 *
 * CAVEAT ON THE SVG: the "xB" is live <text>, not outlined paths, so it
 * reflows in any editor that does not have the font. Hand out the PNGs. */
fs.writeFileSync(path.join(out, 'xbound-mark.svg'), touchIcon(512), 'utf8');
console.log('  icons/xbound-mark.svg');
render('xbound-mark-512', touchIcon(512), 512);
render('xbound-mark-1024', touchIcon(1024), 1024);

console.log('\nProduct marks:');
const writeSvg = (rel, markup) => {
  const p = path.join(out, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, markup, 'utf8');
  console.log(`  icons/${rel}`);
};
for (const p of PRODUCTS) {
  writeSvg(`products/${p.name}.svg`, productMark(p.glyph, 'primary', 512));
  writeSvg(`products/${p.name}-inverse.svg`, productMark(p.glyph, 'inverse', 512));
  writeSvg(`products/${p.name}-knockout.svg`, productMark(p.glyph, 'knockout', 512));
  writeSvg(`products/${p.name}-micro.svg`, productMark(p.glyph, 'micro', 512));
  render(`products/${p.name}-180`, productMark(p.glyph, 'primary', 180), 180);
  render(`products/${p.name}-512`, productMark(p.glyph, 'primary', 512), 512);
  render(`products/${p.name}-512-maskable`, productMark(p.glyph, 'primary', 512, 0.9), 512);
  render(`products/${p.name}-inverse-180`, productMark(p.glyph, 'inverse', 180), 180);
  render(`products/${p.name}-inverse-512`, productMark(p.glyph, 'inverse', 512), 512);
  render(`products/${p.name}-knockout-180`, productMark(p.glyph, 'knockout', 180), 180);
  render(`products/${p.name}-knockout-512`, productMark(p.glyph, 'knockout', 512), 512);
  render(`products/${p.name}-micro-32`, productMark(p.glyph, 'micro', 32), 32);
  render(`products/${p.name}-micro-16`, productMark(p.glyph, 'micro', 16), 16);
}

console.log('\nRejected chassis, kept for reference (SVG only):');
for (const p of PRODUCTS) {
  for (const chassis of ['framed', 'solid']) {
    writeSvg(`alternates/${p.name}-${chassis}.svg`, altMark(p.glyph, chassis));
  }
}

fs.rmSync(tmp, { recursive: true, force: true });

console.log('\nConsumers pull the top-level five with `npm run icons`:');
console.log('  C:\\dev\\xbound-site   ->  public/');
console.log('  C:\\dev\\xbound        ->  public/');
console.log('\nproducts/ is NOT synced yet. runsheet, papertape and orrery are');
console.log('three routes of one SPA on one origin, so one index.html means one');
console.log('apple-touch-icon for all three. Serving a different icon per route is');
console.log('an app change, not an asset change. See PRODUCT MARKS above.');
console.log('\nCPU-2 is building that app change under ClickUp 868mygtte: one HTML');
console.log('entry per surface, three rewrites above the catch-all, and a manifest');
console.log('each on scope "/" so the in-app toggle stays inside the installed app.');
console.log('CPU-0 2026-11-27: the LOGIN fix lands first, the three tiles second.');

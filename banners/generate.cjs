/**
 * LinkedIn banner generator, 1584x396.
 *
 * Writes three standalone SVGs plus a static preview page. SVG is the master
 * format (see ../README.md), so these are the deliverable and the PNG is a
 * convenience.
 *
 * Type note that matters: the wordmark and the xB monogram are Space Grotesk
 * 700. That font is NOT installed on this machine, so anything that rasterizes
 * these locally (sharp, librsvg) will silently substitute Arial. This is the
 * same trap recorded in the app changelog for the header mark. Render in a
 * browser, or install the font, before exporting a PNG you intend to publish.
 *
 * LinkedIn crops: the profile avatar overlaps the lower left, so nothing that
 * has to survive sits left of x=420 or below y=200 on that side. The
 * constellation is deliberately the thing that lives there.
 */
const fs = require('fs');
const path = require('path');

const W = 1584, H = 396;

// Hand-seeded, not random. Clusters left, thinning toward the wordmark, so the
// network reads as routing toward one place rather than as decoration.
const NODES = [
  [78, 64], [152, 128], [122, 232], [196, 300], [74, 330], [236, 66], [300, 180], [268, 268],
  [352, 96], [404, 244], [470, 150], [356, 338], [520, 296], [560, 74], [614, 196], [678, 120],
  [700, 300], [772, 222], [826, 110], [880, 286], [938, 178], [1010, 96], [1046, 262], [1122, 190],
];

function constellation({ link, stroke, lineOp, dotOp, goldIndex }) {
  const out = [];
  for (let i = 0; i < NODES.length; i++) {
    for (let j = i + 1; j < NODES.length; j++) {
      const d = Math.hypot(NODES[i][0] - NODES[j][0], NODES[i][1] - NODES[j][1]);
      if (d >= link) continue;
      // Fade with distance from the left edge so the right side stays quiet
      // enough for type to sit on it.
      const op = (Math.max(0, 1 - NODES[i][0] / 1400) * lineOp).toFixed(3);
      out.push(`<line x1="${NODES[i][0]}" y1="${NODES[i][1]}" x2="${NODES[j][0]}" y2="${NODES[j][1]}" stroke="${stroke}" stroke-width="1" stroke-opacity="${op}"/>`);
    }
  }
  NODES.forEach((p, idx) => {
    const gold = idx === goldIndex;
    const op = gold ? 0.95 : Math.max(0.05, 1 - p[0] / 1500) * dotOp;
    const r = gold ? 6 : idx % 5 === 0 ? 4.5 : 3;
    if (gold) out.push(`<circle cx="${p[0]}" cy="${p[1]}" r="18" fill="#D4A44A" fill-opacity="0.14"/>`);
    out.push(`<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${gold ? '#D4A44A' : stroke}" fill-opacity="${Number(op).toFixed(3)}"/>`);
  });
  return out.join('\n    ');
}

/**
 * The xB mark, transplanted from logos/xb_primary_dark.svg.
 *
 * Nested as an inner <svg> with its own viewBox and its own defs, NOT as a
 * scaled <g>. The carved-gap treatment is a mask whose content is in user
 * space, so inside a scaled group it would resolve against the banner's
 * coordinate system and the gaps would land in the top-left corner instead of
 * on the letters. An inner <svg> establishes a new viewport, so 0..100 means
 * what the logo file means by it.
 */
function mark(id, x, y, size) {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 100 100" overflow="visible">
      <defs>
        <radialGradient id="orb-${id}" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2DD4BF" stop-opacity="0.5"/>
          <stop offset="72%" stop-color="#2DD4BF" stop-opacity="0.07"/>
          <stop offset="100%" stop-color="#2DD4BF" stop-opacity="0"/>
        </radialGradient>
        <mask id="ko-${id}" maskContentUnits="userSpaceOnUse">
          <rect x="0" y="0" width="100" height="100" fill="white"/>
          <text x="50" y="51" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="27"
                fill="black" stroke="black" stroke-width="5" text-anchor="middle" dominant-baseline="central" letter-spacing="-1.5">xB</text>
        </mask>
      </defs>
      <circle cx="50" cy="50" r="26" fill="url(#orb-${id})"/>
      <g fill="#2DD4BF">
        <circle cx="50" cy="12" r="4.5"/><circle cx="83" cy="31" r="4.5"/><circle cx="83" cy="69" r="4.5"/>
        <circle cx="50" cy="88" r="4.5"/><circle cx="17" cy="69" r="4.5"/><circle cx="17" cy="31" r="4.5"/>
      </g>
      <path d="M50,12 L83,31 L83,69 L50,88 L17,69 L17,31 Z" fill="none" stroke="#2DD4BF" stroke-width="1.4" stroke-opacity="0.4"/>
      <g fill="none" stroke="#2DD4BF" stroke-width="2" stroke-opacity="0.7" mask="url(#ko-${id})">
        <line x1="50" y1="12" x2="50" y2="50"/><line x1="83" y1="31" x2="50" y2="50"/><line x1="83" y1="69" x2="50" y2="50"/>
        <line x1="50" y1="88" x2="50" y2="50"/><line x1="17" y1="69" x2="50" y2="50"/><line x1="17" y1="31" x2="50" y2="50"/>
      </g>
      <text x="50" y="51" font-family="Space Grotesk, Arial, sans-serif" font-weight="700" font-size="27"
            fill="#EAF4F2" text-anchor="middle" dominant-baseline="central" letter-spacing="-1.5">xB</text>
    </svg>`;
}

function banner(v) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="xBound.ai. You bring the problem. We build the machine.">
  <defs>
    <linearGradient id="bg-${v.id}" x1="0" y1="0" x2="1" y2="1">
      ${v.bg.map((s) => `<stop offset="${s[0]}" stop-color="${s[1]}"/>`).join('\n      ')}
    </linearGradient>
    <radialGradient id="glow-${v.id}" cx="${v.glow.cx}" cy="${v.glow.cy}" r="${v.glow.r}">
      <stop offset="0%" stop-color="${v.glow.color}" stop-opacity="${v.glow.op}"/>
      <stop offset="100%" stop-color="${v.glow.color}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg-${v.id})"/>
  <rect width="${W}" height="${H}" fill="url(#glow-${v.id})"/>

  <g>
    ${constellation(v.net)}
  </g>

  ${mark(v.id, W - 64 - v.markSize, 44, v.markSize)}

  <text x="${W - 64}" y="212" text-anchor="end" font-family="Space Grotesk, Arial, sans-serif" font-weight="700"
        font-size="64" letter-spacing="-1.3" fill="#EAF4F2">xBound<tspan fill="#2DD4BF">.ai</tspan></text>
  <text x="${W - 64}" y="252" text-anchor="end" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="400"
        font-size="22" fill="#EAF4F2" fill-opacity="${v.tagOp}">You bring the problem. We build the machine.</text>
</svg>
`;
}

const VARIANTS = [
  {
    id: 'a',
    name: 'depth',
    title: 'A. Depth — navy into teal, the app’s own gradient',
    bg: [['0%', '#071A24'], ['42%', '#0A2A31'], ['72%', '#0C3B3B'], ['100%', '#0E4A45']],
    glow: { cx: '78%', cy: '38%', r: '62%', color: '#2DD4BF', op: 0.17 },
    net: { link: 150, stroke: '#2DD4BF', lineOp: 0.42, dotOp: 0.85, goldIndex: -1 },
    markSize: 78,
    tagOp: 0.72,
  },
  {
    id: 'b',
    name: 'calm',
    title: 'B. Calm — deep ink, network barely there, the mark carries it',
    bg: [['0%', '#05131A'], ['55%', '#071C22'], ['100%', '#082A2B']],
    glow: { cx: '84%', cy: '50%', r: '58%', color: '#2DD4BF', op: 0.11 },
    net: { link: 132, stroke: '#2DD4BF', lineOp: 0.22, dotOp: 0.5, goldIndex: -1 },
    markSize: 86,
    tagOp: 0.62,
  },
  {
    id: 'c',
    name: 'signal',
    title: 'C. Signal — one node lit gold, the thing that needs you',
    bg: [['0%', '#0A1F1C'], ['45%', '#0B2A28'], ['100%', '#0B3B35']],
    glow: { cx: '22%', cy: '55%', r: '58%', color: '#D4A44A', op: 0.1 },
    net: { link: 150, stroke: '#2DD4BF', lineOp: 0.34, dotOp: 0.7, goldIndex: 7 },
    markSize: 78,
    tagOp: 0.7,
  },
];

const outDir = __dirname;
const cards = [];
for (const v of VARIANTS) {
  const svg = banner(v);
  const file = `banner_${v.name}.svg`;
  fs.writeFileSync(path.join(outDir, file), svg, 'utf8');
  cards.push(`<div class="label">${v.title}</div>\n<div class="frame">${svg}</div>`);
  console.log(`wrote ${file}  ${svg.length} bytes`);
}

const preview = `<meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Inter:wght@400&display=swap" rel="stylesheet">
<style>
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#141414;padding:0 0 24px}
  .label{color:#8a8a8a;font:500 13px/1.4 Inter,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;padding:16px 0 8px 10px}
  .frame{width:1584px;height:396px;line-height:0}
  svg{display:block}
</style>
${cards.join('\n')}
`;
fs.writeFileSync(path.join(outDir, 'preview.html'), preview, 'utf8');
console.log('wrote preview.html');

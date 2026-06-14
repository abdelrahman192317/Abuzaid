// Placeholder asset pipeline for the Mo7ammed Abuzaid portfolio.
//
// Generates deterministic editorial-looking placeholder JPEGs + frame
// sequences with `sharp`, optional placeholder .mp4 videos with `ffmpeg`
// (only if it is on PATH), and a generated blur-map (tiny base64 LQIP)
// consumed by the MediaImage component.
//
// Everything here is throwaway: swap the files in /public for the real
// assets later (same names) and nothing in the app code needs to change.
//
//   npm run gen:assets

import sharp from "sharp";
import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const IMAGES = path.join(PUBLIC, "images");
const VIDEOS = path.join(PUBLIC, "videos");
const FRAMES = path.join(PUBLIC, "frames");
const DATA = path.join(ROOT, "src", "data");

// Muted, editorial duotone pairs [dark, light].
const PALETTES = [
  ["#26262a", "#7c7468"],
  ["#1d2320", "#69796a"],
  ["#281f1c", "#a98a6a"],
  ["#21262b", "#889098"],
  ["#2a2123", "#ad8a8a"],
  ["#201e18", "#988d5f"],
  ["#1b1f24", "#7d8a93"],
  ["#241c1f", "#8f7f86"],
];

// ---- deterministic RNG (mulberry32) ----------------------------------------
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ---- SVG still -------------------------------------------------------------
function stillSvg(w, h, seed, label) {
  const r = rng(seed);
  const [dark, light] = PALETTES[Math.floor(r() * PALETTES.length)];
  const angle = Math.floor(r() * 360);
  const cx = Math.floor(20 + r() * 60);
  const cy = Math.floor(20 + r() * 60);
  const labelSvg = label
    ? `<text x="${Math.round(w * 0.05)}" y="${Math.round(
        h - h * 0.05
      )}" font-family="Georgia, serif" font-size="${Math.round(
        Math.min(w, h) * 0.045
      )}" fill="#ffffff" fill-opacity="0.82" letter-spacing="2">${label}</text>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" gradientTransform="rotate(${angle} 0.5 0.5)">
      <stop offset="0" stop-color="${dark}"/>
      <stop offset="1" stop-color="${light}"/>
    </linearGradient>
    <radialGradient id="hl" cx="${cx}%" cy="${cy}%" r="75%">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.16"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig" cx="50%" cy="50%" r="75%">
      <stop offset="0.55" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity="0.42"/>
    </radialGradient>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0.06"/></feComponentTransfer><feComposite operator="over" in2="SourceGraphic"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#hl)"/>
  <rect width="${w}" height="${h}" filter="url(#grain)" opacity="0.5"/>
  <rect width="${w}" height="${h}" fill="url(#vig)"/>
  ${labelSvg}
</svg>`;
}

async function writeStill(rel, w, h, label) {
  const seed = hashString(rel);
  const svg = stillSvg(w, h, seed, label);
  const out = path.join(PUBLIC, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  await sharp(Buffer.from(svg))
    .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
    .toFile(out);
  return out;
}

// tiny base64 LQIP for next/image placeholder="blur"
async function blurFor(rel) {
  const seed = hashString(rel);
  const svg = stillSvg(64, 64, seed, "");
  const buf = await sharp(Buffer.from(svg))
    .resize(16, 16, { fit: "fill" })
    .webp({ quality: 30 })
    .toBuffer();
  return `data:image/webp;base64,${buf.toString("base64")}`;
}

// ---- About frame sequence: scatter -> assemble -----------------------------
function aboutFrameSvg(w, h, t) {
  // particles start scattered (t=0) and converge into a centred grid (t=1)
  const r = rng(20260614);
  const cols = 14;
  const rows = 8;
  const n = cols * rows;
  const gridW = w * 0.46;
  const gridH = h * 0.5;
  const ox = (w - gridW) / 2;
  const oy = (h - gridH) / 2;
  // eased progress
  const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  let dots = "";
  for (let i = 0; i < n; i++) {
    const c = i % cols;
    const rw = Math.floor(i / cols);
    const tx = ox + (c + 0.5) * (gridW / cols);
    const ty = oy + (rw + 0.5) * (gridH / rows);
    const sx = r() * w;
    const sy = r() * h;
    const x = sx + (tx - sx) * e;
    const y = sy + (ty - sy) * e;
    const rad = 3 + (1 - Math.abs(0.5 - t) * 2) * 5; // bigger mid-flight
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(
      1
    )}" r="${rad.toFixed(1)}" fill="#f4f1ea" fill-opacity="${(
      0.35 +
      0.55 * e
    ).toFixed(2)}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#14110f"/>
  ${dots}
</svg>`;
}

async function writeAboutFrames(count) {
  const dir = path.join(FRAMES, "about");
  await fs.mkdir(dir, { recursive: true });
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0 : i / (count - 1);
    const svg = aboutFrameSvg(1280, 720, t);
    const name = `about-${String(i + 1).padStart(4, "0")}.jpg`;
    await sharp(Buffer.from(svg))
      .jpeg({ quality: 68, chromaSubsampling: "4:2:0" })
      .toFile(path.join(dir, name));
  }
  return count;
}

// ---- optional ffmpeg videos ------------------------------------------------
function hasFfmpeg() {
  const res = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
  return res.status === 0;
}
function makeVideo(posterAbs, outAbs) {
  const res = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-loop", "1",
      "-i", posterAbs,
      "-t", "4",
      "-r", "24",
      "-vf", "scale=1280:-2,format=yuv420p",
      "-movflags", "+faststart",
      outAbs,
    ],
    { stdio: "ignore" }
  );
  return res.status === 0;
}

// ---- manifest --------------------------------------------------------------
const PROJECTS = [
  ["kurokawa", "Kurokawa"],
  ["monolith", "Monolith"],
  ["lumen", "Lumen"],
  ["atlas", "Atlas Down"],
  ["vesper", "Vesper"],
  ["nadir", "Nadir"],
];

async function main() {
  console.log("· generating placeholder assets…");
  await fs.mkdir(IMAGES, { recursive: true });
  await fs.mkdir(VIDEOS, { recursive: true });

  const blurTargets = [];
  const note = (rel) => blurTargets.push(rel);

  // hero portraits (4:5)
  for (let i = 1; i <= 5; i++) {
    const rel = `images/hero-${String(i).padStart(2, "0")}.jpg`;
    await writeStill(rel, 1600, 2000, `Hero ${i}`);
    note(rel);
  }

  // projects: cover (4:5) + two media (3:2)
  for (const [slug, title] of PROJECTS) {
    const cover = `images/project-${slug}-01.jpg`;
    await writeStill(cover, 1600, 2000, title);
    note(cover);
    for (let m = 2; m <= 3; m++) {
      const rel = `images/project-${slug}-${String(m).padStart(2, "0")}.jpg`;
      await writeStill(rel, 2400, 1600, title);
      note(rel);
    }
  }

  // selected work loop (square)
  for (let i = 1; i <= 8; i++) {
    const rel = `images/selected-${String(i).padStart(2, "0")}.jpg`;
    await writeStill(rel, 1200, 1200, `Frame ${i}`);
    note(rel);
  }

  // editorial / moments (varied)
  const editorialSizes = [
    [1600, 2000],
    [2400, 1600],
    [1600, 1600],
    [2000, 1400],
    [1400, 1800],
  ];
  for (let i = 1; i <= 5; i++) {
    const [w, h] = editorialSizes[i - 1];
    const rel = `images/editorial-${String(i).padStart(2, "0")}.jpg`;
    await writeStill(rel, w, h, `Moment ${i}`);
    note(rel);
  }

  // services (4:3)
  for (let i = 1; i <= 5; i++) {
    const rel = `images/service-${String(i).padStart(2, "0")}.jpg`;
    await writeStill(rel, 1600, 1200, `Service ${i}`);
    note(rel);
  }

  // video work posters (16:9)
  const videoPosters = [];
  for (let i = 1; i <= 5; i++) {
    const rel = `images/video-${String(i).padStart(2, "0")}-poster.jpg`;
    const abs = await writeStill(rel, 1920, 1080, `Film ${i}`);
    note(rel);
    videoPosters.push({ index: i, abs, name: `video-${String(i).padStart(2, "0")}` });
  }

  // featured project clips (16:9)
  const featuredPosters = [];
  for (let i = 1; i <= 4; i++) {
    const rel = `images/featured-${String(i).padStart(2, "0")}-poster.jpg`;
    const abs = await writeStill(rel, 1920, 1080, `Clip ${i}`);
    note(rel);
    featuredPosters.push({ index: i, abs, name: `featured-${String(i).padStart(2, "0")}` });
  }

  // about frame sequence
  const frameCount = 48;
  await writeAboutFrames(frameCount);
  console.log(`  · about frames: ${frameCount} written`);

  // videos (optional)
  let videoStatus = "skipped (ffmpeg not found — posters still render)";
  if (hasFfmpeg()) {
    let ok = 0;
    for (const p of [...videoPosters, ...featuredPosters]) {
      const out = path.join(VIDEOS, `${p.name}.mp4`);
      if (makeVideo(p.abs, out)) ok++;
    }
    videoStatus = `generated ${ok} mp4 placeholders`;
  }
  console.log(`  · videos: ${videoStatus}`);

  // blur map
  const blurMap = {};
  for (const rel of blurTargets) {
    blurMap[`/${rel}`] = await blurFor(rel);
  }
  await fs.mkdir(DATA, { recursive: true });
  const blurFile = path.join(DATA, "_generated-blur.ts");
  await fs.writeFile(
    blurFile,
    `// AUTO-GENERATED by scripts/generate-placeholders.mjs — do not edit by hand.\n` +
      `export const blurMap: Record<string, string> = ${JSON.stringify(
        blurMap,
        null,
        2
      )};\n`,
    "utf8"
  );
  console.log(`  · blur map: ${Object.keys(blurMap).length} entries -> src/data/_generated-blur.ts`);
  console.log("✓ done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

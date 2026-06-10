/**
 * Preuzima premium drone/arhitektura klipove (Mixkit — besplatno, bez watermarka).
 * npm run showcase:download
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public", "showcase");

/** Mixkit Free License — pogodno za web showcase. */
const CLIPS = [
  {
    id: "mediterranean-villas",
    out: "mediterranean-villas.mp4",
    mixkitId: 8675,
    label: "Drone — mediteranske vile",
  },
  {
    id: "manor-house",
    out: "manor-house.mp4",
    mixkitId: 8603,
    label: "Drone — imanje u pejzažu",
  },
  {
    id: "holiday-home",
    out: "holiday-home.mp4",
    mixkitId: 8199,
    label: "Drone — kuća za odmor",
  },
];

async function headSize(url) {
  const res = await fetch(url, { method: "HEAD", redirect: "follow" });
  if (!res.ok) return null;
  const len = res.headers.get("content-length");
  return len ? Number(len) : null;
}

async function resolveBestUrl(mixkitId) {
  const bases = [
    `https://assets.mixkit.co/videos/${mixkitId}/${mixkitId}-1080.mp4`,
    `https://assets.mixkit.co/videos/${mixkitId}/${mixkitId}-720.mp4`,
    `https://assets.mixkit.co/videos/${mixkitId}/${mixkitId}.mp4`,
  ];
  for (const url of bases) {
    const size = await headSize(url);
    if (size && size > 500_000) {
      return { url, size };
    }
  }
  return null;
}

async function download(url, dest, label) {
  console.log(`↓ ${label}`);
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    throw new Error(`${label}: HTTP ${res.status}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  const mb = (buf.length / (1024 * 1024)).toFixed(1);
  console.log(`  ✓ ${path.basename(dest)} (${mb} MB)`);
  return buf.length;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  for (const clip of CLIPS) {
    const resolved = await resolveBestUrl(clip.mixkitId);
    if (!resolved) {
      throw new Error(`Nema dostupnog klipa za Mixkit #${clip.mixkitId}`);
    }
    const videoPath = path.join(outDir, clip.out);
    await download(resolved.url, videoPath, `${clip.label} (${Math.round(resolved.size / 1e6)} MB)`);

    const posterUrl = `https://assets.mixkit.co/videos/${clip.mixkitId}/${clip.mixkitId}-thumb-720-0.jpg`;
    const posterPath = path.join(outDir, clip.out.replace(/\.mp4$/, ".jpg"));
    await download(posterUrl, posterPath, `${clip.label} poster`);
  }
  console.log("Gotovo — 3 HD klipa u public/showcase/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

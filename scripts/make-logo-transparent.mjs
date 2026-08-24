/**
 * Uklanja svijetlu ili tamnu pozadinu sa logotipa i čuva transparentan PNG.
 * node scripts/make-logo-transparent.mjs
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo", "logo-original.png");
const out = path.join(root, "public", "logo", "logo-transparent.png");

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const w = info.width;
const h = info.height;
const pixels = w * h;

function isLightBackground(r, g, b) {
  const nearWhite = r > 232 && g > 232 && b > 232;
  const nearGrayBg =
    r > 210 && g > 210 && b > 210 && Math.abs(r - g) < 12 && Math.abs(g - b) < 12;
  return nearWhite || nearGrayBg;
}

function isDarkBackground(r, g, b) {
  const avg = (r + g + b) / 3;
  if (avg > 48) return false;
  if (r > 90) return false;
  return true;
}

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  if (isLightBackground(r, g, b)) {
    data[i + 3] = 0;
  }
}

const seen = new Uint8Array(pixels);
const q = [];

function pushIf(pi) {
  if (pi < 0 || pi >= pixels || seen[pi]) return;
  const o = pi * 4;
  if (!isDarkBackground(data[o], data[o + 1], data[o + 2])) return;
  seen[pi] = 1;
  q.push(pi);
}

for (let x = 0; x < w; x++) {
  pushIf(x);
  pushIf((h - 1) * w + x);
}
for (let y = 0; y < h; y++) {
  pushIf(y * w);
  pushIf(y * w + (w - 1));
}

while (q.length) {
  const pi = q.pop();
  const x = pi % w;
  const y = (pi / w) | 0;
  if (x > 0) pushIf(pi - 1);
  if (x < w - 1) pushIf(pi + 1);
  if (y > 0) pushIf(pi - w);
  if (y < h - 1) pushIf(pi + w);
}

for (let pi = 0; pi < pixels; pi++) {
  if (!seen[pi]) continue;
  const o = pi * 4;
  data[o + 3] = 0;
}

const buf = await sharp(data, {
  raw: { width: w, height: h, channels: 4 },
})
  .png({ compressionLevel: 9 })
  .toBuffer();

const finalBuf = await sharp(buf).trim().png({ compressionLevel: 9 }).toBuffer();

await sharp(finalBuf).toFile(out);

const meta = await sharp(out).metadata();
console.log(`✓ ${out} (${meta.width}x${meta.height}, alpha: ${meta.hasAlpha})`);

import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'icons');
await mkdir(outDir, { recursive: true });

const svg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0B1120"/>
      <stop offset="100%" stop-color="#131E35"/>
    </linearGradient>
    <linearGradient id="teal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#00E5AB"/>
      <stop offset="100%" stop-color="#00C896"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <!-- Fuel pump icon -->
  <g transform="translate(96,80)" fill="none" stroke="url(#teal)" stroke-width="28" stroke-linecap="round" stroke-linejoin="round">
    <!-- main body -->
    <path d="M40 320 L40 60 a30 30 0 0 1 30 -30 L190 30 a30 30 0 0 1 30 30 L220 320 Z" fill="url(#teal)" stroke="none" opacity="0.18"/>
    <rect x="40" y="30" width="180" height="290" rx="28"/>
    <rect x="70" y="60" width="120" height="80" rx="10" fill="#00C896" stroke="none" opacity="0.85"/>
    <!-- nozzle -->
    <path d="M220 130 L280 130 a20 20 0 0 1 20 20 L300 260 a25 25 0 0 0 25 25 a25 25 0 0 0 25 -25 L350 130"/>
    <path d="M310 100 L350 130" stroke-width="22"/>
  </g>
  <!-- accent drop -->
  <circle cx="380" cy="380" r="48" fill="#FF6B35" opacity="0.92"/>
  <path d="M380 350 L398 380 a18 18 0 1 1 -36 0 Z" fill="#0B1120"/>
</svg>`;

async function genIcon(size) {
  const buf = Buffer.from(svg(size));
  await sharp(buf, { density: 300 })
    .resize(size, size)
    .png()
    .toFile(resolve(outDir, `icon-${size}.png`));
  console.log(`✓ icon-${size}.png`);
}

await genIcon(192);
await genIcon(512);

// Apple touch icon (180)
await sharp(Buffer.from(svg(180)), { density: 300 })
  .resize(180, 180)
  .png()
  .toFile(resolve(outDir, `apple-touch-icon.png`));
console.log('✓ apple-touch-icon.png');

// Favicon (32)
await sharp(Buffer.from(svg(32)), { density: 300 })
  .resize(32, 32)
  .png()
  .toFile(resolve(outDir, `favicon-32.png`));
console.log('✓ favicon-32.png');

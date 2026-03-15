#!/usr/bin/env node
/**
 * Generates simple PWA icons (192x192 and 512x512) using pure SVG.
 * Written to public/ as .svg files (browsers accept SVG in manifests too,
 * but we also write .png-named SVG files for maximum compatibility).
 */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, '../public');

function makeSvg(size) {
  const r = Math.round(size * 0.18); // corner radius
  const cx = size / 2;
  const flakeSize = size * 0.45;
  const f = flakeSize / 2;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${r}" fill="#0d1530"/>
  <!-- Snowflake icon -->
  <g transform="translate(${cx},${cx})" stroke="#38bdf8" stroke-width="${size * 0.06}" stroke-linecap="round" fill="none">
    <line x1="0" y1="${-f}" x2="0" y2="${f}"/>
    <line x1="${-f}" y1="0" x2="${f}" y2="0"/>
    <line x1="${-f * 0.707}" y1="${-f * 0.707}" x2="${f * 0.707}" y2="${f * 0.707}"/>
    <line x1="${f * 0.707}" y1="${-f * 0.707}" x2="${-f * 0.707}" y2="${f * 0.707}"/>
    <!-- Branches -->
    ${[-f, f].flatMap(y => [
      `<line x1="${-size*0.08}" y1="${y < 0 ? y + size*0.12 : y - size*0.12}" x2="0" y2="${y}"/>`,
      `<line x1="${size*0.08}" y1="${y < 0 ? y + size*0.12 : y - size*0.12}" x2="0" y2="${y}"/>`,
    ]).join('\n    ')}
  </g>
</svg>`;
}

writeFileSync(resolve(publicDir, 'icon-192.png'), makeSvg(192));
writeFileSync(resolve(publicDir, 'icon-512.png'), makeSvg(512));
writeFileSync(resolve(publicDir, 'favicon.svg'), makeSvg(64));

console.log('Icons generated in public/');

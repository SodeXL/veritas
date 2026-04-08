#!/usr/bin/env node
/**
 * Generates app icon and splash screen assets programmatically using Sharp.
 *
 * Outputs:
 *   assets/icon.png         — 1024x1024, full icon (dark bg + gold cross in shield)
 *   assets/splash.png       — 1284x2778, splash screen (dark bg + cross + VERITAS wordmark)
 *   assets/adaptive-icon.png — 1024x1024, Android foreground layer (transparent bg + gold cross)
 *   assets/favicon.png      — 48x48, web favicon
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ASSETS = path.join(__dirname, '..', 'assets');

// ─── Color palette ────────────────────────────────────────────────────────────
const BG = '#12100D';
const GOLD = '#D4A843';
const GOLD_DIM = 'rgba(212,168,67,0.25)';

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function iconSvg(size = 1024) {
  const s = size;
  const cx = s / 2;
  const cy = s / 2;

  // Shield path — pentagon-like shape tapering to a point at bottom
  const top = cy - s * 0.42;
  const left = cx - s * 0.35;
  const right = cx + s * 0.35;
  const mid = cy + s * 0.06;
  const bot = cy + s * 0.45;
  const shieldStroke = Math.round(s * 0.012);

  // Cross dimensions
  const vW = Math.round(s * 0.072);  // vertical bar width
  const hW = Math.round(s * 0.072);  // horizontal bar height
  const vH = Math.round(s * 0.50);   // vertical bar height
  const hL = Math.round(s * 0.46);   // horizontal bar width

  const vX = cx - vW / 2;
  const vY = cy - s * 0.28;
  const hX = cx - hL / 2;
  const hY = cy - s * 0.04;
  const r = Math.round(s * 0.008);

  // Subtle inner shine lines
  const shineOpacity = 0.07;

  return `<svg width="${s}" height="${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#1e1a15"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="${Math.round(s * 0.015)}" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${s}" height="${s}" fill="url(#bg)"/>

  <!-- Shield fill (very subtle) -->
  <path d="M ${cx} ${top}
           L ${right} ${top + (s * 0.12)}
           L ${right} ${mid}
           Q ${right} ${mid + s * 0.22} ${cx} ${bot}
           Q ${left} ${mid + s * 0.22} ${left} ${mid}
           L ${left} ${top + (s * 0.12)}
           Z"
        fill="${GOLD_DIM}" stroke="${GOLD}" stroke-width="${shieldStroke}"
        stroke-linejoin="round"/>

  <!-- Cross (with glow) -->
  <g filter="url(#glow)">
    <rect x="${vX}" y="${vY}" width="${vW}" height="${vH}" rx="${r}" fill="${GOLD}"/>
    <rect x="${hX}" y="${hY}" width="${hL}" height="${hW}" rx="${r}" fill="${GOLD}"/>
  </g>
</svg>`;
}

function splashSvg(w = 1284, h = 2778) {
  const cx = w / 2;
  const cy = h / 2;

  // Cross (smaller, centered above text)
  const vW = 52, vH = 320, hW = 52, hL = 320;
  const vX = cx - vW / 2;
  const vY = cy - 300;
  const hX = cx - hL / 2;
  const hY = cy - 136;
  const r = 6;

  // Text positions
  const titleY = cy + 80;
  const subtitleY = cy + 160;
  const taglineY = cy + 220;

  return `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="#1c1812"/>
      <stop offset="100%" stop-color="${BG}"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${w}" height="${h}" fill="url(#bg)"/>

  <!-- Subtle horizontal rule above cross -->
  <line x1="${cx - 120}" y1="${vY - 40}" x2="${cx + 120}" y2="${vY - 40}"
        stroke="${GOLD}" stroke-width="1" opacity="0.3"/>

  <!-- Cross -->
  <g filter="url(#glow)">
    <rect x="${vX}" y="${vY}" width="${vW}" height="${vH}" rx="${r}" fill="${GOLD}"/>
    <rect x="${hX}" y="${hY}" width="${hL}" height="${hW}" rx="${r}" fill="${GOLD}"/>
  </g>

  <!-- Title: VERITAS -->
  <text x="${cx}" y="${titleY}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="96"
        font-weight="normal"
        letter-spacing="18"
        fill="${GOLD}"
        text-anchor="middle">VERITAS</text>

  <!-- Subtitle rule -->
  <line x1="${cx - 90}" y1="${subtitleY - 10}" x2="${cx + 90}" y2="${subtitleY - 10}"
        stroke="${GOLD}" stroke-width="1" opacity="0.3"/>

  <!-- Tagline -->
  <text x="${cx}" y="${taglineY}"
        font-family="Georgia, 'Times New Roman', serif"
        font-size="32"
        letter-spacing="6"
        fill="#8A7E6E"
        text-anchor="middle">Catholic Apologetics</text>
</svg>`;
}

function adaptiveIconSvg(size = 1024) {
  const cx = size / 2;
  const cy = size / 2;

  // Larger cross for adaptive icon safe zone (72dp of 108dp = 66.7%)
  // Safe zone: center 672/1024 px
  const vW = 96, vH = 560, hW = 96, hL = 560;
  const vX = cx - vW / 2;
  const vY = cy - vH / 2;
  const hX = cx - hL / 2;
  const hY = cy - hW / 2;
  const r = 10;

  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  <!-- Transparent background — Android supplies its own bg via adaptiveIcon.backgroundColor -->
  <g filter="url(#glow)">
    <rect x="${vX}" y="${vY}" width="${vW}" height="${vH}" rx="${r}" fill="${GOLD}"/>
    <rect x="${hX}" y="${hY}" width="${hL}" height="${hW}" rx="${r}" fill="${GOLD}"/>
  </g>
</svg>`;
}

// ─── Generate images ──────────────────────────────────────────────────────────

async function generate() {
  console.log('Generating assets...\n');

  // 1. App icon — 1024x1024
  const iconPath = path.join(ASSETS, 'icon.png');
  await sharp(Buffer.from(iconSvg(1024)))
    .resize(1024, 1024)
    .png()
    .toFile(iconPath);
  console.log('✓ assets/icon.png (1024×1024)');

  // 2. Splash screen — 1284x2778
  const splashPath = path.join(ASSETS, 'splash.png');
  await sharp(Buffer.from(splashSvg(1284, 2778)))
    .resize(1284, 2778)
    .png()
    .toFile(splashPath);
  console.log('✓ assets/splash.png (1284×2778)');

  // 3. Adaptive icon foreground — 1024x1024, transparent bg
  const adaptivePath = path.join(ASSETS, 'adaptive-icon.png');
  await sharp(Buffer.from(adaptiveIconSvg(1024)))
    .resize(1024, 1024)
    .png()
    .toFile(adaptivePath);
  console.log('✓ assets/adaptive-icon.png (1024×1024)');

  // 4. Favicon — 48x48 (derived from icon)
  const faviconPath = path.join(ASSETS, 'favicon.png');
  await sharp(Buffer.from(iconSvg(1024)))
    .resize(48, 48)
    .png()
    .toFile(faviconPath);
  console.log('✓ assets/favicon.png (48×48)');

  // 5. Splash icon (legacy — used by old splash config, keep same as splash for safety)
  const splashIconPath = path.join(ASSETS, 'splash-icon.png');
  await sharp(Buffer.from(splashSvg(1284, 2778)))
    .resize(1284, 2778)
    .png()
    .toFile(splashIconPath);
  console.log('✓ assets/splash-icon.png (1284×2778, updated)');

  console.log('\nAll assets generated successfully.');
}

generate().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});

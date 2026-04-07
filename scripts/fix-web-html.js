#!/usr/bin/env node
/**
 * Post-build script to fix Expo web export HTML
 * Changes script tag from defer to type="module" to support import.meta
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('Error: dist/index.html not found. Run npx expo export --platform web first.');
  process.exit(1);
}

let html = fs.readFileSync(indexPath, 'utf8');

// Replace defer with type="module"
const fixed = html.replace(
  /<script src="([^"]+)" defer><\/script>/g,
  '<script src="$1" type="module"></script>'
);

if (html === fixed) {
  console.log('No changes needed - HTML already has type="module"');
} else {
  fs.writeFileSync(indexPath, fixed, 'utf8');
  console.log('✓ Fixed dist/index.html: replaced defer with type="module"');
}

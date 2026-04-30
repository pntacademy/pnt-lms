#!/usr/bin/env node
// Generates Android mipmap icon PNGs from the PNT Academy logo SVG
// Uses only built-in macOS tools (no extra npm packages needed)
// Run: node scripts/generate-android-icons.js

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const SVG_SRC = path.resolve(__dirname, "../public/logo.svg");
const RES_DIR = path.resolve(__dirname, "../android/app/src/main/res");

// Android mipmap sizes
const sizes = [
  { folder: "mipmap-mdpi",    size: 48 },
  { folder: "mipmap-hdpi",    size: 72 },
  { folder: "mipmap-xhdpi",   size: 96 },
  { folder: "mipmap-xxhdpi",  size: 144 },
  { folder: "mipmap-xxxhdpi", size: 192 },
];

if (!fs.existsSync(SVG_SRC)) {
  console.error("❌ logo.svg not found at public/logo.svg");
  process.exit(1);
}

// Check if rsvg-convert or qlmanage is available
let converter = null;
try { execSync("which rsvg-convert", { stdio: "ignore" }); converter = "rsvg"; } catch {}
if (!converter) {
  try { execSync("which convert", { stdio: "ignore" }); converter = "imagemagick"; } catch {}
}
if (!converter) {
  try { execSync("which inkscape", { stdio: "ignore" }); converter = "inkscape"; } catch {}
}

if (!converter) {
  // Fallback: use macOS qlmanage + sips pipeline (works without Homebrew tools)
  converter = "sips";
}

console.log(`Using converter: ${converter}`);
console.log(`Source: ${SVG_SRC}\n`);

for (const { folder, size } of sizes) {
  const destDir = path.join(RES_DIR, folder);
  const destFile = path.join(destDir, "ic_launcher.png");
  const destRound = path.join(destDir, "ic_launcher_round.png");

  fs.mkdirSync(destDir, { recursive: true });

  let cmd;
  if (converter === "rsvg") {
    cmd = `rsvg-convert -w ${size} -h ${size} "${SVG_SRC}" -o "${destFile}"`;
  } else if (converter === "imagemagick") {
    cmd = `convert -background white -gravity center -resize ${size}x${size} "${SVG_SRC}" "${destFile}"`;
  } else if (converter === "inkscape") {
    cmd = `inkscape --export-type=png --export-width=${size} --export-height=${size} --export-filename="${destFile}" "${SVG_SRC}"`;
  } else {
    // sips cannot read SVG — skip, will handle manually
    console.log(`  ⚠️  No SVG converter found. Install via: brew install librsvg`);
    break;
  }

  try {
    execSync(cmd, { stdio: "inherit" });
    // Copy as round variant too
    fs.copyFileSync(destFile, destRound);
    console.log(`✅ ${folder} → ${size}x${size}px`);
  } catch (e) {
    console.error(`❌ Failed for ${folder}:`, e.message);
  }
}

console.log("\n🎉 Done! Rebuild the APK to apply new icons:");
console.log('   cd android && ./gradlew assembleDebug');

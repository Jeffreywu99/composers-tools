#!/usr/bin/env node

/**
 * bump-version.js — Sync version across all config files
 *
 * Usage:  node scripts/bump-version.js <version>
 * Example: node scripts/bump-version.js 0.3.0
 *
 * Updates version in:
 *   - package.json
 *   - src-tauri/Cargo.toml
 *   - src-tauri/tauri.conf.json
 */

const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const newVersion = process.argv[2];

if (!newVersion) {
  console.error("Usage: node scripts/bump-version.js <version>");
  console.error("Example: node scripts/bump-version.js 0.3.0");
  process.exit(1);
}

// Validate semver-like format
if (!/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(newVersion)) {
  console.error(`Invalid version format: "${newVersion}"`);
  console.error("Expected format: X.Y.Z or X.Y.Z-label");
  process.exit(1);
}

const files = {
  "package.json": {
    read: (content) => {
      const json = JSON.parse(content);
      return json.version;
    },
    write: (content, version) => {
      const json = JSON.parse(content);
      json.version = version;
      return JSON.stringify(json, null, 2) + "\n";
    },
  },
  "src-tauri/Cargo.toml": {
    read: (content) => {
      const match = content.match(/^version\s*=\s*"([^"]+)"/m);
      return match ? match[1] : null;
    },
    write: (content, version) => {
      return content.replace(
        /^(version\s*=\s*)"[^"]+"/m,
        `$1"${version}"`
      );
    },
  },
  "src-tauri/tauri.conf.json": {
    read: (content) => {
      const json = JSON.parse(content);
      return json.version;
    },
    write: (content, version) => {
      const json = JSON.parse(content);
      json.version = version;
      return JSON.stringify(json, null, 2) + "\n";
    },
  },
};

console.log(`\nBumping version to ${newVersion}\n`);

let hasError = false;

for (const [filePath, handlers] of Object.entries(files)) {
  const fullPath = path.join(rootDir, filePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`  ✗ ${filePath} — file not found`);
    hasError = true;
    continue;
  }

  const content = fs.readFileSync(fullPath, "utf-8");
  const oldVersion = handlers.read(content);

  if (!oldVersion) {
    console.error(`  ✗ ${filePath} — could not read current version`);
    hasError = true;
    continue;
  }

  const newContent = handlers.write(content, newVersion);
  fs.writeFileSync(fullPath, newContent, "utf-8");

  console.log(`  ✓ ${filePath}: ${oldVersion} → ${newVersion}`);
}

if (hasError) {
  console.error("\nSome files had errors. Check above.");
  process.exit(1);
}

console.log(`\nDone! All files updated to v${newVersion}.`);
console.log("Next steps:");
console.log("  1. Review changes: git diff");
console.log("  2. Commit:         git add -A && git commit -m 'chore: bump version to " + newVersion + "'");
console.log("  3. Tag:            git tag -a v" + newVersion + " -m 'v" + newVersion + ": <description>'");

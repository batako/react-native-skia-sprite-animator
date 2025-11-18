#!/usr/bin/env node
/* eslint-env node */
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');

const projectDir = process.cwd();
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'oss-attribution-'));
const outputDir = path.resolve(projectDir, 'src/licenses');
const outputFile = path.join(outputDir, 'licenses.json');

const cliPath = require.resolve('oss-attribution-generator/index.js');

try {
  execFileSync(process.execPath, [cliPath, '-o', tempDir, '-b', projectDir], {
    stdio: 'inherit',
  });

  const licensePath = path.join(tempDir, 'licenseInfos.json');
  if (!fs.existsSync(licensePath)) {
    throw new Error('oss-attribution-generator did not produce licenseInfos.json');
  }

  const raw = JSON.parse(fs.readFileSync(licensePath, 'utf8'));
  const entries = Object.values(raw)
    .filter((entry) => entry && !entry.ignore)
    .map((entry) => ({
      name: entry.name,
      version: entry.version,
      licenses: entry.license,
      repository: entry.url ?? '',
      publisher: entry.authors ?? '',
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
  console.log(
    `[licenses] Wrote ${entries.length} entries to ${path.relative(projectDir, outputFile)}`,
  );
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

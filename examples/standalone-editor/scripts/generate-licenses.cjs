#!/usr/bin/env node
/* eslint-env node */
const fs = require('node:fs');
const path = require('node:path');
const licenseChecker = require('license-checker-rseidelsohn');

const projectDir = process.cwd();
const outputDir = path.resolve(projectDir, 'src/licenses');
const outputFile = path.join(outputDir, 'licenses.json');

const runLicenseChecker = () =>
  new Promise((resolve, reject) => {
    licenseChecker.init(
      {
        start: projectDir,
        production: true,
        development: false,
      },
      (error, packages) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(packages);
      },
    );
  });

const normalizeLicense = (licenses) => {
  if (!licenses) {
    return '';
  }
  return Array.isArray(licenses) ? licenses.join(', ') : String(licenses);
};

const parsePackageId = (pkgId) => {
  const lastAt = pkgId.lastIndexOf('@');
  if (lastAt <= 0) {
    return { name: pkgId, version: '' };
  }
  return {
    name: pkgId.slice(0, lastAt),
    version: pkgId.slice(lastAt + 1),
  };
};

const cleanString = (value) => {
  if (!value) {
    return '';
  }
  return String(value).trim();
};

const main = async () => {
  const packages = await runLicenseChecker();
  const entries = Object.entries(packages)
    .map(([pkgId, meta]) => {
      const { name, version } = parsePackageId(pkgId);
      return {
        name,
        version,
        licenses: normalizeLicense(meta.licenses),
        repository: cleanString(meta.repository ?? meta.url ?? ''),
        homepage: cleanString(meta.homepage ?? ''),
        publisher: cleanString(meta.publisher ?? ''),
        email: cleanString(meta.email ?? ''),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(entries, null, 2));
  console.log(
    `[licenses] Wrote ${entries.length} entries to ${path.relative(projectDir, outputFile)}`,
  );
};

main().catch((error) => {
  console.error('[licenses] Failed to generate licenses');
  console.error(error);
  process.exitCode = 1;
});

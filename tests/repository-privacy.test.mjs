import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const rootPath = fileURLToPath(root);
const deploymentIgnore = new Set(
  readFileSync(new URL('../.vercelignore', import.meta.url), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
);

for (const required of ['.superpowers/', 'design/', 'docs/', 'exports/', 'marketing/', 'newsletter/', 'tests/']) {
  assert.ok(deploymentIgnore.has(required), `${required} must stay outside the public Vercel deployment.`);
}

const trackedPaths = new Set(
  execFileSync('git', ['ls-files', '-z'], { cwd: rootPath })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
);
const deletedPaths = new Set(
  execFileSync('git', ['ls-files', '--deleted', '-z'], { cwd: rootPath })
    .toString('utf8')
    .split('\0')
    .filter(Boolean)
);
for (const deleted of deletedPaths) trackedPaths.delete(deleted);

for (const stateFile of ['events', 'server-info', 'server.pid']) {
  const statePath = `.superpowers/brainstorm/40343-1781636572/state/${stateFile}`;
  assert.equal(
    existsSync(new URL(`../${statePath}`, import.meta.url)),
    false,
    `Local runtime state ${stateFile} must not exist in the working tree.`
  );
  assert.equal(trackedPaths.has(statePath), false, `Local runtime state ${stateFile} must not remain in the effective tracked tree.`);
}

const absoluteHomePattern = new RegExp(`/${['Users'].join('')}/`);

for (const trackedPath of trackedPaths) {
  const childUrl = new URL(`../${trackedPath}`, import.meta.url);
  const bytes = readFileSync(childUrl);
  if (bytes.includes(0)) continue;
  assert.doesNotMatch(
    bytes.toString('utf8'),
    absoluteHomePattern,
    `${relative(rootPath, fileURLToPath(childUrl))} must not disclose an absolute macOS home path.`
  );
}

for (const image of [
  'images/loren-author-black-white.jpeg',
  'images/loren-author-blue-floral.jpeg',
  'images/loren-author-smiling-outdoor.jpeg'
]) {
  const bytes = readFileSync(new URL(`../${image}`, import.meta.url));
  const metadataText = bytes.toString('latin1');
  assert.equal(bytes.includes(Buffer.from('Exif\0\0', 'binary')), false, `${image} must not retain an EXIF metadata block.`);
  assert.equal(
    metadataText.includes('http://ns.adobe.com/xap/1.0/'),
    false,
    `${image} must not retain an XMP metadata block.`
  );
  assert.doesNotMatch(metadataText, /(?:Lens)?SerialNumber|aux:SerialNumber/, `${image} must not expose device serial metadata.`);
}

console.log('Repository privacy checks passed.');

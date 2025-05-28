// custom-build-script.cjs
// Consolidated build script that:
// 1. Builds the Docusaurus site
// 2. Generates the llms-full.txt payload via the Bun one-click-llm script
// 3. Copies the generated docs JSON schema into the build folder so that the Console can consume it
// (previously handled by copy-docs-schema-for-console.cjs)

/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const rootDir = path.join(__dirname, '.');

function run(command, options = {}) {
  execSync(command, { stdio: 'inherit', ...options });
}

function buildDocs() {
  console.log('\n\x1b[36mRunning Docusaurus build...\x1b[0m');
  run('docusaurus build', { cwd: rootDir });
}

function generateLlmBundle() {
  console.log('\n\x1b[36mGenerating llms-full.txt for LLM prompts...\x1b[0m');
  const utilDir = path.join(rootDir, 'utilities', 'one-click-llm');

  try {
    run('npm run start -- --silent', { cwd: utilDir });
  } catch (err) {
    console.warn('Error details:', err?.message || err);
  }
}

function copyJsonSchema() {
  console.log('\n\x1b[36mCopying docs-schema.json for Console...\x1b[0m');
  const docsDir = path.join(__dirname, '.docusaurus/docusaurus-plugin-content-docs/default/p');

  if (!fs.existsSync(docsDir)) {
    throw new Error(`Docs directory not found: ${docsDir}`);
  }

  const docsFile = fs.readdirSync(docsDir).find(file => file.startsWith('docs') && file.endsWith('.json'));

  if (!docsFile) {
    throw new Error('Could not find the docs JSON file');
  }

  const sourcePath = path.join(docsDir, docsFile);
  const targetPath = path.join(__dirname, './build/docs-schema.json');

  fs.copyFileSync(sourcePath, targetPath);
}

(function main() {
  try {
    buildDocs();
    generateLlmBundle();
    copyJsonSchema();
    console.log('\x1b[32m\nCustom build completed successfully!\x1b[0m');
  } catch (e) {
    console.error('\x1b[31m\nCustom build failed:\x1b[0m', e.message);
    process.exit(1);
  }
})();

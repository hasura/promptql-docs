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
const rootDir = __dirname;

function copyJsonSchema() {
  console.log('\n\x1b[32mTrying to copy the docs JSON schema file to project root for the console...\x1b[0m');
  const docsDir = path.join(__dirname, '.docusaurus/docusaurus-plugin-content-docs/default/p');

  // Check if docs directory exists first
  if (!fs.existsSync(docsDir)) {
    throw new Error(`Docs directory not found: ${docsDir}`);
  }

  const docsFile = fs.readdirSync(docsDir).find(file => file.startsWith('docs') && file.endsWith('.json'));

  if (!docsFile) {
    throw new Error('Could not find the docs JSON file');
  }

  const sourcePath = path.join(docsDir, docsFile);
  const targetPath = path.join(__dirname, 'build/docs-schema.json');

  fs.copyFileSync(sourcePath, targetPath);
}

function generateLlmBundle() {
  console.log('\n\x1b[36mGenerating llms-full.txt for LLM prompts...\x1b[0m');
  const utilDir = path.join(rootDir, 'utilities', 'one-click-llm');

  try {
    execSync('npm run start -- --silent', { cwd: utilDir, stdio: 'inherit' });
    console.log('\x1b[32mSuccessfully generated LLM bundle!\x1b[0m');
  } catch (err) {
    console.warn('\x1b[33mWarning: Could not generate LLM bundle:\x1b[0m', err?.message || err);
    // Don't throw error to allow build to continue
  }
}

// First run the Docusaurus build
console.log('\n\x1b[36mRunning Docusaurus build...\x1b[0m');
execSync('docusaurus build', { cwd: rootDir, stdio: 'inherit' });

// Then try to generate LLM bundle
try {
  generateLlmBundle();
} catch (e) {
  console.warn('\x1b[33mWarning: LLM bundle generation failed but continuing build...\x1b[0m');
}

// Finally try to copy the JSON schema
try {
  copyJsonSchema();
  console.log('\x1b[32m\nSuccessfully copied the docs JSON schema file to build assets!\n\x1b[0m');
} catch (e) {
  console.error('\x1b[31mError: Could not copy the docs JSON schema file to build assets:\x1b[0m', e.message);
  process.exit(1); // Exit with error since this is critical
}

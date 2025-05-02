import type { DocsFile } from '../types';
import { join, dirname, relative, resolve } from 'path';
import { readFile } from 'fs/promises';

const BASE_URL = 'https://hasura.io/docs/promptql';

async function expandPartials(content: string, docPath: string, rootDir: string, depth: number = 0): Promise<string> {
  if (depth > 10) {
    console.warn('Maximum recursion depth reached when expanding partials');
    return content;
  }

  // First, find all imports from @site/docs/ or @theme
  const importMatches = Array.from(content.matchAll(/import\s+(\w+)\s+from\s+"(@site\/docs\/|@theme\/)([^"]+)"/g));
  const importMap = new Map();
  const expectedPartials = new Set();

  for (const match of importMatches) {
    const [_, componentName, prefix, filePath] = match;
    if (!componentName || !filePath) continue;

    if (prefix === '@site/docs/') {
      expectedPartials.add(componentName);
      const fullPath = join(rootDir, 'docs', filePath);
      try {
        const importContent = await readFile(fullPath, 'utf-8');
        // Recursively expand partials in the imported content
        const expandedContent = await expandPartials(importContent, fullPath, rootDir, depth + 1);
        importMap.set(componentName, expandedContent);
      } catch (error) {
        console.warn(`Could not find imported file: ${filePath}`);
      }
    }
  }

  // Find all component usages
  const componentUsages = Array.from(content.matchAll(/<(\w+)\s*\/>/g));
  let expandedContent = content;

  // Try to find and read the partial files
  for (const match of componentUsages) {
    const [fullMatch, componentName] = match;
    if (!componentName) continue;

    // First check if we have this component in our importMap
    if (importMap.has(componentName)) {
      expandedContent = expandedContent.replace(
        new RegExp(`<${componentName}\\s*/>`, 'g'),
        importMap.get(componentName)
      );
      continue;
    }

    // Only look for partial files if this is an expected partial
    if (expectedPartials.has(componentName)) {
      // Try to find the partial file in current directory, parent directory, and docs directory
      const partialFileName = `_${componentName.toLowerCase()}.mdx`;
      const possiblePaths = [
        join(dirname(docPath), partialFileName),
        join(dirname(dirname(docPath)), partialFileName),
        join(rootDir, 'docs', partialFileName),
      ];

      let partialContent = null;
      for (const partialPath of possiblePaths) {
        try {
          partialContent = await readFile(partialPath, 'utf-8');
          // Recursively expand partials in the partial content
          partialContent = await expandPartials(partialContent, partialPath, rootDir, depth + 1);
          break;
        } catch (error) {
          // Continue trying other paths
          continue;
        }
      }

      if (partialContent) {
        // Replace the component usage with its content
        expandedContent = expandedContent.replace(new RegExp(`<${componentName}\\s*/>`, 'g'), partialContent);
      } else {
        console.warn(`Could not find partial file for component: ${componentName}`);
      }
    }
  }

  return expandedContent;
}

export async function writeMarkdown(docs: DocsFile[]): Promise<string> {
  const outputPath = join(dirname(dirname(dirname(dirname(import.meta.dir)))), 'output', 'allDocs.md');
  const rootDir = dirname(dirname(dirname(dirname(import.meta.dir))));

  const markdownOutput = await Promise.all(
    docs.map(async doc => {
      // Get the relative path for the URL, starting from the 'docs' directory
      const relativePath = doc.path.split('/docs/').pop() || '';
      const cleanPath = relativePath.replace(/index\.mdx?$/, '').replace(/\.mdx?$/, '');
      const url = `${BASE_URL}/${cleanPath}`;

      // Handle partial imports and expand them recursively
      const content = await expandPartials(doc.content, doc.path, rootDir);

      const heading = doc.title ? `# ${doc.title}\n\n` : '';
      const urlSection = `URL: ${url}\n\n`;
      return `${heading}${urlSection}${content.trim()}\n\n\n\n==============================\n\n\n\n`;
    })
  );

  const finalOutput = markdownOutput.join('');
  await Bun.write(outputPath, finalOutput);
  console.log('✅ allDocs.md written!');

  return outputPath;
}

export async function cleanUpImports(pathToMarkdown: string): Promise<void> {
  const file = Bun.file(pathToMarkdown);
  const content = await file.text();

  const cleaned = content
    .split('\n')
    .filter(line => {
      // Only remove non-partial imports
      const trimmed = line.trim();
      return !(trimmed.startsWith('import') && !trimmed.includes('_partials'));
    })
    .join('\n');

  await Bun.write(pathToMarkdown, cleaned);
  console.log(`🧹 Imports cleaned up`);
}

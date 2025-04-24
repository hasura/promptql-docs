import type { DocsFile } from '../types';
import { join, dirname } from 'path';

export async function writeMarkdown(docs: DocsFile[]): Promise<string> {
  const outputPath = join(dirname(dirname(dirname(dirname(import.meta.dir)))), 'output', 'allDocs.md');

  const markdownOutput = docs
    .map(doc => {
      const heading = doc.title ? `# ${doc.title}\n\n` : '';
      return `${heading}${doc.content.trim()}\n\n\n\n==============================\n\n\n\n`;
    })
    .join('');

  await Bun.write(outputPath, markdownOutput);
  console.log('✅ allDocs.md written!');

  return outputPath;
}

export async function cleanUpImports(pathToMarkdown: string): Promise<void> {
  const file = Bun.file(pathToMarkdown);
  const content = await file.text();

  const cleaned = content
    .split('\n')
    .filter(line => !line.trim().startsWith('import'))
    .join('\n');

  await Bun.write(pathToMarkdown, cleaned);
  console.log(`🧹 Imports cleaned up`);
}

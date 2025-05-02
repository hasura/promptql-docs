import { expect, test } from 'bun:test';
import { mkdir, readFile, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';
import { writeMarkdown, cleanUpImports } from '../src/writer';

test('Writes what we expect', async () => {
  const dir = join(tmpdir(), `write-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });

  const docs = [
    { title: 'Test Title', content: 'Some content here.' },
    { title: '', content: 'Another block.' },
  ];

  const path = await writeMarkdown(docs as any);
  const result = await readFile(path, 'utf-8');

  expect(result).toContain('# Test Title');
  expect(result).toContain('Another block.');
});

test('Remove import statements', async () => {
  const dir = join(tmpdir(), `cleanup-test-${Date.now()}`);
  await mkdir(dir, { recursive: true });

  const filePath = join(dir, 'doc.md');
  await writeFile(filePath, `import x from 'y';\nContent\nimport z;`);

  await cleanUpImports(filePath);
  const cleaned = await readFile(filePath, 'utf-8');

  expect(cleaned).not.toContain('import');
  expect(cleaned).toContain('Content');
});

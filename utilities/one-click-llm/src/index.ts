import { getDocsDirectory, orderDocFileArray, collectDocsRecursive } from '../src/collator';
import { writeMarkdown, cleanUpImports } from './writer';

async function main() {
  const docsDirectory = await getDocsDirectory('docs');
  const docs = await collectDocsRecursive(docsDirectory);
  const sorted = orderDocFileArray(docs);
  const singleMdDocs = await writeMarkdown(sorted);
  await cleanUpImports(singleMdDocs);
}

await main();

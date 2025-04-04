import { walk } from 'https://deno.land/std@0.224.0/fs/walk.ts';
import * as path from 'https://deno.land/std@0.224.0/path/mod.ts';

const docsDir = './docs';
const targetExtension = '.mdx';

// Regex explanation:
// (\`{3})   - Capture group 1: Matches the opening triple backticks literally.
// sh        - Matches the literal "sh".
// (\\s+title="[^"]*")? - Capture group 2 (optional):
//                      - \\s+ matches one or more whitespace characters.
//                      - title=" matches the literal 'title="'.
//                      - [^"]* matches zero or more characters that are not a double quote.
//                      - " matches the closing double quote.
//                      - ? makes this entire group optional.
// \\n       - Matches a newline character literally.
// (ddn)     - Capture group 3: Matches the literal "ddn" at the beginning of the next line.
const regex = /(\`{3})bash(\s+title="[^"]*")?\n(ddn)/g;

async function processFile(filePath: string): Promise<void> {
  try {
    const content = await Deno.readTextFile(filePath);
    let changesMade = false;

    const newContent = content.replace(regex, (match, p1, p2, p3) => {
      changesMade = true;
      // p1: ```
      // p2: optional title attribute (e.g., ' title="my title"') or undefined
      // p3: ddn
      const titleAttribute = p2 || ''; // Use empty string if title is not present
      console.log(
        `  Replacing in ${path.basename(filePath)}: '${match.split('\\n')[0]}' -> '${p1}ddn${titleAttribute}'`
      );
      return `${p1}ddn${titleAttribute}\n${p3}`;
    });

    if (changesMade) {
      await Deno.writeTextFile(filePath, newContent);
      console.log(` -> Updated ${filePath}`);
    } else {
      // console.log(` -> No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
  }
}

async function main(): Promise<void> {
  console.log(`Starting processing of ${targetExtension} files in ${docsDir}...`);
  const excludedDir = path.resolve('./docs/reference/cli/commands');
  console.log(` -> Excluding directory: ${excludedDir}`);
  try {
    for await (const entry of walk(docsDir, { includeDirs: false, exts: [targetExtension] })) {
      if (entry.isFile) {
        const fullPath = path.resolve(entry.path);
        // Check if the file path starts with the excluded directory path
        if (fullPath.startsWith(excludedDir)) {
          // console.log(`   -> Skipping excluded file: ${entry.path}`); // Uncomment for verbose logging
          continue; // Skip this file
        }
        await processFile(entry.path);
      }
    }
    console.log('Processing complete.');
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      console.error(`Error: Directory not found at ${path.resolve(docsDir)}`);
      console.error("Please ensure the script is run from the correct working directory and the 'docs' folder exists.");
    } else {
      console.error('An unexpected error occurred during directory walking:', error);
    }
  }
}

await main();

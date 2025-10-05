import chokidar from 'chokidar';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Source: Your Obsidian Stormhaven folder
const SOURCE_DIR = path.resolve(__dirname, '../D&D Notebook/Personal/D&D/Stormhaven');
// Destination: Wiki content folder
const DEST_DIR = path.resolve(__dirname, 'src/content/wiki');

// Ensure destination directory exists
await fs.ensureDir(DEST_DIR);

// Function to concatenate Campaign Guide articles
async function buildCampaignGuide() {
  const sourceDir = path.join(SOURCE_DIR, 'GM/Campaign Guide Source');
  const obsidianFile = path.join(SOURCE_DIR, 'Campaign-Guide.md');
  const destFile = path.join(DEST_DIR, 'Campaign-Guide.md');

  try {
    const files = (await fs.readdir(sourceDir))
      .filter(f => f.endsWith('.md'))
      .sort(); // Sorts by filename (01, 02, etc.)

    let combinedContent = '---\ntitle: "Campaign Guide"\n---\n\n';

    for (const file of files) {
      const content = await fs.readFile(path.join(sourceDir, file), 'utf-8');
      // Remove frontmatter from individual files
      const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n\n/, '');
      combinedContent += withoutFrontmatter + '\n\n---\n\n';
    }

    // Write to Obsidian root first
    await fs.writeFile(obsidianFile, combinedContent);
    // Then copy to wiki root
    await fs.writeFile(destFile, combinedContent);
    console.log('📚 Built Campaign-Guide.md in Obsidian root and wiki');
  } catch (err) {
    console.error('Error building Campaign Guide:', err);
  }
}

// Initial sync - copy all files except GM folder
console.log('🔄 Starting initial sync...');
await fs.copy(SOURCE_DIR, DEST_DIR, {
  overwrite: true,
  filter: (src) => {
    // Skip .obsidian folder, hidden files, GM folder, and README
    const relativePath = path.relative(SOURCE_DIR, src);
    const basename = path.basename(src);
    return !src.includes('/.obsidian') &&
           !basename.startsWith('.') &&
           !relativePath.startsWith('GM') &&
           relativePath !== 'GM' &&
           basename !== 'README.md';
  }
});

// Build the combined Campaign Guide
await buildCampaignGuide();

console.log('✅ Initial sync complete!');

// Watch for changes
console.log('👀 Watching for changes in:', SOURCE_DIR);
const watcher = chokidar.watch(SOURCE_DIR, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true
});

watcher
  .on('add', async (filePath) => {
    const relativePath = path.relative(SOURCE_DIR, filePath);
    const basename = path.basename(filePath);
    // Rebuild Campaign Guide if source changed
    if (relativePath.startsWith('GM/Campaign Guide Source')) {
      await buildCampaignGuide();
      return;
    }
    // Skip GM folder and README
    if (relativePath.startsWith('GM') || basename === 'README.md') return;
    const destPath = path.join(DEST_DIR, relativePath);
    await fs.copy(filePath, destPath);
    console.log(`✨ Added: ${relativePath}`);
  })
  .on('change', async (filePath) => {
    const relativePath = path.relative(SOURCE_DIR, filePath);
    const basename = path.basename(filePath);
    // Rebuild Campaign Guide if source changed
    if (relativePath.startsWith('GM/Campaign Guide Source')) {
      await buildCampaignGuide();
      return;
    }
    // Skip GM folder and README
    if (relativePath.startsWith('GM') || basename === 'README.md') return;
    const destPath = path.join(DEST_DIR, relativePath);
    await fs.copy(filePath, destPath);
    console.log(`🔄 Updated: ${relativePath}`);
  })
  .on('unlink', async (filePath) => {
    const relativePath = path.relative(SOURCE_DIR, filePath);
    const basename = path.basename(filePath);
    // Rebuild Campaign Guide if source changed
    if (relativePath.startsWith('GM/Campaign Guide Source')) {
      await buildCampaignGuide();
      return;
    }
    // Skip GM folder and README
    if (relativePath.startsWith('GM') || basename === 'README.md') return;
    const destPath = path.join(DEST_DIR, relativePath);
    await fs.remove(destPath);
    console.log(`🗑️  Removed: ${relativePath}`);
  });

console.log('✅ Sync script running. Press Ctrl+C to stop.');

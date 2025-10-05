# Agent Instructions for Stormhaven Wiki

## Project Purpose

This is an Astro-based wiki that automatically syncs player-facing D&D campaign content from an Obsidian vault. The wiki displays campaign guide materials for the Stormhaven campaign while **excluding GM-only content**.

## Key Architecture

### Source Content
- **Source Vault**: `/mnt/c/Users/perin/Documents/D&D Notebook/Personal/D&D/Stormhaven`
- **Player Content**: `Campaign Guide/` folder (all subfolders and files)
- **GM Content**: `GM/` folder (EXCLUDED from wiki)

### Sync System
- **File Watcher**: `sync.js` - Watches Obsidian vault and syncs changes
- **LaTeX Converter**: `convert-latex.js` - Handles math expressions
- **Target**: `src/pages/` - Where Astro renders markdown into pages

### Technology Stack
- **Framework**: Astro (static site generator)
- **Content Format**: Markdown with Obsidian wikilinks
- **Build Tool**: Vite (via Astro)
- **Package Manager**: npm

## Working with This Project

### Local Development
```bash
npm run dev   # Start dev server at localhost:4321
npm run sync  # Run file watcher for Obsidian changes
npm run build # Build for production
```

### File Sync Behavior
The sync system:
1. Watches the Obsidian Campaign Guide folder
2. Converts Obsidian wikilinks (`[[Page Name]]`) to Astro-compatible links
3. Handles LaTeX math expressions
4. Copies files to `src/pages/` maintaining folder structure
5. **Never syncs the GM/ folder**

### Important Constraints

**DO NOT**:
- Modify `sync.js` without understanding it may expose GM content
- Change file paths that could sync GM-only materials
- Break the wikilink conversion (players need working internal links)
- Modify the Obsidian vault structure directly (work in wiki if making layout changes)

**DO**:
- Test both `npm run dev` and `npm run sync` when making changes
- Preserve the Campaign Guide folder structure
- Maintain markdown compatibility with both Obsidian and Astro
- Keep the README.md updated if changing sync behavior

## Common Agent Tasks

### Adding New Features
1. Check if it affects the sync process
2. Ensure GM content remains excluded
3. Test with actual Obsidian markdown (wikilinks, frontmatter, etc.)
4. Verify both local dev and build work

### Debugging Sync Issues
1. Check `sync.js` for file watching logic
2. Verify source paths point to correct Obsidian folders
3. Test wikilink conversion edge cases
4. Confirm GM folder exclusion is working

### Content Updates
- The wiki is **read-only** from Obsidian's perspective
- Content changes should happen in the Obsidian vault
- The sync automatically updates the wiki

### Styling/Layout Changes
- Astro components live in `src/`
- Public assets in `public/`
- Page layouts can be modified without affecting sync

## Git & Deployment

### Git Status
- This is a **private repository**
- Contains no GM secrets (they're excluded)
- Tracks only the wiki code and synced player content

### Future Deployment Considerations
- Astro builds to static HTML (deployable anywhere)
- Consider automating sync before deploy
- May want to gitignore `src/pages/` and regenerate on deploy

## Project Context

This wiki is part of a D&D campaign management system where:
- The DM writes content in Obsidian (comfortable editing environment)
- Players access content via the web wiki (beautiful, searchable interface)
- GM secrets stay in Obsidian only (security through folder exclusion)
- Changes sync automatically (low maintenance)

## Questions to Ask

When working on this project, consider:
1. "Does this change affect what content gets synced?"
2. "Could this accidentally expose GM content?"
3. "Will this break Obsidian wikilinks?"
4. "Does this work with both dev and production builds?"
5. "Is this change needed in the wiki or in the Obsidian vault?"

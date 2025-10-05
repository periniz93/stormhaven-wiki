# Stormhaven Wiki

An Astro-based wiki that syncs content from an Obsidian vault containing D&D campaign materials.

## Overview

This wiki automatically syncs player-facing content from the Stormhaven campaign Obsidian vault located at:
`/mnt/c/Users/perin/Documents/D&D Notebook/Personal/D&D/Stormhaven`

**GM-only content is excluded** from the wiki to keep secrets safe from players.

## 🚀 Project Structure

```text
/
├── public/           # Static assets
├── src/
│   └── pages/        # Wiki pages (auto-synced from Obsidian)
├── sync.js           # File watcher that syncs Obsidian → Wiki
├── convert-latex.js  # LaTeX conversion utility
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run sync`            | Runs file watcher to sync Obsidian changes       |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## Content Sync

The sync watches the Campaign Guide folder in the Obsidian vault and:
- Copies all player-facing content
- Excludes the GM/ folder entirely
- Converts Obsidian wikilinks and markdown to Astro-compatible format
- Handles LaTeX math expressions

### Synced Content Structure

**Campaign Guide/** (all synced):
1. Main campaign guide articles (01-10)
2. Districts/
3. Factions/
4. Great Houses/
5. Setting/
6. Weather/

**GM/** (excluded from sync):
- GM PDF Docs
- World Building
- NPCs
- Plot hooks and secrets

## 👀 Learn More

- [Astro Documentation](https://docs.astro.build)
- [Astro Discord](https://astro.build/chat)

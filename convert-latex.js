import fs from 'fs-extra';
import path from 'path';

const LATEX_DIR = path.resolve('/mnt/c/Users/perin/Documents/Stormhaven___The_Stormy_City/Stormhaven-LaTex/tex');
const TARGET_DIR = path.resolve('/mnt/c/Users/perin/Documents/D&D Notebook/Personal/D&D/Stormhaven/Campaign Docs/Player PDF Docs');

// Simple LaTeX to Markdown converter
function latexToMarkdown(content) {
  let md = content;

  // Remove LaTeX comments
  md = md.replace(/%.*$/gm, '');

  // Convert section headers
  md = md.replace(/\\section\*\{([^}]+)\}/g, '## $1');
  md = md.replace(/\\subsection\*\{([^}]+)\}/g, '### $1');
  md = md.replace(/\\paragraph\{([^}]+)\}/g, '#### $1');

  // Convert text formatting
  md = md.replace(/\\textbf\{([^}]+)\}/g, '**$1**');
  md = md.replace(/\\textit\{([^}]+)\}/g, '*$1*');
  md = md.replace(/\\emph\{([^}]+)\}/g, '*$1*');
  md = md.replace(/\\textemdash\{\}/g, '—');

  // Convert itemize/enumerate
  md = md.replace(/\\begin\{itemize\}[\s\S]*?\\end\{itemize\}/g, (match) => {
    return match
      .replace(/\\begin\{itemize\}.*?\n/g, '')
      .replace(/\\end\{itemize\}/g, '')
      .replace(/\\item\s+/g, '- ')
      .trim();
  });

  // Convert description lists
  md = md.replace(/\\begin\{description\}[\s\S]*?\\end\{description\}/g, (match) => {
    return match
      .replace(/\\begin\{description\}.*?\n/g, '')
      .replace(/\\end\{description\}/g, '')
      .replace(/\\item\[([^\]]+)\]\s+/g, '**$1** — ')
      .replace(/\\raggedright/g, '')
      .trim();
  });

  // Remove LaTeX table environments but keep content indication
  md = md.replace(/\\begin\{DndTable\}[\s\S]*?\\end\{DndTable\}/g, (match) => {
    return '\n[TABLE CONTENT - See original]\n';
  });

  md = md.replace(/\\begin\{table\*\}[\s\S]*?\\end\{table\*\}/g, (match) => {
    return '\n[TABLE CONTENT - See original]\n';
  });

  // Convert sidebars
  md = md.replace(/\\begin\{DndSidebar\}\{([^}]+)\}[\s\S]*?\\end\{DndSidebar\}/g, (match, title) => {
    let content = match
      .replace(/\\begin\{DndSidebar\}\{[^}]+\}/, '')
      .replace(/\\end\{DndSidebar\}/, '')
      .trim();
    return `\n#### ${title}\n\n${content}\n`;
  });

  // Convert DndComment
  md = md.replace(/\\begin\{DndComment\}\{([^}]+)\}[\s\S]*?\\end\{DndComment\}/g, (match, title) => {
    let content = match
      .replace(/\\begin\{DndComment\}\{[^}]+\}/, '')
      .replace(/\\end\{DndComment\}/, '')
      .trim();
    return `\n> **${title}**: ${content}\n`;
  });

  // Remove remaining LaTeX commands
  md = md.replace(/\\clearpage/g, '---');
  md = md.replace(/\\newpage/g, '\n---\n');
  md = md.replace(/\\bigskip/g, '\n');
  md = md.replace(/\\medskip/g, '\n');
  md = md.replace(/\\vspace\{[^}]+\}/g, '');
  md = md.replace(/\\noindent/g, '');
  md = md.replace(/\\begingroup/g, '');
  md = md.replace(/\\endgroup/g, '');
  md = md.replace(/\\label\{[^}]+\}/g, '');
  md = md.replace(/\\providecolor\{[^}]+\}\{[^}]+\}\{[^}]+\}/g, '');
  md = md.replace(/\\DndSetThemeColor\[[^\]]+\]/g, '');
  md = md.replace(/\\DndFontTable[^\s]+/g, '');
  md = md.replace(/\\StormhavenIcon[^\s]+/g, '');
  md = md.replace(/\\addcontentsline\{[^}]+\}\{[^}]+\}\{[^}]+\}/g, '');

  // Clean up spacing
  md = md.replace(/\n{3,}/g, '\n\n');
  md = md.trim();

  return md;
}

async function main() {
  console.log('🔄 Converting LaTeX files to Markdown...\n');

  const files = await fs.readdir(LATEX_DIR);
  const texFiles = files.filter(f => f.endsWith('.tex'));

  for (const file of texFiles) {
    const latexPath = path.join(LATEX_DIR, file);
    const content = await fs.readFile(latexPath, 'utf-8');
    const markdown = latexToMarkdown(content);

    const mdFileName = file.replace('.tex', '.md');
    const targetPath = path.join(TARGET_DIR, mdFileName);

    await fs.writeFile(targetPath, markdown);
    console.log(`✅ Converted: ${file} → ${mdFileName}`);
  }

  console.log('\n✨ Conversion complete!');
}

main().catch(console.error);

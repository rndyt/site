import { copyFile, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { basename, dirname, extname, join, posix, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const sourceArgument = process.env.OBSIDIAN_BLOG_DIR ?? process.argv[2];
if (!sourceArgument) {
  console.error('请通过 OBSIDIAN_BLOG_DIR 或第一个参数指定 Obsidian Blog 文件夹。');
  process.exit(1);
}
const sourceRoot = resolve(sourceArgument);
const destinationRoot = resolve(process.env.OBSIDIAN_BLOG_DEST ?? join(repoRoot, 'src/content/blog'));
const manifestPath = join(destinationRoot, '.obsidian-sync-manifest.json');

const toPosix = (value) => value.split(sep).join('/');
const isMarkdown = (path) => ['.md', '.mdx'].includes(extname(path).toLowerCase());
const isHidden = (name) => name.startsWith('.');

async function walk(root, current = root) {
  const entries = await readdir(current, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (isHidden(entry.name) || entry.isSymbolicLink()) continue;
    const fullPath = join(current, entry.name);
    if (entry.isDirectory()) files.push(...await walk(root, fullPath));
    if (entry.isFile()) files.push(toPosix(relative(root, fullPath)));
  }

  return files.sort((a, b) => a.localeCompare(b, 'zh-CN'));
}

function stripMarkdown(value) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function metadataFor(content, sourcePath, sourceStat) {
  const withoutFrontmatter = content.replace(/^---\s*\r?\n[\s\S]*?\r?\n---\s*\r?\n?/, '');
  const heading = withoutFrontmatter.match(/^#\s+(.+)$/m)?.[1]?.trim();
  const title = stripMarkdown(heading ?? basename(sourcePath, extname(sourcePath)));
  const description = withoutFrontmatter
    .split(/\r?\n\s*\r?\n/)
    .map(stripMarkdown)
    .find((paragraph) => paragraph && paragraph !== title && !paragraph.startsWith('```'))
    ?.slice(0, 160) ?? title;
  const sourceDate = sourceStat.birthtimeMs > 0 ? sourceStat.birthtime : sourceStat.mtime;

  return {
    title,
    description,
    date: sourceDate.toISOString().slice(0, 10),
  };
}

function ensureFrontmatter(content, metadata) {
  const match = content.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n)?/);
  const required = {
    title: JSON.stringify(metadata.title),
    description: JSON.stringify(metadata.description),
    date: metadata.date,
    tags: '[]',
    featured: 'false',
    preview: 'true',
    kind: 'article',
  };

  if (!match) {
    const lines = Object.entries(required).map(([key, value]) => `${key}: ${value}`);
    return `---\n${lines.join('\n')}\n---\n\n${content.trimStart()}`;
  }

  const frontmatter = match[1];
  const additions = Object.entries(required)
    .filter(([key]) => !new RegExp(`^${key}\\s*:`, 'm').test(frontmatter))
    .map(([key, value]) => `${key}: ${value}`);

  if (additions.length === 0) return content;
  const updated = `${frontmatter.trimEnd()}\n${additions.join('\n')}`;
  return content.replace(match[0], `---\n${updated}\n---\n\n`);
}

function encodeRelativePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}

function buildLookup(files) {
  const byRelative = new Map();
  const byBasename = new Map();

  for (const file of files) {
    const normalized = posix.normalize(file);
    byRelative.set(normalized.toLocaleLowerCase('en-US'), normalized);
    const key = basename(normalized).toLocaleLowerCase('en-US');
    const matches = byBasename.get(key) ?? [];
    matches.push(normalized);
    byBasename.set(key, matches);
  }

  return { byRelative, byBasename };
}

function resolveLink(target, notePath, lookup, extensions = ['']) {
  const cleanTarget = target.replace(/^\//, '').trim();
  const candidates = [];
  for (const extension of extensions) {
    candidates.push(posix.normalize(posix.join(posix.dirname(notePath), `${cleanTarget}${extension}`)));
    candidates.push(posix.normalize(`${cleanTarget}${extension}`));
  }

  for (const candidate of candidates) {
    const match = lookup.byRelative.get(candidate.toLocaleLowerCase('en-US'));
    if (match) return match;
  }

  for (const extension of extensions) {
    const matches = lookup.byBasename.get(basename(`${cleanTarget}${extension}`).toLocaleLowerCase('en-US'));
    if (matches?.length === 1) return matches[0];
  }

  return undefined;
}

function convertObsidianLinks(content, notePath, lookup, warnings) {
  const withEmbeds = content.replace(/!\[\[([^\]]+)\]\]/g, (original, value) => {
    const [rawTarget, rawLabel] = value.split('|');
    const target = rawTarget.trim();
    const extension = extname(target).toLowerCase();
    const label = rawLabel?.trim();

    if (['.md', '.mdx', ''].includes(extension)) {
      const noteTarget = resolveLink(target.replace(/\.(md|mdx)$/i, ''), notePath, lookup, ['.md', '.mdx']);
      if (noteTarget) {
        const href = articleHref(notePath, noteTarget);
        return `[${label && !/^\d+(?:x\d+)?$/.test(label) ? label : basename(target, extension)}](${href})`;
      }
    }

    const assetTarget = resolveLink(target, notePath, lookup);
    if (!assetTarget) {
      warnings.add(`${notePath}: 找不到附件 ${target}`);
      return original;
    }

    let href = posix.relative(posix.dirname(notePath), assetTarget);
    if (!href.startsWith('.')) href = `./${href}`;
    const alt = label && !/^\d+(?:x\d+)?$/.test(label) ? label : basename(target, extension);
    return `![${alt}](${encodeRelativePath(href)})`;
  });

  return withEmbeds.replace(/(?<!!)\[\[([^\]]+)\]\]/g, (_original, value) => {
    const [rawTarget, rawLabel] = value.split('|');
    const target = rawTarget.split('#')[0].trim();
    const noteTarget = resolveLink(target.replace(/\.(md|mdx)$/i, ''), notePath, lookup, ['.md', '.mdx']);
    if (!noteTarget) {
      warnings.add(`${notePath}: 找不到双链目标 ${target}`);
      return rawLabel?.trim() ?? target;
    }
    return `[${rawLabel?.trim() ?? basename(target, extname(target))}](${articleHref(notePath, noteTarget)})`;
  });
}

function articleHref(fromNote, toNote) {
  const fromRoute = posix.join('blog', fromNote.replace(/\.(md|mdx)$/i, ''));
  const toRoute = posix.join('blog', toNote.replace(/\.(md|mdx)$/i, ''));
  const href = posix.relative(fromRoute, toRoute);
  return `${href || '.'}/`;
}

async function readPreviousManifest() {
  try {
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    return Array.isArray(manifest.files) ? manifest.files : [];
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

async function removeEmptyDirectories(current) {
  const entries = await readdir(current, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) await removeEmptyDirectories(join(current, entry.name));
  }
  if (current !== destinationRoot && (await readdir(current)).length === 0) await rm(current, { recursive: true });
}

async function main() {
  const sourceInfo = await stat(sourceRoot);
  if (!sourceInfo.isDirectory()) throw new Error(`Obsidian Blog 路径不是文件夹：${sourceRoot}`);

  const files = await walk(sourceRoot);
  const lookup = buildLookup(files);
  const warnings = new Set();
  const previousFiles = await readPreviousManifest();

  await mkdir(destinationRoot, { recursive: true });

  for (const relativePath of files) {
    const sourcePath = join(sourceRoot, relativePath);
    const destinationPath = join(destinationRoot, relativePath);
    await mkdir(dirname(destinationPath), { recursive: true });

    if (!isMarkdown(relativePath)) {
      await copyFile(sourcePath, destinationPath);
      continue;
    }

    const original = await readFile(sourcePath, 'utf8');
    const sourceStat = await stat(sourcePath);
    const withMetadata = ensureFrontmatter(original, metadataFor(original, sourcePath, sourceStat));
    const converted = convertObsidianLinks(withMetadata, relativePath, lookup, warnings);
    await writeFile(destinationPath, converted.endsWith('\n') ? converted : `${converted}\n`, 'utf8');
  }

  for (const oldFile of previousFiles) {
    if (!files.includes(oldFile)) await rm(join(destinationRoot, oldFile), { force: true });
  }
  await removeEmptyDirectories(destinationRoot);

  await writeFile(manifestPath, `${JSON.stringify({ version: 1, files }, null, 2)}\n`, 'utf8');

  console.log(`已同步 ${files.filter(isMarkdown).length} 篇文章和 ${files.filter((file) => !isMarkdown(file)).length} 个附件。`);
  for (const warning of warnings) console.warn(`警告：${warning}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

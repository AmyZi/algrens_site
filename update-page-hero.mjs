#!/usr/bin/env node
// update-page-hero.mjs
//
// 1. Finds the CSS/SCSS file that contains the .page-hero rules.
// 2. Removes every top-level .page-hero* rule (including ones inside @media),
//    plus the global `.breadcrumb-item a` rule that recolors all breadcrumbs.
// 3. Appends the new token-based PageHero styles to the same file.
// 4. Patches PageHero.jsx: eyebrow <h6> -> <p>, and only opens external
//    secondary CTAs in a new tab.
//
// Usage:
//   node update-page-hero.mjs [root=src]            # dry run, prints what would change
//   node update-page-hero.mjs [root=src] --apply    # writes files, keeps .bak backups
//
// Prerequisite: the tokens from _tokens.scss (--surface-inverse, --accent, --space-*, etc.)
// must already be loaded globally, otherwise the new rules have no values.

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ROOT = args.find((a) => !a.startsWith('--')) ?? 'src';
const MARKER = '/* PageHero v2 */';

const NEW_CSS = `${MARKER}

.page-hero {
  background-color: var(--surface-inverse);
  color: var(--text-inverse);
  padding: clamp(80px, 10vw, 120px) 0 0;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.page-hero__eyebrow {
  color: var(--accent);
  font-weight: var(--fw-bold);
  font-size: var(--fs-xs);
  letter-spacing: var(--tracking-eyebrow);
  text-transform: uppercase;
  margin-bottom: var(--space-4);
}

.page-hero__title {
  font-size: clamp(2.25rem, 8vw, 5rem);
  font-weight: 900;
  letter-spacing: -0.04em;
  line-height: 1;
  margin-bottom: var(--space-5);
  color: var(--text-inverse);
}

.page-hero__title-accent {
  -webkit-text-stroke: 2px var(--accent);
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.page-hero__subtitle,
.page-hero__description {
  max-width: 600px;
  line-height: var(--lh-body);
  color: color-mix(in srgb, var(--text-inverse) 85%, transparent);
}

.page-hero__subtitle {
  font-size: var(--fs-md);
  font-weight: var(--fw-medium);
  margin-bottom: 0;
}

.page-hero__description {
  font-size: var(--fs-base);
  margin-top: var(--space-4);
}

.page-hero__breadcrumb,
.page-hero__breadcrumb a {
  color: color-mix(in srgb, var(--text-inverse) 70%, transparent);
  font-size: var(--fs-sm);
}

.page-hero__breadcrumb a:hover {
  color: var(--accent);
}

.page-hero__badge-bar {
  width: 100%;
  margin-top: var(--space-8);
  padding: var(--space-4) var(--space-5);
  background-color: color-mix(in srgb, var(--surface-inverse) 70%, black);
  border-top: 1px solid var(--line-inverse);
}

.page-hero__badge-bar-inner {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.page-hero__badge {
  color: var(--text-inverse);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
}

@media (max-width: 576px) {
  .page-hero__title {
    letter-spacing: -0.02em;
  }

  .page-hero__title-accent {
    -webkit-text-stroke-width: 1px;
  }
}
`;

// ---------------------------------------------------------------- helpers

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.next' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

// Split CSS into top-level parts: each rule/at-rule block (with any preceding
// comments attached) or a `;`-terminated statement such as @import.
function splitTopLevel(css) {
  const parts = [];
  let depth = 0;
  let start = 0;
  let i = 0;
  while (i < css.length) {
    const c = css[i];
    if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end === -1 ? css.length : end + 2;
      continue;
    }
    if (c === '"' || c === "'") {
      i++;
      while (i < css.length && css[i] !== c) {
        if (css[i] === '\\') i++;
        i++;
      }
      i++;
      continue;
    }
    if (c === '{') {
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        parts.push(css.slice(start, i + 1));
        start = i + 1;
      }
    } else if (c === ';' && depth === 0) {
      parts.push(css.slice(start, i + 1));
      start = i + 1;
    }
    i++;
  }
  if (start < css.length) parts.push(css.slice(start));
  return parts;
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '');
const selectorOf = (part) => stripComments(part).split('{')[0].trim();
const PAGE_HERO = /\.page-hero(?![A-Za-z0-9])/;

function filterRules(css, removed) {
  const kept = [];
  for (const part of splitTopLevel(css)) {
    const sel = selectorOf(part);

    if (/^@(media|supports|container|layer)\b/.test(sel) && part.includes('{')) {
      const open = part.indexOf('{');
      const close = part.lastIndexOf('}');
      const inner = filterRules(part.slice(open + 1, close), removed);
      if (inner.trim() === '') {
        removed.push(`${sel}  (emptied)`);
        continue;
      }
      kept.push(part.slice(0, open + 1) + inner + part.slice(close));
      continue;
    }

    if (PAGE_HERO.test(sel) || sel === '.breadcrumb-item a') {
      removed.push(sel.replace(/\s+/g, ' '));
      continue;
    }

    // A leftover "PageHero" section-header comment with no rule attached.
    if (!part.includes('{') && /PageHero/.test(part)) continue;

    kept.push(part);
  }
  return kept.join('');
}

// ---------------------------------------------------------------- CSS step

if (!fs.existsSync(ROOT)) {
  console.error(`Root folder not found: ${ROOT}`);
  process.exit(1);
}

const allFiles = walk(ROOT);
const cssCandidates = allFiles.filter(
  (f) => /\.s?css$/.test(f) && fs.readFileSync(f, 'utf8').includes('.page-hero'),
);

if (cssCandidates.length === 0) {
  console.error('No CSS/SCSS file containing .page-hero was found.');
  process.exit(1);
}
if (cssCandidates.length > 1) {
  console.warn('Several files mention .page-hero; using the first one:');
  cssCandidates.forEach((f) => console.warn('  -', f));
}

const cssPath = cssCandidates[0];
const cssOriginal = fs.readFileSync(cssPath, 'utf8');

console.log(`CSS file: ${cssPath}`);

if (cssOriginal.includes(MARKER)) {
  console.log('  PageHero v2 styles are already present, skipping CSS step.');
} else {
  const removed = [];
  const kept = filterRules(cssOriginal, removed).replace(/\n{3,}/g, '\n\n').trimEnd();
  const cssNext = `${kept}\n\n${NEW_CSS}`;

  console.log('  Rules removed:');
  removed.forEach((s) => console.log(`    - ${s}`));
  console.log(`  Size: ${cssOriginal.length} -> ${cssNext.length} bytes`);

  if (APPLY) {
    fs.writeFileSync(`${cssPath}.bak`, cssOriginal);
    fs.writeFileSync(cssPath, cssNext);
    console.log(`  Written. Backup: ${cssPath}.bak`);
  }
}

// ---------------------------------------------------------------- JSX step

const jsxPath = allFiles.find((f) => /(^|[\\/])PageHero\.(jsx|js|tsx)$/.test(f));
console.log(`\nComponent: ${jsxPath ?? 'PageHero component not found'}`);

if (jsxPath) {
  const jsxOriginal = fs.readFileSync(jsxPath, 'utf8');
  let jsx = jsxOriginal;
  const notes = [];

  // Eyebrow: <h6 className="page-hero__eyebrow">...</h6> -> <p ...>...</p>
  const eyebrowRe = /<h6(\s+className="page-hero__eyebrow")>([\s\S]*?)<\/h6>/;
  if (eyebrowRe.test(jsx)) {
    jsx = jsx.replace(eyebrowRe, '<p$1>$2</p>');
    notes.push('eyebrow <h6> -> <p>');
  } else {
    notes.push('eyebrow: pattern not found (already changed?)');
  }

  // Secondary CTA: only external links get target=_blank
  const ctaRe =
    /<a\s+href=\{secondaryCta\.href\}\s+target="_blank"\s+rel="noopener noreferrer"\s+className="hero-btn hero-btn--outline"\s*>/;
  if (ctaRe.test(jsx)) {
    jsx = jsx.replace(
      ctaRe,
      `<a
                      href={secondaryCta.href}
                      {...(/^https?:/.test(secondaryCta.href)
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                      className="hero-btn hero-btn--outline"
                    >`,
    );
    notes.push('secondary CTA: target=_blank only for http(s) links');
  } else {
    notes.push('secondary CTA: pattern not found (already changed?)');
  }

  notes.forEach((n) => console.log(`  - ${n}`));

  if (APPLY && jsx !== jsxOriginal) {
    fs.writeFileSync(`${jsxPath}.bak`, jsxOriginal);
    fs.writeFileSync(jsxPath, jsx);
    console.log(`  Written. Backup: ${jsxPath}.bak`);
  }
}

console.log(APPLY ? '\nDone.' : '\nDry run only. Re-run with --apply to write changes.');
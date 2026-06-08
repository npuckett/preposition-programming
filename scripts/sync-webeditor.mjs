#!/usr/bin/env node
/**
 * @deprecated Use p5-webeditor-sync CLI instead.
 *
 *   npx p5-webeditor-sync push --batch all
 *   npx p5-webeditor-sync verify --batch all
 *
 * See docs/web-editor-sync.md
 */
console.error(`This script is deprecated. Use p5-webeditor-sync instead:

  npm run sync:webeditor
  npm run verify:webeditor

Docs: docs/web-editor-sync.md
`);
process.exit(1);

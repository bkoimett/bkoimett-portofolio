/* Filed copy arrives in two shapes: structured blocks authored with the
   records, and free text typed into the console. Both are rendered as a
   document. Nothing here writes markdown; the parser only reads the subset
   an editor is likely to type. */

/* Inline marks are returned as data so the parser stays free of markup and
   the component decides how a link or a piece of code is presented. */
export const parseInline = (text) => {
  const parts = [];
  let cursor = 0;

  while (cursor < text.length) {
    const code = /`([^`]+)`/.exec(text.slice(cursor));
    const link = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(text.slice(cursor));
    const next = [code && { at: code.index, kind: 'code' }, link && { at: link.index, kind: 'link' }]
      .filter(Boolean)
      .sort((a, b) => a.at - b.at)[0];

    if (!next) {
      if (text.slice(cursor)) parts.push({ type: 'text', value: text.slice(cursor) });
      break;
    }
    if (next.at > 0) parts.push({ type: 'text', value: text.slice(cursor, cursor + next.at) });

    if (next.kind === 'code') {
      parts.push({ type: 'code', value: code[1] });
      cursor += code.index + code[0].length;
    } else {
      parts.push({ type: 'link', value: link[1], href: link[2] });
      cursor += link.index + link[0].length;
    }
  }

  return parts;
};

const splitRow = (line) =>
  line
    .replace(/^\s*\|/, '')
    .replace(/\|\s*$/, '')
    .split('|')
    .map((cell) => cell.trim());

/* Reads the markdown subset an editor is likely to type, so console copy
   lands as a document without the page depending on a markdown runtime. */
export const toBlocks = (text) => {
  if (!text) return [];
  const lines = String(text).replace(/\r\n/g, '\n').split('\n');
  const blocks = [];
  let paragraph = [];
  let list = null;
  let quote = [];
  let code = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: 'p', text: paragraph.join(' ') });
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      blocks.push(list);
      list = null;
    }
  };
  const flushQuote = () => {
    if (quote.length) {
      blocks.push({ type: 'quote', text: quote.join(' ') });
      quote = [];
    }
  };
  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();

    if (code !== null) {
      if (trimmed.startsWith('```')) {
        blocks.push({ type: 'code', text: code.join('\n') });
        code = null;
      } else {
        code.push(line);
      }
      continue;
    }

    if (trimmed.startsWith('```')) {
      flushAll();
      code = [];
      continue;
    }

    if (!trimmed) {
      flushAll();
      continue;
    }

    if (/^(---|\*\*\*|___)$/.test(trimmed)) {
      flushAll();
      blocks.push({ type: 'hr' });
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(trimmed);
    if (heading) {
      flushAll();
      const level = Math.min(Math.max(heading[1].length, 2), 4);
      blocks.push({ type: `h${level}`, text: heading[2].trim() });
      continue;
    }

    if (/^\|.*\|$/.test(trimmed) && /^\|?[\s:|-]+\|?$/.test(lines[i + 1]?.trim() || '')) {
      flushAll();
      const head = splitRow(trimmed);
      const rows = [];
      i += 1;
      while (i < lines.length && /^\s*\|.*\|$/.test(lines[i])) {
        rows.push(splitRow(lines[i]));
        i += 1;
      }
      i -= 1;
      blocks.push({ type: 'table', head, rows });
      continue;
    }

    const bullet = /^[-*+]\s+(.*)$/.exec(trimmed);
    if (bullet) {
      flushParagraph();
      flushQuote();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(bullet[1]);
      continue;
    }

    const numbered = /^\d+[.)]\s+(.*)$/.exec(trimmed);
    if (numbered) {
      flushParagraph();
      flushQuote();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(numbered[1]);
      continue;
    }

    const quoted = /^>\s?(.*)$/.exec(trimmed);
    if (quoted) {
      flushParagraph();
      flushList();
      quote.push(quoted[1]);
      continue;
    }

    flushList();
    flushQuote();
    paragraph.push(trimmed);
  }

  if (code !== null) blocks.push({ type: 'code', text: code.join('\n') });
  flushAll();
  return blocks;
};

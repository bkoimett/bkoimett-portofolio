import React from 'react';
import { parseInline, toBlocks } from '../../utils/richText';

const Inline = ({ text }) =>
  parseInline(text || '').map((part, i) => {
    if (part.type === 'code') return <code key={i}>{part.value}</code>;
    if (part.type === 'link') {
      const external = /^https?:\/\//i.test(part.href);
      return (
        <a
          key={i}
          href={part.href}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {part.value}
        </a>
      );
    }
    return <React.Fragment key={i}>{part.value}</React.Fragment>;
  });

const Block = ({ block }) => {
  switch (block.type) {
    case 'h2':
      return <h2><Inline text={block.text} /></h2>;
    case 'h3':
      return <h3><Inline text={block.text} /></h3>;
    case 'h4':
      return <h4><Inline text={block.text} /></h4>;
    case 'ul':
      return (
        <ul>
          {block.items.map((item, i) => (
            <li key={i}><Inline text={item} /></li>
          ))}
        </ul>
      );
    case 'ol':
      return (
        <ol>
          {block.items.map((item, i) => (
            <li key={i}><Inline text={item} /></li>
          ))}
        </ol>
      );
    case 'code':
      return (
        <pre>
          <code>{block.text}</code>
        </pre>
      );
    case 'quote':
      return <blockquote><Inline text={block.text} /></blockquote>;
    case 'hr':
      return <hr />;
    case 'table':
      return (
        <table>
          <thead>
            <tr>
              {block.head.map((cell, i) => (
                <th key={i}><Inline text={cell} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c}><Inline text={cell} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    default:
      return <p><Inline text={block.text} /></p>;
  }
};

const RichText = ({ blocks, text, className = '' }) => {
  const resolved = blocks || toBlocks(text);
  if (!resolved.length) return null;

  return (
    <div className={`rich-text ${className}`}>
      {resolved.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
};

export default RichText;

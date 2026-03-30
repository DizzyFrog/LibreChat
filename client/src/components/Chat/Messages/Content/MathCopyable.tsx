import React, { useState, useCallback } from 'react';

type MathCopyableNode = {
  properties?: {
    dataLatex?: string;
    dataDisplay?: string;
  };
};

type Props = {
  children?: React.ReactNode;
  node?: MathCopyableNode;
};

export default function MathCopyable({ children, node }: Props) {
  const [copied, setCopied] = useState(false);
  const latex = node?.properties?.dataLatex ?? '';
  const isBlock = node?.properties?.dataDisplay === 'block';

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!latex || copied) return;
      navigator.clipboard.writeText(latex).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    },
    [latex, copied],
  );

  return (
    <span
      role="button"
      tabIndex={0}
      aria-label="Copy LaTeX formula"
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e as unknown as React.MouseEvent)}
      className={`math-copyable${isBlock ? ' math-copyable--block' : ' math-copyable--inline'}`}
    >
      <span className={`math-copy-btn${copied ? ' math-copy-btn--copied' : ''}`}>
        {copied ? 'Copied' : 'Copy'}
      </span>
      {children}
    </span>
  );
}

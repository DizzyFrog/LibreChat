import { visit } from 'unist-util-visit';
import type { Root, Element, Text } from 'hast';
import type { Plugin } from 'unified';

function findLatex(node: Element): string | null {
  if (
    node.tagName === 'annotation' &&
    node.properties?.encoding === 'application/x-tex'
  ) {
    const child = node.children[0];
    return child?.type === 'text' ? (child as Text).value : null;
  }
  for (const child of node.children) {
    if (child.type === 'element') {
      const result = findLatex(child as Element);
      if (result !== null) return result;
    }
  }
  return null;
}

const rehypeMathCopyable: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'element', (node: Element, index, parent) => {
    if (!parent || index == null) return;

    const classes = (node.properties?.className as string[]) ?? [];
    const isDisplay = classes.includes('katex-display');
    const isInlineKatex = classes.includes('katex') && !isDisplay;

    if (!isDisplay && !isInlineKatex) return;

    if (isInlineKatex) {
      const parentEl = parent as Element;
      const parentClasses = (parentEl.properties?.className as string[]) ?? [];
      if (parentClasses.includes('katex-display')) return;
    }

    const latex = findLatex(node);
    if (!latex) return;

    (parent.children as Element[])[index] = {
      type: 'element',
      tagName: 'math-copyable',
      properties: {
        dataLatex: latex,
        dataDisplay: isDisplay ? 'block' : 'inline',
      },
      children: [node],
    };
  });
};

export default rehypeMathCopyable;

import { useState, useCallback } from 'react';
import { X, PenLine, CornerDownLeft } from 'lucide-react';
import { useLocalize, useSubmitMessage } from '~/hooks';
import { cn } from '~/utils';

/** Strips common list prefixes: numbers, letters, bullets, emoji, dashes */
function stripPrefix(line: string): string {
  return line
    .replace(/^(\d+[.)]\s+|[a-zA-Z][.)]\s+|[-*•]\s+)/, '')
    .replace(/^\p{Emoji_Presentation}\s*/u, '')
    .trim();
}

/**
 * Parses a raw options block (content of a ```options code fence) into option strings.
 * Strips list prefixes so models can use any format they prefer.
 */
export function parseOptionsBlock(content: string): string[] {
  return content
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map(stripPrefix)
    .filter((line) => line.length > 0);
}

type OptionPickerProps = {
  options: string[];
  onDismiss: () => void;
};

const OptionPicker = ({ options, onDismiss }: OptionPickerProps) => {
  const localize = useLocalize();
  const { submitMessage } = useSubmitMessage();
  const [customText, setCustomText] = useState('');

  const handleSelect = useCallback(
    (text: string) => {
      submitMessage({ text });
      onDismiss();
    },
    [submitMessage, onDismiss],
  );

  const handleCustomSubmit = useCallback(() => {
    if (!customText.trim()) return;
    submitMessage({ text: customText.trim() });
    onDismiss();
  }, [customText, submitMessage, onDismiss]);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-border-medium bg-surface-secondary shadow-sm">
      <div className="flex items-center justify-between border-b border-border-light px-4 py-3">
        <span className="text-sm font-medium text-text-primary">
          {localize('com_ui_select_option')}
        </span>
        <button
          onClick={onDismiss}
          aria-label={localize('com_ui_close')}
          className="rounded p-0.5 text-text-tertiary transition-colors hover:text-text-secondary"
        >
          <X size={16} />
        </button>
      </div>
      <div className="divide-y divide-border-light">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleSelect(option)}
            className="flex w-full items-center px-4 py-3.5 text-left transition-colors hover:bg-surface-hover"
          >
            <span
              className={cn(
                'mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
                'bg-surface-tertiary text-sm font-medium text-text-secondary',
              )}
            >
              {index + 1}
            </span>
            <span className="text-sm text-text-primary">{option}</span>
            <CornerDownLeft size={14} className="ml-auto text-text-tertiary opacity-0 group-hover:opacity-100" />
          </button>
        ))}
        <div className="flex items-center px-4 py-3.5">
          <span
            className={cn(
              'mr-3 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full',
              'bg-surface-tertiary text-text-tertiary',
            )}
          >
            <PenLine size={14} />
          </span>
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCustomSubmit();
            }}
            placeholder={localize('com_ui_something_else')}
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary"
          />
          {customText.trim().length > 0 && (
            <button
              onClick={handleCustomSubmit}
              aria-label={localize('com_ui_submit')}
              className="text-text-secondary hover:text-text-primary"
            >
              <CornerDownLeft size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="flex justify-end border-t border-border-light px-4 py-2.5">
        <button
          onClick={onDismiss}
          className="rounded-lg px-3 py-1.5 text-sm text-text-secondary transition-colors hover:bg-surface-tertiary hover:text-text-primary"
        >
          {localize('com_ui_skip')}
        </button>
      </div>
    </div>
  );
};

export default OptionPicker;

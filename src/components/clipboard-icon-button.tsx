import { Copy, Check } from 'lucide-react';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useCopyToClipboard } from 'react-use';
import { cn, Tooltip } from '@nextui-org/react';

interface ClipboardIconButtonProps {
  text?: string;
  size?: string | number;
}

const ClipboardIconButton = ({ text = '', size = 16 }: ClipboardIconButtonProps) => {
  const [state, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState(false);

  const enterTimeout = useRef<NodeJS.Timeout | undefined>();
  const leaveTimeout = useRef<NodeJS.Timeout | undefined>();

  const handleCopy = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.stopPropagation();
      e.preventDefault();
      if (!text) return;
      copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    },
    [copyToClipboard, text]
  );

  useEffect(() => {
    if (state.error) {
      console.error('Copy failed:', state.error);
    }
  }, [state]);

  const handleMouseEnter = useCallback(() => {
    clearTimeout(leaveTimeout.current);
    enterTimeout.current = setTimeout(() => {}, 300);
  }, []);

  const handleMouseLeave = useCallback(() => {
    clearTimeout(enterTimeout.current);
    leaveTimeout.current = setTimeout(() => {}, 300);
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(enterTimeout.current);
      clearTimeout(leaveTimeout.current);
    };
  }, []);

  if (!text) return null;

  return (
    <Tooltip
      color="default"
      content={copied ? 'Copied!' : 'Copy to clipboard'}
      showArrow
      closeDelay={0}
    >
      <div
        onClick={handleCopy}
        className="size-4 cursor-pointer"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Check
          strokeWidth={1.25}
          size={size}
          className={cn(
            'text-muted-foreground hover:text-muted-foreground/80',
            copied ? 'block' : 'hidden'
          )}
        />
        <Copy
          strokeWidth={1.25}
          size={size}
          className={cn(
            'text-muted-foreground hover:text-muted-foreground/80',
            copied ? 'hidden' : 'block'
          )}
        />
      </div>
    </Tooltip>
  );
};

export default ClipboardIconButton;

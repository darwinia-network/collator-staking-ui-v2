import { Button, ButtonProps } from '@nextui-org/react';
import { useState } from 'react';

interface AsyncButtonProps extends ButtonProps {
  loadingText?: string;
}

function AsyncButton({ loadingText, children, ...props }: AsyncButtonProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isPending) return;

    setIsPending(true);
    try {
      await props.onClick?.(e);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Button {...props} onClick={handleClick} isLoading={isPending}>
      {isPending && typeof loadingText === 'string' ? loadingText : children}
    </Button>
  );
}

export default AsyncButton;

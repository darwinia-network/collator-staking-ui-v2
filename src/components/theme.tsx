import { Button, Tooltip } from '@nextui-org/react';
import { Moon, Sun } from 'lucide-react';
import useTheme from '@/hooks/useTheme';

const Theme = () => {
  const { theme, toggle } = useTheme();
  return (
    <Tooltip
      content={theme === 'light' ? 'Switch to Dark mode' : 'Switch to Light mode'}
      color="default"
    >
      <Button
        variant="light"
        className="h-[2.25rem] min-w-0 gap-[0.31rem] rounded-small bg-background px-[0.62rem]"
        onClick={toggle}
      >
        <Moon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 lg:h-[1.2rem] lg:w-[1.2rem]" />
        <Sun className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 lg:h-[1.2rem] lg:w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </Tooltip>
  );
};

export default Theme;

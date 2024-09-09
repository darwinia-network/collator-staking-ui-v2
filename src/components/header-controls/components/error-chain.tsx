import { Button } from '@nextui-org/button';

const DesktopErrorChain = () => {
  return (
    <Button
      color="danger"
      variant="bordered"
      className="h-[2.25rem] w-full max-w-[13rem] flex-shrink-0 gap-[0.31rem] rounded-small bg-background px-[0.62rem] md:w-auto md:min-w-0 md:max-w-none"
    >
      <span>Wrong Network</span>
    </Button>
  );
};

export default DesktopErrorChain;

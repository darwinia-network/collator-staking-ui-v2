import { Button } from '@nextui-org/react';

interface Props {
  title: string;
  message: string;
  buttonText: string;
  action: () => void;
}

const ErrorDisplay = ({ buttonText, action, title, message }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative h-[12.5rem] w-[14.36225rem] shrink-0 object-contain">
        <img alt={title} src="/images/common/404.svg" />
      </div>

      <div className="flex flex-col items-center justify-center">
        <h2 className="m-0 text-center text-[3.125rem] font-bold text-foreground">{title}</h2>
        <p className="m-0 text-center text-[0.875rem] font-bold text-foreground">{message}</p>
      </div>
      <Button
        onClick={action}
        className="h-[2.125rem] gap-[0.3125rem]"
        color="primary"
        variant="flat"
      >
        {buttonText}
      </Button>
    </div>
  );
};

export default ErrorDisplay;

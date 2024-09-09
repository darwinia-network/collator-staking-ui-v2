import { Card, CardBody } from '@nextui-org/card';
import { cn } from '@nextui-org/react';

interface BaseCardProps {
  className?: string;
}

const BaseCard = ({ className, children }: React.PropsWithChildren<BaseCardProps>) => {
  return (
    <Card
      className={cn(
        'mx-auto w-full max-w-[25rem] flex-shrink-0 rounded-medium bg-background md:w-auto',
        className
      )}
    >
      <CardBody className="p-[0.62rem] md:p-5">{children}</CardBody>
    </Card>
  );
};

export default BaseCard;

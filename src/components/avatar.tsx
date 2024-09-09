import { cn } from '@nextui-org/react';
import { blo } from 'blo';

interface AvatarProps {
  address: `0x${string}`;
  className?: string;
}
const Avatar = ({ address, className }: AvatarProps) => {
  return (
    <div className={cn('relative size-6 overflow-hidden rounded-full', className)}>
      <img src={blo(address)} alt="avatar" className="object-contain" loading="lazy" />;
    </div>
  );
};

export default Avatar;

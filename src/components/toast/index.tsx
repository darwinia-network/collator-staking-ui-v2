import { toast } from 'sonner';
import { CircleAlert } from 'lucide-react';

export function success(message: string) {
  toast.success(message, {
    unstyled: true,
    classNames: {
      toast:
        'flex items-center gap-[0.31rem] !bg-background  px-[0.62rem] py-[0.5rem] rounded-medium',
      title: 'text-foreground text-[0.75rem] font-normal',
      icon: 'text-success'
    }
  });
}

export function error(message: string) {
  toast.error(message, {
    classNames: {
      toast:
        'flex items-center gap-[0.31rem] !bg-background  px-[0.62rem] py-[0.5rem] rounded-medium',
      title: 'text-danger text-[0.75rem] font-normal',
      icon: 'mr-0 size-4 text-danger'
    },
    icon: <CircleAlert className="size-4" size={16} strokeWidth={1.5} />
  });
}

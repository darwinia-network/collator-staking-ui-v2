import { createFileRoute } from '@tanstack/react-router';
import Withdraw from '@/view/deposit';
import NotFound from '@/components/not-found';
import Error from '@/components/error';

export const Route = createFileRoute('/withdraw')({
  component: () => <Withdraw />,
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <Error />
});

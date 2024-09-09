import { createFileRoute } from '@tanstack/react-router';
import Stake from '@/view/stake';
import NotFound from '@/components/not-found';
import Error from '@/components/error';

export const Route = createFileRoute('/')({
  component: () => <Stake />,
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <Error />
});

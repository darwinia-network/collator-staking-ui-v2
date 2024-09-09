import { createRootRoute } from '@tanstack/react-router';
import Root from '@/layout/root';
import NotFound from '@/components/not-found';
import Error from '@/components/error';

export const Route = createRootRoute({
  component: () => <Root />,
  notFoundComponent: () => <NotFound />,
  errorComponent: () => <Error />
});

import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/deposit')({
  beforeLoad: () => {
    throw redirect({ to: '/withdraw' });
  }
});

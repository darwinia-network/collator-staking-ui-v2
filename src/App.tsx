import { RouterProvider, createRouter } from '@tanstack/react-router';
import { DAppProvider } from './providers/dapp-provider';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return (
    <DAppProvider>
      <RouterProvider router={router} />
    </DAppProvider>
  );
}

export default App;

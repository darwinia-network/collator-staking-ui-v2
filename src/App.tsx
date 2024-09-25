import { RouterProvider, createRouter } from '@tanstack/react-router';
import { DAppProvider } from './providers/dapp-provider';
import { routeTree } from './routeTree.gen';
import { WaitingIndexingProvider } from './components/waiting-indexing/context';

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
function App() {
  return (
    <DAppProvider>
      <WaitingIndexingProvider>
        <RouterProvider router={router} />
      </WaitingIndexingProvider>
    </DAppProvider>
  );
}

export default App;

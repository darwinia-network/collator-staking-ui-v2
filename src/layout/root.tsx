import Header from '@/components/header';
import Footer from '@/components/footer';
import useTheme from '@/hooks/useTheme';
import { Outlet } from '@tanstack/react-router';
import DefiTabs from './tabs';
import ReservedStakingPanel from '@/components/reserved-staking-panel';
import BaseCard from '@/components/card';

const Root = () => {
  useTheme();

  return (
    <div className="bg-secondary font-sans antialiased">
      <div className="flex min-h-dvh w-screen flex-col">
        <Header />
        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="mx-auto flex h-full w-full items-center justify-center px-[var(--container-padding-x)]">
            <BaseCard className="flex flex-col gap-[1.25rem]">
              <ReservedStakingPanel />
              <DefiTabs>
                <Outlet />
              </DefiTabs>
            </BaseCard>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Root;

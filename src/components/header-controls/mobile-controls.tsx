import { forwardRef, useMemo, useImperativeHandle } from 'react';

import Drawer from '../drawer';
import FooterSocials from '../footer-socials';
import Theme from '../theme';
import Collator from '../collator';

import ErrorChain from './components/error-chain';
import ChainSwitch from './components/chain-switcher';
import AccountButton from './components/account';
import { useConnectButton } from './hooks/useConnectButton';
import ConnectWallet from './components/connect-wallet';

export interface MobileControlsProps {
  openDrawer: () => void;
  closeDrawer: () => void;
}

const MobileControls = forwardRef<MobileControlsProps, unknown>((props, ref) => {
  console.log('MobileControls', props);
  const {
    isConnected,
    address,
    activeChain,
    openConnectModal,
    handleChainChange,
    isDrawerOpen,
    openDrawer,
    closeDrawer
  } = useConnectButton();

  const renderConnectButton = useMemo(() => {
    if (!isConnected || !address) {
      return <ConnectWallet openConnectModal={openConnectModal} />;
    }

    if (!activeChain) {
      return <ErrorChain />;
    }
    return (
      <>
        <AccountButton address={address} isMobile={true} />
        <ChainSwitch activeChain={activeChain} onChainChange={handleChainChange} isMobile={true} />
      </>
    );
  }, [isConnected, address, activeChain, handleChainChange, openConnectModal]);

  useImperativeHandle(
    ref,
    () => ({
      openDrawer,
      closeDrawer
    }),
    [openDrawer, closeDrawer]
  );

  return (
    <>
      <div
        className="relative h-[1.3125rem] w-[1.25rem] cursor-pointer transition-opacity hover:opacity-[var(--nextui-hover-opacity)] active:opacity-70"
        onClick={openDrawer}
      >
        <img src={'/images/common/hamburger.svg'} alt="hamburger" />
      </div>
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} title={<Theme />}>
        <div className="flex h-full w-full flex-col justify-between">
          <div className="flex w-full flex-col items-center gap-5">{renderConnectButton}</div>
          <div className="flex flex-col items-center gap-5">
            <Collator className="w-full max-w-[13rem]" />
            <FooterSocials />
          </div>
        </div>
      </Drawer>
    </>
  );
});

MobileControls.displayName = 'MobileControls';

export default MobileControls;

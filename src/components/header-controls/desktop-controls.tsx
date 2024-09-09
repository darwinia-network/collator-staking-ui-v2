import { useMemo } from 'react';

import Theme from '@/components/theme';

import ErrorChain from './components/error-chain';
import ChainSwitch from './components/chain-switcher';
import AccountButton from './components/account';
import ConnectWallet from './components/connect-wallet';
import { useConnectButton } from './hooks/useConnectButton';

const DesktopControls = () => {
  const { isConnected, address, activeChain, openConnectModal, handleChainChange } =
    useConnectButton();

  const buttonsGroup = useMemo(() => {
    if (!isConnected || !address) {
      return <ConnectWallet openConnectModal={openConnectModal} />;
    }

    if (!activeChain) {
      return <ErrorChain />;
    }
    return (
      <>
        <AccountButton address={address} />
        <ChainSwitch activeChain={activeChain} onChainChange={handleChainChange} />
      </>
    );
  }, [isConnected, address, activeChain, openConnectModal, handleChainChange]);

  return (
    <div className="flex items-center gap-[0.625rem]">
      {buttonsGroup}
      <Theme />
    </div>
  );
};

export default DesktopControls;

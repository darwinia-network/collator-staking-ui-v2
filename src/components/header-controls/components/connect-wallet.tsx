import { Button } from '@nextui-org/react';

interface ConnectWalletProps {
  openConnectModal?: () => void;
}
const ConnectWallet = ({ openConnectModal }: ConnectWalletProps) => {
  return (
    <Button
      color="primary"
      className="h-[2.25rem] w-full max-w-[13rem] flex-shrink-0 gap-[0.31rem] rounded-small px-[0.62rem] font-bold md:w-auto md:min-w-0 md:max-w-none"
      onClick={openConnectModal}
    >
      Connect Wallet
    </Button>
  );
};

export default ConnectWallet;

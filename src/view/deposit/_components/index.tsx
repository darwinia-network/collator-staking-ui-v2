import { ExternalLink } from 'lucide-react';

import useBalance from '@/hooks/useBalance';
import DepositRecords from './records';

const PROPOSAL_URL =
  'https://gov.ringdao.com/proposal/0xf26faca1125af8f9813c5d88fecf533aa11d5a1b4f9b6dcd131c90206156dd1d';

const Withdraw = () => {
  const { refetch: refetchBalance } = useBalance();

  return (
    <div className="flex flex-col gap-5">
      <section
        aria-labelledby="deposit-sunset-title"
        className="rounded-medium border border-primary/20 bg-primary/10 p-[0.62rem]"
      >
        <div className="flex flex-col gap-2">
          <p id="deposit-sunset-title" className="m-0 text-[0.875rem] font-bold text-foreground">
            Deposit creation has ended
          </p>
          <p className="m-0 text-[0.75rem] leading-5 text-foreground/70">
            New RING deposits are no longer available. Existing deposit tickets remain withdrawable.
          </p>
          <a
            href={PROPOSAL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 text-[0.75rem] font-bold text-primary transition-opacity hover:opacity-[var(--nextui-hover-opacity)]"
          >
            View governance proposal
            <ExternalLink aria-hidden="true" size={12} strokeWidth={2} />
          </a>
        </div>
      </section>

      <DepositRecords onRefreshRingBalance={refetchBalance} />

      <p className="m-0 text-[0.75rem] leading-5 text-foreground/50">
        A ticket used for staking will not appear here. Unstake it from its collator under Stake
        before withdrawing.
      </p>
    </div>
  );
};

export default Withdraw;

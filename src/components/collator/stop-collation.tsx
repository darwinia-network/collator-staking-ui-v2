import { Button, Divider, Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import { X } from 'lucide-react';

interface EditStakeProps {
  isOpen: boolean;
  onClose: () => void;
}

const StopCollation = ({ isOpen, onClose }: EditStakeProps) => {
  return (
    <Modal
      placement="center"
      isOpen={isOpen}
      onClose={onClose}
      backdrop="blur"
      className="bg-background"
      classNames={{
        closeButton:
          'p-0 top-[1.35rem] right-[1.35rem] hover:opacity-[var(--nextui-hover-opacity)] hover:bg-transparent'
      }}
      closeButton={<X strokeWidth={1.5} />}
    >
      <ModalContent className="w-[calc(100vw-1.24rem)] px-5 py-0 md:w-[25rem]">
        <ModalHeader className="px-0 py-5 text-[1.125rem] text-foreground">
          Stop Collation
        </ModalHeader>

        <Divider />
        <ModalBody className="flex w-full flex-col items-center justify-center gap-5 px-0 py-5">
          <p className="text-[0.75rem] font-normal text-foreground/50">
            Collators maintain parachains by collecting parachain transactions from users and
            producing state transition proofs for Relay Chain validators. Sure to stop collation
            now?
          </p>
          <Button color="primary" className="w-full">
            Stake
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default StopCollation;

import React from 'react';
import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/modal';
import { CircleAlert } from 'lucide-react';

interface IndexingErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const IndexingErrorModal: React.FC<IndexingErrorModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      className="bg-background"
      size="sm"
      backdrop="opaque"
    >
      <ModalContent className="">
        <ModalHeader className="flex items-center gap-2 text-[1.125rem] text-foreground">
          <CircleAlert />
          Indexing Service Error
        </ModalHeader>
        <ModalBody>
          <div className="pb-4 font-normal text-foreground">
            Indexing service error, please report it at{' '}
            <a
              href="https://github.com/darwinia-network/collator-staking-ui-v2/issues/new"
              target="_blank"
              rel="noreferrer"
              className="text-primary"
            >
              https://github.com/darwinia-network/collator-staking-ui-v2/issues/new
            </a>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default IndexingErrorModal;

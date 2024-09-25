import React from 'react';
import { Modal, ModalBody, ModalContent } from '@nextui-org/modal';
import { motion, AnimatePresence } from 'framer-motion';
import { CircularProgress } from '@nextui-org/react';

interface WaitingIndexingProps {
  isOpen: boolean;
  onClose: () => void;
}

const WaitingIndexing: React.FC<WaitingIndexingProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      className="bg-background"
      size="sm"
      backdrop="opaque"
    >
      <ModalContent className="h-[20rem]">
        <ModalBody className="flex h-full w-full flex-col items-center justify-center p-5">
          <AnimatePresence mode="wait">
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <div className="flex flex-col items-center justify-center gap-6">
                <CircularProgress
                  aria-label="Waiting for indexing"
                  classNames={{
                    svg: 'w-[5rem] h-[5rem]'
                  }}
                />

                <p className="animate-pulse text-center text-[1.125rem] font-normal text-foreground">
                  Waiting for indexing...
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default WaitingIndexing;

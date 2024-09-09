import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  title: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black"
            onClick={onClose}
          />
          <motion.div
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
              mass: 1,
              duration: 0.3
            }}
            className="fixed right-0 top-0 z-50 flex h-full w-2/3 flex-col bg-secondary"
          >
            <header className="flex h-[3.125rem] items-center justify-between px-5">
              <div className="text-[0.875rem] font-normal text-foreground">{title}</div>
              <div
                className="-mr-4 cursor-pointer p-4 transition-opacity hover:opacity-[var(--nextui-hover-opacity)]"
                onClick={onClose}
              >
                <X strokeWidth={1.5} size={16} className="text-foreground" />
              </div>
            </header>
            <div className="flex-1 px-5 py-[0.62rem]">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Drawer;

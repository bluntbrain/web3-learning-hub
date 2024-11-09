import React from 'react';
import { X } from 'lucide-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export default function Dialog({ isOpen, onClose, children, title }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-rich/60 backdrop-blur-sm" onClick={onClose} />
      <div className="flex min-h-full items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="relative w-full sm:max-w-2xl bg-gradient-to-b from-oxford to-yale/90 rounded-t-2xl sm:rounded-2xl shadow-2xl">
          <div className="flex items-center justify-between p-4 border-b border-yale/20">
            {title && (
              <h2 className="text-lg font-medium gradient-text">{title}</h2>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-yale/20 rounded-xl transition-colors ml-auto"
            >
              <X size={20} />
            </button>
          </div>
          <div className="p-4 sm:p-6 max-h-[calc(100vh-6rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
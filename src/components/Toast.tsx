import { useEffect } from 'react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, isOpen, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, message, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-bg-surface border border-border-custom rounded-xl px-5 py-3 text-text-primary text-xs font-medium shadow-2xl flex items-center gap-3 z-[300] animate-fade-in-up max-w-[90vw] min-w-[280px] justify-between">
      <span>{message}</span>
      <button 
        type="button" 
        onClick={onClose}
        className="text-text-muted hover:text-text-primary text-base leading-none p-0.5 focus:outline-none transition"
      >
        ✕
      </button>
    </div>
  );
}

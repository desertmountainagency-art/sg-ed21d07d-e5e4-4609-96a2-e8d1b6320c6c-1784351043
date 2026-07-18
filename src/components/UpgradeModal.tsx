import { useEffect } from 'react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function UpgradeModal({ isOpen, onClose, onUpgrade }: UpgradeModalProps) {
  // Support Escape key to close the modal
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] flex items-center justify-center p-6 animate-fade-in"
      onClick={(e) => {
        // Close if clicking the overlay
        if (e.target === e.currentTarget) onClose();
      }}
      id="upgradeModal"
    >
      <div className="bg-bg-surface border border-border-custom rounded-2xl max-w-[380px] w-full p-7 shadow-2xl animate-scale-up max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-text-primary mb-1.5 tracking-tight">🚀 Upgrade to Pro</h2>
        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
          Get unlimited visibility and take full control of your financial history.
        </p>
        
        <ul className="space-y-3 mb-6">
          <li className="flex items-center gap-3 text-sm text-text-secondary border-b border-border-custom pb-2">
            <span className="text-success font-bold">✓</span> Unlimited transaction history
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary border-b border-border-custom pb-2">
            <span className="text-success font-bold">✓</span> Full 5-year+ data retention
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary border-b border-border-custom pb-2">
            <span className="text-success font-bold">✓</span> Advanced insights &amp; trends
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary border-b border-border-custom pb-2">
            <span className="text-success font-bold">✓</span> Multi-currency support
          </li>
          <li className="flex items-center gap-3 text-sm text-text-secondary pb-1">
            <span className="text-success font-bold">✓</span> Priority support
          </li>
        </ul>

        <div className="flex gap-3">
          <button 
            type="button" 
            className="flex-1 py-2.5 rounded-lg border border-border-custom bg-bg-surface-3 hover:bg-bg-elevated text-text-secondary text-sm font-semibold transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            type="button" 
            className="flex-1 py-2.5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition"
            onClick={onUpgrade}
          >
            Upgrade Now
          </button>
        </div>
        
        <p className="text-center text-text-muted text-[11px] mt-4">
          One-time purchase · No subscription · Your data stays local
        </p>
      </div>
    </div>
  );
}

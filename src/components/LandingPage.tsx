interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent opacity-10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success opacity-8 rounded-full blur-[120px]" />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        
        {/* Logo and brand */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="text-5xl">💰</div>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Own Your Money.<br/>
          <span className="text-accent">Own Your Privacy.</span>
        </h1>

        {/* Value proposition */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          Track expenses, scan receipts, and manage your finances with complete privacy. 
          All your data stays <span className="text-success font-semibold">100% local</span> on your device.
        </p>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-semibold text-text-primary mb-2">Privacy First</h3>
            <p className="text-sm text-text-muted">No cloud sync. No tracking. Your data never leaves your device.</p>
          </div>
          
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <div className="text-3xl mb-3">📸</div>
            <h3 className="font-semibold text-text-primary mb-2">Smart Receipts</h3>
            <p className="text-sm text-text-muted">Snap photos of receipts and auto-extract transaction details.</p>
          </div>
          
          <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 sm:p-6 backdrop-blur-md">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-semibold text-text-primary mb-2">Visual Insights</h3>
            <p className="text-sm text-text-muted">Beautiful charts and trends to understand your spending.</p>
          </div>
        </div>

        {/* Call to action */}
        <div className="pt-8 space-y-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="bg-accent hover:bg-accent/90 text-white font-bold text-lg px-10 py-4 rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
          >
            Get Started Free
          </button>
          
          <p className="text-xs text-text-muted">
            No signup required • No credit card • Start tracking in 30 seconds
          </p>
        </div>

        {/* Trust indicators */}
        <div className="pt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-text-muted text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Local Storage</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Open Source</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>No Ads</span>
          </div>
        </div>
      </div>
    </div>
  );
}
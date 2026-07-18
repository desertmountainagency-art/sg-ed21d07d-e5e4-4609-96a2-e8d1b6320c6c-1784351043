import { useEffect, useState } from "react";

interface PaymentSuccessProps {
  onContinue: () => void;
}

export default function PaymentSuccess({ onContinue }: PaymentSuccessProps) {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Auto-redirect after 10 seconds
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onContinue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onContinue]);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        {/* Success card */}
        <div className="bg-bg-surface border border-border-custom rounded-2xl p-8 sm:p-12 backdrop-blur-md text-center shadow-2xl">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-success/20 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            🎉 Welcome to Pro!
          </h1>
          
          <p className="text-lg text-text-secondary mb-8 leading-relaxed">
            Your payment was successful! You now have <span className="font-semibold text-accent">lifetime access</span> to all Pro features.
          </p>

          {/* Features unlocked */}
          <div className="space-y-5 mb-10">
            <div className="bg-accent/5 border-2 border-accent/30 rounded-xl p-5 flex items-start gap-4 hover:bg-accent/10 transition-all">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg mb-1">Unlimited Transaction History</h3>
                <p className="text-text-secondary text-sm leading-relaxed">View your complete financial history with no restrictions</p>
              </div>
            </div>

            <div className="bg-accent/5 border-2 border-accent/30 rounded-xl p-5 flex items-start gap-4 hover:bg-accent/10 transition-all">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg mb-1">Advanced Analytics</h3>
                <p className="text-text-secondary text-sm leading-relaxed">Deep insights into your spending patterns and trends</p>
              </div>
            </div>

            <div className="bg-accent/5 border-2 border-accent/30 rounded-xl p-5 flex items-start gap-4 hover:bg-accent/10 transition-all">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary text-lg mb-1">Priority Support</h3>
                <p className="text-text-secondary text-sm leading-relaxed">Get help when you need it with our dedicated support team</p>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8">
            <p className="text-sm text-text-secondary">
              Thank you for supporting <span className="font-semibold text-accent">Ownit.Money</span>! Your purchase helps us keep building privacy-focused financial tools.
            </p>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 py-3 px-6 rounded-lg bg-accent text-white font-semibold hover:opacity-90 active:scale-[0.98] transition"
            >
              Start Using Pro Features
            </button>
            <a
              href="mailto:support@ownit.money"
              className="flex-1 py-3 px-6 rounded-lg border border-border-custom bg-bg-surface-3 hover:bg-bg-elevated text-text-secondary font-semibold transition text-center"
            >
              Contact Support
            </a>
          </div>

          {/* Auto-redirect message */}
          <p className="text-xs text-text-muted mt-6">
            Automatically redirecting in {countdown} seconds...
          </p>
        </div>

        {/* Receipt info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-text-muted">
            A receipt has been sent to your email. Check your Stripe account for payment details.
          </p>
        </div>
      </div>
    </div>
  );
}
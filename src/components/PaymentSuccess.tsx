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
          <div className="bg-bg-elevated border border-border-custom rounded-xl p-6 mb-8 text-left">
            <h2 className="text-lg font-semibold text-text-primary mb-4 text-center">
              ✨ What You Just Unlocked
            </h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary text-sm">
                  <span className="font-semibold text-text-primary">Unlimited transaction history</span> — No more 30-day limit
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary text-sm">
                  <span className="font-semibold text-text-primary">Advanced insights</span> — Detailed spending trends and patterns
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary text-sm">
                  <span className="font-semibold text-text-primary">Priority support</span> — Get help when you need it
                </span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-success flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-text-secondary text-sm">
                  <span className="font-semibold text-text-primary">Future updates</span> — All new Pro features included
                </span>
              </li>
            </ul>
          </div>

          {/* Thank you message */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mb-8">
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              Thank you for supporting <span className="font-semibold text-success">Ownit</span><span className="font-semibold text-accent">.</span><span className="font-semibold">Money</span>! Your purchase helps us keep building privacy-focused financial tools.
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
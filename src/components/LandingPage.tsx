import { useState, useEffect, FormEvent } from "react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleNewsletterSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email && email.includes("@")) {
      setSubscribed(true);
      // Here you would typically send to your newsletter service
      console.log("Newsletter signup:", email);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  const testimonials = [
    {
      quote: "Finally, a budget app that respects my privacy. No cloud sync means my financial data stays mine. The receipt scanner is surprisingly accurate!",
      name: "Sarah M.",
      role: "Privacy Advocate",
      avatar: "👤",
      color: "accent"
    },
    {
      quote: "I've tried dozens of finance apps. This is the only one I trust. Everything stays on my device, and the insights are actually useful.",
      name: "James K.",
      role: "Software Engineer",
      avatar: "👤",
      color: "success"
    },
    {
      quote: "Simple, clean, and private. No subscriptions, no tracking, no BS. Just what I need to track my expenses without selling my data.",
      name: "Maya L.",
      role: "Freelance Designer",
      avatar: "👤",
      color: "accent"
    },
    {
      quote: "The charts help me see exactly where my money goes. No more wondering why I'm always broke at month-end. Love the local-first approach!",
      name: "Alex R.",
      role: "Small Business Owner",
      avatar: "👤",
      color: "success"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentTestimonial]);

  const faqs = [
    {
      question: "Is my financial data really secure?",
      answer: "Absolutely. All your data is stored locally in your browser's IndexedDB. Nothing is sent to the cloud, no servers store your information, and no third parties have access to your transactions. Your privacy is guaranteed by design."
    },
    {
      question: "What happens if I clear my browser data?",
      answer: "If you clear your browser's local storage, your transaction data will be permanently deleted. We recommend exporting your data regularly (available in Settings) or using a dedicated browser profile for Ownit.Money to avoid accidental data loss."
    },
    {
      question: "How does the receipt scanner work?",
      answer: "Our AI-powered receipt scanner uses Tesseract OCR to extract text from photos. Simply snap a picture of your receipt, and the app will automatically detect the merchant name, total amount, date, and categorize the transaction. You can always edit the details if needed."
    },
    {
      question: "Can I use this across multiple devices?",
      answer: "Since data is stored locally on each device, there's no automatic sync between devices. However, you can export your data from one device and import it on another using the Settings page. This ensures your data never touches external servers."
    },
    {
      question: "Is there a mobile app?",
      answer: "Ownit.Money is a progressive web app (PWA) that works seamlessly on mobile browsers. You can add it to your home screen for a native app-like experience. No app store downloads or permissions required!"
    },
    {
      question: "How much does it cost?",
      answer: "Ownit.Money is completely free and open source. No subscriptions, no hidden fees, no ads. We believe financial privacy should be accessible to everyone. If you find it useful, consider starring our GitHub repo or contributing to the project."
    },
    {
      question: "What categories can I track?",
      answer: "We provide 12+ pre-configured categories including Food & Dining, Transportation, Shopping, Entertainment, Bills & Utilities, Health & Fitness, and more. You can also create custom categories tailored to your specific needs."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export all your transactions as a JSON file from the Settings page. This allows you to back up your data, migrate to another device, or analyze it with external tools. Your data, your control."
    }
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent opacity-10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-success opacity-8 rounded-full blur-[120px]" />
      </div>

      {/* Logo in top-left */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
        <span className="text-3xl">💰</span>
        <span className="text-xl font-bold tracking-tight">
          <span className="text-success">Ownit</span>
          <span className="text-text-primary">.Money</span>
        </span>
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-text-primary leading-tight">
          Own Your Money.<br/>
          <span className="text-accent">Own Your Privacy.</span>
        </h1>

        {/* Value proposition */}
        <p className="text-base sm:text-lg md:text-xl text-text-secondary max-w-xl mx-auto leading-relaxed">
          Track expenses, scan receipts, and manage your finances with complete privacy. 
          All your data stays <span className="text-success font-semibold">100% local</span> on your device.
        </p>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-bg-surface border-2 border-border-custom rounded-2xl p-6 sm:p-8 hover:border-accent transition-all shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Smart Receipt Scanning</h3>
            <p className="text-text-secondary leading-relaxed text-base">Snap a photo and let AI extract all the details instantly. No manual entry needed.</p>
          </div>

          <div className="bg-bg-surface border-2 border-border-custom rounded-2xl p-6 sm:p-8 hover:border-accent transition-all shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Beautiful Analytics</h3>
            <p className="text-text-secondary leading-relaxed text-base">Visualize your spending with gorgeous charts and insights that actually make sense.</p>
          </div>

          <div className="bg-bg-surface border-2 border-border-custom rounded-2xl p-6 sm:p-8 hover:border-accent transition-all shadow-lg hover:shadow-xl">
            <div className="w-16 h-16 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-9 h-9 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Privacy First</h3>
            <p className="text-text-secondary leading-relaxed text-base">Your data stays on your device. No cloud sync, no tracking, complete privacy.</p>
          </div>
        </div>

        {/* Testimonials section */}
        <div className="pt-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
            Trusted by Privacy-Conscious Users
          </h2>
          
          {/* Testimonial Carousel */}
          <div 
            className="relative max-w-3xl mx-auto"
            onMouseEnter={() => setIsAutoPlaying(false)}
            onMouseLeave={() => setIsAutoPlaying(true)}
          >
            {/* Carousel container */}
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentTestimonial * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className="w-full flex-shrink-0 px-2"
                  >
                    <div className="bg-bg-surface border border-border-custom rounded-xl p-6 sm:p-8 backdrop-blur-md text-center">
                      <div className="flex items-center justify-center gap-1 mb-4">
                        <div className="text-2xl">⭐⭐⭐⭐⭐</div>
                      </div>
                      <p className="text-base sm:text-lg text-text-secondary italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <div className={`w-12 h-12 rounded-full bg-${testimonial.color}/20 flex items-center justify-center text-xl`}>
                          {testimonial.avatar}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-text-primary">{testimonial.name}</p>
                          <p className="text-sm text-text-muted">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              type="button"
              onClick={prevTestimonial}
              className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 bg-bg-surface border border-border-custom rounded-full p-2 sm:p-3 hover:bg-accent hover:border-accent transition-all shadow-lg items-center justify-center"
              aria-label="Previous testimonial"
            >
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={nextTestimonial}
              className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 bg-bg-surface border border-border-custom rounded-full p-2 sm:p-3 hover:bg-accent hover:border-accent transition-all shadow-lg items-center justify-center"
              aria-label="Next testimonial"
            >
              <svg className="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="flex items-center justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => goToTestimonial(index)}
                  className={`transition-all ${
                    currentTestimonial === index
                      ? "w-8 h-2 bg-accent rounded-full"
                      : "w-2 h-2 bg-text-muted/30 rounded-full hover:bg-text-muted/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-4 text-center">
            Frequently Asked Questions
          </h2>
          <p className="text-text-muted text-center mb-10 max-w-2xl mx-auto">
            Everything you need to know about Ownit.Money
          </p>

          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-bg-surface border border-border-custom rounded-xl overflow-hidden backdrop-blur-md"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-bg-surface/50 transition-colors"
                >
                  <span className="font-semibold text-text-primary text-sm sm:text-base">
                    {faq.question}
                  </span>
                  <svg
                    className={`w-5 h-5 text-text-muted transition-transform flex-shrink-0 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openFaq === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-text-secondary leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup Card */}
        <div className="pt-16">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-accent/10 via-bg-surface to-success/10 border-2 border-accent/30 rounded-2xl p-8 sm:p-10 backdrop-blur-md shadow-2xl">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3">
                Stay Updated
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Get the latest features, privacy tips, and updates delivered to your inbox. No spam, ever.
              </p>
            </div>

            {subscribed ? (
              <div className="text-center py-4">
                <div className="inline-flex items-center gap-2 text-success font-semibold mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>You're subscribed!</span>
                </div>
                <p className="text-sm text-text-muted">Check your inbox for confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3 bg-bg-primary border-2 border-border-custom rounded-lg text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer active:scale-95"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="text-xs text-text-muted text-center mt-4">
              🔒 Your email is safe with us. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="pt-8 space-y-4">
          <button
            type="button"
            onClick={onGetStarted}
            className="bg-accent hover:bg-accent/90 text-white font-bold text-base sm:text-lg px-8 py-3 sm:px-10 sm:py-4 rounded-full shadow-[0_8px_30px_rgba(99,102,241,0.4)] hover:shadow-[0_8px_40px_rgba(99,102,241,0.5)] transition-all duration-300 cursor-pointer active:scale-95"
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

      {/* Comprehensive Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-12 mt-24 border-t border-border-custom">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-12">
          
          {/* Brand column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">💰</span>
              <span className="text-xl font-bold text-text-primary">
                <span className="text-success">Ownit</span>.Money
              </span>
            </div>
            <p className="text-sm text-text-muted mb-6 max-w-xs">
              Privacy-first personal finance app. Track expenses, scan receipts, and gain insights—all stored locally on your device.
            </p>
            
            {/* Social media icons */}
            <div className="flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="GitHub">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="Twitter">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="Discord">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors" aria-label="LinkedIn">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Product</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#features" className="text-text-muted hover:text-accent transition-colors">Features</a></li>
              <li><a href="#pricing" className="text-text-muted hover:text-accent transition-colors">Pricing</a></li>
              <li><a href="#roadmap" className="text-text-muted hover:text-accent transition-colors">Roadmap</a></li>
              <li><a href="#changelog" className="text-text-muted hover:text-accent transition-colors">Changelog</a></li>
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="text-text-muted hover:text-accent transition-colors">About Us</a></li>
              <li><a href="#blog" className="text-text-muted hover:text-accent transition-colors">Blog</a></li>
              <li><a href="#careers" className="text-text-muted hover:text-accent transition-colors">Careers</a></li>
              <li><a href="#press" className="text-text-muted hover:text-accent transition-colors">Press Kit</a></li>
            </ul>
          </div>

          {/* Support & Legal links */}
          <div>
            <h4 className="font-semibold text-text-primary mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#help" className="text-text-muted hover:text-accent transition-colors">Help Center</a></li>
              <li><a href="#contact" className="text-text-muted hover:text-accent transition-colors">Contact</a></li>
              <li><a href="#privacy" className="text-text-muted hover:text-accent transition-colors">Privacy Policy</a></li>
              <li><a href="#terms" className="text-text-muted hover:text-accent transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-border-custom flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-text-muted">
          <p>© 2026 Ownit.Money. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#status" className="hover:text-accent transition-colors">Status</a>
            <a href="#security" className="hover:text-accent transition-colors">Security</a>
            <a href="#open-source" className="hover:text-accent transition-colors">Open Source</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
import { useState } from 'react';
import { Category } from '../types';
import { DEFAULT_CATEGORIES, CURRENCIES } from '../constants';

interface OnboardingProps {
  onComplete: (selectedCategories: Category[], baseCurrency: string) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedCats, setSelectedCats] = useState<string[]>(
    DEFAULT_CATEGORIES.map(c => c.id)
  );
  const [currency, setCurrency] = useState('USD');

  const handleToggleCategory = (catId: string) => {
    setSelectedCats(prev => {
      if (prev.includes(catId)) {
        return prev.filter(id => id !== catId);
      } else {
        return [...prev, catId];
      }
    });
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(prev => prev + 1);
    } else {
      const selectedCategoriesObj = DEFAULT_CATEGORIES.filter(c => 
        selectedCats.includes(c.id)
      );
      onComplete(selectedCategoriesObj, currency);
    }
  };

  return (
    <div id="onboarding" className="fixed inset-0 bg-bg-primary z-[100] flex flex-col items-center justify-center p-8 overflow-y-auto">
      {/* Step 0: Welcome Screen */}
      {step === 0 && (
        <div className="max-w-[400px] w-full text-center space-y-6 animate-fade-in">
          <span className="text-6xl block">🔒</span>
          <h1 className="text-3xl font-bold mb-2 text-center">
            <span className="text-white">Welcome to</span> <span className="text-accent">Ownit.Money</span>
          </h1>
          <p className="text-text-secondary text-sm md:text-base leading-relaxed">
            Your money is your business. Track it like it.
            <br />
            No bank syncs. No data sharing. Total privacy.
          </p>
          <button 
            type="button" 
            className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition"
            onClick={handleNext}
          >
            Get Started →
          </button>
          
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-6 h-2 rounded bg-accent transition-all duration-300" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
          </div>
        </div>
      )}

      {/* Step 1: Pick Categories */}
      {step === 1 && (
        <div className="max-w-[400px] w-full text-center space-y-5 animate-fade-in">
          <span className="text-6xl block">📂</span>
          <h1 className="text-2xl font-bold tracking-tight">Pick your categories</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            We've preloaded some common ones. Toggle any you don't want.
          </p>
          
          <div className="flex flex-wrap gap-2 justify-center max-h-[180px] overflow-y-auto py-2 border border-border-custom rounded-lg px-2 bg-bg-surface-2">
            {DEFAULT_CATEGORIES.map(c => {
              const isSelected = selectedCats.includes(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleToggleCategory(c.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                    isSelected 
                      ? 'border-accent bg-accent-dim text-accent' 
                      : 'border-border-custom bg-bg-surface text-text-secondary'
                  }`}
                >
                  {c.icon} {c.name}
                </button>
              );
            })}
          </div>

          <button 
            type="button" 
            className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition mt-4"
            onClick={handleNext}
          >
            Looks good →
          </button>
          
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-6 h-2 rounded bg-accent transition-all duration-300" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
          </div>
        </div>
      )}

      {/* Step 2: Base Currency Selection */}
      {step === 2 && (
        <div className="max-w-[400px] w-full text-center space-y-5 animate-fade-in">
          <span className="text-6xl block">💱</span>
          <h1 className="text-2xl font-bold tracking-tight">Set your base currency</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            All amounts will be shown in this currency. You can add more later.
          </p>
          
          <div className="text-left">
            <label htmlFor="onboardCurrency" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
              Currency
            </label>
            <select
              id="onboardCurrency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code === 'USD' && '🇺🇸 '}
                  {c.code === 'EUR' && '🇪🇺 '}
                  {c.code === 'GBP' && '🇬🇧 '}
                  {c.code === 'CAD' && '🇨🇦 '}
                  {c.code === 'AUD' && '🇦🇺 '}
                  {c.code === 'JPY' && '🇯🇵 '}
                  {c.code === 'INR' && '🇮🇳 '}
                  {c.code === 'BRL' && '🇧🇷 '}
                  {c.code === 'MXN' && '🇲🇽 '}
                  {c.code === 'SGD' && '🇸🇬 '}
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="button" 
            className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition mt-2"
            onClick={handleNext}
          >
            Set currency →
          </button>
          
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-6 h-2 rounded bg-accent transition-all duration-300" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
          </div>
        </div>
      )}

      {/* Step 3: Success Screen */}
      {step === 3 && (
        <div className="max-w-[400px] w-full text-center space-y-6 animate-fade-in">
          <span className="text-6xl block">🚀</span>
          <h1 className="text-2xl font-bold tracking-tight font-sans">You're all set!</h1>
          <p className="text-text-secondary text-sm leading-relaxed">
            Your data stays <strong>100% local</strong> on this device.
            <br />
            Start tracking your expenses with peace of mind.
          </p>
          <button 
            type="button" 
            className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition"
            onClick={handleNext}
          >
            Go to Dashboard
          </button>
          
          <div className="flex justify-center gap-2 mt-4">
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-2 h-2 rounded bg-bg-surface-3" />
            <span className="w-6 h-2 rounded bg-accent transition-all duration-300" />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Transaction, Category, Receipt, AppSettings } from './types';
import { 
  dbGetAll, 
  dbPut, 
  dbDelete, 
  dbClear, 
  loadAppSettings, 
  saveAppSettings 
} from './db';
import { convertToTarget, formatCurrency, getLocalDateString } from './utils';

// Import sub-components
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import TransactionsPage from './components/TransactionsPage';
import AddTransaction from './components/AddTransaction';
import ScanReceipt from './components/ScanReceipt';
import SettingsPage from './components/SettingsPage';
import UpgradeModal from './components/UpgradeModal';
import Toast from './components/Toast';

export default function App() {
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<string>('pageDashboard');

  // Core Application Data State
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(false);
  const [tier, setTier] = useState<'free' | 'pro'>('free');
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // UI States
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastOpen, setIsToastOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load state from IndexedDB on startup
  useEffect(() => {
    async function init() {
      try {
        const settings = await loadAppSettings();
        setOnboardingComplete(settings.onboardingComplete);
        setTier(settings.tier);
        setBaseCurrency(settings.baseCurrency);
        setExchangeRates(settings.exchangeRates);

        if (settings.onboardingComplete) {
          const loadedCats = await dbGetAll<Category>('categories');
          const loadedTx = await dbGetAll<Transaction>('transactions');
          
          setCategories(loadedCats);
          // Sort transaction list in descending chronological order
          setTransactions(loadedTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        }
      } catch (err) {
        console.error('Failed to initialize application database:', err);
        showToast('Error loading local data. Please refresh.');
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, []);

  // Sync state periodically (every 30 seconds, auto-refresh recent logs)
  useEffect(() => {
    if (!onboardingComplete) return;

    const interval = setInterval(async () => {
      try {
        const loadedTx = await dbGetAll<Transaction>('transactions');
        setTransactions(loadedTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
      } catch (err) {
        console.error('Background synchronization failed:', err);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [onboardingComplete]);

  // Toast helper
  const showToast = (message: string) => {
    setToastMessage(message);
    setIsToastOpen(true);
  };

  // Onboarding Complete Handler
  const handleOnboardingComplete = async (selectedCategories: Category[], chosenCurrency: string) => {
    try {
      setIsLoading(true);

      // 1. Clear pre-existing categories
      await dbClear('categories');

      // 2. Add selected categories to database
      for (const cat of selectedCategories) {
        await dbPut('categories', { ...cat, isDefault: true });
      }

      // 3. Update app settings
      const updatedSettings: AppSettings = {
        tier: 'free',
        baseCurrency: chosenCurrency,
        exchangeRates: exchangeRates && Object.keys(exchangeRates).length > 0 ? exchangeRates : {},
        onboardingComplete: true
      };

      await saveAppSettings(updatedSettings);

      // 4. Update memory state
      setCategories(selectedCategories);
      setBaseCurrency(chosenCurrency);
      setOnboardingComplete(true);
      setCurrentPage('pageDashboard');

      showToast('🔒 All data stays local');
    } catch (err) {
      console.error('Failed completing onboarding:', err);
      showToast('Error finalizing setup.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add manual transaction
  const handleAddTransaction = async (txData: Omit<Transaction, 'id' | 'createdAt' | 'receiptId'>) => {
    try {
      const id = 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const newTx: Transaction = {
        id,
        ...txData,
        createdAt: new Date().toISOString(),
        receiptId: null,
      };

      await dbPut('transactions', newTx);
      
      setTransactions(prev => [newTx, ...prev]);
      showToast('Transaction added');
      setCurrentPage('pageDashboard');
    } catch (err) {
      console.error('Failed to add transaction:', err);
      showToast('Error saving transaction.');
    }
  };

  // Delete transaction
  const handleDeleteTransaction = async (id: string) => {
    try {
      await dbDelete('transactions', id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      showToast('Transaction deleted');
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      showToast('Error deleting transaction.');
    }
  };

  // Scan Receipt transaction creation handler
  const handleConfirmReceiptTransaction = async (
    txData: {
      date: string;
      amount: number;
      category: string;
      description: string;
      currency: string;
      type: 'expense' | 'income';
    },
    receiptData: {
      imageData: string;
      extractedDate: string;
      extractedAmount: number;
      merchantName: string;
    }
  ) => {
    try {
      const txId = 'tx_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);
      const recId = 'rec_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6);

      const newTx: Transaction = {
        id: txId,
        date: txData.date,
        amount: txData.amount,
        category: txData.category,
        description: txData.description,
        currency: txData.currency,
        type: txData.type,
        createdAt: new Date().toISOString(),
        receiptId: recId,
      };

      const newRec: Receipt = {
        id: recId,
        imageData: receiptData.imageData,
        extractedDate: receiptData.extractedDate,
        extractedAmount: receiptData.extractedAmount,
        merchantName: receiptData.merchantName,
        transactionId: txId,
        createdAt: new Date().toISOString(),
      };

      // Put both into local database stores
      await dbPut('transactions', newTx);
      await dbPut('receipts', newRec);

      // Update state
      setTransactions(prev => [newTx, ...prev]);
      showToast('Transaction created from receipt!');
      setCurrentPage('pageDashboard');
    } catch (err) {
      console.error('Failed to save scanned receipt transaction:', err);
      showToast('Error saving receipt.');
    }
  };

  // Base Currency settings update handler
  const handleBaseCurrencyChange = async (code: string) => {
    try {
      setBaseCurrency(code);
      const currentSettings = await loadAppSettings();
      const updatedSettings = {
        ...currentSettings,
        baseCurrency: code,
      };
      await saveAppSettings(updatedSettings);
      showToast('Base currency updated');
    } catch (err) {
      console.error('Failed to update base currency:', err);
    }
  };

  // Custom Category Add Handler (Requirement #4)
  const handleAddCategory = async (catData: { name: string; icon: string; type: 'expense' | 'income' }) => {
    try {
      const newId = 'cat_custom_' + Date.now();
      const newCat: Category = {
        id: newId,
        name: catData.name,
        icon: catData.icon,
        type: catData.type,
        isDefault: false
      };

      await dbPut('categories', newCat);
      setCategories(prev => [...prev, newCat]);
      showToast('Custom category added');
    } catch (err) {
      console.error('Failed to add custom category:', err);
      showToast('Error adding custom category.');
    }
  };

  // Custom Category Delete Handler (Requirement #4)
  const handleDeleteCategory = async (id: string) => {
    try {
      await dbDelete('categories', id);
      setCategories(prev => prev.filter(c => c.id !== id));
      showToast('Category deleted');
    } catch (err) {
      console.error('Failed to delete category:', err);
      showToast('Error deleting category.');
    }
  };

  // CSV Exporter (Requirement #2 / Settings Option)
  const handleExportCSV = () => {
    // Determine visible transactions based on tier limits
    const getVisibleTransactions = () => {
      if (tier === 'pro') return transactions;
      const now = new Date();
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - 90);
      const cutoffStr = getLocalDateString(cutoff);
      return transactions.filter(t => t.date >= cutoffStr);
    };

    const visibleTx = getVisibleTransactions();

    if (visibleTx.length === 0) {
      showToast('No transactions to export');
      return;
    }

    let csv = 'Date,Category,Description,Amount,Currency,Type\n';
    for (const t of visibleTx) {
      const cat = categories.find(c => c.id === t.category);
      const catName = cat ? cat.name : t.category;
      csv += `${t.date},${catName},"${t.description || ''}",${t.amount},${t.currency},${t.type}\n`;
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ownit_transactions.csv';
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported!');
  };

  // Factory reset application back to onboarding
  const handleResetAllData = async () => {
    if (!confirm('⚠️ Permanently delete ALL data? This cannot be undone.')) return;
    if (!confirm('Are you sure? All transactions, receipts, custom categories, and settings will be lost.')) return;

    try {
      setIsLoading(true);
      await dbClear('transactions');
      await dbClear('receipts');
      await dbClear('categories');
      await dbClear('settings');

      setTransactions([]);
      setCategories([]);
      setOnboardingComplete(false);
      setTier('free');
      setBaseCurrency('USD');
      setCurrentPage('pageDashboard');
      showToast('All data reset');
    } catch (err) {
      console.error('Failed to purge local database stores:', err);
      showToast('Error clearing local data.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger simulated upgrade to Pro tier
  const handleUpgradeToPro = async () => {
    try {
      setTier('pro');
      const currentSettings = await loadAppSettings();
      const updatedSettings = {
        ...currentSettings,
        tier: 'pro' as const,
      };
      await saveAppSettings(updatedSettings);
      setIsUpgradeModalOpen(false);
      showToast('Upgraded to Pro!');
    } catch (err) {
      console.error('Failed to save upgrade setting:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-bg-primary text-text-secondary">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin mb-4" />
        <span className="text-xs font-medium tracking-wide">Loading Ownit.Money...</span>
      </div>
    );
  }

  if (!onboardingComplete) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="flex flex-col h-screen max-w-[480px] mx-auto bg-bg-primary relative overflow-hidden md:border-x md:border-border-custom md:shadow-2xl">
      
      {/* Dynamic Header */}
      <header className="shrink-0 h-[60px] flex items-center justify-between px-[18px] bg-bg-primary border-b border-border-custom z-10 relative">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight text-text-primary select-none">
          <span>Ownit<span className="text-accent">.</span>Money</span>
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        </div>
        
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-text-secondary bg-bg-surface-2 px-2.5 py-1 rounded-full border border-border-custom select-none">
            {baseCurrency}
          </span>
          <button
            type="button"
            className={`text-[10px] font-bold text-uppercase tracking-wider px-2.5 py-1 rounded-full border transition cursor-pointer select-none ${
              tier === 'pro' 
                ? 'bg-accent-dim text-accent border-accent hover:opacity-80' 
                : 'bg-bg-surface-3 text-text-secondary border-border-custom hover:opacity-80'
            }`}
            onClick={() => setIsUpgradeModalOpen(true)}
          >
            {tier === 'pro' ? 'Pro' : 'Free'}
          </button>
        </div>
      </header>

      {/* Main Scrollable View Area */}
      <main className="flex-1 overflow-y-auto px-[18px] pt-4 pb-[100px] scroll-smooth">
        {currentPage === 'pageDashboard' && (
          <Dashboard
            transactions={transactions}
            categories={categories}
            baseCurrency={baseCurrency}
            exchangeRates={exchangeRates}
            onDeleteTransaction={handleDeleteTransaction}
            tier={tier}
            onNavigate={setCurrentPage}
          />
        )}

        {currentPage === 'pageTransactions' && (
          <TransactionsPage
            transactions={transactions}
            categories={categories}
            baseCurrency={baseCurrency}
            onDeleteTransaction={handleDeleteTransaction}
            tier={tier}
          />
        )}

        {currentPage === 'pageAdd' && (
          <AddTransaction
            categories={categories}
            baseCurrency={baseCurrency}
            onAddTransaction={handleAddTransaction}
          />
        )}

        {currentPage === 'pageReceipts' && (
          <ScanReceipt
            categories={categories}
            baseCurrency={baseCurrency}
            onConfirmReceiptTransaction={handleConfirmReceiptTransaction}
            onShowToast={showToast}
          />
        )}

        {currentPage === 'pageSettings' && (
          <SettingsPage
            tier={tier}
            baseCurrency={baseCurrency}
            onBaseCurrencyChange={handleBaseCurrencyChange}
            transactions={transactions}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onExportCSV={handleExportCSV}
            onResetAll={handleResetAllData}
            onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
          />
        )}
      </main>

      {/* Persistent Bottom Tab Navigation */}
      <nav className="absolute bottom-0 left-0 right-0 h-[72px] bg-bg-surface border-t border-border-custom flex items-center justify-around pb-2 px-2 z-20 backdrop-blur-md select-none">
        
        <button 
          type="button" 
          onClick={() => setCurrentPage('pageDashboard')}
          className={`flex flex-col items-center justify-center gap-0.5 bg-none border-none text-[10px] font-semibold py-1 px-3 cursor-pointer transition rounded min-w-[56px] ${
            currentPage === 'pageDashboard' ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-[9px] uppercase tracking-wider">Home</span>
        </button>

        <button 
          type="button" 
          onClick={() => setCurrentPage('pageTransactions')}
          className={`flex flex-col items-center justify-center gap-0.5 bg-none border-none text-[10px] font-semibold py-1 px-3 cursor-pointer transition rounded min-w-[56px] ${
            currentPage === 'pageTransactions' ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span className="text-xl">📋</span>
          <span className="text-[9px] uppercase tracking-wider">Tx</span>
        </button>

        {/* FAB (Floating Action Button) for instant Adding */}
        <button 
          type="button" 
          onClick={() => setCurrentPage('pageAdd')}
          className="bg-accent text-white w-[52px] h-[52px] rounded-full flex items-center justify-center p-0 -mt-[18px] shadow-[0_4px_20px_rgba(108,140,255,0.4)] active:scale-92 transition cursor-pointer select-none font-bold"
        >
          <span className="text-2xl leading-none">+</span>
        </button>

        <button 
          type="button" 
          onClick={() => setCurrentPage('pageReceipts')}
          className={`flex flex-col items-center justify-center gap-0.5 bg-none border-none text-[10px] font-semibold py-1 px-3 cursor-pointer transition rounded min-w-[56px] ${
            currentPage === 'pageReceipts' ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span className="text-xl">📸</span>
          <span className="text-[9px] uppercase tracking-wider">Receipt</span>
        </button>

        <button 
          type="button" 
          onClick={() => setCurrentPage('pageSettings')}
          className={`flex flex-col items-center justify-center gap-0.5 bg-none border-none text-[10px] font-semibold py-1 px-3 cursor-pointer transition rounded min-w-[56px] ${
            currentPage === 'pageSettings' ? 'text-accent' : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span className="text-[9px] uppercase tracking-wider">Settings</span>
        </button>
      </nav>

      {/* Upgrade to Pro Modal */}
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgrade={handleUpgradeToPro}
      />

      {/* State-driven Toasts */}
      <Toast
        message={toastMessage}
        isOpen={isToastOpen}
        onClose={() => setIsToastOpen(false)}
      />

    </div>
  );
}

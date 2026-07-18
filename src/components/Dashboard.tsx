import { Transaction, Category, DailyTrendPoint } from '../types';
import { convertToTarget, formatCurrency, formatLocalDateString, getLocalDateString } from '../utils';
import CategoryChart from './CategoryChart';
import TrendChart from './TrendChart';

interface DashboardProps {
  transactions: Transaction[];
  categories: Category[];
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  onDeleteTransaction: (id: string) => void;
  tier: 'free' | 'pro';
  onNavigate: (pageId: string) => void;
}

export default function Dashboard({
  transactions,
  categories,
  baseCurrency,
  exchangeRates,
  onDeleteTransaction,
  tier,
  onNavigate,
}: DashboardProps) {
  // 1. Filter transactions visible to the current tier (90-day cutoff for free tier)
  const getVisibleTransactions = () => {
    if (tier === 'pro') return transactions;

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = getLocalDateString(cutoff);

    return transactions.filter(t => t.date >= cutoffStr);
  };

  const visibleTransactions = getVisibleTransactions();

  // 2. Compute summary metrics
  const computeStats = () => {
    let income = 0;
    let expenses = 0;

    for (const t of visibleTransactions) {
      const convertedAmt = convertToTarget(t.amount, t.currency, baseCurrency, exchangeRates);
      if (t.type === 'income') {
        income += convertedAmt;
      } else {
        expenses += convertedAmt;
      }
    }

    return {
      income,
      expenses,
      net: income - expenses,
      balance: income - expenses,
    };
  };

  const stats = computeStats();

  // 3. Compute Category Spending (Expenses only)
  const getCategorySpending = (): [string, number][] => {
    const map: Record<string, number> = {};

    for (const t of visibleTransactions) {
      if (t.type === 'expense') {
        const cat = categories.find(c => c.id === t.category);
        const name = cat ? cat.name : t.category;
        const convertedAmt = convertToTarget(t.amount, t.currency, baseCurrency, exchangeRates);
        map[name] = (map[name] || 0) + convertedAmt;
      }
    }

    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  const categorySpending = getCategorySpending();

  // 4. Compute Daily Trend Points (Expenses only for last 30 days)
  const getDailyTrend = (): DailyTrendPoint[] => {
    const map: Record<string, number> = {};
    const now = new Date();

    // Populate past 30 days YYYY-MM-DD
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = getLocalDateString(d);
      map[key] = 0;
    }

    for (const t of visibleTransactions) {
      if (t.type === 'expense') {
        if (map[t.date] !== undefined) {
          const convertedAmt = convertToTarget(t.amount, t.currency, baseCurrency, exchangeRates);
          map[t.date] += convertedAmt;
        }
      }
    }

    return Object.entries(map).map(([date, amount]) => ({ date, amount }));
  };

  const trendData = getDailyTrend();

  const handleTxClick = (tx: Transaction) => {
    const cat = categories.find(c => c.id === tx.category);
    const catName = cat ? cat.name : tx.category;
    const confirmMsg = `Delete transaction "${tx.description || catName}" for ${formatCurrency(tx.amount, tx.currency)}?`;
    if (confirm(confirmMsg)) {
      onDeleteTransaction(tx.id);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">Dashboard</h2>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="bg-bg-surface border border-border-custom rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Income</span>
          <span className="text-xl font-bold text-success mt-1.5 truncate">
            {formatCurrency(stats.income, baseCurrency)}
          </span>
        </div>
        
        <div className="bg-bg-surface border border-border-custom rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Expenses</span>
          <span className="text-xl font-bold text-danger mt-1.5 truncate">
            {formatCurrency(stats.expenses, baseCurrency)}
          </span>
        </div>

        <div className="bg-bg-surface border border-border-custom rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Net</span>
          <span className={`text-xl font-bold mt-1.5 truncate ${stats.net >= 0 ? 'text-text-primary' : 'text-danger'}`}>
            {formatCurrency(stats.net, baseCurrency)}
          </span>
        </div>

        <div className="bg-bg-surface border border-border-custom rounded-xl p-3.5 flex flex-col justify-between">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Balance</span>
          <span className="text-xl font-bold text-accent mt-1.5 truncate">
            {formatCurrency(stats.balance, baseCurrency)}
          </span>
        </div>
      </div>

      {/* Spending by Category Card */}
      <div className="bg-bg-surface border border-border-custom rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Spending by Category</span>
        </div>
        <CategoryChart data={categorySpending} baseCurrency={baseCurrency} />
      </div>

      {/* Spending Trend Card */}
      <div className="bg-bg-surface border border-border-custom rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Spending Trend</span>
        </div>
        <TrendChart data={trendData} baseCurrency={baseCurrency} />
      </div>

      {/* Recent Activity Card */}
      <div className="bg-bg-surface border border-border-custom rounded-2xl p-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Recent Activity</span>
          {visibleTransactions.length > 5 && (
            <button 
              type="button" 
              className="text-xs text-accent hover:underline font-medium"
              onClick={() => onNavigate('pageTransactions')}
            >
              View All
            </button>
          )}
        </div>

        <div className="space-y-1.5">
          {visibleTransactions.length === 0 ? (
            <div className="text-center py-10 text-text-muted">
              <span className="text-4xl block mb-3">📭</span>
              <p className="text-sm">No transactions yet. Add one!</p>
            </div>
          ) : (
            visibleTransactions.slice(0, 5).map(t => {
              const cat = categories.find(c => c.id === t.category);
              const icon = cat ? cat.icon : '📌';
              const catName = cat ? cat.name : t.category;
              const isExpense = t.type === 'expense';
              
              return (
                <div 
                  key={t.id} 
                  className="flex items-center gap-3 p-3 bg-bg-surface-2 rounded-xl border border-border-custom hover:border-border-custom-light hover:bg-bg-surface-3 transition cursor-pointer select-none"
                  onClick={() => handleTxClick(t)}
                >
                  <div className="w-9 h-9 rounded-full bg-bg-surface-3 flex items-center justify-center text-lg shrink-0">
                    {icon}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-text-primary truncate">{catName}</div>
                    <div className="text-xs text-text-secondary truncate">{t.description || '—'}</div>
                    <div className="text-[10px] text-text-muted mt-0.5">{formatLocalDateString(t.date)}</div>
                  </div>

                  <div className={`text-sm font-bold text-right shrink-0 ${isExpense ? 'text-danger' : 'text-success'}`}>
                    {isExpense ? '-' : '+'}{formatCurrency(t.amount, t.currency)}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

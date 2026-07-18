import { useState } from 'react';
import { Transaction, Category } from '../types';
import { formatCurrency, formatLocalDateString, getLocalDateString } from '../utils';

interface TransactionsPageProps {
  transactions: Transaction[];
  categories: Category[];
  baseCurrency: string;
  onDeleteTransaction: (id: string) => void;
  tier: 'free' | 'pro';
}

type FilterType = 'all' | 'income' | 'expense';

export default function TransactionsPage({
  transactions,
  categories,
  baseCurrency,
  onDeleteTransaction,
  tier,
}: TransactionsPageProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  // Filter transactions visible to current tier (90-day cutoff for free tier)
  const getVisibleTransactions = () => {
    if (tier === 'pro') return transactions;

    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setDate(cutoff.getDate() - 90);
    const cutoffStr = getLocalDateString(cutoff);

    return transactions.filter(t => t.date >= cutoffStr);
  };

  const visibleTransactions = getVisibleTransactions();

  // Apply income/expense filters
  const filteredTransactions = visibleTransactions.filter(t => {
    if (filter === 'income') return t.type === 'income';
    if (filter === 'expense') return t.type === 'expense';
    return true;
  });

  const handleTxClick = (tx: Transaction) => {
    const cat = categories.find(c => c.id === tx.category);
    const catName = cat ? cat.name : tx.category;
    const confirmMsg = `Delete transaction "${tx.description || catName}" for ${formatCurrency(tx.amount, tx.currency)}?`;
    if (confirm(confirmMsg)) {
      onDeleteTransaction(tx.id);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header and counter */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">Transactions</h2>
        <span className="text-xs text-text-muted font-mono" id="txCount">
          {filteredTransactions.length} tx
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none ${
            filter === 'all'
              ? 'bg-accent-dim border-accent text-accent'
              : 'bg-bg-surface-2 border-border-custom text-text-secondary hover:border-border-custom-light'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter('income')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none ${
            filter === 'income'
              ? 'bg-accent-dim border-accent text-accent'
              : 'bg-bg-surface-2 border-border-custom text-text-secondary hover:border-border-custom-light'
          }`}
        >
          Income
        </button>
        <button
          type="button"
          onClick={() => setFilter('expense')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer select-none ${
            filter === 'expense'
              ? 'bg-accent-dim border-accent text-accent'
              : 'bg-bg-surface-2 border-border-custom text-text-secondary hover:border-border-custom-light'
          }`}
        >
          Expenses
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-1.5">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-text-muted">
            <span className="text-4xl block mb-3">📭</span>
            <p className="text-sm">No transactions match.</p>
          </div>
        ) : (
          filteredTransactions.map(t => {
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
  );
}

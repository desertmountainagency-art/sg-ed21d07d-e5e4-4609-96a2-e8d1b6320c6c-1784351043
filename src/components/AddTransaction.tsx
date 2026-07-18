import React, { useState, useEffect } from 'react';
import { Category, Transaction } from '../types';
import { CURRENCIES } from '../constants';
import { getLocalDateString } from '../utils';

interface AddTransactionProps {
  categories: Category[];
  baseCurrency: string;
  onAddTransaction: (data: Omit<Transaction, 'id' | 'createdAt' | 'receiptId'>) => void;
}

export default function AddTransaction({
  categories,
  baseCurrency,
  onAddTransaction,
}: AddTransactionProps) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(baseCurrency);
  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(getLocalDateString());

  // Dynamically filter categories based on the selected Type (Expense vs. Income)
  const filteredCategories = categories.filter(c => c.type === type);

  // Sync default category whenever the type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].id);
    } else {
      setCategory('');
    }
  }, [type, categories]);

  // Sync currency with baseCurrency default if changed in settings
  useEffect(() => {
    setCurrency(baseCurrency);
  }, [baseCurrency]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert('Please enter a valid positive amount.');
      return;
    }

    if (!category) {
      alert('Please select a category.');
      return;
    }

    onAddTransaction({
      amount: amt,
      currency,
      type,
      category,
      description: description.trim(),
      date,
    });

    // Reset Form
    setAmount('');
    setDescription('');
    setDate(getLocalDateString());
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].id);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">Add Transaction</h2>

      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        {/* Amount & Currency */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="addAmount" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Amount
            </label>
            <input
              id="addAmount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              required
              className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="addCurrency" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Currency
            </label>
            <select
              id="addCurrency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type selector */}
        <div className="space-y-1.5">
          <label htmlFor="addType" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Type
          </label>
          <select
            id="addType"
            value={type}
            onChange={(e) => setType(e.target.value as 'expense' | 'income')}
            className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {/* Dynamic Category selector (updates dynamically when Type changes) */}
        <div className="space-y-1.5">
          <label htmlFor="addCategory" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Category
          </label>
          <select
            id="addCategory"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
          >
            {filteredCategories.map(c => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label htmlFor="addDescription" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Description (optional)
          </label>
          <input
            id="addDescription"
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Coffee, lunch, etc."
            className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
          />
        </div>

        {/* Date */}
        <div className="space-y-1.5">
          <label htmlFor="addDate" className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Date
          </label>
          <input
            id="addDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-sm focus:border-accent focus:ring-2 focus:ring-accent-dim outline-none transition"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full py-3 bg-accent text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.97] transition mt-2 select-none cursor-pointer"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
}

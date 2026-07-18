import React, { useState } from 'react';
import { Category, Transaction } from '../types';
import { CURRENCIES } from '../constants';

interface SettingsPageProps {
  tier: 'free' | 'pro';
  baseCurrency: string;
  onBaseCurrencyChange: (code: string) => void;
  transactions: Transaction[];
  categories: Category[];
  onAddCategory: (data: { name: string; icon: string; type: 'expense' | 'income' }) => void;
  onDeleteCategory: (id: string) => void;
  onExportCSV: () => void;
  onResetAll: () => void;
  onOpenUpgrade: () => void;
}

export default function SettingsPage({
  tier,
  baseCurrency,
  onBaseCurrencyChange,
  transactions,
  categories,
  onAddCategory,
  onDeleteCategory,
  onExportCSV,
  onResetAll,
  onOpenUpgrade,
}: SettingsPageProps) {
  const [newCatIcon, setNewCatIcon] = useState('');
  const [newCatName, setNewCatName] = useState('');
  const [newCatType, setNewCatType] = useState<'expense' | 'income'>('expense');

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const icon = newCatIcon.trim();
    const name = newCatName.trim();
    
    if (!icon || !name) {
      alert('Please fill out all category details.');
      return;
    }

    onAddCategory({
      name,
      icon,
      type: newCatType,
    });

    // Reset inputs
    setNewCatIcon('');
    setNewCatName('');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">Settings</h2>

      {/* Plan Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Plan</span>
        
        <div className="bg-bg-surface border border-border-custom rounded-2xl divide-y divide-border-custom">
          {/* Tier Display */}
          <div className="flex justify-between items-center p-4">
            <div>
              <div className="text-sm font-semibold text-text-primary">Current Tier</div>
              <div className="text-xs text-text-muted" id="settingsTierSub">
                {tier === 'pro' ? 'Pro — Unlimited history' : 'Free — 90-day history'}
              </div>
            </div>
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
              tier === 'pro' ? 'bg-accent-dim text-accent border border-accent/25' : 'bg-bg-surface-3 text-text-secondary'
            }`}>
              {tier === 'pro' ? 'Pro' : 'Free'}
            </span>
          </div>

          {/* Transaction Visibility Limit Info */}
          <div className="flex justify-between items-center p-4">
            <div>
              <div className="text-sm font-semibold text-text-primary">Visible Transactions</div>
              <div className="text-xs text-text-muted">
                {transactions.length} total transactions recorded
              </div>
            </div>
            <span className="text-xs text-text-secondary">
              {tier === 'pro' ? 'All time' : 'Last 90 days'}
            </span>
          </div>
        </div>

        {tier === 'free' && (
          <button
            type="button"
            className="w-full py-2.5 rounded-lg bg-accent text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition mt-2 cursor-pointer select-none"
            onClick={onOpenUpgrade}
          >
            Upgrade to Pro
          </button>
        )}
      </div>

      {/* Currency Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Currency</span>
        
        <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-text-primary">Base Currency</div>
            <div className="text-xs text-text-muted">All amounts shown in this currency</div>
          </div>
          
          <select
            value={baseCurrency}
            onChange={(e) => onBaseCurrencyChange(e.target.value)}
            className="py-1 px-2.5 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-xs font-medium focus:border-accent transition outline-none"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* NEW: Category Management Panel (Requirement #4) */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Categories</span>
        
        <div className="bg-bg-surface border border-border-custom rounded-2xl p-4 space-y-4">
          {/* Custom list container */}
          <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto p-2 border border-border-custom rounded-lg bg-bg-surface-2">
            {categories.map(c => (
              <div key={c.id} className="flex justify-between items-center text-xs p-2 rounded bg-bg-surface border border-border-custom/50">
                <span className="text-text-primary flex items-center gap-1.5">
                  <span className="text-sm">{c.icon}</span> 
                  <span>{c.name}</span>
                  <span className="text-[9px] text-text-muted capitalize">({c.type})</span>
                </span>
                
                {/* Delete button only available for custom categories */}
                {!c.isDefault ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Remove custom category "${c.name}"?`)) {
                        onDeleteCategory(c.id);
                      }
                    }}
                    className="text-danger hover:underline cursor-pointer font-medium p-1 text-[10px]"
                  >
                    Delete
                  </button>
                ) : (
                  <span className="text-[9px] text-text-muted font-medium italic pr-1 select-none">System</span>
                )}
              </div>
            ))}
          </div>

          {/* Add custom category form */}
          <form onSubmit={handleAddCategorySubmit} autoComplete="off" className="space-y-2.5 pt-1.5">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="🍔 Emoji"
                maxLength={4}
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                required
                className="w-[84px] p-2 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-xs focus:border-accent outline-none transition"
              />
              <input
                type="text"
                placeholder="Category Name"
                maxLength={30}
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                required
                className="flex-1 p-2 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-xs focus:border-accent outline-none transition"
              />
            </div>
            
            <div className="flex gap-2 items-center">
              <select
                value={newCatType}
                onChange={(e) => setNewCatType(e.target.value as 'expense' | 'income')}
                className="flex-1 p-2 rounded-lg border border-border-custom bg-bg-surface-2 text-text-primary text-xs focus:border-accent outline-none transition"
              >
                <option value="expense">Expense Category</option>
                <option value="income">Income Category</option>
              </select>
              <button
                type="submit"
                className="py-2 px-4 rounded-lg bg-accent text-white font-semibold text-xs hover:opacity-90 transition cursor-pointer select-none"
              >
                Add Category
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Data</span>
        
        <div className="bg-bg-surface border border-border-custom rounded-2xl divide-y divide-border-custom">
          {/* CSV Export */}
          <div className="flex justify-between items-center p-4">
            <div>
              <div className="text-sm font-semibold text-text-primary">Export Data</div>
              <div className="text-xs text-text-muted">Download all transactions as CSV</div>
            </div>
            <button
              type="button"
              className="py-1.5 px-3 rounded-lg border border-border-custom bg-bg-surface-3 hover:bg-bg-elevated text-text-secondary text-xs font-semibold transition cursor-pointer select-none"
              onClick={onExportCSV}
            >
              Export
            </button>
          </div>

          {/* Hard Factory Reset */}
          <div className="flex justify-between items-center p-4">
            <div>
              <div className="text-sm font-semibold text-text-primary">Reset All Data</div>
              <div className="text-xs text-text-muted">Permanently delete everything</div>
            </div>
            <button
              type="button"
              className="py-1.5 px-3 rounded-lg bg-danger text-white text-xs font-semibold hover:opacity-90 active:scale-[0.98] transition cursor-pointer select-none"
              onClick={onResetAll}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">About</span>
        
        <div className="bg-bg-surface border border-border-custom rounded-2xl divide-y divide-border-custom">
          <div className="p-4 flex gap-3.5 items-center">
            <span className="text-lg">🔒</span>
            <div>
              <div className="text-sm font-semibold text-text-primary">Privacy First</div>
              <div className="text-xs text-text-muted">100% local — no data ever leaves your device</div>
            </div>
          </div>
          
          <div className="p-4 flex gap-3.5 items-center">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-sm font-semibold text-text-primary">Version</div>
              <div className="text-xs text-text-muted">Ownit.Money 1.1</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

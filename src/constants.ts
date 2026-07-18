import { Category, Currency } from './types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'cat_food', name: 'Food & Dining', icon: '🍽️', type: 'expense' },
  { id: 'cat_groceries', name: 'Groceries', icon: '🛒', type: 'expense' },
  { id: 'cat_transport', name: 'Transportation', icon: '🚗', type: 'expense' },
  { id: 'cat_shopping', name: 'Shopping', icon: '🛍️', type: 'expense' },
  { id: 'cat_entertainment', name: 'Entertainment', icon: '🎬', type: 'expense' },
  { id: 'cat_utilities', name: 'Utilities', icon: '💡', type: 'expense' },
  { id: 'cat_housing', name: 'Housing', icon: '🏠', type: 'expense' },
  { id: 'cat_insurance', name: 'Insurance', icon: '🛡️', type: 'expense' },
  { id: 'cat_healthcare', name: 'Healthcare', icon: '🏥', type: 'expense' },
  { id: 'cat_education', name: 'Education', icon: '📚', type: 'expense' },
  { id: 'cat_personal', name: 'Personal Care', icon: '🧴', type: 'expense' },
  { id: 'cat_subscriptions', name: 'Subscriptions', icon: '📱', type: 'expense' },
  { id: 'cat_travel', name: 'Travel', icon: '✈️', type: 'expense' },
  { id: 'cat_gifts', name: 'Gifts & Donations', icon: '🎁', type: 'expense' },
  { id: 'cat_misc', name: 'Miscellaneous', icon: '📌', type: 'expense' },
  { id: 'cat_salary', name: 'Salary', icon: '💼', type: 'income' },
  { id: 'cat_freelance', name: 'Freelance', icon: '💻', type: 'income' },
  { id: 'cat_investment', name: 'Investment', icon: '📈', type: 'income' },
  { id: 'cat_gift_income', name: 'Gift', icon: '🎀', type: 'income' },
  { id: 'cat_refund', name: 'Refund', icon: '↩️', type: 'income' },
  { id: 'cat_other_income', name: 'Other Income', icon: '💰', type: 'income' },
];

export const MERCHANT_NAMES = [
  'Starbucks', 'Whole Foods', 'Uber', 'Amazon', 'Netflix', 'Spotify',
  'Target', 'Walmart', 'Apple Store', 'Google', 'Microsoft', 'Adobe',
  'Local Cafe', 'Gas Station', 'Pharmacy', 'Bookstore', 'Gym',
  'Restaurant', 'Bar', 'Hotel', 'Airline', 'Train', 'Bus',
  'Online Shop', 'Marketplace', 'Freelance Client', 'Employer'
];

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: 'MX$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export const STATIC_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CAD: 1.37,
  AUD: 1.51,
  JPY: 156.2,
  INR: 83.5,
  BRL: 5.12,
  MXN: 16.7,
  SGD: 1.35
};

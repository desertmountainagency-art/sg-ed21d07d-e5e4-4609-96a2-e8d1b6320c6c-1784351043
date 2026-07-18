export interface Category {
  id: string;
  name: string;
  icon: string;
  type: 'expense' | 'income';
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  amount: number;
  category: string; // ID of the category
  description: string;
  currency: string;
  type: 'expense' | 'income';
  createdAt: string; // ISO string
  receiptId: string | null;
}

export interface Receipt {
  id: string;
  imageData: string; // Base64 or DataURL
  extractedDate: string;
  extractedAmount: number;
  merchantName: string;
  transactionId: string | null;
  createdAt: string; // ISO string;
}

export interface AppSettings {
  tier: 'free' | 'pro';
  baseCurrency: string;
  exchangeRates: Record<string, number>;
  onboardingComplete: boolean;
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export interface DailyTrendPoint {
  date: string;
  amount: number;
}

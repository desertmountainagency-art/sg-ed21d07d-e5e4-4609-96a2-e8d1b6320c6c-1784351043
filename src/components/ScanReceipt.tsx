import React, { useState, useRef, useEffect } from 'react';
import { Category } from '../types';
import { MERCHANT_NAMES } from '../constants';
import { getLocalDateString, formatCurrency } from '../utils';

interface ScanReceiptProps {
  categories: Category[];
  baseCurrency: string;
  onConfirmReceiptTransaction: (
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
  ) => void;
  onShowToast: (msg: string) => void;
}

interface SimulatedReceiptData {
  imageData: string;
  extractedDate: string;
  extractedAmount: number;
  merchantName: string;
}

export default function ScanReceipt({
  categories,
  baseCurrency,
  onConfirmReceiptTransaction,
  onShowToast,
}: ScanReceiptProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [receiptData, setReceiptData] = useState<SimulatedReceiptData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Get expense categories
  const expenseCategories = categories.filter(c => c.type === 'expense');

  // Set default category when loaded
  useEffect(() => {
    if (expenseCategories.length > 0) {
      setSelectedCategory(expenseCategories[0].id);
    }
  }, [categories]);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setImageSrc(dataUrl);
      simulateOCR(dataUrl);
    };
    reader.onerror = () => {
      onShowToast('Error reading file');
    };
    reader.readAsDataURL(file);
  };

  const simulateOCR = (imageData: string) => {
    setIsProcessing(true);
    setReceiptData(null);

    // Simulate OCR text extraction after 1.8 seconds
    setTimeout(() => {
      const dateStr = getLocalDateString();
      const merchant = MERCHANT_NAMES[Math.floor(Math.random() * MERCHANT_NAMES.length)];
      const amount = parseFloat((Math.random() * 140 + 6).toFixed(2));

      setReceiptData({
        imageData,
        extractedDate: dateStr,
        extractedAmount: amount,
        merchantName: merchant,
      });
      setIsProcessing(false);
      onShowToast('Receipt analyzed successfully!');
    }, 1800);
  };

  const handleConfirm = () => {
    if (!receiptData) return;

    if (!selectedCategory) {
      alert('Please select a category.');
      return;
    }

    onConfirmReceiptTransaction(
      {
        date: receiptData.extractedDate,
        amount: receiptData.extractedAmount,
        category: selectedCategory,
        description: `Receipt: ${receiptData.merchantName}`,
        currency: baseCurrency,
        type: 'expense',
      },
      {
        imageData: receiptData.imageData,
        extractedDate: receiptData.extractedDate,
        extractedAmount: receiptData.extractedAmount,
        merchantName: receiptData.merchantName,
      }
    );

    // Reset state
    resetUI();
  };

  const resetUI = () => {
    setImageSrc(null);
    setIsProcessing(false);
    setReceiptData(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (expenseCategories.length > 0) setSelectedCategory(expenseCategories[0].id);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <h2 className="text-2xl font-bold tracking-tight text-text-primary">Scan Receipt</h2>
      <p className="text-text-secondary text-sm">
        Upload a photo and we'll extract the details — all locally.
      </p>

      {/* Upload Drop Zone */}
      {!imageSrc && (
        <div
          onClick={handleDropZoneClick}
          className="border-2 border-dashed border-border-custom rounded-2xl p-8 text-center cursor-pointer bg-bg-surface-2 hover:border-accent hover:bg-bg-surface transition select-none"
        >
          <span className="text-4xl block mb-2">📸</span>
          <p className="text-sm text-text-secondary font-medium">Tap to upload a receipt photo</p>
          <input
            ref={fileInputRef}
            type="file"
            id="receiptFile"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Preview Area */}
      {imageSrc && (
        <div className="rounded-xl overflow-hidden bg-bg-surface-2 border border-border-custom flex items-center justify-center max-h-[180px] p-2">
          <img src={imageSrc} alt="Receipt preview" className="max-h-[164px] object-contain w-full rounded" />
        </div>
      )}

      {/* Simulated OCR Processing State */}
      {isProcessing && (
        <div className="border border-border-custom rounded-xl p-4 bg-bg-surface-2 space-y-3">
          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted">Date</span>
            <span className="text-text-secondary font-medium animate-pulse">⏳ Processing...</span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted">Merchant</span>
            <span className="text-text-secondary font-medium animate-pulse">⏳ Processing...</span>
          </div>
          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted">Amount</span>
            <span className="text-text-secondary font-medium animate-pulse">⏳ Processing...</span>
          </div>
        </div>
      )}

      {/* Extracted Details & Editor Form */}
      {receiptData && (
        <div className="border border-border-custom rounded-xl p-4 bg-bg-surface-2 space-y-3 animate-fade-in">
          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted font-semibold">Date</span>
            <span className="text-text-primary font-medium">{receiptData.extractedDate}</span>
          </div>
          
          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted font-semibold">Merchant</span>
            <span className="text-text-primary font-medium">{receiptData.merchantName}</span>
          </div>

          <div className="flex justify-between items-center text-xs border-b border-border-custom pb-2">
            <span className="text-text-muted font-semibold">Amount</span>
            <span className="text-text-primary font-bold">
              {formatCurrency(receiptData.extractedAmount, baseCurrency)}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs pb-1">
            <span className="text-text-muted font-semibold">Category</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2.5 rounded border border-border-custom bg-bg-surface text-text-primary text-xs outline-none focus:border-accent transition"
            >
              {expenseCategories.map(c => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              className="flex-1 py-2 rounded bg-accent text-white font-semibold text-xs hover:opacity-90 active:scale-[0.98] transition cursor-pointer"
              onClick={handleConfirm}
            >
              Create Transaction
            </button>
            <button
              type="button"
              className="flex-1 py-2 rounded border border-border-custom bg-bg-surface-3 hover:bg-bg-elevated text-text-secondary font-semibold text-xs transition cursor-pointer"
              onClick={resetUI}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

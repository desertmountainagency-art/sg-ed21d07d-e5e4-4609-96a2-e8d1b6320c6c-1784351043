import { Transaction, Category, Receipt, AppSettings } from './types';
import { STATIC_RATES } from './constants';

const DB_NAME = 'OwnitMoneyDB';
const DB_VERSION = 2;

export function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains('transactions')) {
        db.createObjectStore('transactions', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('receipts')) {
        db.createObjectStore('receipts', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('settings')) {
        db.createObjectStore('settings', { keyPath: 'key' });
      }
    };
    
    req.onsuccess = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      resolve(db);
    };
    
    req.onerror = (e) => {
      reject((e.target as IDBOpenDBRequest).error);
    };
  });
}

export function dbGetAll<T>(storeName: string): Promise<T[]> {
  return openDB().then((db) => {
    return new Promise<T[]>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbPut<T>(storeName: string, data: T): Promise<IDBValidKey> {
  return openDB().then((db) => {
    return new Promise<IDBValidKey>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(data);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbDelete(storeName: string, id: string): Promise<void> {
  return openDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.delete(id);
      
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbClear(storeName: string): Promise<void> {
  return openDB().then((db) => {
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.clear();
      
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  });
}

export function dbGet<T>(storeName: string, key: string): Promise<T | undefined> {
  return openDB().then((db) => {
    return new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.get(key);
      
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  });
}

// Higher-level settings functions
export async function loadAppSettings(): Promise<AppSettings> {
  try {
    const settings = await dbGet<AppSettings & { key: string }>('settings', 'app_settings');
    if (settings) {
      return {
        tier: settings.tier || 'free',
        baseCurrency: settings.baseCurrency || 'USD',
        exchangeRates: settings.exchangeRates || STATIC_RATES,
        onboardingComplete: settings.onboardingComplete ?? false,
      };
    }
  } catch (err) {
    console.error('Failed to load settings from IndexedDB, returning default:', err);
  }
  
  return {
    tier: 'free',
    baseCurrency: 'USD',
    exchangeRates: STATIC_RATES,
    onboardingComplete: false,
  };
}

export async function saveAppSettings(settings: AppSettings): Promise<void> {
  await dbPut('settings', {
    key: 'app_settings',
    ...settings
  });
}

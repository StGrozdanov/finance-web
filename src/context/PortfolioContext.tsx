'use client';

import { createContext, useState, ReactNode } from 'react';
import {
  Portfolio,
  Transaction,
  demoPortfolio,
  mockAssets,
} from '@/utils/mockHoldingsData';

type PortfolioContextType = {
  portfolios: Portfolio[];
  activePortfolioId: string | null;
  hasUserCreatedPortfolio: boolean;
  includeCashInPortfolio: boolean;
  createPortfolio: (portfolio: Omit<Portfolio, 'id' | 'createdAt'>) => void;
  addTransaction: (
    portfolioId: string,
    transaction: Omit<Transaction, 'id'>,
  ) => void;
  setActivePortfolio: (portfolioId: string) => void;
  setIncludeCashInPortfolio: (include: boolean) => void;
  getActivePortfolio: () => Portfolio;
};

export const PortfolioContext = createContext<PortfolioContextType | undefined>(
  undefined,
);

type PortfolioProviderProps = {
  children: ReactNode;
};

export function PortfolioProvider({ children }: PortfolioProviderProps) {
  // Start with demo portfolio to prevent navigation issues, but track if user has created their own
  const [portfolios, setPortfolios] = useState<Portfolio[]>([demoPortfolio]);
  const [activePortfolioId, setActivePortfolioId] = useState<string | null>(
    demoPortfolio.id,
  );
  const [hasUserCreatedPortfolio, setHasUserCreatedPortfolio] = useState(false);
  const [includeCashInPortfolio, setIncludeCashInPortfolio] = useState(true);

  const createPortfolio = (
    portfolioData: Omit<Portfolio, 'id' | 'createdAt'>,
  ) => {
    const newPortfolio: Portfolio = {
      ...portfolioData,
      id: `portfolio-${Date.now()}`,
      createdAt: new Date(),
    };

    // If this is the first user-created portfolio, replace the demo
    if (!hasUserCreatedPortfolio) {
      setPortfolios([newPortfolio]);
      setHasUserCreatedPortfolio(true);
    } else {
      setPortfolios(prev => [...prev, newPortfolio]);
    }
    setActivePortfolioId(newPortfolio.id);
  };

  const addTransaction = (
    portfolioId: string,
    transactionData: Omit<Transaction, 'id'> & { handleCash?: boolean },
  ) => {
    const newTransaction: Transaction = {
      ...transactionData,
      id: `transaction-${Date.now()}`,
    };

    const transactionsToAdd = [newTransaction];

    // Handle cash transactions for non-cash assets
    if (
      transactionData.handleCash &&
      transactionData.type !== 'transfer' &&
      transactionData.price
    ) {
      const cashAmount =
        transactionData.amount * transactionData.price +
        (transactionData.fee || 0);

      const cashTransaction: Transaction = {
        id: `cash-${Date.now()}`,
        assetId: 'usd', // Default to USD
        type: transactionData.type === 'buy' ? 'withdrawal' : 'deposit',
        amount: cashAmount,
        date: transactionData.date,
        notes: `${transactionData.type === 'buy' ? 'Payment for' : 'Proceeds from'} ${transactionData.type} of ${mockAssets.find(a => a.id === transactionData.assetId)?.symbol || 'asset'}`,
      };

      transactionsToAdd.push(cashTransaction);
    }

    setPortfolios(prev =>
      prev.map(portfolio =>
        portfolio.id === portfolioId ?
          {
            ...portfolio,
            transactions: [...portfolio.transactions, ...transactionsToAdd],
          }
        : portfolio,
      ),
    );
  };

  const setActivePortfolio = (portfolioId: string) => {
    setActivePortfolioId(portfolioId);
  };

  const getActivePortfolio = () => {
    return portfolios.find(p => p.id === activePortfolioId) || demoPortfolio;
  };

  const value: PortfolioContextType = {
    portfolios,
    activePortfolioId,
    hasUserCreatedPortfolio,
    includeCashInPortfolio,
    createPortfolio,
    addTransaction,
    setActivePortfolio,
    setIncludeCashInPortfolio,
    getActivePortfolio,
  };

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import { mockAssets } from '@/app/_data/portfolioData';
import CreatePortfolioModal from '@/app/_components/CreatePortfolioButton/modules/CreatePortfolioModal';

const formatCurrency = (amount: number, currency: string = 'USD') => {
  const symbol = currency === 'EUR' ? '€' : '$';
  return `${symbol}${Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function CashPage() {
  const {
    getActivePortfolio,
    includeCashInPortfolio,
    setIncludeCashInPortfolio,
  } = usePortfolio();
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  const activePortfolio = getActivePortfolio();

  const cashData = useMemo(() => {
    if (!activePortfolio) {
      return {
        totalBalance: 0,
        usdBalance: 0,
        eurBalance: 0,
        transactions: [],
      };
    }

    const cashTransactions = activePortfolio.transactions.filter(t => {
      const asset = mockAssets.find(a => a.id === t.assetId);
      return asset?.type === 'cash';
    });

    // Calculate balances by currency
    const usdTransactions = cashTransactions.filter(t => t.assetId === 'usd');
    const eurTransactions = cashTransactions.filter(t => t.assetId === 'eur');

    const usdBalance = usdTransactions.reduce((sum, t) => {
      if (t.type === 'deposit' || t.type === 'buy') return sum + t.amount;
      if (t.type === 'withdrawal' || t.type === 'sell') return sum - t.amount;
      return sum;
    }, 0);

    const eurBalance = eurTransactions.reduce((sum, t) => {
      if (t.type === 'deposit' || t.type === 'buy') return sum + t.amount;
      if (t.type === 'withdrawal' || t.type === 'sell') return sum - t.amount;
      return sum;
    }, 0);

    // Mock some additional cash for demonstration
    const mockedUsdBalance = usdBalance + 2094.42;
    const mockedEurBalance = eurBalance + 1016.0;
    const totalBalance = mockedUsdBalance + mockedEurBalance * 1.08; // Convert EUR to USD

    return {
      totalBalance,
      usdBalance: mockedUsdBalance,
      eurBalance: mockedEurBalance,
      transactions: cashTransactions.sort(
        (a, b) => b.date.getTime() - a.date.getTime(),
      ),
    };
  }, [activePortfolio]);

  return (
    <div className='px-8 py-4'>
      {/* Back link */}
      <Link
        href='/'
        className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6'
      >
        <svg
          className='w-4 h-4 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
        Back to Portfolio
      </Link>

      {/* Page Header */}
      <div className='bg-white rounded-lg border border-gray-200 p-6 mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Available Cash
            </h1>
            <div className='flex items-center gap-4'>
              <span className='text-lg text-gray-600'>
                Total Balance: {formatCurrency(cashData.totalBalance)}
              </span>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setShowAddTransaction(true)}
              className='flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                />
              </svg>
              Add Transaction
            </button>
            <div className='text-right'>
              <div className='text-2xl font-bold text-gray-900'>
                {formatCurrency(cashData.totalBalance)}
              </div>
            </div>
          </div>
        </div>

        {/* Cash Include Toggle */}
        <div className='mt-6 flex items-center gap-3'>
          <label className='flex items-center gap-3 cursor-pointer'>
            <div className='relative'>
              <input
                type='checkbox'
                checked={includeCashInPortfolio}
                onChange={e => setIncludeCashInPortfolio(e.target.checked)}
                className='sr-only'
              />
              <div
                className={`w-11 h-6 rounded-full transition-colors ${
                  includeCashInPortfolio ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${
                    includeCashInPortfolio ? 'translate-x-5' : 'translate-x-0.5'
                  } mt-0.5`}
                />
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <svg
                className='w-5 h-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                />
              </svg>
              <span className='text-sm font-medium text-gray-700'>
                Include Available Cash in Portfolio
              </span>
            </div>
          </label>
          <button className='ml-auto p-1 text-gray-400 hover:text-gray-600'>
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Currency Balances */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
        {/* USD Balance */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='text-xl'>🇺🇸</span>
            </div>
            <div className='flex-1'>
              <div className='text-sm text-gray-500'>Available USD</div>
              <div className='text-2xl font-bold text-gray-900'>
                {formatCurrency(cashData.usdBalance, 'USD')}
              </div>
            </div>
          </div>
        </div>

        {/* EUR Balance */}
        <div className='bg-white rounded-lg border border-gray-200 p-6'>
          <div className='flex items-center gap-4'>
            <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
              <span className='text-xl'>🇪🇺</span>
            </div>
            <div className='flex-1'>
              <div className='text-sm text-gray-500'>Available EUR</div>
              <div className='text-2xl font-bold text-gray-900'>
                {formatCurrency(cashData.eurBalance, 'EUR')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History */}
      <div className='bg-white rounded-lg border border-gray-200'>
        <div className='p-6 border-b border-gray-200'>
          <h2 className='text-xl font-semibold text-gray-900'>
            Recent Transactions
          </h2>
        </div>

        <div className='divide-y divide-gray-200'>
          {cashData.transactions.length > 0 ?
            cashData.transactions.map(transaction => {
              const asset = mockAssets.find(a => a.id === transaction.assetId);
              const isDeposit =
                transaction.type === 'deposit' || transaction.type === 'buy';

              return (
                <div key={transaction.id} className='p-6'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          isDeposit ?
                            'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {isDeposit ? 'Deposit' : 'Withdrawal'}
                      </span>
                      <span className='text-sm text-gray-600'>
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </div>

                  <div className='bg-gray-50 rounded-lg p-4'>
                    <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                      <div>
                        <div className='text-sm text-gray-500 mb-1'>Amount</div>
                        <div className='font-semibold text-gray-900'>
                          {formatCurrency(
                            transaction.amount,
                            asset?.symbol || 'USD',
                          )}
                        </div>
                      </div>
                      <div>
                        <div className='text-sm text-gray-500 mb-1'>
                          Currency
                        </div>
                        <div className='font-semibold text-gray-900'>
                          {asset?.symbol || 'USD'}
                        </div>
                      </div>
                      {transaction.notes && (
                        <div>
                          <div className='text-sm text-gray-500 mb-1'>
                            Notes
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {transaction.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          : <div className='p-6 text-center text-gray-500'>
              No cash transactions yet. Add your first deposit or withdrawal
              above.
            </div>
          }
        </div>
      </div>

      {/* Add Transaction Modal */}
      <CreatePortfolioModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
        mode='add_transaction'
      />
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import { mockAssets, Transaction } from '@/utils/mockHoldingsData';
import CashTransactionModal from './components/CashTransactionModal/CashTransactionModal';
import DeleteConfirmationModal from './components/DeleteConfirmationModal/DeleteConfirmationModal';
import { formatCurrency } from '@/utils/formatters';

const defaultBalances = {
  totalBalance: 0,
  usdBalance: 0,
  eurBalance: 0,
  transactions: [],
};

export default function CashPage() {
  const {
    getActivePortfolio,
    includeCashInPortfolio,
    setIncludeCashInPortfolio,
    deleteTransaction,
    activePortfolioId,
  } = usePortfolio();
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const activePortfolio = getActivePortfolio();

  const cashData = useMemo(() => {
    if (!activePortfolio) return defaultBalances;

    const allTransactions = activePortfolio.transactions;

    const cashTransactions: Transaction[] = allTransactions.flatMap(t => {
      if (t.assetId === 'usd' || t.assetId === 'eur') {
        return [t];
      }

      if (t.type === 'buy' && t.price) {
        const amountOut = t.amount * t.price + (t.fee || 0);
        const symbol =
          mockAssets.find(a => a.id === t.assetId)?.symbol || t.assetId;
        return [
          {
            id: `cash-${t.id}-out`,
            assetId: 'usd',
            type: 'withdrawal',
            amount: amountOut,
            date: t.date,
            notes: `Bought ${symbol}`,
          } as Transaction,
        ];
      }

      if (t.type === 'sell' && t.price) {
        const amountIn = t.amount * t.price - (t.fee || 0);
        const symbol =
          mockAssets.find(a => a.id === t.assetId)?.symbol || t.assetId;
        return [
          {
            id: `cash-${t.id}-in`,
            assetId: 'usd',
            type: 'deposit',
            amount: amountIn,
            date: t.date,
            notes: `Proceeds from ${symbol} sell`,
          } as Transaction,
        ];
      }
      return [];
    });

    const usdTransactions = cashTransactions.filter(t => t.assetId === 'usd');
    const eurTransactions = cashTransactions.filter(t => t.assetId === 'eur');

    const usdBalance = Math.max(
      0,
      usdTransactions.reduce((sum, t) => {
        if (t.type === 'deposit') return sum + t.amount;
        if (t.type === 'withdrawal') return sum - t.amount;
        return sum;
      }, 0),
    );

    const eurBalance = Math.max(
      0,
      eurTransactions.reduce((sum, t) => {
        if (t.type === 'deposit') return sum + t.amount;
        if (t.type === 'withdrawal') return sum - t.amount;
        return sum;
      }, 0),
    );

    const totalBalance = Math.max(0, usdBalance + eurBalance * 1.08);

    return {
      totalBalance,
      usdBalance,
      eurBalance,
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

              const handleEdit = () => {
                setEditingTransaction(transaction);
              };

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
                        {format(transaction.date, 'MMM d, yyyy, HH:mm')}
                      </span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <button
                        onClick={handleEdit}
                        className='p-2 text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer'
                        title='Edit transaction'
                      >
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
                            d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeletingTransaction(transaction)}
                        className='p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer'
                        title='Delete transaction'
                      >
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
                            d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16'
                          />
                        </svg>
                      </button>
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
      <CashTransactionModal
        isOpen={showAddTransaction}
        onClose={() => setShowAddTransaction(false)}
      />

      {/* Edit Transaction Modal */}
      <CashTransactionModal
        isOpen={!!editingTransaction}
        onClose={() => setEditingTransaction(null)}
        transaction={editingTransaction}
        activePortfolio={activePortfolio}
      />

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <DeleteConfirmationModal
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={() => {
            if (activePortfolioId && deletingTransaction) {
              // If this is a derived transaction (from buy/sell), delete the underlying asset transaction
              if (deletingTransaction.id.startsWith('cash-')) {
                // Extract the original transaction ID from 'cash-{id}-out' or 'cash-{id}-in'
                const match = deletingTransaction.id.match(
                  /^cash-(.+?)-(out|in)$/,
                );
                if (match) {
                  const originalTransactionId = match[1];
                  deleteTransaction(activePortfolioId, originalTransactionId);
                }
              } else {
                // This is a real cash transaction, delete it directly
                deleteTransaction(activePortfolioId, deletingTransaction.id);
              }
              setDeletingTransaction(null);
            }
          }}
          transactionType={
            deletingTransaction.type === 'deposit' ? 'deposit' : 'withdrawal'
          }
          amount={deletingTransaction.amount}
          currency={
            mockAssets.find(a => a.id === deletingTransaction.assetId)
              ?.symbol || 'USD'
          }
        />
      )}
    </div>
  );
}

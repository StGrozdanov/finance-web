'use client';

import { useState } from 'react';
import { Asset, Transaction } from '@/app/_data/portfolioData';

interface Props {
  asset: Asset;
  transactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatQuantity = (quantity: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  }).format(quantity);
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

// Calculate average buy/sell prices
const calculateAverages = (transactions: Transaction[]) => {
  const buyTransactions = transactions.filter(t => t.type === 'buy');
  const sellTransactions = transactions.filter(t => t.type === 'sell');

  const avgBuyPrice =
    buyTransactions.length > 0 ?
      buyTransactions.reduce((sum, t) => sum + (t.price || 0) * t.amount, 0) /
      buyTransactions.reduce((sum, t) => sum + t.amount, 0)
    : 0;

  const avgSellPrice =
    sellTransactions.length > 0 ?
      sellTransactions.reduce((sum, t) => sum + (t.price || 0) * t.amount, 0) /
      sellTransactions.reduce((sum, t) => sum + t.amount, 0)
    : 0;

  return { avgBuyPrice, avgSellPrice };
};

export default function TransactionsHistory({ asset, transactions }: Props) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'transactions'>(
    'transactions',
  );

  const { avgBuyPrice, avgSellPrice } = calculateAverages(transactions);
  const totalTransactions = transactions.length;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime(),
  );

  return (
    <div className='mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden'>
      {/* Tab Navigation */}
      <div className='flex border-b border-gray-200'>
        <button
          onClick={() => setActiveTab('analysis')}
          className={`px-8 py-5 text-base font-semibold border-b-3 transition-colors ${
            activeTab === 'analysis' ?
              'border-gray-900 text-gray-900 bg-gray-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Analysis
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-8 py-5 text-base font-semibold border-b-3 transition-colors ${
            activeTab === 'transactions' ?
              'border-gray-900 text-gray-900 bg-gray-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Transactions History
        </button>
      </div>

      {/* Tab Content */}
      <div className='p-6'>
        {activeTab === 'analysis' && (
          <div className='flex items-center justify-center py-12'>
            <div className='text-center'>
              <div className='text-gray-400 mb-3'>
                <svg
                  className='w-16 h-16 mx-auto'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
                  />
                </svg>
              </div>
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                Analysis Coming Soon
              </h3>
              <p className='text-gray-500'>
                This feature is currently under development.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div>
            {/* Transaction Summary */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              {/* Avg. Buy Price */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-sm text-gray-500 mb-2'>Avg. Buy Price</div>
                <div className='text-2xl font-semibold text-gray-900'>
                  {avgBuyPrice > 0 ? formatCurrency(avgBuyPrice) : '-'}
                </div>
              </div>

              {/* Avg. Sell Price */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-sm text-gray-500 mb-2'>
                  Avg. Sell Price
                </div>
                <div className='text-2xl font-semibold text-gray-900'>
                  {avgSellPrice > 0 ? formatCurrency(avgSellPrice) : '-'}
                </div>
              </div>

              {/* # Transactions */}
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-sm text-gray-500 mb-2'># Transactions</div>
                <div className='text-2xl font-semibold text-gray-900'>
                  {totalTransactions}
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className='space-y-4'>
              {sortedTransactions.map(transaction => {
                const totalCost =
                  (transaction.price || 0) * transaction.amount +
                  (transaction.fee || 0);
                const currentWorth = asset.price * transaction.amount;
                const delta = currentWorth - totalCost;
                const deltaPercentage =
                  totalCost > 0 ? (delta / totalCost) * 100 : 0;
                const isPositive = delta >= 0;

                return (
                  <div
                    key={transaction.id}
                    className='border border-gray-200 rounded-lg overflow-hidden'
                  >
                    {/* Transaction Header */}
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-3'>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              transaction.type === 'buy' ?
                                'bg-emerald-100 text-emerald-700'
                              : transaction.type === 'sell' ?
                                'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1)}
                          </span>
                          <span className='text-sm text-gray-600'>
                            {formatDate(transaction.date)} via Exchange
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className='p-4'>
                      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
                        {/* Buy/Sell Price */}
                        <div>
                          <div className='text-sm text-gray-500 mb-1'>
                            {transaction.type === 'buy' ?
                              'Buy Price'
                            : transaction.type === 'sell' ?
                              'Sell Price'
                            : 'Price'}{' '}
                            ({asset.symbol}/USD)
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {transaction.price ?
                              formatCurrency(transaction.price)
                            : 'N/A'}
                          </div>
                        </div>

                        {/* Amount */}
                        <div>
                          <div className='text-sm text-gray-500 mb-1'>
                            {transaction.type === 'transfer' ?
                              'Amount Transferred'
                            : 'Amount Added'}
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {formatQuantity(transaction.amount)}
                          </div>
                        </div>

                        {/* Cost/Worth */}
                        <div>
                          <div className='text-sm text-gray-500 mb-1'>
                            {transaction.type === 'buy' ?
                              'Cost (Incl. Fee)'
                            : 'Worth'}
                          </div>
                          <div className='font-semibold text-gray-900'>
                            {transaction.type === 'buy' ?
                              formatCurrency(totalCost)
                            : formatCurrency(currentWorth)}
                          </div>
                        </div>

                        {/* Delta/Performance */}
                        {transaction.type === 'buy' && (
                          <div>
                            <div className='text-sm text-gray-500 mb-1'>
                              Delta
                            </div>
                            <div
                              className={`font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                            >
                              {isPositive ? '+' : ''}
                              {deltaPercentage.toFixed(2)}%
                            </div>
                          </div>
                        )}

                        {transaction.type === 'transfer' && (
                          <div>
                            <div className='text-sm text-gray-500 mb-1'>
                              {transaction.from ?
                                `Due to ${transaction.from.replace('_', ' ')} of`
                              : 'Transfer Type'}
                            </div>
                            <div className='font-semibold text-gray-900'>
                              {asset.symbol}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      {transaction.notes && (
                        <div className='mt-3 pt-3 border-t border-gray-100'>
                          <div className='text-sm text-gray-600'>
                            {transaction.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { mockAssets } from '@/utils/mockHoldingsData';
import { usePortfolio } from '@/hooks/usePortfolioContext';

import type { Transaction, Portfolio } from '@/utils/mockHoldingsData';

type CashTransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
  activePortfolio?: Portfolio | null;
};

const cashCurrencies = mockAssets.filter(asset => asset.type === 'cash');

export default function CashTransactionModal({
  isOpen,
  onClose,
  transaction = null,
  activePortfolio = null,
}: CashTransactionModalProps) {
  const { addTransaction, updateTransaction, activePortfolioId } =
    usePortfolio();
  const isEditMode = !!transaction;

  const [transactionType, setTransactionType] = useState<
    'deposit' | 'withdrawal'
  >('deposit');
  const [currencyId, setCurrencyId] = useState<string>('usd');
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0],
  );
  const [time, setTime] = useState<string>(
    new Date().toTimeString().slice(0, 5),
  );
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (transaction && isOpen) {
      setTransactionType(transaction.type as 'deposit' | 'withdrawal');
      setCurrencyId(transaction.assetId);
      setAmount(transaction.amount.toString());
      const transactionDate = new Date(transaction.date);
      setDate(transactionDate.toISOString().split('T')[0]);
      setTime(transactionDate.toTimeString().slice(0, 5));
      setNotes(transaction.notes || '');
    } else if (!transaction && isOpen) {
      // Reset form for new transaction
      setTransactionType('deposit');
      setCurrencyId('usd');
      setAmount('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime(new Date().toTimeString().slice(0, 5));
      setNotes('');
    }
  }, [transaction, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activePortfolioId || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsSubmitting(true);

    const transactionData: Omit<Transaction, 'id'> = {
      assetId: currencyId,
      type: transactionType,
      amount: parseFloat(amount),
      date: new Date(`${date}T${time}`),
      notes: notes.trim() || undefined,
      price: 1, // Cash is always 1:1 with itself
    };

    if (isEditMode && transaction) {
      // Check if this is a derived transaction from buy/sell
      if (transaction.id.startsWith('cash-') && activePortfolio) {
        // Find and update the underlying asset transaction
        const match = transaction.id.match(/^cash-(.+?)-(out|in)$/);
        if (match) {
          const originalTransactionId = match[1];
          const originalTransaction = activePortfolio.transactions.find(
            t => t.id === originalTransactionId,
          );

          if (originalTransaction && originalTransaction.price) {
            // Back-calculate the asset amount based on the new cash amount
            const newCashAmount = parseFloat(amount);
            const assetAmount =
              (newCashAmount - (originalTransaction.fee || 0)) /
              originalTransaction.price;

            // Update the original asset transaction
            updateTransaction(activePortfolioId, originalTransactionId, {
              ...originalTransaction,
              amount: assetAmount,
              date: new Date(`${date}T${time}`),
              notes: notes.trim() || originalTransaction.notes,
            });
          }
        }
      } else {
        // Regular cash transaction, update normally
        updateTransaction(activePortfolioId, transaction.id, transactionData);
      }
    } else {
      addTransaction(activePortfolioId, transactionData);
    }

    // Reset form
    setIsSubmitting(false);
    onClose();
  };

  if (!isOpen) return null;

  const selectedCurrency =
    cashCurrencies.find(c => c.id === currencyId) || cashCurrencies[0];

  return (
    <section className='fixed inset-0 z-50 overflow-y-auto'>
      <article className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity'
          onClick={onClose}
        />

        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600 cursor-pointer'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          <div className='mt-8'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              {isEditMode ? 'Edit Cash Transaction' : 'Add Cash Transaction'}
            </h2>

            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* Deposit / Withdrawal Selection */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                  Transaction Type
                </label>
                <div className='flex gap-4'>
                  <label className='flex-1 cursor-pointer'>
                    <input
                      type='radio'
                      name='transactionType'
                      value='deposit'
                      checked={transactionType === 'deposit'}
                      onChange={e =>
                        setTransactionType(e.target.value as 'deposit')
                      }
                      className='sr-only'
                    />
                    <div
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        transactionType === 'deposit' ?
                          'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
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
                          d='M12 6v6m0 0v6m0-6h6m-6 0H6'
                        />
                      </svg>
                      <span className='font-medium'>Deposit</span>
                    </div>
                  </label>
                  <label className='flex-1 cursor-pointer'>
                    <input
                      type='radio'
                      name='transactionType'
                      value='withdrawal'
                      checked={transactionType === 'withdrawal'}
                      onChange={e =>
                        setTransactionType(e.target.value as 'withdrawal')
                      }
                      className='sr-only'
                    />
                    <div
                      className={`flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        transactionType === 'withdrawal' ?
                          'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
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
                          d='M20 12H4'
                        />
                      </svg>
                      <span className='font-medium'>Withdraw</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Currency Selection */}
              <div>
                <label
                  htmlFor='currency'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Currency
                </label>
                <select
                  id='currency'
                  value={currencyId}
                  onChange={e => setCurrencyId(e.target.value)}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                >
                  {cashCurrencies.map(currency => (
                    <option key={currency.id} value={currency.id}>
                      {currency.symbol} - {currency.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date and Time */}
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label
                    htmlFor='date'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Date
                  </label>
                  <input
                    type='date'
                    id='date'
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  />
                </div>
                <div>
                  <label
                    htmlFor='time'
                    className='block text-sm font-medium text-gray-700 mb-2'
                  >
                    Time
                  </label>
                  <input
                    type='time'
                    id='time'
                    value={time}
                    onChange={e => setTime(e.target.value)}
                    required
                    className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                  />
                </div>
              </div>

              {/* Amount */}
              <div>
                <label
                  htmlFor='amount'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Amount ({selectedCurrency.symbol})
                </label>
                <input
                  type='number'
                  id='amount'
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder='0.00'
                  min='0'
                  step='0.01'
                  required
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500'
                />
              </div>

              {/* Notes */}
              <div>
                <label
                  htmlFor='notes'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Notes (optional)
                </label>
                <textarea
                  id='notes'
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder='Add any notes about this transaction...'
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none'
                />
              </div>

              {/* Submit Button */}
              <div className='flex gap-3 pt-4'>
                <button
                  type='button'
                  onClick={onClose}
                  className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  disabled={isSubmitting || !amount || parseFloat(amount) <= 0}
                  className='flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                >
                  {isSubmitting ?
                    isEditMode ?
                      'Updating...'
                    : 'Adding...'
                  : isEditMode ?
                    'Update Transaction'
                  : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </article>
    </section>
  );
}

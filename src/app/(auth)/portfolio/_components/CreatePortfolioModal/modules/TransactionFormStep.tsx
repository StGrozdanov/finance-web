'use client';

import { useState } from 'react';
import { formatPrice } from '@/utils/formatters';

import type {
  Asset,
  Transaction,
  TransactionType,
  TransferSource,
} from '@/app/(auth)/portfolio/utils/mockHoldingsData';

type TransactionFormStepProps = {
  asset: Asset;
  transactionType: TransactionType;
  onTypeChange: (type: TransactionType) => void;
  onSubmit: (transactionData: Transaction) => void;
};

const transferSources: { id: TransferSource; label: string }[] = [
  { id: 'exchange', label: 'Exchange' },
  { id: 'my_wallet', label: 'My Wallet' },
  { id: 'other_wallet', label: 'Other Wallet (not yours)' },
  { id: 'airdrop', label: 'Airdrop' },
  { id: 'mining', label: 'Mining' },
  { id: 'fork', label: 'Fork' },
  { id: 'dividends_staking', label: 'Dividends / Staking' },
  { id: 'other_unknown', label: 'Other / Unknown' },
];

type FormData = {
  amount: string;
  price: string;
  fee: string;
  notes: string;
  date: string;
  time: string;
  handleCash: boolean;
  transferFrom: TransferSource;
  transferTo: TransferSource;
};

export default function TransactionFormStep({
  asset,
  transactionType,
  onTypeChange,
  onSubmit,
}: TransactionFormStepProps) {
  const [formData, setFormData] = useState<FormData>({
    amount: '',
    price: asset.price.toString(),
    fee: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:12',
    handleCash: true,
    transferFrom: 'exchange',
    transferTo: 'my_wallet',
  });

  const updateFormData = (
    field: keyof FormData,
    value: string | boolean | TransferSource,
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const transactionData: Transaction = {
      id: '1',
      assetId: asset.id,
      type: transactionType,
      amount: parseFloat(formData.amount),
      price:
        (
          transactionType !== 'transfer' &&
          transactionType !== 'deposit' &&
          transactionType !== 'withdrawal'
        ) ?
          parseFloat(formData.price)
        : undefined,
      fee: formData.fee ? parseFloat(formData.fee) : undefined,
      date: new Date(`${formData.date}T${formData.time}`),
      notes: formData.notes.trim() || undefined,
      from: transactionType === 'transfer' ? formData.transferFrom : undefined,
      to: transactionType === 'transfer' ? formData.transferTo : undefined,
    };

    onSubmit(transactionData);
  };

  return (
    <div>
      <div className='mb-6'>
        <div className='flex items-center gap-3 mb-4'>
          <div className='w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center'>
            <span className='text-sm font-semibold text-emerald-600'>
              {asset.symbol.slice(0, 2)}
            </span>
          </div>
          <span className='text-xl font-bold text-gray-900'>
            {asset.symbol}
          </span>
        </div>

        <div className='flex rounded-lg border border-gray-200 p-1'>
          {(asset.type === 'cash' ?
            (['deposit', 'withdrawal'] as TransactionType[])
          : (['buy', 'sell', 'transfer'] as TransactionType[])
          ).map(type => (
            <button
              key={type}
              type='button'
              onClick={() => onTypeChange(type)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                transactionType === type ?
                  type === 'buy' || type === 'deposit' ?
                    'bg-emerald-500 text-white'
                  : type === 'sell' || type === 'withdrawal' ?
                    'bg-red-500 text-white'
                  : 'bg-purple-500 text-white'
                : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className='space-y-4'>
        {transactionType === 'transfer' && (
          <>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sent/Received From
              </label>
              <select
                value={formData.transferFrom}
                onChange={e =>
                  updateFormData(
                    'transferFrom',
                    e.target.value as TransferSource,
                  )
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
              >
                {transferSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Sent To
              </label>
              <select
                value={formData.transferTo}
                onChange={e =>
                  updateFormData('transferTo', e.target.value as TransferSource)
                }
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
              >
                {transferSources.map(source => (
                  <option key={source.id} value={source.id}>
                    {source.label}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            {transactionType === 'transfer' ?
              `Amount Transferred (in ${asset.symbol})`
            : transactionType === 'deposit' ?
              'Amount Deposited'
            : transactionType === 'withdrawal' ?
              'Amount Withdrawn'
            : transactionType === 'buy' ?
              'Amount Bought'
            : 'Amount Sold'}
          </label>
          <input
            type='number'
            step='any'
            value={formData.amount}
            onChange={e => updateFormData('amount', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
            required
            placeholder='0.00'
          />
        </div>

        {transactionType !== 'transfer' &&
          transactionType !== 'deposit' &&
          transactionType !== 'withdrawal' && (
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                {transactionType === 'buy' ?
                  'Buy Price in USD'
                : 'Sell Price in USD'}
                <span className='ml-2 text-sm text-gray-500'>per coin</span>
              </label>
              <input
                type='number'
                step='any'
                value={formData.price}
                onChange={e => updateFormData('price', e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
                required
                placeholder={formatPrice(asset.price)}
              />
            </div>
          )}

        <div className='grid grid-cols-2 gap-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Date & time
            </label>
            <input
              type='date'
              value={formData.date}
              onChange={e => updateFormData('date', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
              required
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              &nbsp;
            </label>
            <input
              type='time'
              value={formData.time}
              onChange={e => updateFormData('time', e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
              required
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Exchange/Transaction Fee
            <select className='ml-2 text-sm border-0 bg-transparent focus:ring-0'>
              <option>
                {transactionType === 'transfer' ? asset.symbol : 'USD'}
              </option>
            </select>
          </label>
          <input
            type='number'
            step='any'
            value={formData.fee}
            onChange={e => updateFormData('fee', e.target.value)}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
            placeholder='0.00'
          />
        </div>

        {transactionType !== 'transfer' &&
          transactionType !== 'deposit' &&
          transactionType !== 'withdrawal' &&
          asset.type !== 'cash' && (
            <div className='flex items-center'>
              <input
                type='checkbox'
                id='add-to-cash'
                checked={formData.handleCash}
                onChange={e => updateFormData('handleCash', e.target.checked)}
                className='h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded'
              />
              <label
                htmlFor='add-to-cash'
                className='ml-2 text-sm text-gray-700'
              >
                {transactionType === 'buy' ?
                  'Deduct from USD available cash'
                : 'Add to USD available cash'}
              </label>
            </div>
          )}

        <div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={e => updateFormData('notes', e.target.value)}
            rows={3}
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
            placeholder='Add any notes about this transaction...'
          />
        </div>

        <div className='pt-4'>
          <button
            type='submit'
            disabled={!formData.amount}
            className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
              transactionType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600'
              : transactionType === 'sell' ? 'bg-red-500 hover:bg-red-600'
              : 'bg-purple-500 hover:bg-purple-600'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            Add Transaction
          </button>
        </div>
      </form>
    </div>
  );
}

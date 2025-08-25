'use client';

import { AssetType, assetTypeInfo } from '@/app/_data/portfolioData';

interface Props {
  type: AssetType | 'cash';
  totalValue: number;
  totalGain: number;
  totalGainPercentage: number;
  assetCount: number;
  onClick: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatChange = (amount: number) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return amount >= 0 ? `+${formatted}` : `-${formatted}`;
};

const formatPercentage = (percentage: number) => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

export default function CategoryCard({
  type,
  totalValue,
  totalGain,
  totalGainPercentage,
  assetCount,
  onClick,
}: Props) {
  const isPositive = totalGain >= 0;

  const info =
    type === 'cash' ?
      { title: 'Available Cash', icon: '💵' }
    : assetTypeInfo[type as AssetType];

  return (
    <button
      onClick={onClick}
      className='w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors text-left'
    >
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-3'>
          <span className='text-2xl'>{info.icon}</span>
          <h3 className='font-semibold text-gray-900'>{info.title}</h3>
        </div>
        {type !== 'cash' && (
          <div className='text-right'>
            <div className='text-sm text-gray-500'>
              {assetCount} asset{assetCount !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </div>

      <div className='space-y-2'>
        <div className='flex items-center justify-between'>
          <span className='text-2xl font-bold text-gray-900'>
            {formatCurrency(totalValue)}
          </span>
        </div>

        {type !== 'cash' && totalGain !== 0 && (
          <div className='flex items-center justify-between'>
            <span
              className={`text-sm font-medium ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatChange(totalGain)}
            </span>
            <span
              className={`text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatPercentage(totalGainPercentage)}
            </span>
          </div>
        )}
      </div>
    </button>
  );
}

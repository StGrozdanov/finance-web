'use client';

import { assetTypeInfo } from '../../../utils/mockHoldingsData';
import {
  formatCurrency,
  formatChange,
  formatPercentage,
} from '@/utils/formatters';

import type { AssetType } from '../../../utils/mockHoldingsData';

type CategoryCardProps = {
  type: AssetType | 'cash';
  totalValue: number;
  totalGain: number;
  totalGainPercentage: number;
  assetCount: number;
  onClick: () => void;
};

export default function CategoryCard({
  type,
  totalValue,
  totalGain,
  totalGainPercentage,
  assetCount,
  onClick,
}: CategoryCardProps) {
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

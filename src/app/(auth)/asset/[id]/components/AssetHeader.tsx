'use client';

import { Asset } from '@/app/_data/portfolioData';
import { PortfolioAsset } from '@/app/_utils/portfolioCalculations';
import { useFollowing } from '@/app/_contexts/FollowingContext';
import Image from 'next/image';

interface Props {
  asset: Asset;
  portfolioAsset: PortfolioAsset | null;
  performanceAbs: number;
  performancePct: number;
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

const formatPercentage = (percentage: number) => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};

export default function AssetHeader({ asset, portfolioAsset }: Props) {
  const isPositiveChange = asset.change24h >= 0;
  const hasHoldings = portfolioAsset !== null;
  const { isFollowing, toggleFollow } = useFollowing();
  const isFollowed = isFollowing(asset.id);

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-6'>
      {/* Asset title */}
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-4'>
          {asset.imageUrl ?
            <Image
              src={asset.imageUrl}
              alt={asset.name}
              className='w-12 h-12 rounded-full'
            />
          : <div className='w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center'>
              <span className='text-lg font-bold text-orange-600'>
                {asset.symbol.slice(0, 2)}
              </span>
            </div>
          }
          <div>
            <div className='flex items-center gap-2'>
              <h1 className='text-2xl font-bold text-gray-900'>
                {asset.symbol}
              </h1>
              <span className='text-lg text-gray-600'>{asset.name}</span>
            </div>
          </div>
        </div>

        {/* Following Star */}
        <button
          onClick={() => toggleFollow(asset.id)}
          className={`p-2 transition-colors ${
            isFollowed ?
              'text-yellow-500 hover:text-yellow-600'
            : 'text-gray-400 hover:text-yellow-500'
          }`}
          title={isFollowed ? 'Unfollow this asset' : 'Follow this asset'}
        >
          <svg
            className='w-6 h-6'
            fill={isFollowed ? 'currentColor' : 'none'}
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
            />
          </svg>
        </button>
      </div>

      {/* Metrics Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {/* Amount Owned */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>Amount Owned</div>
          <div className='text-lg font-semibold text-gray-900'>
            {hasHoldings ? formatQuantity(portfolioAsset.quantity) : '0.00'}
          </div>
        </div>

        {/* % Change */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>% Change</div>
          <div
            className={`text-lg font-semibold ${isPositiveChange ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {formatPercentage(asset.change24h)}
          </div>
        </div>

        {/* Realized Profit / Loss */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>
            Realized Profit / Loss
          </div>
          <div className='text-lg font-semibold text-gray-900'>$0.00</div>
        </div>

        {/* Unrealized Profit / Loss */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>
            Unrealized Profit / Loss
          </div>
          <div
            className={`text-lg font-semibold ${hasHoldings && portfolioAsset.unrealizedGain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
          >
            {hasHoldings ?
              formatCurrency(portfolioAsset.unrealizedGain)
            : '$0.00'}
          </div>
        </div>

        {/* Current Value */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>Current Value</div>
          <div className='flex flex-col'>
            <span className='text-lg font-semibold text-gray-900'>
              {hasHoldings ?
                formatCurrency(portfolioAsset.currentValue)
              : '$0.00'}
            </span>
            {hasHoldings && (
              <span
                className={`text-sm font-medium ${portfolioAsset.unrealizedGain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                ({formatPercentage(portfolioAsset.unrealizedGainPercentage)})
              </span>
            )}
          </div>
        </div>

        {/* Avg Buy Price */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>Avg Buy Price</div>
          <div className='text-lg font-semibold text-gray-900'>
            {hasHoldings ?
              formatCurrency(portfolioAsset.averagePrice)
            : '$0.00'}
          </div>
        </div>

        {/* Total Amount Invested */}
        <div>
          <div className='text-sm text-gray-500 mb-1'>
            Total Amount Invested
          </div>
          <div className='text-lg font-semibold text-gray-900'>
            {hasHoldings ?
              formatCurrency(portfolioAsset.totalInvested)
            : '$0.00'}
          </div>
        </div>
      </div>
    </div>
  );
}

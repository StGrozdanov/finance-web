'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useFollowing } from '@/app/_contexts/FollowingContext';
import { mockAssets, AssetType } from '@/app/_data/portfolioData';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatLargeNumber = (num: number) => {
  if (num >= 1e12) {
    return `$${(num / 1e12).toFixed(2)} T`;
  }
  if (num >= 1e9) {
    return `$${(num / 1e9).toFixed(2)} B`;
  }
  if (num >= 1e6) {
    return `$${(num / 1e6).toFixed(2)} M`;
  }
  return formatCurrency(num);
};

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// Mock market cap and volume data
const mockMarketData: Record<string, { marketCap: number; volume24h: number }> =
  {
    btc: { marketCap: 2.34e12, volume24h: 39.57e9 },
    eth: { marketCap: 534.02e9, volume24h: 38.78e9 },
    nvda: { marketCap: 4.44e12, volume24h: 18.38e9 },
    meta: { marketCap: 1.96e12, volume24h: 5.6e9 },
    tsla: { marketCap: 1.08e12, volume24h: 16.95e9 },
    msft: { marketCap: 3.88e12, volume24h: 8.67e9 },
    aapl: { marketCap: 3.45e12, volume24h: 8.85e9 },
  };

const TIMEFRAMES = [
  { label: '1H', value: '1H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
] as const;

type Timeframe = (typeof TIMEFRAMES)[number]['value'];

export default function FollowingPage() {
  const { followedAssets, unfollowAsset } = useFollowing();
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | 'All'>(
    'All',
  );
  const [searchQuery, setSearchQuery] = useState('');

  const followedAssetsList = useMemo(() => {
    const dummyFollowedAssets = [
      'btc',
      'eth',
      'nvda',
      'aapl',
      'tsla',
      'meta',
      'msft',
    ];

    // Use actual followed assets if any exist, otherwise use dummy data
    const assetsToShow =
      followedAssets.size > 0 ?
        Array.from(followedAssets)
      : dummyFollowedAssets;

    return assetsToShow
      .map(assetId => mockAssets.find(asset => asset.id === assetId))
      .filter(Boolean)
      .map(asset => ({
        ...asset!,
        marketData: mockMarketData[asset!.id] || { marketCap: 0, volume24h: 0 },
      }));
  }, [followedAssets]);

  const filteredAssets = useMemo(() => {
    let filtered = followedAssetsList;

    // Filter by asset type
    if (selectedAssetType !== 'All') {
      filtered = filtered.filter(asset => asset.type === selectedAssetType);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        asset =>
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [followedAssetsList, selectedAssetType, searchQuery]);

  return (
    <div className='px-8 py-4'>
      {/* Header Controls */}
      <div className='flex items-center justify-between mb-6'>
        {/* Asset Type Filter */}
        <div className='flex items-center gap-4'>
          <select
            value={selectedAssetType}
            onChange={e =>
              setSelectedAssetType(e.target.value as AssetType | 'All')
            }
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          >
            <option value='All'>All</option>
            <option value='crypto'>Crypto</option>
            <option value='stocks'>Stocks</option>
            <option value='indices'>Indices</option>
            <option value='funds'>Funds</option>
            <option value='commodities'>Commodities</option>
          </select>
        </div>

        {/* Search and Timeframe */}
        <div className='flex items-center gap-4'>
          <div className='relative'>
            <input
              type='text'
              placeholder='Filter assets'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            />
            <svg
              className='w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>

          {/* Timeframe Pills */}
          <div className='flex bg-gray-100 rounded-lg p-1'>
            {TIMEFRAMES.map(timeframe => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedTimeframe === timeframe.value ?
                    'bg-black text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      {followedAssets.size === 0 && (
        <div className='mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4'>
          <div className='flex items-center gap-2'>
            <svg
              className='w-5 h-5 text-blue-600'
              fill='currentColor'
              viewBox='0 0 20 20'
            >
              <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
              />
            </svg>
            <div>
              <h4 className='text-sm font-medium text-blue-900'>Demo Data</h4>
              <p className='text-sm text-blue-700'>
                Showing popular assets as examples. Star assets on their detail
                pages to add them to your following list.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      {filteredAssets.length === 0 ?
        <div className='text-center py-12'>
          <div className='w-16 h-16 mx-auto mb-4 text-gray-400'>
            <svg fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
              />
            </svg>
          </div>
          <h3 className='text-lg font-medium text-gray-900 mb-2'>
            No assets found
          </h3>
          <p className='text-gray-500 mb-4'>
            Try adjusting your search or filter criteria
          </p>
        </div>
      : <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Asset
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Price
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Change
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  % Change
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Cap
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Vol.(24H)
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredAssets.map(asset => {
                const isPositive = asset.change24h >= 0;
                const changeAmount = (asset.change24h / 100) * asset.price;

                return (
                  <tr key={asset.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Link
                        href={`/asset/${asset.id}`}
                        className='flex items-center gap-3 hover:text-blue-600'
                      >
                        <div className='w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center'>
                          <span className='text-sm font-semibold text-orange-600'>
                            {asset.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className='font-medium text-gray-900'>
                            {asset.symbol}
                          </div>
                          <div className='text-sm text-gray-500'>
                            {asset.name}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {formatCurrency(asset.price)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {isPositive ? '+' : ''}
                        {formatCurrency(changeAmount)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        Post: {isPositive ? '+' : ''}
                        {formatCurrency(changeAmount * 0.1)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div
                        className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {formatPercentage(asset.change24h)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        Post: {formatPercentage(asset.change24h * 0.1)}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatLargeNumber(asset.marketData.marketCap)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatLargeNumber(asset.marketData.volume24h)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {followedAssets.has(asset.id) ?
                        <button
                          onClick={() => unfollowAsset(asset.id)}
                          className='text-yellow-500 hover:text-yellow-600 transition-colors'
                          title='Unfollow this asset'
                        >
                          <svg
                            className='w-5 h-5'
                            fill='currentColor'
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
                      : <Link
                          href={`/asset/${asset.id}`}
                          className='text-gray-400 hover:text-yellow-500 transition-colors'
                          title='Visit asset page to follow'
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
                              d='M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z'
                            />
                          </svg>
                        </Link>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      }
    </div>
  );
}

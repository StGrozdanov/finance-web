'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AssetType, getPopularAssetsByType } from '@/app/_data/portfolioData';

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
    amzn: { marketCap: 2.46e12, volume24h: 6.44e9 },
    googl: { marketCap: 2.45e12, volume24h: 4.56e9 },
    sp500: { marketCap: 0, volume24h: 17.03e9 },
    nasdaq: { marketCap: 0, volume24h: 14.17e9 },
    vti: { marketCap: 0, volume24h: 3.64e9 },
    voo: { marketCap: 0, volume24h: 2.8e9 },
    arkk: { marketCap: 0, volume24h: 1.2e9 },
    gold: { marketCap: 0, volume24h: 2.1e9 },
    oil: { marketCap: 0, volume24h: 1.8e9 },
    silver: { marketCap: 0, volume24h: 850e6 },
  };

const ASSET_TABS = [
  { label: 'Stocks', value: 'stocks' as AssetType },
  { label: 'Crypto', value: 'crypto' as AssetType },
  { label: 'Funds', value: 'funds' as AssetType },
  { label: 'Indices', value: 'indices' as AssetType },
  { label: 'Commodities', value: 'commodities' as AssetType },
];

const TIMEFRAMES = [
  { label: '1H', value: '1H' },
  { label: '1D', value: '1D' },
  { label: '1W', value: '1W' },
] as const;

type Timeframe = (typeof TIMEFRAMES)[number]['value'];

export default function MarketsPage() {
  const [activeTab, setActiveTab] = useState<AssetType>('stocks');
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1D');
  const [searchQuery, setSearchQuery] = useState('');

  const currentAssets = useMemo(() => {
    let assets = getPopularAssetsByType(activeTab, 9).map(asset => ({
      ...asset,
      marketData: mockMarketData[asset.id] || { marketCap: 0, volume24h: 0 },
    }));

    // Filter by search query if provided
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      assets = assets.filter(
        asset =>
          asset.symbol.toLowerCase().includes(query) ||
          asset.name.toLowerCase().includes(query),
      );
    }

    return assets;
  }, [activeTab, searchQuery]);

  // Mock data for crypto overview stats
  const cryptoStats = useMemo(() => {
    if (activeTab === 'crypto') {
      return {
        marketCap: { value: 4.02e12, change: 0.03 },
        volume24h: { value: 259.99e9, change: -2.47 },
        btcDominance: { value: 58.29, change: 0.02 },
      };
    }
    return null;
  }, [activeTab]);

  const getTableHeaders = () => {
    const baseHeaders = ['PRICE', 'CHANGE', '% CHANGE'];

    switch (activeTab) {
      case 'crypto':
        return ['RANK', ...baseHeaders, 'CAP', 'VOL.(24H)'];
      case 'stocks':
        return [...baseHeaders, 'CAP', 'VOL.(24H)'];
      case 'funds':
        return [...baseHeaders, 'VOL.(24H)'];
      case 'indices':
        return [...baseHeaders];
      case 'commodities':
        return ['CODE', ...baseHeaders];
      default:
        return baseHeaders;
    }
  };

  return (
    <div className='px-8 py-4'>
      {/* Header with Search */}
      <div className='flex items-center justify-between mb-6'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='pl-10 pr-4 py-2 w-80 bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white'
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

      {/* Asset Type Tabs */}
      <div className='flex gap-2 mb-6'>
        {ASSET_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.value ?
                'bg-gray-200 text-gray-900'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Crypto Overview Stats */}
      {cryptoStats && (
        <div className='flex gap-6 mb-6'>
          <div>
            <div className='text-sm text-gray-500 mb-1'>Market Cap</div>
            <div className='text-2xl font-bold text-gray-900'>
              {formatLargeNumber(cryptoStats.marketCap.value)}
            </div>
            <div
              className={`text-sm ${cryptoStats.marketCap.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatPercentage(cryptoStats.marketCap.change)}
            </div>
          </div>
          <div>
            <div className='text-sm text-gray-500 mb-1'>24h Volume</div>
            <div className='text-2xl font-bold text-gray-900'>
              {formatLargeNumber(cryptoStats.volume24h.value)}
            </div>
            <div
              className={`text-sm ${cryptoStats.volume24h.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatPercentage(cryptoStats.volume24h.change)}
            </div>
          </div>
          <div>
            <div className='text-sm text-gray-500 mb-1'>BTC Dominance</div>
            <div className='text-2xl font-bold text-gray-900'>
              {cryptoStats.btcDominance.value}%
            </div>
            <div
              className={`text-sm ${cryptoStats.btcDominance.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatPercentage(cryptoStats.btcDominance.change)}
            </div>
          </div>
        </div>
      )}

      {/* Assets Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              {getTableHeaders().map(header => (
                <th
                  key={header}
                  className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {currentAssets.map((asset, index) => {
              const isPositive = asset.change24h >= 0;
              const changeAmount = (asset.change24h / 100) * asset.price;
              const rank = index + 1;

              return (
                <tr key={asset.id} className='hover:bg-gray-50'>
                  {/* Rank column for crypto */}
                  {activeTab === 'crypto' && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {rank}
                    </td>
                  )}

                  {/* Code column for commodities */}
                  {activeTab === 'commodities' && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {asset.symbol}
                    </td>
                  )}

                  {/* Asset column for non-commodities */}
                  {activeTab !== 'commodities' && (
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
                  )}

                  {/* Price */}
                  <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                    {formatCurrency(asset.price)}
                  </td>

                  {/* Change */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(changeAmount)}
                    </div>
                    {(activeTab === 'stocks' || activeTab === 'funds') && (
                      <div className='text-xs text-gray-500'>
                        Post: {isPositive ? '+' : ''}
                        {formatCurrency(changeAmount * 0.1)}
                      </div>
                    )}
                  </td>

                  {/* % Change */}
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div
                      className={`text-sm ${isPositive ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {formatPercentage(asset.change24h)}
                    </div>
                    {(activeTab === 'stocks' || activeTab === 'funds') && (
                      <div className='text-xs text-gray-500'>
                        Post: {formatPercentage(asset.change24h * 0.1)}
                      </div>
                    )}
                  </td>

                  {/* Market Cap */}
                  {(activeTab === 'crypto' || activeTab === 'stocks') && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatLargeNumber(asset.marketData.marketCap)}
                    </td>
                  )}

                  {/* Volume */}
                  {(activeTab === 'crypto' ||
                    activeTab === 'stocks' ||
                    activeTab === 'funds') && (
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {formatLargeNumber(asset.marketData.volume24h)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Empty state */}
        {currentAssets.length === 0 && searchQuery && (
          <div className='text-center py-8'>
            <div className='text-gray-500'>
              No assets found matching &quot;{searchQuery}&quot;
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

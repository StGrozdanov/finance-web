'use client';

import { Asset } from '@/app/_data/portfolioData';

interface Props {
  asset: Asset;
}

// Mock market data - in a real app this would come from an API
const getMarketData = (asset: Asset) => {
  const price = asset.price;
  const change24h = asset.change24h;

  // Generate realistic mock data based on asset price
  const marketCap = Math.round((price * 19910000) / 1000000) / 1000; // in trillions/billions
  const volume24h = Math.round((price * 1750000) / 1000000) / 1000; // in billions
  const low24h = price * (1 - (Math.abs(change24h) / 100) * 1.2);
  const high24h = price * (1 + (Math.abs(change24h) / 100) * 0.8);
  const circulatingSupply = 19910000; // Mock supply

  return {
    marketCap,
    volume24h,
    low24h,
    high24h,
    circulatingSupply,
  };
};

const formatLargeNumber = (num: number) => {
  if (num >= 1000) {
    return `$${(num / 1000).toFixed(2)} T`;
  } else if (num >= 1) {
    return `$${num.toFixed(2)} B`;
  } else {
    return `$${(num * 1000).toFixed(2)} M`;
  }
};

const formatPrice = (price: number) => {
  if (price >= 1000) {
    return `$${(price / 1000).toFixed(2)} K`;
  } else {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }
};

const formatSupply = (supply: number) => {
  return `${supply.toLocaleString('en-US')} M`;
};

export default function MarketData({ asset }: Props) {
  const marketData = getMarketData(asset);

  return (
    <div className='mt-8 bg-white rounded-lg border border-gray-200 p-6'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-xl font-semibold text-gray-900'>Market Data</h2>
        <div className='flex items-center gap-2'>
          <span className='text-2xl font-bold text-gray-900'>#1</span>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-5 gap-6'>
        {/* Market Cap */}
        <div>
          <div className='text-sm text-gray-500 mb-2'>Market Cap</div>
          <div className='text-lg font-semibold text-gray-900'>
            {formatLargeNumber(marketData.marketCap)}
          </div>
        </div>

        {/* Volume (24h) */}
        <div>
          <div className='text-sm text-gray-500 mb-2'>Volume (24h)</div>
          <div className='text-lg font-semibold text-gray-900'>
            {formatLargeNumber(marketData.volume24h)}
          </div>
        </div>

        {/* Low (24h) */}
        <div>
          <div className='text-sm text-gray-500 mb-2'>Low (24h)</div>
          <div className='text-lg font-semibold text-gray-900'>
            {formatPrice(marketData.low24h)}
          </div>
        </div>

        {/* High (24h) */}
        <div>
          <div className='text-sm text-gray-500 mb-2'>High (24h)</div>
          <div className='text-lg font-semibold text-gray-900'>
            {formatPrice(marketData.high24h)}
          </div>
        </div>

        {/* Circulating Supply */}
        <div>
          <div className='text-sm text-gray-500 mb-2'>Circulating Supply</div>
          <div className='text-lg font-semibold text-gray-900'>
            {formatSupply(marketData.circulatingSupply)}
          </div>
        </div>
      </div>
    </div>
  );
}

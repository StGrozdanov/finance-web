'use client';

import Link from 'next/link';
import Image from 'next/image';

import type { Timeframe } from '../../../page';
import type { PortfolioAsset } from '../../../../../../utils/portfolioSummary';
import {
  formatCurrency,
  formatQuantity,
  formatPercentage,
} from '@/utils/formatters';

type AssetTableProps = {
  assets: PortfolioAsset[];
  timeframe: Timeframe;
};

// Mock function to get dynamic price change based on timeframe
const getDynamicChange = (asset: PortfolioAsset, timeframe: Timeframe) => {
  // This would normally come from real price data
  // For now, using the 24h change as base and adjusting
  const baseChange = asset.asset.change24h;

  switch (timeframe) {
    case '1H':
      return baseChange * 0.2;
    case '1D':
      return baseChange;
    case '1W':
      return baseChange * 3.5;
    case '1M':
      return baseChange * 8.2;
    case 'YTD':
      return baseChange * 15.4;
    case '1Y':
      return baseChange * 18.7;
    case 'ALL':
      return baseChange * 25.3;
    default:
      return baseChange;
  }
};

export default function AssetTable({ assets, timeframe }: AssetTableProps) {
  return (
    <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Asset
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Owned
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Worth
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Change
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                % Change
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Unit Price
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Avg Buy Price
              </th>
              <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                P/L
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {assets.map(portfolioAsset => {
              const {
                asset,
                quantity,
                currentValue,
                averagePrice,
                unrealizedGain,
                unrealizedGainPercentage,
              } = portfolioAsset;
              const dynamicChange = getDynamicChange(portfolioAsset, timeframe);
              const dynamicChangePercentage =
                (dynamicChange / asset.price) * 100;
              const isPositiveChange = dynamicChange >= 0;
              const isPositivePL = unrealizedGain >= 0;

              return (
                <tr key={asset.id} className='hover:bg-gray-50 cursor-pointer'>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <Link
                      href={`/asset/${asset.id}`}
                      className='flex items-center hover:text-emerald-600 transition-colors'
                    >
                      {asset.imageUrl ?
                        <Image
                          src={asset.imageUrl}
                          alt={asset.name}
                          className='w-8 h-8 rounded-full mr-3'
                        />
                      : <div className='w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3'>
                          <span className='text-sm font-semibold text-emerald-600'>
                            {asset.symbol.slice(0, 2)}
                          </span>
                        </div>
                      }
                      <div>
                        <div className='text-sm font-semibold text-gray-900'>
                          {asset.symbol}
                        </div>
                        <div className='text-sm text-gray-500'>
                          {asset.name}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900'>
                    {formatQuantity(quantity)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-gray-900'>
                    {formatCurrency(currentValue)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                    <span
                      className={`font-medium ${isPositiveChange ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {isPositiveChange ? '+' : ''}
                      {formatCurrency(dynamicChange)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                    <span
                      className={`font-medium ${isPositiveChange ? 'text-emerald-600' : 'text-red-600'}`}
                    >
                      {formatPercentage(dynamicChangePercentage)}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900'>
                    {formatCurrency(asset.price)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900'>
                    {formatCurrency(averagePrice)}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm'>
                    <div className='flex flex-col items-end'>
                      <span
                        className={`font-medium ${isPositivePL ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {isPositivePL ? '+' : ''}
                        {formatCurrency(unrealizedGain)}
                      </span>
                      <span
                        className={`text-xs ${isPositivePL ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {formatPercentage(unrealizedGainPercentage)}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

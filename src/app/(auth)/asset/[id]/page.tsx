'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import { calculatePortfolioSummary } from '@/app/_utils/portfolioCalculations';
import { mockAssets } from '@/app/_data/portfolioData';
import { generateMockTimeSeries } from '@/app/_utils/portfolioCalculations';
import { createApexOptions } from '@/app/(auth)/(home)/utils/apexOptions';
import TimeframePills from '@/app/_components/TimeframePills/TimeframePills';
import AssetHeader from './components/AssetHeader';
import MarketData from './components/MarketData';
import TransactionsHistory from './components/TransactionsHistory';

const ReactApexChart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

export type Timeframe = '1H' | '1D' | '1W' | '1M' | 'YTD' | '1Y' | 'ALL';

export default function AssetPage() {
  const params = useParams();
  const assetId = params.id as string;
  const { getActivePortfolio } = usePortfolio();
  const [timeframe, setTimeframe] = useState<Timeframe>('1Y');
  const [mounted, setMounted] = useState(false);

  const activePortfolio = getActivePortfolio();
  const asset = mockAssets.find(a => a.id === assetId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const portfolioAsset = useMemo(() => {
    if (!activePortfolio || !asset) return null;

    const portfolioSummary = calculatePortfolioSummary(activePortfolio);
    return portfolioSummary.assets.find(a => a.asset.id === assetId) || null;
  }, [activePortfolio, asset, assetId]);

  const assetTransactions = useMemo(() => {
    if (!activePortfolio) return [];
    return activePortfolio.transactions.filter(t => t.assetId === assetId);
  }, [activePortfolio, assetId]);

  const { data, start, end } = useMemo(() => {
    if (!mounted || !asset) {
      return { data: [], start: 0, end: 0 };
    }

    const series = generateMockTimeSeries(asset.price, timeframe);
    const startVal = series.length > 0 ? series[0][1] : 0;
    const endVal = series.length > 0 ? series[series.length - 1][1] : 0;

    return { data: series, start: startVal, end: endVal };
  }, [asset, timeframe, mounted]);

  const performancePct =
    mounted && start !== 0 ? ((end - start) / start) * 100 : 0;
  const performanceAbs = mounted ? end - start : 0;
  const isLoss = performancePct < 0;

  if (!asset) {
    return (
      <div className='px-8 py-4'>
        <div className='text-center py-8'>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Asset Not Found
          </h1>
          <p className='text-gray-600 mb-4'>
            The requested asset could not be found.
          </p>
          <Link
            href='/'
            className='text-emerald-600 hover:text-emerald-700 font-medium'
          >
            Return to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='px-8 py-4'>
      {/* Back link */}
      <Link
        href='/'
        className='inline-flex items-center text-gray-600 hover:text-gray-900 mb-6'
      >
        <svg
          className='w-4 h-4 mr-2'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 19l-7-7 7-7'
          />
        </svg>
        Back to Portfolio
      </Link>

      {/* Asset Header */}
      <AssetHeader
        asset={asset}
        portfolioAsset={portfolioAsset}
        performanceAbs={performanceAbs}
        performancePct={performancePct}
      />

      {/* Chart Section */}
      <div className='mt-8 bg-white rounded-lg border border-gray-200 p-6'>
        <div className='flex justify-between items-center mb-6'>
          <div>
            <div className='text-3xl font-bold text-gray-900'>
              $
              {mounted ?
                asset.price.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : '—'}
            </div>
            <div className='flex items-center gap-2 mt-1'>
              <span
                className={`font-medium ${performanceAbs >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {performanceAbs >= 0 ? '+' : ''}$
                {Math.abs(performanceAbs).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <span
                className={`font-medium ${performanceAbs >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
              >
                {performanceAbs >= 0 ? '+' : ''}
                {performancePct.toFixed(2)}%
              </span>
            </div>
            <div className='text-sm text-gray-500 mt-1'>
              Real-time price as of{' '}
              {new Date().toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
                timeZoneName: 'short',
              })}
            </div>
          </div>
          <TimeframePills value={timeframe} onChange={setTimeframe} />
        </div>

        {mounted ?
          <ReactApexChart
            type='area'
            options={createApexOptions(isLoss)}
            series={[
              {
                name: 'Price',
                data,
              },
            ]}
            height={300}
            key={`${assetId}-${timeframe}`}
          />
        : <div className='h-[300px] w-full rounded-md bg-gradient-to-b from-emerald-200/30 to-transparent' />
        }
      </div>

      {/* Market Data */}
      <MarketData asset={asset} />

      {/* Transactions History */}
      {assetTransactions.length > 0 && (
        <TransactionsHistory asset={asset} transactions={assetTransactions} />
      )}
    </div>
  );
}

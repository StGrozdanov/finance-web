'use client';

import Link from 'next/link';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import { usePortfolioStats } from './hooks/usePortfolioStats';
import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { MetricCard } from './components/MetricCard';
import { PerformerCard } from './components/PerformerCard';
import { PriceHighlightCard } from './components/PriceHighlightCard';
import { DailyMoverItem } from './components/DailyMoverItem';

export default function HomePage() {
  const { getActivePortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();
  const portfolioStats = usePortfolioStats();

  return (
    <div className='px-8 py-4'>
      <div className='flex items-center gap-3 mb-8'>
        <div className='w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center'>
          <svg
            className='w-5 h-5 text-white'
            fill='currentColor'
            viewBox='0 0 20 20'
          >
            <path d='M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z' />
          </svg>
        </div>
        <div className='text-xl font-bold text-gray-900'>Good afternoon!</div>
      </div>

      {activePortfolio && (
        <div className='mb-8'>
          <Link href='/portfolio' className='block'>
            <div className='flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow'>
              <div>
                <div className='flex items-center gap-2'>
                  <span className='text-lg font-semibold text-gray-900'>
                    Main Portfolio
                  </span>
                  <svg
                    className='w-4 h-4 text-gray-400'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M5 13l4 4L19 7'
                    />
                  </svg>
                </div>
                <div className='text-2xl font-bold text-gray-900'>
                  {formatCurrency(portfolioStats.totalValue)}
                </div>
              </div>
              <div className='text-right'>
                <div className='text-sm text-gray-500'>1D</div>
                <div
                  className={`font-medium ${portfolioStats.dailyChangePercentage >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {formatPercentage(portfolioStats.dailyChangePercentage)}{' '}
                  {formatCurrency(portfolioStats.dailyChange)}
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      {activePortfolio && (
        <div className='mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          <MetricCard
            portfolioStats={portfolioStats}
            metric='totalInvestment'
          />
          <MetricCard portfolioStats={portfolioStats} metric='monthlyReturn' />
          <MetricCard
            portfolioStats={portfolioStats}
            metric='annualizedReturn'
          />
          <MetricCard portfolioStats={portfolioStats} metric='totalGainLoss' />
        </div>
      )}

      {activePortfolio &&
        portfolioStats.bestPerformer &&
        portfolioStats.worstPerformer && (
          <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
            <PerformerCard portfolioStats={portfolioStats} type='best' />
            <PerformerCard portfolioStats={portfolioStats} type='worst' />
          </div>
        )}

      {/* Price Highlights */}
      {portfolioStats.priceHighlights.length > 0 && (
        <div className='mb-8'>
          <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
            LOOKING BACK
          </div>
          <div className='text-xl font-bold text-gray-900 mb-4'>
            Price Highlights
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            {portfolioStats.priceHighlights.map((highlight, index) => (
              <PriceHighlightCard key={index} highlight={highlight} />
            ))}
          </div>
        </div>
      )}

      {/* Daily Portfolio Movers */}
      {portfolioStats.dailyMovers.length > 0 && (
        <div className='mb-8'>
          <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
            STAY ON TOP
          </div>
          <div className='text-xl font-bold text-gray-900 mb-4'>
            Daily Portfolio Movers
          </div>

          <div className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='space-y-4'>
              {portfolioStats.dailyMovers.map(mover => {
                const maxAbsChange = Math.max(
                  ...portfolioStats.dailyMovers.map(m => Math.abs(m.change)),
                );
                const barWidth = (Math.abs(mover.change) / maxAbsChange) * 100;

                return (
                  <DailyMoverItem
                    key={mover.asset.id}
                    mover={mover}
                    barWidth={barWidth}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

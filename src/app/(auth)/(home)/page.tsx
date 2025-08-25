'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import { calculatePortfolioSummary } from '@/app/_utils/portfolioCalculations';
import { mockAssets } from '@/app/_data/portfolioData';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatPercentage = (value: number) => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export default function Home() {
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();

  const portfolioStats = useMemo(() => {
    if (!activePortfolio) {
      return {
        totalValue: 0,
        totalInvestment: 0,
        monthlyReturn: 0,
        annualizedReturn: 0,
        bestPerformer: null,
        worstPerformer: null,
        dailyMovers: [],
        priceHighlights: [],
        dailyChange: 0,
        dailyChangePercentage: 0,
      };
    }

    const portfolioSummary = calculatePortfolioSummary(
      activePortfolio,
      includeCashInPortfolio,
    );

    // Calculate total investment (all buy transactions)
    const totalInvestment = activePortfolio.transactions
      .filter(t => t.type === 'buy' || t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount * (t.price || 1) + (t.fee || 0), 0);

    // Calculate daily portfolio change based on holdings and daily asset changes
    const dailyChange = portfolioSummary.assets.reduce((total, asset) => {
      const dailyAssetChange =
        (asset.asset.change24h / 100) * asset.currentValue;
      return total + dailyAssetChange;
    }, 0);

    const dailyChangePercentage =
      portfolioSummary.totalValue > 0 ?
        (dailyChange / portfolioSummary.totalValue) * 100
      : 0;

    // Mock calculations for returns (in real app would use actual historical data)
    const monthlyReturn = 2.4;
    const annualizedReturn = 12.8;

    // Find best and worst performers since portfolio inception
    const performers = portfolioSummary.assets
      .map(asset => ({
        asset: asset.asset,
        performance: asset.unrealizedGainPercentage,
        value: asset.currentValue,
        totalGain: asset.unrealizedGain,
      }))
      .sort((a, b) => b.performance - a.performance);

    const bestPerformer = performers[0] || null;
    const worstPerformer = performers[performers.length - 1] || null;

    // Daily movers - all portfolio assets ranked by daily performance
    const dailyMovers = portfolioSummary.assets
      .map(asset => ({
        asset: asset.asset,
        change: asset.asset.change24h,
        value: asset.currentValue,
        quantity: asset.quantity,
        dailyGainLoss: (asset.asset.change24h / 100) * asset.currentValue,
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    // Price highlights - portfolio assets with notable price movements in different timeframes
    const portfolioAssetIds = new Set(
      portfolioSummary.assets.map(a => a.asset.id),
    );
    const priceHighlights = [
      {
        asset: mockAssets.find(
          a => a.symbol === 'ETH' && portfolioAssetIds.has(a.id),
        ),
        period: 'In the last month',
        change: 40.95,
        value: 4424.66,
        gain: 1285.52,
      },
      {
        asset: mockAssets.find(
          a => a.symbol === 'NVDA' && portfolioAssetIds.has(a.id),
        ),
        period: 'In the last 3 month',
        change: 33.84,
        value: 180.45,
        gain: 45.62,
      },
    ].filter(h => h.asset); // Only show highlights for assets in portfolio

    return {
      totalValue: portfolioSummary.totalValue,
      totalInvestment,
      monthlyReturn,
      annualizedReturn,
      bestPerformer,
      worstPerformer,
      dailyMovers,
      priceHighlights,
      dailyChange,
      dailyChangePercentage,
    };
  }, [activePortfolio, includeCashInPortfolio]);

  return (
    <div className='px-8 py-4'>
      {/* Greeting */}
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
        <div>
          <div className='text-xl font-bold text-gray-900'>Good afternoon!</div>
          <Link href='/insights' className='text-gray-600 hover:text-gray-800'>
            Check your notifications →
          </Link>
        </div>
      </div>

      {/* Portfolio Value Summary */}
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

      {/* Portfolio Metrics Grid */}
      {activePortfolio && (
        <div className='mb-8 grid grid-cols-2 md:grid-cols-4 gap-4'>
          {/* Total Investment */}
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
              Total Investment
            </div>
            <div className='text-xl font-bold text-gray-900'>
              {formatCurrency(portfolioStats.totalInvestment)}
            </div>
          </div>

          {/* Avg Monthly Return */}
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
              Avg Monthly Return
            </div>
            <div className='text-xl font-bold text-emerald-600'>
              {formatPercentage(portfolioStats.monthlyReturn)}
            </div>
          </div>

          {/* Avg Annualized Return */}
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
              Avg Annual Return
            </div>
            <div className='text-xl font-bold text-emerald-600'>
              {formatPercentage(portfolioStats.annualizedReturn)}
            </div>
          </div>

          {/* Total Gain/Loss */}
          <div className='bg-white rounded-lg border border-gray-200 p-4'>
            <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
              Total Gain/Loss
            </div>
            <div
              className={`text-xl font-bold ${portfolioStats.totalValue - portfolioStats.totalInvestment >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
            >
              {formatCurrency(
                portfolioStats.totalValue - portfolioStats.totalInvestment,
              )}
            </div>
          </div>
        </div>
      )}

      {/* Best & Worst Performers */}
      {activePortfolio &&
        portfolioStats.bestPerformer &&
        portfolioStats.worstPerformer && (
          <div className='mb-8 grid grid-cols-1 md:grid-cols-2 gap-4'>
            {/* Best Performer */}
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
                Best Performer
              </div>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center'>
                  <span className='text-emerald-600 font-semibold text-sm'>
                    {portfolioStats.bestPerformer.asset.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className='font-semibold text-gray-900'>
                    {portfolioStats.bestPerformer.asset.symbol}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {portfolioStats.bestPerformer.asset.name}
                  </div>
                </div>
              </div>
              <div className='text-lg font-bold text-emerald-600'>
                {formatPercentage(portfolioStats.bestPerformer.performance)}
              </div>
              <div className='text-sm text-gray-600'>
                {formatCurrency(portfolioStats.bestPerformer.totalGain)} gain
              </div>
            </div>

            {/* Worst Performer */}
            <div className='bg-white rounded-lg border border-gray-200 p-4'>
              <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
                Worst Performer
              </div>
              <div className='flex items-center gap-3 mb-2'>
                <div className='w-10 h-10 bg-red-100 rounded-full flex items-center justify-center'>
                  <span className='text-red-600 font-semibold text-sm'>
                    {portfolioStats.worstPerformer.asset.symbol.slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className='font-semibold text-gray-900'>
                    {portfolioStats.worstPerformer.asset.symbol}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {portfolioStats.worstPerformer.asset.name}
                  </div>
                </div>
              </div>
              <div className='text-lg font-bold text-red-600'>
                {formatPercentage(portfolioStats.worstPerformer.performance)}
              </div>
              <div className='text-sm text-gray-600'>
                {formatCurrency(portfolioStats.worstPerformer.totalGain)}{' '}
                {portfolioStats.worstPerformer.totalGain >= 0 ? 'gain' : 'loss'}
              </div>
            </div>
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
              <div
                key={index}
                className='bg-white rounded-lg border border-gray-200 p-4'
              >
                <div className='flex items-center gap-3 mb-3'>
                  <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 font-semibold'>
                      {highlight.asset?.symbol.slice(0, 2)}
                    </span>
                  </div>
                  <div>
                    <div className='font-semibold text-gray-900'>
                      {highlight.asset?.symbol}
                    </div>
                    <div className='text-sm text-gray-600'>
                      {highlight.asset?.name}
                    </div>
                  </div>
                </div>
                <div className='text-sm text-gray-600 mb-2'>
                  {highlight.period}
                </div>
                <div className='bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium mb-2 inline-block'>
                  ▲ {formatPercentage(highlight.change)}
                </div>
                <div className='text-lg font-bold text-gray-900'>
                  {formatCurrency(highlight.value)}{' '}
                  <span className='text-emerald-600 text-sm'>
                    +{formatCurrency(highlight.gain)}
                  </span>
                </div>
              </div>
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
                  <div key={mover.asset.id} className='flex items-center gap-4'>
                    {/* Asset Info */}
                    <div className='w-16 flex flex-col items-center'>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          mover.change >= 0 ? 'bg-emerald-100' : 'bg-red-100'
                        }`}
                      >
                        <span
                          className={`text-xs font-semibold ${
                            mover.change >= 0 ?
                              'text-emerald-600'
                            : 'text-red-600'
                          }`}
                        >
                          {mover.asset.symbol.slice(0, 2)}
                        </span>
                      </div>
                      <div className='text-xs font-medium text-gray-900 mt-1'>
                        {mover.asset.symbol}
                      </div>
                    </div>

                    {/* Bar Chart */}
                    <div className='flex-1 flex items-center'>
                      <div className='relative w-full h-8 bg-gray-100 rounded'>
                        <div
                          className={`absolute top-0 left-0 h-full rounded ${
                            mover.change >= 0 ?
                              'bg-gradient-to-r from-emerald-400 to-emerald-500'
                            : 'bg-gradient-to-r from-red-400 to-red-500'
                          }`}
                          style={{ width: `${barWidth}%` }}
                        />
                        <div className='absolute inset-0 flex items-center justify-center'>
                          <span className='text-white font-bold text-sm'>
                            {formatPercentage(mover.change)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Value Change */}
                    <div className='w-24 text-right'>
                      <div
                        className={`text-sm font-semibold ${
                          mover.dailyGainLoss >= 0 ?
                            'text-emerald-600'
                          : 'text-red-600'
                        }`}
                      >
                        {formatCurrency(mover.dailyGainLoss)}
                      </div>
                      <div className='text-xs text-gray-500'>
                        {formatCurrency(mover.value)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import { calculatePortfolioSummary } from '@/app/_utils/portfolioCalculations';

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
  return `${sign}${value.toFixed(1)}%`;
};

export default function InsightsPage() {
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();

  const portfolioData = useMemo(() => {
    if (!activePortfolio) {
      return {
        diversity: [],
        totalValue: 0,
        performance: 0,
        benchmarkComparisons: [],
        aiSuggestions: [],
        macroInsights: {
          marketSentiment: 'Unknown',
          fedPolicy: 'Data not available',
          inflation: 'Data not available',
          prediction: 'Insufficient data',
          keyDrivers: [],
          risks: [],
        },
      };
    }

    const portfolioSummary = calculatePortfolioSummary(
      activePortfolio,
      includeCashInPortfolio,
    );

    // Calculate diversity by asset type
    const assetTypeValues = Object.entries(portfolioSummary.assetsByType)
      .map(([type, assets]) => {
        const totalValue = assets.reduce(
          (sum, asset) => sum + asset.currentValue,
          0,
        );
        const percentage =
          portfolioSummary.totalValue > 0 ?
            (totalValue / portfolioSummary.totalValue) * 100
          : 0;

        return {
          type,
          value: totalValue,
          percentage,
          count: assets.length,
        };
      })
      .filter(item => item.value > 0);

    // Calculate overall performance
    const performance =
      portfolioSummary.totalInvested > 0 ?
        ((portfolioSummary.totalValue - portfolioSummary.totalInvested) /
          portfolioSummary.totalInvested) *
        100
      : 0;

    // Calculate benchmark comparisons
    const benchmarkComparisons = [];

    // Crypto vs BTC benchmark
    const cryptoAssets = portfolioSummary.assetsByType.crypto || [];
    if (cryptoAssets.length > 0) {
      const cryptoPerformance =
        cryptoAssets.reduce(
          (sum, asset) => sum + asset.unrealizedGainPercentage,
          0,
        ) / cryptoAssets.length;
      const btcBenchmark = 28.5; // Mock BTC performance
      benchmarkComparisons.push({
        category: 'Crypto Portfolio',
        performance: cryptoPerformance,
        benchmark: btcBenchmark,
        benchmarkName: 'Bitcoin (BTC)',
        outperforming: cryptoPerformance > btcBenchmark,
      });
    }

    // Stocks vs S&P 500 benchmark
    const stockAssets = portfolioSummary.assetsByType.stocks || [];
    if (stockAssets.length > 0) {
      const stockPerformance =
        stockAssets.reduce(
          (sum, asset) => sum + asset.unrealizedGainPercentage,
          0,
        ) / stockAssets.length;
      const sp500Benchmark = 22.1; // Mock S&P 500 performance
      benchmarkComparisons.push({
        category: 'Stock Portfolio',
        performance: stockPerformance,
        benchmark: sp500Benchmark,
        benchmarkName: 'S&P 500 Index',
        outperforming: stockPerformance > sp500Benchmark,
      });
    }

    // AI-powered suggestions
    const aiSuggestions = [
      {
        type: 'buy',
        asset: 'NVDA',
        reason: 'Strong AI growth momentum, upcoming earnings beat expected',
        confidence: 85,
        timeframe: '2-4 weeks',
      },
      {
        type: 'sell',
        asset: 'META',
        reason: 'Regulatory headwinds and market saturation concerns',
        confidence: 72,
        timeframe: '1-2 weeks',
      },
      {
        type: 'hold',
        asset: 'BTC',
        reason: 'Consolidation phase, wait for institutional adoption catalyst',
        confidence: 78,
        timeframe: '4-8 weeks',
      },
    ];

    // Macro economic insights
    const macroInsights = {
      marketSentiment: 'Cautiously Optimistic',
      fedPolicy: 'Dovish pivot expected in Q2 2024',
      inflation: 'Trending lower, supporting risk assets',
      prediction: 'Markets likely to see 8-12% upside in next 9-12 weeks',
      keyDrivers: ['Fed rate cuts', 'AI adoption', 'Geopolitical stability'],
      risks: ['Election volatility', 'China tensions', 'Energy prices'],
    };

    return {
      diversity: assetTypeValues,
      totalValue: portfolioSummary.totalValue,
      performance,
      benchmarkComparisons,
      aiSuggestions,
      macroInsights,
    };
  }, [activePortfolio, includeCashInPortfolio]);

  const getAssetTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      crypto: '#F59E0B',
      stocks: '#3B82F6',
      funds: '#10B981',
      indices: '#8B5CF6',
      commodities: '#F97316',
      nfts: '#EC4899',
      cash: '#6B7280',
    };
    return colors[type] || '#6B7280';
  };

  const getAssetTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      crypto: 'Crypto',
      stocks: 'Stocks',
      funds: 'Funds',
      indices: 'Indices',
      commodities: 'Commodities',
      nfts: 'NFTs',
      cash: 'Cash',
    };
    return labels[type] || type;
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-8 py-12'>
      {/* Header Section */}
      <div className='text-center mb-16'>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
          Unlock the secrets of your
        </h1>
        <h1 className='text-4xl md:text-5xl font-bold text-gray-900 mb-6'>
          portfolio with{' '}
          <span className='text-purple-600'>Portfolio Insights</span>
        </h1>
        <p className='text-lg text-gray-600 mb-8 max-w-2xl mx-auto'>
          Get the most profound and accurate analysis of your investment
          portfolio.
        </p>
        <button className='bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-full text-lg transition-colors'>
          Download for free
        </button>
      </div>

      {/* Main Content Grid */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch'>
        {/* Portfolio Diversity */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Portfolio
              <br />
              Diversity
            </h2>

            {/* Pie Chart Representation */}
            <div className='relative w-48 h-48 mx-auto mb-6'>
              <div className='w-full h-full rounded-full border-8 border-gray-100 relative overflow-hidden'>
                {portfolioData.diversity.map((item, index) => {
                  const rotation = portfolioData.diversity
                    .slice(0, index)
                    .reduce((sum, prev) => sum + prev.percentage * 3.6, 0);

                  return (
                    <div
                      key={item.type}
                      className='absolute inset-0 rounded-full'
                      style={{
                        background: `conic-gradient(from ${rotation}deg, ${getAssetTypeColor(item.type)} 0deg, ${getAssetTypeColor(item.type)} ${item.percentage * 3.6}deg, transparent ${item.percentage * 3.6}deg)`,
                        transform: `rotate(${rotation}deg)`,
                      }}
                    />
                  );
                })}

                {/* Center circle */}
                <div className='absolute inset-4 bg-white rounded-full flex items-center justify-center'>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-gray-900'>
                      {formatCurrency(portfolioData.totalValue)}
                    </div>
                    <div className='text-sm text-gray-500'>Total Value</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className='space-y-2 flex-1'>
              {portfolioData.diversity.map(item => (
                <div
                  key={item.type}
                  className='flex items-center justify-between'
                >
                  <div className='flex items-center gap-2'>
                    <div
                      className='w-3 h-3 rounded-full'
                      style={{ backgroundColor: getAssetTypeColor(item.type) }}
                    />
                    <span className='text-sm text-gray-700'>
                      {getAssetTypeLabel(item.type)}
                    </span>
                  </div>
                  <span className='text-sm font-medium text-gray-900'>
                    {item.percentage.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Portfolio History */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Portfolio History
            </h2>

            {/* Chart Area */}
            <div className='relative h-64 mb-6 flex-1'>
              {/* Decorative wave pattern */}
              <svg className='w-full h-full' viewBox='0 0 300 200' fill='none'>
                <defs>
                  <linearGradient
                    id='waveGradient'
                    x1='0%'
                    y1='0%'
                    x2='100%'
                    y2='0%'
                  >
                    <stop offset='0%' stopColor='#8B5CF6' stopOpacity='0.6' />
                    <stop offset='50%' stopColor='#3B82F6' stopOpacity='0.4' />
                    <stop offset='100%' stopColor='#10B981' stopOpacity='0.6' />
                  </linearGradient>
                </defs>

                {/* Background grid */}
                <defs>
                  <pattern
                    id='grid'
                    width='30'
                    height='20'
                    patternUnits='userSpaceOnUse'
                  >
                    <path
                      d='M 30 0 L 0 0 0 20'
                      fill='none'
                      stroke='#f3f4f6'
                      strokeWidth='1'
                    />
                  </pattern>
                </defs>
                <rect width='100%' height='100%' fill='url(#grid)' />

                {/* Curved line representing portfolio growth */}
                <path
                  d='M 20 160 Q 80 140, 150 100 T 280 80'
                  stroke='url(#waveGradient)'
                  strokeWidth='3'
                  fill='none'
                  strokeLinecap='round'
                />

                {/* Data points */}
                <circle cx='20' cy='160' r='4' fill='#8B5CF6' />
                <circle cx='150' cy='100' r='4' fill='#3B82F6' />
                <circle cx='280' cy='80' r='4' fill='#10B981' />
              </svg>
            </div>

            {/* Performance stats */}
            <div className='text-center'>
              <div className='text-3xl font-bold text-gray-900 mb-2'>
                {formatPercentage(portfolioData.performance)}
              </div>
              <div className='text-sm text-gray-500 mb-4'>
                Overall Performance
              </div>
              <div className='text-xs text-gray-400'>
                Based on your investment history and current portfolio value
              </div>
            </div>
          </div>
        </div>

        {/* Portfolio vs Benchmarks */}
        <div className='lg:col-span-1'>
          <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col'>
            <h2 className='text-2xl font-bold text-gray-900 mb-6'>
              Portfolio vs
              <br />
              Benchmarks
            </h2>

            <p className='text-gray-600 mb-6 text-sm'>
              See how your investments perform against market benchmarks.
            </p>

            {/* Benchmark comparisons */}
            <div className='space-y-4 mb-6 flex-1'>
              {portfolioData.benchmarkComparisons.map((comparison, index) => (
                <div key={index} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm font-medium text-gray-700'>
                      {comparison.category}
                    </span>
                    <div className='flex items-center gap-2'>
                      <span
                        className={`text-sm font-bold ${comparison.outperforming ? 'text-emerald-600' : 'text-red-600'}`}
                      >
                        {formatPercentage(comparison.performance)}
                      </span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${comparison.outperforming ? 'bg-emerald-100' : 'bg-red-100'}`}
                      >
                        {comparison.outperforming ?
                          <svg
                            className='w-3 h-3 text-emerald-600'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L10 6.414 6.707 9.707a1 1 0 01-1.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        : <svg
                            className='w-3 h-3 text-red-600'
                            fill='currentColor'
                            viewBox='0 0 20 20'
                          >
                            <path
                              fillRule='evenodd'
                              d='M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L10 13.586l3.293-3.293a1 1 0 011.414 0z'
                              clipRule='evenodd'
                            />
                          </svg>
                        }
                      </div>
                    </div>
                  </div>

                  <div className='text-xs text-gray-500'>
                    vs {comparison.benchmarkName}:{' '}
                    {formatPercentage(comparison.benchmark)}
                  </div>

                  {/* Performance comparison bar */}
                  <div className='relative h-2 bg-gray-100 rounded-full overflow-hidden'>
                    <div
                      className={`absolute left-0 top-0 h-full rounded-full ${comparison.outperforming ? 'bg-emerald-400' : 'bg-red-400'}`}
                      style={{
                        width: `${Math.min(Math.abs(comparison.performance - comparison.benchmark) * 2, 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}

              {portfolioData.benchmarkComparisons.length === 0 && (
                <div className='text-center text-gray-500 text-sm py-4'>
                  Add assets to see benchmark comparisons
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights & Market Analysis */}
      <div className='max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 items-stretch'>
        {/* AI Trading Suggestions */}
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>
              AI Trading Suggestions
            </h2>
          </div>

          <p className='text-gray-600 mb-6 text-sm'>
            AI-powered recommendations based on market analysis and your
            portfolio.
          </p>

          <div className='space-y-4 flex-1'>
            {portfolioData.aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className='border border-gray-200 rounded-lg p-4'
              >
                <div className='flex items-center justify-between mb-3'>
                  <div className='flex items-center gap-3'>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        suggestion.type === 'buy' ?
                          'bg-emerald-100 text-emerald-700'
                        : suggestion.type === 'sell' ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {suggestion.type.toUpperCase()}
                    </div>
                    <span className='font-bold text-gray-900'>
                      {suggestion.asset}
                    </span>
                  </div>
                  <div className='text-right'>
                    <div className='text-sm font-semibold text-gray-900'>
                      {suggestion.confidence}%
                    </div>
                    <div className='text-xs text-gray-500'>Confidence</div>
                  </div>
                </div>

                <p className='text-sm text-gray-700 mb-2'>
                  {suggestion.reason}
                </p>

                <div className='flex items-center justify-between'>
                  <span className='text-xs text-gray-500'>
                    Timeframe: {suggestion.timeframe}
                  </span>
                  <div className='w-16 h-1 bg-gray-200 rounded-full overflow-hidden'>
                    <div
                      className='h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full'
                      style={{ width: `${suggestion.confidence}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Macro Economic Insights */}
        <div className='bg-white rounded-2xl p-6 shadow-lg border border-gray-100 h-full flex flex-col'>
          <div className='flex items-center gap-2 mb-6'>
            <div className='w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path d='M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z' />
              </svg>
            </div>
            <h2 className='text-2xl font-bold text-gray-900'>Market Outlook</h2>
          </div>

          <p className='text-gray-600 mb-6 text-sm'>
            Macro analysis and 9-12 week market predictions powered by AI.
          </p>

          {/* Market Sentiment */}
          <div className='mb-6'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-sm font-medium text-gray-700'>
                Market Sentiment
              </span>
              <span className='text-lg font-bold text-blue-600'>
                {portfolioData.macroInsights.marketSentiment}
              </span>
            </div>
            <div className='text-xs text-gray-500'>
              {portfolioData.macroInsights.prediction}
            </div>
          </div>

          {/* Key Insights */}
          <div className='space-y-4 flex-1'>
            <div>
              <h4 className='text-sm font-semibold text-gray-900 mb-2'>
                Fed Policy
              </h4>
              <p className='text-sm text-gray-700'>
                {portfolioData.macroInsights.fedPolicy}
              </p>
            </div>

            <div>
              <h4 className='text-sm font-semibold text-gray-900 mb-2'>
                Inflation Outlook
              </h4>
              <p className='text-sm text-gray-700'>
                {portfolioData.macroInsights.inflation}
              </p>
            </div>

            <div>
              <h4 className='text-sm font-semibold text-gray-900 mb-2'>
                Key Drivers
              </h4>
              <div className='flex flex-wrap gap-2'>
                {portfolioData.macroInsights.keyDrivers?.map(
                  (driver: string, index: number) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full'
                    >
                      {driver}
                    </span>
                  ),
                )}
              </div>
            </div>

            <div>
              <h4 className='text-sm font-semibold text-gray-900 mb-2'>
                Risk Factors
              </h4>
              <div className='flex flex-wrap gap-2'>
                {portfolioData.macroInsights.risks?.map(
                  (risk: string, index: number) => (
                    <span
                      key={index}
                      className='px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full'
                    >
                      {risk}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA Section */}
      <div className='max-w-4xl mx-auto text-center bg-white rounded-2xl p-8 shadow-lg border border-gray-100'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8 items-center'>
          <div className='text-left'>
            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
              Get the full experience
            </h3>
            <p className='text-gray-600 mb-6'>
              Download Delta on mobile to access these powerful insights
            </p>
          </div>

          <div className='flex justify-center'>
            {/* QR Code placeholder */}
            <div className='w-32 h-32 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center'>
              <div className='text-center'>
                <div className='text-4xl mb-2'>📱</div>
                <div className='text-xs text-gray-500'>QR Code</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

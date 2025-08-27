import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { PortfolioStats } from '../hooks/usePortfolioStats';

type MetricType =
  | 'totalInvestment'
  | 'monthlyReturn'
  | 'annualizedReturn'
  | 'totalGainLoss';

type MetricCardProps = {
  portfolioStats: PortfolioStats;
  metric: MetricType;
};

const getMetricData = (portfolioStats: PortfolioStats, metric: MetricType) => {
  switch (metric) {
    case 'totalInvestment':
      return {
        label: 'Total Investment',
        value: formatCurrency(portfolioStats.totalInvestment),
        variant: 'default' as const,
      };
    case 'monthlyReturn':
      return {
        label: 'Avg Monthly Return',
        value: formatPercentage(portfolioStats.monthlyReturn),
        variant: 'positive' as const,
      };
    case 'annualizedReturn':
      return {
        label: 'Avg Annual Return',
        value: formatPercentage(portfolioStats.annualizedReturn),
        variant: 'positive' as const,
      };
    case 'totalGainLoss':
      const gainLoss =
        portfolioStats.totalValue - portfolioStats.totalInvestment;
      return {
        label: 'Total Gain/Loss',
        value: formatCurrency(gainLoss),
        variant: gainLoss >= 0 ? ('positive' as const) : ('negative' as const),
      };
  }
};

const getValueColor = (variant: 'positive' | 'negative' | 'default') => {
  switch (variant) {
    case 'positive':
      return 'text-emerald-600';
    case 'negative':
      return 'text-red-600';
    default:
      return 'text-gray-900';
  }
};

export function MetricCard({ portfolioStats, metric }: MetricCardProps) {
  const { label, value, variant } = getMetricData(portfolioStats, metric);

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
        {label}
      </div>
      <div className={`text-xl font-bold ${getValueColor(variant)}`}>
        {value}
      </div>
    </div>
  );
}

import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { PortfolioStats } from '../hooks/usePortfolioStats';

type PerformerCardProps = {
  portfolioStats: PortfolioStats;
  type: 'best' | 'worst';
};

export function PerformerCard({ portfolioStats, type }: PerformerCardProps) {
  const performer =
    type === 'best' ?
      portfolioStats.bestPerformer
    : portfolioStats.worstPerformer;

  if (!performer) return null;

  const title = type === 'best' ? 'Best Performer' : 'Worst Performer';
  const isPositive = type === 'best';
  const bgColor = isPositive ? 'bg-emerald-100' : 'bg-red-100';
  const textColor = isPositive ? 'text-emerald-600' : 'text-red-600';

  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='text-sm text-gray-500 uppercase tracking-wide mb-2'>
        {title}
      </div>
      <div className='flex items-center gap-3 mb-2'>
        <div
          className={`w-10 h-10 ${bgColor} rounded-full flex items-center justify-center`}
        >
          <span className={`${textColor} font-semibold text-sm`}>
            {performer.asset.symbol.slice(0, 2)}
          </span>
        </div>
        <div>
          <div className='font-semibold text-gray-900'>
            {performer.asset.symbol}
          </div>
          <div className='text-sm text-gray-600'>{performer.asset.name}</div>
        </div>
      </div>
      <div className={`text-lg font-bold ${textColor}`}>
        {formatPercentage(performer.performance)}
      </div>
      <div className='text-sm text-gray-600'>
        {formatCurrency(performer.totalGain)}{' '}
        {performer.totalGain >= 0 ? 'gain' : 'loss'}
      </div>
    </div>
  );
}

import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { PortfolioStats } from '../hooks/usePortfolioStats';

type DailyMoverItemProps = {
  mover: PortfolioStats['dailyMovers'][0];
  barWidth: number;
};

export function DailyMoverItem({ mover, barWidth }: DailyMoverItemProps) {
  const isPositive = mover.change >= 0;

  return (
    <div className='flex items-center gap-4'>
      <div className='w-16 flex flex-col items-center'>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isPositive ? 'bg-emerald-100' : 'bg-red-100'
          }`}
        >
          <span
            className={`text-xs font-semibold ${
              isPositive ? 'text-emerald-600' : 'text-red-600'
            }`}
          >
            {mover.asset.symbol.slice(0, 2)}
          </span>
        </div>
        <div className='text-xs font-medium text-gray-900 mt-1'>
          {mover.asset.symbol}
        </div>
      </div>

      <div className='flex-1 flex items-center'>
        <div className='relative w-full h-8 bg-gray-100 rounded'>
          <div
            className={`absolute top-0 left-0 h-full rounded ${
              isPositive ?
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

      <div className='w-24 text-right'>
        <div
          className={`text-sm font-semibold ${
            mover.dailyGainLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
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
}

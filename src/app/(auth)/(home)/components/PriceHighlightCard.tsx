import { formatCurrency, formatPercentage } from '@/utils/formatters';
import { PortfolioStats } from '../hooks/usePortfolioStats';

type PriceHighlightCardProps = {
  highlight: PortfolioStats['priceHighlights'][0];
};

export function PriceHighlightCard({ highlight }: PriceHighlightCardProps) {
  return (
    <div className='bg-white rounded-lg border border-gray-200 p-4'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center'>
          <span className='text-blue-600 font-semibold'>
            {highlight.asset.symbol.slice(0, 2)}
          </span>
        </div>
        <div>
          <div className='font-semibold text-gray-900'>
            {highlight.asset.symbol}
          </div>
          <div className='text-sm text-gray-600'>{highlight.asset.name}</div>
        </div>
      </div>
      <div className='text-sm text-gray-600 mb-2'>{highlight.period}</div>
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
  );
}

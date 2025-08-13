import { Timeframe } from '@/app/(auth)/(home)/page';

type TimeframePillsProps = {
  value: Timeframe;
  onChange: (t: Timeframe) => void;
};

export default function TimeframePills({
  value,
  onChange,
}: TimeframePillsProps) {
  const pills: Timeframe[] = ['1H', '1D', '1W', '1M', 'YTD', '1Y', 'ALL'];

  return (
    <div className='flex flex-wrap gap-2'>
      {pills.map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-neutral-900 hover:text-white ${
            value === p ?
              'bg-neutral-900 text-white'
            : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {p}
        </button>
      ))}
    </div>
  );
}

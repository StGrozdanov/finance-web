import type { Timeframe } from '@/app/(auth)/portfolio/page';

type TimeframePillsProps = {
  value: Timeframe;
  onChange: (timeframe: Timeframe) => void;
  availableTimeframes: Timeframe[];
};

export default function TimeframePills({
  value,
  onChange,
  availableTimeframes,
}: TimeframePillsProps) {
  return (
    <div className='flex flex-wrap gap-2'>
      {availableTimeframes.map(timeframe => (
        <button
          key={timeframe}
          onClick={() => onChange(timeframe)}
          className={`rounded-full px-3 py-1 text-xs font-semibold cursor-pointer hover:bg-neutral-900 hover:text-white ${
            value === timeframe ?
              'bg-neutral-900 text-white'
            : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );
}

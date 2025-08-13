import { TabKey } from '../page';

type PortfolioTabsProps = {
  active: TabKey;
  onChange: (k: TabKey) => void;
};

export default function PortfolioTabs({
  active,
  onChange,
}: PortfolioTabsProps) {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'crypto', label: 'Crypto' },
  ];
  return (
    <div className='flex w-full items-center justify-center gap-8'>
      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={`rounded-full px-5 py-2 text-sm font-semibold cursor-pointer hover:bg-[#1c1c1c] hover:text-white ${
            active === t.key ?
              'bg-[#1c1c1c] text-white'
            : 'bg-neutral-200 text-neutral-700'
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

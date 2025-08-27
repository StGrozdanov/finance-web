import type { AssetType } from '../../utils/mockHoldingsData';

type TabKey = 'overview' | AssetType;

type PortfolioTabsProps = {
  active: TabKey;
  onChange: (k: TabKey) => void;
  availableTabs: TabKey[];
};

const getTabLabel = (key: TabKey): string => {
  if (key === 'overview') return 'Overview';

  const assetType = key as AssetType;
  switch (assetType) {
    case 'crypto':
      return 'Crypto';
    case 'stocks':
      return 'Stocks';
    case 'indices':
      return 'Indices';
    case 'funds':
      return 'Funds';
    case 'commodities':
      return 'Commodities';
    case 'nfts':
      return 'NFTs';
    default:
      return key.charAt(0).toUpperCase() + key.slice(1);
  }
};

export default function PortfolioTabs({
  active,
  onChange,
  availableTabs,
}: PortfolioTabsProps) {
  const tabs = availableTabs.map(key => ({
    key,
    label: getTabLabel(key),
  }));
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

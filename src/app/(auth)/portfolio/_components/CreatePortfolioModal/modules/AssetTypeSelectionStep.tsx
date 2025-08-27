'use client';

import { assetTypeInfo } from '../../../utils/mockHoldingsData';

import type { AssetType } from '../../../utils/mockHoldingsData';

type AssetTypeSelectionStepProps = {
  onSelect: (assetType: AssetType) => void;
};

const assetTypes: AssetType[] = [
  'crypto',
  'stocks',
  'indices',
  'funds',
  'commodities',
  'nfts',
];

export default function AssetTypeSelectionStep({
  onSelect,
}: AssetTypeSelectionStepProps) {
  return (
    <section>
      <h2 className='text-xl font-bold text-gray-900 mb-2'>
        Which asset type would you like to add?
      </h2>

      <div className='grid grid-cols-2 gap-3 mt-6'>
        {assetTypes.map(assetType => {
          const info = assetTypeInfo[assetType];
          return (
            <button
              key={assetType}
              onClick={() => onSelect(assetType)}
              className='p-4 rounded-lg border-2 border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer transition-all text-center'
            >
              <div className='text-3xl mb-2'>{info.icon}</div>
              <div className='font-semibold text-gray-900 mb-1'>
                {info.title}
              </div>
              <div className='text-xs text-gray-600'>{info.description}</div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

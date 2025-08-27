'use client';

import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import { calculatePortfolioSummary } from '../../utils/portfolioSummary';
import { AssetType } from '../../utils/mockHoldingsData';
import CategoryCard from './modules/CategoryCard';
import AssetTable from './modules/AssetTable';
import { TabKey, Timeframe } from '../../page';

type PortfolioHoldingsProps = {
  activeTab: TabKey;
  timeframe: Timeframe;
  onTabChange: (tab: TabKey) => void;
};

export default function PortfolioHoldings({
  activeTab,
  timeframe,
  onTabChange,
}: PortfolioHoldingsProps) {
  const router = useRouter();
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();

  if (!activePortfolio) {
    return null;
  }

  const portfolioSummary = calculatePortfolioSummary(
    activePortfolio,
    includeCashInPortfolio,
  );

  if (activeTab === 'overview') {
    const categories = Object.entries(portfolioSummary.assetsByType)
      .filter(([, assets]) => assets.length > 0)
      .map(([type, assets]) => {
        const totalValue = assets.reduce(
          (sum, asset) => sum + asset.currentValue,
          0,
        );
        const totalInvested = assets.reduce(
          (sum, asset) => sum + asset.totalInvested,
          0,
        );

        const totalGain = totalValue - totalInvested;
        const totalGainPercentage =
          totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;

        return {
          type: type as AssetType,
          totalValue,
          totalGain,
          totalGainPercentage,
          assetCount: assets.length,
        };
      });

    return (
      <div className='mt-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {categories.map(category => (
            <CategoryCard
              key={category.type}
              type={category.type}
              totalValue={category.totalValue}
              totalGain={category.totalGain}
              totalGainPercentage={category.totalGainPercentage}
              assetCount={category.assetCount}
              onClick={() => onTabChange(category.type)}
            />
          ))}

          <CategoryCard
            type='cash'
            totalValue={portfolioSummary.availableCash}
            totalGain={0}
            totalGainPercentage={0}
            assetCount={1}
            onClick={() => router.push('/cash')}
          />
        </div>
      </div>
    );
  }

  const assetType = activeTab;
  const assets = portfolioSummary.assetsByType[assetType] || [];

  if (assets.length === 0) {
    return (
      <div className='mt-8 text-center py-8'>
        <p className='text-gray-500'>No {assetType} holdings found.</p>
      </div>
    );
  }

  return (
    <div className='mt-8'>
      <AssetTable assets={assets} timeframe={timeframe} />
    </div>
  );
}

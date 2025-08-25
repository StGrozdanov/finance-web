'use client';

import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';
import { calculatePortfolioSummary } from '@/app/_utils/portfolioCalculations';
import { AssetType } from '@/app/_data/portfolioData';
import CategoryCard from './modules/CategoryCard';
import AssetTable from './modules/AssetTable';

type TabKey = 'overview' | AssetType;
type Timeframe = '1H' | '1D' | '1W' | '1M' | 'YTD' | '1Y' | 'ALL';

interface Props {
  activeTab: TabKey;
  timeframe: Timeframe;
  onTabChange: (tab: TabKey) => void;
}

export default function PortfolioHoldings({
  activeTab,
  timeframe,
  onTabChange,
}: Props) {
  const router = useRouter();
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();

  // If no portfolio exists, don't show holdings
  if (!activePortfolio) {
    return null;
  }

  const portfolioSummary = calculatePortfolioSummary(
    activePortfolio,
    includeCashInPortfolio,
  );

  if (activeTab === 'overview') {
    // Show category cards
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

          {/* Available Cash Card */}
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
  } else {
    // Show asset breakdown table for specific asset type
    const assetType = activeTab as AssetType;
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
}

import { useMemo } from 'react';
import {
  calculatePortfolioSummary,
  calculateAssetTypeValue,
  generateMockTimeSeries,
  getPortfolioAssetTypes,
} from '../utils/portfolioSummary';

import type { AssetType, Portfolio } from '../utils/mockHoldingsData';
import type { Timeframe, TabKey } from '../page';

type UsePortfolioChartParams = {
  activePortfolio: Portfolio;
  active: TabKey;
  timeframe: Timeframe;
  mounted: boolean;
  includeCashInPortfolio: boolean;
};

type PortfolioChartData = {
  data: [number, number][];
  start: number;
  end: number;
  title: string;
  availableTabs: TabKey[];
};

const getAssetTypeTitle = (assetType: AssetType): string => {
  const titleMap: Record<AssetType, string> = {
    crypto: 'Crypto Holdings',
    stocks: 'Stocks Holdings',
    indices: 'Indices Holdings',
    funds: 'Funds Holdings',
    commodities: 'Commodities Holdings',
    nfts: 'NFT Holdings',
    cash: 'Available Cash',
  };

  return titleMap[assetType] || `${assetType} Holdings`;
};

const getDefaultChartData = (): PortfolioChartData => ({
  data: [],
  start: 0,
  end: 0,
  title: 'Total Worth',
  availableTabs: ['overview'] as TabKey[],
});

export const usePortfolioChart = ({
  activePortfolio,
  active,
  timeframe,
  mounted,
  includeCashInPortfolio,
}: UsePortfolioChartParams): PortfolioChartData => {
  return useMemo(() => {
    if (!mounted || !activePortfolio) {
      return getDefaultChartData();
    }

    const portfolioSummary = calculatePortfolioSummary(
      activePortfolio,
      includeCashInPortfolio,
    );

    const assetTypes = getPortfolioAssetTypes(activePortfolio);
    const availableTabs: TabKey[] = ['overview', ...assetTypes];

    let currentValue: number;
    let computedTitle: string;

    if (active === 'overview') {
      currentValue = portfolioSummary.totalValue;
      computedTitle = 'Total Worth';
    } else {
      currentValue = calculateAssetTypeValue(
        activePortfolio,
        active as AssetType,
      );
      computedTitle = getAssetTypeTitle(active as AssetType);
    }

    const series = generateMockTimeSeries(currentValue, timeframe);
    const startVal = series.length > 0 ? series[0][1] : 0;
    const endVal = series.length > 0 ? series[series.length - 1][1] : 0;

    return {
      data: series,
      start: startVal,
      end: endVal,
      title: computedTitle,
      availableTabs,
    };
  }, [active, timeframe, mounted, activePortfolio, includeCashInPortfolio]);
};

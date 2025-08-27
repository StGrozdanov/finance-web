import { useMemo } from 'react';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import { calculatePortfolioSummary } from '@/utils/portfolioSummary';
import { mockAssets } from '@/utils/mockHoldingsData';

import type { Asset } from '@/utils/mockHoldingsData';

type PortfolioPerformer = {
  asset: Asset;
  performance: number;
  value: number;
  totalGain: number;
};

type DailyMover = {
  asset: Asset;
  change: number;
  value: number;
  quantity: number;
  dailyGainLoss: number;
};

type PriceHighlight = {
  asset: Asset;
  period: string;
  change: number;
  value: number;
  gain: number;
};

export type PortfolioStats = {
  totalValue: number;
  totalInvestment: number;
  monthlyReturn: number;
  annualizedReturn: number;
  bestPerformer: PortfolioPerformer | null;
  worstPerformer: PortfolioPerformer | null;
  dailyMovers: DailyMover[];
  priceHighlights: PriceHighlight[];
  dailyChange: number;
  dailyChangePercentage: number;
};

const defaultPortfolioStats: PortfolioStats = {
  totalValue: 0,
  totalInvestment: 0,
  monthlyReturn: 0,
  annualizedReturn: 0,
  bestPerformer: null,
  worstPerformer: null,
  dailyMovers: [],
  priceHighlights: [],
  dailyChange: 0,
  dailyChangePercentage: 0,
};

const monthlyReturn = 2.4; // TODO: calculate
const annualizedReturn = 12.8; // TODO: calculate

export function usePortfolioStats(): PortfolioStats {
  const { getActivePortfolio, includeCashInPortfolio } = usePortfolio();
  const activePortfolio = getActivePortfolio();

  const portfolioStats = useMemo(() => {
    if (!activePortfolio) {
      return defaultPortfolioStats;
    }

    const portfolioSummary = calculatePortfolioSummary(
      activePortfolio,
      includeCashInPortfolio,
    );

    const totalInvestment = activePortfolio.transactions
      .filter(t => t.type === 'buy' || t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount * (t.price || 1) + (t.fee || 0), 0);

    const dailyChange = portfolioSummary.assets.reduce((total, asset) => {
      const dailyAssetChange =
        (asset.asset.change24h / 100) * asset.currentValue;
      return total + dailyAssetChange;
    }, 0);

    const dailyChangePercentage =
      portfolioSummary.totalValue > 0 ?
        (dailyChange / portfolioSummary.totalValue) * 100
      : 0;

    const performers = portfolioSummary.assets
      .map(asset => ({
        asset: asset.asset,
        performance: asset.unrealizedGainPercentage,
        value: asset.currentValue,
        totalGain: asset.unrealizedGain,
      }))
      .sort((a, b) => b.performance - a.performance);

    const bestPerformer = performers[0] || null;
    const worstPerformer = performers[performers.length - 1] || null;

    const dailyMovers = portfolioSummary.assets
      .map(asset => ({
        asset: asset.asset,
        change: asset.asset.change24h,
        value: asset.currentValue,
        quantity: asset.quantity,
        dailyGainLoss: (asset.asset.change24h / 100) * asset.currentValue,
      }))
      .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

    const portfolioAssetIds = new Set(
      portfolioSummary.assets.map(a => a.asset.id),
    );

    const priceHighlights = [
      {
        asset: mockAssets.find(
          a => a.symbol === 'ETH' && portfolioAssetIds.has(a.id),
        ),
        period: 'In the last month',
        change: 40.95,
        value: 4424.66,
        gain: 1285.52,
      },
      {
        asset: mockAssets.find(
          a => a.symbol === 'NVDA' && portfolioAssetIds.has(a.id),
        ),
        period: 'In the last 3 month',
        change: 33.84,
        value: 180.45,
        gain: 45.62,
      },
    ].filter((h): h is PriceHighlight => h.asset !== undefined);

    return {
      totalValue: portfolioSummary.totalValue,
      totalInvestment,
      monthlyReturn,
      annualizedReturn,
      bestPerformer,
      worstPerformer,
      dailyMovers,
      priceHighlights,
      dailyChange,
      dailyChangePercentage,
    };
  }, [activePortfolio, includeCashInPortfolio]);

  return portfolioStats;
}

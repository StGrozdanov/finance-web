import {
  Portfolio,
  Asset,
  AssetType,
  mockAssets,
} from '@/app/_data/portfolioData';

export interface PortfolioAsset {
  asset: Asset;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  totalInvested: number;
  unrealizedGain: number;
  unrealizedGainPercentage: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalUnrealizedGain: number;
  totalUnrealizedGainPercentage: number;
  assets: PortfolioAsset[];
  assetsByType: Record<AssetType, PortfolioAsset[]>;
  availableCash: number;
}

export function calculatePortfolioSummary(
  portfolio: Portfolio,
  includeCash: boolean = true,
): PortfolioSummary {
  const assetHoldings = new Map<
    string,
    {
      quantity: number;
      totalInvested: number;
      totalFees: number;
    }
  >();

  // Process all transactions to calculate holdings
  portfolio.transactions.forEach(transaction => {
    const existing = assetHoldings.get(transaction.assetId) || {
      quantity: 0,
      totalInvested: 0,
      totalFees: 0,
    };

    const fee = transaction.fee || 0;

    switch (transaction.type) {
      case 'buy':
        const buyValue = transaction.amount * (transaction.price || 0);
        existing.quantity += transaction.amount;
        existing.totalInvested += buyValue;
        existing.totalFees += fee;
        break;

      case 'sell':
        existing.quantity -= transaction.amount;
        existing.totalInvested -=
          (existing.totalInvested / (existing.quantity + transaction.amount)) *
          transaction.amount;
        existing.totalFees += fee;
        break;

      case 'transfer':
        // For transfers, we add to quantity but don't change invested amount (unless it's incoming from external)
        if (
          transaction.from === 'exchange' ||
          transaction.from === 'other_wallet'
        ) {
          existing.quantity += transaction.amount;
          // For transfers from external sources, we might want to use current market price as cost basis
          const asset = mockAssets.find(a => a.id === transaction.assetId);
          if (asset) {
            existing.totalInvested += transaction.amount * asset.price;
          }
        }
        existing.totalFees += fee;
        break;
    }

    assetHoldings.set(transaction.assetId, existing);
  });

  // Calculate portfolio assets with current values
  const assets: PortfolioAsset[] = [];
  const assetsByType: Record<AssetType, PortfolioAsset[]> = {
    crypto: [],
    stocks: [],
    indices: [],
    funds: [],
    commodities: [],
    nfts: [],
    cash: [],
  };

  let totalValue = 0;
  let totalInvested = 0;
  let availableCash = 0;

  assetHoldings.forEach((holding, assetId) => {
    if (holding.quantity <= 0) return; // Skip assets with zero or negative holdings

    const asset = mockAssets.find(a => a.id === assetId);
    if (!asset) return;

    const currentValue = holding.quantity * asset.price;
    const averagePrice = holding.totalInvested / holding.quantity;
    const unrealizedGain = currentValue - holding.totalInvested;
    const unrealizedGainPercentage =
      holding.totalInvested > 0 ?
        (unrealizedGain / holding.totalInvested) * 100
      : 0;

    const portfolioAsset: PortfolioAsset = {
      asset,
      quantity: holding.quantity,
      averagePrice,
      currentValue,
      totalInvested: holding.totalInvested,
      unrealizedGain,
      unrealizedGainPercentage,
    };

    // Handle cash assets separately
    if (asset.type === 'cash') {
      availableCash += currentValue;
      if (includeCash) {
        assets.push(portfolioAsset);
        assetsByType[asset.type].push(portfolioAsset);
        totalValue += currentValue;
        totalInvested += holding.totalInvested;
      }
    } else {
      assets.push(portfolioAsset);
      assetsByType[asset.type].push(portfolioAsset);
      totalValue += currentValue;
      totalInvested += holding.totalInvested;
    }
  });

  // Add mock cash for demonstration if no cash transactions exist
  if (availableCash === 0) {
    availableCash = 3270.32;
  }

  const totalUnrealizedGain = totalValue - totalInvested;
  const totalUnrealizedGainPercentage =
    totalInvested > 0 ? (totalUnrealizedGain / totalInvested) * 100 : 0;

  return {
    totalValue,
    totalInvested,
    totalUnrealizedGain,
    totalUnrealizedGainPercentage,
    assets,
    assetsByType,
    availableCash,
  };
}

export function getPortfolioAssetTypes(portfolio: Portfolio): AssetType[] {
  const summary = calculatePortfolioSummary(portfolio);
  return Object.keys(summary.assetsByType).filter(
    type => summary.assetsByType[type as AssetType].length > 0,
  ) as AssetType[];
}

export function calculateAssetTypeValue(
  portfolio: Portfolio,
  assetType: AssetType,
): number {
  const summary = calculatePortfolioSummary(portfolio);
  return summary.assetsByType[assetType].reduce(
    (total, asset) => total + asset.currentValue,
    0,
  );
}

// Generate mock time series data based on current portfolio value
export function generateMockTimeSeries(
  currentValue: number,
  timeframe: string,
): [number, number][] {
  const now = Date.now();
  const points: [number, number][] = [];

  let intervals: { count: number; interval: number };

  switch (timeframe) {
    case '1H':
      intervals = { count: 12, interval: 5 * 60 * 1000 }; // 5 minute intervals
      break;
    case '1D':
      intervals = { count: 24, interval: 60 * 60 * 1000 }; // 1 hour intervals
      break;
    case '1W':
      intervals = { count: 7, interval: 24 * 60 * 60 * 1000 }; // 1 day intervals
      break;
    case '1M':
      intervals = { count: 30, interval: 24 * 60 * 60 * 1000 }; // 1 day intervals
      break;
    case 'YTD':
      intervals = { count: 30, interval: 7 * 24 * 60 * 60 * 1000 }; // 1 week intervals
      break;
    case '1Y':
      intervals = { count: 12, interval: 30 * 24 * 60 * 60 * 1000 }; // 1 month intervals
      break;
    case 'ALL':
    default:
      intervals = { count: 12, interval: 30 * 24 * 60 * 60 * 1000 }; // 1 month intervals
      break;
  }

  const startValue = currentValue * 0.85; // Start at 85% of current value
  const volatility = 0.02; // 2% volatility

  for (let i = 0; i < intervals.count; i++) {
    const timestamp = now - (intervals.count - 1 - i) * intervals.interval;
    const progress = i / (intervals.count - 1);

    // Create an upward trend with some volatility
    const trendValue = startValue + (currentValue - startValue) * progress;
    const randomFactor = 1 + (Math.random() - 0.5) * volatility;
    const value = Math.max(0, trendValue * randomFactor);

    points.push([timestamp, Math.round(value * 100) / 100]);
  }

  return points;
}

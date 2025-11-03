export type AssetType =
  | 'crypto'
  | 'stocks'
  | 'indices'
  | 'funds'
  | 'commodities'
  | 'nfts'
  | 'cash';
export type TransactionType =
  | 'buy'
  | 'sell'
  | 'transfer'
  | 'deposit'
  | 'withdrawal';
export type TransferSource =
  | 'exchange'
  | 'my_wallet'
  | 'other_wallet'
  | 'airdrop'
  | 'mining'
  | 'fork'
  | 'dividends_staking'
  | 'other_unknown';

export type Asset = {
  id: string;
  symbol: string;
  name: string;
  type: AssetType;
  price: number;
  change24h: number;
  imageUrl?: string;
};

export type Transaction = {
  id: string;
  assetId: string;
  type: TransactionType;
  amount: number;
  price?: number; // For buy/sell
  fee?: number;
  date: Date;
  notes?: string;
  // Transfer specific fields
  from?: TransferSource;
  to?: TransferSource;
};

export type Portfolio = {
  id: string;
  name: string;
  createdAt: Date;
  transactions: Transaction[];
  isDemo: boolean;
};

export const mockAssets: Asset[] = [
  // Crypto assets
  {
    id: 'btc',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    price: 117634.57,
    change24h: 2.45,
    imageUrl: undefined,
  },
  {
    id: 'eth',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    price: 4234.89,
    change24h: -1.23,
    imageUrl: undefined,
  },
  {
    id: 'xrp',
    symbol: 'XRP',
    name: 'XRP',
    type: 'crypto',
    price: 2.84,
    change24h: 5.67,
    imageUrl: undefined,
  },
  {
    id: 'xlm',
    symbol: 'XLM',
    name: 'Stellar',
    type: 'crypto',
    price: 0.654,
    change24h: 3.21,
    imageUrl: undefined,
  },
  {
    id: 'ltc',
    symbol: 'LTC',
    name: 'Litecoin',
    type: 'crypto',
    price: 134.56,
    change24h: -0.87,
    imageUrl: undefined,
  },
  {
    id: 'usdt',
    symbol: 'USDT',
    name: 'Tether',
    type: 'crypto',
    price: 1.0,
    change24h: 0.01,
    imageUrl: undefined,
  },
  {
    id: 'ada',
    symbol: 'ADA',
    name: 'Cardano',
    type: 'crypto',
    price: 1.23,
    change24h: 4.56,
    imageUrl: undefined,
  },
  {
    id: 'trx',
    symbol: 'TRX',
    name: 'TRON',
    type: 'crypto',
    price: 0.287,
    change24h: 2.34,
    imageUrl: undefined,
  },
  {
    id: 'sol',
    symbol: 'SOL',
    name: 'Solana',
    type: 'crypto',
    price: 245.67,
    change24h: 6.78,
    imageUrl: undefined,
  },
  // Stock assets
  {
    id: 'aapl',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stocks',
    price: 234.56,
    change24h: 1.45,
    imageUrl: undefined,
  },
  {
    id: 'tsla',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    type: 'stocks',
    price: 338.89,
    change24h: 3.21,
    imageUrl: undefined,
  },
  {
    id: 'nvda',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stocks',
    price: 145.67,
    change24h: 2.34,
    imageUrl: undefined,
  },
  {
    id: 'msft',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    type: 'stocks',
    price: 456.78,
    change24h: 0.87,
    imageUrl: undefined,
  },
  {
    id: 'amzn',
    symbol: 'AMZN',
    name: 'Amazon.com, Inc.',
    type: 'stocks',
    price: 198.45,
    change24h: -0.56,
    imageUrl: undefined,
  },
  {
    id: 'googl',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    type: 'stocks',
    price: 187.92,
    change24h: 1.23,
    imageUrl: undefined,
  },
  {
    id: 'meta',
    symbol: 'META',
    name: 'Meta Platforms, Inc.',
    type: 'stocks',
    price: 587.34,
    change24h: 2.15,
    imageUrl: undefined,
  },
  {
    id: 'nflx',
    symbol: 'NFLX',
    name: 'Netflix, Inc.',
    type: 'stocks',
    price: 765.23,
    change24h: -1.34,
    imageUrl: undefined,
  },
  {
    id: 'uber',
    symbol: 'UBER',
    name: 'Uber Technologies, Inc.',
    type: 'stocks',
    price: 87.65,
    change24h: 4.56,
    imageUrl: undefined,
  },
  // Indices
  {
    id: 'sp500',
    symbol: 'SPY',
    name: 'S&P 500 ETF',
    type: 'indices',
    price: 5234.67,
    change24h: 0.89,
    imageUrl: undefined,
  },
  {
    id: 'nasdaq',
    symbol: 'QQQ',
    name: 'NASDAQ-100 ETF',
    type: 'indices',
    price: 456.78,
    change24h: 1.45,
    imageUrl: undefined,
  },
  {
    id: 'dow',
    symbol: 'DIA',
    name: 'Dow Jones Industrial Average ETF',
    type: 'indices',
    price: 423.89,
    change24h: 0.67,
    imageUrl: undefined,
  },
  // Funds
  {
    id: 'vti',
    symbol: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    type: 'funds',
    price: 289.45,
    change24h: 1.12,
    imageUrl: undefined,
  },
  {
    id: 'voo',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    type: 'funds',
    price: 523.67,
    change24h: 0.98,
    imageUrl: undefined,
  },
  {
    id: 'arkk',
    symbol: 'ARKK',
    name: 'ARK Innovation ETF',
    type: 'funds',
    price: 67.89,
    change24h: 2.34,
    imageUrl: undefined,
  },
  // Commodities
  {
    id: 'gold',
    symbol: 'GOLD',
    name: 'Gold',
    type: 'commodities',
    price: 2756.78,
    change24h: 0.45,
    imageUrl: undefined,
  },
  {
    id: 'oil',
    symbol: 'OIL',
    name: 'Crude Oil',
    type: 'commodities',
    price: 89.23,
    change24h: -1.23,
    imageUrl: undefined,
  },
  {
    id: 'silver',
    symbol: 'SILVER',
    name: 'Silver',
    type: 'commodities',
    price: 32.45,
    change24h: 1.87,
    imageUrl: undefined,
  },
  // NFTs (simplified representation)
  {
    id: 'bayc',
    symbol: 'BAYC',
    name: 'Bored Ape Yacht Club',
    type: 'nfts',
    price: 12.34,
    change24h: -5.67,
    imageUrl: undefined,
  },
  {
    id: 'cryptopunks',
    symbol: 'PUNKS',
    name: 'CryptoPunks',
    type: 'nfts',
    price: 34.56,
    change24h: 2.34,
    imageUrl: undefined,
  },
  {
    id: 'azuki',
    symbol: 'AZUKI',
    name: 'Azuki',
    type: 'nfts',
    price: 8.9,
    change24h: 4.56,
    imageUrl: undefined,
  },
  // Cash/Fiat
  {
    id: 'usd',
    symbol: 'USD',
    name: 'US Dollar',
    type: 'cash',
    price: 1.0,
    change24h: 0.0,
    imageUrl: undefined,
  },
  {
    id: 'eur',
    symbol: 'EUR',
    name: 'Euro',
    type: 'cash',
    price: 1.08,
    change24h: 0.12,
    imageUrl: undefined,
  },
];

export const getAssetsByType = (type: AssetType): Asset[] => {
  return mockAssets.filter(asset => asset.type === type);
};

export const getPopularAssetsByType = (
  type: AssetType,
  limit: number = 9,
): Asset[] => {
  return getAssetsByType(type).slice(0, limit);
};

export const searchAssets = (query: string, type?: AssetType): Asset[] => {
  const filteredAssets = type ? getAssetsByType(type) : mockAssets;

  if (!query.trim()) {
    return filteredAssets;
  }

  const searchTerm = query.toLowerCase();
  return filteredAssets.filter(
    asset =>
      asset.symbol.toLowerCase().includes(searchTerm) ||
      asset.name.toLowerCase().includes(searchTerm),
  );
};

// Demo portfolio data (current hardcoded data from the app)
export const demoPortfolio: Portfolio = {
  id: 'demo',
  name: 'Demo Portfolio',
  createdAt: new Date('2024-01-01'),
  isDemo: true,
  transactions: [
    {
      id: 'demo-0',
      assetId: 'usd',
      type: 'deposit',
      amount: 100000,
      price: 1,
      fee: 0,
      date: new Date('2024-01-01'),
      notes: 'USD cash deposit',
    },
    {
      id: 'demo-01',
      assetId: 'usd',
      type: 'withdrawal',
      amount: 20000,
      price: 1,
      fee: 0,
      date: new Date('2024-06-01'),
      notes: 'USD cash transfer',
    },
    {
      id: 'demo-02',
      assetId: 'eur',
      type: 'deposit',
      amount: 1000,
      price: 1,
      fee: 0,
      date: new Date('2024-01-05'),
      notes: 'USD cash deposit',
    },
    // Crypto transactions
    {
      id: 'demo-1',
      assetId: 'btc',
      type: 'buy',
      amount: 0.25,
      price: 45000,
      fee: 25,
      date: new Date('2024-01-15'),
      notes: 'Initial Bitcoin purchase',
    },
    {
      id: 'demo-2',
      assetId: 'eth',
      type: 'buy',
      amount: 8,
      price: 2800,
      fee: 15,
      date: new Date('2024-02-01'),
      notes: 'Ethereum investment',
    },
    {
      id: 'demo-3',
      assetId: 'sol',
      type: 'buy',
      amount: 25,
      price: 180,
      fee: 8,
      date: new Date('2024-02-15'),
      notes: 'Solana purchase',
    },
    // Stock transactions
    {
      id: 'demo-4',
      assetId: 'nvda',
      type: 'buy',
      amount: 27.74,
      price: 179.41,
      fee: 1.99,
      date: new Date('2024-03-01'),
      notes: 'NVIDIA stock purchase',
    },
    {
      id: 'demo-5',
      assetId: 'meta',
      type: 'buy',
      amount: 5.78,
      price: 774.7,
      fee: 1.99,
      date: new Date('2024-03-15'),
      notes: 'Meta investment',
    },
    {
      id: 'demo-6',
      assetId: 'tsla',
      type: 'buy',
      amount: 12.69,
      price: 309.35,
      fee: 1.99,
      date: new Date('2024-04-01'),
      notes: 'Tesla investment',
    },
    // Fund transactions
    {
      id: 'demo-7',
      assetId: 'vti',
      type: 'buy',
      amount: 15,
      price: 280.5,
      fee: 0,
      date: new Date('2024-04-15'),
      notes: 'VTI ETF purchase',
    },
    // Commodities
    {
      id: 'demo-8',
      assetId: 'gold',
      type: 'buy',
      amount: 2,
      price: 2650.0,
      fee: 25,
      date: new Date('2024-05-01'),
      notes: 'Gold investment',
    },
  ],
};

export const assetTypeInfo = {
  crypto: {
    icon: '₿',
    title: 'Crypto',
    description: 'Cryptocurrencies and digital assets',
  },
  stocks: {
    icon: '📊',
    title: 'Stocks',
    description: 'Individual company stocks',
  },
  indices: {
    icon: '📈',
    title: 'Indices',
    description: 'Market indices and index funds',
  },
  funds: {
    icon: '💼',
    title: 'Funds',
    description: 'ETFs and mutual funds',
  },
  commodities: {
    icon: '🥇',
    title: 'Commodities',
    description: 'Gold, oil, and other commodities',
  },
  nfts: {
    icon: '🖼️',
    title: 'NFT',
    description: 'Non-fungible tokens',
  },
  cash: {
    icon: '💵',
    title: 'Available Cash',
    description: 'Cash and fiat currency',
  },
} as const;

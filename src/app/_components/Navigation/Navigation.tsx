'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '../SearchBar/SearchBar';
import { useState } from 'react';

export type AssetCategory = 'stock' | 'crypto';

export type SearchAsset = {
  id: string;
  shortName: string;
  longName: string;
  category: AssetCategory;
  imageUrl?: string;
};

const getSearchHistory = (): SearchAsset[] => {
  return [
    {
      id: 'aapl',
      shortName: 'AAPL',
      longName: 'Apple Inc.',
      category: 'stock',
      imageUrl: undefined,
    },
    {
      id: 'tsla',
      shortName: 'TSLA',
      longName: 'Tesla, Inc.',
      category: 'stock',
      imageUrl: undefined,
    },
    {
      id: 'nvda',
      shortName: 'NVDA',
      longName: 'NVIDIA Corporation',
      category: 'stock',
      imageUrl: undefined,
    },
    {
      id: 'msft',
      shortName: 'MSFT',
      longName: 'Microsoft Corporation',
      category: 'stock',
      imageUrl: undefined,
    },
    {
      id: 'amzn',
      shortName: 'AMZN',
      longName: 'Amazon.com, Inc.',
      category: 'stock',
      imageUrl: undefined,
    },
    {
      id: 'btc',
      shortName: 'BTC',
      longName: 'Bitcoin',
      category: 'crypto',
      imageUrl: undefined,
    },
    {
      id: 'eth',
      shortName: 'ETH',
      longName: 'Ethereum',
      category: 'crypto',
      imageUrl: undefined,
    },
  ];
};

export default function Navigation() {
  const [searchHistory, setSearchHistory] =
    useState<SearchAsset[]>(getSearchHistory());

  return (
    <nav className='sticky top-0 z-2 h-16 flex items-center px-3 py-2 border-b border-gray-200 bg-[var(--background)]'>
      <Link href='/'>
        <Image
          src='/digital-finance.png'
          alt='Digital Finance'
          width={40}
          height={40}
        />
      </Link>

      <div className='flex-1 justify-center'>
        <SearchBar
          history={searchHistory}
          onSearch={q => {
            console.log(`search submitted (query): ${q}`);
          }}
          onClearHistory={() => {
            setSearchHistory([]);
          }}
        />
      </div>
    </nav>
  );
}

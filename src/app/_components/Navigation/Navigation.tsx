'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import SearchBar from '../SearchBar/SearchBar';
import NotificationBell from '../Notification/Notification';
import { useState, useMemo } from 'react';
import { mockAssets } from '@/app/_data/portfolioData';

export type NotificationItem = {
  id: string;
  title: string;
  description?: string;
  timeAgo: string;
  read: boolean;
};

const getNotifications = (): NotificationItem[] => {
  return [
    {
      id: '1',
      title:
        "Don't forget: Apple's Dividend Ex-Date is on 11/08/2025, paying out USD 0.26",
      description: undefined,
      timeAgo: 'about 17 hours ago',
      read: false,
    },
    {
      id: '2',
      title:
        "Your account has been credited with $5.42 in interest payment for last month's balance",
      description: undefined,
      timeAgo: '8 days ago',
      read: false,
    },
    {
      id: '3',
      title: '$TSLA just hit 338.0000',
      description: undefined,
      timeAgo: 'about a month ago',
      read: true,
    },
  ];
};

export type AssetCategory =
  | 'stocks'
  | 'crypto'
  | 'indices'
  | 'funds'
  | 'commodities'
  | 'nfts'
  | 'cash';

export type SearchAsset = {
  id: string;
  shortName: string;
  longName: string;
  category: AssetCategory;
  imageUrl?: string;
};

const getSearchHistory = (): SearchAsset[] => {
  // Convert recent/popular assets from mockAssets to SearchAsset format
  const popularAssets = [
    'aapl',
    'tsla',
    'nvda',
    'msft',
    'amzn',
    'googl',
    'meta',
    'btc',
    'eth',
    'sol',
    'sp500',
    'nasdaq',
    'vti',
    'gold',
  ];

  return popularAssets
    .map(assetId => {
      const asset = mockAssets.find(a => a.id === assetId);
      if (!asset) return null;

      return {
        id: asset.id,
        shortName: asset.symbol,
        longName: asset.name,
        category: asset.type as AssetCategory,
        imageUrl: asset.imageUrl,
      };
    })
    .filter(Boolean) as SearchAsset[];
};

export default function Navigation() {
  const router = useRouter();
  const notifications = getNotifications();
  const [searchHistory, setSearchHistory] =
    useState<SearchAsset[]>(getSearchHistory());

  // Create searchable assets from all mockAssets
  const allSearchableAssets = useMemo(() => {
    return mockAssets.map(asset => ({
      id: asset.id,
      shortName: asset.symbol,
      longName: asset.name,
      category: asset.type as AssetCategory,
      imageUrl: asset.imageUrl,
    }));
  }, []);

  const handleSearch = (assetOrQuery: string | SearchAsset) => {
    if (typeof assetOrQuery === 'string') {
      // Text search - find matching asset
      const query = assetOrQuery.toLowerCase().trim();
      const matchingAsset = allSearchableAssets.find(
        asset =>
          asset.shortName.toLowerCase() === query ||
          asset.longName.toLowerCase().includes(query),
      );

      if (matchingAsset) {
        // Navigate to asset detail page
        router.push(`/asset/${matchingAsset.id}`);

        // Add to search history if not already there
        setSearchHistory(prev => {
          const exists = prev.some(item => item.id === matchingAsset.id);
          if (!exists) {
            return [matchingAsset, ...prev.slice(0, 13)]; // Keep max 14 items
          }
          return prev;
        });
      }
    } else {
      // Direct asset selection
      router.push(`/asset/${assetOrQuery.id}`);

      // Add to search history if not already there
      setSearchHistory(prev => {
        const exists = prev.some(item => item.id === assetOrQuery.id);
        if (!exists) {
          return [assetOrQuery, ...prev.slice(0, 13)]; // Keep max 14 items
        }
        return prev;
      });
    }
  };

  return (
    <nav className='sticky top-0 z-2 h-16 flex items-center justify-between gap-4 px-3 py-2 border-b border-gray-200 bg-[var(--background)]'>
      <Link href='/'>
        <Image
          src='/digital-finance.png'
          alt='Digital Finance'
          width={40}
          height={40}
        />
      </Link>

      <SearchBar
        history={searchHistory}
        onSearch={handleSearch}
        onClearHistory={() => {
          setSearchHistory([]);
        }}
      />

      <NotificationBell
        items={notifications}
        onMarkAllAsRead={() => {
          console.log('all marked as read');
        }}
        onMarkAsRead={id => {
          console.log(`notification with id: ${id} marked as read`);
        }}
      />
    </nav>
  );
}

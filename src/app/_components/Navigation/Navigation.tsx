'use client';

import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '../SearchBar/SearchBar';
import NotificationBell from '../Notification/Notification';
import { useState } from 'react';

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
  const notifications = getNotifications();
  const [searchHistory, setSearchHistory] =
    useState<SearchAsset[]>(getSearchHistory());

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
        onSearch={q => {
          console.log(`search submitted (query): ${q}`);
        }}
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

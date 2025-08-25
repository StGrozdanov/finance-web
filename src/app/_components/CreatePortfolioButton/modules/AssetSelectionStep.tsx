'use client';

import { useState } from 'react';
import {
  AssetType,
  Asset,
  getPopularAssetsByType,
  searchAssets,
} from '@/app/_data/portfolioData';
import Image from 'next/image';

interface Props {
  assetType: AssetType;
  onSelect: (asset: Asset) => void;
}

export default function AssetSelectionStep({ assetType, onSelect }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  const popularAssets = getPopularAssetsByType(assetType, 9);
  const searchResults =
    searchQuery.trim() ? searchAssets(searchQuery, assetType) : [];

  const displayedAssets = searchQuery.trim() ? searchResults : popularAssets;

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(price);
    } else if (price >= 1) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
      }).format(price);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 4,
        maximumFractionDigits: 6,
      }).format(price);
    }
  };

  return (
    <div>
      <h2 className='text-xl font-bold text-gray-900 mb-6'>
        Add a manual transaction by searching for a{' '}
        {assetType === 'crypto' ? 'Crypto' : assetType}
      </h2>

      {assetType === 'crypto' && (
        <p className='text-gray-600 mb-6'>
          Just search for the crypto and get started. Fast and easy but some
          manual work needed.
        </p>
      )}

      {/* Search bar */}
      <div className='mb-6'>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
            <svg
              className='h-5 w-5 text-gray-400'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
              />
            </svg>
          </div>
          <input
            type='text'
            placeholder={`Search ${assetType === 'crypto' ? 'Crypto' : assetType}`}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 bg-gray-50'
          />
        </div>
      </div>

      {/* Results section */}
      {!searchQuery.trim() && (
        <div className='mb-4'>
          <h3 className='text-sm font-semibold text-gray-600 mb-3'>TRENDING</h3>
        </div>
      )}

      {/* Asset list */}
      <div className='space-y-0 border border-gray-200 rounded-md overflow-hidden'>
        {displayedAssets.length === 0 ?
          <div className='p-6 text-center text-gray-500'>
            {searchQuery.trim() ? 'No assets found' : 'No assets available'}
          </div>
        : displayedAssets.map((asset, index) => (
            <button
              key={asset.id}
              onClick={() => onSelect(asset)}
              className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                index !== displayedAssets.length - 1 ?
                  'border-b border-gray-100'
                : ''
              }`}
            >
              <div className='flex items-center gap-3'>
                {asset.imageUrl ?
                  <Image
                    src={asset.imageUrl}
                    alt={asset.name}
                    className='w-8 h-8 rounded-full'
                  />
                : <div className='w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center'>
                    <span className='text-sm font-semibold text-emerald-600'>
                      {asset.symbol.slice(0, 2)}
                    </span>
                  </div>
                }
                <div className='text-left'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-gray-900'>
                      {asset.symbol}
                    </span>
                    <span className='text-gray-500'>|</span>
                    <span className='text-gray-700'>{asset.name}</span>
                  </div>
                </div>
              </div>
              <div className='text-right'>
                <div className='font-semibold text-gray-900'>
                  {formatPrice(asset.price)}
                </div>
                <div
                  className={`text-sm ${asset.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}
                >
                  {asset.change24h >= 0 ? '+' : ''}
                  {asset.change24h.toFixed(2)}%
                </div>
              </div>
            </button>
          ))
        }
      </div>
    </div>
  );
}

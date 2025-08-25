import SearchListItem from './SearchListItem';
import { SearchAsset } from '../../Navigation/Navigation';
import { mockAssets } from '@/app/_data/portfolioData';
import { useMemo } from 'react';

type Props = {
  history: SearchAsset[];
  onSearch: (assetOrQuery: string | SearchAsset) => void;
  onClearHistory?: () => void;
  setQuery: (query: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleSubmit: () => void;
  query?: string;
};

export default function SearchDropdown({
  history,
  onSearch,
  onClearHistory,
  setQuery,
  setIsOpen,
  handleSubmit,
  query = '',
}: Props) {
  // Create live search results from all assets
  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerm = query.toLowerCase().trim();
    return mockAssets
      .filter(
        asset =>
          asset.symbol.toLowerCase().includes(searchTerm) ||
          asset.name.toLowerCase().includes(searchTerm),
      )
      .slice(0, 8) // Limit to 8 results
      .map(asset => ({
        id: asset.id,
        shortName: asset.symbol,
        longName: asset.name,
        category: asset.type,
        imageUrl: asset.imageUrl,
      }));
  }, [query]);

  const hasQuery = query.trim().length > 0;
  const showResults = hasQuery && searchResults.length > 0;
  const showHistory = !hasQuery && history.length > 0;

  return (
    <div className='absolute left-0 right-0 top-full rounded-b-lg bg-white shadow-lg ring-1 ring-gray-200 border border-t-0 border-gray-300'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3'>
        <span className='text-sm font-semibold text-gray-600'>
          {showResults ? 'Search Results' : 'Recent Searches'}
        </span>
        {showHistory && (
          <button
            className='text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer'
            onClick={() => onClearHistory?.()}
          >
            Clear
          </button>
        )}
      </div>

      {/* Results */}
      <div className='max-h-72 overflow-auto'>
        {showResults ?
          <ul className='divide-y divide-gray-100'>
            {searchResults.map(asset => (
              <SearchListItem
                key={asset.id}
                asset={asset}
                setQuery={setQuery}
                onSearchAsset={a => onSearch(a)}
                setIsOpen={setIsOpen}
              />
            ))}
          </ul>
        : showHistory ?
          <ul className='divide-y divide-gray-100'>
            {history.map(asset => (
              <SearchListItem
                key={asset.id}
                asset={asset}
                setQuery={setQuery}
                onSearchAsset={a => onSearch(a)}
                setIsOpen={setIsOpen}
              />
            ))}
          </ul>
        : hasQuery ?
          <div className='px-4 py-6 text-sm text-gray-500'>
            No assets found for &quot;{query}&quot;
          </div>
        : <div className='px-4 py-6 text-sm text-gray-500'>
            No recent searches
          </div>
        }
      </div>

      {/* Search Button */}
      {hasQuery && (
        <div className='px-4 py-3'>
          <button
            className='w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer'
            onClick={handleSubmit}
          >
            Search for &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}

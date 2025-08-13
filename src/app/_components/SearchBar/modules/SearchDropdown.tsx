import SearchListItem from './SearchListItem';
import { SearchAsset } from '../../Navigation/Navigation';

type Props = {
  history: SearchAsset[];
  onSearch: (assetOrQuery: string | SearchAsset) => void;
  onClearHistory?: () => void;
  setQuery: (query: string) => void;
  setIsOpen: (isOpen: boolean) => void;
  handleSubmit: () => void;
};

export default function SearchDropdown({
  history,
  onSearch,
  onClearHistory,
  setQuery,
  setIsOpen,
  handleSubmit,
}: Props) {
  return (
    <div className='absolute left-0 right-0 top-full rounded-b-lg bg-white shadow-lg ring-1 ring-gray-200 border border-t-0 border-gray-300'>
      <div className='flex items-center justify-between px-4 py-3'>
        <span className='text-sm font-semibold text-gray-600'>
          Recent Searches
        </span>
        {history.length > 0 && (
          <button
            className='text-sm font-medium text-emerald-600 hover:text-emerald-700 cursor-pointer'
            onClick={() => onClearHistory?.()}
          >
            Clear
          </button>
        )}
      </div>

      <div className='max-h-72 overflow-auto'>
        {history.length === 0 ?
          <div className='px-4 py-6 text-sm text-gray-500'>
            No recent searches
          </div>
        : <ul className='divide-y divide-gray-100'>
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
        }
      </div>

      <div className='px-4 py-3'>
        <button
          className='w-full rounded-md bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 cursor-pointer'
          onClick={handleSubmit}
        >
          Search
        </button>
      </div>
    </div>
  );
}

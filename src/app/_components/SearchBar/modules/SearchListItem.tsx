import Image from 'next/image';
import { SearchAsset } from '../../Navigation/Navigation';

type Props = {
  asset: SearchAsset;
  setQuery: (query: string) => void;
  onSearchAsset: (asset: SearchAsset) => void;
  setIsOpen: (isOpen: boolean) => void;
};

export default function SearchListItem({
  asset,
  setQuery,
  onSearchAsset,
  setIsOpen,
}: Props) {
  return (
    <li>
      <button
        className='flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50 cursor-pointer'
        onClick={() => {
          setQuery(asset.shortName);
          onSearchAsset(asset);
          setIsOpen(false);
        }}
      >
        <article className='flex items-center gap-3'>
          {asset.imageUrl ?
            <Image
              src={asset.imageUrl}
              alt={asset.longName}
              width={28}
              height={28}
              className='rounded'
            />
          : <div className='h-7 w-7 rounded bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold'>
              {asset.shortName.slice(0, 2).toUpperCase()}
            </div>
          }

          <section className='flex flex-col'>
            <div className='flex items-center gap-2'>
              <span className='text-[15px] font-semibold'>
                {asset.shortName}
              </span>
              <span className='text-gray-300'>|</span>
              <span className='text-[15px] text-gray-800'>
                {asset.longName}
              </span>
            </div>
            <span className='text-xs text-gray-500 capitalize'>
              {asset.category}
            </span>
          </section>
        </article>
      </button>
    </li>
  );
}

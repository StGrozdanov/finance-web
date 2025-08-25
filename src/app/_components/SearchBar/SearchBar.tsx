'use client';

import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faXmark } from '@fortawesome/free-solid-svg-icons';
import SearchDropdown from './modules/SearchDropdown';
import { SearchAsset } from '../Navigation/Navigation';

type Props = {
  history: SearchAsset[];
  onSearch: (assetOrQuery: string | SearchAsset) => void;
  onClearHistory?: () => void;
};

export default function SearchBar({
  history,
  onSearch,
  onClearHistory,
}: Props) {
  const [query, setQuery] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const target = event.target as Node;

      if (!containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const filteredHistory =
    !query ? history : (
      history.filter(asset => {
        const q = query.trim().toLowerCase();
        return (
          asset.shortName.toLowerCase().includes(q) ||
          asset.longName.toLowerCase().includes(q) ||
          asset.category.toLowerCase().includes(q)
        );
      })
    );

  const handleSubmit = () => {
    const value = query.trim();
    if (!value) return;

    onSearch(value);
    setIsOpen(false);
  };

  return (
    <article className='hidden md:flex justify-center'>
      <section ref={containerRef} className='relative'>
        <div
          className={`relative flex items-center h-11 border transition-all duration-500 ease-out shadow-sm ${
            isOpen ?
              'bg-white border-gray-300 focus:outline-none rounded-t-lg border-b-0 w-[38rem]'
            : 'bg-[#F2F3F7] border-transparent rounded-lg w-[30rem]'
          }`}
          onClick={() => {
            setIsOpen(true);
            requestAnimationFrame(() => inputRef.current?.focus());
          }}
        >
          <FontAwesomeIcon
            className='pl-3 pr-2 text-gray-500'
            icon={faMagnifyingGlass}
            width={16}
            height={16}
          />

          <input
            ref={inputRef}
            type='text'
            placeholder='Search'
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSubmit();
              }
              if (e.key === 'Escape') {
                setIsOpen(false);
              }
            }}
            className='flex-1 bg-transparent outline-none placeholder:text-gray-400 pr-2'
          />

          {query.length > 0 && (
            <button
              className='px-3 py-2 text-gray-500 hover:text-gray-700 cursor-pointer'
              onClick={e => {
                e.stopPropagation();
                setQuery('');
                inputRef.current?.focus();
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>

        {isOpen && (
          <SearchDropdown
            history={filteredHistory}
            onSearch={onSearch}
            onClearHistory={onClearHistory}
            setQuery={setQuery}
            setIsOpen={setIsOpen}
            handleSubmit={handleSubmit}
            query={query}
          />
        )}
      </section>
    </article>
  );
}

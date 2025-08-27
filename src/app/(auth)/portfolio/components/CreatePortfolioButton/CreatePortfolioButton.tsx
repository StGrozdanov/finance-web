'use client';

import { useState } from 'react';
import CreatePortfolioModal from '../CreatePortfolioModal/CreatePortfolioModal';
import { usePortfolio } from '@/hooks/usePortfolioContext';

export default function CreatePortfolioButton() {
  const { portfolios, activePortfolioId } = usePortfolio();
  const [isOpen, setIsOpen] = useState(false);

  if (portfolios.length === 0) {
    return null;
  }

  const mode = activePortfolioId ? 'add_transaction' : 'create';

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className='fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-600 transition-colors duration-200 hover:shadow-xl'
        aria-label={
          mode === 'add_transaction' ? 'Add transaction' : 'Create portfolio'
        }
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 5V19M5 12H19'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      <CreatePortfolioModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        mode={mode}
      />
    </>
  );
}

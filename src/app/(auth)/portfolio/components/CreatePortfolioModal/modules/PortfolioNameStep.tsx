'use client';

import { useState } from 'react';

type PortfolioNameStepProps = {
  onSubmit: (name: string) => void;
  initialValue: string;
};

export default function PortfolioNameStep({
  onSubmit,
  initialValue,
}: PortfolioNameStepProps) {
  const [name, setName] = useState(initialValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const portfolioName = name.trim();

    if (portfolioName) {
      onSubmit(portfolioName);
    }
  };

  return (
    <section>
      <h2 className='text-2xl font-bold text-gray-900 mb-2'>
        Create a portfolio
      </h2>
      <p className='text-gray-600 mb-6'>
        Give your portfolio a name to get started.
      </p>

      <form onSubmit={handleSubmit}>
        <div className='mb-6'>
          <label
            htmlFor='portfolio-name'
            className='block text-sm font-medium text-gray-700 mb-2'
          >
            Portfolio Name
          </label>
          <input
            type='text'
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder='Enter portfolio name'
            className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500'
            autoFocus
            required
          />
        </div>

        <div className='flex justify-end'>
          <button
            type='submit'
            disabled={!name.trim()}
            className='px-6 py-2 bg-emerald-500 text-white font-medium rounded-md hover:bg-emerald-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
          >
            Continue
          </button>
        </div>
      </form>
    </section>
  );
}

'use client';

import { PortfolioMethod } from '../CreatePortfolioModal';

type MethodSelectionStepProps = {
  onSelect: (method: PortfolioMethod) => void;
  hideDemo?: boolean;
};

const methods = [
  {
    id: 'manual' as PortfolioMethod,
    title: 'Add Manual Transaction',
    description: 'Simple form to add your transaction.',
    icon: '👆',
    enabled: true,
  },
  {
    id: 'exchange' as PortfolioMethod,
    title: 'Connect Exchange Account',
    description:
      'We support over 20+ crypto exchanges including Binance, Coinbase, Kraken, etc.',
    icon: '🔄',
    enabled: false,
  },
  {
    id: 'blockchain' as PortfolioMethod,
    title: 'Connect Wallet',
    description:
      'We support over 15 wallets including MetaMask, WalletConnect etc.',
    icon: '🔗',
    enabled: false,
  },
  {
    id: 'demo' as PortfolioMethod,
    title: 'Demo Data',
    description:
      "Explore the platform's functionality with our demo portfolios.",
    icon: '📊',
    enabled: true,
  },
];

export default function MethodSelectionStep({
  onSelect,
  hideDemo = false,
}: MethodSelectionStepProps) {
  const filteredMethods =
    hideDemo ? methods.filter(m => m.id !== 'demo') : methods;

  return (
    <section>
      <h2 className='text-xl font-bold text-gray-900 mb-2'>
        Please specify how you&apos;d like to add one or more transactions.
      </h2>

      <article className='space-y-3 mt-6'>
        {filteredMethods.map(method => (
          <button
            key={method.id}
            onClick={() => method.enabled && onSelect(method.id)}
            disabled={!method.enabled}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
              method.enabled ?
                'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50 cursor-pointer'
              : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
            title={
              !method.enabled ?
                'This feature is currently under development'
              : undefined
            }
          >
            <div className='flex items-start gap-4'>
              <div className='flex-shrink-0'>
                <div className='w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-xl'>
                  {method.icon}
                </div>
              </div>
              <div className='flex-1'>
                <h3 className='font-semibold text-gray-900 mb-1'>
                  {method.title}
                </h3>
                <p className='text-sm text-gray-600'>{method.description}</p>
                {!method.enabled && (
                  <p className='text-xs text-orange-600 mt-1 font-medium'>
                    Currently under development
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </article>
    </section>
  );
}

'use client';

import { useState } from 'react';
import PortfolioNameStep from './PortfolioNameStep';
import MethodSelectionStep from './MethodSelectionStep';
import AssetTypeSelectionStep from './AssetTypeSelectionStep';
import AssetSelectionStep from './AssetSelectionStep';
import TransactionFormStep from './TransactionFormStep';
import {
  AssetType,
  Asset,
  TransactionType,
  demoPortfolio,
  Transaction,
} from '@/app/_data/portfolioData';
import { usePortfolio } from '@/app/_contexts/PortfolioContext';

export type ModalStep =
  | 'name'
  | 'method'
  | 'asset-type'
  | 'asset-selection'
  | 'transaction-form';

export type PortfolioMethod = 'manual' | 'exchange' | 'blockchain' | 'demo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'add_transaction';
}

export default function CreatePortfolioModal({
  isOpen,
  onClose,
  mode = 'create',
}: Props) {
  const { createPortfolio, addTransaction, activePortfolioId } = usePortfolio();
  const [step, setStep] = useState<ModalStep>(
    mode === 'add_transaction' ? 'method' : 'name',
  );
  const [portfolioName, setPortfolioName] = useState('');
  const [selectedAssetType, setSelectedAssetType] = useState<AssetType | null>(
    null,
  );
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [transactionType, setTransactionType] =
    useState<TransactionType>('buy');

  const handleClose = () => {
    // Reset all state
    setStep(mode === 'add_transaction' ? 'method' : 'name');
    setPortfolioName('');
    setSelectedAssetType(null);
    setSelectedAsset(null);
    setTransactionType('buy');
    onClose();
  };

  const handleBack = () => {
    switch (step) {
      case 'method':
        if (mode === 'create') {
          setStep('name');
        }
        break;
      case 'asset-type':
        setStep('method');
        break;
      case 'asset-selection':
        setStep('asset-type');
        break;
      case 'transaction-form':
        setStep('asset-selection');
        break;
      default:
        break;
    }
  };

  const handleNameSubmit = (name: string) => {
    setPortfolioName(name);
    setStep('method');
  };

  const handleMethodSelect = (method: PortfolioMethod) => {
    if (method === 'demo') {
      // Create demo portfolio with pre-defined transactions
      createPortfolio({
        name: portfolioName,
        transactions: demoPortfolio.transactions,
        isDemo: true,
      });
      handleClose();
    } else if (method === 'manual') {
      setStep('asset-type');
    } else {
      // For exchange and blockchain, show disabled message for now
      console.log('Feature not implemented yet:', method);
    }
  };

  const handleAssetTypeSelect = (assetType: AssetType) => {
    setSelectedAssetType(assetType);
    setStep('asset-selection');
  };

  const handleAssetSelect = (asset: Asset) => {
    setSelectedAsset(asset);
    setStep('transaction-form');
  };

  const handleTransactionSubmit = (transactionData: Transaction) => {
    if (mode === 'add_transaction' && activePortfolioId) {
      // Add transaction to existing portfolio
      addTransaction(activePortfolioId, transactionData);
    } else {
      // Create a new portfolio with the single transaction
      createPortfolio({
        name: portfolioName,
        transactions: [transactionData],
        isDemo: false,
      });
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 overflow-y-auto'>
      <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
        <div
          className='fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity'
          onClick={handleClose}
        />

        <div className='relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6'>
          {/* Close button */}
          <button
            onClick={handleClose}
            className='absolute right-4 top-4 text-gray-400 hover:text-gray-600'
          >
            <svg
              className='h-6 w-6'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>

          {/* Back button (except on first step) */}
          {step !== 'name' &&
            !(mode === 'add_transaction' && step === 'method') && (
              <button
                onClick={handleBack}
                className='absolute left-4 top-4 text-gray-400 hover:text-gray-600'
              >
                <svg
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth='1.5'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M15.75 19.5L8.25 12l7.5-7.5'
                  />
                </svg>
              </button>
            )}

          {/* Content */}
          <div className='mt-8'>
            {step === 'name' && mode === 'create' && (
              <PortfolioNameStep
                onSubmit={handleNameSubmit}
                initialValue={portfolioName}
              />
            )}

            {step === 'method' && (
              <MethodSelectionStep
                onSelect={handleMethodSelect}
                hideDemo={mode === 'add_transaction'}
              />
            )}

            {step === 'asset-type' && (
              <AssetTypeSelectionStep onSelect={handleAssetTypeSelect} />
            )}

            {step === 'asset-selection' && selectedAssetType && (
              <AssetSelectionStep
                assetType={selectedAssetType}
                onSelect={handleAssetSelect}
              />
            )}

            {step === 'transaction-form' && selectedAsset && (
              <TransactionFormStep
                asset={selectedAsset}
                transactionType={transactionType}
                onTypeChange={setTransactionType}
                onSubmit={handleTransactionSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

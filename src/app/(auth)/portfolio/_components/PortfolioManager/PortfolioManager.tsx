'use client';

import { usePathname } from 'next/navigation';
import { usePortfolio } from '@/hooks/usePortfolioContext';
import CreatePortfolioModal from '../CreatePortfolioModal/CreatePortfolioModal';

type PortfolioManagerProps = {
  children: React.ReactNode;
};

export default function PortfolioManager({ children }: PortfolioManagerProps) {
  const { hasUserCreatedPortfolio } = usePortfolio();
  const pathname = usePathname();

  // Show the create portfolio modal only if user hasn't created their own portfolio yet
  // AND they're trying to access the portfolio page
  if (!hasUserCreatedPortfolio && pathname === '/portfolio') {
    return (
      <CreatePortfolioModal
        isOpen={true} // Always open when no user portfolio exists
        onClose={() => {}} // This might not be reachable if always open
        mode='create'
      />
    );
  }

  return <>{children}</>;
}

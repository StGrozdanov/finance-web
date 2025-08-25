import Navigation from '../_components/Navigation/Navigation';
import Sidebar from '../_components/NavSidebar/NavSidebar';
import PortfolioManager from '../_components/PortfolioManager/PortfolioManager';
import { PortfolioProvider } from '../_contexts/PortfolioContext';
import { FollowingProvider } from '../_contexts/FollowingContext';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortfolioProvider>
      <FollowingProvider>
        <PortfolioManager>
          <Navigation />
          <Sidebar />
          <div className='pl-[70px]'>{children}</div>
        </PortfolioManager>
      </FollowingProvider>
    </PortfolioProvider>
  );
}

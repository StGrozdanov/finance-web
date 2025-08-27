import { PortfolioProvider } from '@/context/PortfolioContext';
import Navigation from '../_components/Navigation/Navigation';
import Sidebar from '../_components/NavSidebar/NavSidebar';
import PortfolioManager from './portfolio/components/PortfolioManager/PortfolioManager';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PortfolioProvider>
      <PortfolioManager>
        <Navigation />
        <Sidebar />
        <div className='pl-[70px]'>{children}</div>
      </PortfolioManager>
    </PortfolioProvider>
  );
}

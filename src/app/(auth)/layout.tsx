import Navigation from '../_components/Navigation/Navigation';
import Sidebar from '../_components/NavSidebar/NavSidebar';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navigation />
      <Sidebar />
      <div className='pl-[70px]'>{children}</div>
    </>
  );
}

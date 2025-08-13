'use client';

import { usePathname } from 'next/navigation';
import { UserButton } from '@clerk/nextjs';
import {
  faHouse,
  faChartPie,
  faChartLine,
  faGear,
} from '@fortawesome/free-solid-svg-icons';
import { faStar } from '@fortawesome/free-regular-svg-icons';
import SidebarItem from './modules/SidebarItem';

import type { IconProp } from '@fortawesome/fontawesome-svg-core';

export type NavItem = {
  href: string;
  label: string;
  icon: IconProp;
};

const navItems: NavItem[] = [
  { href: '/', label: 'Home', icon: faHouse },
  {
    href: '/portfolio',
    label: 'Portfolio',
    icon: faChartPie,
  },
  {
    href: '/following',
    label: 'Following',
    icon: faStar,
  },
  { href: '/insights', label: 'Insights', icon: faChartLine },
  { href: '/settings', label: 'Settings', icon: faGear },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside
      className='fixed left-0 top-16 bottom-0 z-40 flex flex-col items-center bg-[#1f2430] text-white'
      style={{ width: '70px' }}
      aria-label='Primary'
    >
      <div className='mt-6'>
        <UserButton />
      </div>

      <nav className='flex-1 w-full space-y-4 py-3'>
        {navItems.map(item => (
          <SidebarItem
            key={item.label}
            href={item.href}
            label={item.label}
            icon={item.icon}
            active={pathname === item.href}
          />
        ))}
      </nav>
    </aside>
  );
}

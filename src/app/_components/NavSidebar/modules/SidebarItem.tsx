import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Tooltip from './Tooltip';

import type { NavItem } from '../NavSidebar';

export default function SidebarItem({
  href,
  label,
  icon,
  active,
}: NavItem & { active?: boolean }) {
  return (
    <div className='group relative w-full'>
      {active && (
        <span className='absolute left-0 top-1/2 -translate-y-1/2 h-10 w-1 rounded bg-emerald-500' />
      )}
      <Link
        href={href}
        className='relative mx-auto flex h-14 w-full items-center justify-center rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition-colors'
      >
        <FontAwesomeIcon icon={icon} className='text-lg' />
      </Link>
      <Tooltip label={label} />
    </div>
  );
}

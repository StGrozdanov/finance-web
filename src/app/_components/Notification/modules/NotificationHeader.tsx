import Link from 'next/link';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { Dispatch, SetStateAction } from 'react';
import type { NotificationItem } from '@/app/_components/Navigation/Navigation';

type NotificationHeaderProps = {
  menuOpen: boolean;
  onMarkAllAsRead?: () => void;
  setMenuOpen: Dispatch<SetStateAction<boolean>>;
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
};

export default function NotificationHeader({
  menuOpen,
  onMarkAllAsRead,
  setMenuOpen,
  setNotifications,
}: NotificationHeaderProps) {
  return (
    <section className='flex items-center justify-between px-6 py-5 border-b border-gray-100'>
      <h2 className='text-2xl font-bold'>Notifications</h2>
      <div className='relative'>
        <button
          className='rounded-full p-2'
          onClick={e => {
            e.stopPropagation();
            setMenuOpen(open => !open);
          }}
        >
          <FontAwesomeIcon
            icon={faEllipsisVertical}
            className='cursor-pointer'
          />
        </button>
        {menuOpen && (
          <div className='absolute right-0 mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg'>
            <button
              className='cursor-pointer block w-full px-4 py-2 text-left text-sm hover:bg-gray-50'
              onClick={() => {
                setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                onMarkAllAsRead?.();
                setMenuOpen(false);
              }}
            >
              Mark all as read
            </button>
            <Link
              href='#/settings/notifications'
              className='block w-full px-4 py-2 text-left text-sm hover:bg-gray-50'
              onClick={() => setMenuOpen(false)}
            >
              Notification settings
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import NotificationHeader from './modules/NotificationHeader';
import NotificationTab from './modules/NotificationTab';
import NoUnreadNotifications from './modules/NoUnreadNotifications';
import NotificationListItem from './modules/NotificationListItem';

import type { NotificationItem } from '../Navigation/Navigation';

type NotificationBellProps = {
  items?: NotificationItem[];
  onMarkAllAsRead?: () => void;
  onMarkAsRead?: (id: string) => void;
};

export default function NotificationBell({
  items = [],
  onMarkAllAsRead,
  onMarkAsRead,
}: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(items);
  const [tab, setTab] = useState<'all' | 'unread'>('all');
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [actionsMenuOpen, setActionsMenuOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setNotifications(items);
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const inside = !!containerRef.current?.contains(target);
      if (menuOpen && !inside) {
        setMenuOpen(false);
        setActionsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setActionsMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredUndreadNotifications =
    tab === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <section ref={containerRef}>
      <button
        className='relative p-2'
        onClick={() => setMenuOpen(open => !open)}
      >
        <FontAwesomeIcon
          icon={faBell}
          size='lg'
          className='text-gray-700 cursor-pointer'
        />
        {unreadCount > 0 && (
          <span className='absolute -top-0.5 right-0 rounded-full bg-emerald-500 px-1.5 text-[10px] font-semibold text-white'>
            {unreadCount}
          </span>
        )}
      </button>

      <article
        className={`fixed right-0 top-16 h-full z-2 w-96 bg-white shadow-md transition-transform duration-500 ease-in-out ${
          menuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <NotificationHeader
          menuOpen={actionsMenuOpen}
          onMarkAllAsRead={onMarkAllAsRead}
          setMenuOpen={setActionsMenuOpen}
          setNotifications={setNotifications}
        />

        <NotificationTab tab={tab} setTab={setTab} />

        <div className='h-full overflow-y-auto px-2 pb-6'>
          {filteredUndreadNotifications.length === 0 ?
            <NoUnreadNotifications />
          : <ul className='space-y-1'>
              {filteredUndreadNotifications.map(notification => (
                <NotificationListItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={onMarkAsRead}
                  setNotifications={setNotifications}
                />
              ))}
            </ul>
          }
        </div>
      </article>
    </section>
  );
}

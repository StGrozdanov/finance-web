import type { NotificationItem } from '@/app/_components/Navigation/Navigation';
import type { Dispatch, SetStateAction } from 'react';

type NotificationListItemProps = {
  notification: NotificationItem;
  onMarkAsRead?: (id: string) => void;
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
};

export default function NotificationListItem({
  notification,
  onMarkAsRead,
  setNotifications,
}: NotificationListItemProps) {
  return (
    <li
      className='cursor-pointer'
      onClick={() => {
        setNotifications(prev =>
          prev.map(x => (x.id === notification.id ? { ...x, read: true } : x)),
        );
        onMarkAsRead?.(notification.id);
      }}
    >
      <article className='flex gap-3 px-4 py-3 hover:bg-gray-50 rounded-md'>
        <span
          className={`mt-2 h-2.5 w-2.5 rounded-full ${
            notification.read ? 'bg-gray-300' : 'bg-emerald-500'
          }`}
        />
        <div className='flex-1'>
          <h3 className='font-medium text-gray-900 line-clamp-2'>
            {notification.title}
          </h3>
          {notification.description && (
            <p className='text-sm text-gray-600'>{notification.description}</p>
          )}
          <p className='mt-1 text-xs text-emerald-600'>
            {notification.timeAgo}
          </p>
        </div>
      </article>
    </li>
  );
}

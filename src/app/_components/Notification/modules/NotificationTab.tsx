import type { Dispatch, SetStateAction } from 'react';

type NotificationTabProps = {
  tab: 'all' | 'unread';
  setTab: Dispatch<SetStateAction<'all' | 'unread'>>;
};

export default function NotificationTab({ tab, setTab }: NotificationTabProps) {
  return (
    <section className='flex gap-3 px-6 py-4'>
      <button
        className={`rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer ${
          tab === 'all' ?
            'bg-gray-100 text-gray-800'
          : 'bg-transparent text-gray-500 hover:bg-gray-50'
        }`}
        onClick={() => setTab('all')}
      >
        All
      </button>
      <button
        className={`rounded-full px-4 py-1.5 text-sm font-semibold cursor-pointer ${
          tab === 'unread' ?
            'bg-gray-100 text-gray-800'
          : 'bg-transparent text-gray-500 hover:bg-gray-50'
        }`}
        onClick={() => setTab('unread')}
      >
        Unread
      </button>
    </section>
  );
}

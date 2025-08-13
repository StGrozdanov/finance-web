export default function NoUnreadNotifications() {
  return (
    <article className='flex-col items-center justify-center gap-4 p-8 text-center text-gray-600'>
      <p className='text-xl font-semibold text-gray-900'>
        There are no notifications
      </p>
      <p className='text-sm'>
        You are up to speed with all the updates on assets and people you
        follow.
      </p>
    </article>
  );
}

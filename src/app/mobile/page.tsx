import Image from 'next/image';
import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Digital Finance — Mobile',
  description:
    'This experience is optimized for desktop. Visit from our mobile app for the best experience.',
};

export default function MobilePage() {
  return (
    <main className='min-h-dvh w-full bg-gradient-to-b from-black to-[#2b0f6b] text-white flex flex-col items-center justify-between'>
      <div className='flex-1 w-full flex flex-col items-center justify-center px-6 text-center gap-8'>
        <div className='flex flex-col items-center gap-6'>
          <Image
            src='/digital-finance.png'
            alt='Digital Finance'
            width={160}
            height={160}
            priority
            className='h-auto w-[160px]'
          />
          <div className='space-y-4'>
            <h1 className='text-3xl font-semibold tracking-tight'>
              Best experience on the mobile app
            </h1>
            <p className='text-white/80 max-w-[36ch] mx-auto'>
              Our web app is currently optimized for larger screens. For the
              full experience, please visit from our mobile app.
            </p>
          </div>
        </div>

        <div className='flex flex-col items-center gap-3'>
          <Link
            href='/?continue=1'
            className='inline-flex items-center justify-center rounded-full bg-[#7a5cff] px-6 py-3 text-base font-semibold text-white shadow-lg shadow-[#7a5cff]/40 hover:opacity-95 transition-opacity'
          >
            Continue on web (limited)
          </Link>
          <p className='text-xs text-white/60 mt-3'>
            You can proceed, but some layouts may not fit smaller screens.
          </p>
        </div>
      </div>

      <div className='pb-8' />
    </main>
  );
}

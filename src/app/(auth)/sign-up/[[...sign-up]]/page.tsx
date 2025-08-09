'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className='flex min-h-[60vh] items-center justify-center p-6'>
      <SignUp
        appearance={{
          layout: {
            unsafe_disableDevelopmentModeWarnings: true,
          },
        }}
        routing='path'
        path='/sign-up'
        afterSignUpUrl='/'
      />
    </div>
  );
}

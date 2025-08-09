import { UserButton } from '@clerk/nextjs';

export default function Navigation() {
  return (
    <nav className='flex items-center justify-between p-4'>
      <h1 className='text-2xl font-bold'>Digital Finance</h1>
      <UserButton />
    </nav>
  );
}

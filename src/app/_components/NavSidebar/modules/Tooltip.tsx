export default function Tooltip({ label }: { label: string }) {
  return (
    <div className='pointer-events-none absolute left-[70px] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-r-md bg-[#1f2430] h-14 flex items-center px-4 text-sm text-white shadow-md opacity-0 -translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out delay-0 group-hover:delay-150 border-y border-r border-black/20'>
      {label}
    </div>
  );
}

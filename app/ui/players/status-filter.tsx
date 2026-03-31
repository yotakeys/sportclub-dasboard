'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function StatusFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (status: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        id="statusFilter"
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        defaultValue={searchParams.get('status')?.toString() || ''}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

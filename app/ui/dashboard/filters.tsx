'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Group } from '@/app/lib/definitions';

const MONTHS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export function YearFilter({ years }: { years: number[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (year: string) => {
    const params = new URLSearchParams(searchParams);
    if (year) {
      params.set('year', year);
    } else {
      params.delete('year');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        defaultValue={searchParams.get('year')?.toString() || ''}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function MonthFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (month: string) => {
    const params = new URLSearchParams(searchParams);
    if (month) {
      params.set('month', month);
    } else {
      params.delete('month');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        defaultValue={searchParams.get('month')?.toString() || ''}
        onChange={(e) => handleFilter(e.target.value)}
      >
        {MONTHS.map((month) => (
          <option key={month.value} value={month.value}>
            {month.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

export function GroupFilter({ groups }: { groups: Group[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleFilter = (groupId: string) => {
    const params = new URLSearchParams(searchParams);
    if (groupId) {
      params.set('groupId', groupId);
    } else {
      params.delete('groupId');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="relative">
      <select
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        defaultValue={searchParams.get('groupId')?.toString() || ''}
        onChange={(e) => handleFilter(e.target.value)}
      >
        <option value="">All Groups</option>
        {groups.map((group) => (
          <option key={group.id} value={group.id}>
            {group.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

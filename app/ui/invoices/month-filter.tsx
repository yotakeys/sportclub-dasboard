'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default function MonthFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentMonth = new Date().getMonth() + 1;
  const selectedMonth = searchParams.get('month') ? Number(searchParams.get('month')) : currentMonth;

  const handleFilter = (month: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', '1');

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
        id="monthFilter"
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        value={selectedMonth}
        onChange={(e) => handleFilter(e.target.value)}
      >
        {MONTH_NAMES.map((name, idx) => (
          <option key={idx + 1} value={idx + 1}>
            {name}
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

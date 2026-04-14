'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';
import { useRegionFilter } from '@/app/lib/hooks/useRegionFilter';

export default function RegionFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const { region: storedRegion, updateRegion } = useRegionFilter();

  const handleRegionChange = (region: string) => {
    updateRegion(region);
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.set('region', region);
      params.delete('page'); // Reset to page 1 when changing region
      router.push(`?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <select
        className="block w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-4 pr-10 text-sm text-slate-900 transition-colors focus:border-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50"
        value={storedRegion}
        onChange={(e) => handleRegionChange(e.target.value)}
        disabled={isPending}
      >
        <option value="Surabaya">Surabaya</option>
        <option value="Sidoarjo">Sidoarjo</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}

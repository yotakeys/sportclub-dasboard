import { Suspense } from 'react';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import InvoicesTable from '@/app/ui/invoices/table';
import YearFilter from '@/app/ui/invoices/year-filter';
import GroupFilter from '@/app/ui/invoices/group-filter';
import {
  fetchPlayersWithInvoices,
  fetchInvoicePlayersPages,
  fetchAllGroups,
  fetchAvailableYears,
} from '@/app/lib/data';

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    year?: string;
    groupId?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const currentYear = new Date().getFullYear();
  const year = Number(searchParams?.year) || currentYear;
  const groupId = searchParams?.groupId || undefined;

  const [players, totalPages, groups, years] = await Promise.all([
    fetchPlayersWithInvoices(query, currentPage, year, groupId),
    fetchInvoicePlayersPages(query, groupId),
    fetchAllGroups(),
    fetchAvailableYears(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Invoices</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track monthly payments for each player
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Search placeholder="Search players..." />
        </div>
        <div className="flex gap-3">
          <div className="w-32">
            <Suspense fallback={null}>
              <YearFilter years={years} />
            </Suspense>
          </div>
          <div className="w-40">
            <Suspense fallback={null}>
              <GroupFilter groups={groups} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <InvoicesTable players={players} year={year} />
      </div>

      <div className="mt-6 flex justify-center">
        <Suspense fallback={null}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-emerald-200 bg-emerald-50">
            <svg className="h-3 w-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <span>Paid</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 bg-slate-50" />
          <span>Unpaid</span>
        </div>
      </div>
    </div>
  );
}

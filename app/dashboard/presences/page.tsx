import { Suspense } from 'react';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import PresencesTable from '@/app/ui/presences/table';
import YearFilter from '@/app/ui/presences/year-filter';
import GroupFilter from '@/app/ui/presences/group-filter';
import StatusFilter from '@/app/ui/presences/status-filter';
import {
  fetchPlayersWithPresences,
  fetchPresencePlayersPages,
  fetchAllGroups,
  fetchPresenceAvailableYears,
} from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export default async function PresencesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    year?: string;
    groupId?: string;
    status?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const currentYear = new Date().getFullYear();
  const year = Number(searchParams?.year) || currentYear;
  const groupId = searchParams?.groupId || undefined;
  const status = searchParams?.status || undefined;

  const [players, totalPages, groups, years] = await Promise.all([
    fetchPlayersWithPresences(query, currentPage, year, groupId, status),
    fetchPresencePlayersPages(query, groupId, status),
    fetchAllGroups(),
    fetchPresenceAvailableYears(),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Presences</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track monthly attendance for each player
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
          <div className="w-32">
            <Suspense fallback={null}>
              <StatusFilter />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <PresencesTable players={players} year={year} />
      </div>

      <div className="mt-6 flex justify-center">
        <Suspense fallback={null}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}

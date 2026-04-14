import { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import PlayersTable from '@/app/ui/players/table';
import RegionFilter from '@/app/ui/players/region-filter';
import GroupFilter from '@/app/ui/players/group-filter';
import StatusFilter from '@/app/ui/players/status-filter';
import {
  fetchFilteredPlayers,
  fetchPlayersPages,
  fetchAllGroups,
} from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export default async function PlayersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    groupId?: string;
    status?: string;
    region?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const groupId = searchParams?.groupId || undefined;
  const status = searchParams?.status || undefined;
  const region = searchParams?.region || 'Surabaya';

  const [players, totalPages, groups] = await Promise.all([
    fetchFilteredPlayers(query, currentPage, groupId, status, region),
    fetchPlayersPages(query, groupId, status, region),
    fetchAllGroups(region),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Players</h1>
        <Link
          href={`/dashboard/players/create?region=${region}`}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Player</span>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Search placeholder="Search players..." />
        </div>
        <div className="w-full sm:w-40">
          <Suspense fallback={null}>
            <RegionFilter />
          </Suspense>
        </div>
        <div className="w-full sm:w-48">
          <Suspense fallback={null}>
            <GroupFilter groups={groups} />
          </Suspense>
        </div>
        <div className="w-full sm:w-36">
          <Suspense fallback={null}>
            <StatusFilter />
          </Suspense>
        </div>
      </div>

      <div className="mt-6">
        <PlayersTable players={players} region={region} />
      </div>

      <div className="mt-6 flex justify-center">
        <Suspense fallback={null}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}

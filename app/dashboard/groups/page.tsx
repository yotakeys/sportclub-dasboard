import { Suspense } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import Search from '@/app/ui/search';
import Pagination from '@/app/ui/pagination';
import GroupsTable from '@/app/ui/groups/table';
import RegionFilter from '@/app/ui/groups/region-filter';
import { fetchFilteredGroups, fetchGroupsPages } from '@/app/lib/data';

export const dynamic = 'force-dynamic';

export default async function GroupsPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    region?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const region = searchParams?.region || 'Surabaya';

  const [groups, totalPages] = await Promise.all([
    fetchFilteredGroups(query, currentPage, region),
    fetchGroupsPages(query, region),
  ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">Groups</h1>
        <Link
          href={`/dashboard/groups/create?region=${region}`}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Group</span>
        </Link>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Search placeholder="Search groups..." />
        </div>
        <div className="w-full sm:w-40">
          <Suspense fallback={null}>
            <RegionFilter />
          </Suspense>
        </div>
      </div>

      <div className="mt-6">
        <GroupsTable groups={groups} region={region} />
      </div>

      <div className="mt-6 flex justify-center">
        <Suspense fallback={null}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>
    </div>
  );
}

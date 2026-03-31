import { CreatePlayerForm } from '@/app/ui/players/form';
import { fetchAllGroups } from '@/app/lib/data';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function CreatePlayerPage() {
  const groups = await fetchAllGroups();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/players"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Players
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-slate-900">Create Player</h1>
      <p className="mt-2 text-slate-500">Add a new player to the club.</p>

      <div className="mt-8 max-w-xl">
        <CreatePlayerForm groups={groups} />
      </div>
    </div>
  );
}

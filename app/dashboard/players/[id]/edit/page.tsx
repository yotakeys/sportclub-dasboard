import { notFound } from 'next/navigation';
import { fetchPlayerById, fetchAllGroups } from '@/app/lib/data';
import { EditPlayerForm } from '@/app/ui/players/form';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default async function EditPlayerPage({
  params,
}: {
  params: { id: string };
}) {
  const [player, groups] = await Promise.all([
    fetchPlayerById(params.id),
    fetchAllGroups(),
  ]);

  if (!player) {
    notFound();
  }

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

      <h1 className="text-2xl font-semibold text-slate-900">Edit Player</h1>
      <p className="mt-2 text-slate-500">Update player information.</p>

      <div className="mt-8 max-w-xl">
        <EditPlayerForm player={player} groups={groups} />
      </div>
    </div>
  );
}

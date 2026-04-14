import { notFound } from 'next/navigation';
import { fetchGroupById } from '@/app/lib/data';
import { EditGroupForm } from '@/app/ui/groups/form';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export const dynamic = 'force-dynamic';

export default async function EditGroupPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: {
    region?: string;
  };
}) {
  const region = searchParams?.region || 'Surabaya';
  const group = await fetchGroupById(params.id);

  if (!group) {
    notFound();
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/dashboard/groups"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Back to Groups
        </Link>
      </div>

      <h1 className="text-2xl font-semibold text-slate-900">Edit Group</h1>
      <p className="mt-2 text-slate-500">Update group information.</p>

      <div className="mt-8 max-w-xl">
        <EditGroupForm group={group} region={region} />
      </div>
    </div>
  );
}

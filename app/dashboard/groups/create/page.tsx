import { CreateGroupForm } from '@/app/ui/groups/form';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CreateGroupPage() {
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

      <h1 className="text-2xl font-semibold text-slate-900">Create Group</h1>
      <p className="mt-2 text-slate-500">Add a new training group.</p>

      <div className="mt-8 max-w-xl">
        <CreateGroupForm />
      </div>
    </div>
  );
}

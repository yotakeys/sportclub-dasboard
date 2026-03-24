import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Group } from '@/app/lib/definitions';
import { deleteGroup } from '@/app/lib/action';

export default function GroupsTable({ groups }: { groups: Group[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {groups.length === 0 ? (
            <tr>
              <td colSpan={2} className="px-6 py-8 text-center text-sm text-slate-500">
                No groups found.
              </td>
            </tr>
          ) : (
            groups.map((group) => (
              <tr key={group.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {group.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <UpdateGroup id={group.id} />
                    <DeleteGroup id={group.id} />
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function UpdateGroup({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/groups/${id}/edit`}
      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <PencilIcon className="h-4 w-4" />
    </Link>
  );
}

function DeleteGroup({ id }: { id: string }) {
  const deleteGroupWithId = deleteGroup.bind(null, id);

  return (
    <form action={deleteGroupWithId}>
      <button
        type="submit"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

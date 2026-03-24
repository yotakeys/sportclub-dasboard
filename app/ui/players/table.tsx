import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deletePlayer } from '@/app/lib/action';
import { PlayerWithGroups } from '@/app/lib/data';

export default function PlayersTable({ players }: { players: PlayerWithGroups[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Groups
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {players.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                No players found.
              </td>
            </tr>
          ) : (
            players.map((player) => (
              <tr key={player.id} className="hover:bg-slate-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-slate-900">
                  {player.name}
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">
                  <div className="flex flex-wrap gap-1">
                    {player.groups.length > 0 ? (
                      player.groups.map((group) => (
                        <span
                          key={group.id}
                          className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700"
                        >
                          {group.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400">No groups</span>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <UpdatePlayer id={player.id} />
                    <DeletePlayer id={player.id} />
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

function UpdatePlayer({ id }: { id: string }) {
  return (
    <Link
      href={`/dashboard/players/${id}/edit`}
      className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
    >
      <PencilIcon className="h-4 w-4" />
    </Link>
  );
}

function DeletePlayer({ id }: { id: string }) {
  const deletePlayerWithId = deletePlayer.bind(null, id);

  return (
    <form action={deletePlayerWithId}>
      <button
        type="submit"
        className="rounded-lg border border-slate-200 p-2 text-slate-600 transition-colors hover:bg-red-50 hover:border-red-200 hover:text-red-600"
      >
        <TrashIcon className="h-4 w-4" />
      </button>
    </form>
  );
}

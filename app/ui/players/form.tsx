'use client';

import { PlayerState, createPlayer, updatePlayer } from '@/app/lib/action';
import { Group } from '@/app/lib/definitions';
import { PlayerWithGroups } from '@/app/lib/data';
import { useFormState } from 'react-dom';
import Link from 'next/link';

export function CreatePlayerForm({ groups }: { groups: Group[] }) {
  const initialState: PlayerState = { message: null, errors: {} };
  const [state, formAction] = useFormState(createPlayer, initialState);

  return (
    <form action={formAction}>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Player Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter player name"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="name-error"
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Birthdate
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="birthdate-error"
            />
            <div id="birthdate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.birthdate &&
                state.errors.birthdate.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="phone-error"
            />
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              placeholder="Enter address"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="address-error"
            />
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {state.errors?.address &&
                state.errors.address.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={true}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
              />
              <span className="text-sm font-medium text-slate-700">Active Player</span>
            </label>
          </div>

          {/* Groups */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Groups
            </label>
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {groups.length === 0 ? (
                <p className="text-sm text-slate-400">No groups available</p>
              ) : (
                groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="groupIds"
                      value={group.id}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
                    />
                    <span className="text-sm text-slate-700">{group.name}</span>
                  </label>
                ))
              )}
            </div>
            <div id="groups-error" aria-live="polite" aria-atomic="true">
              {state.errors?.groupIds &&
                state.errors.groupIds.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {state.message && (
          <p className="mt-4 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/dashboard/players"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Create Player
        </button>
      </div>
    </form>
  );
}

export function EditPlayerForm({
  player,
  groups,
}: {
  player: PlayerWithGroups;
  groups: Group[];
}) {
  const initialState: PlayerState = { message: null, errors: {} };
  const updatePlayerWithId = updatePlayer.bind(null, player.id);
  const [state, formAction] = useFormState(updatePlayerWithId, initialState);

  const playerGroupIds = player.groups.map((g) => g.id);

  return (
    <form action={formAction}>
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Player Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={player.name}
              placeholder="Enter player name"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="name-error"
            />
            <div id="name-error" aria-live="polite" aria-atomic="true">
              {state.errors?.name &&
                state.errors.name.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Birthdate */}
          <div>
            <label
              htmlFor="birthdate"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Birthdate
            </label>
            <input
              id="birthdate"
              name="birthdate"
              type="date"
              defaultValue={player.birthdate || ''}
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="birthdate-error"
            />
            <div id="birthdate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.birthdate &&
                state.errors.birthdate.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={player.phone || ''}
              placeholder="Enter phone number"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="phone-error"
            />
            <div id="phone-error" aria-live="polite" aria-atomic="true">
              {state.errors?.phone &&
                state.errors.phone.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Address
            </label>
            <textarea
              id="address"
              name="address"
              rows={3}
              defaultValue={player.address || ''}
              placeholder="Enter address"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
              aria-describedby="address-error"
            />
            <div id="address-error" aria-live="polite" aria-atomic="true">
              {state.errors?.address &&
                state.errors.address.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          {/* Active Status */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={player.is_active}
                className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
              />
              <span className="text-sm font-medium text-slate-700">Active Player</span>
            </label>
          </div>

          {/* Groups */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Groups
            </label>
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {groups.length === 0 ? (
                <p className="text-sm text-slate-400">No groups available</p>
              ) : (
                groups.map((group) => (
                  <label
                    key={group.id}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="groupIds"
                      value={group.id}
                      defaultChecked={playerGroupIds.includes(group.id)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900/10"
                    />
                    <span className="text-sm text-slate-700">{group.name}</span>
                  </label>
                ))
              )}
            </div>
            <div id="groups-error" aria-live="polite" aria-atomic="true">
              {state.errors?.groupIds &&
                state.errors.groupIds.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {state.message && (
          <p className="mt-4 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/dashboard/players"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Update Player
        </button>
      </div>
    </form>
  );
}

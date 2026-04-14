'use client';

import { GroupState, createGroup, updateGroup } from '@/app/lib/action';
import { Group } from '@/app/lib/definitions';
import { useFormState } from 'react-dom';
import Link from 'next/link';

export function CreateGroupForm({ region }: { region?: string }) {
  const initialState: GroupState = { message: null, errors: {} };
  const [state, formAction] = useFormState(createGroup, initialState);
  const selectedRegion = region || 'Surabaya';

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
              Group Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter group name"
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

          {/* Region */}
          <div>
            <label
              htmlFor="region"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Region
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600">
              {selectedRegion}
            </div>
            <input
              type="hidden"
              name="region"
              value={selectedRegion}
            />
          </div>
        </div>

        {state.message && (
          <p className="mt-4 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/dashboard/groups"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Create Group
        </button>
      </div>
    </form>
  );
}

export function EditGroupForm({ group, region }: { group: Group; region?: string }) {
  const initialState: GroupState = { message: null, errors: {} };
  const updateGroupWithId = updateGroup.bind(null, group.id);
  const [state, formAction] = useFormState(updateGroupWithId, initialState);
  const selectedRegion = region || 'Surabaya';

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
              Group Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={group.name}
              placeholder="Enter group name"
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

          {/* Region */}
          <div>
            <label
              htmlFor="region"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Region
            </label>
            <div className="rounded-lg border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600">
              {selectedRegion}
            </div>
            <input
              type="hidden"
              name="region"
              value={selectedRegion}
            />
          </div>
        </div>

        {state.message && (
          <p className="mt-4 text-sm text-red-500">{state.message}</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end gap-4">
        <Link
          href="/dashboard/groups"
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
        >
          Cancel
        </Link>
        <button
          type="submit"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
        >
          Update Group
        </button>
      </div>
    </form>
  );
}

'use client';

import { PlayerWithGroups } from '@/app/lib/data';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface PlayerModalProps {
  player: PlayerWithGroups | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlayerModal({ player, isOpen, onClose }: PlayerModalProps) {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-slate-900">{player.name}</h2>
          <div className="mt-2 flex items-center gap-4">
            {player.is_active ? (
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                Active
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
                Inactive
              </span>
            )}
          </div>
        </div>

        {/* Content Grid */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Personal Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-500">NIK</label>
                <p className="mt-1 text-slate-900">{player.nik}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Email</label>
                <p className="mt-1 text-slate-900 break-all">{player.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Birth Place</label>
                <p className="mt-1 text-slate-900">{player.birth_place}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Birthdate</label>
                <p className="mt-1 text-slate-900">
                  {player.birthdate 
                    ? new Date(player.birthdate).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-500">Phone Number</label>
                <p className="mt-1 text-slate-900">{player.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">Address</label>
                <p className="mt-1 text-slate-900">{player.address || '-'}</p>
              </div>
            </div>
          </div>

          {/* Groups */}
          {player.groups.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Groups</h3>
              <div className="flex flex-wrap gap-2">
                {player.groups.map((group) => (
                  <span
                    key={group.id}
                    className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                  >
                    {group.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Metadata</h3>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div>
                <label className="font-medium text-slate-500">Created</label>
                <p className="mt-1 text-slate-900">
                  {player.created_at
                    ? new Date(player.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'
                  }
                </p>
              </div>
              <div>
                <label className="font-medium text-slate-500">Last Updated</label>
                <p className="mt-1 text-slate-900">
                  {player.updated_at
                    ? new Date(player.updated_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : '-'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button at Bottom */}
        <div className="mt-8 flex justify-end gap-4 border-t border-slate-200 pt-6">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import { PlayerWithPresences, MonthlyPresence } from '@/app/lib/data';
import { updatePresence } from '@/app/lib/action';
import { useState, useTransition } from 'react';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function PresenceCell({
  playerId,
  presence,
  year,
}: {
  playerId: string;
  presence: MonthlyPresence;
  year: number;
}) {
  const [isPending, startTransition] = useTransition();
  const [count, setCount] = useState(presence.count);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(presence.count.toString());

  const handleSave = () => {
    const newCount = parseInt(inputValue) || 0;
    if (newCount !== count) {
      setCount(newCount);
      startTransition(async () => {
        await updatePresence(playerId, presence.month, year, newCount, presence.presenceId);
      });
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setInputValue(count.toString());
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="number"
        min="0"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="w-12 rounded border border-slate-300 px-1 py-0.5 text-center text-xs focus:border-slate-500 focus:outline-none"
        autoFocus
        disabled={isPending}
      />
    );
  }

  return (
    <button
      onClick={() => {
        setInputValue(count.toString());
        setIsEditing(true);
      }}
      className={`flex h-8 w-12 items-center justify-center rounded border text-xs font-medium transition-colors ${
        count > 0
          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          : 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-100'
      } ${isPending ? 'opacity-50' : ''}`}
      disabled={isPending}
    >
      {count}
    </button>
  );
}

export default function PresencesTable({
  players,
  year,
}: {
  players: PlayerWithPresences[];
  year: number;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
              Player
            </th>
            {MONTH_NAMES.map((month, index) => (
              <th
                key={index}
                className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500"
              >
                {month}
              </th>
            ))}
            <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {players.length === 0 ? (
            <tr>
              <td
                colSpan={14}
                className="px-6 py-8 text-center text-sm text-slate-500"
              >
                No players found.
              </td>
            </tr>
          ) : (
            players.map((player) => {
              const totalPresence = player.presences.reduce((sum, p) => sum + p.count, 0);
              return (
                <tr key={player.id} className="hover:bg-slate-50">
                  <td className="sticky left-0 z-10 bg-white whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                    {player.name}
                  </td>
                  {player.presences.map((presence) => (
                    <td key={presence.month} className="px-2 py-3 text-center">
                      <PresenceCell
                        playerId={player.id}
                        presence={presence}
                        year={year}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {totalPresence}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

'use client';

import { CheckIcon } from '@heroicons/react/24/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { PlayerWithInvoices } from '@/app/lib/data';
import { toggleInvoice } from '@/app/lib/action';
import { useTransition, useState } from 'react';

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export default function InvoicesTable({
  players,
  year,
}: {
  players: PlayerWithInvoices[];
  year: number;
}) {
  const [modal, setModal] = useState<{
    playerId: string;
    playerName: string;
    month: number;
    year: number;
    status: 'paid' | null;
    invoiceId: string | null;
    amount: number;
  } | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                Player
              </th>
              {MONTHS.map((month) => (
                <th
                  key={month}
                  className="px-2 py-3 text-center text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  {month}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {players.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-4 py-8 text-center text-sm text-slate-500">
                  No players found.
                </td>
              </tr>
            ) : (
              players.map((player) => (
                <tr key={player.id} className="hover:bg-slate-50">
                  <td className="sticky left-0 z-10 bg-white whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                    {player.name}
                  </td>
                  {player.invoices.map((invoice) => (
                    <InvoiceCell
                      key={invoice.month}
                      playerId={player.id}
                      playerName={player.name}
                      month={invoice.month}
                      year={year}
                      status={invoice.status}
                      invoiceId={invoice.invoiceId}
                      amount={invoice.amount}
                      onOpenModal={setModal}
                    />
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Amount Modal */}
      {modal && (
        <InvoiceModal
          modal={modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}

function InvoiceCell({
  playerId,
  playerName,
  month,
  year,
  status,
  invoiceId,
  amount,
  onOpenModal,
}: {
  playerId: string;
  playerName: string;
  month: number;
  year: number;
  status: 'paid' | null;
  invoiceId: string | null;
  amount: number;
  onOpenModal: (modal: {
    playerId: string;
    playerName: string;
    month: number;
    year: number;
    status: 'paid' | null;
    invoiceId: string | null;
    amount: number;
  }) => void;
}) {
  const handleClick = () => {
    onOpenModal({
      playerId,
      playerName,
      month,
      year,
      status,
      invoiceId,
      amount,
    });
  };

  const formatAmount = (amount: number) => {
    if (amount === 0) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <td className="px-2 py-3 text-center">
      <button
        onClick={handleClick}
        className={`
          inline-flex h-8 min-w-8 items-center justify-center rounded-lg border px-1 transition-all cursor-pointer
          ${
            status === 'paid'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
              : 'border-slate-200 bg-slate-50 text-slate-300 hover:bg-slate-100 hover:text-slate-400'
          }
        `}
        title={status === 'paid' ? `Paid: ${formatAmount(amount)}` : 'Unpaid - Click to add payment'}
      >
        {status === 'paid' ? (
          <CheckIcon className="h-4 w-4" />
        ) : (
          <span className="h-4 w-4" />
        )}
      </button>
    </td>
  );
}

function InvoiceModal({
  modal,
  onClose,
}: {
  modal: {
    playerId: string;
    playerName: string;
    month: number;
    year: number;
    status: 'paid' | null;
    invoiceId: string | null;
    amount: number;
  };
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [amount, setAmount] = useState((modal.amount || 0).toString());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseInt(amount.replace(/\D/g, '')) || 0;
    
    startTransition(async () => {
      await toggleInvoice(
        modal.playerId,
        modal.month,
        modal.year,
        modal.status,
        modal.invoiceId,
        numAmount,
      );
      onClose();
    });
  };

  const handleRemove = () => {
    startTransition(async () => {
      await toggleInvoice(
        modal.playerId,
        modal.month,
        modal.year,
        'paid',
        modal.invoiceId,
        0,
      );
      onClose();
    });
  };

  const formatInputAmount = (value: string) => {
    const num = value.replace(/\D/g, '');
    if (!num) return '';
    return new Intl.NumberFormat('id-ID').format(parseInt(num));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(formatInputAmount(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900">
            {modal.status === 'paid' ? 'Payment Details' : 'Add Payment'}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 text-sm text-slate-500">
          <p><span className="font-medium text-slate-700">Player:</span> {modal.playerName}</p>
          <p><span className="font-medium text-slate-700">Period:</span> {MONTHS[modal.month - 1]} {modal.year}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Amount (Rupiah)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                Rp
              </span>
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0"
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                autoFocus
              />
            </div>
          </div>

          <div className="flex gap-3">
            {modal.status === 'paid' && (
              <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className="flex-1 rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isPending ? 'Removing...' : 'Remove Payment'}
              </button>
            )}
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-slate-800 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : modal.status === 'paid' ? 'Update' : 'Mark as Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

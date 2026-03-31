import { Suspense } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import {
  fetchDashboardStats,
  fetchAllGroups,
  fetchAvailableYears,
} from '@/app/lib/data';
import { YearFilter, MonthFilter, GroupFilter } from '@/app/ui/dashboard/filters';

export const dynamic = 'force-dynamic';

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: {
    year?: string;
    month?: string;
    groupId?: string;
  };
}) {
  const year = searchParams?.year ? Number(searchParams.year) : undefined;
  const month = searchParams?.month ? Number(searchParams.month) : undefined;
  const groupId = searchParams?.groupId || undefined;

  const [stats, groups, years] = await Promise.all([
    fetchDashboardStats(year, month, groupId),
    fetchAllGroups(),
    fetchAvailableYears(),
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxMonthlyIncome = Math.max(...stats.monthlyIncome.map(m => m.total), 1);

  // Build filter context text
  const getFilterContext = () => {
    const parts = [];
    if (year) parts.push(`Year ${year}`);
    if (month) parts.push(MONTH_NAMES[month - 1]);
    return parts.length > 0 ? parts.join(' - ') : 'All time';
  };

  const filterContext = getFilterContext();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Welcome to Tri Dharma Club Management Dashboard
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="w-32">
          <Suspense fallback={null}>
            <YearFilter years={years} />
          </Suspense>
        </div>
        <div className="w-36">
          <Suspense fallback={null}>
            <MonthFilter />
          </Suspense>
        </div>
        <div className="w-40">
          <Suspense fallback={null}>
            <GroupFilter groups={groups} />
          </Suspense>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Income - Large Card */}
        <div className="sm:col-span-2 lg:col-span-2 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold mt-1">{formatCurrency(stats.totalIncome)}</p>
              <p className="text-emerald-100 text-sm mt-2">
                {year ? `Year ${year}${month ? ` - ${MONTH_NAMES[month - 1]}` : ''}` : 'All time'}
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-4">
              <BanknotesIcon className="h-8 w-8" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircleIcon className="h-4 w-4" />
              <span>{stats.paidInvoicesCount} paid invoices</span>
            </div>
          </div>
        </div>

        {/* Players Card */}
        <Link
          href="/dashboard/players"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-blue-50 p-3">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-slate-400">PLAYERS</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats.totalPlayers}</p>
          <div className="flex items-center gap-3 mt-2 text-sm">
            <span className="text-emerald-600">{stats.activePlayers} active</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-400">{stats.inactivePlayers} inactive</span>
          </div>
        </Link>

        {/* Groups Card */}
        <Link
          href="/dashboard/groups"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div className="rounded-xl bg-purple-50 p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-slate-400">GROUPS</span>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats.totalGroups}</p>
          <p className="text-sm text-slate-500 mt-2">Training groups</p>
        </Link>
      </div>

      {/* Second Row Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Card */}
        <Link
          href="/dashboard/presences"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-amber-50 p-3">
              <CalendarDaysIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Attendance</p>
              <p className="text-2xl font-bold text-slate-900">{stats.totalPresences}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">Sessions attended in {filterContext}</p>
        </Link>

        {/* Payment Status Card */}
        <Link
          href="/dashboard/invoices"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center gap-3">
            <div className={`rounded-xl p-3 ${stats.unpaidPlayersCount > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {stats.unpaidPlayersCount > 0 ? (
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Unpaid {month ? `in ${MONTH_NAMES[month - 1]}` : 'This Month'}</p>
              <p className={`text-2xl font-bold ${stats.unpaidPlayersCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {stats.unpaidPlayersCount}
              </p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">
            {stats.unpaidPlayersCount > 0 
              ? `${stats.unpaidPlayersCount} players need to pay` 
              : 'All players have paid!'}
          </p>
        </Link>

        {/* Paid Invoices Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-emerald-50 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Paid Invoices</p>
              <p className="text-2xl font-bold text-slate-900">{stats.paidInvoicesCount}</p>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-3">Invoices paid in {filterContext}</p>
        </div>
      </div>

      {/* Charts and Lists Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Monthly Income Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Monthly Income {year || 'All time'}</h3>
          <div className="mt-6 flex items-end gap-2 h-48">
            {Array.from({ length: 12 }, (_, i) => {
              const monthData = stats.monthlyIncome.find(m => m.month === i + 1);
              const total = monthData?.total || 0;
              const height = maxMonthlyIncome > 0 ? (total / maxMonthlyIncome) * 100 : 0;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-slate-100 rounded-t-lg relative" style={{ height: '160px' }}>
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t-lg transition-all"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{MONTH_NAMES[i]}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Attendance */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-slate-900">Top Attendance</h3>
          <p className="text-sm text-slate-500">Most active players in {filterContext}</p>
          <div className="mt-4 space-y-3">
            {stats.topAttendance.length === 0 ? (
              <p className="text-sm text-slate-400 py-4 text-center">No attendance data yet</p>
            ) : (
              stats.topAttendance.map((player, index) => (
                <div key={player.id} className="flex items-center gap-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-700' :
                    index === 1 ? 'bg-slate-200 text-slate-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{player.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{player.total}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Recent Players */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Recent Players</h3>
            <p className="text-sm text-slate-500">Newly registered players</p>
          </div>
          <Link
            href="/dashboard/players/create"
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800"
          >
            <UserPlusIcon className="h-4 w-4" />
            Add Player
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.recentPlayers.length === 0 ? (
            <p className="text-sm text-slate-400 col-span-full py-4 text-center">No players yet</p>
          ) : (
            stats.recentPlayers.map((player) => (
              <Link
                key={player.id}
                href={`/dashboard/players/${player.id}/edit`}
                className="rounded-xl border border-slate-200 p-4 transition-all hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 text-white font-semibold">
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{player.name}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(player.created_at).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

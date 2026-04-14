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
} from '@heroicons/react/24/outline';
import {
  fetchDashboardStats,
  fetchAllGroups,
  fetchAvailableYears,
} from '@/app/lib/data';
import { YearFilter, MonthFilter, GroupFilter } from '@/app/ui/dashboard/filters';
import RegionFilter from '@/app/ui/dashboard/region-filter';

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
    region?: string;
  };
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const year = searchParams?.year ? Number(searchParams.year) : undefined;
  const month = searchParams?.month ? Number(searchParams.month) : undefined;
  const groupId = searchParams?.groupId || undefined;
  const region = searchParams?.region || 'Surabaya';

  const [stats, groups, years] = await Promise.all([
    fetchDashboardStats(year, month, groupId, region),
    fetchAllGroups(region),
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
        <div className="w-40">
          <Suspense fallback={null}>
            <RegionFilter />
          </Suspense>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Income Card */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 text-white shadow-lg shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Total Income</p>
              <p className="text-3xl font-bold mt-2">{formatCurrency(stats.totalIncome)}</p>
              <p className="text-emerald-100 text-xs mt-2">
                {year ? `Year ${year}${month ? ` - ${MONTH_NAMES[month - 1]}` : ''}` : 'All time'}
              </p>
            </div>
            <div className="rounded-full bg-white/20 p-3">
              <BanknotesIcon className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Players Card */}
        <Link
          href="/dashboard/players"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Players</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalPlayers}</p>
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="text-emerald-600">{stats.activePlayers} active</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500">{stats.inactivePlayers} inactive</span>
              </div>
            </div>
            <div className="rounded-xl bg-blue-50 p-3">
              <UsersIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Link>

        {/* Groups Card */}
        <Link
          href="/dashboard/groups"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Training Groups</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalGroups}</p>
              <p className="text-xs text-slate-400 mt-2">Active groups</p>
            </div>
            <div className="rounded-xl bg-purple-50 p-3">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </Link>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Attendance Card */}
        <Link
          href="/dashboard/presences"
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Attendance</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.totalPresences}</p>
              <p className="text-xs text-slate-400 mt-2">Sessions in {filterContext}</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-3">
              <CalendarDaysIcon className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </Link>

        {/* Payment Status Card */}
        <Link
          href={`/dashboard/invoices?year=${year || currentYear}&month=${month || currentMonth}&paymentStatus=${stats.unpaidPlayersCount > 0 ? 'unpaid' : 'paid'}`}
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Unpaid Payments</p>
              <p className={`text-3xl font-bold mt-2 ${stats.unpaidPlayersCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {stats.unpaidPlayersCount}
              </p>
              <p className="text-xs text-slate-400 mt-2">
                {stats.unpaidPlayersCount > 0 ? 'Players need to pay' : 'All caught up!'}
              </p>
            </div>
            <div className={`rounded-xl p-3 ${stats.unpaidPlayersCount > 0 ? 'bg-red-50' : 'bg-emerald-50'}`}>
              {stats.unpaidPlayersCount > 0 ? (
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              ) : (
                <CheckCircleIcon className="h-6 w-6 text-emerald-600" />
              )}
            </div>
          </div>
        </Link>

        {/* Paid Invoices Card */}
        <Link
          href={`/dashboard/invoices?year=${year || currentYear}&month=${month || currentMonth}&paymentStatus=paid`}
          className="rounded-2xl border border-slate-200 bg-white p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 hover:border-slate-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Paid Invoices</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{stats.paidInvoicesCount}</p>
              <p className="text-xs text-slate-400 mt-2">Completed in {filterContext}</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3">
              <ArrowTrendingUpIcon className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

import { Suspense } from 'react';
import Link from 'next/link';
import {
  UserGroupIcon,
  UsersIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import {
  fetchDashboardStats,
  fetchAllGroups,
  fetchAvailableYears,
} from '@/app/lib/data';
import { YearFilter, MonthFilter, GroupFilter } from '@/app/ui/dashboard/filters';

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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-500">
        Welcome to Tri Dharma Club Management Dashboard.
      </p>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap gap-3">
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

      {/* Stats Cards */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Players"
          value={stats.totalPlayers.toString()}
          icon={UsersIcon}
          href="/dashboard/players"
          description={groupId ? 'in selected group' : 'registered'}
        />
        <StatCard
          title="Total Groups"
          value={stats.totalGroups.toString()}
          icon={UserGroupIcon}
          href="/dashboard/groups"
          description="training groups"
        />
        <StatCard
          title="Total Income"
          value={formatCurrency(stats.totalIncome)}
          icon={BanknotesIcon}
          href="/dashboard/invoices"
          description={year ? `for ${year}${month ? ` - ${getMonthName(month)}` : ''}` : 'all time'}
          highlight
        />
      </div>

      {/* Quick Links */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <QuickLink
            title="Manage Groups"
            description="Create and edit training groups"
            href="/dashboard/groups"
          />
          <QuickLink
            title="Manage Players"
            description="Add and manage club members"
            href="/dashboard/players"
          />
          <QuickLink
            title="Track Payments"
            description="Record monthly payments"
            href="/dashboard/invoices"
          />
        </div>
      </div>
    </div>
  );
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month - 1] || '';
}

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  description,
  highlight,
}: {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  description: string;
  highlight?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-xl border p-6 transition-all hover:shadow-lg hover:shadow-slate-900/5 ${
        highlight
          ? 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-white hover:border-emerald-300'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${
            highlight ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
          }`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className={`text-2xl font-semibold ${highlight ? 'text-emerald-600' : 'text-slate-900'}`}>
            {value}
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

function QuickLink({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
    >
      <h3 className="font-semibold text-slate-900 group-hover:text-slate-700">
        {title}
      </h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </Link>
  );
}

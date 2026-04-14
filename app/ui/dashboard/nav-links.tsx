'use client';

import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import clsx from 'clsx';
import { useRegionFilter } from '@/app/lib/hooks/useRegionFilter';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Groups', href: '/dashboard/groups', icon: UserGroupIcon },
  { name: 'Players', href: '/dashboard/players', icon: UsersIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentTextIcon },
  { name: 'Presences', href: '/dashboard/presences', icon: CalendarDaysIcon },
];

export default function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const dashboardQueryPrefix = queryString ? `?${queryString}` : '';
  const { region } = useRegionFilter();
  const regionQueryPrefix = `?region=${region}`;

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
        
        let href = link.href;
        if (link.href === '/dashboard') {
          href = `${link.href}${dashboardQueryPrefix}`;
        } else if (
          link.href === '/dashboard/invoices' || 
          link.href === '/dashboard/presences' ||
          link.href === '/dashboard/groups' ||
          link.href === '/dashboard/players'
        ) {
          href = `${link.href}${regionQueryPrefix}`;
        }

        return (
          <Link
            key={link.name}
            href={href}
            className={clsx(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
              {
                'bg-slate-100 text-slate-900': isActive,
                'text-slate-600 hover:bg-slate-50 hover:text-slate-900': !isActive,
              },
            )}
          >
            <LinkIcon className="h-5 w-5" />
            <span>{link.name}</span>
          </Link>
        );
      })}
    </>
  );
}

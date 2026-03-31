'use client';

import {
  HomeIcon,
  UserGroupIcon,
  UsersIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
  { name: 'Home', href: '/dashboard', icon: HomeIcon },
  { name: 'Groups', href: '/dashboard/groups', icon: UserGroupIcon },
  { name: 'Players', href: '/dashboard/players', icon: UsersIcon },
  { name: 'Invoices', href: '/dashboard/invoices', icon: DocumentTextIcon },
  { name: 'Presences', href: '/dashboard/presences', icon: CalendarDaysIcon },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

        return (
          <Link
            key={link.name}
            href={link.href}
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

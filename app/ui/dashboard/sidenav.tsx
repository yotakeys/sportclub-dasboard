import Link from 'next/link';
import Image from 'next/image';
import { Suspense } from 'react';
import NavLinks from '@/app/ui/dashboard/nav-links';
import { PowerIcon } from '@heroicons/react/24/outline';
import { handleSignOut } from '@/app/lib/actions/auth-actions';

function NavLinksFallback() {
  return (
    <div className="space-y-1 px-4 py-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-9 rounded-lg bg-slate-100 animate-pulse" />
      ))}
    </div>
  );
}

export default function SideNav() {
  return (
    <div className="flex h-full flex-col bg-white">
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-3 border-b border-slate-100 px-6 py-5"
      >
        <Image
          src="/logo.png"
          alt="Tri Dharma Logo"
          width={36}
          height={36}
        />
        <span className="text-lg font-semibold text-slate-900">Tri Dharma</span>
      </Link>

      {/* Navigation */}
      <Suspense fallback={<NavLinksFallback />}>
        <nav className="flex-1 space-y-1 px-4 py-4">
          <NavLinks />
        </nav>
      </Suspense>

      {/* Sign Out */}
      <div className="border-t border-slate-100 p-4">
        <form action={handleSignOut}>
          <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600">
            <PowerIcon className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </form>
      </div>
    </div>
  );
}

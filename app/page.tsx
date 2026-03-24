import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full max-w-md px-6">
        {/* Logo/Brand */}
        <div className="mb-12 text-center">
          <Image
            src="/logo.png"
            alt="Tri Dharma Logo"
            width={80}
            height={80}
            className="mx-auto mb-6"
          />
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Tri Dharma
          </h1>
          <p className="mt-2 text-slate-500">
            Club Management Dashboard
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/login"
          className="group flex w-full items-center justify-center gap-3 rounded-xl bg-slate-900 px-6 py-4 text-base font-medium text-white shadow-lg shadow-slate-900/10 transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-900/20"
        >
          <span>Get Started</span>
          <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Link>

        <p className="mt-6 text-center text-sm text-slate-400">
          Manage members, track payments, organize groups
        </p>
      </div>
    </main>
  );
}

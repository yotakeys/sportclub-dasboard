import LoginForm from '@/app/ui/login/login-form';
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <Link href="/" className="mb-8 block text-center">
          <Image
            src="/logo.png"
            alt="Tri Dharma Logo"
            width={56}
            height={56}
            className="mx-auto mb-4"
          />
          <h1 className="text-xl font-semibold text-slate-900">Tri Dharma</h1>
        </Link>

        {/* Login Card */}
        <div className="rounded-2xl bg-white p-8 shadow-xl shadow-slate-900/5">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center text-sm text-slate-400">
          Secure login to your dashboard
        </p>
      </div>
    </main>
  );
}
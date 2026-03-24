'use client';

import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { authenticate } from '@/app/lib/action';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const [errorMessage, formAction] = useFormState(authenticate, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to your account</p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Email
          </label>
          <div className="relative">
            <input
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            <AtSymbolIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Password
          </label>
          <div className="relative">
            <input
              name="password"
              type="password"
              minLength={6}
              required
              placeholder="••••••••"
              className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10"
            />
            <KeyIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          </div>
        </div>
      </div>

      <input type="hidden" name="redirectTo" value={callbackUrl} />

      <SubmitButton />

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-3 text-red-600">
          <ExclamationCircleIcon className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{errorMessage}</p>
        </div>
      )}
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="w-full justify-center" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign in'}
      <ArrowRightIcon className="ml-2 h-5 w-5" />
    </Button>
  );
}

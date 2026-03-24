'use client';

import { lusitana } from '@/app/ui/fonts';
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
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
        <h1 className={`${lusitana.className} mb-3 text-2xl`}>
          Please log in to continue.
        </h1>

        <div className="w-full">
          {/* Email */}
          <div>
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Email
            </label>
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm"
              />
              <AtSymbolIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="mb-3 mt-5 block text-xs font-medium text-gray-900">
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type="password"
                minLength={6}
                required
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm"
              />
              <KeyIcon className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
            </div>
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <SubmitButton />

        {errorMessage && (
          <div className="flex items-center gap-1 text-red-500">
            <ExclamationCircleIcon className="h-5 w-5" />
            <p className="text-sm">{errorMessage}</p>
          </div>
        )}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button className="mt-4 w-full" disabled={pending}>
      {pending ? 'Logging in…' : 'Log in'}
      <ArrowRightIcon className="ml-auto h-5 w-5 text-gray-50" />
    </Button>
  );
}

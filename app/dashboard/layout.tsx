'use client';

import { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import SideNav from '@/app/ui/dashboard/sidenav';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-slate-50 md:flex-row">
      {/* Mobile Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 md:hidden">
        <h1 className="text-lg font-semibold text-slate-900">Tri Dharma</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="rounded-lg p-2 hover:bg-slate-100"
        >
          {sidebarOpen ? (
            <XMarkIcon className="h-6 w-6 text-slate-600" />
          ) : (
            <Bars3Icon className="h-6 w-6 text-slate-600" />
          )}
        </button>
      </div>

      {/* Sidebar - Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-14 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 top-14 left-0 z-50 w-64 border-r border-slate-200 bg-white transition-transform duration-300 md:static md:top-0 md:z-auto md:transform-none ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:block md:h-screen md:w-64 md:flex-shrink-0`}
      >
        <SideNav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto md:h-screen">
        <div className="p-4 md:p-8 lg:p-8">{children}</div>
      </main>
    </div>
  );
}

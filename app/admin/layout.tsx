'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IconButton } from '@/components/ui/IconButton';
import { ToastProvider } from '@/components/ui/Toast';

const navigation = [
  { name: 'Kelola Content', href: '/admin', icon: FileText },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Mobile sidebar overlay */}
        <div
          className={cn(
            'fixed inset-0 z-40 bg-black/50 lg:hidden transition-opacity',
            sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        {/* Sidebar */}
        <aside
          id="admin-sidebar"
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 lg:translate-x-0',
            sidebarOpen ? 'translate-x-0 visible' : '-translate-x-full invisible lg:visible'
          )}
          aria-label="Sidebar"
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Gateplus CMS</span>
              </Link>
              <IconButton
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar"
                title="Close sidebar"
                className="lg:hidden text-gray-400 hover:text-gray-600"
                icon={<ChevronLeft className="h-5 w-5" aria-hidden="true" />}
              />
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5" aria-hidden="true" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
              <Link href="/contents" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors">
                <Settings className="w-5 h-5" />
                Lihat Site Publik
              </Link>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="lg:pl-64">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6">
              <IconButton
                onClick={() => setSidebarOpen(true)}
                aria-label="Open sidebar"
                title="Open sidebar"
                aria-expanded={sidebarOpen}
                aria-controls="admin-sidebar"
                className="lg:hidden text-gray-400 hover:text-gray-600"
                icon={<ChevronRight className="h-5 w-5" aria-hidden="true" />}
              />
              <div className="flex-1 lg:flex-none">
                <h1 className="text-xl font-semibold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ToastProvider>
  );
}
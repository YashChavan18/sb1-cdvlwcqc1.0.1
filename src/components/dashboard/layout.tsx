import { ReactNode } from 'react';
import { SidebarNav } from './sidebar-nav';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardLayoutProps {
  children: ReactNode;
  userType: 'organization' | 'educator';
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white">
        <div className="flex h-16 items-center px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold">EduConnect</span>
          </Link>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 w-64 h-[calc(100vh-4rem)] border-r bg-white p-4">
          <SidebarNav userType={userType} />
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-64">
          <div className="container p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
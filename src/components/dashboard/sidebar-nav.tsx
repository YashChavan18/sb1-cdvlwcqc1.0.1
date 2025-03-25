import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  UserCircle,
  FileText,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Briefcase,
  GraduationCap,
  Users,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/lib/store';

interface SidebarNavProps {
  userType: 'organization' | 'educator';
}

export function SidebarNav({ userType }: SidebarNavProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const organizationLinks = [
    {
      title: 'Overview',
      href: '/organization/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      href: '/organization/dashboard/profile',
      icon: UserCircle,
    },
    {
      title: 'Post Requirements',
      href: '/organization/dashboard/requirements',
      icon: FileText,
    },
    {
      title: 'Active Sessions',
      href: '/organization/dashboard/sessions',
      icon: Calendar,
    },
    {
      title: 'Find Educators',
      href: '/organization/dashboard/educators',
      icon: Users,
    },
    {
      title: 'Messages',
      href: '/organization/dashboard/messages',
      icon: MessageSquare,
    },
    {
      title: 'Settings',
      href: '/organization/dashboard/settings',
      icon: Settings,
    },
  ];

  const educatorLinks = [
    {
      title: 'Overview',
      href: '/educator/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      href: '/educator/dashboard/profile',
      icon: UserCircle,
    },
    {
      title: 'Teaching Sessions',
      href: '/educator/dashboard/sessions',
      icon: GraduationCap,
    },
    {
      title: 'Available Opportunities',
      href: '/educator/dashboard/opportunities',
      icon: Briefcase,
    },
    {
      title: 'Messages',
      href: '/educator/dashboard/messages',
      icon: MessageSquare,
    },
    {
      title: 'Settings',
      href: '/educator/dashboard/settings',
      icon: Settings,
    },
  ];

  const links = userType === 'organization' ? organizationLinks : educatorLinks;

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className="space-y-2">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              'flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900',
              location.pathname === link.href ? 'bg-gray-100 text-gray-900' : ''
            )}
          >
            <Icon className="h-4 w-4" />
            {link.title}
          </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-red-500 transition-all hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </nav>
  );
}
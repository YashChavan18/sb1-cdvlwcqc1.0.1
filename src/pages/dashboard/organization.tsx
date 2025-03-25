import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Loader2, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { DashboardLayout } from '@/components/dashboard/layout';

interface OrganizationProfile {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
}

export function OrganizationDashboard() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<OrganizationProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('organization_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <DashboardLayout userType="organization">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="organization">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Organization Dashboard</h1>
          {profile && !isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
        
        <div className="mt-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="md:col-span-1">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
              <p className="mt-1 text-sm text-gray-500">
                This information will be displayed publicly.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {isEditing && profile ? (
                <ProfileForm
                  type="organization"
                  initialData={profile}
                  onUpdate={() => {
                    loadProfile();
                    setIsEditing(false);
                  }}
                />
              ) : profile ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Organization Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{profile.name || 'Not set'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Description</h4>
                    <p className="mt-1 text-sm text-gray-900">{profile.description || 'Not set'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Website</h4>
                    <p className="mt-1 text-sm text-gray-900">
                      {profile.website ? (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-500"
                        >
                          {profile.website}
                        </a>
                      ) : (
                        'Not set'
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-gray-500 mb-4">No profile found. Let's create one!</p>
                  <Button onClick={() => setIsEditing(true)}>Create Profile</Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
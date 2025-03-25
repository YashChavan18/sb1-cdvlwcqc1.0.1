import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/lib/store';
import { Loader2, PencilIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileForm } from '@/components/dashboard/profile-form';
import { DashboardLayout } from '@/components/dashboard/layout';

interface EducatorProfile {
  id: string;
  full_name: string;
  bio: string | null;
  expertise: string[];
  qualifications: string[];
}

export function EducatorDashboard() {
  const user = useAuthStore((state) => state.user);
  const [profile, setProfile] = useState<EducatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('educator_profiles')
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
      <DashboardLayout userType="educator">
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="educator">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Educator Dashboard</h1>
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
                This information will be displayed to organizations.
              </p>
            </div>
            <div className="mt-5 md:mt-0 md:col-span-2">
              {isEditing && profile ? (
                <ProfileForm
                  type="educator"
                  initialData={profile}
                  onUpdate={() => {
                    loadProfile();
                    setIsEditing(false);
                  }}
                />
              ) : profile ? (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                    <p className="mt-1 text-sm text-gray-900">{profile.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Bio</h4>
                    <p className="mt-1 text-sm text-gray-900">{profile.bio || 'Not set'}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Expertise</h4>
                    <div className="mt-1">
                      {profile.expertise && profile.expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.expertise.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No expertise listed</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Qualifications</h4>
                    <div className="mt-1">
                      {profile.qualifications && profile.qualifications.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {profile.qualifications.map((item, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500">No qualifications listed</p>
                      )}
                    </div>
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
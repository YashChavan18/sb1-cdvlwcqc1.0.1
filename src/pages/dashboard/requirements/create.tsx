import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { DashboardLayout } from '@/components/dashboard/layout';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  subject_area: z.string().min(1, 'Subject area is required'),
  required_expertise: z.string().min(1, 'Required expertise is required'),
  duration: z.string().min(1, 'Duration is required'),
  budget_range: z.string().min(1, 'Budget range is required'),
  location_type: z.enum(['remote', 'in-person', 'hybrid']),
  location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateRequirement() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user) {
      setError('You must be logged in to create a requirement');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { error: submitError } = await supabase.from('teaching_requirements').insert([
        {
          ...data,
          organization_id: user.id,
          required_expertise: data.required_expertise.split(',').map(item => item.trim()),
        },
      ]);

      if (submitError) throw submitError;
      navigate('/organization/dashboard/requirements');
    } catch (err) {
      console.error('Error creating requirement:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while creating the requirement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout userType="organization">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Post New Requirement</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white shadow rounded-lg p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              {...register('title')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject_area" className="block text-sm font-medium text-gray-700">
              Subject Area
            </label>
            <input
              type="text"
              {...register('subject_area')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.subject_area && (
              <p className="mt-1 text-sm text-red-600">{errors.subject_area.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="required_expertise" className="block text-sm font-medium text-gray-700">
              Required Expertise (comma-separated)
            </label>
            <input
              type="text"
              {...register('required_expertise')}
              placeholder="e.g., Python, Machine Learning, Data Science"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.required_expertise && (
              <p className="mt-1 text-sm text-red-600">{errors.required_expertise.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">
              Duration
            </label>
            <input
              type="text"
              {...register('duration')}
              placeholder="e.g., 3 months, 6 weeks"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600">{errors.duration.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700">
              Budget Range
            </label>
            <input
              type="text"
              {...register('budget_range')}
              placeholder="e.g., $1000-$2000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.budget_range && (
              <p className="mt-1 text-sm text-red-600">{errors.budget_range.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location_type" className="block text-sm font-medium text-gray-700">
              Location Type
            </label>
            <select
              {...register('location_type')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="remote">Remote</option>
              <option value="in-person">In-person</option>
              <option value="hybrid">Hybrid</option>
            </select>
            {errors.location_type && (
              <p className="mt-1 text-sm text-red-600">{errors.location_type.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">
              Location (if in-person or hybrid)
            </label>
            <input
              type="text"
              {...register('location')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/organization/dashboard/requirements')}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Requirement'
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
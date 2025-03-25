import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  type: 'signin' | 'signup';
  userType: 'organization' | 'educator';
}

export function AuthForm({ type, userType }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (type === 'signup') {
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              user_type: userType,
            },
          },
        });

        if (signUpError) throw signUpError;

        // Create profile after successful signup
        if (signUpData.user) {
          if (userType === 'organization') {
            const { error: profileError } = await supabase
              .from('organization_profiles')
              .insert([
                {
                  id: signUpData.user.id,
                  name: '',
                  description: '',
                  website: '',
                },
              ]);
            if (profileError) throw profileError;
          } else {
            const { error: profileError } = await supabase
              .from('educator_profiles')
              .insert([
                {
                  id: signUpData.user.id,
                  full_name: '',
                  bio: '',
                  expertise: [],
                  qualifications: [],
                },
              ]);
            if (profileError) throw profileError;
          }
        }

        navigate(`/${userType}/dashboard`);
      } else {
        const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) throw signInError;

        // Check user type and redirect accordingly
        const userMetadata = signInData.user?.user_metadata;
        const storedUserType = userMetadata?.user_type;

        if (storedUserType !== userType) {
          throw new Error(`Invalid account type. Please sign in as a ${storedUserType}.`);
        }

        navigate(`/${userType}/dashboard`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('email')}
            type="email"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="you@example.com"
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <div className="mt-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            {...register('password')}
            type="password"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="text-sm text-red-600">{error}</div>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Please wait
          </>
        ) : type === 'signin' ? (
          'Sign In'
        ) : (
          'Sign Up'
        )}
      </Button>
    </form>
  );
}
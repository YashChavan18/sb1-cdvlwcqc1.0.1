import { Link, useParams, Navigate } from 'react-router-dom';
import { AuthForm } from '@/components/auth/auth-form';
import { BookOpen } from 'lucide-react';
import { useAuthStore } from '@/lib/store';

export function SignUpPage() {
  const { type } = useParams();
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const isValidType = type === 'organization' || type === 'educator';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Link to="/" className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">EduConnect</span>
          </Link>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/sign-in" className="font-medium text-blue-600 hover:text-blue-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex justify-center space-x-4 mb-8">
            <Link
              to="/auth/sign-up/organization"
              className={`px-4 py-2 border rounded-md hover:bg-gray-50 ${
                type === 'organization' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
              }`}
            >
              Organization
            </Link>
            <Link
              to="/auth/sign-up/educator"
              className={`px-4 py-2 border rounded-md hover:bg-gray-50 ${
                type === 'educator' ? 'bg-blue-50 border-blue-500 text-blue-700' : ''
              }`}
            >
              Educator
            </Link>
          </div>
          {isValidType ? (
            <AuthForm type="signup" userType={type} />
          ) : (
            <div className="text-center text-gray-600">
              Please select whether you're an organization or educator to continue.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './components/layout/navbar';
import { Hero } from './components/home/hero';
import { Features } from './components/home/features';
import { HowItWorks } from './components/home/how-it-works';
import { Stats } from './components/home/stats';
import { Testimonials } from './components/home/testimonials';
import { Footer } from './components/layout/footer';
import { SignInPage } from './pages/auth/sign-in';
import { SignUpPage } from './pages/auth/sign-up';
import { OrganizationDashboard } from './pages/dashboard/organization';
import { EducatorDashboard } from './pages/dashboard/educator';
import { RequirementsList } from './pages/dashboard/requirements/list';
import { CreateRequirement } from './pages/dashboard/requirements/create';
import { supabase } from './lib/supabase';
import { useAuthStore } from './lib/store';

function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  
  if (!user) {
    return <Navigate to="/auth/sign-in" replace />;
  }
  
  return <>{children}</>;
}

function App() {
  const setUser = useAuthStore((state) => state.setUser);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth">
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-in/:type" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
            <Route path="sign-up/:type" element={<SignUpPage />} />
          </Route>
          <Route
            path="/organization/dashboard"
            element={
              <ProtectedRoute>
                <OrganizationDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization/dashboard/requirements"
            element={
              <ProtectedRoute>
                <RequirementsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/organization/dashboard/requirements/create"
            element={
              <ProtectedRoute>
                <CreateRequirement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/educator/dashboard/*"
            element={
              <ProtectedRoute>
                <EducatorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
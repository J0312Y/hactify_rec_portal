import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LandingPage from './pages/LandingPage';
import CandidateAuth from './pages/CandidateAuth';
import RecruiterAuth from './pages/RecruiterAuth';
import ProfileSetup from './pages/candidate/ProfileSetup';
import RecruiterProfileSetup from './pages/recruiter/RecruiterProfileSetup';
import CandidateDashboard from './pages/candidate/CandidateDashboard';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, userRole, loading } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'candidate' | 'recruiter' | null>(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  useEffect(() => {
    if (user && userRole) {
      checkProfile();
    } else {
      setCheckingProfile(false);
    }
  }, [user, userRole]);

  const checkProfile = async () => {
    if (!user || !userRole) return;

    try {
      if (userRole.role === 'candidate') {
        const { data, error } = await supabase
          .from('candidate_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setHasProfile(!!data);
      } else if (userRole.role === 'recruiter') {
        const { data, error } = await supabase
          .from('recruiter_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;
        setHasProfile(!!data);
      }
    } catch (err) {
      console.error('Error checking profile:', err);
    } finally {
      setCheckingProfile(false);
    }
  };

  if (loading || checkingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    if (selectedRole === 'candidate') {
      return <CandidateAuth onBack={() => setSelectedRole(null)} />;
    }
    if (selectedRole === 'recruiter') {
      return <RecruiterAuth onBack={() => setSelectedRole(null)} />;
    }
    return <LandingPage onSelectRole={setSelectedRole} />;
  }

  if (userRole && !hasProfile) {
    if (userRole.role === 'candidate') {
      return <ProfileSetup onComplete={() => setHasProfile(true)} />;
    }
    if (userRole.role === 'recruiter') {
      return <RecruiterProfileSetup onComplete={() => setHasProfile(true)} />;
    }
  }

  if (userRole?.role === 'candidate') {
    return <CandidateDashboard />;
  }

  if (userRole?.role === 'recruiter') {
    return <RecruiterDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
      <div className="text-slate-600">Something went wrong. Please try again.</div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

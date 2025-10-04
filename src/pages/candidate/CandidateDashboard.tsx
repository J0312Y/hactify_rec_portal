import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, CandidateProfile, Application, Job } from '../../lib/supabase';
import { Briefcase, LogOut, User, Search, BarChart3, FileText } from 'lucide-react';
import JobBrowser from './JobBrowser';
import ApplicationsView from './ApplicationsView';
import AnalyticsView from './AnalyticsView';
import ProfileView from './ProfileView';

export default function CandidateDashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'browse' | 'applications' | 'analytics' | 'profile'>('browse');
  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-slate-800">TalentHub</span>
              <span className="text-sm text-slate-500">Candidate</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{profile?.full_name || 'Candidate'}</span>
              <button
                onClick={signOut}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'browse'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Search className="w-5 h-5" />
              Browse Jobs
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'applications'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <FileText className="w-5 h-5" />
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'profile'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <User className="w-5 h-5" />
              Profile
            </button>
          </div>
        </div>

        {activeTab === 'browse' && <JobBrowser profile={profile!} />}
        {activeTab === 'applications' && <ApplicationsView profile={profile!} />}
        {activeTab === 'analytics' && <AnalyticsView profile={profile!} />}
        {activeTab === 'profile' && <ProfileView profile={profile!} onUpdate={fetchProfile} />}
      </div>
    </div>
  );
}

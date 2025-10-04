import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase, RecruiterProfile } from '../../lib/supabase';
import { Briefcase, LogOut, Plus, Search, BarChart3, Building2 } from 'lucide-react';
import JobManagement from './JobManagement';
import CandidateSearch from './CandidateSearch';
import RecruiterAnalytics from './RecruiterAnalytics';
import CompanyProfile from './CompanyProfile';

export default function RecruiterDashboard() {
  const { signOut, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'jobs' | 'candidates' | 'analytics' | 'profile'>('jobs');
  const [profile, setProfile] = useState<RecruiterProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('recruiter_profiles')
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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-600" />
              <span className="text-xl font-bold text-slate-800">TalentHub</span>
              <span className="text-sm text-slate-500">Recruiter</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-600">{profile?.company_name || 'Recruiter'}</span>
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
              onClick={() => setActiveTab('jobs')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'jobs'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Plus className="w-5 h-5" />
              Job Management
            </button>
            <button
              onClick={() => setActiveTab('candidates')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'candidates'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Search className="w-5 h-5" />
              Find Candidates
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
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
                  ? 'text-emerald-600 border-b-2 border-emerald-600'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Building2 className="w-5 h-5" />
              Company Profile
            </button>
          </div>
        </div>

        {activeTab === 'jobs' && <JobManagement profile={profile!} />}
        {activeTab === 'candidates' && <CandidateSearch profile={profile!} />}
        {activeTab === 'analytics' && <RecruiterAnalytics profile={profile!} />}
        {activeTab === 'profile' && <CompanyProfile profile={profile!} onUpdate={fetchProfile} />}
      </div>
    </div>
  );
}

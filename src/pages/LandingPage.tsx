import { Briefcase, CircleUser as UserCircle, Building2, Search, TrendingUp, Users } from 'lucide-react';

interface LandingPageProps {
  onSelectRole: (role: 'candidate' | 'recruiter') => void;
}

export default function LandingPage({ onSelectRole }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-800">TalentHub</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Connect Talent with
            <span className="text-blue-600"> Opportunity</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A modern job portal bringing together exceptional candidates and forward-thinking companies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
          <div
            onClick={() => onSelectRole('candidate')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
              <UserCircle className="w-8 h-8 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">I'm a Candidate</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Create your professional portfolio, discover exciting opportunities, and track your applications with powerful analytics
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Build comprehensive portfolio
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Apply to curated job listings
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                Track application status
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                View skill match analytics
              </li>
            </ul>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              Get Started as Candidate
            </button>
          </div>

          <div
            onClick={() => onSelectRole('recruiter')}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-emerald-500 transform hover:-translate-y-1"
          >
            <div className="bg-emerald-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
              <Building2 className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-4">I'm a Recruiter</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Post job openings, discover qualified candidates, and manage applications with intelligent matching
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                Post unlimited job listings
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                Search qualified candidates
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                Manage applications efficiently
              </li>
              <li className="flex items-center gap-2 text-slate-700">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-600"></div>
                Access candidate analytics
              </li>
            </ul>
            <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors">
              Get Started as Recruiter
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Smart Matching</h3>
            <p className="text-slate-600">
              AI-powered skill matching connects the right talent with perfect opportunities
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Analytics Dashboard</h3>
            <p className="text-slate-600">
              Comprehensive insights into applications, skills, and hiring trends
            </p>
          </div>
          <div className="text-center">
            <div className="bg-white w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-md">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Easy Management</h3>
            <p className="text-slate-600">
              Streamlined interface for managing profiles, jobs, and applications
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2025 TalentHub. Connecting talent with opportunity.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

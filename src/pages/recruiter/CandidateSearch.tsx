import { useState, useEffect } from 'react';
import { supabase, RecruiterProfile, CandidateProfile } from '../../lib/supabase';
import { Search, MapPin, Briefcase, Mail, ExternalLink, Github, Linkedin, Link as LinkIcon } from 'lucide-react';

interface CandidateSearchProps {
  profile: RecruiterProfile;
}

export default function CandidateSearch({ profile }: CandidateSearchProps) {
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<CandidateProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [experienceFilter, setExperienceFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidates();
  }, []);

  useEffect(() => {
    filterCandidates();
  }, [searchTerm, experienceFilter, candidates]);

  const fetchCandidates = async () => {
    try {
      const { data, error } = await supabase
        .from('candidate_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);
      setFilteredCandidates(data || []);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterCandidates = () => {
    let filtered = [...candidates];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (candidate) =>
          candidate.full_name.toLowerCase().includes(term) ||
          candidate.title.toLowerCase().includes(term) ||
          candidate.location.toLowerCase().includes(term) ||
          candidate.bio.toLowerCase().includes(term) ||
          candidate.skills.some((skill) => skill.toLowerCase().includes(term))
      );
    }

    if (experienceFilter) {
      const minExp = parseInt(experienceFilter);
      filtered = filtered.filter((candidate) => candidate.experience_years >= minExp);
    }

    setFilteredCandidates(filtered);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading candidates...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, skills, title, location..."
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <select
            value={experienceFilter}
            onChange={(e) => setExperienceFilter(e.target.value)}
            className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="">All Experience Levels</option>
            <option value="0">0+ years</option>
            <option value="1">1+ years</option>
            <option value="2">2+ years</option>
            <option value="3">3+ years</option>
            <option value="5">5+ years</option>
            <option value="10">10+ years</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing {filteredCandidates.length} of {candidates.length} candidates
        </div>
      </div>

      <div className="grid gap-6">
        {filteredCandidates.map((candidate) => (
          <div key={candidate.id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">{candidate.full_name}</h3>
                <p className="text-lg text-emerald-600 mb-2">{candidate.title}</p>
                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                  {candidate.email && (
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {candidate.email}
                    </div>
                  )}
                  {candidate.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {candidate.location}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Briefcase className="w-4 h-4" />
                    {candidate.experience_years} years experience
                  </div>
                </div>
              </div>
            </div>

            {candidate.bio && (
              <p className="text-slate-700 mb-4">{candidate.bio}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-4">
              {candidate.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>

            {(candidate.resume_url || candidate.portfolio_url || candidate.linkedin_url || candidate.github_url) && (
              <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
                {candidate.resume_url && (
                  <a
                    href={candidate.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Resume
                  </a>
                )}
                {candidate.portfolio_url && (
                  <a
                    href={candidate.portfolio_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <LinkIcon className="w-4 h-4" />
                    Portfolio
                  </a>
                )}
                {candidate.linkedin_url && (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                {candidate.github_url && (
                  <a
                    href={candidate.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredCandidates.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-600">No candidates found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}

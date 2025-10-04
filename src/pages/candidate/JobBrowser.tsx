import { useState, useEffect } from 'react';
import { supabase, Job, CandidateProfile, RecruiterProfile } from '../../lib/supabase';
import { MapPin, Briefcase, DollarSign, Clock, Search, CheckCircle } from 'lucide-react';

interface JobBrowserProps {
  profile: CandidateProfile;
}

interface JobWithRecruiter extends Job {
  recruiter_profiles?: RecruiterProfile;
}

export default function JobBrowser({ profile }: JobBrowserProps) {
  const [jobs, setJobs] = useState<JobWithRecruiter[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<JobWithRecruiter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<JobWithRecruiter | null>(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedJobs, setAppliedJobs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.required_skills.some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobs);
    }
  }, [searchTerm, jobs]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          recruiter_profiles (*)
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
      setFilteredJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('job_id')
        .eq('candidate_id', profile.id);

      if (error) throw error;
      setAppliedJobs(new Set(data?.map((app) => app.job_id) || []));
    } catch (err) {
      console.error('Error fetching applied jobs:', err);
    }
  };

  const handleApply = async () => {
    if (!selectedJob) return;

    setApplying(true);
    try {
      const { error } = await supabase.from('applications').insert({
        job_id: selectedJob.id,
        candidate_id: profile.id,
        cover_letter: coverLetter,
        status: 'pending',
      });

      if (error) throw error;

      setAppliedJobs(new Set([...appliedJobs, selectedJob.id]));
      setSelectedJob(null);
      setCoverLetter('');
      alert('Application submitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const calculateSkillMatch = (job: Job): number => {
    if (!profile.skills.length || !job.required_skills.length) return 0;
    const matches = job.required_skills.filter((skill) =>
      profile.skills.some((pSkill) => pSkill.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matches.length / job.required_skills.length) * 100);
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading jobs...</div>;
  }

  return (
    <div>
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search jobs by title, skills, location..."
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="grid gap-6">
        {filteredJobs.map((job) => {
          const skillMatch = calculateSkillMatch(job);
          const hasApplied = appliedJobs.has(job.id);

          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{job.title}</h3>
                  <p className="text-slate-600 mb-2">
                    {job.recruiter_profiles?.company_name || 'Company'}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {job.job_type}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.experience_required}+ years
                    </div>
                    {job.salary_min > 0 && (
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-sm font-semibold mb-2 ${
                      skillMatch >= 70
                        ? 'text-green-600'
                        : skillMatch >= 40
                        ? 'text-yellow-600'
                        : 'text-slate-600'
                    }`}
                  >
                    {skillMatch}% Match
                  </div>
                  {hasApplied ? (
                    <div className="flex items-center gap-1 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Applied
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedJob(job)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                    >
                      Apply Now
                    </button>
                  )}
                </div>
              </div>

              <p className="text-slate-700 mb-4 line-clamp-2">{job.description}</p>

              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => {
                  const hasSkill = profile.skills.some(
                    (pSkill) => pSkill.toLowerCase() === skill.toLowerCase()
                  );
                  return (
                    <span
                      key={skill}
                      className={`px-3 py-1 rounded-full text-sm ${
                        hasSkill
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-slate-600">No jobs found matching your search.</p>
          </div>
        )}
      </div>

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Apply to {selectedJob.title}</h2>
            <p className="text-slate-600 mb-6">
              at {selectedJob.recruiter_profiles?.company_name}
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={8}
                placeholder="Tell the recruiter why you're a great fit for this position..."
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleApply}
                disabled={applying}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
              <button
                onClick={() => {
                  setSelectedJob(null);
                  setCoverLetter('');
                }}
                className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

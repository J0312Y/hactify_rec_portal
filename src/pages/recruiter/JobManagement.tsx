import { useState, useEffect } from 'react';
import { supabase, RecruiterProfile, Job, Application, CandidateProfile } from '../../lib/supabase';
import { Plus, MapPin, Briefcase, DollarSign, Clock, X, CreditCard as Edit, Eye, Users, CheckCircle, XCircle } from 'lucide-react';

interface JobManagementProps {
  profile: RecruiterProfile;
}

interface JobWithApplications extends Job {
  applications?: (Application & { candidate_profiles?: CandidateProfile })[];
}

export default function JobManagement({ profile }: JobManagementProps) {
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [loading, setLoading] = useState(true);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobWithApplications | null>(null);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    required_skills: [] as string[],
    location: '',
    job_type: 'Full-time',
    experience_required: 0,
    salary_min: 0,
    salary_max: 0,
    is_active: true,
  });

  useEffect(() => {
    fetchJobs();
  }, [profile]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications (
            *,
            candidate_profiles (*)
          )
        `)
        .eq('recruiter_id', profile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingJob) {
        const { error } = await supabase
          .from('jobs')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingJob.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('jobs').insert({
          recruiter_id: profile.id,
          ...formData,
        });

        if (error) throw error;
      }

      resetForm();
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to save job');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      required_skills: [],
      location: '',
      job_type: 'Full-time',
      experience_required: 0,
      salary_min: 0,
      salary_max: 0,
      is_active: true,
    });
    setShowJobForm(false);
    setEditingJob(null);
    setSkillInput('');
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({
      title: job.title,
      description: job.description,
      required_skills: [...job.required_skills],
      location: job.location,
      job_type: job.job_type,
      experience_required: job.experience_required,
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      is_active: job.is_active,
    });
    setShowJobForm(true);
  };

  const handleToggleActive = async (job: Job) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active: !job.is_active })
        .eq('id', job.id);

      if (error) throw error;
      fetchJobs();
    } catch (err: any) {
      alert(err.message || 'Failed to update job status');
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', applicationId);

      if (error) throw error;
      fetchJobs();
      if (selectedJob) {
        const updatedJob = jobs.find(j => j.id === selectedJob.id);
        if (updatedJob) setSelectedJob(updatedJob);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.required_skills.includes(skillInput.trim())) {
      setFormData({ ...formData, required_skills: [...formData.required_skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, required_skills: formData.required_skills.filter(s => s !== skill) });
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading jobs...</div>;
  }

  if (showJobForm) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            {editingJob ? 'Edit Job' : 'Post New Job'}
          </h2>
          <button onClick={resetForm} className="text-slate-600 hover:text-slate-800">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Job Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={6}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Job Type *</label>
              <select
                value={formData.job_type}
                onChange={(e) => setFormData({ ...formData, job_type: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Freelance</option>
                <option>Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Experience Required (years)</label>
              <input
                type="number"
                min="0"
                value={formData.experience_required}
                onChange={(e) => setFormData({ ...formData, experience_required: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Salary Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={formData.salary_min || ''}
                  onChange={(e) => setFormData({ ...formData, salary_min: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={formData.salary_max || ''}
                  onChange={(e) => setFormData({ ...formData, salary_max: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Required Skills *</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.required_skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-emerald-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="is_active" className="text-sm text-slate-700">
              Job is active and accepting applications
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
            >
              {editingJob ? 'Update Job' : 'Post Job'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-slate-200 text-slate-700 py-3 rounded-lg font-semibold hover:bg-slate-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Your Job Postings</h2>
        <button
          onClick={() => setShowJobForm(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Post New Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-800 mb-2">No Jobs Posted Yet</h3>
          <p className="text-slate-600 mb-6">Start by posting your first job opening</p>
          <button
            onClick={() => setShowJobForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold text-slate-800">{job.title}</h3>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        job.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {job.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
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
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.applications?.length || 0} applicants
                    </div>
                  </div>
                  <p className="text-slate-700 line-clamp-2">{job.description}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(job)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(job)}
                    className={`p-2 rounded-lg transition-colors ${
                      job.is_active
                        ? 'text-slate-600 hover:bg-slate-100'
                        : 'text-green-600 hover:bg-green-50'
                    }`}
                  >
                    {job.is_active ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {job.required_skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{selectedJob.title}</h2>
                <p className="text-slate-600">
                  {selectedJob.applications?.length || 0} Applications
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-slate-600 hover:text-slate-800"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {selectedJob.applications && selectedJob.applications.length > 0 ? (
              <div className="space-y-4">
                {selectedJob.applications.map((application) => {
                  const candidate = application.candidate_profiles;
                  if (!candidate) return null;

                  return (
                    <div key={application.id} className="border border-slate-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-bold text-slate-800">{candidate.full_name}</h4>
                          <p className="text-sm text-slate-600">{candidate.title}</p>
                          <p className="text-sm text-slate-500">{candidate.email}</p>
                        </div>
                        <select
                          value={application.status}
                          onChange={(e) => updateApplicationStatus(application.id, e.target.value)}
                          className="px-3 py-1 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="pending">Pending</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {candidate.skills.map((skill) => (
                          <span
                            key={skill}
                            className={`px-2 py-1 rounded-full text-xs ${
                              selectedJob.required_skills.includes(skill)
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {application.cover_letter && (
                        <div className="bg-slate-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-slate-700 mb-1">Cover Letter:</p>
                          <p className="text-sm text-slate-600">{application.cover_letter}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">
                No applications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

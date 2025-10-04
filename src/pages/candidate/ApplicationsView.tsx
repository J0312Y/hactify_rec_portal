import { useState, useEffect } from 'react';
import { supabase, CandidateProfile, Application, Job, RecruiterProfile } from '../../lib/supabase';
import { MapPin, Briefcase, Clock, AlertCircle, CheckCircle, XCircle, Eye } from 'lucide-react';

interface ApplicationsViewProps {
  profile: CandidateProfile;
}

interface ApplicationWithJob extends Application {
  jobs?: Job & {
    recruiter_profiles?: RecruiterProfile;
  };
}

export default function ApplicationsView({ profile }: ApplicationsViewProps) {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [profile]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          jobs (
            *,
            recruiter_profiles (*)
          )
        `)
        .eq('candidate_id', profile.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'reviewed':
        return <Eye className="w-5 h-5 text-blue-600" />;
      case 'shortlisted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'reviewed':
        return 'bg-blue-100 text-blue-700';
      case 'shortlisted':
        return 'bg-green-100 text-green-700';
      case 'accepted':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
        <Briefcase className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-800 mb-2">No Applications Yet</h3>
        <p className="text-slate-600">Start applying to jobs to see your applications here</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => {
        const job = application.jobs;
        if (!job) return null;

        return (
          <div key={application.id} className="bg-white rounded-2xl shadow-lg p-6">
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
                </div>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${getStatusColor(application.status)}`}>
                  {getStatusIcon(application.status)}
                  <span className="font-semibold capitalize">{application.status}</span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  Applied {new Date(application.applied_at).toLocaleDateString()}
                </p>
              </div>
            </div>

            {application.cover_letter && (
              <div className="mt-4 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-1">Your Cover Letter:</p>
                <p className="text-slate-600 text-sm">{application.cover_letter}</p>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-2">
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
        );
      })}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { supabase, RecruiterProfile, Job, Application } from '../../lib/supabase';
import { Briefcase, Users, Clock, CheckCircle, BarChart3, TrendingUp } from 'lucide-react';

interface RecruiterAnalyticsProps {
  profile: RecruiterProfile;
}

interface JobWithApplications extends Job {
  applications?: Application[];
}

export default function RecruiterAnalytics({ profile }: RecruiterAnalyticsProps) {
  const [jobs, setJobs] = useState<JobWithApplications[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select(`
          *,
          applications (*)
        `)
        .eq('recruiter_id', profile.id);

      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading analytics...</div>;
  }

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.is_active).length;
  const totalApplications = jobs.reduce((acc, job) => acc + (job.applications?.length || 0), 0);
  const pendingApplications = jobs.reduce(
    (acc, job) => acc + (job.applications?.filter((a) => a.status === 'pending').length || 0),
    0
  );
  const shortlistedApplications = jobs.reduce(
    (acc, job) => acc + (job.applications?.filter((a) => a.status === 'shortlisted').length || 0),
    0
  );
  const acceptedApplications = jobs.reduce(
    (acc, job) => acc + (job.applications?.filter((a) => a.status === 'accepted').length || 0),
    0
  );

  const jobsWithMostApplications = [...jobs]
    .sort((a, b) => (b.applications?.length || 0) - (a.applications?.length || 0))
    .slice(0, 5);

  const skillDemand = jobs.reduce((acc, job) => {
    job.required_skills.forEach((skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillDemand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Jobs</p>
              <p className="text-2xl font-bold text-slate-800">{totalJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Active Jobs</p>
              <p className="text-2xl font-bold text-slate-800">{activeJobs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Users className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Applications</p>
              <p className="text-2xl font-bold text-slate-800">{totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Accepted</p>
              <p className="text-2xl font-bold text-slate-800">{acceptedApplications}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            Application Status Breakdown
          </h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Pending</span>
                <span className="text-sm font-semibold text-slate-800">{pendingApplications}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full"
                  style={{
                    width: `${totalApplications > 0 ? (pendingApplications / totalApplications) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Shortlisted</span>
                <span className="text-sm font-semibold text-slate-800">{shortlistedApplications}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-emerald-500 h-2 rounded-full"
                  style={{
                    width: `${totalApplications > 0 ? (shortlistedApplications / totalApplications) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Accepted</span>
                <span className="text-sm font-semibold text-slate-800">{acceptedApplications}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{
                    width: `${totalApplications > 0 ? (acceptedApplications / totalApplications) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Jobs by Application Count</h3>
          <div className="space-y-3">
            {jobsWithMostApplications.map((job) => (
              <div key={job.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-slate-800 text-sm">{job.title}</p>
                  <p className="text-xs text-slate-500">{job.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-700">{job.applications?.length || 0}</span>
                </div>
              </div>
            ))}
            {jobsWithMostApplications.length === 0 && (
              <p className="text-sm text-slate-600 text-center py-4">No jobs posted yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Most Requested Skills in Your Jobs</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {topSkills.map(([skill, count]) => (
            <div key={skill} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <span className="font-medium text-slate-700">{skill}</span>
              <span className="text-sm text-slate-600">{count} {count === 1 ? 'job' : 'jobs'}</span>
            </div>
          ))}
          {topSkills.length === 0 && (
            <p className="text-sm text-slate-600 col-span-2 text-center py-4">No skills data available</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Hiring Insights</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Average Applications per Job</p>
            <p className="text-2xl font-bold text-blue-600">
              {totalJobs > 0 ? (totalApplications / totalJobs).toFixed(1) : '0'}
            </p>
          </div>
          <div className="p-4 bg-emerald-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Application Response Rate</p>
            <p className="text-2xl font-bold text-emerald-600">
              {totalApplications > 0
                ? (((totalApplications - pendingApplications) / totalApplications) * 100).toFixed(0)
                : '0'}
              %
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-slate-600 mb-1">Acceptance Rate</p>
            <p className="text-2xl font-bold text-green-600">
              {totalApplications > 0
                ? ((acceptedApplications / totalApplications) * 100).toFixed(0)
                : '0'}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

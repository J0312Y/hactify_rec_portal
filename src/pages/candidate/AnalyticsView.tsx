import { useState, useEffect } from 'react';
import { supabase, CandidateProfile, Application, Job } from '../../lib/supabase';
import { TrendingUp, Briefcase, Clock, CheckCircle, BarChart3 } from 'lucide-react';

interface AnalyticsViewProps {
  profile: CandidateProfile;
}

interface ApplicationWithJob extends Application {
  jobs?: Job;
}

export default function AnalyticsView({ profile }: AnalyticsViewProps) {
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [profile]);

  const fetchData = async () => {
    try {
      const [applicationsRes, jobsRes] = await Promise.all([
        supabase
          .from('applications')
          .select('*, jobs (*)')
          .eq('candidate_id', profile.id),
        supabase
          .from('jobs')
          .select('*')
          .eq('is_active', true),
      ]);

      if (applicationsRes.error) throw applicationsRes.error;
      if (jobsRes.error) throw jobsRes.error;

      setApplications(applicationsRes.data || []);
      setJobs(jobsRes.data || []);
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-slate-600">Loading analytics...</div>;
  }

  const totalApplications = applications.length;
  const pendingApplications = applications.filter((a) => a.status === 'pending').length;
  const reviewedApplications = applications.filter((a) => a.status === 'reviewed').length;
  const shortlistedApplications = applications.filter((a) => a.status === 'shortlisted').length;
  const acceptedApplications = applications.filter((a) => a.status === 'accepted').length;
  const rejectedApplications = applications.filter((a) => a.status === 'rejected').length;

  const successRate =
    totalApplications > 0
      ? Math.round(((acceptedApplications + shortlistedApplications) / totalApplications) * 100)
      : 0;

  const skillDemand = jobs.reduce((acc, job) => {
    job.required_skills.forEach((skill) => {
      acc[skill] = (acc[skill] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillDemand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const matchedSkills = profile.skills.filter((skill) =>
    Object.keys(skillDemand).some((s) => s.toLowerCase() === skill.toLowerCase())
  );

  const missingSkills = topSkills
    .filter(
      ([skill]) =>
        !profile.skills.some((s) => s.toLowerCase() === skill.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Applications</p>
              <p className="text-2xl font-bold text-slate-800">{totalApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Pending</p>
              <p className="text-2xl font-bold text-slate-800">{pendingApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Accepted</p>
              <p className="text-2xl font-bold text-slate-800">{acceptedApplications}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-emerald-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Success Rate</p>
              <p className="text-2xl font-bold text-slate-800">{successRate}%</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
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
                <span className="text-sm text-slate-600">Reviewed</span>
                <span className="text-sm font-semibold text-slate-800">{reviewedApplications}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${totalApplications > 0 ? (reviewedApplications / totalApplications) * 100 : 0}%`,
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
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-slate-600">Rejected</span>
                <span className="text-sm font-semibold text-slate-800">{rejectedApplications}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full"
                  style={{
                    width: `${totalApplications > 0 ? (rejectedApplications / totalApplications) * 100 : 0}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Skill Match Analysis</h3>
          <div className="mb-4">
            <p className="text-sm text-slate-600 mb-2">
              Your skills match <span className="font-semibold text-blue-600">{matchedSkills.length}</span> out of{' '}
              <span className="font-semibold">{profile.skills.length}</span> with market demand
            </p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{
                  width: `${profile.skills.length > 0 ? (matchedSkills.length / profile.skills.length) * 100 : 0}%`,
                }}
              ></div>
            </div>
          </div>

          {missingSkills.length > 0 && (
            <div>
              <p className="text-sm font-medium text-slate-700 mb-2">Top In-Demand Skills to Learn:</p>
              <div className="space-y-2">
                {missingSkills.map(([skill, count]) => (
                  <div key={skill} className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">{skill}</span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-full">
                      {count} jobs
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Top In-Demand Skills</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {topSkills.map(([skill, count]) => {
            const hasSkill = profile.skills.some(
              (s) => s.toLowerCase() === skill.toLowerCase()
            );
            return (
              <div key={skill} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className={`font-medium ${hasSkill ? 'text-green-700' : 'text-slate-700'}`}>
                  {skill} {hasSkill && '✓'}
                </span>
                <span className="text-sm text-slate-600">{count} jobs</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

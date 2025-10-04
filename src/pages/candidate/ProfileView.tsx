import { useState } from 'react';
import { supabase, CandidateProfile } from '../../lib/supabase';
import { CreditCard as Edit, Save, X, Plus, Mail, Phone, MapPin, Briefcase, Link, Github, Linkedin } from 'lucide-react';

interface ProfileViewProps {
  profile: CandidateProfile;
  onUpdate: () => void;
}

export default function ProfileView({ profile, onUpdate }: ProfileViewProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    location: profile.location,
    title: profile.title,
    bio: profile.bio,
    skills: [...profile.skills],
    experience_years: profile.experience_years,
    resume_url: profile.resume_url,
    portfolio_url: profile.portfolio_url,
    linkedin_url: profile.linkedin_url,
    github_url: profile.github_url,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('candidate_profiles')
        .update({
          ...formData,
          updated_at: new Date().toISOString(),
        })
        .eq('id', profile.id);

      if (error) throw error;
      setEditing(false);
      onUpdate();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput.trim()] });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({ ...formData, skills: formData.skills.filter((s) => s !== skill) });
  };

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Profile</h2>
          <button
            onClick={() => {
              setEditing(false);
              setFormData({
                full_name: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                location: profile.location,
                title: profile.title,
                bio: profile.bio,
                skills: [...profile.skills],
                experience_years: profile.experience_years,
                resume_url: profile.resume_url,
                portfolio_url: profile.portfolio_url,
                linkedin_url: profile.linkedin_url,
                github_url: profile.github_url,
              });
            }}
            className="text-slate-600 hover:text-slate-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Professional Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Years of Experience</label>
            <input
              type="number"
              min="0"
              value={formData.experience_years}
              onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Skills</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type a skill and press Enter"
              />
              <button
                type="button"
                onClick={addSkill}
                className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Resume URL</label>
              <input
                type="url"
                value={formData.resume_url}
                onChange={(e) => setFormData({ ...formData, resume_url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Portfolio URL</label>
              <input
                type="url"
                value={formData.portfolio_url}
                onChange={(e) => setFormData({ ...formData, portfolio_url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">GitHub URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Your Profile</h2>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{profile.full_name}</h3>
          <p className="text-lg text-blue-600 mb-4">{profile.title}</p>
          <div className="grid md:grid-cols-2 gap-4 text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              {profile.email}
            </div>
            {profile.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {profile.phone}
              </div>
            )}
            {profile.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {profile.location}
              </div>
            )}
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              {profile.experience_years} years experience
            </div>
          </div>
        </div>

        {profile.bio && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">About</h4>
            <p className="text-slate-600">{profile.bio}</p>
          </div>
        )}

        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Skills</h4>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill) => (
              <span key={skill} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {(profile.resume_url || profile.portfolio_url || profile.linkedin_url || profile.github_url) && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Links</h4>
            <div className="space-y-2">
              {profile.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Link className="w-5 h-5" />
                  Resume
                </a>
              )}
              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Link className="w-5 h-5" />
                  Portfolio
                </a>
              )}
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Linkedin className="w-5 h-5" />
                  LinkedIn
                </a>
              )}
              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                  <Github className="w-5 h-5" />
                  GitHub
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

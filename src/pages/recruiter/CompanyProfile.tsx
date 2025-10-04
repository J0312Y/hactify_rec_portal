import { useState } from 'react';
import { supabase, RecruiterProfile } from '../../lib/supabase';
import { CreditCard as Edit, Save, X, Mail, Phone, Building2, Link, FileText } from 'lucide-react';

interface CompanyProfileProps {
  profile: RecruiterProfile;
  onUpdate: () => void;
}

export default function CompanyProfile({ profile, onUpdate }: CompanyProfileProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile.full_name,
    email: profile.email,
    phone: profile.phone,
    company_name: profile.company_name,
    company_website: profile.company_website,
    company_description: profile.company_description,
    company_logo_url: profile.company_logo_url,
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('recruiter_profiles')
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

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Edit Company Profile</h2>
          <button
            onClick={() => {
              setEditing(false);
              setFormData({
                full_name: profile.full_name,
                email: profile.email,
                phone: profile.phone,
                company_name: profile.company_name,
                company_website: profile.company_website,
                company_description: profile.company_description,
                company_logo_url: profile.company_logo_url,
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Website</label>
            <input
              type="url"
              value={formData.company_website}
              onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo URL</label>
            <input
              type="url"
              value={formData.company_logo_url}
              onChange={(e) => setFormData({ ...formData, company_logo_url: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Description</label>
            <textarea
              value={formData.company_description}
              onChange={(e) => setFormData({ ...formData, company_description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              rows={4}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
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
        <h2 className="text-2xl font-bold text-slate-800">Company Profile</h2>
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          <Edit className="w-5 h-5" />
          Edit Profile
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold text-slate-800">{profile.company_name}</h3>
          <p className="text-lg text-emerald-600 mb-4">{profile.full_name}</p>
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
            {profile.company_website && (
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5" />
                <a
                  href={profile.company_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700"
                >
                  {profile.company_website}
                </a>
              </div>
            )}
          </div>
        </div>

        {profile.company_description && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              About the Company
            </h4>
            <p className="text-slate-600">{profile.company_description}</p>
          </div>
        )}

        {profile.company_logo_url && (
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Company Logo</h4>
            <img
              src={profile.company_logo_url}
              alt={`${profile.company_name} logo`}
              className="max-w-xs rounded-lg shadow-md"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

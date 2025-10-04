import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'candidate' | 'recruiter';

export interface UserRoleData {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface CandidateProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  bio: string;
  skills: string[];
  experience_years: number;
  resume_url: string;
  portfolio_url: string;
  linkedin_url: string;
  github_url: string;
  created_at: string;
  updated_at: string;
}

export interface RecruiterProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  company_name: string;
  company_website: string;
  company_description: string;
  company_logo_url: string;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  recruiter_id: string;
  title: string;
  description: string;
  required_skills: string[];
  location: string;
  job_type: string;
  experience_required: number;
  salary_min: number;
  salary_max: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'accepted';
  cover_letter: string;
  applied_at: string;
  updated_at: string;
}

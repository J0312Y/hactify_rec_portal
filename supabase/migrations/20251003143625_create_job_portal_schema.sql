/*
  # Job Portal Database Schema

  ## Overview
  This migration creates the complete database schema for a Job Portal application
  with separate candidate and recruiter functionality.

  ## New Tables

  ### 1. `user_roles`
  Stores user type information (candidate or recruiter)
  - `id` (uuid, primary key) - User ID from auth.users
  - `email` (text) - User email
  - `role` (text) - Either 'candidate' or 'recruiter'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. `candidate_profiles`
  Stores candidate portfolio and personal information
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References auth.users
  - `full_name` (text) - Candidate's full name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `location` (text) - Current location
  - `title` (text) - Professional title (e.g., "Full Stack Developer")
  - `bio` (text) - Professional summary/bio
  - `skills` (text[]) - Array of skills
  - `experience_years` (integer) - Years of experience
  - `resume_url` (text) - URL to uploaded resume
  - `portfolio_url` (text) - Portfolio website URL
  - `linkedin_url` (text) - LinkedIn profile URL
  - `github_url` (text) - GitHub profile URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 3. `recruiter_profiles`
  Stores recruiter and company information
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References auth.users
  - `full_name` (text) - Recruiter's full name
  - `email` (text) - Contact email
  - `phone` (text) - Contact phone number
  - `company_name` (text) - Company name
  - `company_website` (text) - Company website URL
  - `company_description` (text) - About the company
  - `company_logo_url` (text) - Company logo URL
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 4. `jobs`
  Stores job postings created by recruiters
  - `id` (uuid, primary key)
  - `recruiter_id` (uuid, foreign key) - References recruiter_profiles
  - `title` (text) - Job title
  - `description` (text) - Detailed job description
  - `required_skills` (text[]) - Array of required skills
  - `location` (text) - Job location
  - `job_type` (text) - Full-time, Part-time, Contract, etc.
  - `experience_required` (integer) - Minimum years of experience
  - `salary_min` (integer) - Minimum salary
  - `salary_max` (integer) - Maximum salary
  - `is_active` (boolean) - Whether job is still accepting applications
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 5. `applications`
  Stores job applications from candidates
  - `id` (uuid, primary key)
  - `job_id` (uuid, foreign key) - References jobs
  - `candidate_id` (uuid, foreign key) - References candidate_profiles
  - `status` (text) - Application status: pending, reviewed, shortlisted, rejected, accepted
  - `cover_letter` (text) - Optional cover letter
  - `applied_at` (timestamptz) - Application timestamp
  - `updated_at` (timestamptz) - Last status update

  ## Security
  
  All tables have Row Level Security (RLS) enabled with appropriate policies:
  - Candidates can read/write their own profiles and applications
  - Recruiters can read/write their own profiles and jobs
  - Recruiters can view applications for their jobs
  - Public can view active job listings
  - Candidates can view all active jobs
*/

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL CHECK (role IN ('candidate', 'recruiter')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own role"
  ON user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own role on signup"
  ON user_roles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create candidate_profiles table
CREATE TABLE IF NOT EXISTS candidate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  location text DEFAULT '',
  title text DEFAULT '',
  bio text DEFAULT '',
  skills text[] DEFAULT '{}',
  experience_years integer DEFAULT 0,
  resume_url text DEFAULT '',
  portfolio_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  github_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE candidate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can read own profile"
  ON candidate_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert own profile"
  ON candidate_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Candidates can update own profile"
  ON candidate_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can view candidate profiles"
  ON candidate_profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_roles.id = auth.uid()
      AND user_roles.role = 'recruiter'
    )
  );

-- Create recruiter_profiles table
CREATE TABLE IF NOT EXISTS recruiter_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  company_name text NOT NULL,
  company_website text DEFAULT '',
  company_description text DEFAULT '',
  company_logo_url text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE recruiter_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recruiters can read own profile"
  ON recruiter_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Recruiters can insert own profile"
  ON recruiter_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Recruiters can update own profile"
  ON recruiter_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid NOT NULL REFERENCES recruiter_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  required_skills text[] DEFAULT '{}',
  location text NOT NULL,
  job_type text NOT NULL DEFAULT 'Full-time',
  experience_required integer DEFAULT 0,
  salary_min integer DEFAULT 0,
  salary_max integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active jobs"
  ON jobs FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Recruiters can insert own jobs"
  ON jobs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recruiter_profiles
      WHERE recruiter_profiles.id = recruiter_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update own jobs"
  ON jobs FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recruiter_profiles
      WHERE recruiter_profiles.id = recruiter_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM recruiter_profiles
      WHERE recruiter_profiles.id = recruiter_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can delete own jobs"
  ON jobs FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recruiter_profiles
      WHERE recruiter_profiles.id = recruiter_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidate_profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted')),
  cover_letter text DEFAULT '',
  applied_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can read own applications"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Candidates can insert own applications"
  ON applications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM candidate_profiles
      WHERE candidate_profiles.id = candidate_id
      AND candidate_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can view applications for their jobs"
  ON applications FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      JOIN recruiter_profiles ON jobs.recruiter_id = recruiter_profiles.id
      WHERE jobs.id = job_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Recruiters can update applications for their jobs"
  ON applications FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM jobs
      JOIN recruiter_profiles ON jobs.recruiter_id = recruiter_profiles.id
      WHERE jobs.id = job_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM jobs
      JOIN recruiter_profiles ON jobs.recruiter_id = recruiter_profiles.id
      WHERE jobs.id = job_id
      AND recruiter_profiles.user_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_roles_id ON user_roles(id);
CREATE INDEX IF NOT EXISTS idx_candidate_profiles_user_id ON candidate_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_recruiter_profiles_user_id ON recruiter_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_recruiter_id ON jobs(recruiter_id);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON jobs(is_active);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_candidate_id ON applications(candidate_id);
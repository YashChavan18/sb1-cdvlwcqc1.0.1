/*
  # Create profiles tables

  1. New Tables
    - `organization_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `name` (text)
      - `description` (text)
      - `website` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `educator_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `full_name` (text)
      - `bio` (text)
      - `expertise` (text[])
      - `qualifications` (text[])
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to read and update their own profiles
*/

-- Create organization_profiles table
CREATE TABLE IF NOT EXISTS organization_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  website text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create educator_profiles table
CREATE TABLE IF NOT EXISTS educator_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text NOT NULL,
  bio text,
  expertise text[],
  qualifications text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE organization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE educator_profiles ENABLE ROW LEVEL SECURITY;

-- Policies for organization_profiles
CREATE POLICY "Users can view their own organization profile"
  ON organization_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own organization profile"
  ON organization_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own organization profile"
  ON organization_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Policies for educator_profiles
CREATE POLICY "Users can view their own educator profile"
  ON educator_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own educator profile"
  ON educator_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own educator profile"
  ON educator_profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create function to handle profile updates
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_organization_profiles_updated_at
  BEFORE UPDATE ON organization_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_educator_profiles_updated_at
  BEFORE UPDATE ON educator_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
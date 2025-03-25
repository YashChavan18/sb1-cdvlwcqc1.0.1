/*
  # Create requirements posting system

  1. New Tables
    - `teaching_requirements`
      - `id` (uuid, primary key)
      - `organization_id` (uuid, references organization_profiles)
      - `title` (text)
      - `description` (text)
      - `subject_area` (text)
      - `required_expertise` (text[])
      - `duration` (text)
      - `budget_range` (text)
      - `location_type` (text) - 'remote', 'in-person', 'hybrid'
      - `location` (text, nullable)
      - `status` (text) - 'open', 'in_progress', 'completed', 'cancelled'
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Organizations can create and manage their requirements
    - Educators can view all requirements
*/

CREATE TABLE IF NOT EXISTS teaching_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id uuid REFERENCES organization_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  subject_area text NOT NULL,
  required_expertise text[] NOT NULL,
  duration text NOT NULL,
  budget_range text NOT NULL,
  location_type text NOT NULL CHECK (location_type IN ('remote', 'in-person', 'hybrid')),
  location text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE teaching_requirements ENABLE ROW LEVEL SECURITY;

-- Organizations can manage their own requirements
CREATE POLICY "Organizations can manage their own requirements"
  ON teaching_requirements
  FOR ALL
  TO authenticated
  USING (auth.uid() = organization_id)
  WITH CHECK (auth.uid() = organization_id);

-- Educators can view all open requirements
CREATE POLICY "Educators can view requirements"
  ON teaching_requirements
  FOR SELECT
  TO authenticated
  USING (true);

-- Update trigger for updated_at
CREATE TRIGGER update_teaching_requirements_updated_at
  BEFORE UPDATE ON teaching_requirements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
/*
  # Create NBA Player Assessment Database Schema

  1. New Tables
    - `player_profiles`
      - `id` (uuid, primary key)
      - `name` (text, player name)
      - `research_data` (jsonb, cached research information)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `conversations`
      - `id` (uuid, primary key) 
      - `player_id` (text, reference to player)
      - `messages` (jsonb array, conversation history)
      - `assessment_data` (jsonb, extracted assessment information)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `admin_settings`
      - `id` (uuid, primary key)
      - `ai_personality` (text, AI personality configuration)
      - `conversation_tone` (text, tone settings)
      - `research_sources` (text array, enabled research sources)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
    - Public read access for admin settings
*/

CREATE TABLE IF NOT EXISTS player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  research_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id text NOT NULL,
  messages jsonb DEFAULT '[]',
  assessment_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ai_personality text DEFAULT 'friendly',
  conversation_tone text DEFAULT 'casual',
  research_sources text[] DEFAULT ARRAY['mock'],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE player_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for player_profiles
CREATE POLICY "Anyone can read player profiles"
  ON player_profiles
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert player profiles"
  ON player_profiles
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update player profiles"
  ON player_profiles
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for conversations
CREATE POLICY "Anyone can read conversations"
  ON conversations
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert conversations"
  ON conversations
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update conversations"
  ON conversations
  FOR UPDATE
  TO public
  USING (true);

-- Create policies for admin_settings
CREATE POLICY "Anyone can read admin settings"
  ON admin_settings
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify admin settings"
  ON admin_settings
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_player_profiles_name ON player_profiles(name);
CREATE INDEX IF NOT EXISTS idx_conversations_player_id ON conversations(player_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Insert default admin settings
INSERT INTO admin_settings (ai_personality, conversation_tone, research_sources)
VALUES ('friendly', 'casual', ARRAY['mock'])
ON CONFLICT DO NOTHING;
/*
  # Create AI interactions table

  1. New Tables
    - `ai_interactions`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `prompt` (text)
      - `response` (text)
      - `confidence` (numeric)
      - `metadata` (jsonb)
      - `context` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `ai_interactions` table
    - Add policy for public access to insert and read interactions
*/

CREATE TABLE IF NOT EXISTS ai_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  prompt text NOT NULL,
  response text NOT NULL,
  confidence numeric DEFAULT 0.8,
  metadata jsonb DEFAULT '{}',
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_interactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert AI interactions"
  ON ai_interactions
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can read AI interactions"
  ON ai_interactions
  FOR SELECT
  TO public
  USING (true);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_session_id ON ai_interactions (session_id);
CREATE INDEX IF NOT EXISTS idx_ai_interactions_created_at ON ai_interactions (created_at);
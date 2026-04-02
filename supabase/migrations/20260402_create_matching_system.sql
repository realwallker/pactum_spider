-- SQL Migrations for Matching System

-- Create match_rooms table if it doesn't exist
CREATE TABLE IF NOT EXISTS match_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(match_id)
);

-- Create messages table if it doesn't exist
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES match_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'texto' CHECK (type IN ('texto', 'archivo')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_match_rooms_match_id ON match_rooms(match_id);
CREATE INDEX IF NOT EXISTS idx_messages_room_id ON messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Ensure matches table has the required columns
-- If matches table already exists, this will not cause an error
-- Adding columns with IF NOT EXISTS (if your DB supports it, or just skip if already present)
ALTER TABLE matches ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create trigger to automatically update updated_at on match_rooms
CREATE OR REPLACE FUNCTION update_match_rooms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_match_rooms_updated_at ON match_rooms;
CREATE TRIGGER trigger_match_rooms_updated_at
BEFORE UPDATE ON match_rooms
FOR EACH ROW
EXECUTE PROCEDURE update_match_rooms_timestamp();

-- Create trigger to automatically update updated_at on messages
CREATE OR REPLACE FUNCTION update_messages_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_messages_updated_at ON messages;
CREATE TRIGGER trigger_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE PROCEDURE update_messages_timestamp();

-- Enable Row Level Security (RLS) on match_rooms
ALTER TABLE match_rooms ENABLE ROW LEVEL SECURITY;

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see match_rooms that involve their matches
CREATE POLICY IF NOT EXISTS match_rooms_select_policy ON match_rooms
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_rooms.match_id
    AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
  )
);

-- RLS Policy: Users can insert match_rooms only for their matches
CREATE POLICY IF NOT EXISTS match_rooms_insert_policy ON match_rooms
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM matches
    WHERE matches.id = match_id
    AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
  )
);

-- RLS Policy: Users can see messages in rooms they have access to
CREATE POLICY IF NOT EXISTS messages_select_policy ON messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM match_rooms
    WHERE match_rooms.id = messages.room_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_rooms.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  )
);

-- RLS Policy: Users can insert messages only in rooms they have access to
CREATE POLICY IF NOT EXISTS messages_insert_policy ON messages
FOR INSERT
WITH CHECK (
  sender_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM match_rooms
    WHERE match_rooms.id = room_id
    AND EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = match_rooms.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  )
);

-- Create promotional cards table
CREATE TABLE IF NOT EXISTS promotional_cards (
  id SERIAL PRIMARY KEY,
  position INTEGER NOT NULL UNIQUE, -- 1, 2, or 3 for the three cards
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL DEFAULT '#',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default promotional cards
INSERT INTO promotional_cards (position, image_url, link_url) VALUES
  (1, '/placeholder.svg?height=220&width=280', '/tcl-warranty'),
  (2, '/placeholder.svg?height=220&width=280', '/financing'),
  (3, '/placeholder.svg?height=240&width=320', '/home-style')
ON CONFLICT (position) DO NOTHING;

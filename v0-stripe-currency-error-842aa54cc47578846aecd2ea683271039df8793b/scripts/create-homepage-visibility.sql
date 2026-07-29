-- Create homepage_section_visibility table for controlling section visibility
CREATE TABLE IF NOT EXISTS homepage_section_visibility (
  id SERIAL PRIMARY KEY,
  section_key VARCHAR(50) UNIQUE NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  is_visible BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default sections
INSERT INTO homepage_section_visibility (section_key, section_name, is_visible, display_order)
VALUES 
  ('gold', 'Злато', true, 1),
  ('equipment', 'Техника', true, 2),
  ('cars', 'Авто', true, 3)
ON CONFLICT (section_key) DO NOTHING;

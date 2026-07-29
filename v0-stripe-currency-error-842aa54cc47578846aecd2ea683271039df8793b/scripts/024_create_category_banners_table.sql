-- Create category banners table for promotional banners on category pages
CREATE TABLE IF NOT EXISTS category_banners (
  id SERIAL PRIMARY KEY,
  category_type VARCHAR(50) NOT NULL, -- 'equipment', 'gold', 'cars', etc.
  category_id INTEGER, -- Optional: specific subcategory
  title VARCHAR(255),
  subtitle TEXT,
  image_url TEXT NOT NULL,
  mobile_image_url TEXT, -- Optional mobile-specific image
  link_url TEXT,
  link_text VARCHAR(100) DEFAULT 'Научи повече',
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_category_banners_type ON category_banners(category_type);
CREATE INDEX IF NOT EXISTS idx_category_banners_active ON category_banners(is_active);

-- Insert default banner for equipment category
INSERT INTO category_banners (category_type, title, subtitle, image_url, link_url, link_text, is_active)
VALUES (
  'equipment',
  'football is calling',
  'Спечели двоен билет за откриването на FIFA WORLD CUP 2026™ и ексклузивния razr FIFA World Cup 26™ Edition',
  '/banners/motorola-fifa-2026.webp',
  '/equipment',
  'Научи повече',
  true
);

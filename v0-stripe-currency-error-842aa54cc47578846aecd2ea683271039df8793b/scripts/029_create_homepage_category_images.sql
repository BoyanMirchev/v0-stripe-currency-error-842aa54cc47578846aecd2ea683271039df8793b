-- Stores the homepage images for the two root "Категории" cards (Злато / Сребро)
CREATE TABLE IF NOT EXISTS homepage_category_images (
  id SERIAL PRIMARY KEY,
  metal_key TEXT NOT NULL UNIQUE, -- 'gold' or 'silver'
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed the two root rows with the current default images
INSERT INTO homepage_category_images (metal_key, image_url)
VALUES
  ('gold', '/gold-jewelry.jpg'),
  ('silver', '/shimmering-silver.png')
ON CONFLICT (metal_key) DO NOTHING;

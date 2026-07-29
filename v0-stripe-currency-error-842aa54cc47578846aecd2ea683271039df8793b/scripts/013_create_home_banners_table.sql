-- Create home_banners table for storing homepage banner slides
CREATE TABLE IF NOT EXISTS home_banners (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text TEXT DEFAULT '',
    link_url TEXT DEFAULT '',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_home_banners_display_order ON home_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_home_banners_is_active ON home_banners(is_active);

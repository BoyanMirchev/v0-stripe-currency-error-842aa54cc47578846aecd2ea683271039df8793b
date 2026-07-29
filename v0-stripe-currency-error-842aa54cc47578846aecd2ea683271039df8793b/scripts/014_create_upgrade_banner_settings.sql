-- Create upgrade_banner_settings table for the smartphone upgrade banner
CREATE TABLE IF NOT EXISTS upgrade_banner_settings (
    id SERIAL PRIMARY KEY,
    background_image_url TEXT DEFAULT '',
    link_url TEXT DEFAULT '/mobile-upgrade',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT INTO upgrade_banner_settings (background_image_url, link_url, is_active)
VALUES ('', '/mobile-upgrade', true)
ON CONFLICT DO NOTHING;

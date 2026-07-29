-- Add mobile background image field to upgrade_banner_settings table
ALTER TABLE upgrade_banner_settings
ADD COLUMN IF NOT EXISTS mobile_background_image_url TEXT DEFAULT '';

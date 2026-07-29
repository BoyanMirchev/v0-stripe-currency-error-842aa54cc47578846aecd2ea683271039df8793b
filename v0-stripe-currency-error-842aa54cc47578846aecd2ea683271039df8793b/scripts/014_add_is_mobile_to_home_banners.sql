-- Add is_mobile column to home_banners table to support separate mobile banners
ALTER TABLE home_banners 
ADD COLUMN IF NOT EXISTS is_mobile BOOLEAN DEFAULT false;

-- Create index for filtering mobile/desktop banners
CREATE INDEX IF NOT EXISTS idx_home_banners_is_mobile ON home_banners(is_mobile);

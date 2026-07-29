-- Add Google Maps URL and phone number columns to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS google_maps_url TEXT;
ALTER TABLE stores ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

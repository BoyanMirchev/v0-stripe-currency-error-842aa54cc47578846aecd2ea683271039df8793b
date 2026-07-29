-- Add email column to stores table
ALTER TABLE stores ADD COLUMN IF NOT EXISTS email VARCHAR(255);

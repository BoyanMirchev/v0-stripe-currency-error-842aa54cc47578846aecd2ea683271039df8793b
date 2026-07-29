-- Add images jsonb column to equipment_categories table
ALTER TABLE equipment_categories 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;

-- Add comment to describe the column
COMMENT ON COLUMN equipment_categories.images IS 'Array of image URLs for the category (stored as JSONB)';

-- Add images array column to gold_sales table
ALTER TABLE gold_sales 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Add comment to describe the column
COMMENT ON COLUMN gold_sales.images IS 'Array of image URLs for the gold item';

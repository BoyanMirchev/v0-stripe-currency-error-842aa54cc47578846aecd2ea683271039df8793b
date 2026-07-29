-- Add SEO fields to equipment table
ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS seo_title VARCHAR(255),
ADD COLUMN IF NOT EXISTS seo_description TEXT,
ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Add comments for documentation
COMMENT ON COLUMN equipment.seo_title IS 'SEO meta title for product page';
COMMENT ON COLUMN equipment.seo_description IS 'SEO meta description for product page';
COMMENT ON COLUMN equipment.seo_keywords IS 'SEO keywords (comma-separated)';

-- Add SEO fields to gold_sales table
ALTER TABLE gold_sales ADD COLUMN IF NOT EXISTS seo_title VARCHAR(60);
ALTER TABLE gold_sales ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160);
ALTER TABLE gold_sales ADD COLUMN IF NOT EXISTS seo_keywords TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_gold_sales_seo_title ON gold_sales(seo_title);

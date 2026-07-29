-- Add homepage display fields to gold_categories
ALTER TABLE gold_categories ADD COLUMN IF NOT EXISTS show_on_homepage BOOLEAN DEFAULT false;
ALTER TABLE gold_categories ADD COLUMN IF NOT EXISTS homepage_image TEXT;
ALTER TABLE gold_categories ADD COLUMN IF NOT EXISTS homepage_order INTEGER DEFAULT 0;

-- Update existing categories to show on homepage by default (parent categories only)
UPDATE gold_categories SET show_on_homepage = true, homepage_order = display_order WHERE parent_id IS NULL;

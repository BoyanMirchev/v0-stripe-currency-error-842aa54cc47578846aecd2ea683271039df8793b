-- Add subcategory_id column to gold_sales table
ALTER TABLE gold_sales ADD COLUMN IF NOT EXISTS subcategory_id INTEGER REFERENCES gold_categories(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_gold_sales_subcategory_id ON gold_sales(subcategory_id);

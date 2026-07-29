-- Add parent_id column to gold_categories for hierarchical structure
ALTER TABLE gold_categories ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES gold_categories(id);

-- Create index for faster parent lookups
CREATE INDEX IF NOT EXISTS idx_gold_categories_parent_id ON gold_categories(parent_id);

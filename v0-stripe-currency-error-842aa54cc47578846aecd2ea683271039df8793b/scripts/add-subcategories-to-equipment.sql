-- Add parent_id column to equipment_categories for subcategory support
ALTER TABLE equipment_categories ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES equipment_categories(id) ON DELETE SET NULL;

-- Add index for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_categories_parent_id ON equipment_categories(parent_id);

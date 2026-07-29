-- Add parent_id column to equipment_categories table for subcategory support
ALTER TABLE equipment_categories 
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES equipment_categories(id) ON DELETE SET NULL;

-- Add subcategory_id column to equipment table
ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS subcategory_id INTEGER REFERENCES equipment_categories(id) ON DELETE SET NULL;

-- Create index for faster lookups on parent_id
CREATE INDEX IF NOT EXISTS idx_equipment_categories_parent_id ON equipment_categories(parent_id);

-- Create index for faster lookups on subcategory_id in equipment table
CREATE INDEX IF NOT EXISTS idx_equipment_subcategory_id ON equipment(subcategory_id);

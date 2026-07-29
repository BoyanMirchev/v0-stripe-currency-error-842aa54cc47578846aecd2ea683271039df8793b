-- Create equipment_categories table
CREATE TABLE IF NOT EXISTS equipment_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50), -- Optional icon name for UI
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id column to equipment table
ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS category_id INTEGER,
ADD CONSTRAINT fk_equipment_category 
  FOREIGN KEY (category_id) 
  REFERENCES equipment_categories(id) 
  ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);

-- Insert some default categories
INSERT INTO equipment_categories (name, description, display_order) VALUES
  ('Строителна техника', 'Багери, булдозери, кранове и друга строителна техника', 1),
  ('Земеделска техника', 'Трактори, комбайни и друга селскостопанска техника', 2),
  ('Индустриални машини', 'Производствени линии, пресове и индустриално оборудване', 3),
  ('Транспортна техника', 'Камиони, ремаркета и транспортни средства', 4),
  ('Складова техника', 'Мотокари, палетни количи и складово оборудване', 5)
ON CONFLICT (name) DO NOTHING;

-- Optional: Migrate existing category data from text to category_id
-- This will match existing text categories to new category IDs
UPDATE equipment 
SET category_id = equipment_categories.id
FROM equipment_categories
WHERE equipment.category = equipment_categories.name;

COMMENT ON TABLE equipment_categories IS 'Categories for equipment/machinery items';
COMMENT ON COLUMN equipment.category_id IS 'Foreign key reference to equipment_categories table';

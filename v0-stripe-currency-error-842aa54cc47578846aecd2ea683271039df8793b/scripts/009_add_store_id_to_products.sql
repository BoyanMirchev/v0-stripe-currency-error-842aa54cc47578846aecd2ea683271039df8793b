-- Add store_id column to gold, cars, and equipment tables
-- This creates a foreign key relationship to the stores table

-- Add store_id to gold table
ALTER TABLE gold_sales 
ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL;

-- Add store_id to cars table
ALTER TABLE cars 
ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL;

-- Add store_id to equipment table
ALTER TABLE equipment 
ADD COLUMN store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX idx_gold_sales_store_id ON gold_sales(store_id);
CREATE INDEX idx_cars_store_id ON cars(store_id);
CREATE INDEX idx_equipment_store_id ON equipment(store_id);

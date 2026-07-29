-- Add promotions column to gold_sales table
ALTER TABLE gold_sales 
ADD COLUMN IF NOT EXISTS promotions NUMERIC DEFAULT 0;

-- Add comment to describe the column
COMMENT ON COLUMN gold_sales.promotions IS 'Discount amount in BGN (e.g., 50 means 50 BGN discount)';

-- Add promotions column to cars table
ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS promotions NUMERIC DEFAULT 0;

-- Add comment to describe the column
COMMENT ON COLUMN cars.promotions IS 'Discount amount in BGN (e.g., 50 means 50 BGN discount)';

-- Add promotions column to equipment table
ALTER TABLE equipment 
ADD COLUMN IF NOT EXISTS promotions NUMERIC DEFAULT 0;

-- Add comment to describe the column
COMMENT ON COLUMN equipment.promotions IS 'Discount amount in BGN (e.g., 50 means 50 BGN discount)';

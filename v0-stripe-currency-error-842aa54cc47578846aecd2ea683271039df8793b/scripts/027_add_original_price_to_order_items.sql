-- Add original_price and has_promotion columns to order_items table
-- This allows tracking whether a product was purchased at a promotional price

ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS original_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS has_promotion BOOLEAN DEFAULT false;

-- Update existing records to set original_price = price where not set
UPDATE order_items 
SET original_price = price, has_promotion = false 
WHERE original_price IS NULL;

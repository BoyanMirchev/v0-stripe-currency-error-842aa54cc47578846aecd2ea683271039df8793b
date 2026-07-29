-- Add support for guest orders by making user_id nullable and adding guest fields
ALTER TABLE orders 
  ALTER COLUMN user_id DROP NOT NULL;

ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255),
  ADD COLUMN IF NOT EXISTS guest_first_name VARCHAR(100),
  ADD COLUMN IF NOT EXISTS guest_last_name VARCHAR(100);

-- Add index for guest email lookups
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);

-- Add check constraint to ensure either user_id or guest_email is provided
ALTER TABLE orders 
  ADD CONSTRAINT check_user_or_guest 
  CHECK (user_id IS NOT NULL OR guest_email IS NOT NULL);

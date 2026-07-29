-- Add guest order support to orders table
-- Make user_id nullable for guest orders
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Remove the foreign key constraint to allow null user_id
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Re-add the foreign key constraint but allow NULL
ALTER TABLE orders ADD CONSTRAINT orders_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add guest columns
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_email VARCHAR(255);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_first_name VARCHAR(100);
ALTER TABLE orders ADD COLUMN IF NOT EXISTS guest_last_name VARCHAR(100);

-- Add index for guest email lookups
CREATE INDEX IF NOT EXISTS idx_orders_guest_email ON orders(guest_email);

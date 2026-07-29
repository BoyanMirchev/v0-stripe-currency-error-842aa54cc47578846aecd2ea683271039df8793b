-- Add hide_global_price column to admin_workers table
ALTER TABLE admin_workers ADD COLUMN IF NOT EXISTS hide_global_price BOOLEAN DEFAULT false;

-- Create delivery_settings table for Ekont delivery configuration
CREATE TABLE IF NOT EXISTS delivery_settings (
  id SERIAL PRIMARY KEY,
  free_delivery_threshold DECIMAL(10,2) NOT NULL DEFAULT 100.00,
  econt_office_price DECIMAL(10,2) NOT NULL DEFAULT 1.79,
  econt_address_price DECIMAL(10,2) NOT NULL DEFAULT 2.68,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default values if table is empty
INSERT INTO delivery_settings (free_delivery_threshold, econt_office_price, econt_address_price)
SELECT 100.00, 1.79, 2.68
WHERE NOT EXISTS (SELECT 1 FROM delivery_settings);

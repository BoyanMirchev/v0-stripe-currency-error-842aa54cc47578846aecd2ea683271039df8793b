-- Create metal_prices table for storing gold and silver buying prices
CREATE TABLE IF NOT EXISTS metal_prices (
  id SERIAL PRIMARY KEY,
  metal_type VARCHAR(20) NOT NULL, -- 'gold' or 'silver'
  purity VARCHAR(20) NOT NULL, -- '375', '585', '750', '917', '999', '800', '925'
  purity_label VARCHAR(100) NOT NULL, -- '1 грам злато проба 375 (9 карата)'
  price_per_gram DECIMAL(10, 2) NOT NULL, -- 46.06
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(metal_type, purity)
);

-- Insert default gold prices
INSERT INTO metal_prices (metal_type, purity, purity_label, price_per_gram, display_order) VALUES
  ('gold', '375', '1 грам злато проба 375 (9 карата)', 46.06, 1),
  ('gold', '585', '1 грам злато проба 585 (14 карата)', 71.86, 2),
  ('gold', '750', '1 грам злато проба 750 (18 карата)', 92.12, 3),
  ('gold', '917', '1 грам злато проба 917 (22 карата)', 112.59, 4),
  ('gold', '999', '1 грам злато проба 999 (24 карата)', 125.08, 5)
ON CONFLICT (metal_type, purity) DO UPDATE SET
  purity_label = EXCLUDED.purity_label,
  price_per_gram = EXCLUDED.price_per_gram,
  display_order = EXCLUDED.display_order;

-- Insert default silver prices
INSERT INTO metal_prices (metal_type, purity, purity_label, price_per_gram, display_order) VALUES
  ('silver', '800', '1 грам сребро проба 800', 1.44, 1),
  ('silver', '925', '1 грам сребро проба 925', 1.66, 2),
  ('silver', '999', '1 грам сребро проба 999', 1.82, 3)
ON CONFLICT (metal_type, purity) DO UPDATE SET
  purity_label = EXCLUDED.purity_label,
  price_per_gram = EXCLUDED.price_per_gram,
  display_order = EXCLUDED.display_order;

-- Create an index for faster queries
CREATE INDEX IF NOT EXISTS idx_metal_prices_type ON metal_prices(metal_type);
CREATE INDEX IF NOT EXISTS idx_metal_prices_active ON metal_prices(is_active);

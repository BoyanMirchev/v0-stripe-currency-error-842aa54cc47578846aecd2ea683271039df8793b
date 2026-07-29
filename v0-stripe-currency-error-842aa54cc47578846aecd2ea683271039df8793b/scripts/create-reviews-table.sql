-- Create reviews table to store product reviews
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  product_type VARCHAR(50) NOT NULL, -- 'gold', 'equipment', or 'cars'
  user_name VARCHAR(255),
  user_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries by product
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id, product_type);

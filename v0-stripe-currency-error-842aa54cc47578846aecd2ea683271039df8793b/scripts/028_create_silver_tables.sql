-- Create silver_categories table (mirrors gold_categories structure)
CREATE TABLE IF NOT EXISTS silver_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  parent_id INTEGER REFERENCES silver_categories(id) ON DELETE SET NULL,
  show_on_homepage BOOLEAN DEFAULT false,
  homepage_image TEXT,
  homepage_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create silver_sales table (mirrors gold_sales structure)
CREATE TABLE IF NOT EXISTS silver_sales (
  id SERIAL PRIMARY KEY,
  silver_type VARCHAR(100) NOT NULL DEFAULT 'Сребро 925',
  weight_grams DECIMAL(10,2) NOT NULL,
  purity_percentage DECIMAL(10,2) DEFAULT 92.5,
  price_per_gram DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'EUR',
  description TEXT,
  status VARCHAR(50) DEFAULT 'available',
  notes TEXT,
  images TEXT[] DEFAULT '{}',
  promotions DECIMAL(10,2),
  store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES silver_categories(id) ON DELETE SET NULL,
  subcategory_id INTEGER REFERENCES silver_categories(id) ON DELETE SET NULL,
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_silver_sales_category_id ON silver_sales(category_id);
CREATE INDEX IF NOT EXISTS idx_silver_sales_subcategory_id ON silver_sales(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_silver_sales_store_id ON silver_sales(store_id);
CREATE INDEX IF NOT EXISTS idx_silver_sales_status ON silver_sales(status);
CREATE INDEX IF NOT EXISTS idx_silver_categories_parent_id ON silver_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_silver_categories_slug ON silver_categories(slug);

-- Insert default silver categories
INSERT INTO silver_categories (name, slug, display_order) VALUES
  ('Пръстени', 'prasteni', 1),
  ('Обеци', 'obeci', 2),
  ('Колиета', 'kolieta', 3),
  ('Гривни', 'grivni', 4),
  ('Медальони', 'medalioni', 5),
  ('Синджири', 'sindjiri', 6),
  ('Комплекти', 'komplekti', 7),
  ('Други', 'drugi', 8)
ON CONFLICT (slug) DO NOTHING;

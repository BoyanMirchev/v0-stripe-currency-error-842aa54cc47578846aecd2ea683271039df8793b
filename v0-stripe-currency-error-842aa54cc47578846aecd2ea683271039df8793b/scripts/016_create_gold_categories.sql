-- Create gold_categories table
CREATE TABLE IF NOT EXISTS gold_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add category_id to gold_sales table
ALTER TABLE gold_sales ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES gold_categories(id);

-- Insert default gold categories
INSERT INTO gold_categories (name, slug, display_order) VALUES
  ('Всички дамски', 'damski', 1),
  ('Пръстени', 'prasteni', 2),
  ('Твърди гривни', 'tvardi-grivni', 3),
  ('Обеци', 'obeci', 4),
  ('Колиета', 'kolieta', 5),
  ('Кръстове', 'krastove', 6),
  ('Медальони', 'medalioni', 7),
  ('Букви', 'bukvi', 8),
  ('Синджири', 'sindjiri', 9),
  ('Гривни', 'grivni', 10),
  ('Злато на конец, силикон или кожа', 'zlato-konec-silikon-koja', 11)
ON CONFLICT (slug) DO NOTHING;

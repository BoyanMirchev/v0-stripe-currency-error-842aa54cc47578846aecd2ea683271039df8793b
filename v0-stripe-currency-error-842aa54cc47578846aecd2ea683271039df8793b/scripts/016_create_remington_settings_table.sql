CREATE TABLE IF NOT EXISTS remington_settings (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL DEFAULT 'Стилизирай косата си с Remington AIRvive',
  image_url TEXT,
  button_link TEXT NOT NULL DEFAULT '/products',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default values
INSERT INTO remington_settings (title, image_url, button_link)
VALUES (
  'Стилизирай косата си с Remington AIRvive',
  '/placeholder.svg?height=400&width=300',
  '/products'
)
ON CONFLICT DO NOTHING;

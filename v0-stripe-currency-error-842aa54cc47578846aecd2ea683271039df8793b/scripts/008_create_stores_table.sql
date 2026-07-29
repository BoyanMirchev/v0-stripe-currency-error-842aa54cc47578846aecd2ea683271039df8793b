-- Create stores table for physical locations
CREATE TABLE IF NOT EXISTS stores (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(500) NOT NULL,
  city VARCHAR(100) NOT NULL,
  neighborhood VARCHAR(100),
  working_hours VARCHAR(255) NOT NULL,
  image_url TEXT,
  rating INTEGER DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  is_24_7 BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample stores
INSERT INTO stores (name, address, city, neighborhood, working_hours, image_url, rating, is_24_7) VALUES
('ОДИСЕЙ - Заложна къща', 'бул. „8-ми Приморски полк" 85', 'Варна', 'Одесос', 'Денонощно', '/placeholder.svg?height=400&width=600', 0, true),
('Bobi & B-5 - Заложна къща', 'бул. „Христо Ботев" 112', 'София', 'Център', 'Денонощно', '/placeholder.svg?height=400&width=600', 0, true),
('Заложна къща', 'ул. „Екзарх Йосиф" 57', 'Враца', 'Център', 'Денонощно', '/placeholder.svg?height=400&width=600', 5, true),
('Golden House - Заложна къща', 'бул. „Ломско шосе" 118', 'София', 'Надежда', 'Денонощно', '/placeholder.svg?height=400&width=600', 0, true);

-- Create table for caching Econt cities data
CREATE TABLE IF NOT EXISTS econt_cities (
  id TEXT PRIMARY KEY,  -- country code
  data JSONB NOT NULL,  -- JSON array of cities
  last_fetched_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_econt_cities_last_fetched ON econt_cities(last_fetched_at);

-- Create table for caching Econt offices data
CREATE TABLE IF NOT EXISTS econt_offices (
  id TEXT PRIMARY KEY,  -- city_id
  city_id TEXT NOT NULL,
  data JSONB NOT NULL,  -- JSON array of offices
  last_fetched_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_econt_offices_last_fetched ON econt_offices(last_fetched_at);
CREATE INDEX IF NOT EXISTS idx_econt_offices_city_id ON econt_offices(city_id);

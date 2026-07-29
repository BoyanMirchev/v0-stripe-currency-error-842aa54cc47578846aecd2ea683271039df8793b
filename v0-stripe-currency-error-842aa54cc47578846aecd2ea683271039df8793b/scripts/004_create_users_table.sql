-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Insert a test admin user (password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO users (email, password_hash, first_name, last_name)
VALUES ('admin@kesh.bg', '$2a$10$rN5YqV8pDgFz9yYnZGvkLuKx8kxYqH9QqP8PqVFvH9QqP8PqVFvH9', 'Admin', 'User')
ON CONFLICT (email) DO NOTHING;

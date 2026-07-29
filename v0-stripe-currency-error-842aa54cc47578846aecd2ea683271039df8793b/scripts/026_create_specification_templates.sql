-- Create specification_templates table to store reusable specification names
-- When adding equipment, you can select from existing spec names or create new ones
CREATE TABLE IF NOT EXISTS specification_templates (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_specification_templates_name ON specification_templates(name);

-- Insert some common specification templates
INSERT INTO specification_templates (name) VALUES
  ('Процесор'),
  ('RAM'),
  ('Твърд диск'),
  ('Екран'),
  ('Видео карта'),
  ('Операционна система'),
  ('Батерия'),
  ('Тегло'),
  ('Размери'),
  ('Гаранция'),
  ('Цвят'),
  ('Материал'),
  ('Мощност'),
  ('Напрежение'),
  ('Честота'),
  ('Капацитет'),
  ('Скорост'),
  ('Интерфейс'),
  ('Разделителна способност'),
  ('Яркост')
ON CONFLICT (name) DO NOTHING;

-- The specifications column in equipment table already exists as JSONB
-- It will store data like: [{"name": "Процесор", "value": "Intel i7"}, {"name": "RAM", "value": "16GB"}]

COMMENT ON TABLE specification_templates IS 'Reusable specification names for equipment. Users can select from these or add new ones.';

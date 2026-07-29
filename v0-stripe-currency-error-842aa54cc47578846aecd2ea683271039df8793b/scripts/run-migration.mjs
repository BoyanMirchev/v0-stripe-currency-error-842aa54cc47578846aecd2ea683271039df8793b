import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

const migrations = [
  // Create admin_workers table
  `CREATE TABLE IF NOT EXISTS admin_workers (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'worker',
    store_id INTEGER REFERENCES stores(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    allowed_tabs TEXT[] DEFAULT ARRAY['equipment', 'gold', 'cars'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  )`,
  
  // Insert default admin user (password: admin123)
  // Using a simple hash for demo - in production use bcrypt
  `INSERT INTO admin_workers (username, password_hash, first_name, last_name, role, allowed_tabs, is_active)
   VALUES ('admin', 'admin123', 'Admin', 'User', 'admin', 
     ARRAY['home-banners', 'upgrade-banner', 'category-banners', 'promotional-cards', 'cars', 'equipment', 'categories', 'gold', 'gold-categories', 'metal-prices', 'users', 'orders', 'messages', 'stores', 'contact', 'remington-settings', 'seo-settings', 'admin-workers'],
     true)
   ON CONFLICT (username) DO NOTHING`,
];

async function runMigrations() {
  for (const migration of migrations) {
    try {
      await sql(migration);
      console.log("OK:", migration.substring(0, 60) + "...");
    } catch (e) {
      console.error("Error:", e.message);
    }
  }
  console.log("Migration complete!");
}

runMigrations();

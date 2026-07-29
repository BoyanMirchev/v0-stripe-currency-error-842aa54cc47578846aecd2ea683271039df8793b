-- Create homepage_seo table with all possible SEO fields
CREATE TABLE IF NOT EXISTS homepage_seo (
  id SERIAL PRIMARY KEY,
  
  -- Basic Meta Tags
  site_name VARCHAR(255) DEFAULT 'КЕШ',
  title VARCHAR(255) DEFAULT 'КЕШ - Онлайн магазин за електроника, коли и злато',
  description TEXT DEFAULT 'КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута. Изгодни цени и бърза доставка.',
  keywords TEXT DEFAULT 'КЕШ, електроника, коли, злато, онлайн магазин, България',
  
  -- Open Graph (Facebook, LinkedIn, etc.)
  og_title VARCHAR(255),
  og_description TEXT,
  og_image VARCHAR(500),
  og_image_alt VARCHAR(255),
  og_image_width INTEGER DEFAULT 1200,
  og_image_height INTEGER DEFAULT 630,
  og_type VARCHAR(50) DEFAULT 'website',
  og_locale VARCHAR(20) DEFAULT 'bg_BG',
  og_site_name VARCHAR(255),
  og_url VARCHAR(500),
  
  -- Twitter Card
  twitter_card VARCHAR(50) DEFAULT 'summary_large_image',
  twitter_site VARCHAR(255),
  twitter_creator VARCHAR(255),
  twitter_title VARCHAR(255),
  twitter_description TEXT,
  twitter_image VARCHAR(500),
  twitter_image_alt VARCHAR(255),
  
  -- Additional Meta Tags
  author VARCHAR(255) DEFAULT 'КЕШ',
  robots VARCHAR(255) DEFAULT 'index, follow',
  googlebot VARCHAR(255) DEFAULT 'index, follow',
  bingbot VARCHAR(255) DEFAULT 'index, follow',
  revisit_after VARCHAR(50) DEFAULT '7 days',
  rating VARCHAR(50) DEFAULT 'general',
  referrer VARCHAR(50) DEFAULT 'origin-when-cross-origin',
  
  -- Canonical and Alternate
  canonical_url VARCHAR(500),
  alternate_languages JSONB DEFAULT '[]',
  
  -- Logo and Branding
  logo_url VARCHAR(500) DEFAULT '/kesh-logo.png',
  logo_alt VARCHAR(255) DEFAULT 'КЕШ Logo',
  logo_width INTEGER DEFAULT 110,
  logo_height INTEGER DEFAULT 40,
  
  -- Favicon and Icons
  favicon_url VARCHAR(500) DEFAULT '/icon.svg',
  apple_touch_icon VARCHAR(500) DEFAULT '/apple-icon.png',
  
  -- Theme and Colors
  theme_color VARCHAR(50) DEFAULT '#ffffff',
  ms_tile_color VARCHAR(50) DEFAULT '#ffffff',
  background_color VARCHAR(50) DEFAULT '#ffffff',
  
  -- Verification Tags
  google_site_verification VARCHAR(255),
  bing_site_verification VARCHAR(255),
  yandex_verification VARCHAR(255),
  facebook_domain_verification VARCHAR(255),
  
  -- Structured Data / JSON-LD
  json_ld_organization JSONB,
  json_ld_website JSONB,
  json_ld_local_business JSONB,
  json_ld_breadcrumb JSONB,
  
  -- Additional Settings
  enable_google_analytics BOOLEAN DEFAULT false,
  google_analytics_id VARCHAR(50),
  enable_facebook_pixel BOOLEAN DEFAULT false,
  facebook_pixel_id VARCHAR(50),
  enable_google_tag_manager BOOLEAN DEFAULT false,
  google_tag_manager_id VARCHAR(50),
  
  -- Custom Head Tags (for any additional meta tags)
  custom_head_tags TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default SEO settings
INSERT INTO homepage_seo (
  site_name,
  title,
  description,
  keywords,
  og_title,
  og_description,
  og_type,
  og_locale,
  og_site_name,
  twitter_card,
  author,
  robots,
  theme_color,
  logo_url,
  logo_alt,
  logo_width,
  logo_height,
  favicon_url,
  apple_touch_icon,
  json_ld_organization,
  json_ld_website
) VALUES (
  'КЕШ',
  'КЕШ - Онлайн магазин за електроника, коли и злато',
  'КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута. Изгодни цени, качествени продукти и бърза доставка до вашия дом.',
  'КЕШ, електроника, коли, автомобили, злато, златни бижута, онлайн магазин, България, техника, смартфони, телевизори',
  'КЕШ - Онлайн магазин за електроника, коли и злато',
  'КЕШ е водещият онлайн магазин в България за електроника, автомобили и златни бижута. Изгодни цени и бърза доставка.',
  'website',
  'bg_BG',
  'КЕШ',
  'summary_large_image',
  'КЕШ',
  'index, follow',
  '#D4AF37',
  '/kesh-logo.png',
  'КЕШ Logo',
  110,
  40,
  '/icon.svg',
  '/apple-icon.png',
  '{
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "КЕШ",
    "description": "Онлайн магазин за електроника, коли и злато",
    "url": "https://kesh.bg",
    "logo": "https://kesh.bg/kesh-logo.png",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+359-88-888-8888",
      "contactType": "customer service",
      "availableLanguage": "Bulgarian"
    }
  }'::jsonb,
  '{
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "КЕШ",
    "url": "https://kesh.bg",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://kesh.bg/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  }'::jsonb
) ON CONFLICT DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_homepage_seo_id ON homepage_seo(id);

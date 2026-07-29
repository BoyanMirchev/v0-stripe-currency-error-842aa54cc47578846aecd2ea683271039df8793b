-- SQL script to create the about_page_content table for editable company page
-- Execute this in your Neon database

CREATE TABLE IF NOT EXISTS about_page_content (
  id SERIAL PRIMARY KEY,
  
  -- Hero Section
  hero_subtitle VARCHAR(255) DEFAULT 'Злато · Техника · Автомобили',
  hero_title TEXT DEFAULT 'Лидер на пазара за злато, техника и автомобили в България',
  hero_description TEXT DEFAULT 'ESH Bulgaria е основана през 2008 г. и се е утвърдила като водещ търговец на злато, електроника и автомобили, обслужващ хиляди клиенти годишно.',
  hero_first_letter VARCHAR(1) DEFAULT 'К',
  
  -- Gold Section (01)
  gold_section_title VARCHAR(255) DEFAULT 'Инвестиционно злато',
  gold_section_description TEXT DEFAULT 'Услугите ни включват продажба на златни монети и кюлчета за инвестиционни цели. Сътрудничим си само с най-доказалите се рафинерии в света. Всички златни изделия са със сертификат за автентичност.',
  gold_section_highlight VARCHAR(255) DEFAULT 'златни монети и кюлчета',
  gold_section_image VARCHAR(500) DEFAULT '/about-gold-bars.jpg',
  gold_section_image_caption VARCHAR(255) DEFAULT 'Купувайте и продавайте злато с KESH',
  gold_section_button_text VARCHAR(100) DEFAULT 'Разгледайте продуктите',
  gold_section_button_link VARCHAR(255) DEFAULT '/gold',
  
  -- Electronics Section (02)
  electronics_section_title VARCHAR(255) DEFAULT 'Техника и електроника',
  electronics_section_description TEXT DEFAULT 'Предлагаме най-новата техника от водещи световни марки. Телевизори, компютри, смартфони и домакински уреди с пълна гаранция и професионална консултация.',
  electronics_section_highlight VARCHAR(255) DEFAULT 'най-новата техника',
  electronics_section_image VARCHAR(500) DEFAULT '/about-electronics.jpg',
  electronics_section_image_caption VARCHAR(255) DEFAULT 'Техника от водещи марки',
  electronics_section_button_text VARCHAR(100) DEFAULT 'Разгледайте продуктите',
  electronics_section_button_link VARCHAR(255) DEFAULT '/equipment',
  
  -- Cars Section (03)
  cars_section_title VARCHAR(255) DEFAULT 'Автомобили',
  cars_section_description TEXT DEFAULT 'Селекция от луксозни и практични автомобили за всеки вкус. Всеки автомобил преминава щателна проверка и идва с пълна документация и история.',
  cars_section_highlight VARCHAR(255) DEFAULT 'луксозни и практични автомобили',
  cars_section_image VARCHAR(500) DEFAULT '/about-luxury-car.jpg',
  cars_section_image_caption VARCHAR(255) DEFAULT 'Автомобили с гаранция',
  cars_section_button_text VARCHAR(100) DEFAULT 'Разгледайте автомобили',
  cars_section_button_link VARCHAR(255) DEFAULT '/cars',
  
  -- Timeline Section
  timeline_section_title VARCHAR(255) DEFAULT 'Създаването на KESH',
  timeline_events JSONB DEFAULT '[
    {"year": "2008", "title": "Основаване на KESH", "description": "Стартиране на KESH Bulgaria с фокус върху злато и електроника"},
    {"year": "2012", "title": "Разширяване", "description": "Добавяне на автомобилна категория и отваряне на втори магазин"},
    {"year": "2016", "title": "Растеж", "description": "Достигане на 5,000+ доволни клиенти"},
    {"year": "2019", "title": "Иновации", "description": "Стартиране на онлайн платформа и доставки в цялата страна"},
    {"year": "2022", "title": "Лидерство", "description": "Утвърждаване като водещ търговец в региона"},
    {"year": "2025", "title": "Бъдещето", "description": "Нови партньорства и разширяване на продуктовата гама"}
  ]'::jsonb,
  timeline_image VARCHAR(500) DEFAULT '/about-store-interior.jpg',
  
  -- Stats Section
  stats_section_title VARCHAR(255) DEFAULT 'KESH в цифри',
  stats_section_subtitle VARCHAR(255) DEFAULT 'Ключови цифри за нашия бизнес и постижения',
  stats JSONB DEFAULT '[
    {"number": "3", "label": "Категории продукти"},
    {"number": "10,000+", "label": "Доволни клиенти"},
    {"number": "17+", "label": "Години опит"},
    {"number": "99%", "label": "Удовлетвореност"},
    {"number": "1000+", "label": "Продукти в каталога"}
  ]'::jsonb,
  
  -- Values Section
  values_section_title VARCHAR(255) DEFAULT 'Вярваме силно в ценностите ни и живеем според тях',
  values_section_subtitle VARCHAR(255) DEFAULT 'Всеки служител, всеки мениджър и всеки клиент споделя тези наши ценности.',
  values JSONB DEFAULT '[
    {"title": "Доверие", "description": "Доверието е всичко. В нашата сфера на дейност, доверието или развива бизнеса, или го убива. Да бъдем възприемани като надежден партньор за нас означава успех, това е основата на нашата дейност, силата, която ни кара да вървим напред. За да повишим доверието в нас, ние винаги предлагаме качествени продукти, безупречно обслужване, безпристрастни съвети и сигурен и удобен начин да закупите злато, техника и автомобили на най-добрите пазарни цени."},
    {"title": "Интегритет", "description": "Действаме честно и етично във всичко, което правим. Спазваме обещанията си и се държим отговорно към нашите клиенти, партньори и общество. Интегритетът е в основата на всяко наше решение."},
    {"title": "Партньорство", "description": "Вярваме, че най-добрите резултати идват от силни партньорства. Работим заедно с нашите клиенти, за да разберем техните нужди и да предложим решения, които надхвърлят очакванията им."}
  ]'::jsonb,
  
  -- CTA Section
  cta_title VARCHAR(255) DEFAULT 'Готови ли сте да откриете перфектния продукт?',
  cta_subtitle TEXT DEFAULT 'Нашият екип е на разположение да ви помогне да направите най-доброто решение',
  cta_primary_button_text VARCHAR(100) DEFAULT 'Свържете се с нас',
  cta_primary_button_link VARCHAR(255) DEFAULT '/contact',
  cta_secondary_button_text VARCHAR(100) DEFAULT 'Разгледайте каталога',
  cta_secondary_button_link VARCHAR(255) DEFAULT '/',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default content if table is empty
INSERT INTO about_page_content (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM about_page_content WHERE id = 1);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_about_page_content_id ON about_page_content(id);

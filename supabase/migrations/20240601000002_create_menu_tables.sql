-- Create menus table
CREATE TABLE IF NOT EXISTS cms_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(location, locale)
);

-- Create menu items table
CREATE TABLE IF NOT EXISTS cms_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES cms_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES cms_menu_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  target TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_items_menu_id ON cms_menu_items(menu_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_parent_id ON cms_menu_items(parent_id);
CREATE INDEX IF NOT EXISTS idx_menus_location ON cms_menus(location);
CREATE INDEX IF NOT EXISTS idx_menus_locale ON cms_menus(locale);
CREATE INDEX IF NOT EXISTS idx_menu_items_locale ON cms_menu_items(locale);

-- Enable realtime for these tables
alter publication supabase_realtime add table cms_menus;
alter publication supabase_realtime add table cms_menu_items;

-- Insert sample data for main navigation
INSERT INTO cms_menus (title, location, locale) 
VALUES 
('Main Navigation', 'main-nav', 'en'),
('القائمة الرئيسية', 'main-nav', 'ar'),
('Footer Navigation', 'footer-nav', 'en'),
('قائمة التذييل', 'footer-nav', 'ar')
ON CONFLICT (location, locale) DO NOTHING;

-- Get the menu IDs
DO $$
DECLARE
  main_menu_en_id UUID;
  main_menu_ar_id UUID;
  footer_menu_en_id UUID;
  footer_menu_ar_id UUID;
BEGIN
  -- Get menu IDs
  SELECT id INTO main_menu_en_id FROM cms_menus WHERE location = 'main-nav' AND locale = 'en';
  SELECT id INTO main_menu_ar_id FROM cms_menus WHERE location = 'main-nav' AND locale = 'ar';
  SELECT id INTO footer_menu_en_id FROM cms_menus WHERE location = 'footer-nav' AND locale = 'en';
  SELECT id INTO footer_menu_ar_id FROM cms_menus WHERE location = 'footer-nav' AND locale = 'ar';
  
  -- Insert main menu items (English)
  INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
  VALUES
  (main_menu_en_id, NULL, 'Home', '/', NULL, 1, 'en'),
  (main_menu_en_id, NULL, 'Products', '/products', NULL, 2, 'en'),
  (main_menu_en_id, NULL, 'Categories', '/categories', NULL, 3, 'en'),
  (main_menu_en_id, NULL, 'About', '/about', NULL, 4, 'en'),
  (main_menu_en_id, NULL, 'Contact', '/contact', NULL, 5, 'en');
  
  -- Insert main menu items (Arabic)
  INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
  VALUES
  (main_menu_ar_id, NULL, 'الرئيسية', '/', NULL, 1, 'ar'),
  (main_menu_ar_id, NULL, 'المنتجات', '/products', NULL, 2, 'ar'),
  (main_menu_ar_id, NULL, 'الفئات', '/categories', NULL, 3, 'ar'),
  (main_menu_ar_id, NULL, 'من نحن', '/about', NULL, 4, 'ar'),
  (main_menu_ar_id, NULL, 'اتصل بنا', '/contact', NULL, 5, 'ar');
  
  -- Insert footer menu items (English)
  INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
  VALUES
  (footer_menu_en_id, NULL, 'Shop', '#', NULL, 1, 'en'),
  (footer_menu_en_id, NULL, 'Company', '#', NULL, 2, 'en'),
  (footer_menu_en_id, NULL, 'Support', '#', NULL, 3, 'en'),
  (footer_menu_en_id, NULL, 'Legal', '#', NULL, 4, 'en');
  
  -- Get parent IDs for footer submenus
  DECLARE
    shop_id UUID;
    company_id UUID;
    support_id UUID;
    legal_id UUID;
  BEGIN
    SELECT id INTO shop_id FROM cms_menu_items WHERE menu_id = footer_menu_en_id AND title = 'Shop' AND locale = 'en';
    SELECT id INTO company_id FROM cms_menu_items WHERE menu_id = footer_menu_en_id AND title = 'Company' AND locale = 'en';
    SELECT id INTO support_id FROM cms_menu_items WHERE menu_id = footer_menu_en_id AND title = 'Support' AND locale = 'en';
    SELECT id INTO legal_id FROM cms_menu_items WHERE menu_id = footer_menu_en_id AND title = 'Legal' AND locale = 'en';
    
    -- Insert shop submenu items
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_en_id, shop_id, 'All Products', '/products', NULL, 1, 'en'),
    (footer_menu_en_id, shop_id, 'New Arrivals', '/products/new', NULL, 2, 'en'),
    (footer_menu_en_id, shop_id, 'Featured', '/products/featured', NULL, 3, 'en'),
    (footer_menu_en_id, shop_id, 'Sale', '/products/sale', NULL, 4, 'en');
    
    -- Insert company submenu items
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_en_id, company_id, 'About Us', '/about', NULL, 1, 'en'),
    (footer_menu_en_id, company_id, 'Careers', '/careers', NULL, 2, 'en'),
    (footer_menu_en_id, company_id, 'Our Story', '/story', NULL, 3, 'en'),
    (footer_menu_en_id, company_id, 'Press', '/press', NULL, 4, 'en');
    
    -- Insert support submenu items
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_en_id, support_id, 'Help Center', '/help', NULL, 1, 'en'),
    (footer_menu_en_id, support_id, 'Contact Us', '/contact', NULL, 2, 'en'),
    (footer_menu_en_id, support_id, 'Shipping', '/shipping', NULL, 3, 'en'),
    (footer_menu_en_id, support_id, 'Returns', '/returns', NULL, 4, 'en');
    
    -- Insert legal submenu items
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_en_id, legal_id, 'Terms of Service', '/terms', NULL, 1, 'en'),
    (footer_menu_en_id, legal_id, 'Privacy Policy', '/privacy', NULL, 2, 'en'),
    (footer_menu_en_id, legal_id, 'Cookie Policy', '/cookies', NULL, 3, 'en');
  END;
  
  -- Insert footer menu items (Arabic)
  INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
  VALUES
  (footer_menu_ar_id, NULL, 'تسوق', '#', NULL, 1, 'ar'),
  (footer_menu_ar_id, NULL, 'الشركة', '#', NULL, 2, 'ar'),
  (footer_menu_ar_id, NULL, 'الدعم', '#', NULL, 3, 'ar'),
  (footer_menu_ar_id, NULL, 'قانوني', '#', NULL, 4, 'ar');
  
  -- Get parent IDs for Arabic footer submenus
  DECLARE
    shop_ar_id UUID;
    company_ar_id UUID;
    support_ar_id UUID;
    legal_ar_id UUID;
  BEGIN
    SELECT id INTO shop_ar_id FROM cms_menu_items WHERE menu_id = footer_menu_ar_id AND title = 'تسوق' AND locale = 'ar';
    SELECT id INTO company_ar_id FROM cms_menu_items WHERE menu_id = footer_menu_ar_id AND title = 'الشركة' AND locale = 'ar';
    SELECT id INTO support_ar_id FROM cms_menu_items WHERE menu_id = footer_menu_ar_id AND title = 'الدعم' AND locale = 'ar';
    SELECT id INTO legal_ar_id FROM cms_menu_items WHERE menu_id = footer_menu_ar_id AND title = 'قانوني' AND locale = 'ar';
    
    -- Insert shop submenu items (Arabic)
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_ar_id, shop_ar_id, 'جميع المنتجات', '/products', NULL, 1, 'ar'),
    (footer_menu_ar_id, shop_ar_id, 'وصل حديثاً', '/products/new', NULL, 2, 'ar'),
    (footer_menu_ar_id, shop_ar_id, 'مميز', '/products/featured', NULL, 3, 'ar'),
    (footer_menu_ar_id, shop_ar_id, 'تخفيضات', '/products/sale', NULL, 4, 'ar');
    
    -- Insert company submenu items (Arabic)
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_ar_id, company_ar_id, 'من نحن', '/about', NULL, 1, 'ar'),
    (footer_menu_ar_id, company_ar_id, 'وظائف', '/careers', NULL, 2, 'ar'),
    (footer_menu_ar_id, company_ar_id, 'قصتنا', '/story', NULL, 3, 'ar'),
    (footer_menu_ar_id, company_ar_id, 'الصحافة', '/press', NULL, 4, 'ar');
    
    -- Insert support submenu items (Arabic)
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_ar_id, support_ar_id, 'مركز المساعدة', '/help', NULL, 1, 'ar'),
    (footer_menu_ar_id, support_ar_id, 'اتصل بنا', '/contact', NULL, 2, 'ar'),
    (footer_menu_ar_id, support_ar_id, 'الشحن', '/shipping', NULL, 3, 'ar'),
    (footer_menu_ar_id, support_ar_id, 'الإرجاع', '/returns', NULL, 4, 'ar');
    
    -- Insert legal submenu items (Arabic)
    INSERT INTO cms_menu_items (menu_id, parent_id, title, url, target, order_index, locale)
    VALUES
    (footer_menu_ar_id, legal_ar_id, 'شروط الخدمة', '/terms', NULL, 1, 'ar'),
    (footer_menu_ar_id, legal_ar_id, 'سياسة الخصوصية', '/privacy', NULL, 2, 'ar'),
    (footer_menu_ar_id, legal_ar_id, 'سياسة ملفات تعريف الارتباط', '/cookies', NULL, 3, 'ar');
  END;
END;
$$;
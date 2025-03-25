-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create cms_pages table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_sections table
CREATE TABLE IF NOT EXISTS cms_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id UUID NOT NULL REFERENCES cms_pages(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_blocks table
CREATE TABLE IF NOT EXISTS cms_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID NOT NULL REFERENCES cms_sections(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content JSONB NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_navigation table
CREATE TABLE IF NOT EXISTS cms_navigation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_ad_zones table
CREATE TABLE IF NOT EXISTS cms_ad_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_ads table
CREATE TABLE IF NOT EXISTS cms_ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  zone_id UUID NOT NULL REFERENCES cms_ad_zones(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  link_url TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_menus table
CREATE TABLE IF NOT EXISTS cms_menus (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_menu_items table
CREATE TABLE IF NOT EXISTS cms_menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  menu_id UUID NOT NULL REFERENCES cms_menus(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES cms_menu_items(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  order INTEGER NOT NULL DEFAULT 0,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cms_media table
CREATE TABLE IF NOT EXISTS cms_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  type TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create collections table
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  collection_id UUID REFERENCES collections(id) ON DELETE SET NULL,
  collection_slug TEXT,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_categories table
CREATE TABLE IF NOT EXISTS product_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  category_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_images table
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  sale_price DECIMAL(10, 2),
  inventory INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create product_variant_attributes table
CREATE TABLE IF NOT EXISTS product_variant_attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create users table (for public access to user profiles)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create wishlist_items table
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_method TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable row level security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can read their own data
CREATE POLICY "Users can read their own data" 
  ON users FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  USING (auth.uid() = id);

-- Users can read their own cart items
CREATE POLICY "Users can read their own cart items" 
  ON cart_items FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own cart items
CREATE POLICY "Users can insert their own cart items" 
  ON cart_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own cart items
CREATE POLICY "Users can update their own cart items" 
  ON cart_items FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can delete their own cart items
CREATE POLICY "Users can delete their own cart items" 
  ON cart_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Users can read their own wishlist items
CREATE POLICY "Users can read their own wishlist items" 
  ON wishlist_items FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can insert their own wishlist items
CREATE POLICY "Users can insert their own wishlist items" 
  ON wishlist_items FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishlist items
CREATE POLICY "Users can delete their own wishlist items" 
  ON wishlist_items FOR DELETE 
  USING (auth.uid() = user_id);

-- Users can read their own orders
CREATE POLICY "Users can read their own orders" 
  ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can read their own order items
CREATE POLICY "Users can read their own order items" 
  ON order_items FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()
  ));

-- Enable realtime for relevant tables
ALTER PUBLICATION supabase_realtime ADD TABLE cms_pages;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_sections;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_blocks;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_navigation;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_ad_zones;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_ads;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_menus;
ALTER PUBLICATION supabase_realtime ADD TABLE cms_menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE products;
ALTER PUBLICATION supabase_realtime ADD TABLE product_categories;
ALTER PUBLICATION supabase_realtime ADD TABLE product_images;
ALTER PUBLICATION supabase_realtime ADD TABLE product_variants;

-- Insert sample data for CMS pages
INSERT INTO cms_pages (title, slug, content, locale) VALUES
('Home Page', 'home', '<h1>Welcome to our E-Commerce Store</h1><p>This is the home page content.</p>', 'en'),
('About Us', 'about', '<h1>About Our Store</h1><p>Learn more about our company and mission.</p>', 'en'),
('Contact Us', 'contact', '<h1>Contact Us</h1><p>Get in touch with our team.</p>', 'en'),
('الصفحة الرئيسية', 'home', '<h1>مرحبًا بكم في متجرنا الإلكتروني</h1><p>هذا هو محتوى الصفحة الرئيسية.</p>', 'ar');

-- Insert sample data for CMS sections
INSERT INTO cms_sections (page_id, type, title, order, locale) 
VALUES 
((SELECT id FROM cms_pages WHERE slug = 'home' AND locale = 'en'), 'hero', 'Hero Section', 1, 'en'),
((SELECT id FROM cms_pages WHERE slug = 'home' AND locale = 'en'), 'featured_products', 'Featured Products', 2, 'en'),
((SELECT id FROM cms_pages WHERE slug = 'home' AND locale = 'en'), 'promotional', 'Promotional Banner', 3, 'en');

-- Insert sample data for CMS blocks
INSERT INTO cms_blocks (section_id, type, content, order, locale) 
VALUES 
(
  (SELECT id FROM cms_sections WHERE title = 'Hero Section' AND locale = 'en'), 
  'hero', 
  '{"title": "Summer Collection", "subtitle": "Discover our latest products", "cta_text": "Shop Now", "cta_link": "/products", "background_image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1400&q=80"}', 
  1, 
  'en'
),
(
  (SELECT id FROM cms_sections WHERE title = 'Featured Products' AND locale = 'en'), 
  'product_grid', 
  '{"title": "Featured Products", "products": [{"title": "Product 1", "price": "$29.99", "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80"}, {"title": "Product 2", "price": "$39.99", "image": "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80"}]}', 
  1, 
  'en'
),
(
  (SELECT id FROM cms_sections WHERE title = 'Promotional Banner' AND locale = 'en'), 
  'promo_banner', 
  '{"title": "Special Offer", "description": "Get 20% off on all products", "cta_text": "Shop Now", "cta_link": "/products/sale", "background_color": "#f8f9fa"}', 
  1, 
  'en'
);

-- Insert sample data for menus
INSERT INTO cms_menus (name, location, order, locale) VALUES
('Main Navigation', 'header', 1, 'en'),
('Footer Links', 'footer', 1, 'en'),
('القائمة الرئيسية', 'header', 1, 'ar'),
('روابط التذييل', 'footer', 1, 'ar');

-- Insert sample data for menu items
INSERT INTO cms_menu_items (menu_id, title, url, order, locale) VALUES
((SELECT id FROM cms_menus WHERE name = 'Main Navigation' AND locale = 'en'), 'Home', '/', 1, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Main Navigation' AND locale = 'en'), 'Products', '/products', 2, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Main Navigation' AND locale = 'en'), 'About', '/about', 3, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Main Navigation' AND locale = 'en'), 'Contact', '/contact', 4, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Footer Links' AND locale = 'en'), 'Terms & Conditions', '/terms', 1, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Footer Links' AND locale = 'en'), 'Privacy Policy', '/privacy', 2, 'en'),
((SELECT id FROM cms_menus WHERE name = 'Footer Links' AND locale = 'en'), 'FAQ', '/faq', 3, 'en');

-- Insert sample categories
INSERT INTO categories (name, slug, description, image_url, locale) VALUES
('Electronics', 'electronics', 'Electronic devices and accessories', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80', 'en'),
('Clothing', 'clothing', 'Fashion and apparel', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80', 'en'),
('Home & Garden', 'home-garden', 'Home decor and garden supplies', 'https://images.unsplash.com/photo-1501127122-f385ca6ddd9d?w=500&q=80', 'en'),
('Beauty', 'beauty', 'Beauty and personal care products', 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=500&q=80', 'en');

-- Insert sample products
INSERT INTO products (title, slug, description, price, sale_price, is_featured, locale) VALUES
('Premium Cotton T-Shirt', 'premium-cotton-t-shirt', 'High-quality cotton t-shirt with a comfortable fit and stylish design.', 29.99, 24.99, true, 'en'),
('Slim Fit Jeans', 'slim-fit-jeans', 'Classic slim fit jeans that offer both style and comfort for everyday wear.', 49.99, 39.99, true, 'en'),
('Wireless Headphones', 'wireless-headphones', 'Premium wireless headphones with noise cancellation and long battery life.', 129.99, NULL, true, 'en'),
('Leather Wallet', 'leather-wallet', 'Handcrafted genuine leather wallet with multiple card slots and coin pocket.', 34.99, 29.99, false, 'en'),
('Smart Watch', 'smart-watch', 'Feature-packed smartwatch with health tracking, notifications, and customizable faces.', 199.99, NULL, true, 'en'),
('Running Shoes', 'running-shoes', 'Lightweight and comfortable running shoes with superior cushioning and support.', 89.99, 79.99, false, 'en');

-- Link products to categories
INSERT INTO product_categories (product_id, category_id, category_slug) VALUES
((SELECT id FROM products WHERE slug = 'premium-cotton-t-shirt'), (SELECT id FROM categories WHERE slug = 'clothing'), 'clothing'),
((SELECT id FROM products WHERE slug = 'slim-fit-jeans'), (SELECT id FROM categories WHERE slug = 'clothing'), 'clothing'),
((SELECT id FROM products WHERE slug = 'wireless-headphones'), (SELECT id FROM categories WHERE slug = 'electronics'), 'electronics'),
((SELECT id FROM products WHERE slug = 'leather-wallet'), (SELECT id FROM categories WHERE slug = 'clothing'), 'clothing'),
((SELECT id FROM products WHERE slug = 'smart-watch'), (SELECT id FROM categories WHERE slug = 'electronics'), 'electronics'),
((SELECT id FROM products WHERE slug = 'running-shoes'), (SELECT id FROM categories WHERE slug = 'clothing'), 'clothing');

-- Add product images
INSERT INTO product_images (product_id, url, alt, order) VALUES
((SELECT id FROM products WHERE slug = 'premium-cotton-t-shirt'), 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&q=90', 'Premium Cotton T-Shirt', 1),
((SELECT id FROM products WHERE slug = 'slim-fit-jeans'), 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&q=90', 'Slim Fit Jeans', 1),
((SELECT id FROM products WHERE slug = 'wireless-headphones'), 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500&q=90', 'Wireless Headphones', 1),
((SELECT id FROM products WHERE slug = 'leather-wallet'), 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=500&q=90', 'Leather Wallet', 1),
((SELECT id FROM products WHERE slug = 'smart-watch'), 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&q=90', 'Smart Watch', 1),
((SELECT id FROM products WHERE slug = 'running-shoes'), 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=500&q=90', 'Running Shoes', 1);

-- Add product variants
INSERT INTO product_variants (product_id, name, sku, price, sale_price, inventory) VALUES
((SELECT id FROM products WHERE slug = 'premium-cotton-t-shirt'), 'Small', 'TSHIRT-S', 29.99, 24.99, 10),
((SELECT id FROM products WHERE slug = 'premium-cotton-t-shirt'), 'Medium', 'TSHIRT-M', 29.99, 24.99, 15),
((SELECT id FROM products WHERE slug = 'premium-cotton-t-shirt'), 'Large', 'TSHIRT-L', 29.99, 24.99, 8),
((SELECT id FROM products WHERE slug = 'slim-fit-jeans'), 'Size 30', 'JEANS-30', 49.99, 39.99, 12),
((SELECT id FROM products WHERE slug = 'slim-fit-jeans'), 'Size 32', 'JEANS-32', 49.99, 39.99, 18),
((SELECT id FROM products WHERE slug = 'slim-fit-jeans'), 'Size 34', 'JEANS-34', 49.99, 39.99, 14),
((SELECT id FROM products WHERE slug = 'wireless-headphones'), 'Black', 'HEADPHONES-BLK', 129.99, NULL, 20),
((SELECT id FROM products WHERE slug = 'wireless-headphones'), 'White', 'HEADPHONES-WHT', 129.99, NULL, 15),
((SELECT id FROM products WHERE slug = 'leather-wallet'), 'Brown', 'WALLET-BRN', 34.99, 29.99, 25),
((SELECT id FROM products WHERE slug = 'leather-wallet'), 'Black', 'WALLET-BLK', 34.99, 29.99, 30),
((SELECT id FROM products WHERE slug = 'smart-watch'), 'Black', 'WATCH-BLK', 199.99, NULL, 8),
((SELECT id FROM products WHERE slug = 'smart-watch'), 'Silver', 'WATCH-SLV', 199.99, NULL, 10),
((SELECT id FROM products WHERE slug = 'running-shoes'), 'Size 9', 'SHOES-9', 89.99, 79.99, 7),
((SELECT id FROM products WHERE slug = 'running-shoes'), 'Size 10', 'SHOES-10', 89.99, 79.99, 12),
((SELECT id FROM products WHERE slug = 'running-shoes'), 'Size 11', 'SHOES-11', 89.99, 79.99, 9);

-- Add variant attributes
INSERT INTO product_variant_attributes (variant_id, name, value) VALUES
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-S'), 'Size', 'Small'),
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-S'), 'Color', 'White'),
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-M'), 'Size', 'Medium'),
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-M'), 'Color', 'White'),
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-L'), 'Size', 'Large'),
((SELECT id FROM product_variants WHERE sku = 'TSHIRT-L'), 'Color', 'White'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-30'), 'Size', '30'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-30'), 'Color', 'Blue'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-32'), 'Size', '32'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-32'), 'Color', 'Blue'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-34'), 'Size', '34'),
((SELECT id FROM product_variants WHERE sku = 'JEANS-34'), 'Color', 'Blue'),
((SELECT id FROM product_variants WHERE sku = 'HEADPHONES-BLK'), 'Color', 'Black'),
((SELECT id FROM product_variants WHERE sku = 'HEADPHONES-WHT'), 'Color', 'White'),
((SELECT id FROM product_variants WHERE sku = 'WALLET-BRN'), 'Color', 'Brown'),
((SELECT id FROM product_variants WHERE sku = 'WALLET-BLK'), 'Color', 'Black'),
((SELECT id FROM product_variants WHERE sku = 'WATCH-BLK'), 'Color', 'Black'),
((SELECT id FROM product_variants WHERE sku = 'WATCH-SLV'), 'Color', 'Silver'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-9'), 'Size', '9'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-9'), 'Color', 'Black/Red'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-10'), 'Size', '10'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-10'), 'Color', 'Black/Red'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-11'), 'Size', '11'),
((SELECT id FROM product_variants WHERE sku = 'SHOES-11'), 'Color', 'Black/Red');

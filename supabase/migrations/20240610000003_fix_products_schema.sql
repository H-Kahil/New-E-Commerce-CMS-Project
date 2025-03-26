-- Fix the products table schema by adding missing columns
ALTER TABLE IF EXISTS products
ADD COLUMN IF NOT EXISTS sku TEXT;

-- Ensure all required columns exist
ALTER TABLE IF EXISTS products
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Create a view to properly join products with categories
CREATE OR REPLACE VIEW product_categories_view AS
SELECT 
  pc.id,
  pc.product_id,
  pc.category_id,
  pc.locale,
  c.name as category_name,
  c.slug as category_slug,
  c.description as category_description
FROM 
  product_categories pc
JOIN 
  categories c ON pc.category_id = c.id;

-- Enable realtime for the view
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'product_categories_view'
  ) THEN
    alter publication supabase_realtime add table product_categories_view;
  END IF;
END
$$;
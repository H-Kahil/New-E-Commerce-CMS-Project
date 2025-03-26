-- Add foreign key relationship between products and categories through product_categories
CREATE OR REPLACE VIEW product_with_categories AS
SELECT 
  p.*,
  c.id as category_id,
  c.name as category_name,
  c.slug as category_slug,
  c.description as category_description
FROM 
  products p
LEFT JOIN 
  product_categories pc ON p.id = pc.product_id
LEFT JOIN 
  categories c ON pc.category_id = c.id;

-- Enable realtime for the view
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'product_with_categories'
  ) THEN
    alter publication supabase_realtime add table product_with_categories;
  END IF;
END
$$;
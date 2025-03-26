-- Add stock column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 0;

-- Enable realtime for products table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'products'
  ) THEN
    alter publication supabase_realtime add table products;
  END IF;
END
$$;
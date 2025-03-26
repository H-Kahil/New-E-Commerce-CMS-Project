-- Update the categories table to support hierarchical structure
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id);
ALTER TABLE categories ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 0;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add name_en and name_ar columns for multilingual support
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ar VARCHAR;

-- Update existing records to use name_en from name
UPDATE categories SET name_en = name WHERE name_en IS NULL;

-- Add foreign key constraint for parent_id
ALTER TABLE categories ADD CONSTRAINT fk_parent_category
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE;

-- Add this table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE categories;

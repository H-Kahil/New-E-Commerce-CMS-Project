-- Drop existing tables that will be replaced
DROP TABLE IF EXISTS product_variant_attributes;
DROP TABLE IF EXISTS product_variants;

-- Create new variants table for attribute names (like "Size", "Color")
CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create new variant_values table for attribute values (like "Small", "Medium", "Large")
CREATE TABLE IF NOT EXISTS variant_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
  value VARCHAR(255) NOT NULL,
  locale VARCHAR(10) NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable realtime for these tables
alter publication supabase_realtime add table variants;
alter publication supabase_realtime add table variant_values;

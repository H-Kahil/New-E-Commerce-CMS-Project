-- Create variants table if it doesn't exist
CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create variant_values table if it doesn't exist
CREATE TABLE IF NOT EXISTS variant_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  variant_id UUID NOT NULL,
  value TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT variant_values_variant_id_fkey FOREIGN KEY (variant_id) REFERENCES variants(id) ON DELETE CASCADE
);

-- Enable realtime for these tables
ALTER PUBLICATION supabase_realtime ADD TABLE variants;
ALTER PUBLICATION supabase_realtime ADD TABLE variant_values;

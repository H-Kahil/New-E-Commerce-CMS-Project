-- Add foreign key constraint to variant_values table
ALTER TABLE variant_values
ADD CONSTRAINT variant_values_variant_id_fkey
FOREIGN KEY (variant_id)
REFERENCES variants(id)
ON DELETE CASCADE;

#!/bin/bash

# Check if required environment variables are set
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_KEY" ]; then
  echo "Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set"
  exit 1
 fi

# Get migration file path from command line argument or use default
MIGRATION_FILE=${1:-"./migrations/20240601000001_create_initial_tables.sql"}

# Check if the migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
  echo "Error: Migration file not found: $MIGRATION_FILE"
  exit 1
fi

# Read the migration file content
SQL_CONTENT=$(cat "$MIGRATION_FILE")

# Create a temporary file for the payload
TEMP_FILE=$(mktemp)

# Write the JSON payload to the temporary file
echo '{"query":"'"$SQL_CONTENT"'"}' > "$TEMP_FILE"

# Execute the curl command using the temporary file
echo "Executing migration..."
curl -X POST "$SUPABASE_URL/rest/v1/rpc/execute_sql" \
  -H "apikey: $SUPABASE_SERVICE_KEY" \
  -H "Authorization: Bearer $SUPABASE_SERVICE_KEY" \
  -H "Content-Type: application/json" \
  -d @"$TEMP_FILE"

# Clean up the temporary file
rm "$TEMP_FILE"

echo "\nMigration completed."

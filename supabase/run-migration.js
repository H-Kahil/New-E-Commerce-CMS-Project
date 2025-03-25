// Simple script to run Supabase migrations using the REST API
import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// Get environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables must be set",
  );
  process.exit(1);
}

// Get migration file path from command line argument or use default
const migrationFile =
  process.argv[2] || "./migrations/20240601000001_create_initial_tables.sql";
const migrationPath = path.resolve(process.cwd(), migrationFile);

// Read the migration file
let sqlContent;
try {
  sqlContent = fs.readFileSync(migrationPath, "utf8");
  console.log(`Read migration file: ${migrationPath}`);
} catch (error) {
  console.error(`Error reading migration file: ${error.message}`);
  process.exit(1);
}

// Prepare the request payload
const payload = JSON.stringify({
  query: sqlContent,
});

// Create a temporary file for the payload
const tempFile = path.resolve(process.cwd(), "temp-payload.json");
fs.writeFileSync(tempFile, payload);

try {
  // Execute the curl command using the temporary file
  const command = `curl -X POST "${supabaseUrl}/rest/v1/rpc/execute_sql" \
    -H "apikey: ${supabaseKey}" \
    -H "Authorization: Bearer ${supabaseKey}" \
    -H "Content-Type: application/json" \
    -d @${tempFile}`;

  console.log("Executing migration...");
  const output = execSync(command, { encoding: "utf8" });
  console.log("Migration executed successfully!");
  console.log(output);
} catch (error) {
  console.error("Error executing migration:");
  console.error(error.message);
} finally {
  // Clean up the temporary file
  fs.unlinkSync(tempFile);
}

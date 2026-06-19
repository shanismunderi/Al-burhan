import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
  if (match) {
    let value = match[2] || '';
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1);
    }
    env[match[1]] = value;
  }
});

const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Connecting to Supabase at:", supabaseUrl);
  
  // Try querying profiles table
  const { data: profiles, error: err1 } = await supabase.from('profiles').select('*').limit(5);
  if (err1) {
    console.error("Error querying profiles table:", err1);
  } else {
    console.log("Successfully queried profiles table. Found rows:", profiles.length);
    console.log("Sample profile rows:", profiles);
  }
}

test();

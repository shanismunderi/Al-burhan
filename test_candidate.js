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

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("1. Signing in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@burhan.local',
    password: 'burhan@540'
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }

  const token = authData.session.access_token;
  console.log("Successfully logged in. Token starts with:", token.substring(0, 15));

  // Initialize a request-scoped client for admin
  const adminClient = createClient(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  });

  console.log("2. Querying user_roles as admin...");
  const { data: roles, error: rolesError } = await adminClient.from('user_roles').select('*');
  if (rolesError) {
    console.error("Error reading roles:", rolesError);
  } else {
    console.log("Roles found:", roles);
  }

  console.log("3. Querying profiles as admin...");
  const { data: profiles, error: profilesError } = await adminClient.from('profiles').select('*');
  if (profilesError) {
    console.error("Error reading profiles:", profilesError);
  } else {
    console.log("Profiles found:", profiles.length);
  }

  console.log("4. Attempting to create a mock user via signUp (simulating no service role key)...");
  const randomSuffix = Math.floor(Math.random() * 10000);
  const testEmail = `testuser-${randomSuffix}@example.com`;
  const testCode = `TEST${randomSuffix}`;
  const testName = `Test Member A & Test Member B`;

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: testEmail,
    password: testCode,
    options: {
      data: {
        username: testCode,
        display_name: testName
      }
    }
  });

  if (signUpError) {
    console.error("SignUp error:", signUpError);
    return;
  }

  const createdUserId = signUpData.user.id;
  console.log("Mock user signed up. User ID:", createdUserId);

  console.log("5. Updating profile as admin...");
  const { data: updateData, error: updateError } = await adminClient
    .from('profiles')
    .update({
      access_code: testCode,
      display_name: testName,
      username: testCode,
      member1_name: 'Test Member A',
      member2_name: 'Test Member B'
    })
    .eq('id', createdUserId)
    .select();

  if (updateError) {
    console.error("Profile update error:", updateError);
  } else {
    console.log("Profile update success! Result:", updateData);
  }
}

test();

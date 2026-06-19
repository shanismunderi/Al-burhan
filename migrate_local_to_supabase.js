import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Parse .env manually and populate process.env
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

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

const db = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'db.json'), 'utf-8'));

async function migrate() {
  console.log("1. Signing in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin@burhan.local',
    password: 'burhan@540'
  });

  if (authError) {
    console.error("Auth error:", authError);
    return;
  }
  console.log("Admin logged in successfully.");

  // Migrate Quizzes
  console.log("2. Migrating quizzes...");
  for (const quiz of db.quizzes) {
    const quizId = quiz.id.replace('q', '9');
    console.log(`Upserting quiz: ${quiz.title} (${quizId})`);
    const { error } = await supabase.from('quizzes').upsert({
      id: quizId,
      title: quiz.title,
      instructions: quiz.instructions,
      duration_minutes: quiz.duration_minutes,
      negative_marks: quiz.negative_marks,
      is_active: quiz.is_active,
      randomize: quiz.randomize,
      created_at: quiz.created_at
    });
    if (error) console.error("Error upserting quiz:", error);
  }

  // Migrate Questions
  console.log("3. Migrating questions...");
  for (const q of db.questions) {
    const quizId = q.quiz_id.replace('q', '9');
    console.log(`Upserting question: ${q.question_text}`);
    const { error } = await supabase.from('questions').upsert({
      id: q.id,
      quiz_id: quizId,
      question_type: q.question_type,
      question_text: q.question_text,
      option_a: q.option_a,
      option_b: q.option_b,
      option_c: q.option_c,
      option_d: q.option_d,
      correct_answer: q.correct_answer,
      marks: q.marks,
      position: q.position,
      created_at: q.created_at
    });
    if (error) console.error("Error upserting question:", error);
  }

  // Migrate Participants
  console.log("4. Migrating participants...");
  for (const user of db.users) {
    if (user.email === 'admin@burhan.local') continue;

    console.log(`\nProcessing participant: ${user.user_metadata.display_name} (${user.user_metadata.username})`);
    
    // Check if profile already exists in Supabase
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('access_code', user.user_metadata.username)
      .maybeSingle();

    let userId = existingProfile?.id;

    if (!userId) {
      console.log(`Creating auth user for ${user.email}...`);
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            username: user.user_metadata.username,
            display_name: user.user_metadata.display_name
          }
        }
      });

      if (signUpErr) {
        console.error(`Error signing up user ${user.email}:`, signUpErr.message);
        continue;
      }
      userId = signUpData.user?.id;
      console.log(`User created with ID: ${userId}`);

      // Log back in as admin
      await supabase.auth.signInWithPassword({
        email: 'admin@burhan.local',
        password: 'burhan@540'
      });
    } else {
      console.log(`User already exists with ID: ${userId}`);
    }

    if (userId) {
      // Find corresponding profile in db.json
      const profile = db.profiles.find(p => p.username === user.user_metadata.username);
      if (profile) {
        console.log(`Updating profile table for ${userId}...`);
        const { error: profileErr } = await supabase
          .from('profiles')
          .update({
            access_code: profile.access_code,
            display_name: profile.display_name,
            username: profile.username,
            member1_name: profile.member1_name,
            member2_name: profile.member2_name,
            created_at: profile.created_at
          })
          .eq('id', userId);
        if (profileErr) console.error("Error updating profile:", profileErr);
      }

      // Check user role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (!existingRole) {
        console.log(`Creating user role for ${userId}...`);
        const { error: roleErr } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: 'participant'
          });
        if (roleErr) console.error("Error inserting role:", roleErr);
      }
    }
  }

  console.log("\nMigration complete!");
}

migrate();

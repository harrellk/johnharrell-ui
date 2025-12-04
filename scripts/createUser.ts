// scripts/createUser.ts

import { createClient } from "@supabase/supabase-js";
import "dotenv/config"; // so you can load env vars from .env.local or .env

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("❌ Missing env vars: SUPABASE URL or SERVICE ROLE KEY");
    process.exit(1);
  }

  // Admin client (requires service_role key)
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const email = process.argv[2];

  if (!email) {
    console.error("❌ You must pass an email. Example:");
    console.error("   npx ts-node scripts/createUser.ts person@example.com");
    process.exit(1);
  }

  console.log(`➡️  Creating user: ${email}`);

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true, // no confirmation needed
  });

  if (error) {
    console.error("❌ Error creating user:", error);
    process.exit(1);
  }

  console.log("✅ User created successfully:");
  console.log(data);
}

main();

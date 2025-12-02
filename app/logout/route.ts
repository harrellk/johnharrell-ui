import { supabaseServer } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = supabaseServer();
  await supabase.auth.signOut();
  return NextResponse.redirect("/login");
}

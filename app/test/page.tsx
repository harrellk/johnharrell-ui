import { supabaseServer } from "@/lib/supabaseServer";

export default async function TestPage() {
  const supabase = supabaseServer();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <h1 className="text-2xl">Auth Test Page</h1>
      <p className="mt-4 text-lg">
        Welcome, <strong>{user?.email}</strong>
      </p>

      <a
        href="/app/logout"
        className="inline-block mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </a>
    </div>
  );
}

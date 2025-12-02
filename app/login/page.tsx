"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const supabase = supabaseBrowser();
  const params = useSearchParams();
  const redirect = params.get("redirectedFrom") || "/app";
  
  const [email, setEmail] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` }
    });

    if (error) alert(error.message);
    else alert("Magic link sent. Check your email.");
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>

        <input
          type="email"
          placeholder="Your Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send Magic Link
        </button>
      </form>
    </div>
  );
}

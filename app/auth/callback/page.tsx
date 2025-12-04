"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    async function processMagicLink() {
      const code = params.get("code");

      if (!code) {
        router.replace("/login");
        return;
      }

      // EXCHANGE MAGIC LINK CODE → sets cookies in browser
      const { error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Magic link error:", error);
        router.replace("/login");
        return;
      }

      router.replace("/dashboard");
    }

    processMagicLink();
  }, [params, router]);

  return <p className="p-6 text-lg">Signing you in…</p>;
}

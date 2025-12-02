"use client";

import { useState, useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";

export default function TeamSearch({ sport }: { sport: string }) {
  const supabase = supabaseBrowser();  // ✅ now defined

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const delay = setTimeout(() => {
      searchTeams(query);
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const searchTeams = async (term: string) => {
    console.log("Searching:", term);

    const tableName =
      sport === "football" ? "fb_teams" :
      sport === "basketball" ? "bb_teams" : null;

    console.log("Table:", tableName);

    const { data, error } = await supabase
      .from(tableName!)
      .select("cn, team, shortname, city")
      .ilike("team", `%${term}%`)
      .order("team");

    console.log("Supabase error:", error);
    console.log("Supabase data:", data);

    if (error) {
      setResults([]);
      return;
    }

    setResults(data || []);
  };

  return (
    <div className="w-full">
      <input
        type="text"
        className="border border-gray-400 rounded p-2 w-full mb-3 text-black"
        placeholder={`Search ${sport} teams...`}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {results.length > 0 && (
        <div className="bg-white shadow rounded-md p-2">
          {results.map((team) => (
            <Link
              key={team.cn}
              href={`/${sport}/teams/${team.cn}`}
              className="block px-2 py-1 hover:bg-gray-100 text-black"
            >
              {team.team} {team.city ? `(${team.city})` : ""}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

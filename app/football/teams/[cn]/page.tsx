import { supabase } from "@/lib/supabaseClient";
import TeamHeader from "@/components/TeamHeader";
import ScheduleTable from "@/components/ScheduleTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TeamPage({
  params,
}: {
  params: { cn: string };
}) {
  const { cn } = params;
  const teamCn = parseInt(cn, 10);

  // Fetch team info
  const { data: team } = await supabase
    .from("fb_teams")
    .select("*")
    .eq("cn", teamCn)
    .single();

  // Fetch schedule & results
  const { data: schedule } = await supabase
    .from("fb_sked")
    .select(
      `
        id,
        game_date,
        visitor,
        home,
        v_score,
        h_score,
        ot_count,
        vtn,
        htn,
        nc,
        g,
        tny
      `
    )
    .or(`vtn.eq.${teamCn},htn.eq.${teamCn}`)
    .order("game_date", { ascending: true });

  // Compute season record
  let wins = 0;
  let losses = 0;
  let ties = 0;

  if (schedule) {
    for (const g of schedule) {
      const isHome = g.htn === teamCn;
      const teamScore = isHome ? g.h_score : g.v_score;
      const oppScore = isHome ? g.v_score : g.h_score;

      if (teamScore == null || oppScore == null) continue;

      if (teamScore > oppScore) wins++;
      else if (teamScore < oppScore) losses++;
      else ties++;
    }
  }

  return (
    <div className="p-8">
      <TeamHeader team={team} />

      <h2 className="text-2xl font-semibold mb-1">Schedule & Results</h2>

      <p className="text-gray-700 mb-4">
        Record: {wins}–{losses}
        {ties > 0 ? `–${ties}` : ""}
      </p>

      {!schedule?.length && <p>No games found.</p>}

      {!!schedule?.length && (
        <ScheduleTable games={schedule} teamCn={teamCn} />
      )}
    </div>
  );
}

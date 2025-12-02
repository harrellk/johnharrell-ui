import { supabaseServer } from "@/lib/supabaseServer";
import TeamHeader from "@/components/TeamHeader";
import ScheduleTable from "@/components/ScheduleTable";

export default async function TeamPage({
  params,
}: {
  params: { cn: string };
}) {
  const supabase = supabaseServer();

  const teamCn = parseInt(params.cn, 10);

  const { data: team } = await supabase
    .from("fb_teams")
    .select("*")
    .eq("cn", teamCn)
    .single();

  const { data: schedule } = await supabase
    .from("fb_sked")
    .select("*")
    .or(`vtn.eq.${teamCn},htn.eq.${teamCn}`)
    .order("game_date", { ascending: true });

  return (
    <div className="p-8">
      <TeamHeader team={team} />
      <h2 className="text-2xl font-semibold mb-4">Schedule</h2>

      {!schedule?.length && <p>No games found.</p>}

      {schedule?.length > 0 && (
        <ScheduleTable games={schedule} teamCn={teamCn} />
      )}
    </div>
  );
}

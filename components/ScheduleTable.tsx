"use client";

import Link from "next/link";

export default function ScheduleTable({
  games,
  teamCn,
}: {
  games: any[];
  teamCn: number;
}) {
  if (!games || games.length === 0) {
    return <p>No games found.</p>;
  }

  const formatDate = (d: string) => {
    const date = new Date(d + "T00:00:00");
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const getGameType = (g: any) => {
    // John Harrell style classification
    // g: 1 = Sectional, 2 = Regional, 3 = SemiState, 4 = State
    if (!g.g) return "Regular";

    switch (g.g) {
      case 1:
        return "Sectional";
      case 2:
        return "Regional";
      case 3:
        return "Semi-State";
      case 4:
        return "State Finals";
      default:
        return "Regular";
    }
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400 text-gray-800">
            <th className="text-left py-2 pr-4">Date</th>
            <th className="text-left py-2 pr-4">Opponent</th>
            <th className="text-left py-2 pr-4">Location</th>
            <th className="text-left py-2 pr-4">Result</th>
            <th className="text-left py-2 pr-4">Game Type</th>
          </tr>
        </thead>

        <tbody>
          {games.map((g) => {
            const isHome = g.htn === teamCn;
            const opponentCn = isHome ? g.vtn : g.htn;
            const opponentName = isHome ? g.visitor : g.home;

            const loc =
              g.nc === "Y" ? "Neutral" : isHome ? "Home" : "Away";

            // Score
            const teamScore = isHome ? g.h_score : g.v_score;
            const oppScore = isHome ? g.v_score : g.h_score;

            const scoreAvailable =
              teamScore !== null &&
              teamScore !== undefined &&
              oppScore !== null &&
              oppScore !== undefined;

            let result: "W" | "L" | "T" | null = null;
            if (scoreAvailable) {
              if (teamScore > oppScore) result = "W";
              else if (teamScore < oppScore) result = "L";
              else result = "T";
            }

            return (
              <tr
                key={g.id}
                className="border-b border-gray-300 hover:bg-gray-100 transition"
              >
                {/* Date */}
                <td className="py-2 pr-4 text-gray-900 font-medium">
                  {formatDate(g.game_date)}
                </td>

                {/* Opponent */}
                <td className="py-2 pr-4">
                  <Link
                    href={`/football/teams/${opponentCn}`}
                    className="text-crimson hover:underline font-semibold"
                  >
                    {opponentName}
                  </Link>
                </td>

                {/* Location */}
                <td className="py-2 pr-4 text-gray-800">{loc}</td>

                {/* Result */}
                <td className="py-2 pr-4">
                  {!scoreAvailable ? (
                    <span className="text-gray-700">—</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className={
                          result === "W"
                            ? "text-green-600 font-bold"
                            : result === "L"
                            ? "text-red-600 font-bold"
                            : "text-yellow-600 font-bold"
                        }
                      >
                        {result}
                      </span>

                      <span className="text-gray-900 font-semibold">
                        {teamScore}–{oppScore}
                      </span>

                      {g.ot_count > 0 && (
                        <span className="text-xs text-gray-600">
                          ({g.ot_count} OT)
                        </span>
                      )}
                    </div>
                  )}
                </td>

                {/* Game Type */}
                <td className="py-2 pr-4 text-gray-800">
                  {getGameType(g)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}



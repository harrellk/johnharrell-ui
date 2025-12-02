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

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-400 text-gray-700">
            <th className="text-left py-2 pr-4">Date</th>
            <th className="text-left py-2 pr-4">Opponent</th>
            <th className="text-left py-2 pr-4">Location</th>
            <th className="text-left py-2 pr-4">Result</th>
          </tr>
        </thead>

        <tbody>
          {games.map((g) => {
            const isHome = g.htn === teamCn;
            const opponentCn = isHome ? g.vtn : g.htn;
            const opponentName = isHome ? g.visitor : g.home;

            const loc =
              g.nc === "Y" ? "Neutral" : isHome ? "Home" : "Away";

            return (
              <tr
                key={g.id}
                className="border-b border-gray-300 hover:bg-gray-200 transition"
              >
                <td className="py-2 pr-4 text-gray-900">
                  {formatDate(g.game_date)}
                </td>

                <td className="py-2 pr-4">
                  <Link
                    href={`/football/teams/${opponentCn}`}
                    className="text-crimson hover:underline font-medium"
                  >
                    {opponentName}
                  </Link>
                </td>

                <td className="py-2 pr-4 text-gray-800">{loc}</td>

                <td className="py-2 pr-4 text-gray-600">—</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}


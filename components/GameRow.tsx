"use client";

import Link from "next/link";

export default function GameRow({
  game,
  teamId,
}: {
  game: any;
  teamId: number;
}) {
  const isHome = game.htn === teamId;
  const isAway = game.vtn === teamId;

  const opponent = isHome ? game.visitor : game.home;
  const opponentId = isHome ? game.vtn : game.htn;

  const location = game.nc
    ? "N"
    : isHome
    ? "H"
    : "A";

  // Format date
  const d = new Date(game.game_date);
  const dateStr = d.toLocaleDateString("en-US", {
    month: "M",
    day: "numeric",
  });

  // Determine result placeholder (you probably have score info elsewhere)
  const result = game.s ? game.s : "";

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-1">{dateStr}</td>

      <td className="py-1">
        <Link
          href={`/football/teams/${opponentId}`}
          className="text-crimson hover:underline"
        >
          {opponent}
        </Link>
      </td>

      <td className="py-1">{location}</td>

      <td className="py-1">{result}</td>
    </tr>
  );
}

import Link from "next/link";

export default function TeamHeader({ team }: any) {
  const { team: name, city, mascot, colors, stadium, latitude, longitude } = team;

  const mapsUrl =
    latitude && longitude
      ? `https://www.google.com/maps?q=${latitude},${longitude}`
      : null;

  return (
    <div className="mb-10">

      {/* Team Name */}
      <h1 className="text-4xl font-bold text-crimson mb-2">{name}</h1>

      {/* City + Mascot */}
      {(city || mascot) && (
        <p className="text-lg text-gray-600 mb-2">
          {city} {mascot ? `• ${mascot}` : ""}
        </p>
      )}

      {/* School Colors */}
      {colors && (
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Colors:</span> {colors}
        </p>
      )}

      {/* Stadium */}
      {stadium && (
        <p className="text-gray-700 mb-1">
          <span className="font-semibold">Stadium:</span> {stadium}
          {mapsUrl && (
            <>
              {" "}<span>•</span>{" "}
              <Link
                href={mapsUrl}
                target="_blank"
                className="text-crimson hover:underline"
              >
                Map
              </Link>
            </>
          )}
        </p>
      )}

      <hr className="border-gray-300 mt-4" />
    </div>
  );
}

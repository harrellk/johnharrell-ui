import TeamSearch from "@/components/TeamSearch";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-crimson">
        Indiana High School Sports
      </h1>

      <p className="text-lg text-gray-700">
        Search teams, view schedules, and explore results.
      </p>

      <div>
        <TeamSearch sport="football" />
      </div>

      <div className="flex gap-4 mt-6">
        <a
          href="/football"
          className="bg-crimson text-cream px-6 py-3 rounded shadow font-semibold"
        >
          Football
        </a>
        <a
          href="/basketball"
          className="bg-crimson text-cream px-6 py-3 rounded shadow font-semibold"
        >
          Basketball
        </a>
      </div>
    </div>
  );
}

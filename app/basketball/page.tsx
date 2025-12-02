import TeamSearch from "@/components/TeamSearch";

export default function BasketballPage() {
  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-crimson mb-4">Basketball Teams</h1>
      <p className="text-gray-700 mb-4">Search and explore Indiana high school basketball teams.</p>

      <TeamSearch sport="basketball" />
    </div>
  );
}

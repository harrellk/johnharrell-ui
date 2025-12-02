import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full bg-crimson text-cream shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          John Harrell
        </Link>

        <nav className="flex gap-6 text-lg font-medium">
          <Link href="/football" className="hover:underline">Football</Link>
          <Link href="/basketball" className="hover:underline">Basketball</Link>
          <Link href="/search" className="hover:underline">Search</Link>
        </nav>
      </div>
    </header>
  );
}

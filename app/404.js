import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-b from-zinc-50 to-white">
      <div className="text-center max-w-md">
        <h1 className="text-4xl font-bold mb-3 text-zinc-900">
          404 - Page Not Found
        </h1>
        <p className="mb-8 text-zinc-600">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>

        <Link
          href="/"
          className="px-5 py-3 bg-zinc-900 text-white rounded-lg font-medium hover:bg-zinc-800 transition-colors"
        >
          Return to home
        </Link>
      </div>
    </div>
  );
}

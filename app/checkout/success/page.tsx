import Link from "next/link";
import Image from "next/image";
export default async function CheckoutSuccess({ searchParams }) {
  const params = await searchParams;

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-[320px] sm:max-w-md bg-black rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border-4 sm:border-6 border-white/80">
          <div className="p-5 sm:p-8">
            <div className="flex justify-center mb-6">
              <Image
                src="/images/success-animation.gif"
                alt="NoteSnap Logo"
                width={80}
                height={80}
              />
            </div>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white text-center mb-2 drop-shadow-lg">
              Payment Successful!
            </h1>
            <p className="text-white/80 text-sm sm:text-base text-center mb-6 sm:mb-8 font-medium">
              Welcome to NoteSnap Pro. You now have access to all premium
              features.
            </p>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-medium text-white mb-3">
                Your Pro Features:
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white text-sm sm:text-base">
                    Unlimited PDF uploads
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white text-sm sm:text-base">
                    Advanced AI models (GPT-4 & Claude)
                  </span>
                </li>
                <li className="flex items-start">
                  <svg
                    className="h-5 w-5 text-white mr-3 flex-shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      fill="none"
                      strokeWidth="2"
                    />
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white text-sm sm:text-base">
                    Priority email support
                  </span>
                </li>
              </ul>
            </div>

            <Link
              href="/dashboard"
              className="w-full block py-2.5 sm:py-3.5 bg-gradient-to-b from-zinc-900 to-zinc-700 border border-zinc-700 text-white text-center rounded-lg font-medium cursor-pointer hover:bg-zinc-100 hover:shadow-md hover:scale-105 transition-all duration-300 ease-in-out text-sm sm:text-lg"
            >
              Go to Dashboard
            </Link>

            <p className="text-xs sm:text-sm text-center mt-4 sm:mt-5 text-white/60">
              Check your email for your receipt and account details.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

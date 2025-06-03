"use client";

import { cn } from "@/lib/utlis";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function SignIn() {
  const { signInWithGoogle, user, loading, error, clearError } = useAuth();
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [runConfetti, setRunConfetti] = useState(true);
  const [confettiSize, setConfettiSize] = useState({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRunConfetti(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Get card dimensions for confetti
  useEffect(() => {
    if (cardRef.current) {
      setConfettiSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      });
    }
  }, [runConfetti]);

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  useEffect(() => {
    clearError();
  }, [isSignUpMode, clearError]);

  return (
    <div
      className={cn(
        "flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4",
        outfit.className
      )}
    >
      <div
        ref={cardRef}
        className="w-full max-w-md space-y-6 z-10 bg-white p-8 sm:p-10 rounded-xl shadow-2xl relative overflow-hidden"
      >
        {runConfetti && confettiSize.width > 0 && (
          <Confetti
            recycle={false}
            numberOfPieces={200}
            width={confettiSize.width}
            height={confettiSize.height}
          />
        )}
        <div className="text-center">
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-slate-900">
            NoteSnap
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Join <span className="font-bold text-indigo-600">10,000+</span>{" "}
            happy students.
          </p>

          {/* <div className="mt-8 mb-6 text-sm">
            {isSignUpMode ? (
              <span>
                Already have an account?{" "}
                <button
                  onClick={() => setIsSignUpMode(false)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don&apos;t have an account?{" "}
                <button
                  onClick={() => setIsSignUpMode(true)}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign Up
                </button>
              </span>
            )}
          </div> */}

          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-800">
            {isSignUpMode ? "Create your account" : "Sign in to your account"}
          </h2>
          <p className="mt-3 text-md text-slate-500">
            {isSignUpMode
              ? "Get started in seconds by creating an account."
              : "Welcome back! Please sign in to continue."}
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 ring-1 ring-red-200">
            <div className="flex">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading} // Disable button while loading
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-5 py-3.5 text-base font-medium text-slate-700 shadow-sm hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-150 ease-in-out group disabled:opacity-70 cursor-pointer disabled:cursor-not-allowed"
          >
            <FcGoogle className="h-6 w-6 transition-transform duration-150 group-hover:scale-110" />
            <span>
              {loading
                ? "Signing in..."
                : isSignUpMode
                ? "Sign up with Google"
                : "Continue with Google"}
            </span>
          </button>
        </div>

        <p className="text-center text-sm text-slate-500 pt-6">
          By continuing, you agree to NoteSnap&apos;s <br />
          <a
            href="/terms-of-service"
            className="font-medium text-indigo-500 hover:text-indigo-700 underline"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href="/privacypolicy"
            className="font-medium text-indigo-500 hover:text-indigo-700 underline"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export default function SignIn() {
  const { signInWithGoogle, user, loading, error, clearError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleGoogleSignIn = async () => {
    try {
      clearError();
      await signInWithGoogle();
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen w-full flex items-center justify-center bg-[#FCFCFF] relative overflow-hidden",
        outfit.className
      )}
    >
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Mesh */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_0%_0%,_#4F46E5_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_100%,_#7C3AED_0%,_transparent_50%)]" />
        </div>

        {/* Animated Gradient Orbs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-blue-400/30 via-indigo-500/30 to-purple-600/30 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-purple-400/30 via-violet-500/30 to-indigo-600/30 blur-3xl"
        />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="inline-block">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 rounded-2xl shadow-xl flex items-center justify-center transform -rotate-6 group transition-all duration-300 hover:rotate-0">
                <span className="text-4xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                  N
                </span>
                <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-gradient-to-br from-indigo-500/10 to-purple-600/10 rounded-2xl transform rotate-6" />
            </div>
          </div>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl shadow-indigo-500/10 border border-white/30 relative overflow-hidden"
        >
          {/* Card Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/20 pointer-events-none" />

          <div className="relative">
            {/* Header */}
            <div className="text-center mb-10">
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent mb-3"
              >
                Welcome to NoteSnap
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600"
              >
                Join{" "}
                <span className="font-semibold text-indigo-600">10,000+</span>{" "}
                students studying smarter
              </motion.p>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 px-4 py-3.5 bg-red-50/50 backdrop-blur-sm border border-red-100 rounded-2xl"
              >
                <p className="text-sm text-red-600 text-center font-medium">
                  {error}
                </p>
              </motion.div>
            )}

            {/* Sign In Button */}
            <motion.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50/80 text-gray-900 rounded-2xl px-6 py-4 shadow-lg shadow-indigo-500/5 border border-gray-200 cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-violet-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform translate-x-[-100%] group-hover:translate-x-[100%]" />
              <div className="bg-white rounded-full p-1.5 shadow-sm">
                <FcGoogle className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              </div>
              <span className="font-medium text-gray-800">
                {loading ? "Signing in..." : "Continue with Google"}
              </span>
            </motion.button>

            {/* Terms */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="mt-8 text-center text-sm text-gray-500"
            >
              By continuing, you agree to NoteSnap&apos;s{" "}
              <a
                href="/terms-of-service"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacypolicy"
                className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Privacy Policy
              </a>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

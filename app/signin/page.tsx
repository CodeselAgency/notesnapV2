"use client";

import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Outfit } from "next/font/google";
import { motion } from "framer-motion";
import Image from "next/image";

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
        "min-h-screen w-full flex items-center justify-center bg-[#DBDBDB]/50 relative overflow-hidden",
        outfit.className
      )}
    >

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-4 relative z-10"
      >
        

        {/* Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white  rounded-3xl p-10  border border-gray-200 shadow-sm relative overflow-hidden"
        >

          
          <div className="relative">
            {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="inline-block">
            <Image
              src="/images/new-logo.png"
              alt="Logo"
              width={100}
              height={100}
            />
          </div>
        </motion.div>
            {/* Header */}
            <div className="text-center mb-10">
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-3xl font-semibold text-black/80 font-inter mb-1"
              >
                Welcome to Notesnap
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-gray-600 font-inter"
              >
                Join{" "}
                <span className="font-regular text-blue-600 text-sm">10,000+</span>{" "}
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
              className="w-full bg-white hover:bg-gray-50/80 text-gray-900 rounded-xl px-6 py-2 shadow-lg shadow-indigo-500/5 border border-gray-200 cursor-pointer flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden"
            >
              
              <div className=" rounded-full p-1.5 ">
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
                className="font-medium text-blue-600 transition-colors font-inter underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacypolicy"
                className="font-medium text-blue-600 transition-colors font-inter underline"
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

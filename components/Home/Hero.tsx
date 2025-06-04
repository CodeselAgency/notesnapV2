"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";
import { IconArrowRight } from "@tabler/icons-react";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const Hero = () => {
  return (
    <motion.section className="mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 text-center flex items-center justify-center relative min-h-screen sm:min-h-[85vh] md:min-h-[75vh] lg:min-h-[65vh] bg-white flex-col overflow-hidden">
      {/* Decorative Chips */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none hidden lg:block"
      >
        {/* Top Left Chip */}
        <motion.div
          initial={{ x: -100, rotate: -45 }}
          animate={{
            x: 0,
            rotate: 0,
            y: [0, -10, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute left-[5%] top-[20%] z-0"
        >
          <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-500/20 to-blue-600/30 backdrop-blur-xl shadow-lg p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-blue-700">
              Understand PDFs 2x Faster
            </span>
          </div>
        </motion.div>

        {/* Top Right Chip */}
        <motion.div
          initial={{ x: 100, rotate: 45 }}
          animate={{
            x: 0,
            rotate: 0,
            y: [0, -15, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.4,
            y: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute right-[5%] top-[15%] z-0"
        >
          <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-500/20 to-purple-600/30 backdrop-blur-xl shadow-lg p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-purple-700">
              Instant Quizzes from Any Document
            </span>
          </div>
        </motion.div>

        {/* Bottom Left Chip */}
        <motion.div
          initial={{ x: -100, rotate: -45 }}
          animate={{
            x: 0,
            rotate: 0,
            y: [0, 10, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.5,
            y: {
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute left-[8%] bottom-[15%] z-0"
        >
          <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-green-500/10 via-green-500/20 to-green-600/30 backdrop-blur-xl shadow-lg p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-green-700">
              Turn Class Notes into Conversations
            </span>
          </div>
        </motion.div>

        {/* Bottom Right Chip */}
        <motion.div
          initial={{ x: 100, rotate: 45 }}
          animate={{
            x: 0,
            rotate: 0,
            y: [0, 12, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 0.6,
            y: {
              duration: 4.5,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="absolute right-[8%] bottom-[20%] z-0"
        >
          <div className="w-32 h-20 rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-500/20 to-orange-600/30 backdrop-blur-xl shadow-lg p-3 flex flex-col items-center justify-center">
            <span className="text-xs font-semibold text-orange-700">
              Boost Study Efficiency by 50%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Hero Content */}
      <motion.div className="mx-auto pt-4 sm:pt-8 md:pt-12 relative z-20 w-full max-w-screen-xl px-4 sm:px-6 md:px-8">
        {/* Social proof badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex justify-center mb-4 sm:mb-6 mx-auto"
        >
          <div className="flex rounded-full items-center justify-center bg-green-50 border border-green-200 py-1.5 px-3 sm:px-4 gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 text-xs sm:text-sm font-medium">
              2,847 PDFs converted this week
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`${outfit.className}  font-bold mb-4 max-sm:mb-6 text-gray-900 leading-tight`}
        >
          <div className="flex flex-col items-center  justify-center gap-1 sm:gap-2 md:gap-3">
            <div className="flex items-center flex-wrap justify-center gap-x-2 sm:gap-x-3 leading-tight">
              <span className="font-bold text-7xl  max-sm:text-4xl">Why</span>
              <span className="font-bold text-7xl  max-sm:text-4xl">
                Spending{" "}
                <span className="text-gray-400 line-through decoration-red-500 decoration-2">
                  Hours
                </span>
                ?
              </span>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-4 leading-tight">
              <span className="font-bold text-7xl  max-sm:text-4xl">
                Get Study
              </span>
              <span className="font-bold text-7xl  max-sm:text-4xl">
                Materials in{" "}
                <span className="text-purple-600 relative">
                  Minutes
                  {/* <span className="absolute bottom-2 left-0 w-full h-3 bg-purple-200/50 -z-10 rounded-lg"></span> */}
                </span>
              </span>
            </div>
          </div>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="font-medium mt-3 sm:mt-4 sm:mb-8 md:mt-6 text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 max-w-[90%] sm:max-w-[800px] mx-auto leading-relaxed opacity-80"
        >
          AI-powered assistant that transforms any PDF into flashcards, quizzes,
          and mind maps in 60 seconds — study smarter, not harder
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="flex items-center justify-center gap-3 sm:gap-4 flex-col sm:flex-row"
        >
          <Link href="/dashboard" className="w-full sm:w-auto">
            <div className="bg-gradient-to-b from-blue-500/60 via-blue-500 to-blue-500 text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer flex items-center justify-center hover:opacity-90 transition-all duration-200 border  border-blue-300/60 ">
              Try for free
              <IconArrowRight className="ml-2 -rotate-45 w-4 h-4" />
            </div>
          </Link>
          <Link href="/pricing" className="w-full sm:w-auto">
            <div className="border border-blue-100 bg-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer flex items-center justify-center text-blue-500 hover:bg-blue-50 transition-all duration-200">
              Pricing
            </div>
          </Link>
        </motion.div>
      </motion.div>

      {/* Mockup Image */}
      {/* <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.8 }}
        className="flex justify-center items-center w-full max-w-6xl mx-auto px-4 sm:px-6 "
      >
        <Image
          src="/images/notesnap-mockup.png"
          alt="NoteSnap mockup"
          width={1000}
          height={1200}
          className="w-full h-auto rounded-lg "
          priority
        />
      </motion.div> */}
    </motion.section>
  );
};

export default Hero;

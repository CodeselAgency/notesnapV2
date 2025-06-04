"use client";
import React from "react";
import { motion } from "framer-motion";
import { Inter, Outfit } from "next/font/google";
import {
  IconSparkles,
  IconBrain,
  IconClock,
  IconFileText,
  IconCards,
  IconBulb,
  IconTrendingUp,
  IconCheck,
  IconDownload,
  IconShare,
  IconBolt,
  IconTarget,
} from "@tabler/icons-react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BentoGrid = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2
            className={`${outfit.className} text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}
          >
            Everything you need to
            <span className="bg-gradient-to-r from-blue-600/100 via-blue-600/100 to-blue-600/100 bg-clip-text text-transparent">
              {" "}
              Study smarter
            </span>
          </h2>
          <p
            className={`${inter.className} text-lg text-gray-600 max-w-2xl mx-auto`}
          >
            Transform any PDF into interactive study materials with AI-powered
            tools designed for modern learners
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          {/* Large Card - AI Flashcards */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-blue-500/100 via-blue-500/100 to-blue-500/100 rounded-2xl px-6 py-2 max-sm:px-8 max-sm:py-4 text-white relative overflow-hidden "
          >
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <IconCards className="w-6 h-6" />
                </div>
                <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
              <h3
                className={`${outfit.className} text-2xl sm:text-3xl font-bold mb-4`}
              >
                AI-Generated Flashcards
              </h3>
              <p
                className={`${inter.className} text-blue-100 mb-6 text-sm sm:text-base`}
              >
                Automatically extract key concepts and create perfect flashcards
                from any PDF. Smart spaced repetition included.
              </p>
              <div className="space-y-2">
                {[
                  "Smart concept extraction",
                  "Spaced repetition algorithm",
                  "Progress tracking",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <IconCheck className="w-4 h-4 text-green-300" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full"></div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/5 rounded-full"></div>
          </motion.div>

          {/* Quick Quiz */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <IconBrain className="w-6 h-6 text-white" />
            </div>
            <h3
              className={`${outfit.className} text-xl font-bold text-gray-900 mb-2`}
            >
              Instant Quizzes
            </h3>
            <p className={`${inter.className} text-gray-600 text-sm`}>
              Generate practice quizzes in seconds. Perfect for quick review
              sessions.
            </p>
          </motion.div>

          {/* Time Saver */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl p-6 text-white hover:scale-[1.02] transition-transform duration-300"
          >
            <IconClock className="w-8 h-8 mb-4" />
            <h3 className={`${outfit.className} text-xl font-bold mb-2`}>
              Save 5+ Hours Weekly
            </h3>
            <p className={`${inter.className} text-orange-100 text-sm`}>
              Stop manual note-taking. Focus on learning, not organizing.
            </p>
          </motion.div>

          {/* Mind Maps */}
          <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-xl w-fit mb-4">
              <IconBulb className="w-6 h-6 text-white" />
            </div>
            <h3
              className={`${outfit.className} text-xl font-bold text-gray-900 mb-2`}
            >
              Visual Mind Maps
            </h3>
            <p className={`${inter.className} text-gray-600 text-sm mb-4`}>
              Transform complex information into visual connections that stick.
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border-2 border-dashed border-gray-200">
              <div className="flex items-center justify-center h-16 text-gray-400">
                <span className="text-xs">Interactive Mind Map Preview</span>
              </div>
            </div>
          </motion.div>

          {/* Smart Summaries */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl w-fit mb-4">
              <IconFileText className="w-6 h-6 text-white" />
            </div>
            <h3
              className={`${outfit.className} text-xl font-bold text-gray-900 mb-2`}
            >
              Smart Summaries
            </h3>
            <p className={`${inter.className} text-gray-600 text-sm`}>
              Get key insights from lengthy documents in just one click.
            </p>
          </motion.div>

          {/* Progress Tracking */}
          <motion.div
            variants={itemVariants}
            className="lg:col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden hover:scale-[1.02] transition-transform duration-300"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white/20 p-2 rounded-lg">
                  <IconTrendingUp className="w-6 h-6" />
                </div>
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  Analytics
                </span>
              </div>
              <h3
                className={`${outfit.className} text-xl sm:text-2xl font-bold mb-2`}
              >
                Track Your Progress
              </h3>
              <p className={`${inter.className} text-indigo-100 text-sm mb-4`}>
                See your learning streaks, retention rates, and areas that need
                more focus.
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">92%</div>
                  <div className="text-xs text-indigo-200">Retention</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">47</div>
                  <div className="text-xs text-indigo-200">Day Streak</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold">1.2k</div>
                  <div className="text-xs text-indigo-200">Cards Learned</div>
                </div>
              </div>
            </div>
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/5 rounded-full"></div>
          </motion.div>

          {/* Export & Share */}
          <motion.div
            variants={itemVariants}
            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex gap-2 mb-4">
              <div className="bg-gradient-to-br from-gray-600 to-gray-800 p-2 rounded-lg">
                <IconDownload className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-lg">
                <IconShare className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3
              className={`${outfit.className} text-xl font-bold text-gray-900 mb-2`}
            >
              Export & Share
            </h3>
            <p className={`${inter.className} text-gray-600 text-sm`}>
              Export to Anki, Quizlet, or share study sets with classmates.
            </p>
          </motion.div>

          {/* Lightning Fast */}
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white hover:scale-[1.02] transition-transform duration-300"
          >
            <IconBolt className="w-8 h-8 mb-4" />
            <h3 className={`${outfit.className} text-xl font-bold mb-2`}>
              60 Second Setup
            </h3>
            <p className={`${inter.className} text-yellow-100 text-sm`}>
              From PDF upload to study materials in under a minute.
            </p>
          </motion.div>

          {/* Perfect Accuracy */}
          {/* <motion.div
            variants={itemVariants}
            className="md:col-span-2 lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl">
                <IconTarget className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3
                  className={`${outfit.className} text-xl font-bold text-gray-900`}
                >
                  99.9% Accuracy
                </h3>
                <p className={`${inter.className} text-gray-600 text-sm`}>
                  AI-powered content extraction with human-level precision
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Text Recognition", value: "99.9%" },
                { label: "Concept Extraction", value: "98.7%" },
                { label: "Question Generation", value: "97.5%" },
                { label: "User Satisfaction", value: "99.2%" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`${outfit.className} text-lg font-bold text-gray-900`}
                  >
                    {stat.value}
                  </div>
                  <div className={`${inter.className} text-xs text-gray-600`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div> */}
        </motion.div>

        {/* CTA Section */}
      </div>
    </section>
  );
};

export default BentoGrid;

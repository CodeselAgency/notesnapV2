"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Inter, Outfit } from "next/font/google";
import {
  IconArrowRight,
  IconClock,
  IconBrain,
  IconCheck,
} from "@tabler/icons-react";
import StyledButton from "@/components/UI/StyledButton";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const Hero = () => {
  const clients = [
    "/images/client1.png",
    "/images/client2.png",
    "/images/client3.png",
    "/images/client4.png",
    "/images/client5.png",
    "/images/client6.png",
  ];

  const benefits = [
    { icon: IconClock, text: "Save 5+ hours per week" },
    { icon: IconBrain, text: "Remember 90% more" },
    { icon: IconCheck, text: "Works with any PDF" },
  ];

  return (
    <section className="mt-16 sm:mt-20 md:mt-24 px-4 sm:px-6 text-center flex items-center justify-center relative min-h-screen sm:min-h-[85vh] md:min-h-[75vh] lg:min-h-[65vh] bg-white">
      <div className="mx-auto pt-4 sm:pt-8 md:pt-12 relative z-20 w-full max-w-screen-xl px-4 sm:px-6 md:px-8">
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

        {/* Main heading - Problem-focused */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className={`${outfit.className} text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-gray-900 leading-tight`}
        >
          <div className="flex flex-col items-center justify-center gap-1 sm:gap-2 md:gap-3">
            <div className="flex items-center flex-wrap justify-center gap-x-2 sm:gap-x-3 leading-tight">
              <span className="font-extrabold text-red-500">Stop</span>
              <span className="font-extrabold">Wasting Hours</span>
            </div>
            <div className="flex items-center flex-wrap justify-center gap-x-2 sm:gap-x-3 md:gap-x-4 leading-tight">
              <span className="font-extrabold">Making</span>
              <span className="font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Study Materials
              </span>
            </div>
          </div>
        </motion.h1>

        {/* Benefit-focused subheading */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
          className="font-medium mt-3 mb-6 sm:mt-4 sm:mb-8 md:mt-6 text-base sm:text-lg md:text-xl lg:text-[22px] text-gray-800 max-w-[90%] sm:max-w-[800px] mx-auto leading-relaxed"
        >
          AI-powered assistant that transforms any PDF into flashcards, quizzes,
          and mind maps in 60 seconds — study smarter, not harder
        </motion.p>

        {/* CTA and social proof section with benefits */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.5 }}
          className="flex flex-col items-center gap-4 sm:gap-6 relative"
        >
          {/* Benefits - Desktop version with curves */}
          <div className="hidden lg:block relative w-full max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className={`absolute ${
                  index === 0
                    ? "-left-50 top-5 -translate-y-1/2"
                    : index === 1
                    ? "-right-40 -top-20"
                    : "right-0 top-16"
                }`}
              >
                <div className="bg-white rounded-xl p-3 border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 relative">
                  <div className="flex flex-col items-center text-center gap-1.5">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2 rounded-full">
                      <benefit.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-gray-800 text-xs whitespace-nowrap">
                      {benefit.text}
                    </span>
                  </div>
                  <svg
                    className="absolute top-1/2 -translate-y-1/2"
                    width="150"
                    height="100"
                    style={{
                      left: index === 0 ? "100%" : "auto",
                      right: index !== 0 ? "100%" : "auto",
                    }}
                  >
                    <defs>
                      <linearGradient
                        id={`gradient-${index}`}
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop
                          offset="0%"
                          style={{
                            stopColor: index === 0 ? "#3B82F6" : "transparent",
                          }}
                        />
                        <stop
                          offset="100%"
                          style={{
                            stopColor: index === 0 ? "transparent" : "#3B82F6",
                          }}
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d={
                        index === 0
                          ? "M0,50 C50,50 75,75 150,75"
                          : index === 1
                          ? "M150,50 C100,50 75,100 0,100"
                          : "M150,50 C100,50 75,25 0,25"
                      }
                      stroke={`url(#gradient-${index})`}
                      strokeWidth="2"
                      fill="none"
                    />
                  </svg>
                </div>
              </motion.div>
            ))}

            {/* Desktop CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center px-48">
              <StyledButton />
              <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-600" />
                <span>Free trial • No credit card required</span>
              </div>
            </div>
          </div>

          {/* Mobile/Tablet Benefits - Horizontal layout */}
          <div className="lg:hidden w-full">
            {/* Benefits displayed horizontally above CTA on mobile */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="bg-white rounded-lg p-2.5 sm:p-3 border border-gray-200 shadow-md flex items-center gap-2 hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 sm:p-2 rounded-full shrink-0">
                    <benefit.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <span className="font-semibold text-gray-800 text-xs sm:text-sm whitespace-nowrap">
                    {benefit.text}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Mobile/Tablet CTA */}
            <div className="flex flex-col items-center gap-3 justify-center w-full max-w-md mx-auto">
              <StyledButton />
              <div className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                <IconCheck className="w-4 h-4 text-green-600" />
                <span>Free trial • No credit card required</span>
              </div>
            </div>
          </div>

          {/* Urgency element */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 sm:px-4 mt-2 w-full max-w-sm sm:max-w-md mx-auto"
          >
            <p className="text-xs sm:text-sm text-yellow-800 font-medium text-center">
              🔥 <span className="font-bold">Limited Time:</span> First 1,000
              users get lifetime 50% off
            </p>
          </motion.div>

          {/* Enhanced trusted by section */}
          <div className="flex flex-col items-center mt-4 sm:mt-6 md:mt-8 gap-2 sm:gap-3 w-full">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
              <div className="flex -space-x-2 sm:-space-x-3 md:-space-x-4">
                {clients.slice(0, 5).map((client, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.7 + index * 0.05 }}
                    className="relative w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full overflow-hidden border-2 border-white shadow-md"
                  >
                    <Image
                      src={client}
                      alt={`User ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-sm sm:text-base font-semibold text-gray-800">
                  Join 5,000+ students
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex text-yellow-400 text-sm">
                    {"★".repeat(5)}
                  </div>
                  <span className="text-xs text-gray-600">4.9/5 rating</span>
                </div>
              </div>
            </div>

            {/* Mini testimonial - Hidden on very small screens */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.9 }}
              className="hidden sm:block text-center max-w-xs sm:max-w-md mt-2 sm:mt-4"
            >
              <p className="text-xs sm:text-sm italic text-gray-600">
                "Turned my 200-page textbook into perfect flashcards in 2
                minutes.
                <span className="font-semibold text-gray-800">
                  {" "}
                  Game changer for med school!"
                </span>
              </p>
              <p className="text-xs text-gray-500 mt-1">
                - Sarah K., Medical Student
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;

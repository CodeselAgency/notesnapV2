"use client";
import React from "react";
import { SkeletonFour } from "./Globe";
import Image from "next/image";
import { motion } from "framer-motion";

const ivyLeagueSchools = [
  "/images/Harvard-University.png",
  "/images/Yale-University.png",
  "/images/Princeton-University.png",
  "/images/University-of-Pennsylvania.png",
  "/images/Brown-University.png",
  "/images/Dartmouth-College.png",
  "/images/Columbia-University.png",
  "/images/Cornell-University.png",
];

const MarqueeRow = ({
  schools,
  duration = 60,
}: {
  schools: typeof ivyLeagueSchools;
  duration?: number;
}) => {
  const duplicatedSchools = [...schools, ...schools];

  return (
    <div className="flex space-x-12 overflow-hidden">
      <div
        className={`flex space-x-12 animate-marquee whitespace-nowrap`}
        style={{ animationDuration: `${duration}s` }}
      >
        {duplicatedSchools.map((school, index) => (
          <div
            key={`${school}-${index}-1`}
            className="flex items-center flex-shrink-0 py-2"
          >
            <Image
              src={school}
              alt={school.split("/").pop()?.split(".")[0] || "School logo"}
              width={120}
              height={120}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const Trust = () => {
  const row1Schools = ivyLeagueSchools;

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center bg-transparent"
    >
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-center text-xl sm:text-2xl md:text-3xl font-semibold text-black mb-6 sm:mb-8 md:mb-12 px-4"
      >
        Trusted by students at top universities
      </motion.h3>

      <div className="relative w-full flex justify-center items-center">
        <SkeletonFour />

        <div
          className="absolute top-1/2 left-0 w-full -translate-y-1/2 pointer-events-none"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          }}
        >
          <MarqueeRow schools={row1Schools} duration={16} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee linear infinite;
        }
      `}</style>
    </motion.section>
  );
};

export default Trust;

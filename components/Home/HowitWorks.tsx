"use client";
import { motion } from "framer-motion";
import { Outfit } from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const stepsData = [
  {
    id: "01",
    title: "Account Creation",
    description:
      "Sign up in seconds and unlock access to our advanced note-taking and study tools.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
  },
  {
    id: "02",
    title: "Workspace Creation",
    description:
      "Create custom workspaces for different subjects, courses, or projects to keep your studies organized.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
    ),
  },
  {
    id: "03",
    title: "PDF Upload",
    description:
      "Upload your textbooks, lecture notes, and academic papers to your workspace for instant AI analysis.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
        />
      </svg>
    ),
  },
  {
    id: "04",
    title: "Chat Interaction",
    description:
      "Ask questions about your documents and get instant, relevant answers powered by our AI assistant.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    id: "05",
    title: "Generate Notes & Mind Maps",
    description:
      "Transform complex information into concise notes and visual mind maps to enhance your understanding.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section
      className={`relative py-24 px-4 bg-white overflow-hidden ${outfit.className}`}
    >
      {/* Futuristic Background Grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(50, 50, 50, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(50, 50, 50, 0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      {/* Animated Background Lines */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [-100, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
          className="absolute top-20 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"
        />
        <motion.div
          animate={{
            x: [100, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 2,
          }}
          className="absolute top-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-500 to-transparent"
        />
        <motion.div
          animate={{
            x: [-100, 100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: 4,
          }}
          className="absolute bottom-40 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"
        />
      </div>

      {/* Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32">
        <div className="absolute top-4 left-4 w-8 h-px bg-gradient-to-r from-neutral-600 to-transparent"></div>
        <div className="absolute top-4 left-4 w-px h-8 bg-gradient-to-b from-neutral-600 to-transparent"></div>
        <div className="absolute top-8 left-8 w-4 h-px bg-gradient-to-r from-neutral-500 to-transparent"></div>
        <div className="absolute top-8 left-8 w-px h-4 bg-gradient-to-b from-neutral-500 to-transparent"></div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32">
        <div className="absolute top-4 right-4 w-8 h-px bg-gradient-to-l from-neutral-600 to-transparent"></div>
        <div className="absolute top-4 right-4 w-px h-8 bg-gradient-to-b from-neutral-600 to-transparent"></div>
        <div className="absolute top-8 right-8 w-4 h-px bg-gradient-to-l from-neutral-500 to-transparent"></div>
        <div className="absolute top-8 right-8 w-px h-4 bg-gradient-to-b from-neutral-500 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 left-0 w-32 h-32">
        <div className="absolute bottom-4 left-4 w-8 h-px bg-gradient-to-r from-neutral-600 to-transparent"></div>
        <div className="absolute bottom-4 left-4 w-px h-8 bg-gradient-to-t from-neutral-600 to-transparent"></div>
        <div className="absolute bottom-8 left-8 w-4 h-px bg-gradient-to-r from-neutral-500 to-transparent"></div>
        <div className="absolute bottom-8 left-8 w-px h-4 bg-gradient-to-t from-neutral-500 to-transparent"></div>
      </div>

      <div className="absolute bottom-0 right-0 w-32 h-32">
        <div className="absolute bottom-4 right-4 w-8 h-px bg-gradient-to-l from-neutral-600 to-transparent"></div>
        <div className="absolute bottom-4 right-4 w-px h-8 bg-gradient-to-t from-neutral-600 to-transparent"></div>
        <div className="absolute bottom-8 right-8 w-4 h-px bg-gradient-to-l from-neutral-500 to-transparent"></div>
        <div className="absolute bottom-8 right-8 w-px h-4 bg-gradient-to-t from-neutral-500 to-transparent"></div>
      </div>

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-20"
        >
          <div className="inline-block mb-4 relative">
            <span
              className={`text-xs sm:text-sm font-medium text-neutral-800 tracking-[0.2em] uppercase`}
            >
              How it works
            </span>
            <div className="absolute -bottom-1 left-0 w-full h-px bg-gradient-to-r from-transparent via-neutral-700 to-transparent"></div>
          </div>

          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-light text-neutral-900 mb-4 md:mb-6 tracking-tight relative"
          >
            <span className={`relative font-bold`}>
              Simple Process
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
                className="absolute -bottom-2 left-0 w-full h-0.5 bg-gradient-to-r from-neutral-700 via-neutral-500 to-neutral-700 origin-left"
              />
            </span>
          </motion.h2>

          <p
            className={`text-lg sm:text-xl text-neutral-700 max-w-md sm:max-w-2xl mx-auto font-light`}
          >
            Get started with our platform in just five easy steps
          </p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-8 md:space-y-0">
          {stepsData.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className={`flex flex-col md:flex-row items-center ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } group relative`}
            >
              {/* Futuristic Side Lines */}
              <div
                className={`hidden md:block absolute ${
                  index % 2 === 0 ? "left-0" : "right-0"
                } top-1/2 -translate-y-1/2 w-32 h-px`}
              >
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: index * 0.2 + 0.5 }}
                  className={`h-full bg-gradient-to-${
                    index % 2 === 0 ? "r" : "l"
                  } from-neutral-600 to-transparent origin-${
                    index % 2 === 0 ? "left" : "right"
                  }`}
                />
              </div>

              {/* Content Side */}
              <div className="w-full md:flex-1 px-4 sm:px-8 md:px-16 relative order-2 md:order-none">
                <div
                  className={`max-w-lg mx-auto md:mx-0 ${
                    index % 2 === 0
                      ? "md:ml-auto md:text-right"
                      : "md:mr-auto md:text-left"
                  } text-center md:text-left relative`}
                >
                  {/* Glowing Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-2xl border border-neutral-200 shadow-md group-hover:from-neutral-50 group-hover:to-neutral-150 group-hover:shadow-xl group-hover:border-neutral-300 transition-all duration-300"></div>

                  <div className="relative z-10 p-6 sm:p-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block mb-2 sm:mb-4 relative"
                    >
                      <span
                        className={`text-5xl sm:text-6xl md:text-7xl font-extralight text-neutral-300 group-hover:text-neutral-400 transition-all duration-500`}
                      >
                        {step.id}
                      </span>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                        className={`absolute inset-0 text-5xl sm:text-6xl md:text-7xl font-extralight text-neutral-500/20 blur-sm`}
                      >
                        {step.id}
                      </motion.div>
                    </motion.div>

                    <h3
                      className={`text-xl sm:text-2xl md:text-3xl font-light text-neutral-800 mb-3 sm:mb-4 group-hover:text-neutral-900 transition-colors duration-300`}
                    >
                      {step.title}
                    </h3>

                    <p
                      className={`text-base sm:text-lg text-neutral-700 leading-relaxed font-light group-hover:text-neutral-800 transition-colors duration-300`}
                    >
                      {step.description}
                    </p>

                    {/* Decorative Lines */}
                    <div
                      className={`hidden md:block absolute ${
                        index % 2 === 0 ? "-right-4" : "-left-4"
                      } top-0 bottom-0 w-px`}
                    >
                      <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                        className="w-full bg-gradient-to-b from-transparent via-neutral-600/50 to-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Center Line & Icon */}
              <div className="relative flex flex-col items-center order-1 md:order-none my-8 md:my-0">
                {/* Vertical Line with Glow */}
                <div className="absolute top-0 bottom-0 w-px bg-gray-200 shadow-lg shadow-neutral-600/20">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: "100%" }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className="w-full bg-gradient-to-b from-neutral-600 to-neutral-500 shadow-lg shadow-neutral-600/50"
                  />
                </div>

                {/* Icon Circle with Futuristic Design */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
                  whileHover={{ scale: 1.2 }}
                  className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 bg-white border-2 border-neutral-600 rounded-full flex items-center justify-center text-neutral-700 group-hover:border-neutral-500 group-hover:text-neutral-600 transition-all duration-300 shadow-lg shadow-neutral-600/30 group-hover:shadow-neutral-500/50"
                >
                  {/* Inner Glow */}
                  <div className="absolute inset-1 bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-full group-hover:from-neutral-100 group-hover:to-neutral-200 transition-all duration-300"></div>

                  {/* Icon */}
                  <div className="relative z-10">{step.icon}</div>

                  {/* Outer Ring Animation */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 20,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="absolute inset-0 border border-neutral-300 rounded-full"
                    style={{
                      background: `conic-gradient(from 0deg, transparent, rgba(50, 50, 50, 0.2), transparent)`,
                    }}
                  />
                </motion.div>

                {/* Connection Nodes */}
                {index < stepsData.length - 1 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 + 0.6 }}
                    className="absolute bottom-8 w-2 h-2 bg-neutral-600 rounded-full shadow-lg shadow-neutral-600/50"
                  />
                )}
              </div>

              {/* Empty Side for Balance */}
              <div className="hidden md:flex-1 md:px-8 md:px-16 order-3 md:order-none">
                <div className="h-32"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 md:mt-20 pt-12 md:pt-16 border-t border-neutral-700 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-neutral-600 to-transparent"></div>

          <p
            className={`text-base sm:text-lg text-neutral-700 font-light mb-6`}
          >
            Ready to transform your learning experience?
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-6 py-2.5 sm:px-8 sm:py-3 bg-gradient-to-r from-neutral-700 to-neutral-600 text-white font-light tracking-wide overflow-hidden group text-sm sm:text-base`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-600 to-neutral-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10">Get Started</span>

            {/* Button Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-700 to-neutral-600 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;

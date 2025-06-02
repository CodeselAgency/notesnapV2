"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
}

const testimonialData = [
  {
    id: 1,
    name: "Emma Thompson",
    role: "Medical Student, Harvard",
    content:
      "The PDF chat feature is incredible! I can ask questions about my textbooks and get instant explanations. My study time has been cut in half.",
    image: "/images/client1.png",
  },
  {
    id: 2,
    name: "Alex Rodriguez",
    role: "Engineering Student, MIT",
    content:
      "Mind maps generated from my lecture PDFs help me visualize complex concepts. The quiz feature tests my understanding perfectly.",
    image: "/images/client2.png",
  },
  {
    id: 3,
    name: "Sarah Kim",
    role: "Psychology Major, Stanford",
    content:
      "Flashcards are automatically created from my notes! I went from struggling with memorization to acing my exams effortlessly.",
    image: "/images/client3.png",
  },
  {
    id: 4,
    name: "Marcus Johnson",
    role: "Law Student, Yale",
    content:
      "The AI summarizes 100-page case studies into key points. I can focus on understanding rather than just reading endlessly.",
    image: "/images/client4.png",
  },
  {
    id: 5,
    name: "Priya Patel",
    role: "Computer Science, UC Berkeley",
    content:
      "This app transformed my study routine. Interactive quizzes from my programming textbooks help me practice coding concepts instantly.",
    image: "/images/client5.png",
  },
  {
    id: 6,
    name: "David Chen",
    role: "MBA Student, Wharton",
    content:
      "The note-taking feature syncs perfectly with PDF annotations. My study materials are now organized and searchable in one place.",
    image: "/images/client6.png",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonialData.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonialData[currentIndex];

  return (
    <div className="py-20 bg-white" id="testimonials">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            What Students Are Saying
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See how students from top universities are boosting their grades and
            saving study time with our AI-powered learning tools.
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="bg-white rounded-2xl shadow-xl p-8 md:p-12 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 left-6 text-6xl text-blue-100 font-serif">
                "
              </div>

              {/* Content */}
              <div className="relative z-10">
                <blockquote className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 font-medium">
                  {currentTestimonial.content}
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4 ring-4 ring-blue-100">
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {currentTestimonial.name}
                    </h4>
                    <p className="text-blue-600 font-medium">
                      {currentTestimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonialData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? "bg-blue-600 scale-125"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>

        {/* Testimonial Grid - Secondary Display */}
        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialData.slice(0, 3).map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900 text-sm">
                      {testimonial.name}
                    </h5>
                    <p className="text-blue-600 text-xs font-medium">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {testimonial.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

// Testimonial data
const testimonials = [
  {
    id: 1,
    content:
      "NoteSnap has completely changed how I study. I just upload my PDFs and chat with them like a tutor — it saves me hours and makes complex topics way easier to understand.",
    avatar: "/images/client1.png",
    name: "Sarah Johnson",
  },
  {
    id: 2,
    content:
      "Quizzes and flashcards are generated instantly. I use them every day to test myself before exams. It’s like having a study coach in my pocket!",
    avatar: "/images/client2.png",
    name: "Michael Chen",
  },
  {
    id: 3,
    content:
      "No more flipping through messy notes. Everything’s organized, searchable, and interactive. The flashcards especially helped me retain information 10x better.",
    avatar: "/images/client3.png",
    name: "Emily Rodriguez",
  },
  {
    id: 4,
    content:
      "The AI chat with PDFs is next-level. I get instant explanations, summaries, and even example questions from my textbooks. It’s made studying actually enjoyable.",
    avatar: "/images/client4.png",
    name: "David Kim",
  },
  {
    id: 5,
    content:
      "I use NoteSnap to prepare for presentations and exams. It creates flashcards from my notes and quizzes me automatically. My grades — and confidence — have improved big time.",
    avatar: "/images/client5.png",
    name: "Lisa Thompson",
  },
  {
    id: 6,
    content:
      "I save hours every week with NoteSnap. From summarizing long PDFs to turning notes into quizzes, it handles the hard parts and lets me focus on actually learning.",
    avatar: "/images/client6.png",
    name: "James Wilson",
  },
];

export default function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [transitioningImageId, setTransitioningImageId] = useState<number | null>(null)
  const progressInterval = useRef<number | null>(null)
  const transitionDuration = 8000 // 8 seconds

  // Get the 5 stacked images (next 5 testimonials after active)
  const getStackedImages = () => {
    const stacked = []
    for (let i = 1; i <= 5; i++) {
      const index = (activeIndex + i) % testimonials.length
      stacked.push({ ...testimonials[index], originalIndex: index })
    }
    return stacked
  }

  // Handle testimonial transition and progress bar
  useEffect(() => {
    let startTime = Date.now()

    const updateProgress = () => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / transitionDuration) * 100

      if (newProgress >= 100) {
        const nextIndex = (activeIndex + 1) % testimonials.length
        const nextTestimonial = testimonials[nextIndex]

        setIsTransitioning(true)
        setTransitioningImageId(nextTestimonial.id)

        // Set new active index after a brief delay to allow animation to start
        setTimeout(() => {
          setActiveIndex(nextIndex)
        }, 50)

        startTime = Date.now()
        setProgress(0)

        // Reset transition state after animation completes
        setTimeout(() => {
          setIsTransitioning(false)
          setTransitioningImageId(null)
        }, 1000)
      } else {
        setProgress(newProgress)
      }

      progressInterval.current = requestAnimationFrame(updateProgress)
    }

    progressInterval.current = requestAnimationFrame(updateProgress)

    return () => {
      if (progressInterval.current) {
        cancelAnimationFrame(progressInterval.current)
      }
    }
  }, [activeIndex])

  const handleStackedImageClick = (originalIndex: number) => {
    if (!isTransitioning) {
      const clickedTestimonial = testimonials[originalIndex]

      setIsTransitioning(true)
      setTransitioningImageId(clickedTestimonial.id)

      setTimeout(() => {
        setActiveIndex(originalIndex)
      }, 50)

      setProgress(0)

      setTimeout(() => {
        setIsTransitioning(false)
        setTransitioningImageId(null)
      }, 1000)
    }
  }

  const stackedImages = getStackedImages()

  return (

    <motion.section className="w-full h-full flex flex-col items-center justify-center mt-10 mb-10 gap-10" id="testimonials">
      <h2 className="text-7xl max-sm:text-4xl font-roboto font-semibold text-center mb-8">Why Learners Love NoteSnap</h2>

      <motion.div className="w-full max-w-md mx-auto bg-gray-100 rounded-2xl p-6">

      
      {/* Testimonial Content */}
      <div className="mb-6 ">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="bg-white rounded-2xl p-4 relative shadow-sm"
          >
            <p className="text-gray-800 text-sm leading-relaxed">{testimonials[activeIndex].content}</p>

            {/* Speech bubble tail */}
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white rotate-45 " />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Profile Images Section */}
      <div className="flex items-center gap-2">
        {/* Main Active Profile Image */}
        <div className="flex flex-col items-start relative">
          <div className="relative w-10 h-10">
            {/* Current Active Image */}
            <AnimatePresence>
              {!isTransitioning && (
                <motion.div
                  key={`current-${activeIndex}`}
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{
                    opacity: 0,
                    scale: 0.8,
                    transition: { duration: 0.4, ease: "easeOut" },
                  }}
                  className="absolute inset-0"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonials[activeIndex].avatar || "/images/client1.png"}
                      alt={testimonials[activeIndex].name}
                      fill
                      className="object-cover rounded-full"
                      sizes="40px"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Transitioning Image (travels from stack to main position) */}
            <AnimatePresence>
              {isTransitioning && transitioningImageId && (
                <motion.div
                  key={`transitioning-${transitioningImageId}`}
                  initial={{
                    x: 120,
                    y: 0,
                    scale: 0.83,
                    opacity: 1,
                  }}
                  animate={{
                    x: 0,
                    y: 0,
                    scale: 1,
                    opacity: 1,
                  }}
                  transition={{
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    type: "spring",
                    stiffness: 120,
                    damping: 20,
                  }}
                  className="absolute inset-0"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonials.find((t) => t.id === transitioningImageId)?.avatar || "/images/client1.png"}
                      alt={testimonials.find((t) => t.id === transitioningImageId)?.name || ""}
                      fill
                      className="object-cover rounded-full"
                      sizes="40px"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Progress Bar */}
          <div className="w-10 h-1 bg-gray-300 rounded-full mt-2 overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </div>

        {/* Stacked Images (Always 5 images) */}
        <div className="flex items-center">
          <div className="relative flex items-center -space-x-4 mb-3">
            {stackedImages.map((testimonial, stackIndex) => {
              const isTransitioningImage = testimonial.id === transitioningImageId

              return (
                <motion.div
                  key={`stack-${testimonial.originalIndex}-${activeIndex}`}
                  className="relative w-10 h-10 cursor-pointer"
                  initial={{
                    x: 0,
                    scale: 0.83,
                    opacity: 1,
                  }}
                  animate={{
                    x: 0,
                    scale: 0.83,
                    opacity: isTransitioningImage ? 0 : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeOut",
                    delay: isTransitioningImage ? 0 : stackIndex * 0.05,
                  }}
                  style={{
                    zIndex: 5 - stackIndex,
                  }}
                  onClick={() => handleStackedImageClick(testimonial.originalIndex)}
                  whileHover={{
                    scale: isTransitioningImage ? 0.83 : 0.9,
                    transition: { duration: 0.2 },
                  }}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md">
                    <Image
                      src={testimonial.avatar || "/images/client1.png"}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-300"
                      sizes="40px"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </motion.div>
    </motion.section>
    
  )
}

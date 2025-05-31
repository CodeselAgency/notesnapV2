"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  image: string;
  position: number; // Position from 0 to 1
}

const testimonialData = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    content:
      "This tool has transformed how I organize my research. The AI summary feature saves me hours every week.",
    image: "/images/client1.png",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "PhD Student",
    content:
      "Perfect for academic research. The mind map feature helps me connect concepts I would have missed.",
    image: "/images/client2.png",
  },
  {
    id: 3,
    name: "Alex Rodriguez",
    role: "Content Creator",
    content:
      "I use this daily for scripting. The ability to quickly extract key points is game-changing.",
    image: "/images/client3.png",
  },
  {
    id: 4,
    name: "Martha Smith",
    role: "UX Researcher",
    content:
      "The collaborative features are exceptional. My team can all work with the same documents seamlessly.",
    image: "/images/client4.png",
  },
  {
    id: 5,
    name: "James Wilson",
    role: "Business Analyst",
    content:
      "This has become my go-to tool for digesting complex reports and extracting actionable insights.",
    image: "/images/client5.png",
  },
  {
    id: 6,
    name: "Angela ",
    role: "UX Researcher",
    content:
      "The collaborative features are exceptional. My team can all work with the same documents seamlessly.",
    image: "/images/client6.png",
  },
];

// Re-added Component for animated word-by-word text
const AnimatedText = ({
  text,
  delay = 0,
}: {
  text: string;
  delay?: number;
}) => {
  const words = text.split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: delay }, // Slightly faster stagger
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.div
      // Use inline-block for proper text flow within the quote marks
      style={{ display: "inline-block" }}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={child}
          style={{ marginRight: "0.25rem", display: "inline-block" }} // Ensure words stay inline
        >
          {word}
        </motion.span>
      ))}
    </motion.div>
  );
};

// Convert position (0-1) to angle in degrees (270 to 90)
const positionToAngle = (position: number): number => {
  return 270 - position * 90;
};

const positionToCoordinates = (position: number, radius: number) => {
  const angle = positionToAngle(position);
  const radian = (angle * Math.PI) / 90;

  const x = Math.cos(radian) * radius;
  const y = Math.sin(radian) * radius;

  let opacity = 1;

  // Fade out near right edge (90°)
  if (angle < 100 && angle >= 90) {
    opacity = (angle - 90) / 10;
  }

  // Fade in near left edge (270°)
  if (angle > 260 && angle <= 270) {
    opacity = (270 - angle) / 10;
  }

  const isCenter = Math.abs(angle - 180) < 10;

  return { x, y, opacity, angle, isCenter };
};

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    return testimonialData.map((item, index) => ({
      ...item,
      position: index / testimonialData.length,
    }));
  });

  const animationRef = useRef<number | null>(null);
  const speedRef = useRef(0.0005); // Adjusted speed for smooth motion
  const containerRef = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(260);

  const centerIndex = useMemo(() => {
    const positions = testimonials.map((t, i) => {
      const angle = positionToAngle(t.position);
      return { index: i, distance: Math.abs(angle - 180) };
    });
    positions.sort((a, b) => a.distance - b.distance);
    return positions[0].index;
  }, [testimonials]);

  const animate = () => {
    setTestimonials((prev) => {
      return prev.map((testimonial) => {
        let newPosition = testimonial.position + speedRef.current;
        if (newPosition >= 1) newPosition = 0;
        return { ...testimonial, position: newPosition };
      });
    });
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    // Adjust radius based on container width
    const updateRadius = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setRadius(Math.min(260, width * 0.4));
      }
    };

    updateRadius();
    window.addEventListener("resize", updateRadius);
    return () => window.removeEventListener("resize", updateRadius);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="relative w-full py-4 overflow-hidden" id="testimonials">
      {/* Title */}
      <div className="text-center mb-36">
        <h2 className="text-5xl  font-inter font-extrabold text-gray-900 mb-4">
          What Our Users Say
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto font-inter font-medium">
          Discover how professionals across industries are transforming their
          workflow with our intelligent note-taking solution.
        </p>
      </div>

      {/* Semi-circle container with photos */}
      <div
        className="relative h-[450px] mx-auto max-w-screen-xl"
        ref={containerRef}
      >
        {/* Semi-circle canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Semi-circle background shape */}
          {/* <div className="absolute w-[600px] h-[300px] overflow-hidden">
            <div className="w-[600px] h-[600px] rounded-full border-8 border-gray-200 absolute top-0"></div>
          </div> */}

          {/* Center testimonial content - Wrapped in AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`testimonial-card-${centerIndex}`} // Unique key for AnimatePresence
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[280px] bg-white overflow-hidden  p-5 "
            >
              <div className="text-center">
                {/* Apply AnimatedText component here */}
                <div className="text-gray-700 text-sm font-inter font-medium mb-3">
                  {" "}
                  {/* Removed height and scroll for long quotes */}
                  {/* <span>&ldquo;</span> */}
                  <AnimatedText
                    key={`text-${centerIndex}`}
                    text={testimonials[centerIndex].content}
                  />
                  {/* <span>&rdquo;</span> */}
                </div>
                <div className="flex items-center justify-center mt-2">
                  <motion.div
                    key={`image-${centerIndex}`} // Key to animate image change
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="relative w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0" // Added flex-shrink-0
                  >
                    <Image
                      src={testimonials[centerIndex].image}
                      alt={testimonials[centerIndex].name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </motion.div>
                  <motion.div
                    key={`info-${centerIndex}`} // Key to animate name/role change
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
                    className="text-left"
                  >
                    <h4 className="text-sm font-bold text-gray-900">
                      {testimonials[centerIndex].name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {testimonials[centerIndex].role}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* All testimonial photos in the semi-circle */}
          {testimonials.map((testimonial) => {
            const coords = positionToCoordinates(testimonial.position, radius);
            return (
              <motion.div
                // Using a stable key based only on ID
                key={testimonial.id}
                className="absolute"
                style={{
                  // Base position set directly
                  left: `calc(50%)`,
                  top: `calc(50%)`,
                  zIndex: coords.isCenter ? 25 : 10,
                  x: "-50%", // Center horizontally
                  y: "-50%", // Center vertically
                }}
                // Animate position changes smoothly
                animate={{
                  translateX: `${coords.x}px`,
                  translateY: `${-coords.y}px`,
                  opacity: 1,
                }}
                transition={{
                  // Use a smooth spring for position changes
                  type: "spring",
                  stiffness: 100,
                  damping: 30,
                  mass: 1,
                  // Instant opacity change to avoid fading during movement if desired
                  // opacity: { duration: 0.1 }
                }}
              >
                <div
                  className={`relative w-[60px] h-[60px] md:w-[100px] md:h-[100px] rounded-xl overflow-hidden border-2 md:border-4 border-white shadow-lg`}
                >
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 60px, 100px"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Background decorations */}
      {/* <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-blue-50 opacity-30 blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-purple-50 opacity-30 blur-3xl"></div> */}
    </div>
  );
};

export default Testimonials;

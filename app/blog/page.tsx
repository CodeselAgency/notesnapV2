"use client";

import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import Footer from "@/components/Home/Footer";

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "How to Summarize Academic Papers Using AI",
      slug: "summarize-academic-papers-ai",
      excerpt:
        "Learn how to use AI tools like Notesnap to quickly extract key insights from academic papers and research studies.",
      date: "May 02, 2025",
      tag: "Study Tips",
      imageSrc: "/images/academic-papers.jpg",
    },
    {
      id: 2,
      title: "Best AI Tools to Chat with Your PDFs in 2023",
      slug: "best-ai-tools-chat-pdfs",
      excerpt:
        "Discover the top AI PDF assistant tools that help you analyze and understand complex documents through conversation.",
      date: "April 12, 2025",
      tag: "Tools",
      imageSrc: "/images/chat-pdfs.jpg",
    },
    {
      id: 3,
      title: "How to Generate Flashcards from PDFs Using AI",
      slug: "generate-flashcards-from-pdfs",
      excerpt:
        "Boost your study efficiency by automatically creating flashcards from your lecture notes and textbooks using AI.",
      date: "April 6, 2025",
      tag: "Learning",
      imageSrc: "/images/flashcards.jpg",
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <Script
        id="blog-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            headline: "Notesnap Blog - AI Document Reading and Study Tips",
            description:
              "Explore articles about AI document reading, PDF chatbots, study productivity tips, and more from Notesnap.",
            author: {
              "@type": "Organization",
              name: "Notesnap",
              url: "https://notesnap.app/",
            },
            blogPost: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              description: post.excerpt,
              datePublished: post.date,
              author: {
                "@type": "Organization",
                name: "Notesnap",
              },
            })),
          }),
        }}
      />

      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* Hero Section */}
        <motion.div
          className="text-center mb-16 mt-12 md:mb-24"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                delay: 0.2,
                duration: 0.6,
              },
            },
          }}
        >
          <div className="inline-block mb-4 bg-zinc-100 px-3 py-1 rounded-full">
            <span className="text-zinc-800 text-sm font-medium">
              Our Knowledge Base
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-zinc-700 to-black bg-clip-text text-transparent">
            Notesnap Resources
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 max-w-2xl mx-auto">
            Explore insights on AI document reading, studying strategies, and
            productivity hacks
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button className="px-5 py-2 rounded-full bg-black text-white font-medium hover:bg-zinc-800 transition-colors">
            All
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
            Study Tips
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
            Tools
          </button>
          <button className="px-5 py-2 rounded-full bg-white border border-zinc-200 text-zinc-700 font-medium hover:bg-zinc-50 hover:border-zinc-300 transition-colors">
            Learning
          </button>
        </motion.div>

        {/* Blog Posts Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {blogPosts.map((post) => (
            <motion.div
              key={post.id}
              variants={fadeInUp}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100 flex flex-col h-full"
            >
              <div className="relative h-52 bg-gradient-to-br from-zinc-700 to-black overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-80">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white opacity-30"
                  >
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-xs font-semibold text-zinc-800">
                    {post.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="mb-4 text-zinc-500 text-sm">{post.date}</div>
                <h2 className="text-xl font-bold mb-3 text-zinc-800 hover:text-black transition-colors leading-tight">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-zinc-600 mb-6 flex-1">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-zinc-800 hover:text-black transition-colors group"
                >
                  Read article
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="ml-1 group-hover:translate-x-1 transition-transform"
                  >
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Newsletter Section */}
        <motion.div
          className="mt-20 bg-gradient-to-br from-zinc-100 to-zinc-200 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-4">
              Stay updated with our latest articles
            </h3>
            <p className="text-zinc-600 mb-6 max-w-2xl mx-auto">
              Join our newsletter and get notified when we publish new guides
              about AI document processing, study techniques, and productivity
              hacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 rounded-lg flex-1 border border-zinc-200 focus:ring-2 focus:ring-zinc-500 focus:border-zinc-500 outline-none"
              />
              <button className="bg-black text-white font-medium px-6 py-3 rounded-lg hover:bg-zinc-800 transition-colors shadow-sm">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}

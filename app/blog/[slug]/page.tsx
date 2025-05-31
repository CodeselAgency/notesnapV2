"use client";

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Home/Navbar';
import Footer from '@/components/Home/Footer';
import Script from 'next/script';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;

  // This would typically come from a database or CMS
  // Here we're hard-coding for demonstration
  const blogPosts = {
    "summarize-academic-papers-ai": {
      title: "How to Summarize Academic Papers Using AI",
      date: "May 15, 2023",
      tag: "Study Tips",
      content: "academic-papers",
      author: "Notesnap Team",
      authorRole: "Experts in AI document processing and academic productivity",
      relatedPosts: [
        {
          slug: "best-ai-tools-chat-pdfs",
          title: "Best AI Tools to Chat with Your PDFs in 2023",
          excerpt: "Discover the top AI PDF assistant tools that help you analyze and understand complex documents through conversation."
        },
        {
          slug: "generate-flashcards-from-pdfs",
          title: "How to Generate Flashcards from PDFs Using AI",
          excerpt: "Boost your study efficiency by automatically creating flashcards from your lecture notes and textbooks using AI."
        }
      ]
    },
    "best-ai-tools-chat-pdfs": {
      title: "Best AI Tools to Chat with Your PDFs in 2023",
      date: "June 2, 2023",
      tag: "Tools",
      content: "chat-pdfs",
      author: "Notesnap Team",
      authorRole: "AI Tool Researchers",
      relatedPosts: [
        {
          slug: "summarize-academic-papers-ai",
          title: "How to Summarize Academic Papers Using AI",
          excerpt: "Learn how to use AI tools like Notesnap to quickly extract key insights from academic papers and research studies."
        },
        {
          slug: "generate-flashcards-from-pdfs",
          title: "How to Generate Flashcards from PDFs Using AI",
          excerpt: "Boost your study efficiency by automatically creating flashcards from your lecture notes and textbooks using AI."
        }
      ]
    },
    "generate-flashcards-from-pdfs": {
      title: "How to Generate Flashcards from PDFs Using AI",
      date: "June 18, 2023",
      tag: "Learning",
      content: "flashcards",
      author: "Notesnap Team",
      authorRole: "Learning Specialists",
      relatedPosts: [
        {
          slug: "summarize-academic-papers-ai",
          title: "How to Summarize Academic Papers Using AI",
          excerpt: "Learn how to use AI tools like Notesnap to quickly extract key insights from academic papers and research studies."
        },
        {
          slug: "best-ai-tools-chat-pdfs",
          title: "Best AI Tools to Chat with Your PDFs in 2023",
          excerpt: "Discover the top AI PDF assistant tools that help you analyze and understand complex documents through conversation."
        }
      ]
    }
  };

  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
          <Link href="/blog" className="text-zinc-800 hover:underline">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white">
      <Script
        id="blog-post-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": `Learn about ${post.content} with Notesnap's AI-powered tools.`,
            "image": `https://notesnap.app/images/${post.content}.jpg`,
            "datePublished": post.date,
            "author": {
              "@type": "Organization",
              "name": "Notesnap",
              "url": "https://notesnap.app/"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Notesnap",
              "logo": {
                "@type": "ImageObject",
                "url": "https://notesnap.app/images/notesnap-logo3.png"
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://notesnap.app/blog/${slug}`
            }
          })
        }}
      />

      <Navbar />
      
      <main className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        {/* <div className="flex justify-center container mx-auto">
        <Link 
                href="/blog" 
                className="inline-flex items-center text-zinc-700 hover:text-zinc-900 mb-6 font-medium"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <line x1="19" y1="12" x2="5" y2="12"></line>
                  <polyline points="12 19 5 12 12 5"></polyline>
                </svg>
                Back to Resources
              </Link>
        </div> */}
        <article className="max-w-3xl mx-auto">

          <motion.header 
            className="mb-10 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            
            
            <div className="inline-block mb-4 bg-zinc-100 px-3 py-1 rounded-full">
              <span className="text-zinc-800 text-sm font-medium">{post.tag}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-zinc-900 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center text-zinc-600 text-sm">
              <span>{post.date}</span>
              <span className="mx-2">•</span>
              <span>10 min read</span>
            </div>
          </motion.header>

          <motion.div 
            className="prose lg:prose-xl max-w-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="mb-8 md:mb-12">
              <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-br from-zinc-700 to-black rounded-2xl flex items-center justify-center mb-4 overflow-hidden relative shadow-lg">
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-white/40">
                    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path>
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8 text-white">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 capitalize">{post.content.replace(/-/g, ' ')}</h2>
                    <p className="text-white/80">Using AI to enhance your learning experience</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-zinc-500 text-center">Artificial intelligence transforming how we work with documents</p>
            </div>

            {/* This would be dynamically loaded content */}
            <h2 className="text-2xl font-bold mt-12 mb-6 text-zinc-900">Understanding {post.title}</h2>
            <p className="text-zinc-700 leading-relaxed">
              This is a dynamic blog post page that would load content based on the URL slug. The content for each blog post 
              would typically be stored in a database or content management system. For this example, we&apos;re showing a template 
              with some placeholder content.
            </p>
            
            <div className="my-10 p-6 bg-zinc-100 rounded-xl border border-zinc-200">
              <h3 className="text-lg font-semibold text-zinc-800 mb-2">Did You Know?</h3>
              <p className="text-zinc-700">
                Dynamic routing in Next.js allows you to create pages with paths that aren&apos;t known at build time. 
                This is perfect for blog posts, product pages, and other content that might be added later.
              </p>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-zinc-900">Key Features</h2>
            
            <div className="grid md:grid-cols-2 gap-6 my-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                {/* <div className="w-10 h-10 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold mb-4">1</div>
                <h3 className="text-xl font-semibold mb-3 text-zinc-800">Feature One</h3> */}
                <p className="text-zinc-600">
                  This would be a description of the first key feature related to {post.title}.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100">
                {/* <div className="w-10 h-10 bg-zinc-800 text-white rounded-full flex items-center justify-center font-bold mb-4">2</div>
                <h3 className="text-xl font-semibold mb-3 text-zinc-800">Feature Two</h3> */}
                <p className="text-zinc-600">
                  This would be a description of the second key feature related to {post.title}.
                </p>
              </div>
            </div>

            <div className="my-12 p-8 bg-gradient-to-r from-zinc-800 to-black rounded-xl text-white shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white">Ready to transform your workflow?</h2>
              <p className="mb-6 text-white/90">
                Try Notesnap today and experience the power of AI for your documents.
              </p>
              <Link 
                href="/signin"
                className="inline-block bg-white text-zinc-800 font-semibold px-6 py-3 rounded-lg hover:bg-zinc-100 transition-colors"
              >
                Get Started for Free
              </Link>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-zinc-900">Benefits</h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-zinc-100 mb-12">
              <ul className="divide-y divide-zinc-100">
                <li className="py-3 flex items-center">
                  <div className="bg-zinc-100 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Time efficiency:</span>
                    <span className="text-zinc-700"> Save time with AI-powered tools</span>
                  </div>
                </li>
                <li className="py-3 flex items-center">
                  <div className="bg-zinc-100 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Better understanding:</span>
                    <span className="text-zinc-700"> Get clearer insights from your documents</span>
                  </div>
                </li>
                <li className="py-3 flex items-center">
                  <div className="bg-zinc-100 rounded-full p-1 mr-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900">Enhanced productivity:</span>
                    <span className="text-zinc-700"> Accomplish more in less time</span>
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-6 text-zinc-900">Conclusion</h2>
            <p className="text-zinc-700 leading-relaxed mb-4">
              This is where we would summarize the key points about {post.title}. In a real implementation, 
              this content would come from a database or CMS, making it easy to manage multiple blog posts.
            </p>
            <p className="text-zinc-700 leading-relaxed mb-4">
              Ready to try it out? 
              <Link href="/signin" className="text-zinc-800 hover:text-black font-semibold mx-1">
                Get started with Notesnap today
              </Link> 
              and see how our AI tools can transform your document workflow.
            </p>
          </motion.div>

          <motion.div 
            className="border-t border-zinc-200 mt-12 pt-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <h3 className="text-xl font-bold mb-6 text-zinc-900">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.relatedPosts.map((relatedPost, index) => (
                <Link 
                  key={index}
                  href={`/blog/${relatedPost.slug}`} 
                  className="group block p-6 bg-white rounded-xl border border-zinc-100 shadow-sm hover:shadow-md hover:border-zinc-200 transition-all"
                >
                  <h4 className="font-bold mb-2 text-zinc-800 group-hover:text-black transition-colors">
                    {relatedPost.title}
                  </h4>
                  <p className="text-zinc-600 text-sm mb-3">
                    {relatedPost.excerpt}
                  </p>
                  <span className="text-xs text-zinc-800 font-medium">Read article →</span>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Author & Share */}
          <motion.div 
            className="bg-zinc-100 rounded-xl p-6 mt-12 flex flex-col md:flex-row gap-6 items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Image src="/images/notesnap-logo3.png" alt="Notesnap Logo" width={50} height={50} className="rounded-xl" />
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-zinc-900 mb-1">Written by {post.author}</h4>
              <p className="text-zinc-600 text-sm mb-2">
                {post.authorRole}
              </p>
                {/* <div className="flex space-x-2 justify-center md:justify-start">
                  <a href="#" className="text-zinc-700 hover:text-black" aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="text-zinc-700 hover:text-black" aria-label="LinkedIn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div> */}
            </div>
          </motion.div>
        </article>
      </main>

      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
} 
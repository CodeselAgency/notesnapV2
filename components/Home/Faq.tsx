"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiPlus } from "react-icons/fi";

// FAQ item type
type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Toggle function to expand/collapse FAQ items
  const toggleItem = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // FAQ data
  const faqItems: FaqItem[] = [
    {
      question: "What is NoteSnap and how does it work?",
      answer: (
        <>
          <p className="mb-3">
            NoteSnap is an AI-powered note-taking tool that turns your PDFs into
            interactive, chat-based study guides. It helps students,
            researchers, and professionals by:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Uploading and chatting with PDF documents</li>
            <li>Auto-generating summaries, notes, and flashcards</li>
            <li>Creating mind maps and visual boards from content</li>
            <li>Extracting important points, citations, and insights</li>
          </ul>
        </>
      ),
    },
    {
      question: "What file types are supported by NoteSnap?",
      answer:
        "Currently, NoteSnap supports PDF files only. You can upload textbooks, academic papers, lecture notes, and scanned documents. The platform reads your files and allows AI-powered interactions. Higher-tier plans support larger files and more uploads.",
    },
    {
      question: "How accurate is NoteSnap's AI for document understanding?",
      answer:
        "NoteSnap uses advanced AI language models like OpenAI's GPT-3.5 and GPT-4, offering high accuracy for reading and summarizing PDFs. It performs well on complex academic language, technical subjects, and scanned documents with OCR support. Document clarity affects performance.",
    },
    {
      question: "What are the pricing plans for NoteSnap?",
      answer: (
        <>
          <p className="mb-3">
            NoteSnap offers flexible pricing for individuals and teams:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Hobby Plan (Free):</strong> 1 PDF upload, 50
              questions/month, 10MB file size
            </li>
            <li>
              <strong>Ultimate Plan ($16.99/month):</strong> Unlimited PDFs,
              GPT-4 access, team sharing, OCR features
            </li>
          </ul>
          <p className="mt-3">Annual subscriptions come with a 41% discount.</p>
        </>
      ),
    },
    {
      question: "Is NoteSnap secure? How is my data protected?",
      answer:
        "Yes, your data is secure with NoteSnap. Files are encrypted during upload and storage. We never use your documents to train AI models. Only you (and any invited team members) can access your documents. You can delete your data at any time from your dashboard.",
    },
    {
      question: "Can I use NoteSnap on mobile devices?",
      answer:
        "Absolutely. NoteSnap is mobile-friendly and works smoothly on smartphones and tablets. While there's no dedicated mobile app yet, the web app is fully responsive for mobile browsers. You can chat with PDFs anytime, anywhere.",
    },
    {
      question: "How is NoteSnap different from PDF.ai or Notion AI?",
      answer:
        "Unlike PDF.ai or Notion AI, NoteSnap focuses specifically on academic and productivity workflows. It combines PDF chatting, summarization, note generation, mind mapping, and team collaboration in one interface—optimized for students and researchers.",
    },
    {
      question: "Does NoteSnap support handwriting or scanned PDFs?",
      answer:
        "Yes, on premium plans with OCR support, NoteSnap can process scanned PDFs, including documents with handwriting (depending on legibility). It converts image-based PDFs into readable text for AI processing.",
    },
  ];

  // Accordion item component with optimized animations
  const AccordionItem = ({
    item,
    isActive,
    onClick,
  }: {
    item: FaqItem;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | string>(0);

    // Effect to handle height animations with accurate timing
    useEffect(() => {
      // For measuring height
      const updateHeight = () => {
        if (!contentRef.current) return;

        if (isActive) {
          // Get exact content height for opening animation
          const contentHeight = contentRef.current.scrollHeight;
          setHeight(contentHeight);
        } else {
          // Add small delay for closing to coordinate with opacity
          setTimeout(() => {
            setHeight(0);
          }, 75);
        }
      };

      // Call immediately and also add resize listener for dynamic content
      updateHeight();
      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }, [isActive]);

    return (
      <div
        className={`mb-4 border-2 border-zinc-100 px-4 pb-2 p-2 rounded-xl transition-all duration-800 cursor-pointer`}
      >
        <button
          onClick={onClick}
          className="flex justify-between items-center w-full text-left py-3 focus:outline-none focus:ring-0 group transition-all duration-300"
          aria-expanded={isActive}
        >
          <h3 className="text-lg font-medium text-gray-900 transition-colors group-hover:text-gray-700">
            {item.question}
          </h3>
          <div
            className={`ml-4 flex-shrink-0 p-1.5 rounded-full transition-all duration-500 ${
              isActive ? "bg-purple-100" : "bg-gray-100"
            } group-hover:bg-purple-100`}
          >
            <div
              className={`transform transition-transform duration-800 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                isActive
                  ? "rotate-[135deg] transition-all duration-800"
                  : "rotate-0"
              }`}
            >
              <FiPlus className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </button>

        <div
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            transition: `height ${
              isActive ? "700ms" : "500ms"
            } cubic-bezier(0.34, 1.56, 0.64, 1)`,
          }}
          className="overflow-hidden"
          aria-hidden={!isActive}
        >
          <div
            ref={contentRef}
            className="py-3 px-1 text-base text-gray-600 leading-relaxed font-inter font-medium"
            style={{
              opacity: isActive ? 1 : 0,
              transform: `translateY(${isActive ? "0" : "-8px"})`,
              transition: `
                opacity ${
                  isActive ? "400ms" : "300ms"
                } cubic-bezier(0.4, 0.0, 0.2, 1),
                transform ${
                  isActive ? "500ms" : "300ms"
                } cubic-bezier(0.34, 1.56, 0.64, 1)
              `,
              transitionDelay: isActive ? "150ms" : "0ms",
            }}
          >
            {item.answer}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 md:py-24 " id="faq">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Got questions about NoteSnap? Find answers to the most common
            questions below.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isActive={activeIndex === index}
              onClick={() => toggleItem(index)}
            />
          ))}
        </div>

        {/* Additional help section */}
        <div className="mt-16 flex justify-center items-center gap-4 max-sm:flex-col">
          <p className="text-gray-600 font-bold text-lg font-inter text-center m-0">
            Still have questions?
          </p>

          <a
            href="mailto:support@notesnap.app"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-b from-zinc-700 to-zinc-900 cursor-pointer hover:shadow-md transition-all duration-300"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
};

export default Faq;

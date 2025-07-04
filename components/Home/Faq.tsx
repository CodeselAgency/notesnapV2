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
    position,
    item,
    isActive,
    onClick,
  }: {
    position:number;
    item: FaqItem;
    isActive: boolean;
    onClick: () => void;
  }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | string>(0);

    // Effect to handle height animations with accurate timing
    useEffect(() => {
      const updateHeight = () => {
        if (!contentRef.current) return;
        const contentHeight = contentRef.current.scrollHeight;
        
        if (isActive) {
          setHeight(contentHeight);
        } else {
          // First let the content fade out
          contentRef.current.style.opacity = '0';
          contentRef.current.style.transform = 'translateY(-8px)';
          
          // Then animate the height
          setTimeout(() => {
            setHeight(0);
          }, 200);
        }
      };

      updateHeight();
      window.addEventListener("resize", updateHeight);

      return () => {
        window.removeEventListener("resize", updateHeight);
      };
    }, [isActive]);

    return (
      <div className={`mb-4 px-4 pb-2 py-1 rounded-xl transition-all duration-800 cursor-pointer border`}>
        <button
          onClick={onClick}
          className="flex justify-between items-center w-full text-left py-2 cursor-pointer group transition-all duration-300 ease-in "
          aria-expanded={isActive}
        >
          <h3 className="text-md font-medium text-gray-900 transition-colors group-hover:text-gray-700 flex gap-5">

            <span className="font-semibold">
              0{position}
            </span>
            {item.question}
          </h3>
          <div
            className={`ml-4 flex-shrink-0 p-1.5 rounded-full transition-all duration-500  `}
          >
            <div
              className={`transform transition-transform duration-500 ease-in-out ${
                isActive ? "rotate-[135deg]" : "rotate-0"
              }`}
            >
              <FiPlus className="h-5 w-5 text-gray-900" />
            </div>
          </div>
        </button>

        <div
          style={{
            height: typeof height === "number" ? `${height}px` : height,
            transition: "height 400ms cubic-bezier(0.4, 0, 0.2, 1)",
            overflow: "hidden"
          }}
          aria-hidden={!isActive}
        >
          <div
            ref={contentRef}
            className="py-3 px-1 text-base text-gray-600 leading-relaxed font-inter font-medium"
            style={{
              opacity: isActive ? 1 : 0,
              transform: `translateY(${isActive ? "0" : "-8px"})`,
              transition: "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
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
              position={index+1}
              isActive={activeIndex === index}
              onClick={() => toggleItem(index)}
            />
          ))}
        </div>

        {/* Additional help section */}
        <div className="mt-16 flex justify-center items-center gap-4 max-sm:flex-col">
          <p className="text-gray-600 font-medium text-lg font-inter text-center m-0">
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

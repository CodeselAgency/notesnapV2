"use client";

import Hero from "@/components/Home/Hero";
import MockUp from "@/components/Home/Mockup";
import Trust from "@/components/Home/Trust";
import Testimonals from "@/components/Home/Testimonals";
import Faq from "@/components/Home/Faq";
import Footer from "@/components/Home/Footer";
import Script from "next/script";
import Process from "@/components/Home/Process";
import HowItWorks from "@/components/Home/HowitWorks";
import { ResizableNavbar } from "@/components/Home/ResizebleNavbar";
import BentoGrid from "@/components/Home/BentoGrid";
import { useAuth } from "@/hooks/useAuth";
import { redirect } from "next/navigation";

import Navbar from "@/components/Home/Navbar";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
export default function Home() {
  const { user } = useAuth();

  if (user) {
    redirect("/dashboard");
  }

  return (
    <div
      className="min-h-screen bg-white font-sans relative"
      // style={{ fontFamily: "'Satoshi', sans-serif" }}
    >
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Notesnap",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web",
              description:
                "AI PDF Assistant - Chat, Summarize & Understand Documents. Use AI to chat with your PDFs, summarize content, and generate insights instantly.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "500",
              },
              featureList:
                "AI document reader, Chat with PDF, Document summarizer, AI note-taking, Smart PDF reader, Upload and chat with PDFs, Summarize documents with AI, AI-powered study assistant, Annotate PDFs with AI",
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is Notesnap?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Notesnap is an AI PDF assistant that allows you to chat with your documents, summarize content, and generate insights instantly. It's perfect for students, researchers, and professionals looking to increase productivity.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does Notesnap help with studying?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Notesnap helps with studying by allowing you to upload PDFs and ask questions about the content. It can summarize academic papers, generate flashcards, create notes, and help you understand complex information through conversational AI.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can Notesnap work with any type of document?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Notesnap works best with PDF documents. It can handle academic papers, textbooks, legal documents, research papers, and various other text-based PDFs to provide summaries, insights, and answer questions about the content.",
                  },
                },
              ],
            },
          ]),
        }}
      />

      <SmoothScrollProvider>

      <div className="relative z-10">
        {/* Header/Navigation */}

          <Navbar />
          {/* <Navbar /> */}
          <Hero />

          {/* <MockUp /> */}
          
          <Trust />
          {/* <BentoGrid /> */}
          {/* <HowItWorks /> */}
          <Process />
          <Testimonals />
          <Faq />
          <Footer />
        </div>
      </SmoothScrollProvider>
    </div>
  );
}

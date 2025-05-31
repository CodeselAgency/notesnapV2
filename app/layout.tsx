import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvide";
import { ResizableNavbar } from "@/components/Home/ResizebleNavbar";
import GoogleAnalytics from "@/components/Analytics/GoogleAnalytics";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Notesnap - AI PDF Assistant – Chat, Summarize & Understand Documents",
  description:
    "Use AI to chat with your PDFs, summarize content, and generate insights instantly. Perfect for students, professionals, and researchers.",
  keywords:
    "AI PDF assistant, chat with PDF, document summarizer, AI note-taking app, study assistant, AI productivity tool, smart PDF reader, AI document reader, AI chat with PDF, upload and chat with PDFs, summarize documents with AI, AI-powered study assistant, annotate PDFs with AI, AI research assistant, AI homework helper, AI notes from documents, AI meeting notes generator, best AI tool to chat with your PDF, how to summarize academic papers using AI, online tool to understand legal documents with AI, convert PDF to notes using AI, generate flashcards from PDFs using AI",
  icons: {
    icon: "/images/notesnap-favicon.png",
  },
  openGraph: {
    title: "Notesnap - Chat with Your PDF - Powered by AI",
    description:
      "Talk to your PDFs, get summaries, extract answers, and take AI-powered notes with ease.",
    url: "https://notesnap.app/",
    siteName: "Notesnap",
    images: [
      {
        url: "/images/notesnap-logo3.png",
        width: 1200,
        height: 630,
        alt: "Notesnap - AI PDF Assistant",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Notesnap - AI PDF Assistant",
    description:
      "Use AI to chat with your PDFs, summarize content, and generate insights instantly.",
    images: ["/images/notesnap-logo3.png"],
  },
  alternates: {
    canonical: "https://notesnap.app/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta
        name="google-site-verification"
        content="spvP63Uc5ZNtw9zq9SPVVul2xphtbLG0rdbxk0NxPHg"
      />
      <body className={`${outfit.className} antialiased`}>
        <GoogleAnalytics />
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

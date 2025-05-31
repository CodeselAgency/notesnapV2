import React from "react";
import { Metadata } from "next";
// import { Caveat } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/Home/Navbar";
import Footer from "@/components/Home/Footer";
import { cn } from "@/lib/utils";
import { ResizableNavbar } from "@/components/Home/ResizebleNavbar";
import { NavbarPlaceholder } from "@/components/UI/ResizableNavbar";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
// const caveat = Caveat({
//   variable: "--font-caveat",
//   subsets: ["latin"],
//   weight: ["400", "500", "600", "700"],
// });

export const metadata = {
  title: "NoteSnap - Turn PDFs into A's",
  description:
    "Chat with PDFs, get quick notes, create mind maps, and organize on boards—AI-powered to boost your grades.",
};

// This layout component just passes children through, inheriting the root layout structure.
export default function UseCasesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex flex-col min-h-screen bg-white font-sans">
      {/* <Navbar /> */}
      <SmoothScrollProvider>
        <ResizableNavbar />
        <NavbarPlaceholder />
        {children}
        <Footer />
      </SmoothScrollProvider>
    </section>
  ); // Return children directly, possibly wrapped in a React Fragment if needed
}

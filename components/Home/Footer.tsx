"use client";
import React from "react";
import Link from "next/link";
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";
// import { Inter } from 'next/font/google';
import Image from "next/image";
import { LampContainer } from "@/components/UI/lamp";

// Initialize the Inter font with specific subsets and weights
// const inter = Inter({
//   subsets: ['latin'],
//   display: 'swap',
//   weight: ['400', '500', '600'],
// });

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  return (
    <li className="mb-2">
      <Link
        href={href}
        className="text-zinc-400  transition-colors duration-200 text-xs sm:text-sm hover:text-gray-200"
      >
        <span className="relative inline-block group">
          {children}
          {/* <span className="block max-w-0 bg-white"></span> */}
        </span>
      </Link>
    </li>
  );
};

const SocialIcon = ({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) => {
  return (
    <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
      <Link
        href={href}
        aria-label={label}
        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center bg-zinc-100 hover:bg-zinc-200 transition-colors duration-200"
      >
        <Icon className="text-zinc-600" size={14} />
      </Link>
    </motion.div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  // const [email, setEmail] = useState('');

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   console.log('Subscribed with:', email);
  //   setEmail('');
  // };

  const partners = [
    { name: "ProductHunt", url: "https://www.producthunt.com/" },
    { name: "r/Productivity", url: "https://www.reddit.com/r/productivity/" },
    { name: "r/StudyTips", url: "https://www.reddit.com/r/studytips/" },
    { name: "FutureTools.io", url: "https://futuretools.io/" },
    { name: "Toolify.ai", url: "https://toolify.ai/" },
    { name: "AI Scout", url: "https://aiscout.net/" },
  ];

  return (
    <section className="p-4 max-sm:p-3 ">
      <footer className={`bg-black rounded-[18px]`}>
        <LampContainer>
          <motion.h1 className="mt-0 bg-white py-0 bg-clip-text text-center text-3xl sm:text-4xl md:text-7xl  tracking-wide text-transparent font-semibold">
            NoteSnap
            <br />
          </motion.h1>
          <motion.div>
            <motion.span className="text-white text-base sm:text-lg w-full font-medium font-inter text-center block tracking-wide">
              Empowering Your Studies, Elevating Your Grades.
            </motion.span>
          </motion.div>
        </LampContainer>
        <div className="container mx-auto px-2 sm:px-6 py-8 sm:py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-10 gap-8 md:gap-10 text-center md:text-left">
            {/* Brand column */}
            <div className="md:col-span-3 space-y-4 sm:space-y-5 flex flex-col items-center md:items-start">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <Image
                  src="/images/notesnap-logo3.png"
                  alt="NoteSnap Logo"
                  width={40}
                  height={40}
                  className="w-10 h-10 max-sm:w-[40px] max-sm:h-[40px] rounded-lg"
                />
                <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  NoteSnap
                </h3>
              </div>
              <p className="text-white text-xs sm:text-sm leading-relaxed tracking-wide font-medium font-inter-tight max-w-xs md:max-w-none mx-auto md:mx-0">
                Empowering Your Studies, Elevating Your Grades. Our platform
                transforms how you learn and retain information.
              </p>
            </div>
            {/* Spacer for medium screens */}
            <div className="hidden md:block md:col-span-1"></div>
            {/* Navigation links */}
            <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 mt-6 md:mt-0">
              {/* Column 1: NoteSnap */}
              <div>
                <h4 className="font-medium text-white mb-2 sm:mb-3 text-sm tracking-wide">
                  NoteSnap
                </h4>
                <ul className="font-inter font-medium">
                  <FooterLink href="/">Home</FooterLink>
                  <FooterLink href="/#how-it-works">Features</FooterLink>
                  <FooterLink href="/pricing">Pricing</FooterLink>
                  <FooterLink href="/#testimonials">Testimonials</FooterLink>
                </ul>
              </div>
              {/* Column 2: Resources */}
              <div>
                <h4 className="font-medium text-white mb-2 sm:mb-3 text-sm tracking-wide">
                  Resources
                </h4>
                <ul>
                  {/* <FooterLink href="/blog">Blog</FooterLink>
                  <FooterLink href="/help">Help Center</FooterLink> */}
                  <FooterLink href="mailto:support@notesnap.app">
                    Contact Us
                  </FooterLink>
                  <FooterLink href="/#faq">FAQs</FooterLink>
                  <FooterLink href="/blog">Blogs</FooterLink>
                </ul>
              </div>
              {/* Column 3: Legal */}
              <div>
                <h4 className="font-medium text-white mb-2 sm:mb-3 text-sm tracking-wide">
                  Legal
                </h4>
                <ul>
                  <FooterLink href="/terms-of-service">
                    Terms of Service
                  </FooterLink>
                  <FooterLink href="/privacypolicy">Privacy Policy</FooterLink>
                  {/* <FooterLink href="/refundpolicy">Refund Policy</FooterLink> */}
                </ul>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          {/* <div className="mt-8 pt-8 border-t border-zinc-800">
            <h4 className="font-medium text-white mb-4 text-sm tracking-wide text-center">
              Featured On
            </h4>
            <div className="flex flex-wrap justify-center gap-4">
              {partners.map((partner, index) => (
                <a 
                  key={index} 
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zinc-400 text-xs hover:text-zinc-200 transition-colors"
                >
                  {partner.name}
                </a>
              ))}
            </div>
          </div> */}

          {/* Bottom section with copyright and social */}
          <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-center  items-center gap-4 w-full text-center">
            {/* Copyright */}
            <p className="text-white text-[10px] sm:text-xs font-inter font-medium text-center">
              &copy; {currentYear} NoteSnap. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
};

export default Footer;

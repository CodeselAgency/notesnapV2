"use client";

import React, { useState } from "react";
import Link from "next/link";
// import { User } from "@supabase/supabase-js";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi"; // Icons for mobile menu
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";

interface NavbarProps {
  // Props are now optional since we'll use useAuth
  // user?: User | null;
  onSignOut?: () => void;
}

const Navbar = ({ user: propUser, onSignOut: propSignOut }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  // Use the auth provider to get user and signOut function
  const { user: authUser, signOut: authSignOut } = useAuth();

  // Use provided props if available, otherwise use values from auth context
  const user = propUser || authUser;
  const onSignOut = propSignOut || authSignOut;

  const navItems = [
    {
      label: "Features",
      href: "#how-it-works",
    },
    {
      label: "Pricing",
      href: "/pricing",
    },
    {
      label: "Use Cases",
      href: "/use-cases",
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  return (
    <section className="flex items-center justify-center p-2 w-full relative z-50 ">
      <header className=" sticky top-2 w-full max-w-2xl bg-gradient-to-b from-zinc-900 to-zinc-800 rounded-2xl shadow-inner shadow-white/20">
        <div className="w-full h-12 sm:h-14 px-2 sm:px-4 flex justify-between items-center">
          {/* Logo - always visible */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-start">
              <div className="relative w-9 h-9 max-sm:w-8 max-sm:h-8 rounded-xl">
                <Image
                  src="/images/notesnap-logo3.png"
                  alt="Logo"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="text-sm font-medium text-white transition-colors hover:text-gray-300"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Buttons / User Dropdown (Desktop) */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={toggleUserDropdown}
                  className="flex items-center focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-b from-zinc-700 to-zinc-900   rounded-full flex items-center justify-center text-white text-sm font-semibold cursor-pointer">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.22, ease: "easeInOut" }}
                      className="absolute right-0 mt-2 w-56 bg-zinc-900/90 border border-zinc-700 rounded-xl shadow-2xl py-2 z-50 backdrop-blur-lg"
                    >
                      {/* Optional pointer arrow */}
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-zinc-900/90 border-t border-l border-zinc-700 rotate-45 z-10"></div>
                      <Link href="/dashboard">
                        <div className="block px-4 py-2 text-sm text-white cursor-pointer font-semibold  rounded transition">
                          Dashboard
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          onSignOut();
                          setShowUserDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 cursor-pointer font-semibold  rounded transition"
                      >
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link href="/signin">
                  <button className="bg-gradient-to-b from-zinc-700 to-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer hover:from-zinc-800 hover:to-black transition-colors">
                    Sign in
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-white focus:outline-none p-1"
            >
              {isMobileMenuOpen ? (
                <HiX size={20} />
              ) : (
                <HiOutlineMenuAlt3 size={20} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden absolute top-full left-0 right-0 bg-zinc-800/95 backdrop-blur-md shadow-lg py-3 border-t border-zinc-700 rounded-xl mt-1 z-50"
          >
            <div className="px-4 flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  href={item.href}
                  key={item.label}
                  className="text-sm font-medium text-white hover:text-gray-300 transition-colors py-2 text-center"
                  onClick={() => setIsMobileMenuOpen(false)} // Close menu on click
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-zinc-700 pt-3 flex flex-col items-center space-y-3">
                {user ? (
                  <div className="flex flex-col items-center w-full">
                    <span className="text-xs text-gray-300 mb-2">
                      {user.email}
                    </span>
                    <Link
                      href="/dashboard"
                      className="py-2 text-center w-full hover:bg-zinc-700 rounded text-sm text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        onSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-center py-2 text-xs text-red-400 hover:bg-zinc-700 rounded cursor-pointer"
                    >
                      Sign out
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full bg-gradient-to-b from-zinc-700 to-zinc-900 text-white text-sm font-medium px-4 py-2 rounded-lg cursor-pointer border border-zinc-600">
                        Sign in
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </header>
    </section>
  );
};

export default Navbar;

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
    <section className="flex items-center justify-center p-2 w-full relative z-50 max-sm:px-18">
      <header className="fixed top-2 w-full max-w-2xl bg-white/30 backdrop-blur-lg border border-gray-200 ">
        <div className="w-full h-12 max-sm:h-14 px-2 sm:px-4 flex justify-between items-center">
          {/* Logo - always visible */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center justify-start group">
              <div className="relative w-12 h-12 max-sm:w-8 max-sm:h-8 rounded-xl transition-transform duration-200 ease-out group-hover:scale-105">
                <Image
                  src="/images/new-logo.png"
                  alt="Logo"
                  fill
                  className="object-contain rounded-lg"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8 lg:space-x-8 items-center">
            {navItems.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="text-sm font-medium text-black/80 font-inter-tight tracking-wide transition-all duration-300 ease-in-out hover:font-semibold "
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
                  className="flex items-center focus:outline-none transition-transform duration-200 hover:scale-105"
                >
                  <div className="w-8 h-8 bg-transparent flex items-center justify-center text-zinc-900 text-sm font-semibold cursor-pointer hover:opacity-80 border border-zinc-200  rounded-full transition-all duration-200">
                    {user.email ? user.email.charAt(0).toUpperCase() : "U"}
                  </div>
                </button>
                <AnimatePresence>
                  {showUserDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                      className="absolute right-0 mt-2 w-56 bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl py-2 z-50"
                    >
                      {/* Optional pointer arrow */}
                      <div className="absolute -top-2 right-6 w-4 h-4 bg-white/30 backdrop-blur-xl border-t border-l border-white/20 rotate-45 z-10"></div>
                      <Link href="/dashboard">
                        <div className="block px-4 py-2 text-sm text-zinc-800 cursor-pointer font-semibold rounded transition-colors duration-200 hover:bg-black/5">
                          Dashboard
                        </div>
                      </Link>
                      <button
                        onClick={() => {
                          onSignOut();
                          setShowUserDropdown(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-500 cursor-pointer font-semibold rounded transition-colors duration-200 hover:bg-red-50/50"
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
                  <button className="relative overflow-hidden group border-l border-gray-200 text-zinc-900 text-sm px-4 py-2  cursor-pointer transition-all duration-300 font-inter-tight tracking-wide font-semibold hover:opacity-80">
                    <span className="relative z-10">Sign in</span>
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-zinc-800 focus:outline-none p-1.5 rounded-lg transition-colors duration-200 hover:bg-black/5"
              aria-label="Toggle mobile menu"
            >
              <motion.div
                animate={isMobileMenuOpen ? "open" : "closed"}
                initial={false}
              >
                {isMobileMenuOpen ? (
                  <HiX size={20} className="transform transition-transform duration-200 hover:scale-110" />
                ) : (
                  <HiOutlineMenuAlt3 size={20} className="transform transition-transform duration-200 hover:scale-110" />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              className="md:hidden overflow-hidden bg-white/30 backdrop-blur-xl border-t border-gray-200/50 rounded-b-2xl"
            >
              <div className="px-4 py-3 flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    href={item.href}
                    key={item.label}
                    className="text-sm font-medium text-zinc-800 transition-colors duration-200 py-2 px-3 rounded-lg hover:opacity-80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200/50 pt-3 flex flex-col items-center space-y-3">
                  {user ? (
                    <div className="flex flex-col items-center w-full space-y-2">
                      <span className="text-xs text-zinc-500">
                        {user.email}
                      </span>

                      {
                        isMobileMenuOpen && (
                          <>
                          <Link
                            href="/dashboard"
                        className="w-full py-2 px-3 text-center rounded-lg text-sm text-zinc-800 transition-colors duration-200 hover:opacity-80"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={() => {
                          onSignOut();
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full text-center py-2 px-3 text-sm text-red-500 rounded-lg transition-colors duration-200 hover:opacity-80"
                      >
                        Sign out
                      </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <Link
                      href="/signin"
                      className="w-full"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <button className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 text-white text-sm font-medium px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-300 hover:opacity-80">
                        Sign in
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </section>
  );
};

export default Navbar;

"use client";
import {
  Navbar,
  NavBody,
  NavItems,
  NavbarLogo,
  NavbarButton,
  MobileNavMenu,
  MobileNavToggle,
} from "@/components/UI/ResizableNavbar";
import { useState, useEffect } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/clientSupabase";
import { useAuth } from "@/hooks/useAuth";

export function ResizableNavbar() {
  const pathname = usePathname();
  const { user: authUser, signOut: authSignOut } = useAuth();
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const user = authUser;
  const supabase = createClient();

  const navItems = [
    { name: "Home", link: "/" },
    { name: "Pricing", link: "/pricing" },
    { name: "Use Cases", link: "/use-cases" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isVisible } = useScrollDirection();

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserDropdown(false);
  }, [pathname]);

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Updated sign out logic
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    authSignOut();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed top-0 z-50 w-full py-3"
        >
          <Navbar>
            {/* Desktop Navigation */}
            <div className="hidden md:block w-full">
              <NavBody>
                <NavbarLogo />
                <NavItems items={navItems} />

                <div className="flex items-center space-x-3">
                  {user ? (
                    <div className="relative">
                      <button
                        onClick={toggleUserDropdown}
                        className="flex items-center focus:outline-none"
                      >
                        <div className="w-12 h-12 bg-gradient-to-b from-zinc-700 to-zinc-900 rounded-xl flex items-center justify-center text-white  font-semibold cursor-pointer text-lg">
                          {user.email
                            ? user.email.charAt(0).toUpperCase()
                            : "U"}
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
                            <div className="absolute -top-2 right-6 w-4 h-4 bg-zinc-900/90 border-t border-l border-zinc-700 rotate-45 z-10"></div>
                            <Link href="/dashboard">
                              <div className="block px-4 py-2 text-sm text-white cursor-pointer font-medium rounded transition">
                                Dashboard
                              </div>
                            </Link>
                            <button
                              onClick={() => {
                                handleSignOut();
                                setShowUserDropdown(false);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-500 cursor-pointer font-semibold rounded transition"
                            >
                              Sign out
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <NavbarButton variant="primary" href="/signin">
                        Sign in
                      </NavbarButton>
                    </div>
                  )}
                </div>
              </NavBody>
            </div>

            {/* Mobile Navigation */}
            <div className="flex w-full items-center justify-between px-2 py-2 md:hidden">
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
            <MobileNavMenu isOpen={isMobileMenuOpen}>
              {navItems.map((item, idx) => (
                <Link
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-600 dark:text-neutral-300 text-sm font-medium py-2"
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex w-full flex-col gap-4 mt-4">
                {user ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="block px-4 py-2 text-sm text-white cursor-pointer font-semibold rounded transition bg-zinc-900/90 border border-zinc-700">
                        Dashboard
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 cursor-pointer font-semibold rounded transition"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <NavbarButton
                    href="/signin"
                    variant="primary"
                    className="w-full"
                  >
                    Sign in
                  </NavbarButton>
                )}
              </div>
            </MobileNavMenu>
          </Navbar>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

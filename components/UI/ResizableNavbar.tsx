"use client";
import { cn } from "@/lib/utlis";
import { IconMenu2, IconX } from "@tabler/icons-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

import React, { useRef } from "react";

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}

interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface NavItemsProps {
  items: {
    name: string;
    link: string;
  }[];
  className?: string;
  onItemClick?: () => void;
}

// interface MobileNavProps {
//   children: React.ReactNode;
//   className?: string;
//   visible?: boolean;
// }

// interface MobileNavHeaderProps {
//   children: React.ReactNode;
//   className?: string;
// }

interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-4 bg-transparent z-40 w-full rounded-xl",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && typeof child.type !== "string") {
          return child;
        }
        return child;
      })}
    </motion.div>
  );
};

export const NavBody = ({ children, className }: NavBodyProps) => {
  return (
    <div
      className={cn(
        "relative z-[60] mx-auto hidden w-full max-w-4xl",
        "flex flex-row items-center justify-between gap-2 md:gap-4",
        "self-start rounded-xl px-2 py-2 bg-white lg:flex dark:bg-transparent",
        className
      )}
    >
      {children}
    </div>
  );
};

export const NavItems = ({ items, className }: NavItemsProps) => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <motion.div
      className={cn(
        "max-sm:hidden flex flex-row items-center justify-center",
        "space-x-1 md:space-x-2 text-sm font-medium p-1 md:p-2",
        "text-zinc-600 dark:text-neutral-300 bg-[#DBDBDB] dark:bg-neutral-900",
        "rounded-2xl transition duration-200 hover:text-zinc-800 dark:hover:text-white",
        className
      )}
    >
      {items.map((item, idx) => {
        const isActive = pathname === item.link;
        return (
          <div
            onClick={() => router.push(item.link)}
            className={cn(
              "relative px-3 py-2 md:px-4 md:py-3 cursor-pointer",
              "text-sm md:text-base",
              isActive
                ? "bg-white dark:bg-neutral-800 rounded-xl shadow-xl "
                : "dark:hover:bg-neutral-700/50"
            )}
            key={`link-${idx}`}
          >
            <span
              className={`relative z-20 font-inter-tight font-medium text-black dark:text-white :
              ${isActive ? "" : "opacity-60 hover:opacity-100"}
              `}
            >
              {item.name}
            </span>
          </div>
        );
      })}
    </motion.div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={cn(
            "fixed inset-0 top-16 z-50 flex w-full flex-col",
            "items-start justify-start gap-4 bg-white px-4 py-6",
            "shadow-xl dark:bg-neutral-950 md:hidden",
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
  return isOpen ? (
    <IconX
      className="text-black dark:text-white h-8 w-8 p-1.5"
      onClick={onClick}
    />
  ) : (
    <IconMenu2
      className="text-black dark:text-white h-8 w-8 p-1.5"
      onClick={onClick}
    />
  );
};

export const NavbarLogo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 px-2 py-1"
    >
      <Image
        src="/images/notesnap-logo3.png"
        alt="logo"
        width={35}
        height={35}
        className="rounded-md "
      />
      <span className="text-xl md:text-xl max-sm:hidden font-semibold text-black dark:text-white">
        Notesnap
      </span>
    </Link>
  );
};
export const NavbarButton = ({
  href,
  as: Tag = "a",
  children,
  className,
  variant = "primary",
  ...props
}: {
  href?: string;
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "dark" | "gradient";
} & (
  | React.ComponentPropsWithoutRef<"a">
  | React.ComponentPropsWithoutRef<"button">
)) => {
  const baseStyles =
    "px-8 py-4 rounded-lg bg-white button bg-gradient-to-b from-zinc-700 to-zinc-900 text-white text-md font-bold relative cursor-pointer hover:-translate-y-0.5 transition duration-200 inline-block text-center ";

  const variantStyles = {
    primary:
      "shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    secondary: "bg-transparent shadow-none dark:text-white",
    dark: "bg-black text-white shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]",
    gradient:
      "bg-gradient-to-b from-blue-500 to-blue-700 text-white shadow-[0px_2px_0px_0px_rgba(255,255,255,0.3)_inset]",
  };

  return (
    <Tag
      href={href || undefined}
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Tag>
  );
};

export const NavbarPlaceholder = () => {
  return <div style={{ height: "80px" }} />;
};

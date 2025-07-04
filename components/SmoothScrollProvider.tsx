"use client";
import React, { createContext, useContext, ReactNode } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

interface SmoothScrollContextType {
  lenis: ReturnType<typeof useSmoothScroll>;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

export const useSmoothScrollContext = () => {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error(
      "useSmoothScrollContext must be used within a SmoothScrollProvider"
    );
  }
  return context;
};

interface SmoothScrollProviderProps {
  children: ReactNode;
}

export const SmoothScrollProvider: React.FC<SmoothScrollProviderProps> = ({
  children,
}) => {
  const lenis = useSmoothScroll();

  return (
    <SmoothScrollContext.Provider value={{ lenis }}>
      {children}
    </SmoothScrollContext.Provider>
  );
};

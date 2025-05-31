import { useState, useEffect } from "react";

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [prevScrollY, setPrevScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine scroll direction
      if (currentScrollY > prevScrollY) {
        setScrollDirection("down");
        setIsVisible(false);
      } else {
        setScrollDirection("up");
        setIsVisible(true);
      }

      // Update previous scroll position
      setPrevScrollY(currentScrollY);
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollY]);

  return { scrollDirection, isVisible };
};

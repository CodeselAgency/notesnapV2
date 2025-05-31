"use client";

import { useAuth } from "@/hooks/useAuth"; // Adjust the import path as needed
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface Plan {
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  yearlyPrice?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "outline" | "default";
  popular: boolean;
  icon: React.ReactNode;
  productId: string | null;
  checkoutUrl: string;
  requiresAuth: boolean;
}

interface PricingButtonProps {
  plan: Plan;
  className: string;
}

export function PricingButton({ plan, className }: PricingButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    setIsLoading(true);
    // If plan doesn't require auth (like free plan), navigate directly
    try {
      if (!plan.requiresAuth) {
        router.push(plan.checkoutUrl);
        return;
      }

      // For paid plans, check if user is logged in
      if (user) {
        const queryParams = new URLSearchParams();
        queryParams.append("products", plan.productId);

        // Add customer email from logged in user
        if (user?.email) {
          queryParams.append("customerEmail", user.email);
        }

        // Add customer name if available
        if (user?.user_metadata?.full_name) {
          queryParams.append("customerName", user.user_metadata.full_name);
        }

        router.push(`/checkout?${queryParams.toString()}`);
      } else {
        // User is not logged in, redirect to signin page
        // You can optionally add a redirect parameter to bring them back after signin
        router.push(`/signin?redirect=${encodeURIComponent(plan.checkoutUrl)}`);
      }
    } catch (error) {
      console.error("Error in handleClick:", error);
    } finally {
      setTimeout(() => setIsLoading(false), 5000);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`${className} ${
        isLoading ? "opacity-75 cursor-not-allowed" : ""
      } flex items-center justify-center gap-2`}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {plan.buttonText}
    </button>
  );
}

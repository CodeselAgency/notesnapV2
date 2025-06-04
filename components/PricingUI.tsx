"use client";

import { Check, Star, Zap } from "lucide-react";
import Navbar from "@/components/Home/Navbar";
import { PricingButton } from "@/components/PricingButton";
import Footer from "@/components/Home/Footer";
import Link from "next/link";
interface ProductPrice {
  priceAmount: number;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  prices: ProductPrice[];
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant: "default";
  popular: boolean;
  icon: React.ReactNode | null;
  productId: string;
  checkoutUrl: string;
  requiresAuth: boolean;
}

interface PricingUIProps {
  products: {
    result: {
      items: ProductData[];
    };
  };
}

export function PricingUI({ products }: PricingUIProps) {
  // Helper function to format price from cents to dollars
  const formatPrice = (priceAmount: number) => {
    return (priceAmount / 100).toFixed(2);
  };

  // Helper function to get plan features based on product name
  const getPlanFeatures = (productName: string) => {
    const name = productName.toLowerCase();

    if (name.includes("weekly")) {
      return [
        "30 PDFs",
        "1000 messages",
        "Priority support",
        "Fast processing speed",
        "Advanced features",
      ];
    } else if (name.includes("monthly")) {
      return [
        "100 PDFs per month",
        "5000 messages",
        "Premium support",
        "Fastest processing speed",
        "All advanced features",
      ];
    } else {
      return [
        "Unlimited PDFs",
        "Unlimited messages",
        "Premium support",
        "Fastest processing speed",
        "All advanced features",
        "Priority customer success",
      ];
    }
  };

  // Helper function to get plan description
  const getPlanDescription = (productName: string) => {
    const name = productName.toLowerCase();

    if (name.includes("weekly")) {
      return "Perfect for short-term projects and quick scaling needs";
    } else if (name.includes("monthly")) {
      return "Most popular choice for growing businesses and teams";
    } else {
      return "Best value for established businesses with consistent needs";
    }
  };

  // Helper function to get plan icon
  const getPlanIcon = (productName: string) => {
    const name = productName.toLowerCase();
    return name.includes("monthly") ? <Star className="w-5 h-5" /> : <Zap className="w-5 h-5" />;
  };

  // Ensure we have products before mapping
  if (!products?.result?.items?.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Loading Plans...
            </h1>
          </div>
        </div>
      </div>
    );
  }

  const plans: PricingPlan[] = products.result.items.map((product) => {
    const price = product.prices[0];
    const isPopular = product.name.toLowerCase().includes("monthly");

    
    return {
      name: product.name,
      price: formatPrice(price?.priceAmount || 0),
      period: "month",
      description: product.description || getPlanDescription(product.name),
      features: getPlanFeatures(product.name),
      buttonText: `Choose ${product.name}`,
      buttonVariant: "default" as const,
      popular: isPopular,
      icon: getPlanIcon(product.name),
      productId: product.id,
      checkoutUrl: `/checkout?products=${product.id}`,
      requiresAuth: true,
    };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50">
      <Navbar />
      
      {/* Pricing Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Premium Plans for Premium Results
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan to unlock the full power of AI-driven document processing
          </p>
        </div>


        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl  border transition-all duration-300  ${
                plan.popular
                  ? "ring-4 ring-blue-100"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-32">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-3 py-2 rounded-full text-sm font-medium text-center shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                <div className="flex items-center gap-2 mb-4">
                  {plan.icon && (
                    <div className="p-2 bg-blue-100 rounded-lg">
                      {plan.icon}
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                </div>

                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="text-gray-500 ml-2">/{plan.name.toLowerCase()}</span>
                </div>

                <p className="text-gray-600 text-sm mb-8">{plan.description}</p>

                <div className="mb-8">
                  <div className="text-sm font-medium text-gray-900 mb-4">PREMIUM FEATURES</div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <PricingButton
                  plan={plan}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-r from-blue-400 to-blue-700 text-white  shadow-lg hover:shadow-xl"
                      : "bg-gradient-to-r from-zinc-700 to-zinc-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Any questions? Contact us!
          </p>
          <Link href="mailto:support@notesnap.app" className="bg-white text-gray-900 px-8 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-md hover:shadow-lg">
            Contact Us
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
} 
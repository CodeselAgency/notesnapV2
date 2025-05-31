import { api } from "@/lib/polar";
import { Check, Star, Zap } from "lucide-react";
import Link from "next/link";

export default async function Pricing() {
  const products = await api.products.list({ isArchived: false });

  // Helper function to format price from cents to dollars
  const formatPrice = (priceAmount: number) => {
    return (priceAmount / 100).toFixed(2);
  };

  // Helper function to get plan features based on product name
  const getPlanFeatures = (productName: string) => {
    const name = productName.toLowerCase();

    if (name.includes("weekly")) {
      return [
        "30 PDFs per month",
        "800 messages per month",
        "Priority support",
        "Fast processing speed",
        "Advanced features",
      ];
    } else if (name.includes("monthly")) {
      return [
        "100 PDFs per month",
        "2,000 messages per month",
        "Premium support",
        "Fastest processing speed",
        "All advanced features",
        "API access",
      ];
    } else if (name.includes("yearly")) {
      return [
        "100 PDFs per month",
        "2,000 messages per month",
        "Premium support",
        "Fastest processing speed",
        "All advanced features",
        "API access",
        "Priority customer success",
      ];
    }

    return ["Basic features"];
  };

  // Helper function to get plan description
  const getPlanDescription = (productName: string) => {
    const name = productName.toLowerCase();

    if (name.includes("weekly")) {
      return "Great for short-term projects";
    } else if (name.includes("monthly")) {
      return "Most popular choice for regular users";
    } else if (name.includes("yearly")) {
      return "Best value - save money with annual billing";
    }

    return "Perfect for your needs";
  };

  // Helper function to get plan icon
  const getPlanIcon = (productName: string) => {
    const name = productName.toLowerCase();

    if (name.includes("weekly")) {
      return <Zap className="w-5 h-5" />;
    } else if (name.includes("monthly") || name.includes("yearly")) {
      return <Star className="w-5 h-5" />;
    }

    return null;
  };

  // Create plans array from fetched products
  const freePlan = {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for trying out our service",
    features: [
      "3 PDFs per month",
      "100 messages per month",
      "Basic support",
      "Standard processing speed",
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
    popular: false,
    icon: null,
    productId: null,
    checkoutUrl: "/get-started", // Custom route for free plan
  };

  const plans = [
    freePlan,
    ...products.result.items.map((product) => {
      const price = product.prices[0];
      const isPopular = product.name.toLowerCase().includes("monthly");
      const isYearly = product.name.toLowerCase().includes("yearly");

      return {
        name: product.name,
        price: formatPrice(price.priceAmount),
        period: isYearly
          ? "month"
          : product.name.toLowerCase().includes("weekly")
          ? "week"
          : "month",
        originalPrice: isYearly ? "14.99" : undefined,
        yearlyPrice: isYearly
          ? ((price.priceAmount / 100) * 12).toFixed(2)
          : undefined,
        description: product.description || getPlanDescription(product.name),
        features: getPlanFeatures(product.name),
        buttonText: `Choose ${product.name}`,
        buttonVariant: "default" as const,
        popular: isPopular,
        icon: getPlanIcon(product.name),
        productId: product.id,
        checkoutUrl: `/checkout?products=${product.id}`,
      };
    }),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Perfect Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unlock the power of AI-driven document processing with flexible
            pricing that scales with your needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative bg-white rounded-2xl shadow-xl border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular
                  ? "border-blue-500 ring-4 ring-blue-100"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-3">
                    {plan.icon && (
                      <div className="p-2 bg-blue-100 rounded-lg mr-2">
                        {plan.icon}
                      </div>
                    )}
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                      </span>
                      <span className="text-gray-500 ml-1">/{plan.period}</span>
                    </div>

                    {plan.originalPrice && (
                      <div className="flex items-center justify-center mt-2">
                        <span className="text-lg text-gray-400 line-through mr-2">
                          ${plan.originalPrice}/month
                        </span>
                        <span className="text-sm text-green-600 font-semibold">
                          Save Money
                        </span>
                      </div>
                    )}

                    {plan.yearlyPrice && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed annually (${plan.yearlyPrice}/year)
                      </div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                {/* Features */}
                <div className="mb-8">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <Link href={plan.checkoutUrl}>
                  <button
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      plan.buttonVariant === "outline"
                        ? "border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50"
                        : plan.popular
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl"
                        : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

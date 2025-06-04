import { api } from "@/lib/polar";
import { PricingUI } from "@/components/PricingUI";

// Server Component
export default async function PricingPage() {
  const productsResponse = await api.products.list({ isArchived: false });
  
  // Transform the data into the expected structure
  const products = {
    result: {
      items: productsResponse.result.items.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description,
        prices: product.prices
      }))
    }
  };

  return <PricingUI products={products} />;
}

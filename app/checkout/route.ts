// checkout/route.ts
import { Checkout } from "@polar-sh/nextjs";

export const GET = Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: "https://www.notesnap.app/checkout/success",
    server: "production",
    // Use sandbox if you're testing Polar - omit the parameter or pass 'production' otherwise
});
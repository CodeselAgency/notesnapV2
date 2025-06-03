// api/webhook/polar/route.ts
import { Webhooks } from "@polar-sh/nextjs";
import { supabaseAdmin } from "@/lib/supabase";
// Helper function to determine subscription tier from product name or amount
function determineSubscriptionTier(productName: string, amount: number): 'premium' | 'pro' {
    // Adjust this logic based on your pricing structure
    if (amount >= 2999) return 'pro'; // $29.99 or higher
    return 'premium'; // Default to premium for lower amounts
}

// Helper function to find user by customer email
async function findUserByEmail(email: string) {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    if (error) throw error;

    return data.users.find(user => user.email === email);
}

export const POST = Webhooks({
    webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,

    onOrderPaid: async (payload) => {
        try {
            const order = payload.data;

            // Only handle weekly purchases (one-time payments)
            // Check if it's a weekly product by name or if it's non-recurring
            const isWeeklyProduct = order.product?.name?.toLowerCase().includes('weekly') ||
                (order.product?.is_recurring === false && order.product?.name?.toLowerCase().includes('weekly'));

            if (!isWeeklyProduct) {
                console.log('Skipping non-weekly order:', order.id);
                return;
            }

            // Find user by customer email
            const user = await findUserByEmail(order.customer.email);
            if (!user) {
                console.error('User not found for email:', order.customer.email);
                return;
            }

            const subscriptionTier = determineSubscriptionTier(
                order.product.name,
                order.amount
            );

            // Insert into payments table
            const { error: paymentError } = await supabaseAdmin
                .from('payments')
                .insert({
                    user_id: user.id,
                    polar_payment_id: order.id,
                    polar_customer_id: order.customer_id,
                    polar_checkout_id: order.checkout_id,
                    amount: order.amount / 100, // Convert cents to dollars
                    currency: order.currency.toUpperCase(),
                    subscription_tier: subscriptionTier,
                    billing_cycle: 'weekly',
                    status: 'completed',
                    subscription_start_date: new Date().toISOString(),
                    subscription_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
                    webhook_received_at: new Date().toISOString(),
                    webhook_data: payload
                });

            if (paymentError) {
                console.error('Error inserting payment:', paymentError);
                throw paymentError;
            }

            // Update only subscription tier and status in profiles table
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_tier: subscriptionTier,
                    subscription_status: 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                throw profileError;
            }

            console.log('Successfully processed weekly order.paid for user:', user.id);
        } catch (error) {
            console.error('Error processing weekly order.paid:', error);
            throw error;
        }
    },

    onSubscriptionCreated: async (payload) => {
        try {
            const subscription = payload.data;

            // Only handle monthly and yearly subscriptions
            if (!['month', 'year'].includes(subscription.recurringInterval)) {
                console.log('Skipping non-monthly/yearly subscription:', subscription.id);
                return;
            }

            // Find user by customer email
            const user = await findUserByEmail(subscription.customer.email);
            if (!user) {
                console.error('User not found for email:', subscription.customer.email);
                return;
            }

            const subscriptionTier = determineSubscriptionTier(
                subscription.product.name,
                subscription.amount
            );
            const billingCycle = subscription.recurring_interval === 'month' ? 'monthly' : 'yearly';

            // Insert into payments table
            const { error: paymentError } = await supabaseAdmin
                .from('payments')
                .insert({
                    user_id: user.id,
                    polar_subscription_id: subscription.id,
                    polar_customer_id: subscription.customer_id,
                    polar_checkout_id: subscription.checkout_id,
                    amount: subscription.amount / 100, // Convert cents to dollars
                    currency: subscription.currency.toUpperCase(),
                    subscription_tier: subscriptionTier,
                    billing_cycle: billingCycle,
                    status: 'completed',
                    subscription_start_date: subscription.started_at,
                    subscription_end_date: subscription.current_period_end,
                    webhook_received_at: new Date().toISOString(),
                    webhook_data: payload
                });

            if (paymentError) {
                console.error('Error inserting payment:', paymentError);
                throw paymentError;
            }

            // Update only subscription tier and status in profiles table
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_tier: subscriptionTier,
                    subscription_status: 'active',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                throw profileError;
            }

            console.log('Successfully processed subscription.created for user:', user.id);
        } catch (error) {
            console.error('Error processing subscription.created:', error);
            throw error;
        }
    },

    onSubscriptionCanceled: async (payload) => {
        try {
            const subscription = payload.data;

            // Find user by customer email
            const user = await findUserByEmail(subscription.customer.email);
            if (!user) {
                console.error('User not found for email:', subscription.customer.email);
                return;
            }

            // Update payment status to cancelled
            const { error: paymentError } = await supabaseAdmin
                .from('payments')
                .update({
                    status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('polar_subscription_id', subscription.id);

            if (paymentError) {
                console.error('Error updating payment:', paymentError);
                throw paymentError;
            }

            // Update only subscription tier and status in profiles table
            const { error: profileError } = await supabaseAdmin
                .from('profiles')
                .update({
                    subscription_tier: 'free',
                    subscription_status: 'cancelled',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Error updating profile:', profileError);
                throw profileError;
            }

            console.log('Successfully processed subscription.canceled for user:', user.id);
        } catch (error) {
            console.error('Error processing subscription.canceled:', error);
            throw error;
        }
    }
});
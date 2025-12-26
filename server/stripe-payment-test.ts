/**
 * Manual test script to verify Stripe payment plan creation
 * Run with: tsx server/stripe-payment-test.ts
 */

import "dotenv/config";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

async function testStripeConnection() {
  console.log("Testing Stripe connection...");
  console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY?.substring(0, 20) + "...");
  
  try {
    // Test 1: List customers (should work even with no customers)
    const customers = await stripe.customers.list({ limit: 1 });
    console.log("✅ Stripe API connection successful");
    console.log(`Found ${customers.data.length} customer(s)`);
    
    // Test 2: Create a test customer
    const testCustomer = await stripe.customers.create({
      email: "test@example.com",
      name: "Test User",
      metadata: {
        test: "true",
      },
    });
    console.log("✅ Test customer created:", testCustomer.id);
    
    // Test 3: Create a product first
    const product = await stripe.products.create({
      name: 'Test Payment Plan',
      metadata: { test: 'true' },
    });
    console.log("✅ Test product created:", product.id);
    
    // Test 4: Create a subscription with payment intent
    const subscription = await stripe.subscriptions.create({
      customer: testCustomer.id,
      items: [{
        price_data: {
          currency: 'usd',
          product: product.id,
          unit_amount: 4983, // $49.83
          recurring: {
            interval: 'month',
            interval_count: 1,
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        test: 'true',
      },
    });
    
    console.log("✅ Test subscription created:", subscription.id);
    
    // Get the client secret from the payment intent
    const invoice = subscription.latest_invoice as any;
    const paymentIntent = invoice.payment_intent as any;
    console.log("✅ Payment intent client secret:", paymentIntent?.client_secret?.substring(0, 30) + "...");
    
    // Cleanup: Delete test subscription, customer, and product
    await stripe.subscriptions.cancel(subscription.id);
    await stripe.customers.del(testCustomer.id);
    await stripe.products.del(product.id);
    console.log("✅ Test resources cleaned up");
    
    console.log("\n🎉 All Stripe tests passed! Payment plan creation is working correctly.");
    
  } catch (error: any) {
    console.error("❌ Stripe test failed:", error.message);
    if (error.type) {
      console.error("Error type:", error.type);
    }
    if (error.code) {
      console.error("Error code:", error.code);
    }
    process.exit(1);
  }
}

testStripeConnection();
